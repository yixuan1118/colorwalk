import { useLocation, useNavigate } from "react-router-dom";

const TABS = [
  { path: "/", label: "寻色", icon: "🎨" },
  { path: "/camera", label: "今日", icon: "📷" },
  { path: "/calendar", label: "记录", icon: "📅" },
];

const navStyles: Record<string, React.CSSProperties> = {
  nav: {
    position: "fixed",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100%",
    maxWidth: 480,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderTop: "1px solid #e8e4e0",
    paddingBottom: "env(safe-area-inset-bottom, 8px)",
    zIndex: 100,
    height: 64,
  },
  tab: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: 4,
    padding: "8px 16px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "0.7rem",
    fontWeight: 500,
    color: "#9a9593",
    transition: "color 0.2s",
    WebkitTapHighlightColor: "transparent",
  },
  tabActive: {
    color: "#4a4543",
    fontWeight: 600,
  },
  icon: {
    fontSize: "1.4rem",
  },
};

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav style={navStyles.nav}>
      {TABS.map((tab) => {
        const isActive =
          tab.path === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(tab.path);
        return (
          <button
            key={tab.path}
            style={{
              ...navStyles.tab,
              ...(isActive ? navStyles.tabActive : {}),
            }}
            onClick={() => navigate(tab.path)}
          >
            <span style={navStyles.icon}>{tab.icon}</span>
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
