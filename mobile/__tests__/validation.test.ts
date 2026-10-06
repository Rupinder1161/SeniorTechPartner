import { loginSchema, registerSchema, referralSchema } from '../utils/validation';

describe('authentication validation', () => {
  it('rejects invalid login values', () => {
    expect(loginSchema.safeParse({ email: 'not-an-email', password: 'x' }).success).toBe(false);
    expect(loginSchema.safeParse({ email: 'alex@example.com', password: 'x' }).success).toBe(true);
  });

  it('accepts complete partner registration data', () => {
    expect(registerSchema.safeParse({ firstName: 'Alex', lastName: 'Morgan', email: 'alex@example.com', phone: '021 555 0123', password: 'x' }).success).toBe(true);
  });

  it('requires appointment contact details, address, issue, referral code, and consent', () => {
    const appointment = {
      customerName: 'Pat Lee',
      phone: '0215550123',
      email: '',
      address: '12 Kauri Road, Wellington',
      issueType: 'pc',
      issueDescription: 'Computer help',
      referralCode: 'PARTNER20',
      consentAccepted: true,
    };
    expect(referralSchema.safeParse({ ...appointment, consentAccepted: false }).success).toBe(false);
    expect(referralSchema.safeParse(appointment).success).toBe(true);
  });
});