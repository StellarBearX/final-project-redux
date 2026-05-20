import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/ui/DashboardLayout';
import HomePage from './pages/HomePage';
import FlightsPage from './pages/FlightsPage';
import FlightDetailsPage from './pages/FlightDetailsPage';
import FleetPage from './pages/FleetPage';
import NotFoundPage from './pages/NotFoundPage';
import FlightForm from './features/flights/FlightForm';
import styles from './App.module.css';

function App() {
  return (
    <BrowserRouter>
      {/* Global background — fixed behind every route */}
      <div className={styles.bg} aria-hidden="true" />
      <div className={styles.bgOverlay} aria-hidden="true" />

      <Routes>
        {/* ── Public — full-screen, no sidebar ── */}
        <Route path="/" element={<HomePage />} />

        {/* ── Dashboard — sidebar shell ── */}
        <Route element={<DashboardLayout />}>
          <Route path="/flights" element={<FlightsPage />} />
          <Route path="/flights/new" element={<FlightForm mode="add" />} />
          <Route path="/flights/:id/edit" element={<FlightForm mode="edit" />} />
          <Route path="/flights/:id" element={<FlightDetailsPage />} />
          <Route path="/fleet" element={<FleetPage />} />
        </Route>

        {/* ── 404 ── */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
