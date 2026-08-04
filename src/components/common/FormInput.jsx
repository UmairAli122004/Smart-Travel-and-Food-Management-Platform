import React from 'react';
const FormInput = ({
  id,
  name,
  label,
  type = 'text',
  value,
  placeholder,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  disabled = false,
}) => {
  const isInvalid = Boolean(touched && error);
  return (
    <div className="mb-3">
      <label htmlFor={id || name} className="form-label fw-semibold text-secondary small">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        id={id || name}
        name={name}
        type={type}
        className={`form-control ${isInvalid ? 'is-invalid' : ''}`}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        aria-invalid={isInvalid}
        aria-describedby={isInvalid ? `${name}-error` : undefined}
      />
      {isInvalid && (
        <div id={`${name}-error`} className="invalid-feedback d-block mt-1">
          {error}
        </div>
      )}
    </div>
  );
};
export default React.memo(FormInput);
