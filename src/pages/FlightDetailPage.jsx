import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFlightById, clearSelectedFlight } from '../features/flights/flightsSlice';
import StatusPill from '../components/StatusPill/StatusPill';
import Spinner from '../components/Spinner/Spinner';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import styles from './FlightDetailPage.module.css';

const FlightDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const flight = useSelector((state) => state.flights.selectedFlight);
  const status = useSelector((state) => state.flights.status);
  const error = useSelector((state) => state.flights.error);

  useEffect(() => {
    if (id) {
      dispatch(fetchFlightById(id));
    }
    return () => {
      dispatch(clearSelectedFlight());
    };
  }, [dispatch, id]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Back Button Action */}
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          ← Back to flight deck
        </button>

        {/* Dynamic State Rendering */}
        {status === 'loading' && <Spinner />}
        {status === 'failed' && (
          <ErrorMessage 
            message={error} 
            onRetry={() => dispatch(fetchFlightById(id))} 
          />
        )}

        {status !== 'loading' && status !== 'failed' && flight && (
          <article className={styles.telemetryCard}>
            {/* Header section with registry & status */}
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleBlock}>
                <span className={styles.kicker}>FLIGHT LOG RECORD</span>
                <h1 className={styles.flightNum}>{flight.flightNumber}</h1>
              </div>
              <StatusPill status={flight.status} />
            </div>

            {/* Path visualization */}
            <div className={styles.pathVisual}>
              <div className={styles.station}>
                <span className={styles.iataCode}>{flight.origin}</span>
                <span className={styles.stationLabel}>Origin Port</span>
              </div>
              
              <div className={styles.connector}>
                <div className={styles.line} />
                <div className={styles.planeMark}>✈</div>
                <div className={styles.line} />
              </div>

              <div className={styles.station}>
                <span className={styles.iataCode}>{flight.destination}</span>
                <span className={styles.stationLabel}>Destination Port</span>
              </div>
            </div>

            {/* Details panel */}
            <div className={styles.detailsGrid}>
              <div className={styles.detailBlock}>
                <span className={styles.detailLabel}>Departure Telemetry</span>
                <span className={styles.detailVal}>{flight.departure}</span>
              </div>

              <div className={styles.detailBlock}>
                <span className={styles.detailLabel}>Arrival Telemetry</span>
                <span className={styles.detailVal}>{flight.arrival}</span>
              </div>

              <div className={styles.detailBlock}>
                <span className={styles.detailLabel}>Gate Allocation</span>
                <span className={`${styles.detailVal} ${styles.gateBadge}`}>{flight.gate}</span>
              </div>

              <div className={styles.detailBlock}>
                <span className={styles.detailLabel}>Tracking ID</span>
                <span className={`${styles.detailVal} ${styles.monoText}`}>{flight.id}</span>
              </div>
            </div>

            {/* Alert status notes */}
            <div className={styles.alertNote}>
              <span className={styles.noteIndicator}>●</span>
              <p className={styles.noteText}>
                Active tracking. All values are synced live with air traffic controls and represent standard local times.
              </p>
            </div>
          </article>
        )}
      </div>
    </main>
  );
};

export default FlightDetailPage;
