import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchFlights, 
  deleteFlight, 
  setFilter 
} from './flightsSlice';
import { 
  selectFilteredFlights, 
  selectFlightStats 
} from './flightsSelectors';
import { openModal, closeModal } from '../ui/uiSlice';
import FlightTable from '../../components/FlightTable/FlightTable';
import FlightForm from '../../components/FlightForm/FlightForm';
import Spinner from '../../components/Spinner/Spinner';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import styles from './FlightsPage.module.css';

const FlightsPage = () => {
  const dispatch = useDispatch();

  // State from Redux
  const flights = useSelector(selectFilteredFlights);
  const stats = useSelector(selectFlightStats);
  const status = useSelector((state) => state.flights.status);
  const error = useSelector((state) => state.flights.error);
  const currentFilter = useSelector((state) => state.flights.filter);

  // Modal UI State from Redux
  const { isModalOpen, editMode, editData } = useSelector((state) => state.ui);

  // Load flights on mount
  useEffect(() => {
    dispatch(fetchFlights());
  }, [dispatch]);

  const handleEditClick = (flight) => {
    dispatch(openModal(flight));
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to decommission this flight route?')) {
      dispatch(deleteFlight(id));
    }
  };

  const handleAddClick = () => {
    dispatch(openModal(null));
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
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
          {status === 'loading' && <Spinner />}
          {status === 'failed' && (
            <ErrorMessage 
              message={error} 
              onRetry={() => dispatch(fetchFlights())} 
            />
          )}
          {status !== 'loading' && status !== 'failed' && (
            <FlightTable 
              flights={flights} 
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
