import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { MorandiColor, DayEntry } from "../types";
import { putEntry } from "../data/db";
import { getTodayKey } from "../utils/date";
import { generateGridImage, downloadDataUrl } from "../components/GridExporter";
import styles from "../styles/ReviewPage.module.css";

export default function ReviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    color: MorandiColor;
    photos: string[];
    photoOrders: number[];
  };

  const [saving, setSaving] = useState(false);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);

  if (!state?.color) {
    navigate("/");
    return null;
  }

  const { color, photos, photoOrders } = state;

  // 构建 9 个格子的数据
  const slots: (string | null)[] = Array.from({ length: 9 }, (_, i) => {
    const idx = photoOrders.indexOf(i);
    return idx >= 0 ? photos[idx] : null;
  });

  const handleCellClick = (index: number) => {
    if (selectedCell === null) {
      // 第一次点击：选中格子
      if (slots[index] !== null) {
        setSelectedCell(index);
      }
    } else if (selectedCell === index) {
      // 再次点击同一个：取消选中
      setSelectedCell(null);
    } else {
      // 点击不同格子：交换
      [slots[selectedCell], slots[index]] = [slots[index], slots[selectedCell]];
      const newPhotoOrders: number[] = [];
      const newPhotosList: string[] = [];
      slots.forEach((s, i) => {
        if (s !== null) {
          newPhotoOrders.push(i);
          newPhotosList.push(s);
        }
      });
      navigate("/review", {
        replace: true,
        state: {
          color,
          photos: newPhotosList,
          photoOrders: newPhotoOrders,
        },
      });
      setSelectedCell(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const gridImage = await generateGridImage(slots, color);
      const todayKey = getTodayKey();

      const entry: DayEntry = {
        dateKey: todayKey,
        colorId: color.id,
        colorName: color.name,
        colorHex: color.hex,
        photos: photos.map((dataUrl, idx) => ({
          id: `p-${todayKey}-${idx}`,
          dataUrl,
          order: photoOrders[idx],
        })),
        gridImage,
        createdAt: Date.now(),
      };

      await putEntry(entry);

      // 也下载一份到手机
      downloadDataUrl(gridImage, `colorwalk-${todayKey}.jpg`);

      navigate("/calendar");
    } catch (err) {
      alert("保存失败，请重试");
    } finally {
      setSaving(false);
    }
  };

  const handleRetake = (index: number) => {
    // 返回相机页重拍 — 简化：删除该格子的照片
    const newPhotos = photos.filter((_, i) => photoOrders[i] !== index);
    const newOrders = photoOrders.filter((o) => o !== index);
    navigate("/camera", {
      state: { color, existingPhotos: newPhotos, existingOrders: newOrders },
    });
  };

  return (
    <div className="page">
      <h1 className="page-title">预览</h1>
      <p className="page-subtitle">
        点击两个格子可以交换位置，确认后保存
      </p>

      <div className={styles.container}>
        <div className={styles.previewGrid}>
          {slots.map((dataUrl, index) => (
            <button
              key={index}
              className={`${styles.previewCell} ${
                !dataUrl ? styles.previewCellEmpty : ""
              } ${
                selectedCell === index ? styles.previewCellSelected : ""
              }`}
              onClick={() =>
                dataUrl ? handleCellClick(index) : handleRetake(index)
              }
              aria-label={dataUrl ? `照片 ${index + 1}` : `空格 ${index + 1}`}
            >
              {dataUrl && <img src={dataUrl} alt={`照片 ${index + 1}`} />}
            </button>
          ))}
        </div>

        <p className={styles.swapHint}>
          {selectedCell !== null
            ? `已选中第 ${selectedCell + 1} 格，点击另一格交换`
            : "点击选中格子可交换位置 · 点击空格可返回重拍"}
        </p>

        <div className={styles.actions}>
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "保存中…" : "封存今日的色彩奇遇"}
          </button>
          <button
            className={styles.btnSecondary}
            onClick={() =>
              navigate("/camera", {
                state: { color, existingPhotos: photos, existingOrders: photoOrders },
              })
            }
          >
            返回继续拍照
          </button>
        </div>
      </div>
    </div>
  );
}
