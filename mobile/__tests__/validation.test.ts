import { loginSchema, registerSchema, referralSchema } from '../utils/validation';

describe('authentication validation', () => {
  it('rejects invalid login values', () => {
    expect(loginSchema.safeParse({ email: 'not-an-email', password: 'short' }).success).toBe(false);
  });

  it('accepts complete partner registration data', () => {
    expect(registerSchema.safeParse({ firstName: 'Alex', lastName: 'Morgan', email: 'alex@example.com', phone: '021 555 0123', password: 'securepass' }).success).toBe(true);
  });

  it('requires customer name, phone, and support need', () => {
    expect(referralSchema.safeParse({ customerName: '', phone: '', problem: '' }).success).toBe(false);
    expect(referralSchema.safeParse({ customerName: 'Pat Lee', phone: '0215550123', problem: 'Computer help' }).success).toBe(true);
  });
});