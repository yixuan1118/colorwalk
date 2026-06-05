import { useParams, useNavigate } from "react-router-dom";
import { useDayEntry } from "../hooks/useHistory";
import { formatDateCN } from "../utils/date";
import { downloadDataUrl } from "../components/GridExporter";

export default function DayDetailPage() {
  const { dateKey } = useParams<{ dateKey: string }>();
  const navigate = useNavigate();
  const { entry, loading } = useDayEntry(dateKey ?? null);

  if (loading) {
    return (
      <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#b5b0ae" }}>加载中…</p>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="page" style={{ textAlign: "center", paddingTop: "40vh" }}>
        <p style={{ color: "#9a9593", marginBottom: 20 }}>该日期没有记录</p>
        <button className="btn-primary" onClick={() => navigate("/calendar")}>
          返回日历
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => navigate("/calendar")}
          style={{
            background: "none",
            border: "none",
            fontSize: "1rem",
            color: "#9a9593",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          ‹ 返回日历
        </button>
      </div>

      <h1 className="page-title">{formatDateCN(entry.dateKey)}</h1>

      {/* 颜色信息 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
          padding: "12px 16px",
          background: "#fff",
          borderRadius: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            backgroundColor: entry.colorHex,
            flexShrink: 0,
          }}
        />
        <div>
          <div style={{ fontWeight: 600 }}>{entry.colorName}</div>
          <div style={{ fontSize: "0.8rem", color: "#9a9593" }}>
            {entry.colorHex}
          </div>
        </div>
      </div>

      {/* 九宫格图片 */}
      {entry.gridImage && (
        <div style={{ marginBottom: 24 }}>
          <img
            src={entry.gridImage}
            alt={`${entry.dateKey} 九宫格`}
            style={{
              width: "100%",
              borderRadius: 16,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          />
        </div>
      )}

      {/* 单独照片 */}
      {entry.photos.length > 0 && !entry.gridImage && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 4,
            marginBottom: 24,
          }}
        >
          {entry.photos
            .sort((a, b) => a.order - b.order)
            .map((photo) => (
              <img
                key={photo.id}
                src={photo.dataUrl}
                alt={`照片 ${photo.order + 1}`}
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            ))}
        </div>
      )}

      {/* 下载按钮 */}
      {entry.gridImage && (
        <button
          className="btn-primary"
          style={{
            background: "transparent",
            color: "#4a4543",
            border: "1px solid #e8e4e0",
            fontWeight: 500,
          }}
          onClick={() =>
            downloadDataUrl(entry.gridImage, `colorwalk-${entry.dateKey}.jpg`)
          }
        >
          下载九宫格图片
        </button>
      )}
    </div>
  );
}
