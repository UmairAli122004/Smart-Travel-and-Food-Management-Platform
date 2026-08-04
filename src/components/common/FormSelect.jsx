import React from 'react';
const FormSelect = ({
  id,
  name,
  label,
  value,
  options = [],
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
}) => {
  const isInvalid = Boolean(touched && error);
  return (
    <div className="mb-3">
      <label htmlFor={id || name} className="form-label fw-semibold text-secondary small">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <select
        id={id || name}
        name={name}
        className={`form-select ${isInvalid ? 'is-invalid' : ''}`}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        aria-invalid={isInvalid}
        aria-describedby={isInvalid ? `${name}-error` : undefined}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {isInvalid && (
        <div id={`${name}-error`} className="invalid-feedback d-block mt-1">
          {error}
        </div>
      )}
    </div>
  );
};
export default React.memo(FormSelect);
