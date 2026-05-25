import React from 'react';
import styles from './StatusPill.module.css';

const StatusPill = ({ status }) => {
  const normalizedStatus = status ? status.toUpperCase() : 'UNKNOWN';

  const getStyleClass = () => {
    switch (normalizedStatus) {
      case 'ON_TIME':
      case 'ACTIVE':
        return styles.onTime;
      case 'DELAYED':
      case 'MAINTENANCE':
        return styles.delayed;
      case 'CANCELLED':
      case 'RETIRED':
        return styles.cancelled;
      case 'BOARDING':
        return styles.boarding;
      default:
        return styles.unknown;
    }
  };

  const getFormattedLabel = () => {
    return normalizedStatus.replace('_', ' ');
  };

  return (
    <span className={`${styles.pill} ${getStyleClass()}`}>
      <span className={styles.dot} />
      <span className={styles.label}>{getFormattedLabel()}</span>
    </span>
  );
};

export default StatusPill;
