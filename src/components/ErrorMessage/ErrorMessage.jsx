import React from 'react';
import styles from './ErrorMessage.module.css';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>⚠</div>
      <div className={styles.content}>
        <h4 className={styles.title}>System Desynchronisation Alert</h4>
        <p className={styles.message}>{message || 'An unexpected telemetry error occurred.'}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className={styles.retryBtn}>
          Re-establish Connection
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
