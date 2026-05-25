import React, { useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setScrolled } from '../../features/ui/uiSlice';
import styles from './Navbar.module.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const isScrolled = useSelector((state) => state.ui.scrolled);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        dispatch(setScrolled(true));
      } else {
        dispatch(setScrolled(false));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch]);

  return (
    <header className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link to="/" className={styles.brand}>
          <img src="/nimbus_logo.png" alt="Nimbus System Logo" className={styles.logoImg} />
          <span className={styles.brandName}>NIMBUS</span>
        </Link>

        <nav className={styles.navLinks}>
          <NavLink 
            to="/" 
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            end
          >
            Home
          </NavLink>
          <NavLink 
            to="/flights" 
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Flights
          </NavLink>
          <NavLink 
            to="/fleet" 
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Fleet
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
