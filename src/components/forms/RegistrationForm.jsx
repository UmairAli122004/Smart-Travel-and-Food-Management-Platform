import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../common/FormInput';
import FormSelect from '../common/FormSelect';
import { ROLES } from '../../constants/roles';
import { useForm } from '../../hooks/useForm';
import { registerUser } from '../../services/authService';
const initialValues = {
  username: '',
  phone: '',
  email: '',
  password: '',
  role: '',
};
const RegistrationForm = () => {
  const navigate = useNavigate();
  const handleRegisterSubmit = async (formData) => {
    await registerUser(formData);
    navigate('/login', {
      state: { message: 'Registration successful! Please log in.' },
      replace: true,
    });
  };
  const {
    values,
    errors,
    touched,
    isSubmitting,
    serverError,
    successMessage,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(initialValues, handleRegisterSubmit);
  return (
    <div className="card shadow-sm border">
      <div className="card-body p-4">
        <h2 className="card-title text-center mb-1 h4 fw-bold text-dark">
          User Registration
        </h2>
        <p className="text-center text-muted small mb-4">
          Create an account for Smart Travel and Food Management Platform
        </p>
        {serverError && (
          <div className="alert alert-danger py-2 px-3 mb-3 small" role="alert">
            {serverError}
          </div>
        )}
        {successMessage && (
          <div className="alert alert-success py-2 px-3 mb-3 small" role="alert">
            {successMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <FormInput
            id="username"
            name="username"
            label="Username"
            type="text"
            value={values.username}
            placeholder="Enter username"
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.username}
            touched={touched.username}
            required
            disabled={isSubmitting}
          />
          <FormInput
            id="phone"
            name="phone"
            label="Phone Number"
            type="tel"
            value={values.phone}
            placeholder="9876543210"
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.phone}
            touched={touched.phone}
            required
            disabled={isSubmitting}
          />
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
            placeholder="8-20 chars with uppercase, lowercase, number, special char"
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
            touched={touched.password}
            required
            disabled={isSubmitting}
          />
          <FormSelect
            id="role"
            name="role"
            label="Account Role"
            value={values.role}
            options={ROLES}
            placeholder="Select Account Role"
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.role}
            touched={touched.role}
            required
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="btn btn-primary w-100 mt-3 py-2 fw-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing Registration...' : 'Register'}
          </button>
          <div className="text-center mt-3 pt-2 border-top">
            <span className="text-secondary small">Already have an account? </span>
            <Link to="/login" className="text-primary text-decoration-none small fw-semibold">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default RegistrationForm;
