import React from 'react';
import StatusPill from '../StatusPill/StatusPill';
import styles from './FleetCard.module.css';

// Spectacular and dynamic airliner action photography mapping
const MODEL_IMAGES = {
  'Boeing 777-300ER': 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800',
  'Airbus A350-900': 'https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?w=800',
  'Boeing 787-9 Dreamliner': 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=800',
  'Airbus A380-800': 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800',
  'Boeing 777-200LR': 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=800',
  'Airbus A330-300': 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800',
  'Boeing 787-8 Dreamliner': 'https://images.unsplash.com/photo-1483450388369-9ed95738483c?w=800',
  'Airbus A320neo': 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800'
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800';

const FleetCard = ({ aircraft }) => {
  const getProgressColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'RETIRED':
        return 'var(--red)';
      case 'MAINTENANCE':
        return 'var(--amber)';
      default:
        return 'var(--accent)';
    }
  };

  // Determine correct image URL based on airliner model name
  const modelName = aircraft.model || '';
  const imageUrl = MODEL_IMAGES[modelName] || DEFAULT_IMAGE;

  // Render mock utilisation level if not present in the backend database
  const utilisation = aircraft.utilisation || Math.min(Math.max(Math.round(((new Date().getFullYear() - (aircraft.yearOfManufacture || 2018)) / 15) * 100), 20), 85);
  const mfgYear = aircraft.yearOfManufacture || aircraft.year || 2018;

  return (
    <article className={styles.card}>
      {/* Visual Header */}
      <div className={styles.imageWrapper}>
        <img 
          src={imageUrl} 
          alt={`${aircraft.manufacturer} ${aircraft.model}`} 
          className={styles.image}
          loading="lazy"
        />
        <div className={styles.imageOverlay} />
        <div className={styles.pillContainer}>
          <StatusPill status={aircraft.status} />
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.registration}>{aircraft.registration}</h3>
          <span className={styles.brand}>{aircraft.manufacturer}</span>
        </div>

        {/* Specs Grid */}
        <div className={styles.specs}>
          <div className={styles.specRow}>
            <span className={styles.specLabel}>Model</span>
            <span className={styles.specVal}>{aircraft.model}</span>
          </div>
          <div className={styles.specRow}>
            <span className={styles.specLabel}>Capacity</span>
            <span className={`${styles.specVal} ${styles.specValMono}`}>{aircraft.capacity} PAX</span>
          </div>
          <div className={styles.specRow}>
            <span className={styles.specLabel}>Year of Mfg</span>
            <span className={`${styles.specVal} ${styles.specValMono}`}>{mfgYear}</span>
          </div>
        </div>

        {/* Utilisation Level */}
        <div className={styles.utilisation}>
          <div className={styles.utilHeader}>
            <span className={styles.utilLabel}>Utilisation Index</span>
            <span className={styles.utilVal}>{utilisation}%</span>
          </div>
          <div className={styles.track}>
            <div 
              className={styles.bar} 
              style={{ 
                width: `${utilisation}%`,
                backgroundColor: getProgressColor(aircraft.status)
              }} 
            />
          </div>
        </div>
      </div>
    </article>
  );
};

export default FleetCard;
