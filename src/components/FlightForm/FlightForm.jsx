import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addFlight, updateFlight } from '../../features/flights/flightsSlice';
import styles from './FlightForm.module.css';

// Popular international hubs for easy dropdown selection
const AIRPORTS = [
  { code: 'BKK', name: 'Bangkok Suvarnabhumi' },
  { code: 'SIN', name: 'Singapore Changi' },
  { code: 'LHR', name: 'London Heathrow' },
  { code: 'NRT', name: 'Tokyo Narita' },
  { code: 'DXB', name: 'Dubai International' },
  { code: 'CDG', name: 'Paris Charles de Gaulle' },
  { code: 'HKG', name: 'Hong Kong International' },
  { code: 'LAX', name: 'Los Angeles International' },
  { code: 'KUL', name: 'Kuala Lumpur International' },
  { code: 'MNL', name: 'Manila Ninoy Aquino' }
];

// Standard Gate Allocations
const GATES = ['A01', 'A08', 'A12', 'B04', 'B06', 'B11', 'C03', 'C07', 'D02', 'D09'];

const FlightForm = ({ initialData = null, onClose }) => {
  const dispatch = useDispatch();
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState({
    flightNumber: '',
    origin: 'BKK',
    destination: 'SIN',
    departure: '08:00',
    arrival: '12:00',
    gate: 'A01',
    status: 'ON_TIME',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        flightNumber: initialData.flightNumber || '',
        origin: initialData.origin || 'BKK',
        destination: initialData.destination || 'SIN',
        departure: initialData.departure || '08:00',
        arrival: initialData.arrival || '12:00',
        gate: initialData.gate || 'A01',
        status: initialData.status || 'ON_TIME',
      });
    } else {
      // Auto-generate a random flight code on mount for seamless experience
      setFormData({
        flightNumber: `NM${Math.floor(100 + Math.random() * 899)}`,
        origin: 'BKK',
        destination: 'SIN',
        departure: '08:00',
        arrival: '12:00',
        gate: 'A01',
        status: 'ON_TIME',
      });
    }
    setErrors({});
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'origin' || name === 'destination' ? value.toUpperCase() : value,
    }));
    // Clear error for that field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Instant code generator helper
  const handleRandomizeCode = () => {
    setFormData((prev) => ({
      ...prev,
      flightNumber: `NM${Math.floor(100 + Math.random() * 899)}`
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.flightNumber?.trim()) {
      newErrors.flightNumber = 'Flight number is required.';
    }

    if (formData.origin === formData.destination) {
      newErrors.destination = 'Destination cannot match the origin airport.';
    }

    if (!formData.departure) {
      newErrors.departure = 'Departure time is required.';
    }

    if (!formData.arrival) {
      newErrors.arrival = 'Arrival time is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isEditMode) {
      dispatch(updateFlight({ id: initialData.id, flightData: formData }));
    } else {
      dispatch(addFlight(formData));
    }
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modalCard}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            {isEditMode ? 'Modify Aero Flight Settings' : 'Schedule New Aero Flight'}
          </h3>
          <button onClick={onClose} className={styles.closeBtn}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Flight Number (Auto-populated with optional randomize trigger) */}
          <div className={styles.field}>
            <label className={styles.label}>Flight Number</label>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="flightNumber"
                placeholder="e.g. NM808"
                value={formData.flightNumber}
                onChange={handleChange}
                className={`${styles.input} ${styles.inputMono}`}
              />
              <button 
                type="button" 
                onClick={handleRandomizeCode} 
                className={styles.randomBtn}
                title="Generate Random Flight Number"
              >
                🎲 Auto Gen
              </button>
            </div>
            {errors.flightNumber && <span className={styles.errorText}>{errors.flightNumber}</span>}
          </div>

          {/* Route (Origin & Destination select options) */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Origin Airport</label>
              <select
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                className={styles.select}
              >
                {AIRPORTS.map((apt) => (
                  <option key={`orig-${apt.code}`} value={apt.code}>
                    {apt.code} - {apt.name}
                  </option>
                ))}
              </select>
              {errors.origin && <span className={styles.errorText}>{errors.origin}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Destination Airport</label>
              <select
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                className={styles.select}
              >
                {AIRPORTS.map((apt) => (
                  <option key={`dest-${apt.code}`} value={apt.code}>
                    {apt.code} - {apt.name}
                  </option>
                ))}
              </select>
              {errors.destination && <span className={styles.errorText}>{errors.destination}</span>}
            </div>
          </div>

          {/* Times (Native Time Pickers for amazing UX) */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Departure Time</label>
              <input
                type="time"
                name="departure"
                value={formData.departure}
                onChange={handleChange}
                className={`${styles.input} ${styles.inputMono}`}
                required
              />
              {errors.departure && <span className={styles.errorText}>{errors.departure}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Arrival Time</label>
              <input
                type="time"
                name="arrival"
                value={formData.arrival}
                onChange={handleChange}
                className={`${styles.input} ${styles.inputMono}`}
                required
              />
              {errors.arrival && <span className={styles.errorText}>{errors.arrival}</span>}
            </div>
          </div>

          {/* Gate & Status (Select list menus) */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Gate Allocation</label>
              <select
                name="gate"
                value={formData.gate}
                onChange={handleChange}
                className={styles.select}
              >
                {GATES.map((gate) => (
                  <option key={`gate-${gate}`} value={gate}>
                    Gate {gate}
                  </option>
                ))}
              </select>
              {errors.gate && <span className={styles.errorText}>{errors.gate}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Operational Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="ON_TIME">On Time</option>
                <option value="BOARDING">Boarding</option>
                <option value="DELAYED">Delayed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              {errors.status && <span className={styles.errorText}>{errors.status}</span>}
            </div>
          </div>

          {/* Form Actions */}
          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              {isEditMode ? 'Save Settings' : 'Deploy Flight ✈'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FlightForm;
