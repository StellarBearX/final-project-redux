import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGetFlightsQuery } from '../features/flights/flightsApi';
import { useGetFleetQuery } from '../features/fleet/fleetApi';
import { useParallax } from '../hooks/useParallax';
import { useScrollReveal } from '../hooks/useScrollReveal';
import StatusPill from '../components/StatusPill/StatusPill';
import FleetCard from '../components/FleetCard/FleetCard';
import styles from './HomePage.module.css';

// Count-up helper component animating on scroll trigger using requestAnimationFrame
const CountUp = ({ end, duration = 1500, suffix = '', decimals = 0, trigger = false }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(progress * end);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration, trigger]);

  return <span>{count.toFixed(decimals)}{suffix}</span>;
};

const HomePage = () => {
  const navigate = useNavigate();

  // ── RTK Query hooks ──────────────────────────────────────────────────────
  const { data: flights = [] } = useGetFlightsQuery();
  const { data: fleet = [] }   = useGetFleetQuery();

  // Scroll triggers & Hooks
  const offset = useParallax(0.4);
  const [statsRef,  statsVisible]  = useScrollReveal();
  const [opsRef,    opsVisible]    = useScrollReveal();
  const [fleetRef,  fleetVisible]  = useScrollReveal();
  const [searchRef, searchVisible] = useScrollReveal();

  // HUD Telemetry Search State
  const [hudSearch, setHudSearch] = useState('');
  const [hudStatus, setHudStatus] = useState('ALL');

  const filteredHudFlights = flights.filter((flight) => {
    const query = hudSearch.toLowerCase().trim();
    if (!query && hudStatus === 'ALL') return true;

    const matchesSearch =
      !query ||
      flight.flightNumber?.toLowerCase().includes(query) ||
      flight.origin?.toLowerCase().includes(query) ||
      flight.destination?.toLowerCase().includes(query) ||
      flight.gate?.toLowerCase().includes(query);

    const matchesStatus =
      hudStatus === 'ALL' ||
      flight.status?.toUpperCase().replace(' ', '_') === hudStatus;

    return matchesSearch && matchesStatus;
  });

  // Calculate dynamic stats
  const activeAircraftCount = fleet.filter((a) => a.status?.toUpperCase() !== 'RETIRED').length || 8;
  const uniqueDests  = new Set(flights.map((f) => f.destination)).size;
  const routesCount  = uniqueDests > 0 ? uniqueDests * 12 : 147;
  const onTimeCount  = flights.filter((f) => {
    const s = f.status?.toUpperCase() || '';
    return s.includes('ON_TIME') || s.includes('BOARDING');
  }).length;
  const reliability  = flights.length > 0
    ? Math.round((onTimeCount / flights.length) * 1000) / 10
    : 99.2;

  return (
    <div className={styles.wrapper}>
      {/* ── Section 1: Hero Section ── */}
      <section className={styles.hero}>
        {/* Cinematic Looping Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600"
          className={styles.videoBg}
          style={{ transform: `translateY(${offset}px)` }}
          src="https://assets.mixkit.co/videos/preview/mixkit-aircraft-flying-high-in-the-sky-40439-large.mp4"
        />
        <div className={styles.darkOverlay} />

        <div className={styles.heroContent}>
          <h1 className={styles.displayHeading}>
            <span className={styles.line1}>The World Awaits.</span>
            <span className={styles.line2}>Fly with Precision.</span>
          </h1>
          <p className={styles.heroSub}>
            Experience aerospace management engineered for ultimate operational control and weightless luxury.
          </p>
          <div className={styles.heroActions}>
            <button onClick={() => navigate('/flights')} className={styles.primaryBtn}>
              Manage Operations
            </button>
            <button onClick={() => navigate('/fleet')} className={styles.secondaryBtn}>
              View Fleet Registry
            </button>
          </div>
        </div>
      </section>

      {/* ── Section 2: Stats Bar ── */}
      <section ref={statsRef} className={styles.statsBar}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <h3 className={styles.statNumber}>
                <CountUp end={routesCount} trigger={statsVisible} />
              </h3>
              <p className={styles.statLabel}>Global Routes</p>
            </div>
            <div className={styles.statItem}>
              <h3 className={styles.statNumber}>
                <CountUp end={activeAircraftCount} trigger={statsVisible} />
              </h3>
              <p className={styles.statLabel}>Active Aircraft</p>
            </div>
            <div className={styles.statItem}>
              <h3 className={styles.statNumber}>
                <CountUp end={reliability} decimals={1} suffix="%" trigger={statsVisible} />
              </h3>
              <p className={styles.statLabel}>On-time Reliability</p>
            </div>
            <div className={styles.statItem}>
              <h3 className={styles.statNumber}>24/7</h3>
              <p className={styles.statLabel}>Telemetry Control</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Live Operations Preview ── */}
      <section ref={opsRef} className={`${styles.opsSection} ${opsVisible ? styles.revealed : ''}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.kicker}>LIVE STATUS MATRIX</span>
            <h2 className={styles.sectionTitle}>Real-time Telemetry Preview</h2>
          </div>

          <div className={styles.opsPreviewTable}>
            {flights.slice(0, 5).map((flight, idx) => (
              <div
                key={flight.id}
                className={styles.opsRow}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <span className={styles.opsFlightNum}>{flight.flightNumber}</span>
                <span className={styles.opsRoute}>
                  {flight.origin} <span className={styles.opsArrow}>➔</span> {flight.destination}
                </span>
                <span className={styles.opsTime}>Departure: {flight.departure}</span>
                <span className={styles.opsGate}>Gate: {flight.gate}</span>
                <span className={styles.opsStatusPill}>
                  <StatusPill status={flight.status} />
                </span>
              </div>
            ))}
          </div>

          <div className={styles.opsActionRow}>
            <Link to="/flights" className={styles.arrowLink}>
              View all flights <span>➔</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 4: Fleet Preview ── */}
      <section ref={fleetRef} className={`${styles.fleetSection} ${fleetVisible ? styles.revealed : ''}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.kicker}>AERO FLIGHT DECK</span>
            <h2 className={styles.sectionTitle}>Crafted for High Altitudes</h2>
          </div>

          <div className={styles.fleetGrid}>
            {fleet.slice(0, 3).map((aircraft) => (
              <FleetCard
                key={aircraft.id || aircraft.registration}
                aircraft={aircraft}
                flights={flights}
              />
            ))}
          </div>

          <div className={styles.opsActionRow} style={{ marginTop: '40px' }}>
            <Link to="/fleet" className={styles.arrowLink}>
              View fleet registry <span>➔</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 5: Telemetry Search Widget ── */}
      <section ref={searchRef} className={`${styles.searchSection} ${searchVisible ? styles.revealed : ''}`}>
        <div className={styles.container}>
          <div className={styles.searchCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.kicker}>SYSTEM TELEMETRY HUD</span>
              <h2 className={styles.sectionTitle}>Real-time Flight Lookup Console</h2>
              <p className={styles.searchSub}>
                Instantly monitor current operations, gates, and statuses directly from the dynamic HUD database.
              </p>
            </div>

            {/* Filter controls */}
            <div className={styles.hudFilters}>
              <input
                type="text"
                placeholder="Search flight, destination, gate..."
                value={hudSearch}
                onChange={(e) => setHudSearch(e.target.value)}
                className={styles.hudSearchInput}
              />
              <div className={styles.hudButtons}>
                {['ALL', 'ON_TIME', 'BOARDING', 'DELAYED', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setHudStatus(st)}
                    className={`${styles.hudTabBtn} ${hudStatus === st ? styles.activeHudTab : ''}`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* HUD Results Grid */}
            <div className={styles.hudGrid}>
              {filteredHudFlights.length === 0 ? (
                <div className={styles.hudEmpty}>
                  No flights match the current query in the operational matrix.
                </div>
              ) : (
                filteredHudFlights.map((flight) => (
                  <div
                    key={flight.id}
                    className={styles.hudCard}
                    onClick={() => navigate(`/flights/${flight.id}`)}
                  >
                    <div className={styles.hudCardHeader}>
                      <span className={styles.hudFlightNumber}>{flight.flightNumber}</span>
                      <StatusPill status={flight.status} />
                    </div>

                    <div className={styles.hudRouteRow}>
                      <span className={styles.hudApt}>{flight.origin}</span>
                      <span className={styles.hudArrow}>➔</span>
                      <span className={styles.hudApt}>{flight.destination}</span>
                    </div>

                    <div className={styles.hudDetails}>
                      <div className={styles.hudDetailItem}>
                        <span className={styles.hudLabel}>DEPARTURE</span>
                        <span className={styles.hudVal}>{flight.departure}</span>
                      </div>
                      <div className={styles.hudDetailItem}>
                        <span className={styles.hudLabel}>GATE</span>
                        <span className={styles.hudVal}>{flight.gate}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
