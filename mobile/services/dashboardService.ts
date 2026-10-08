import { mockRepository } from './mockRepository';
import type { DashboardData } from '../types';
import { getReferrerAccount } from './profileService';
import { countCompletedReferrals, mapBackendDashboard } from './backendMappers';
import { getReferralsForReferrer } from './referralService';

const useMockApi = process.env.EXPO_PUBLIC_USE_MOCK_API !== 'false';

export async function getDashboard(): Promise<DashboardData> {
  if (useMockApi) return mockRepository.getDashboard();
  const { authUser, referrer } = await getReferrerAccount();
  const referrals = await getReferralsForReferrer(referrer);
  const dashboard = mapBackendDashboard(authUser, referrer);
  const completedJobs = countCompletedReferrals(referrals);
  return {
    ...dashboard,
    earnings: { ...dashboard.earnings, completedJobs },
    stats: {
      totalReferrals: referrals.length,
      completedReferrals: completedJobs,
      pendingReferrals: referrals.filter((referral) => referral.status === 'pending').length,
      inProgressReferrals: referrals.filter((referral) => referral.status === 'contacted' || referral.status === 'booked').length,
    },
    recentReferrals: referrals.slice(0, 3),
  };
}