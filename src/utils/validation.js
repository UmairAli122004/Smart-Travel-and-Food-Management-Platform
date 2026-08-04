const PHONE_REGEX = /^[6-9]\d{9}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,20}$/;
export const validateField = (name, value) => {
  const trimmedValue = (value || '').trim();
  switch (name) {
    case 'username':
      if (!trimmedValue) {
        return 'Username is required';
      }
      if (trimmedValue.length < 3 || trimmedValue.length > 30) {
        return 'Username must be between 3 and 30 characters';
      }
      return '';
    case 'phone':
      if (!trimmedValue) {
        return 'Phone number is required';
      }
      if (!PHONE_REGEX.test(trimmedValue)) {
        return 'Enter a valid 10-digit Indian mobile number';
      }
      return '';
    case 'email':
      if (!trimmedValue) {
        return 'Email is required';
      }
      if (!EMAIL_REGEX.test(trimmedValue)) {
        return 'Enter a valid email address';
      }
      return '';
    case 'password':
      if (!value) {
        return 'Password is required';
      }
      if (!PASSWORD_REGEX.test(value)) {
        return 'Password must be 8-20 characters and include uppercase, lowercase, number and special character.';
      }
      return '';
    case 'role':
      if (!trimmedValue) {
        return 'Role is required';
      }
      return '';
    default:
      return '';
  }
};
export const validateLoginField = (name, value) => {
  const trimmedValue = (value || '').trim();
  switch (name) {
    case 'email':
      if (!trimmedValue) {
        return 'Email is required';
      }
      if (!EMAIL_REGEX.test(trimmedValue)) {
        return 'Enter a valid email address';
      }
      return '';
    case 'password':
      if (!value) {
        return 'Password is required';
      }
      return '';
    default:
      return '';
  }
};
export const validateForm = (formData) => {
  const errors = {};
  const fields = ['username', 'phone', 'email', 'password', 'role'];
  fields.forEach((field) => {
    const error = validateField(field, formData[field]);
    if (error) {
      errors[field] = error;
    }
  });
  return errors;
};
export const validateLoginForm = (formData) => {
  const errors = {};
  const fields = ['email', 'password'];
  fields.forEach((field) => {
    const error = validateLoginField(field, formData[field]);
    if (error) {
      errors[field] = error;
    }
  });
  return errors;
};
