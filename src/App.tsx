import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./routes/HomePage";
import CameraPage from "./routes/CameraPage";
import ReviewPage from "./routes/ReviewPage";
import CalendarPage from "./routes/CalendarPage";
import DayDetailPage from "./routes/DayDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/camera" element={<CameraPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/day/:dateKey" element={<DayDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
