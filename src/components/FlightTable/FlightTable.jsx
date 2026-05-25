import React from 'react';
import { Link } from 'react-router-dom';
import StatusPill from '../StatusPill/StatusPill';
import styles from './FlightTable.module.css';

const FlightTable = ({ flights, aircraftList = [], onEdit, onDelete }) => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th className={styles.headerCell}>Flight</th>
            <th className={styles.headerCell}>Route</th>
            <th className={styles.headerCell}>Departure</th>
            <th className={styles.headerCell}>Arrival</th>
            <th className={styles.headerCell}>Gate</th>
            <th className={styles.headerCell}>Status</th>
            <th className={styles.headerCell} style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {flights.length === 0 ? (
            <tr>
              <td colSpan={7} className={styles.emptyCell}>
                No flight operations listed under these parameters.
              </td>
            </tr>
          ) : (
            flights.map((flight) => (
              <tr key={flight.id} className={styles.bodyRow}>
                {/* Flight Code Link */}
                <td className={styles.codeCell}>
                  <Link to={`/flights/${flight.id}`} className={styles.flightLink}>
                    {flight.flightNumber}
                  </Link>
                  {(() => {
                    const plane = aircraftList.find(a => a.registration === flight.aircraftId || a.id === flight.aircraftId);
                    return plane ? (
                      <span className={styles.assignedPlane}>
                        ✈ {plane.model} ({plane.registration})
                      </span>
                    ) : (
                      <span className={styles.unassigned}>
                        ✈ Unassigned
                      </span>
                    );
                  })()}
                </td>

                {/* Route */}
                <td className={styles.routeCell}>
                  <span className={styles.iata}>{flight.origin}</span>
                  <span className={styles.arrow}>➔</span>
                  <span className={styles.iata}>{flight.destination}</span>
                </td>

                {/* Departure Time */}
                <td className={styles.timeCell}>
                  {flight.departure}
                </td>

                {/* Arrival Time */}
                <td className={styles.timeCell}>
                  {flight.arrival}
                </td>

                {/* Gate Badge */}
                <td className={styles.gateCell}>
                  <span className={styles.gateBadge}>
                    {flight.gate}
                  </span>
                </td>

                {/* Status Capsule */}
                <td className={styles.statusCell}>
                  <StatusPill status={flight.status} />
                </td>

                {/* Actions */}
                <td className={styles.actionsCell}>
                  <div className={styles.actions}>
                    <button 
                      onClick={() => onEdit(flight)} 
                      className={`${styles.actionBtn} ${styles.editBtn}`}
                      title="Edit Flight Settings"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onDelete(flight.id)} 
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      title="Decommission Flight"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FlightTable;
