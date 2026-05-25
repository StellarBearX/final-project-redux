import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage';
import FlightsPage from './features/flights/FlightsPage';
import FlightDetailPage from './pages/FlightDetailPage';
import FleetPage from './features/fleet/FleetPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      {/* Shared Navigation Header */}
      <Navbar />

      {/* Main Core Router routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/flights" element={<FlightsPage />} />
        <Route path="/flights/:id" element={<FlightDetailPage />} />
        <Route path="/fleet" element={<FleetPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
