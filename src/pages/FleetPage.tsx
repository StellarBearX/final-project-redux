import React from 'react';
import FleetList from '../features/fleet/FleetList';
import styles from '../features/fleet/fleet.module.css';

const FleetPage: React.FC = () => (
  <div>
    <div className={styles.pageHeader}>
      <div className={styles.headingGroup}>
        <p className={styles.eyebrow}>Nimbus · Aircraft Registry</p>
        <h1 className={styles.heading}>
          Our Fleet{' '}
          <span className={styles.headingItalic}>— Every Aircraft</span>
        </h1>
      </div>
      <div className={styles.metaRow}>
        <span className={styles.count}>Read-only · Live registry</span>
      </div>
    </div>
    <FleetList />
  </div>
);

export default FleetPage;
