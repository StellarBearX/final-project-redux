import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetFlightByIdQuery } from '../features/flights/flightsApi';
import { useGetFleetQuery } from '../features/fleet/fleetApi';
import StatusPill from '../components/StatusPill/StatusPill';
import Spinner from '../components/Spinner/Spinner';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import styles from './FlightDetailPage.module.css';

const FlightDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ── RTK Query hooks ──────────────────────────────────────────────────────
  const {
    data: flight,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetFlightByIdQuery(id, { skip: !id });

  const { data: aircraftList = [] } = useGetFleetQuery();

  // Find the assigned aircraft details
  const assignedAircraft = flight
    ? aircraftList.find(
        (a) => a.registration === flight.aircraftId || a.id === flight.aircraftId
      )
    : null;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Back Button Action */}
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          ← Back to flight deck
        </button>

        {/* Dynamic State Rendering */}
        {isLoading && <Spinner />}
        {isError && (
          <ErrorMessage
            message={error?.data?.error ?? error?.error ?? 'Failed to load flight details'}
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && flight && (
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
                <span className={styles.detailVal}>{flight.departure ?? '—'}</span>
              </div>

              <div className={styles.detailBlock}>
                <span className={styles.detailLabel}>Arrival Telemetry</span>
                <span className={styles.detailVal}>{flight.arrival ?? '—'}</span>
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
                      <span className={styles.planeModel}>
                        {assignedAircraft.manufacturer} {assignedAircraft.model}
                      </span>
                      <span className={styles.planeReg}>
                        {assignedAircraft.registration} • {assignedAircraft.capacity} PAX (Max Capacity)
                      </span>
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
                Active tracking. All values are synced live with air traffic controls and represent
                standard local times.
              </p>
            </div>
          </article>
        )}
      </div>
    </main>
  );
};

export default FlightDetailPage;
