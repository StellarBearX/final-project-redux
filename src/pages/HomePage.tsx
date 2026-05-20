import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

/* ─── Data ─────────────────────────────────────────── */
const HERO_IMG =
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2400&q=80';

const DESTINATIONS = [
  {
    city: 'Paris',
    country: 'France',
    tag: 'Most Popular',
    img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=75',
  },
  {
    city: 'Kyoto',
    country: 'Japan',
    tag: 'Seasonal',
    img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=75',
  },
  {
    city: 'Maldives',
    country: 'South Asia',
    tag: 'New Route',
    img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=75',
  },
  {
    city: 'London',
    country: 'United Kingdom',
    tag: 'Daily Flights',
    img: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=600&q=75',
  },
];

const MARQUEE_ITEMS = [
  'Bangkok · Paris · London · New York · Singapore · Tokyo · Dubai',
  'Bangkok · Paris · London · New York · Singapore · Tokyo · Dubai',
];

const STATS_BAND = [
  { num: '186', accent: '+', label: 'Destinations', desc: 'Across 6 continents' },
  { num: '98.4', accent: '%', label: 'On-Time Rate', desc: 'Industry-leading punctuality' },
  { num: '47', accent: '', label: 'Aircraft', desc: 'Modern, fuel-efficient fleet' },
  { num: '24', accent: '/7', label: 'Operations', desc: 'Round-the-clock command centre' },
];

/* ─── Form types & validation ────────────────────────── */
interface BookingValues {
  from: string;
  to: string;
  date: string;
  passengers: string;
}
type BookingErrors = Partial<Record<keyof BookingValues, string>>;

const EMPTY: BookingValues = { from: '', to: '', date: '', passengers: '' };

function validateBooking(v: BookingValues): BookingErrors {
  const errs: BookingErrors = {};
  if (!v.from.trim()) errs.from = 'Origin city or airport is required.';
  if (!v.to.trim())   errs.to   = 'Destination is required.';
  if (v.from.trim().toLowerCase() === v.to.trim().toLowerCase() && v.from.trim())
    errs.to = 'Destination must differ from origin.';
  if (!v.date) {
    errs.date = 'Please select a departure date.';
  } else if (new Date(v.date) < new Date(new Date().toDateString())) {
    errs.date = 'Departure date cannot be in the past.';
  }
  if (!v.passengers) {
    errs.passengers = 'Select number of passengers.';
  }
  return errs;
}

/* ─── Component ─────────────────────────────────────── */
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const heroBgRef = useRef<HTMLDivElement>(null);

  /* ── Parallax ── */
  useEffect(() => {
    let rafId: number;
    const onScroll = () => {
      rafId = requestAnimationFrame(() => {
        if (!heroBgRef.current) return;
        const offset = window.scrollY * 0.38;
        heroBgRef.current.style.setProperty('--parallax-y', `${offset}px`);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  /* ── Booking form state ── */
  const [tripType, setTripType] = useState<'round' | 'one' | 'multi'>('round');
  const [values, setValues]     = useState<BookingValues>(EMPTY);
  const [errors, setErrors]     = useState<BookingErrors>({});
  const [touched, setTouched]   = useState<Partial<Record<keyof BookingValues, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof BookingValues]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const fieldErrs = validateBooking(values);
    setErrors(prev => ({ ...prev, [name]: fieldErrs[name as keyof BookingValues] }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = Object.keys(EMPTY).reduce(
      (a, k) => ({ ...a, [k]: true }),
      {} as Record<keyof BookingValues, boolean>,
    );
    setTouched(allTouched);
    const fieldErrs = validateBooking(values);
    setErrors(fieldErrs);
    if (Object.keys(fieldErrs).length > 0) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setValues(EMPTY);
      setTouched({});
      navigate('/flights');
    }, 1800);
  };

  /* Swap origin ↔ destination */
  const handleSwap = () => {
    setValues(prev => ({ ...prev, from: prev.to, to: prev.from }));
  };

  const err = (field: keyof BookingValues) =>
    touched[field] ? errors[field] : undefined;

  /* Min date for date input */
  const todayISO = new Date().toISOString().split('T')[0];

  return (
    <div className={styles.page}>

      {/* ════ 1. HERO ════ */}
      <section className={styles.hero}>
        {/* Parallax background */}
        <div
          ref={heroBgRef}
          className={styles.heroBg}
          style={
            {
              '--hero-img': `url("${HERO_IMG}")`,
              '--parallax-y': '0px',
            } as React.CSSProperties
          }
        />
        <div className={styles.heroVeil} />

        {/* Top nav strip */}
        <header className={styles.heroHeader}>
          <div className={styles.heroLogo}>
            Nimbus
            <span className={styles.heroLogoSub}>Premium Aviation</span>
          </div>
          <nav>
            <ul className={styles.heroNav}>
              <li><Link to="/flights" className={styles.heroNavLink}>Flights</Link></li>
              <li><Link to="/fleet" className={styles.heroNavLink}>Fleet</Link></li>
              <li><Link to="/flights/new" className={styles.heroNavLink}>Schedule</Link></li>
            </ul>
          </nav>
        </header>

        {/* Hero copy */}
        <div className={styles.heroContent}>
          <p className={styles.heroKicker}>Nimbus Premium Aviation</p>
          <h1 className={styles.heroTitle}>
            The World Awaits.<br />
            <span className={styles.heroTitleItalic}>Fly with Precision.</span>
          </h1>
          <p className={styles.heroSub}>
            An elite command centre for modern aviation — monitor, manage, and
            orchestrate your entire fleet from one breathtaking interface.
          </p>

          {/* Dashboard entry CTAs */}
          <div className={styles.heroActions}>
            <Link to="/flights" className={styles.heroCta}>
              Manage Fleet →
            </Link>
            <Link to="/fleet" className={styles.heroCtaGhost}>
              View Aircraft
            </Link>
          </div>
        </div>

        <div className={styles.scrollCue}>
          <div className={styles.scrollLine} />
          Scroll
        </div>
      </section>

      {/* ════ 2. BOOKING WIDGET ════ */}
      <div className={styles.bookingAnchor}>
        <div className={styles.bookingCard}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 4 }}>
            <p className={styles.bookingTitle}>Search Flights</p>
            <Link
              to="/flights"
              style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8a7f74', textDecoration: 'none', borderBottom: '1px solid currentColor', paddingBottom: 1, flexShrink: 0 }}
            >
              Go to Dashboard →
            </Link>
          </div>
          <p className={styles.bookingSubtitle}>
            Find and manage scheduled routes across the Nimbus network
          </p>

          {/* Trip-type toggle */}
          <div className={styles.tripToggle} role="group" aria-label="Trip type">
            {(['round', 'one', 'multi'] as const).map((t) => (
              <button
                key={t}
                type="button"
                className={[styles.tripBtn, tripType === t ? styles.tripBtnActive : '']
                  .filter(Boolean).join(' ')}
                onClick={() => setTripType(t)}
              >
                {t === 'round' ? 'Round Trip' : t === 'one' ? 'One Way' : 'Multi-City'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearch} noValidate>
            <div className={styles.bookingGrid}>

              {/* Origin */}
              <div className={styles.fieldBlock} style={{ position: 'relative' }}>
                <label className={styles.fieldLabel}>
                  From <span className={styles.fieldRequired}>*</span>
                </label>
                <input
                  className={[styles.fieldInput, err('from') ? styles.fieldInputError : '']
                    .filter(Boolean).join(' ')}
                  type="text"
                  name="from"
                  placeholder="City or airport"
                  value={values.from}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="off"
                />
                <button
                  type="button"
                  className={styles.swapBtn}
                  onClick={handleSwap}
                  aria-label="Swap origin and destination"
                  title="Swap"
                >
                  ⇄
                </button>
                <span className={styles.fieldError}>
                  {err('from') ? `⚠ ${err('from')}` : ''}
                </span>
              </div>

              {/* Destination */}
              <div className={styles.fieldBlock}>
                <label className={styles.fieldLabel}>
                  To <span className={styles.fieldRequired}>*</span>
                </label>
                <input
                  className={[styles.fieldInput, err('to') ? styles.fieldInputError : '']
                    .filter(Boolean).join(' ')}
                  type="text"
                  name="to"
                  placeholder="City or airport"
                  value={values.to}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="off"
                />
                <span className={styles.fieldError}>
                  {err('to') ? `⚠ ${err('to')}` : ''}
                </span>
              </div>

              {/* Date */}
              <div className={styles.fieldBlock}>
                <label className={styles.fieldLabel}>
                  Departure <span className={styles.fieldRequired}>*</span>
                </label>
                <input
                  className={[styles.fieldInput, err('date') ? styles.fieldInputError : '']
                    .filter(Boolean).join(' ')}
                  type="date"
                  name="date"
                  min={todayISO}
                  value={values.date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <span className={styles.fieldError}>
                  {err('date') ? `⚠ ${err('date')}` : ''}
                </span>
              </div>

              {/* Passengers */}
              <div className={styles.fieldBlock}>
                <label className={styles.fieldLabel}>
                  Passengers <span className={styles.fieldRequired}>*</span>
                </label>
                <select
                  className={[styles.fieldInput, err('passengers') ? styles.fieldInputError : '']
                    .filter(Boolean).join(' ')}
                  name="passengers"
                  value={values.passengers}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Select</option>
                  {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={String(n)}>
                      {n} {n === 1 ? 'Passenger' : 'Passengers'}
                    </option>
                  ))}
                </select>
                <span className={styles.fieldError}>
                  {err('passengers') ? `⚠ ${err('passengers')}` : ''}
                </span>
              </div>

              {/* Search CTA */}
              <button
                type="submit"
                className={styles.searchBtn}
                disabled={submitted}
              >
                {submitted ? '✓ Found' : 'Search →'}
              </button>
            </div>

            {submitted && (
              <div className={styles.searchSuccess}>
                ✓ Route found — redirecting to flights…
              </div>
            )}
          </form>
        </div>
      </div>

      {/* ════ 3. MARQUEE ════ */}
      <div className={styles.marqueeWrap} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((text, i) => (
            <span key={i} className={styles.marqueeItem}>
              <span className={styles.marqueeDot} />
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* ════ 4. DESTINATIONS ════ */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionKicker}>Where We Fly</p>
            <h2 className={styles.sectionTitle}>
              Featured{' '}
              <span className={styles.sectionTitleItalic}>Destinations</span>
            </h2>
          </div>
          <Link to="/flights" className={styles.sectionLink}>
            View all routes →
          </Link>
        </div>

        <div className={styles.destGrid}>
          {DESTINATIONS.map((d) => (
            <div key={d.city} className={styles.destCard}>
              <img
                src={d.img}
                alt={`${d.city}, ${d.country}`}
                className={styles.destImg}
                loading="lazy"
              />
              <div className={styles.destOverlay} />
              <div className={styles.destInfo}>
                <p className={styles.destCity}>{d.city}</p>
                <p className={styles.destCountry}>{d.country}</p>
                <span className={styles.destTag}>{d.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════ 5. MOTION PANEL ════ */}
      <div className={styles.motionPanel}>
        <div className={styles.motionImg}>
          <img
            src="https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80"
            alt="Aerial view above the clouds"
            className={styles.motionImgEl}
          />
          <div className={styles.motionImgOverlay} />
        </div>
        <div className={styles.motionCopy}>
          <p className={styles.motionKicker}>The Nimbus Difference</p>
          <h2 className={styles.motionTitle}>
            Fleet Management,<br />Elevated to an Art Form.
          </h2>
          <p className={styles.motionBody}>
            Every route scheduled, every aircraft tracked, every departure
            orchestrated — from a single interface designed for people who
            value precision as much as beauty.
          </p>
          <Link to="/fleet" className={styles.motionCta}>
            Explore the Fleet →
          </Link>
        </div>
      </div>

      {/* ════ 6. STATS BAND ════ */}
      <div className={styles.statsBand}>
        <div className={styles.statsBandInner}>
          {STATS_BAND.map((s) => (
            <div key={s.label} className={styles.bandStat}>
              <span className={styles.bandStatNum}>
                {s.num}
                <span className={styles.bandStatNumAccent}>{s.accent}</span>
              </span>
              <span className={styles.bandStatLabel}>{s.label}</span>
              <span className={styles.bandStatDesc}>{s.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ════ 7. FOOTER ════ */}
      <footer className={styles.footer}>
        <span className={styles.footerLogo}>NIMBUS</span>
        <span className={styles.footerNote}>
          © {new Date().getFullYear()} Nimbus Fleet Manager · Premium Edition
        </span>
      </footer>

    </div>
  );
};

export default HomePage;
