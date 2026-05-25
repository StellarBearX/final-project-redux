import React, { useState } from 'react';
import { useGetFleetQuery } from './fleetApi';
import { useGetFlightsQuery } from '../flights/flightsApi';
import FleetCard from '../../components/FleetCard/FleetCard';
import Spinner from '../../components/Spinner/Spinner';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import styles from './FleetPage.module.css';

const FleetPage = () => {
  // ── RTK Query hooks ──────────────────────────────────────────────────────
  const {
    data: fleet = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetFleetQuery();

  const { data: flights = [] } = useGetFlightsQuery();

  // Local Filter state
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL | ACTIVE | MAINTENANCE | RETIRED

  // Filtered fleet list
  const filteredFleet = fleet.filter((aircraft) => {
    if (activeFilter === 'ALL') return true;
    return aircraft.status?.toUpperCase() === activeFilter;
  });

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Header Block */}
        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <span className={styles.kicker}>FLEET DECK REGISTRY</span>
            <h1 className={styles.title}>Active Aero Assets</h1>
          </div>

          {/* Filter Chips inside header */}
          <div className={styles.filterGroup}>
            {['ALL', 'ACTIVE', 'MAINTENANCE', 'RETIRED'].map((filterOpt) => (
              <button
                key={filterOpt}
                onClick={() => setActiveFilter(filterOpt)}
                className={`${styles.filterChip} ${activeFilter === filterOpt ? styles.activeChip : ''}`}
              >
                {filterOpt}
              </button>
            ))}
          </div>
        </header>

        {/* Dynamic Telemetry Rendering */}
        <section className={styles.content}>
          {isLoading && <Spinner />}
          {isError && (
            <ErrorMessage
              message={error?.data?.error ?? error?.error ?? 'Failed to load fleet registry'}
              onRetry={refetch}
            />
          )}
          {!isLoading && !isError && (
            <>
              {filteredFleet.length === 0 ? (
                <div className={styles.empty}>
                  No aerospace assets found matching the chosen parameters.
                </div>
              ) : (
                <div className={styles.grid}>
                  {filteredFleet.map((aircraft) => (
                    <FleetCard
                      key={aircraft.id || aircraft.registration}
                      aircraft={aircraft}
                      flights={flights}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default FleetPage;
