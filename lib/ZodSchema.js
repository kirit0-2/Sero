import { z } from 'zod';

export const zSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .trim(),

  email: z.string()
    .email('Invalid email address')
    .max(128, 'Email address too long')
    .toLowerCase()
    .trim(),

  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .max(16, 'Password must not exceed 16 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .refine(val => !['password', '123456', 'qwerty', 'admin'].includes(val.toLowerCase()),
      'Password cannot be a common weak password'),
      
  otp: z.string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only numbers')
    .trim(),
      
//   confirmPassword: z.string()
//     .min(8, 'Confirm password must be at least 8 characters long')
//     .max(16, 'Confirm password must not exceed 16 characters')
// }).refine(data => data.password === data.confirmPassword, {
//   message: 'Passwords do not match',
//   path: ['confirmPassword']
});
