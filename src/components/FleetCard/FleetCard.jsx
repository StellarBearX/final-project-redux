import React from 'react';
import StatusPill from '../StatusPill/StatusPill';
import styles from './FleetCard.module.css';

// Precise model-to-photography mapping to ensure fleet pictures are authentic
const MODEL_IMAGES = {
  'Boeing 777-300ER': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600',
  'Airbus A350-900': 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?w=600',
  'Boeing 787-9 Dreamliner': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600',
  'Airbus A380-800': 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=600',
  'Boeing 777-200LR': 'https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?w=600',
  'Airbus A330-300': 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=600',
  'Boeing 787-8 Dreamliner': 'https://images.unsplash.com/photo-1518973656114-1189c44569a9?w=600',
  'Airbus A320neo': 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600'
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600';

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
