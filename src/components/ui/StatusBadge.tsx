import React from 'react';
import styles from './StatusBadge.module.css';

type Status = 'On Time' | 'Delayed' | 'Cancelled' | 'Boarding' | 'Active' | 'Maintenance' | 'Retired';

const keyMap: Record<Status, string> = {
  'On Time': 'ontime',
  Delayed: 'delayed',
  Cancelled: 'cancelled',
  Boarding: 'boarding',
  Active: 'active',
  Maintenance: 'maintenance',
  Retired: 'retired',
};

const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const key = keyMap[status] ?? 'retired';
  return (
    <span className={[styles.badge, styles[key]].join(' ')}>
      <span className={styles.dot} />
      {status}
    </span>
  );
};

export default StatusBadge;
