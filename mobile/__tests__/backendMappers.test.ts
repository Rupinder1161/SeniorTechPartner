import { appointmentBelongsToReferrer, countCompletedReferrals, getBackendUserId, mapBackendAppointment, mapBackendAppointmentToEarningsTransaction, mapBackendDashboard, mapBackendReferrerUser } from '../services/backendMappers';

describe('backend identity mapping', () => {
  const authUser = { id: 'user-1', name: 'Aroha Te Rangi', email: 'aroha@example.com', role: 'referrer' };
  const referrer = {
    _id: 'referrer-1',
    userId: 'user-1',
    name: 'Aroha Te Rangi',
    email: 'aroha@example.com',
    phone: '021 555 0100',
    createdAt: '2025-01-01T00:00:00.000Z',
    referralCode: 'AROHA1',
    totalReferrals: 8,
    scheduledReferrals: 2,
    successfulReferrals: 5,
    unsuccessfulReferrals: 1,
    totalRevenue: 100,
    paidOut: 60,
    balance: 40,
  };

  it('maps the confirmed referrer API response to the app user type', () => {
    expect(mapBackendReferrerUser(authUser, referrer)).toEqual({
      id: 'user-1',
      firstName: 'Aroha',
      lastName: 'Te Rangi',
      email: 'aroha@example.com',
      phone: '021 555 0100',
      partnerSince: '2025-01-01T00:00:00.000Z',
      role: 'referral-partner',
      referralCode: 'AROHA1',
    });
  });

  it('rejects non-referrer accounts and mismatched referrer profiles', () => {
    expect(() => mapBackendReferrerUser({ ...authUser, role: 'admin' }, referrer)).toThrow('not registered as a referral partner');
    expect(() => mapBackendReferrerUser(authUser, { ...referrer, userId: 'another-user' })).toThrow('does not match');
  });

  it('accepts MongoDB _id in the current-user response', () => {
    expect(getBackendUserId({ _id: 'user-2' })).toBe('user-2');
  });

  it('maps authoritative referrer totals without inventing unavailable approved or paid counts', () => {
    const dashboard = mapBackendDashboard(authUser, referrer);
    expect(dashboard.stats).toEqual({ totalReferrals: 8, completedReferrals: 5, pendingReferrals: 2 });
    expect(dashboard.earnings).toEqual({ totalEarned: 100, paid: 60, pending: 40, completedJobs: 5 });
    expect(dashboard.recentReferrals).toBeUndefined();
  });

  it('rejects incomplete financial totals rather than rendering invalid amounts', () => {
    expect(() => mapBackendDashboard(authUser, { ...referrer, balance: Number.NaN })).toThrow('incomplete partner totals');
  });

  it('matches appointments by referral code or the referrer email from the existing dashboard flow', () => {
    expect(appointmentBelongsToReferrer({ _id: 'appt-1', referralCode: 'aroha1' }, referrer)).toBe(true);
    expect(appointmentBelongsToReferrer({ _id: 'appt-2', referrer: { email: 'AROHA@example.com' } }, referrer)).toBe(true);
    expect(appointmentBelongsToReferrer({ _id: 'appt-3', referralCode: 'other' }, referrer)).toBe(false);
  });

  it('maps completed job status ahead of a stale referral status', () => {
    const referral = mapBackendAppointment({
      _id: 'appt-4',
      customerName: 'Pat Lee',
      phone: '021 555 0150',
      issueType: 'Computer Support',
      createdAt: '2026-10-05T00:00:00.000Z',
      status: 'Completed',
      referralStatus: 'scheduled',
      referralRewardGiven: true,
    });
    expect(referral.customer.name).toBe('Pat Lee');
    expect(referral.status).toBe('completed');
    expect(referral.commission.status).toBe('approved');
    expect(referral.commission.amount).toBeUndefined();
  });

  it('counts completed jobs from the same mapped referrals shown in the list', () => {
    const referrals = [
      mapBackendAppointment({ _id: 'done', customerName: 'One', phone: '1', issueType: 'PC', createdAt: '2026-10-05', referralStatus: 'successful' }),
      mapBackendAppointment({ _id: 'pending', customerName: 'Two', phone: '2', issueType: 'PC', createdAt: '2026-10-05', referralStatus: 'scheduled' }),
    ];
    expect(countCompletedReferrals(referrals)).toBe(1);
  });

  it('maps credited rewards to approved rather than paid in earnings history', () => {
    const transaction = mapBackendAppointmentToEarningsTransaction({
      _id: 'appt-paid',
      customerName: 'Pat Lee',
      createdAt: '2026-10-05T00:00:00.000Z',
      referralRewardGiven: true,
    });
    expect(transaction).toEqual({
      id: 'appt-paid',
      customerName: 'Pat Lee',
      status: 'approved',
      date: '2026-10-05T00:00:00.000Z',
      dateLabel: 'Referral submitted',
    });
  });
});