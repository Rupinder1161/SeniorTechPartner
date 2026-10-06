import { z } from 'zod';

const requiredText = (label: string) => z.string().trim().min(1, `${label} is required`);

export const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  firstName: requiredText('First name'),
  lastName: requiredText('Last name'),
  email: z.email('Enter a valid email address'),
  phone: z.string().trim().min(7, 'Enter a valid phone number'),
  password: z.string().min(1, 'Password is required'),
});

export const referralSchema = z.object({
  customerName: requiredText('Customer name'),
  phone: z.string().trim().min(7, 'Enter a valid phone number'),
  email: z.union([z.literal(''), z.email('Enter a valid email address')]).optional(),
  address: requiredText('Address'),
  issueType: z.enum(['mobile', 'pc', 'wifi', 'other']),
  issueDescription: requiredText('Issue description'),
  referralCode: requiredText('Referral code'),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  consentAccepted: z.boolean().refine((accepted) => accepted, 'Consent is required to book an appointment'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ReferralFormValues = z.infer<typeof referralSchema>;