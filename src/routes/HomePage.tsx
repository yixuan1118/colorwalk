import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { MorandiColor } from "../types";
import { useColorOfDay } from "../hooks/useColorOfDay";
import ColorPalette from "../components/ColorPalette";
import styles from "../styles/HomePage.module.css";

export default function HomePage() {
  const navigate = useNavigate();
  const { todayEntry, loading, hasTodayEntry } = useColorOfDay();
  const [selectedColor, setSelectedColor] = useState<MorandiColor | null>(null);

  // 如果今天已经记录过，从 entry 中恢复选中颜色展示
  useEffect(() => {
    if (todayEntry) {
      setSelectedColor({
        id: todayEntry.colorId,
        name: todayEntry.colorName,
        hex: todayEntry.colorHex,
      });
    }
  }, [todayEntry]);

  const handleStart = () => {
    if (!selectedColor) return;
    navigate("/camera", {
      state: { color: selectedColor },
    });
  };

  if (loading) {
    return (
      <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#b5b0ae" }}>加载中…</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">Color Walk</h1>
      <p className="page-subtitle">今天，你想记录什么颜色？</p>

      <ColorPalette
        selectedColor={selectedColor}
        onSelect={setSelectedColor}
      />

      {/* 选中颜色卡片 */}
      {selectedColor ? (
        <div
          className={styles.selectedCard}
          style={{ backgroundColor: selectedColor.hex }}
        >
          <div className={styles.selectedCardName}>{selectedColor.name}</div>
          <div className={styles.selectedCardQuote}>
            原来平凡日子里也可以五彩斑斓
          </div>
        </div>
      ) : (
        <div
          className={`${styles.selectedCard} ${styles.selectedCardPlaceholder}`}
        >
          点击上方色板，选择今天的颜色
        </div>
      )}

      {/* 按钮 */}
      {hasTodayEntry ? (
        <>
          <button
            className="btn-primary"
            style={{ marginBottom: 12 }}
            onClick={() => navigate("/camera", { state: { color: selectedColor } })}
          >
            查看今日记录
          </button>
          <button
            className="btn-primary"
            style={{
              background: "transparent",
              color: "#4a4543",
              border: "1px solid #e8e4e0",
              fontWeight: 500,
              letterSpacing: 0,
            }}
            onClick={() => navigate("/calendar")}
          >
            浏览历史记录
          </button>
        </>
      ) : (
        <button
          className="btn-primary"
          disabled={!selectedColor}
          onClick={handleStart}
        >
          开始今天的寻色
        </button>
      )}
    </div>
  );
}
