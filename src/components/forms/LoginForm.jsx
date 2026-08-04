import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import FormInput from '../common/FormInput';
import { useForm } from '../../hooks/useForm';
import { validateLoginField, validateLoginForm } from '../../utils/validation';
import { loginUser } from '../../services/authService';
const initialValues = {
  email: '',
  password: '',
};
const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const registrationSuccessMessage = location.state?.message || '';
  const handleLoginSubmit = async (formData) => {
    await loginUser(formData);
    navigate('/dashboard', { replace: true });
  };
  const {
    values,
    errors,
    touched,
    isSubmitting,
    serverError,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(
    initialValues,
    handleLoginSubmit,
    validateLoginField,
    validateLoginForm
  );
  return (
    <div className="card shadow-sm border">
      <div className="card-body p-4">
        <h2 className="card-title text-center mb-1 h4 fw-bold text-dark">
          User Login
        </h2>
        {registrationSuccessMessage && (
          <div className="alert alert-success py-2 px-3 mb-3 small" role="alert">
            {registrationSuccessMessage}
          </div>
        )}
        {serverError && (
          <div className="alert alert-danger py-2 px-3 mb-3 small" role="alert">
            {serverError}
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <FormInput
            id="email"
            name="email"
            label="Email Address"
            type="email"
            value={values.email}
            placeholder="Enter valid email address"
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            touched={touched.email}
            required
            disabled={isSubmitting}
          />
          <FormInput
            id="password"
            name="password"
            label="Password"
            type="password"
            value={values.password}
            placeholder="Enter password"
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
            touched={touched.password}
            required
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="btn btn-primary w-100 mt-3 py-2 fw-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Authenticating...' : 'Login'}
          </button>
          <div className="text-center mt-3 pt-2 border-top">
            <span className="text-secondary small">Don't have an account? </span>
            <Link to="/register" className="text-primary text-decoration-none small fw-semibold">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default LoginForm;
