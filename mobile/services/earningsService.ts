import { earningsSummary } from '../mockData/database';
import { mockRepository } from './mockRepository';
import type { EarningsSummary, EarningsTransaction } from '../types';
import { getReferrerAccount } from './profileService';
import { getAppointmentsForReferrer } from './referralService';
import { mapBackendAppointmentToEarningsTransaction } from './backendMappers';

const useMockApi = process.env.EXPO_PUBLIC_USE_MOCK_API !== 'false';

export async function getEarnings(): Promise<EarningsSummary> {
  if (useMockApi) return earningsSummary;
  const { referrer } = await getReferrerAccount();
  return {
    totalEarned: referrer.totalRevenue,
    paid: referrer.paidOut,
    pending: referrer.balance,
  };
}

export async function getEarningsHistory(): Promise<EarningsTransaction[]> {
  if (useMockApi) return mockRepository.getTransactions();
  const { referrer } = await getReferrerAccount();
  const appointments = await getAppointmentsForReferrer(referrer);
  return appointments.map(mapBackendAppointmentToEarningsTransaction);
}