import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, id, required, className, ...rest }) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.inputWrap}>
        <input
          id={inputId}
          required={required}
          className={[styles.input, error ? styles.hasError : '', className ?? '']
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />
      </div>
      {error && <span className={styles.error}>⚠ {error}</span>}
    </div>
  );
};

export default Input;
