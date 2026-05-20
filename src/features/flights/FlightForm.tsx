import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetFlightByIdQuery,
  useCreateFlightMutation,
  useUpdateFlightMutation,
  type FlightPayload,
} from './flightsApi';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import styles from './flights.module.css';

/* ── Types ── */
interface FormValues {
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
  aircraftId: string;
  gate: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const EMPTY_FORM: FormValues = {
  flightNumber: '',
  origin: '',
  destination: '',
  departureTime: '',
  arrivalTime: '',
  status: '',
  aircraftId: '',
  gate: '',
};

const STATUS_OPTIONS = [
  { value: 'On Time', label: 'On Time' },
  { value: 'Delayed', label: 'Delayed' },
  { value: 'Boarding', label: 'Boarding' },
  { value: 'Cancelled', label: 'Cancelled' },
];

/* ── Validation ── */
const FLIGHT_NUM_RE = /^[A-Z]{2,3}\d{1,4}$/i;
const IATA_RE = /^[A-Z]{3}$/i;
const TIME_RE = /^\d{2}:\d{2}$/;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.flightNumber.trim()) {
    errors.flightNumber = 'Flight number is required.';
  } else if (!FLIGHT_NUM_RE.test(values.flightNumber.trim())) {
    errors.flightNumber = 'Must be a valid IATA format, e.g. NM101.';
  }

  if (!values.origin.trim()) {
    errors.origin = 'Origin is required.';
  } else if (!IATA_RE.test(values.origin.trim())) {
    errors.origin = 'Use 3-letter IATA code, e.g. BKK.';
  }

  if (!values.destination.trim()) {
    errors.destination = 'Destination is required.';
  } else if (!IATA_RE.test(values.destination.trim())) {
    errors.destination = 'Use 3-letter IATA code, e.g. LHR.';
  }

  if (
    values.origin.trim().toUpperCase() === values.destination.trim().toUpperCase() &&
    values.origin.trim()
  ) {
    errors.destination = 'Destination must differ from origin.';
  }

  if (!values.departureTime.trim()) {
    errors.departureTime = 'Departure time is required.';
  } else if (!TIME_RE.test(values.departureTime.trim())) {
    errors.departureTime = 'Use HH:MM format, e.g. 14:35.';
  }

  if (!values.arrivalTime.trim()) {
    errors.arrivalTime = 'Arrival time is required.';
  } else if (!TIME_RE.test(values.arrivalTime.trim())) {
    errors.arrivalTime = 'Use HH:MM format, e.g. 17:10.';
  }

  if (!values.status) {
    errors.status = 'Please select a status.';
  }

  if (!values.gate.trim()) {
    errors.gate = 'Gate is required.';
  }

  return errors;
}

/* ── Component ── */
interface FlightFormProps {
  mode: 'add' | 'edit';
}

const FlightForm: React.FC<FlightFormProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  /* Load existing data for edit mode */
  const {
    data: existing,
    isLoading: isLoadingFlight,
    isError: isLoadError,
  } = useGetFlightByIdQuery(id ?? '', { skip: mode === 'add' });

  useEffect(() => {
    if (existing) {
      setValues({
        flightNumber: existing.flightNumber,
        origin: existing.origin,
        destination: existing.destination,
        departureTime: existing.departureTime,
        arrivalTime: existing.arrivalTime,
        status: existing.status,
        aircraftId: existing.aircraftId ?? '',
        gate: existing.gate ?? '',
      });
    }
  }, [existing]);

  const [createFlight, { isLoading: isCreating }] = useCreateFlightMutation();
  const [updateFlight, { isLoading: isUpdating }] = useUpdateFlightMutation();
  const isSaving = isCreating || isUpdating;

  /* Generic change handler — works for both Input and Select */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    /* Clear the error for this field as the user types */
    if (errors[name as keyof FormValues]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    /* Validate the single field on blur */
    const fieldErrors = validate(values);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldErrors[name as keyof FormValues],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    /* Mark all fields touched so all errors show */
    const allTouched = Object.keys(EMPTY_FORM).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {} as Record<keyof FormValues, boolean>,
    );
    setTouched(allTouched);

    const fieldErrors = validate(values);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    const payload: FlightPayload = {
      flightNumber: values.flightNumber.trim().toUpperCase(),
      origin: values.origin.trim().toUpperCase(),
      destination: values.destination.trim().toUpperCase(),
      departureTime: values.departureTime.trim(),
      arrivalTime: values.arrivalTime.trim(),
      status: values.status as FlightPayload['status'],
      aircraftId: values.aircraftId.trim(),
      gate: values.gate.trim().toUpperCase(),
    };

    if (mode === 'edit' && id) {
      await updateFlight({ id, body: payload });
    } else {
      await createFlight(payload);
      /* Reset form after successful create */
      setValues(EMPTY_FORM);
      setTouched({});
      setErrors({});
    }

    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
    navigate('/flights');
  };

  /* Loading existing flight for edit */
  if (mode === 'edit' && isLoadingFlight) {
    return (
      <div className={styles.formPage}>
        <div className={styles.stateWrap}>
          <div className={styles.spinner} />
          <span>Loading flight data…</span>
        </div>
      </div>
    );
  }

  if (mode === 'edit' && isLoadError) {
    return (
      <div className={styles.formPage}>
        <div className={styles.errorWrap}>
          <div className={styles.errorTitle}>Could not load flight</div>
          <p className={styles.errorMsg}>
            The flight may have been deleted or the server is unavailable.
          </p>
          <Button variant="secondary" onClick={() => navigate('/flights')}>
            Back to Flights
          </Button>
        </div>
      </div>
    );
  }

  /* Helper: only show error after the field has been blurred */
  const err = (field: keyof FormValues) =>
    touched[field] ? errors[field] : undefined;

  return (
    <div className={styles.formPage}>
      {/* Header */}
      <div className={styles.formPageHeader}>
        <Button
          variant="ghost"
          size="sm"
          className={styles.formPageBack}
          onClick={() => navigate('/flights')}
          type="button"
        >
          ← Back
        </Button>
        <div>
          <p className={styles.eyebrow}>
            {mode === 'add' ? 'New Flight' : 'Edit Flight'}
          </p>
          <h1 className={styles.heading}>
            {mode === 'add'
              ? 'Schedule a Flight'
              : `Editing ${existing?.flightNumber ?? '…'}`}
          </h1>
        </div>
      </div>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit} noValidate>
          {/* Section 1: Identification */}
          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>Flight Identification</div>
            <div className={styles.formGrid}>
              <Input
                label="Flight Number"
                name="flightNumber"
                placeholder="e.g. NM101"
                value={values.flightNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={err('flightNumber')}
                required
                autoComplete="off"
              />
              <Select
                label="Status"
                name="status"
                options={STATUS_OPTIONS}
                value={values.status}
                onChange={handleChange}
                onBlur={handleBlur}
                error={err('status')}
                required
              />
            </div>
          </div>

          {/* Section 2: Route */}
          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>Route</div>
            <div className={styles.formGrid}>
              <Input
                label="Origin (IATA)"
                name="origin"
                placeholder="e.g. BKK"
                value={values.origin}
                onChange={handleChange}
                onBlur={handleBlur}
                error={err('origin')}
                required
                maxLength={3}
                autoComplete="off"
              />
              <Input
                label="Destination (IATA)"
                name="destination"
                placeholder="e.g. LHR"
                value={values.destination}
                onChange={handleChange}
                onBlur={handleBlur}
                error={err('destination')}
                required
                maxLength={3}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Section 3: Schedule */}
          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>Schedule</div>
            <div className={styles.formGrid}>
              <Input
                label="Departure Time"
                name="departureTime"
                placeholder="HH:MM"
                value={values.departureTime}
                onChange={handleChange}
                onBlur={handleBlur}
                error={err('departureTime')}
                required
                maxLength={5}
              />
              <Input
                label="Arrival Time"
                name="arrivalTime"
                placeholder="HH:MM"
                value={values.arrivalTime}
                onChange={handleChange}
                onBlur={handleBlur}
                error={err('arrivalTime')}
                required
                maxLength={5}
              />
            </div>
          </div>

          {/* Section 4: Operations */}
          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>Operations</div>
            <div className={styles.formGrid}>
              <Input
                label="Gate"
                name="gate"
                placeholder="e.g. A12"
                value={values.gate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={err('gate')}
                required
                autoComplete="off"
              />
              <Input
                label="Aircraft ID"
                name="aircraftId"
                placeholder="e.g. HS-TGH"
                value={values.aircraftId}
                onChange={handleChange}
                onBlur={handleBlur}
                error={err('aircraftId')}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Actions */}
          <div className={styles.formActions}>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/flights')}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isSaving}>
              {mode === 'add' ? 'Schedule Flight' : 'Save Changes'}
            </Button>
            {submitSuccess && (
              <span className={styles.formSaveMsg}>
                ✓ {mode === 'add' ? 'Flight scheduled!' : 'Changes saved!'}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default FlightForm;
