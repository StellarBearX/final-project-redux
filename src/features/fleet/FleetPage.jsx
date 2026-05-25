import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFleet } from './fleetSlice';
import FleetCard from '../../components/FleetCard/FleetCard';
import Spinner from '../../components/Spinner/Spinner';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import styles from './FleetPage.module.css';

const FleetPage = () => {
  const dispatch = useDispatch();

  // State from Redux
  const fleet = useSelector((state) => state.fleet.items);
  const status = useSelector((state) => state.fleet.status);
  const error = useSelector((state) => state.fleet.error);

  // Local Filter state
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL | ACTIVE | MAINTENANCE | RETIRED

  useEffect(() => {
    dispatch(fetchFleet());
  }, [dispatch]);

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
          {status === 'loading' && <Spinner />}
          {status === 'failed' && (
            <ErrorMessage 
              message={error} 
              onRetry={() => dispatch(fetchFleet())} 
            />
          )}
          {status !== 'loading' && status !== 'failed' && (
            <>
              {filteredFleet.length === 0 ? (
                <div className={styles.empty}>
                  No aerospace assets found matching the chosen parameters.
                </div>
              ) : (
                <div className={styles.grid}>
                  {filteredFleet.map((aircraft) => (
                    <FleetCard key={aircraft.id || aircraft.registration} aircraft={aircraft} />
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
