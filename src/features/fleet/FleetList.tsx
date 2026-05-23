import React, { useMemo } from 'react';
import { useGetFleetQuery, type Aircraft } from './fleetApi';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import styles from './fleet.module.css';

/* ── Skeleton card ── */
const SkeletonCard: React.FC = () => (
  <div className={styles.skeleton}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div className={styles.skeletonLine} style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className={styles.skeletonLine} style={{ width: '60%', height: 14 }} />
        <div className={styles.skeletonLine} style={{ width: '40%', height: 10 }} />
      </div>
      <div className={styles.skeletonLine} style={{ width: 64, height: 22, borderRadius: 999 }} />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 12 }}>
      {[90, 70, 80, 55].map((w, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className={styles.skeletonLine} style={{ width: w, height: 10 }} />
          <div className={styles.skeletonLine} style={{ width: 60, height: 10 }} />
        </div>
      ))}
    </div>
  </div>
);

/* ── Aircraft card ── */
const AircraftCard: React.FC<{ aircraft: Aircraft }> = ({ aircraft }) => (
    <article className={styles.card} aria-label={`Aircraft ${aircraft.registration}`}>
      <div className={styles.cardHeader}>
        <div>
          <div className={styles.registration}>{aircraft.registration}</div>
          <div className={styles.manufacturer}>{aircraft.manufacturer}</div>
        </div>
        <StatusBadge status={aircraft.status} />
      </div>

      <div className={styles.specs}>
        <div className={styles.specRow}>
          <span className={styles.specLabel}>Model</span>
          <span className={styles.specValue}>{aircraft.model}</span>
        </div>
        <div className={styles.specRow}>
          <span className={styles.specLabel}>Capacity</span>
          <span className={[styles.specValue, styles.specValueMono].join(' ')}>
            {aircraft.capacity} pax
          </span>
        </div>
        <div className={styles.specRow}>
          <span className={styles.specLabel}>Year</span>
          <span className={[styles.specValue, styles.specValueMono].join(' ')}>
            {aircraft.yearOfManufacture}
          </span>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.cardYear}>
          {new Date().getFullYear() - aircraft.yearOfManufacture} yrs in service
        </span>
      </div>
    </article>
);

/* ── Fleet stats derived from RTK Query data ── */
function useFleetStats(data: Aircraft[] | undefined) {
  return useMemo(() => {
    if (!data) return { total: 0, active: 0, maintenance: 0, retired: 0 };
    return {
      total: data.length,
      active: data.filter((a) => a.status === 'Active').length,
      maintenance: data.filter((a) => a.status === 'Maintenance').length,
      retired: data.filter((a) => a.status === 'Retired').length,
    };
  }, [data]);
}

/* ── FleetList ── */
const FleetList: React.FC = () => {
  const { data, isLoading, isError, refetch } = useGetFleetQuery();
  const stats = useFleetStats(data);

  /* ── Error state ── */
  if (isError) {
    return (
      <div className={styles.grid}>
        <div className={styles.errorWrap}>
          <div className={styles.stateIcon}>⚠</div>
          <div className={styles.errorTitle}>Unable to reach the fleet database</div>
          <p className={styles.errorMsg}>
            The aircraft registry could not be loaded. Please check your
            connection or try again.
          </p>
          <Button variant="secondary" onClick={refetch}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Stats strip — always rendered (shows zeros while loading) */}
      <div className={styles.statsStrip}>
        {[
          { num: isLoading ? '—' : stats.total,       label: 'Total Aircraft', dot: null          },
          { num: isLoading ? '—' : stats.active,      label: 'Active',         dot: 'dotActive'    },
          { num: isLoading ? '—' : stats.maintenance, label: 'Maintenance',    dot: 'dotMaintenance'},
          { num: isLoading ? '—' : stats.retired,     label: 'Retired',        dot: 'dotRetired'   },
        ].map((s) => (
          <div key={s.label} className={styles.statPill}>
            {s.dot && (
              <span
                className={[styles.statPillDot, styles[s.dot as keyof typeof styles]].join(' ')}
              />
            )}
            <span className={styles.statPillNum}>{s.num}</span>
            <span className={styles.statPillLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : data && data.length > 0
          ? data.map((aircraft) => (
              <AircraftCard key={aircraft.id} aircraft={aircraft} />
            ))
          : (
            <div className={styles.stateWrap}>
              <div className={styles.stateIcon}>🛩</div>
              <div className={styles.stateTitle}>No aircraft registered</div>
              <p className={styles.stateSub}>
                The fleet registry is empty. Aircraft will appear here once
                they are added to the system.
              </p>
            </div>
          )
        }
      </div>
    </>
  );
};

export default FleetList;
