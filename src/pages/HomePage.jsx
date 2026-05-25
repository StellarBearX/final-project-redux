import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFlights } from '../features/flights/flightsSlice';
import { selectFilteredFlights } from '../features/flights/flightsSelectors';
import { useParallax } from '../hooks/useParallax';
import { useScrollReveal } from '../hooks/useScrollReveal';
import StatusPill from '../components/StatusPill/StatusPill';
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
  const dispatch = useDispatch();
  const flights = useSelector(selectFilteredFlights);
  const flightsStatus = useSelector((state) => state.flights.status);

  // Scroll triggers & Hooks
  const offset = useParallax(0.4);
  const [statsRef, statsVisible] = useScrollReveal();
  const [opsRef, opsVisible] = useScrollReveal();
  const [fleetRef, fleetVisible] = useScrollReveal();
  const [searchRef, searchVisible] = useScrollReveal();

  // Fetch flights if idle to show in ops preview
  useEffect(() => {
    if (flightsStatus === 'idle') {
      dispatch(fetchFlights());
    }
  }, [flightsStatus, dispatch]);

  // HUD Telemetry Search State
  const [hudSearch, setHudSearch] = useState('');
  const [hudStatus, setHudStatus] = useState('ALL');

  const filteredHudFlights = flights.filter(flight => {
    const query = hudSearch.toLowerCase().trim();
    if (!query && hudStatus === 'ALL') return true;
    
    const matchesSearch = !query || 
      flight.flightNumber?.toLowerCase().includes(query) ||
      flight.origin?.toLowerCase().includes(query) ||
      flight.destination?.toLowerCase().includes(query) ||
      flight.gate?.toLowerCase().includes(query);
      
    const matchesStatus = hudStatus === 'ALL' || flight.status?.toUpperCase().replace(' ', '_') === hudStatus;
    return matchesSearch && matchesStatus;
  });

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
                <CountUp end={147} trigger={statsVisible} />
              </h3>
              <p className={styles.statLabel}>Global Routes</p>
            </div>
            <div className={styles.statItem}>
              <h3 className={styles.statNumber}>
                <CountUp end={8} trigger={statsVisible} />
              </h3>
              <p className={styles.statLabel}>Active Aircraft</p>
            </div>
            <div className={styles.statItem}>
              <h3 className={styles.statNumber}>
                <CountUp end={99.2} decimals={1} suffix="%" trigger={statsVisible} />
              </h3>
              <p className={styles.statLabel}>On-time Reliability</p>
            </div>
            <div className={styles.statItem}>
              <h3 className={styles.statNumber}>
                24/7
              </h3>
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
            {/* Custom Static Cards to display aesthetic premium fleet assets */}
            <article className={styles.fleetCardItem}>
              <div className={styles.fleetCardImgWrapper}>
                <img 
                  src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600" 
                  alt="A350-900" 
                  className={styles.fleetCardImg}
                  loading="lazy"
                />
                <div className={styles.fleetCardOverlay} />
                <span className={styles.fleetCardReg}>HS-TGA</span>
              </div>
              <div className={styles.fleetCardContent}>
                <h3 className={styles.fleetCardTitle}>Airbus A350-900</h3>
                <p className={styles.fleetCardText}>Extra widebody aircraft configured for long-range ultra-luxury operations.</p>
              </div>
            </article>

            <article className={styles.fleetCardItem}>
              <div className={styles.fleetCardImgWrapper}>
                <img 
                  src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600" 
                  alt="787-9" 
                  className={styles.fleetCardImg}
                  loading="lazy"
                />
                <div className={styles.fleetCardOverlay} />
                <span className={styles.fleetCardReg}>HS-TGE</span>
              </div>
              <div className={styles.fleetCardContent}>
                <h3 className={styles.fleetCardTitle}>Boeing 787-9 Dreamliner</h3>
                <p className={styles.fleetCardText}>Advanced composite airframe offering state-of-the-art efficiency and pressure control.</p>
              </div>
            </article>

            <article className={styles.fleetCardItem}>
              <div className={styles.fleetCardImgWrapper}>
                <img 
                  src="https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?w=600" 
                  alt="G650" 
                  className={styles.fleetCardImg}
                  loading="lazy"
                />
                <div className={styles.fleetCardOverlay} />
                <span className={styles.fleetCardReg}>HS-TGD</span>
              </div>
              <div className={styles.fleetCardContent}>
                <h3 className={styles.fleetCardTitle}>Gulfstream G650</h3>
                <p className={styles.fleetCardText}>Ultra-high-speed corporate flagship jet configured for VIP travel.</p>
              </div>
            </article>
          </div>

          <div className={styles.opsActionRow}>
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
              <p className={styles.hudSubDesc}>
                Instantly query active airspace routes, gate allocations, and flight status records across the entire global network.
              </p>
            </div>

            {/* Controlled Search Form */}
            <div className={styles.searchForm}>
              <div className={styles.formGrid}>
                <div className={styles.inputField}>
                  <label className={styles.inputLabel}>Telemetry Query</label>
                  <input 
                    type="text" 
                    placeholder="Enter Flight #, Airport (e.g. BKK), or Gate..."
                    value={hudSearch}
                    onChange={(e) => setHudSearch(e.target.value)}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.inputField}>
                  <label className={styles.inputLabel}>Operations Status</label>
                  <select 
                    value={hudStatus}
                    onChange={(e) => setHudStatus(e.target.value)}
                    className={styles.formSelect}
                  >
                    <option value="ALL">All Operations</option>
                    <option value="ON_TIME">On Time</option>
                    <option value="BOARDING">Boarding</option>
                    <option value="DELAYED">Delayed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Dynamic HUD Search Results */}
              <div className={styles.hudResults}>
                {filteredHudFlights.length === 0 ? (
                  <div className={styles.hudEmpty}>
                    🛰️ NO ACTIVE TELEMETRY LOGS MATCHING QUERY
                  </div>
                ) : (
                  <div className={styles.hudGrid}>
                    {filteredHudFlights.slice(0, 4).map((flight) => (
                      <div 
                        key={`hud-${flight.id}`} 
                        className={styles.hudCard}
                        onClick={() => navigate(`/flights/${flight.id}`)}
                      >
                        <div className={styles.hudCardHeader}>
                          <span className={styles.hudFlightNum}>{flight.flightNumber}</span>
                          <span className={styles.hudGate}>Gate {flight.gate}</span>
                        </div>
                        <div className={styles.hudCardRoute}>
                          <span>{flight.origin}</span>
                          <span className={styles.hudRouteArrow}>➔</span>
                          <span>{flight.destination}</span>
                        </div>
                        <div className={styles.hudCardFooter}>
                          <span className={styles.hudTime}>{flight.departure} - {flight.arrival}</span>
                          <span className={styles.hudActionBtn}>Open Logs ↗</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
