import { useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { MorandiColor } from "../types";
import { usePhotos } from "../hooks/usePhotos";
import { resizeImage } from "../utils/canvas";
import styles from "../styles/CameraPage.module.css";

export default function CameraPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const color = (location.state as { color?: MorandiColor })?.color;
  const { photos, photoCount, addPhoto, removePhoto, reset } = usePhotos(9);
  const [activeSlot, setActiveSlot] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressedRef = useRef(false);

  const triggerCamera = useCallback((index: number) => {
    setActiveSlot(index);
    inputRef.current?.click();
  }, []);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await resizeImage(file, 800);
      addPhoto(dataUrl, activeSlot);
    } catch {
      // ignore
    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handlePointerDown = (index: number, hasPhoto: boolean) => {
    if (!hasPhoto) return;
    longPressedRef.current = false;
    longPressRef.current = setTimeout(() => {
      longPressedRef.current = true;
      removePhoto(index);
    }, 600);
  };

  const handlePointerUp = () => {
    if (longPressRef.current) {
      clearTimeout(longPressRef.current);
      longPressRef.current = null;
    }
  };

  const handleClick = (index: number) => {
    // 长按后不触发点击
    if (longPressedRef.current) {
      longPressedRef.current = false;
      return;
    }
    triggerCamera(index);
  };

  const handleDone = () => {
    if (photoCount === 0) return;
    navigate("/review", {
      state: {
        color,
        photos: photos.map((p) => p.dataUrl),
        photoOrders: photos.map((p) => p.order),
      },
    });
  };

  if (!color) {
    return (
      <div className="page" style={{ textAlign: "center", paddingTop: "40vh" }}>
        <p style={{ color: "#9a9593", marginBottom: 20 }}>
          🎨 请先选择今天的颜色吧~
        </p>
        <button className="btn-primary" onClick={() => navigate("/")}>
          返回首页
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      {/* 隐藏相机 input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
      />

      <h1 className="page-title">
        寻找 <strong style={{ color: color.hex }}>{color.name}</strong> · {photoCount}/9
      </h1>

      <div className={styles.container}>
        <p className={styles.hint}>点击格子拍照 · 长按已拍格子删除</p>

        <div className={styles.grid}>
          {Array.from({ length: 9 }, (_, index) => {
            const photo = photos.find((p) => p.order === index);
            const hasPhoto = !!photo;
            return (
              <button
                key={index}
                className={`${styles.slot} ${
                  hasPhoto ? styles.slotFilled : styles.slotEmpty
                }`}
                onClick={() => handleClick(index)}
                onPointerDown={() => handlePointerDown(index, hasPhoto)}
                onPointerUp={() => handlePointerUp()}
                onPointerLeave={() => {
                  if (longPressRef.current) {
                    clearTimeout(longPressRef.current);
                    longPressRef.current = null;
                  }
                }}
                onContextMenu={(e) => e.preventDefault()}
                aria-label={hasPhoto ? `照片 ${index + 1}，长按删除` : `第 ${index + 1} 格，点击拍照`}
              >
                {hasPhoto ? (
                  <>
                    <img src={photo!.dataUrl} alt={`照片 ${index + 1}`} />
                    <span className={styles.slotNumber}>{index + 1}</span>
                  </>
                ) : (
                  <span style={{ fontSize: "2rem", color: "#c5c0b0", fontWeight: 300 }}>+</span>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 4 }}>
          {photoCount > 0 && (
            <button
              style={{
                padding: "10px 18px",
                borderRadius: 12,
                background: "transparent",
                color: "#9a9593",
                fontSize: "0.85rem",
                border: "1px solid #e8e4e0",
              }}
              onClick={() => reset()}
            >
              清空重拍
            </button>
          )}
        </div>

        <div style={{ marginTop: 32, width: "100%" }}>
          <button
            className="btn-primary"
            disabled={photoCount === 0}
            onClick={handleDone}
          >
            封存今日的色彩奇遇
          </button>
        </div>
      </div>
    </div>
  );
}
