import { mockRepository } from './mockRepository';
import type { DashboardData } from '../types';
import { getReferrerAccount } from './profileService';
import { mapBackendDashboard } from './backendMappers';
import { getReferralsForReferrer } from './referralService';

const useMockApi = process.env.EXPO_PUBLIC_USE_MOCK_API !== 'false';

export async function getDashboard(): Promise<DashboardData> {
  if (useMockApi) return mockRepository.getDashboard();
  const { authUser, referrer } = await getReferrerAccount();
  const referrals = await getReferralsForReferrer(referrer);
  const dashboard = mapBackendDashboard(authUser, referrer);
  return {
    ...dashboard,
    stats: {
      totalReferrals: referrals.length,
      completedReferrals: referrals.filter((referral) => referral.status === 'completed').length,
      pendingReferrals: referrals.filter((referral) => referral.status === 'pending' || referral.status === 'booked').length,
      paidReferrals: referrals.filter((referral) => referral.commission.status === 'paid').length,
    },
    recentReferrals: referrals.slice(0, 3),
  };
}