// Canvas 图片处理工具

// 将图片缩放到 maxDim 以内，返回 dataURL
export function resizeImage(file: File, maxDim: number = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width <= maxDim && height <= maxDim) {
          resolve(reader.result as string);
          return;
        }
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// 将 9 张照片合成 3×3 九宫格，返回 dataURL
export function composeGridImage(
  photoDataUrls: (string | null)[],
  bgColor: string,
  outputSize: number = 1200
): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext("2d")!;

    const cellSize = Math.floor(outputSize / 3);
    const gap = Math.floor(outputSize * 0.005); // ~6px on 1200px
    const innerCellSize = cellSize - gap * 2;

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, outputSize, outputSize);

    let loaded = 0;
    const total = photoDataUrls.filter((url) => url !== null).length;

    if (total === 0) {
      resolve(canvas.toDataURL("image/jpeg", 0.9));
      return;
    }

    photoDataUrls.forEach((dataUrl, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      const x = col * cellSize + gap;
      const y = row * cellSize + gap;

      if (!dataUrl) {
        // 空格子：稍微浅一点的颜色
        ctx.fillStyle = lightenColor(bgColor, 0.15);
        ctx.fillRect(x, y, innerCellSize, innerCellSize);
        loaded++;
        if (loaded === 9) {
          resolve(canvas.toDataURL("image/jpeg", 0.9));
        }
        return;
      }

      const img = new Image();
      img.onload = () => {
        // Cover fit: 居中裁剪
        const scale = Math.max(
          innerCellSize / img.width,
          innerCellSize / img.height
        );
        const sw = innerCellSize / scale;
        const sh = innerCellSize / scale;
        const sx = (img.width - sw) / 2;
        const sy = (img.height - sh) / 2;

        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, innerCellSize, innerCellSize);
        ctx.clip();
        ctx.drawImage(
          img,
          sx,
          sy,
          sw,
          sh,
          x,
          y,
          innerCellSize,
          innerCellSize
        );
        ctx.restore();

        loaded++;
        if (loaded === 9) {
          resolve(canvas.toDataURL("image/jpeg", 0.9));
        }
      };
      img.onerror = () => {
        loaded++;
        if (loaded === 9) {
          resolve(canvas.toDataURL("image/jpeg", 0.9));
        }
      };
      img.src = dataUrl;
    });
  });
}

// 将 hex 颜色变亮
function lightenColor(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lr = Math.min(255, Math.round(r + (255 - r) * amount));
  const lg = Math.min(255, Math.round(g + (255 - g) * amount));
  const lb = Math.min(255, Math.round(b + (255 - b) * amount));
  return `rgb(${lr},${lg},${lb})`;
}
