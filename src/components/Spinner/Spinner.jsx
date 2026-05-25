import React from 'react';
import styles from './Spinner.module.css';

const Spinner = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}>
        <div className={styles.ring} />
        <div className={styles.glow} />
      </div>
      <span className={styles.label}>Synchronising Telemetry...</span>
    </div>
  );
};

export default Spinner;
