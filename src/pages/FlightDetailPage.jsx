import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFlightById, clearSelectedFlight } from '../features/flights/flightsSlice';
import { fetchFleet } from '../features/fleet/fleetSlice';
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

  const aircraftList = useSelector((state) => state.fleet.items);
  const fleetStatus = useSelector((state) => state.fleet.status);

  useEffect(() => {
    if (id) {
      dispatch(fetchFlightById(id));
    }
    if (fleetStatus === 'idle') {
      dispatch(fetchFleet());
    }
    return () => {
      dispatch(clearSelectedFlight());
    };
  }, [dispatch, id, fleetStatus]);

  // Find the assigned aircraft details!
  const assignedAircraft = flight ? aircraftList.find(
    (a) => a.registration === flight.aircraftId || a.id === flight.aircraftId
  ) : null;

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
                <span className={styles.detailVal}>{flight.departure || flight.departureTime || '—'}</span>
              </div>

              <div className={styles.detailBlock}>
                <span className={styles.detailLabel}>Arrival Telemetry</span>
                <span className={styles.detailVal}>{flight.arrival || flight.arrivalTime || '—'}</span>
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

            {/* Assigned Aircraft Section */}
            <div className={styles.aircraftSection}>
              <h2 className={styles.sectionSubTitle}>Assigned Aircraft Telemetry</h2>
              {assignedAircraft ? (
                <div className={styles.aircraftCard}>
                  <div className={styles.aircraftInfo}>
                    <div className={styles.planeIcon}>✈</div>
                    <div className={styles.planeDetails}>
                      <span className={styles.planeModel}>{assignedAircraft.manufacturer} {assignedAircraft.model}</span>
                      <span className={styles.planeReg}>{assignedAircraft.registration} • {assignedAircraft.capacity} PAX (Max Capacity)</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/fleet')} 
                    className={styles.viewSpecsBtn}
                  >
                    View Fleet Registry ➔
                  </button>
                </div>
              ) : (
                <div className={styles.aircraftUnassigned}>
                  ⚠️ NO ACTIVE FLEET REGISTRY ASSIGNED TO THIS OPERATIONS RECORD
                </div>
              )}
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
