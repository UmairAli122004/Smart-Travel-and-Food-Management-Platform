import { z } from 'zod';
export const loginSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});
export const registerSchema = z.object({
  username: z.string().min(3, 'Username is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  phone: z.string().min(10, 'Phone number is required'),
  password: z.string().regex(/^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, 'Password must be 8-20 characters and include lowercase letter, number and special character.'),
  role: z.enum(['PASSENGER', 'VENDOR']),
});

export const vendorRegisterSchema = z.object({
  vendorName: z.string().min(3, 'Vendor name is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().regex(/^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, 'Password must be 8-20 characters and include lowercase letter, number and special character.'),
  contactNumber: z.string().min(10, 'Contact number is required').max(15),
  companyName: z.string().min(1, 'Company name is required').max(150),
  gstNumber: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/, 'Enter a valid GST number'),
  businessAddress: z.string().min(1, 'Business address is required').max(255),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  pincode: z.string().min(1, 'Pincode is required').max(10),
});
