import { useNavigate } from "react-router-dom";
import { useHistory } from "../hooks/useHistory";
import CalendarHeatmap from "../components/CalendarHeatmap";
import styles from "../styles/CalendarPage.module.css";

export default function CalendarPage() {
  const navigate = useNavigate();
  const { entries, loading } = useHistory();

  const handleDayClick = (dateKey: string) => {
    navigate(`/day/${dateKey}`);
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
      <h1 className="page-title" style={{ textAlign: "center" }}>color walk</h1>
      <p className="page-subtitle" style={{ textAlign: "center" }}>走着走着，生活就有了颜色</p>

      <div className={styles.container}>
        <CalendarHeatmap entries={entries} onDayClick={handleDayClick} />

        {entries.length === 0 && (
          <p className={styles.emptyHint}>
            📭 还没有记录
            <br />
            快去首页选择颜色，开始第一次寻色吧！
          </p>
        )}

        {entries.length > 0 && (
          <p
            style={{
              textAlign: "center",
              color: "#9a9593",
              fontSize: "0.8rem",
              marginTop: 20,
            }}
          >
            共 {entries.length} 条记录
          </p>
        )}
      </div>
    </div>
  );
}
