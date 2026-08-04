import { useState, useCallback } from 'react';
import { validateField, validateForm } from '../utils/validation';
export const useForm = (
  initialValues,
  onSubmitCallback,
  fieldValidator = validateField,
  formValidator = validateForm
) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
      setServerError('');
      setTouched((prevTouched) => {
        if (prevTouched[name]) {
          const error = fieldValidator(name, value);
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error,
          }));
        }
        return prevTouched;
      });
    },
    [fieldValidator]
  );
  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;
      setTouched((prevTouched) => ({
        ...prevTouched,
        [name]: true,
      }));
      const error = fieldValidator(name, value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    },
    [fieldValidator]
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');
    const allTouched = Object.keys(values).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    const validationErrors = formValidator(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmitCallback(values, {
        setServerError,
        setSuccessMessage,
        setErrors,
        resetForm: () => {
          setValues(initialValues);
          setTouched({});
          setErrors({});
        },
      });
    } catch (err) {
      if (err.data && typeof err.data === 'object') {
        if (err.data.errors && Array.isArray(err.data.errors)) {
          const fieldErrors = {};
          err.data.errors.forEach((item) => {
            if (item.field && item.defaultMessage) {
              fieldErrors[item.field] = item.defaultMessage;
            }
          });
          if (Object.keys(fieldErrors).length > 0) {
            setErrors((prev) => ({ ...prev, ...fieldErrors }));
          }
        } else if (!err.data.message && !err.data.error) {
          setErrors((prev) => ({ ...prev, ...err.data }));
        }
      }
      setServerError(err.message || 'Operation failed. Please check your input.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return {
    values,
    errors,
    touched,
    isSubmitting,
    serverError,
    successMessage,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setErrors,
    setServerError,
    setSuccessMessage,
  };
};
