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

  // Search Widget State
  const [searchTab, setSearchTab] = useState('roundTrip'); // roundTrip | oneWay | multiCity
  const [searchFields, setSearchFields] = useState({
    from: '',
    to: '',
    date: '',
    passengers: '1'
  });

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchFields(prev => ({
      ...prev,
      [name]: name === 'from' || name === 'to' ? value.toUpperCase() : value
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchFields.from || !searchFields.to) return;
    navigate('/flights');
  };

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

      {/* ── Section 5: Search Widget ── */}
      <section ref={searchRef} className={`${styles.searchSection} ${searchVisible ? styles.revealed : ''}`}>
        <div className={styles.container}>
          <div className={styles.searchCard}>
            {/* Tabs */}
            <div className={styles.searchTabs}>
              <button 
                onClick={() => setSearchTab('roundTrip')}
                className={`${styles.tabBtn} ${searchTab === 'roundTrip' ? styles.activeTab : ''}`}
              >
                Round Trip
              </button>
              <button 
                onClick={() => setSearchTab('oneWay')}
                className={`${styles.tabBtn} ${searchTab === 'oneWay' ? styles.activeTab : ''}`}
              >
                One Way
              </button>
              <button 
                onClick={() => setSearchTab('multiCity')}
                className={`${styles.tabBtn} ${searchTab === 'multiCity' ? styles.activeTab : ''}`}
              >
                Multi-City
              </button>
            </div>

            {/* Controlled Search Form */}
            <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
              <div className={styles.formGrid}>
                <div className={styles.inputField}>
                  <label className={styles.inputLabel}>Origin</label>
                  <input 
                    type="text" 
                    name="from"
                    placeholder="e.g. BKK"
                    maxLength={3}
                    value={searchFields.from}
                    onChange={handleSearchChange}
                    className={styles.formInput}
                    required
                  />
                </div>
                <div className={styles.inputField}>
                  <label className={styles.inputLabel}>Destination</label>
                  <input 
                    type="text" 
                    name="to"
                    placeholder="e.g. LHR"
                    maxLength={3}
                    value={searchFields.to}
                    onChange={handleSearchChange}
                    className={styles.formInput}
                    required
                  />
                </div>
                <div className={styles.inputField}>
                  <label className={styles.inputLabel}>Departure Date</label>
                  <input 
                    type="date" 
                    name="date"
                    value={searchFields.date}
                    onChange={handleSearchChange}
                    className={styles.formInput}
                    required
                  />
                </div>
                <div className={styles.inputField}>
                  <label className={styles.inputLabel}>Passengers</label>
                  <select 
                    name="passengers"
                    value={searchFields.passengers}
                    onChange={handleSearchChange}
                    className={styles.formSelect}
                  >
                    <option value="1">1 Passenger</option>
                    <option value="2">2 Passengers</option>
                    <option value="3">3 Passengers</option>
                    <option value="4">4+ Passengers</option>
                  </select>
                </div>
              </div>

              <button type="submit" className={styles.searchSubmitBtn}>
                Search Aero Flights ➔
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
