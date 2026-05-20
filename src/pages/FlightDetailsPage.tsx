import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetFlightByIdQuery } from '../features/flights/flightsApi';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import styles from './FlightDetailsPage.module.css';

const FlightDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: flight, isLoading, isError } = useGetFlightByIdQuery(id ?? '');

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        Loading flight details…
      </div>
    );
  }

  if (isError || !flight) {
    return (
      <div className={styles.error}>
        Failed to load flight details. The flight may not exist.
      </div>
    );
  }

  return (
    <div>
      <div className={styles.back}>
        <Link to="/flights">
          <Button variant="ghost" size="sm">← Back to Flights</Button>
        </Link>
      </div>

      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <div className={styles.flightNum}>{flight.flightNumber}</div>
            <div className={styles.route}>
              {flight.origin} → {flight.destination}
            </div>
          </div>
          <StatusBadge status={flight.status} />
        </div>

        <div className={styles.grid}>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Departure</span>
            <span className={styles.fieldValue}>{flight.departureTime}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Arrival</span>
            <span className={styles.fieldValue}>{flight.arrivalTime}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Gate</span>
            <span className={styles.fieldValue}>{flight.gate || '—'}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Aircraft</span>
            <span className={styles.fieldValue}>{flight.aircraftId || '—'}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => navigate(`/flights/${id}/edit`)}>
            Edit Flight
          </Button>
          <Button variant="ghost" onClick={() => navigate('/flights')}>
            Back to List
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlightDetailsPage;
