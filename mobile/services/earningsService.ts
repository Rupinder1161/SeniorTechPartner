import { earningsSummary } from '../mockData/database';
import { mockRepository } from './mockRepository';
import type { EarningsSummary, EarningsTransaction } from '../types';
import { getReferrerAccount } from './profileService';
import { getAppointmentsForReferrer } from './referralService';
import { countCompletedReferrals, mapBackendAppointmentToEarningsTransaction } from './backendMappers';
import { getReferralsForReferrer } from './referralService';

const useMockApi = process.env.EXPO_PUBLIC_USE_MOCK_API !== 'false';

export async function getEarnings(): Promise<EarningsSummary> {
  if (useMockApi) return earningsSummary;
  const { referrer } = await getReferrerAccount();
  const referrals = await getReferralsForReferrer(referrer);
  return {
    totalEarned: referrer.totalRevenue,
    paid: referrer.paidOut,
    pending: referrer.balance,
    completedJobs: countCompletedReferrals(referrals),
  };
}

export async function getEarningsHistory(): Promise<EarningsTransaction[]> {
  if (useMockApi) return mockRepository.getTransactions();
  const { referrer } = await getReferrerAccount();
  const appointments = await getAppointmentsForReferrer(referrer);
  return appointments.map(mapBackendAppointmentToEarningsTransaction);
}