import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const textareaClass = error ? 'input-field input-error' : 'input-field';

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={textareaId} className="form-label">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`${textareaClass} ${className}`}
        {...props}
      />
      {error && <div className="form-error">{error}</div>}
      {helperText && !error && <div className="form-helper">{helperText}</div>}
    </div>
  );
};

export default Textarea;
