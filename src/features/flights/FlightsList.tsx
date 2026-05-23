import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetFlightsQuery,
  useDeleteFlightMutation,
  type Flight,
} from './flightsApi';
import {
  selectFlightStats,
  makeSelectFilteredFlights,
} from './flightsSelectors';
import { useAppSelector } from '../../app/hooks';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import styles from './flights.module.css';

const STATUS_FILTERS = ['All', 'On Time', 'Delayed', 'Boarding', 'Cancelled'];

const SKELETON_ROWS = Array.from({ length: 5 });

/* ── Skeleton row ── */
const SkeletonRow: React.FC = () => (
  <tr className={styles.skeletonRow}>
    {[80, 120, 100, 90, 90, 60, 80].map((w, i) => (
      <td key={i}>
        <div className={styles.skeletonCell} style={{ width: w }} />
      </td>
    ))}
  </tr>
);

/* ── Delete confirm modal ── */
interface DeleteModalProps {
  flight: Flight;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  flight,
  onConfirm,
  onCancel,
  isLoading,
}) => (
  <div className={styles.overlay} role="dialog" aria-modal="true">
    <div className={styles.modal}>
      <div className={styles.modalIcon}>⚠</div>
      <h2 className={styles.modalTitle}>Delete Flight?</h2>
      <p className={styles.modalBody}>
        This will permanently remove flight{' '}
        <span className={styles.modalHighlight}>{flight.flightNumber}</span>{' '}
        ({flight.origin} → {flight.destination}). This action cannot be undone.
      </p>
      <div className={styles.modalActions}>
        <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={isLoading}>
          Delete Flight
        </Button>
      </div>
    </div>
  </div>
);

/* ── FlightsList ── */
const FlightsList: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [pendingDelete, setPendingDelete] = useState<Flight | null>(null);

  const { isLoading, isError, refetch } = useGetFlightsQuery();
  const stats = useAppSelector(selectFlightStats);

  /* Memoise the per-render selector to avoid creating it on every render */
  const selectFiltered = useMemo(
    () => makeSelectFilteredFlights(search, statusFilter),
    [search, statusFilter],
  );
  const flights = useAppSelector(selectFiltered);

  const [deleteFlight, { isLoading: isDeleting }] = useDeleteFlightMutation();

  const handleDelete = async () => {
    if (!pendingDelete) return;
    await deleteFlight(pendingDelete.id);
    setPendingDelete(null);
  };

  /* ── Error state ── */
  if (isError) {
    return (
      <div className={styles.errorWrap}>
        <div className={styles.stateIcon}>✈</div>
        <div className={styles.errorTitle}>Could not load flights</div>
        <p className={styles.errorMsg}>
          There was a problem connecting to the server. Check your network and
          try again.
        </p>
        <Button variant="secondary" onClick={refetch}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Filter bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>⌕</span>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search flights, routes, gates…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search flights"
          />
        </div>

        <div className={styles.filterChips} role="group" aria-label="Filter by status">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              type="button"
              className={[
                styles.chip,
                statusFilter === s ? styles.chipActive : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => setStatusFilter(s)}
              aria-pressed={statusFilter === s}
            >
              {s}
              {s !== 'All' && !isLoading && (
                <span>
                  {' '}
                  ·{' '}
                  {s === 'On Time'
                    ? stats.onTime
                    : s === 'Delayed'
                    ? stats.delayed
                    : s === 'Cancelled'
                    ? stats.cancelled
                    : stats.boarding}
                </span>
              )}
            </button>
          ))}
        </div>

        {!isLoading && (
          <span className={styles.resultsCount}>
            {flights.length} of {stats.total} flights
          </span>
        )}
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        <table className={styles.table} aria-label="Flights table">
          <thead>
            <tr>
              <th>Flight</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Gate</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? SKELETON_ROWS.map((_, i) => <SkeletonRow key={i} />)
              : flights.length === 0
              ? null
              : flights.map((flight) => (
                  <tr
                    key={flight.id}
                    onClick={() => navigate(`/flights/${flight.id}`)}
                  >
                    <td>
                      <span className={styles.flightNum}>
                        {flight.flightNumber}
                      </span>
                    </td>
                    <td>
                      <span className={styles.route}>{flight.origin}</span>
                    </td>
                    <td>
                      <span className={styles.route}>{flight.destination}</span>
                    </td>
                    <td>
                      <span className={styles.timeCell}>
                        {flight.departureTime}
                      </span>
                    </td>
                    <td>
                      <span className={styles.timeCell}>
                        {flight.arrivalTime}
                      </span>
                    </td>
                    <td>
                      <span className={styles.gateCell}>
                        {flight.gate || '—'}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={flight.status} />
                    </td>
                    <td>
                      <div
                        className={styles.rowActions}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Edit flight ${flight.flightNumber}`}
                          onClick={() =>
                            navigate(`/flights/${flight.id}/edit`)
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          aria-label={`Delete flight ${flight.flightNumber}`}
                          onClick={() => setPendingDelete(flight)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        {/* Empty state — only after loading */}
        {!isLoading && flights.length === 0 && (
          <div className={styles.stateWrap}>
            <div className={styles.stateIcon}>✈</div>
            <div className={styles.stateTitle}>
              {search || statusFilter !== 'All'
                ? 'No flights match your filters'
                : 'No flights yet'}
            </div>
            <p className={styles.stateSub}>
              {search || statusFilter !== 'All'
                ? 'Try adjusting your search or filter criteria.'
                : 'Add your first flight to get started.'}
            </p>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {pendingDelete && (
        <DeleteModal
          flight={pendingDelete}
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
          isLoading={isDeleting}
        />
      )}
    </>
  );
};

export default FlightsList;
