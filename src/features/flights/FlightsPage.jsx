import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from './flightsSlice';
import { useDeleteFlightMutation } from './flightsApi';
import { useGetFleetQuery } from '../fleet/fleetApi';
import { selectFilteredFlights, selectFlightStats } from './flightsSelectors';
import { openModal, closeModal } from '../ui/uiSlice';
import { useGetFlightsQuery } from './flightsApi';
import FlightTable from '../../components/FlightTable/FlightTable';
import FlightForm from '../../components/FlightForm/FlightForm';
import Spinner from '../../components/Spinner/Spinner';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import styles from './FlightsPage.module.css';

const FlightsPage = () => {
  const dispatch = useDispatch();

  // ── RTK Query hooks ──────────────────────────────────────────────────────
  const { isLoading, isError, error, refetch } = useGetFlightsQuery();
  const { data: fleetItems = [] } = useGetFleetQuery();
  const [deleteFlight] = useDeleteFlightMutation();

  // ── Memoised selectors (reads from RTK Query cache) ──────────────────────
  const flights       = useSelector(selectFilteredFlights);
  const stats         = useSelector(selectFlightStats);
  const currentFilter = useSelector((state) => state.flights.filter);

  // ── Modal UI state ───────────────────────────────────────────────────────
  const { isModalOpen, editMode, editData } = useSelector((state) => state.ui);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleEditClick   = (flight) => dispatch(openModal(flight));
  const handleAddClick    = ()       => dispatch(openModal(null));
  const handleCloseModal  = ()       => dispatch(closeModal());

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to decommission this flight route?')) {
      deleteFlight(id);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Header Strip */}
        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <span className={styles.kicker}>OPERATIONAL DASHBOARD</span>
            <h1 className={styles.title}>Flight Telemetry Matrix</h1>
          </div>
          <button onClick={handleAddClick} className={styles.addBtn}>
            + Schedule Flight
          </button>
        </header>

        {/* Real-time Counter Stats Grid */}
        <section className={styles.statsSection}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Scheduled</span>
            <span className={styles.statValue}>{stats.total}</span>
          </div>
          <div className={`${styles.statCard} ${styles.statGreen}`}>
            <span className={styles.statLabel}>On Time</span>
            <span className={styles.statValue}>{stats.onTime}</span>
          </div>
          <div className={`${styles.statCard} ${styles.statCyan}`}>
            <span className={styles.statLabel}>Boarding</span>
            <span className={styles.statValue}>{stats.boarding}</span>
          </div>
          <div className={`${styles.statCard} ${styles.statAmber}`}>
            <span className={styles.statLabel}>Delayed</span>
            <span className={styles.statValue}>{stats.delayed}</span>
          </div>
          <div className={`${styles.statCard} ${styles.statRed}`}>
            <span className={styles.statLabel}>Cancelled</span>
            <span className={styles.statValue}>{stats.cancelled}</span>
          </div>
        </section>

        {/* Filter Chips Bar */}
        <section className={styles.filterSection}>
          <div className={styles.filterGroup}>
            {['ALL', 'ON_TIME', 'BOARDING', 'DELAYED', 'CANCELLED'].map((filterOpt) => (
              <button
                key={filterOpt}
                onClick={() => dispatch(setFilter(filterOpt))}
                className={`${styles.filterChip} ${currentFilter === filterOpt ? styles.activeChip : ''}`}
              >
                {filterOpt.replace('_', ' ')}
              </button>
            ))}
          </div>
        </section>

        {/* Conditional Telemetry Data Rendering */}
        <section className={styles.contentSection}>
          {isLoading && <Spinner />}
          {isError && (
            <ErrorMessage
              message={error?.error ?? error?.data?.error ?? 'Failed to load flights'}
              onRetry={refetch}
            />
          )}
          {!isLoading && !isError && (
            <FlightTable
              flights={flights}
              aircraftList={fleetItems}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          )}
        </section>
      </div>

      {/* Flight Schedule/Edit Modal Form */}
      {isModalOpen && (
        <FlightForm
          initialData={editMode ? editData : null}
          onClose={handleCloseModal}
        />
      )}
    </main>
  );
};

export default FlightsPage;
