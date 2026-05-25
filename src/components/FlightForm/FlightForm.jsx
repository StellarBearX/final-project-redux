import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useCreateFlightMutation, useUpdateFlightMutation, useGetFlightsQuery } from '../../features/flights/flightsApi';
import { useGetFleetQuery } from '../../features/fleet/fleetApi';
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
  { code: 'MNL', name: 'Manila Ninoy Aquino' },
];

// Standard Gate Allocations
const GATES = ['A01', 'A08', 'A12', 'B04', 'B06', 'B11', 'C03', 'C07', 'D02', 'D09'];

const FlightForm = ({ initialData = null, onClose }) => {
  const isEditMode = !!initialData;

  // ── RTK Query hooks ──────────────────────────────────────────────────────
  const { data: aircraftList = [] } = useGetFleetQuery();
  const { data: flights = [] }      = useGetFlightsQuery();
  const [createFlight] = useCreateFlightMutation();
  const [updateFlight] = useUpdateFlightMutation();

  // Filter out Retired aircraft from scheduling
  const activeAircraft = aircraftList.filter(
    (a) => a.status?.toUpperCase() !== 'RETIRED'
  );

  const [formData, setFormData] = useState({
    flightNumber: '',
    origin: 'BKK',
    destination: 'SIN',
    departure: '08:00',
    arrival: '12:00',
    gate: 'A01',
    status: 'ON_TIME',
    aircraftId: '',
  });

  const [errors, setErrors] = useState({});

  // Populate form when editing, or seed defaults for new
  useEffect(() => {
    if (initialData) {
      setFormData({
        flightNumber: initialData.flightNumber || '',
        origin:       initialData.origin       || 'BKK',
        destination:  initialData.destination  || 'SIN',
        departure:    initialData.departure     || '08:00',
        arrival:      initialData.arrival       || '12:00',
        gate:         initialData.gate          || 'A01',
        status:       initialData.status        || 'ON_TIME',
        aircraftId:   initialData.aircraftId    || '',
      });
    } else {
      const defaultAircraft = activeAircraft.length > 0 ? activeAircraft[0].registration : '';
      setFormData({
        flightNumber: `NM${Math.floor(100 + Math.random() * 899)}`,
        origin:       'BKK',
        destination:  'SIN',
        departure:    '08:00',
        arrival:      '12:00',
        gate:         'A01',
        status:       'ON_TIME',
        aircraftId:   defaultAircraft,
      });
    }
    setErrors({});
  }, [initialData, aircraftList]);   // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'origin' || name === 'destination' ? value.toUpperCase() : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Instant code generator helper
  const handleRandomizeCode = () => {
    setFormData((prev) => ({
      ...prev,
      flightNumber: `NM${Math.floor(100 + Math.random() * 899)}`,
    }));
  };

  // Helper: convert "HH:MM" → total minutes
  const timeToMinutes = (t) => {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.flightNumber?.trim()) {
      newErrors.flightNumber = 'Flight number is required.';
    }

    if (formData.origin === formData.destination) {
      newErrors.destination = 'Destination cannot match the origin airport.';
    }

    if (!formData.departure) newErrors.departure = 'Departure time is required.';
    if (!formData.arrival)   newErrors.arrival   = 'Arrival time is required.';

    if (!formData.aircraftId) {
      newErrors.aircraftId = 'Please assign an active aircraft to this flight log.';
    } else {
      const selectedPlane = aircraftList.find((a) => a.registration === formData.aircraftId);
      if (selectedPlane && selectedPlane.status?.toUpperCase() === 'MAINTENANCE') {
        newErrors.aircraftId = `Warning: ${selectedPlane.registration} is currently under Maintenance. Grounded!`;
      } else {
        // Time Overlap Check
        const pStart = timeToMinutes(formData.departure);
        let   pEnd   = timeToMinutes(formData.arrival);
        if (pEnd <= pStart) pEnd += 24 * 60; // midnight rollover

        for (const f of flights) {
          if (isEditMode && f.id === initialData.id) continue;
          if (f.aircraftId === formData.aircraftId) {
            const fStart = timeToMinutes(f.departure || '00:00');
            let   fEnd   = timeToMinutes(f.arrival   || '00:00');
            if (fEnd <= fStart) fEnd += 24 * 60;

            const isOverlapping = !(pEnd <= fStart || pStart >= fEnd);
            if (isOverlapping) {
              newErrors.aircraftId = `Conflict: Assigned Aircraft already scheduled for Flight ${f.flightNumber} (${f.departure} - ${f.arrival})!`;
              break;
            }
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submissionData = { ...formData };

    if (isEditMode) {
      await updateFlight({ id: initialData.id, flightData: submissionData });
    } else {
      await createFlight(submissionData);
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
          {/* Flight Number */}
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

          {/* Aircraft assignment */}
          <div className={styles.field}>
            <label className={styles.label}>Assign Aircraft Fleet</label>
            <select
              name="aircraftId"
              value={formData.aircraftId}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">-- Select Available Aircraft --</option>
              {activeAircraft.map((plane) => (
                <option key={`form-plane-${plane.registration}`} value={plane.registration}>
                  {plane.registration} - {plane.manufacturer} {plane.model} ({plane.status})
                </option>
              ))}
            </select>
            {errors.aircraftId && <span className={styles.errorText}>{errors.aircraftId}</span>}
          </div>

          {/* Route */}
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

          {/* Times */}
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

          {/* Gate & Status */}
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
