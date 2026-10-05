import { useQuery } from '@tanstack/react-query';
import * as dashboardService from '../services/dashboardService';
import * as referralService from '../services/referralService';
import * as earningsService from '../services/earningsService';
import * as profileService from '../services/profileService';
import * as notificationService from '../services/notificationService';

export const queryKeys = {
  dashboard: ['dashboard'] as const,
  referrals: ['referrals'] as const,
  referral: (id: string) => ['referrals', id] as const,
  earnings: ['earnings'] as const,
  earningsHistory: ['earnings', 'history'] as const,
  profile: ['profile'] as const,
  notifications: ['notifications'] as const,
};

export const useDashboardQuery = () => useQuery({ queryKey: queryKeys.dashboard, queryFn: dashboardService.getDashboard });
export const useReferralsQuery = () => useQuery({ queryKey: queryKeys.referrals, queryFn: referralService.getReferrals });
export const useReferralQuery = (id: string) => useQuery({ queryKey: queryKeys.referral(id), queryFn: () => referralService.getReferral(id), enabled: Boolean(id) });
export const useEarningsQuery = () => useQuery({ queryKey: queryKeys.earnings, queryFn: earningsService.getEarnings });
export const useEarningsHistoryQuery = () => useQuery({ queryKey: queryKeys.earningsHistory, queryFn: earningsService.getEarningsHistory });
export const useProfileQuery = () => useQuery({ queryKey: queryKeys.profile, queryFn: profileService.getProfile });
export const useNotificationsQuery = () => useQuery({ queryKey: queryKeys.notifications, queryFn: notificationService.getNotifications });