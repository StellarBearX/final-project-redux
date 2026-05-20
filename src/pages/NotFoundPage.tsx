import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import styles from './NotFoundPage.module.css';

const NotFoundPage: React.FC = () => (
  <div className={styles.wrap}>
    <div className={styles.code}>404</div>
    <h2 className={styles.title}>Destination Not Found</h2>
    <p className={styles.sub}>
      This route doesn't appear on our flight plan. Let's get you back on course.
    </p>
    <Link to="/">
      <Button variant="primary">Return to Dashboard</Button>
    </Link>
  </div>
);

export default NotFoundPage;
