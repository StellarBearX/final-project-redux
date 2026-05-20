import React from 'react';
import { Link } from 'react-router-dom';
import FlightsList from '../features/flights/FlightsList';
import Button from '../components/ui/Button';
import styles from '../features/flights/flights.module.css';

const FlightsPage: React.FC = () => (
  <div>
    <div className={styles.pageHeader}>
      <div className={styles.headingGroup}>
        <p className={styles.eyebrow}>Operations Centre</p>
        <h1 className={styles.heading}>Flight Schedule</h1>
      </div>
      <div className={styles.pageActions}>
        <Link to="/flights/new">
          <Button variant="primary">+ Add Flight</Button>
        </Link>
      </div>
    </div>
    <FlightsList />
  </div>
);

export default FlightsPage;
