import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const inputClass = error ? 'form-input text-error' : 'form-input';

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`${inputClass} ${className}`}
        {...props}
      />
      {error && <div className="text-error text-sm" style={{marginTop: 'var(--spacing-xs)'}}>{error}</div>}
      {helperText && !error && <div className="text-muted text-sm" style={{marginTop: 'var(--spacing-xs)'}}>{helperText}</div>}
    </div>
  );
};

export default Input;
