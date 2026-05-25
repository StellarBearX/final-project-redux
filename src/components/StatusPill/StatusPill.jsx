import React from 'react';
import styles from './StatusPill.module.css';

const StatusPill = ({ status }) => {
  const raw = status ? status.toUpperCase().trim() : 'UNKNOWN';

  const getStyleClass = () => {
    if (raw.includes('ON_TIME') || raw.includes('ON TIME') || raw === 'ACTIVE' || raw.includes('CRUISING'))
      return styles.onTime;
    if (raw.includes('DELAYED') || raw.includes('MAINTENANCE'))
      return styles.delayed;
    if (raw.includes('CANCELLED') || raw.includes('RETIRED'))
      return styles.cancelled;
    if (raw.includes('BOARDING'))
      return styles.boarding;
    if (raw.includes('STANDBY'))
      return styles.standby;
    return styles.unknown;
  };

  const getFormattedLabel = () => {
    return raw.replace(/_/g, ' ');
  };

  return (
    <span className={`${styles.pill} ${getStyleClass()}`}>
      <span className={styles.dot} />
      <span className={styles.label}>{getFormattedLabel()}</span>
    </span>
  );
};

export default StatusPill;
