import type { BackendAppointment, BackendAuthUser, BackendReferrer, DashboardData, EarningsTransaction, Referral, User } from '../types';

export function getBackendUserId(user: BackendAuthUser): string {
  if (!user || typeof user !== 'object') throw new Error('The backend returned an invalid current-user response.');
  const id = user.id ?? user._id;
  if (!id) throw new Error('The backend did not return a user ID.');
  return id;
}

export function mapBackendReferrerUser(authUser: BackendAuthUser, referrer: BackendReferrer): User {
  if (!referrer || typeof referrer !== 'object') {
    throw new Error('The backend returned an invalid referral profile.');
  }
  if (authUser.role !== 'referrer') {
    throw new Error('This account is not registered as a referral partner.');
  }

  const userId = getBackendUserId(authUser);
  const referrerUserId = typeof referrer.userId === 'string'
    ? referrer.userId
    : getBackendUserId(referrer.userId);
  if (referrerUserId !== userId) {
    throw new Error('The referral profile does not match the signed-in account.');
  }

  const fullName = referrer.name.trim() || authUser.name?.trim() || '';
  const [firstName = '', ...lastNameParts] = fullName.split(/\s+/).filter(Boolean);
  if (!fullName || !referrer.email || !referrer.phone || !referrer.createdAt) {
    throw new Error('The backend returned an incomplete referral profile.');
  }

  return {
    id: userId,
    firstName,
    lastName: lastNameParts.join(' '),
    email: referrer.email,
    phone: referrer.phone,
    partnerSince: referrer.createdAt,
    role: 'referral-partner',
    referralCode: referrer.referralCode,
  };
}

export function mapBackendDashboard(authUser: BackendAuthUser, referrer: BackendReferrer): DashboardData {
  const counts = [referrer.totalReferrals, referrer.successfulReferrals, referrer.scheduledReferrals];
  const amounts = [referrer.totalRevenue, referrer.paidOut, referrer.balance];
  if (![...counts, ...amounts].every((value) => typeof value === 'number' && Number.isFinite(value))) {
    throw new Error('The backend returned incomplete partner totals.');
  }

  return {
    user: mapBackendReferrerUser(authUser, referrer),
    earnings: {
      totalEarned: referrer.totalRevenue,
      paid: referrer.paidOut,
      pending: referrer.balance,
    },
    stats: {
      totalReferrals: referrer.totalReferrals,
      completedReferrals: referrer.successfulReferrals,
      pendingReferrals: referrer.scheduledReferrals,
    },
  };
}

export function appointmentBelongsToReferrer(appointment: BackendAppointment, referrer: BackendReferrer): boolean {
  const referralCode = referrer.referralCode.trim().toLocaleLowerCase();
  const appointmentCode = (appointment.referralCode ?? appointment.referrer?.referralCode ?? '').trim().toLocaleLowerCase();
  const appointmentEmail = (appointment.referrer?.email ?? '').trim().toLocaleLowerCase();
  const referrerEmail = referrer.email.trim().toLocaleLowerCase();
  return Boolean(referralCode && appointmentCode === referralCode)
    || Boolean(referrerEmail && appointmentEmail === referrerEmail);
}

function mapReferralStatus(appointment: BackendAppointment): Referral['status'] {
  const referralStatus = (appointment.referralStatus ?? '').trim().toLocaleLowerCase();
  const directStatus: Record<string, Referral['status']> = {
    pending: 'pending',
    referred: 'pending',
    contacted: 'contacted',
    booked: 'booked',
    scheduled: 'booked',
    successful: 'completed',
    completed: 'completed',
    approved: 'approved',
    paid: 'paid',
    unsuccessful: 'rejected',
    rejected: 'rejected',
    cancelled: 'cancelled',
  };
  if (directStatus[referralStatus]) return directStatus[referralStatus];

  const jobStatus = (appointment.status ?? '').trim().toLocaleLowerCase();
  const jobStatusMap: Record<string, Referral['status']> = {
    scheduled: 'booked',
    assigned: 'contacted',
    'in progress': 'contacted',
    'needs feedback': 'completed',
    completed: 'completed',
    'completed and closed successfully': 'completed',
    closed: 'cancelled',
  };
  const mappedStatus = jobStatusMap[jobStatus];
  if (mappedStatus) return mappedStatus;
  throw new Error('The backend returned an unsupported referral status.');
}

export function mapBackendAppointment(appointment: BackendAppointment): Referral {
  const name = appointment.customerName?.trim();
  const phone = appointment.phone?.trim();
  const problem = appointment.issueType?.trim() || appointment.issueDescription?.trim();
  if (!appointment._id || !name || !phone || !problem || !appointment.createdAt) {
    throw new Error('The backend returned an incomplete appointment record.');
  }

  return {
    id: appointment._id,
    customer: { name, phone, email: appointment.email, address: appointment.address },
    problem,
    submittedAt: appointment.createdAt,
    status: mapReferralStatus(appointment),
    commission: { status: appointment.referralRewardGiven ? 'paid' : 'pending' },
    timeline: {},
  };
}

export function mapReferralToEarningsTransaction(referral: Referral): EarningsTransaction {
  return {
    id: referral.id,
    customerName: referral.customer.name,
    status: referral.commission.status,
    date: referral.submittedAt,
    dateLabel: 'Referral submitted',
  };
}

export function mapBackendAppointmentToEarningsTransaction(appointment: BackendAppointment): EarningsTransaction {
  if (!appointment._id || !appointment.customerName?.trim() || !appointment.createdAt) {
    throw new Error('The backend returned an incomplete earnings history record.');
  }
  return {
    id: appointment._id,
    customerName: appointment.customerName.trim(),
    status: appointment.referralRewardGiven ? 'paid' : 'pending',
    date: appointment.createdAt,
    dateLabel: 'Referral submitted',
  };
}