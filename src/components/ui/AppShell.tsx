import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { toggleSidebar, setActiveRoute } from '../../app/uiSlice';
import styles from './AppShell.module.css';

interface NavItem { to: string; icon: string; label: string; end?: boolean; }

const NAV_ITEMS: NavItem[] = [
  { to: '/flights', icon: '✈', label: 'Flights' },
  { to: '/fleet',   icon: '🛩', label: 'Fleet'   },
];

const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);
  const location = useLocation();

  React.useEffect(() => {
    dispatch(setActiveRoute(location.pathname));
  }, [location.pathname, dispatch]);

  const pageTitle = React.useMemo(() => {
    if (location.pathname === '/flights/new') return 'New Flight';
    if (location.pathname.endsWith('/edit')) return 'Edit Flight';
    if (location.pathname.startsWith('/flights/')) return 'Flight Details';
    if (location.pathname === '/flights') return 'Flights';
    if (location.pathname.startsWith('/fleet')) return 'Fleet';
    return 'Nimbus';
  }, [location.pathname]);

  return (
    <div className={styles.shell}>
      {/* ── Sidebar ── */}
      <aside
        className={[styles.sidebar, sidebarOpen ? '' : styles.sidebarCollapsed]
          .filter(Boolean).join(' ')}
        aria-label="Sidebar"
      >
        <div className={styles.logo}>
          <div className={styles.logoMark}>N</div>
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>Nimbus</span>
            <span className={styles.logoSub}>Fleet Manager</span>
          </div>
        </div>

        <nav className={styles.nav} aria-label="Main navigation">
          <span className={styles.navGroupLabel}>Operations</span>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [styles.navLink, isActive ? styles.navLinkActive : '']
                  .filter(Boolean).join(' ')
              }
            >
              <span className={styles.navIcon} aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
          <div className={styles.navDivider} />
          <Link to="/flights/new" className={styles.navLink}>
            <span className={styles.navIcon} aria-hidden="true">＋</span>
            Schedule Flight
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link to="/" className={styles.homeLink}>← Home</Link>
          <div>Nimbus Fleet Manager</div>
          <div>v1.0 · Premium Edition</div>
        </div>
      </aside>

      {/* ── Main column ── */}
      <div className={[styles.main, sidebarOpen ? '' : styles.mainExpanded]
        .filter(Boolean).join(' ')}>
        <header className={styles.topbar}>
          <button
            className={styles.toggleBtn}
            onClick={() => dispatch(toggleSidebar())}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
          <span className={styles.topbarTitle}>{pageTitle}</span>
          <div className={styles.topbarRight}>
            <span className={styles.topbarBadge}>Premium</span>
          </div>
        </header>

        <main
          className={[styles.content, styles.pageEnter].join(' ')}
          key={location.pathname}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
