import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <span className={styles.alertCode}>404</span>
        <div className={styles.content}>
          <span className={styles.kicker}>ROUTE DESYNCHRONISATION DETECTED</span>
          <h1 className={styles.title}>Coordinates Offline</h1>
          <p className={styles.desc}>
            The altitude vector or waypoint address you requested is not listed in our global registry databases.
          </p>
        </div>
        <button onClick={() => navigate('/')} className={styles.homeBtn}>
          Return to Launch Pad ➔
        </button>
      </div>
    </main>
  );
};

export default NotFoundPage;
