export type ReferralStatus =
  | 'pending'
  | 'contacted'
  | 'booked'
  | 'completed'
  | 'approved'
  | 'paid'
  | 'rejected'
  | 'cancelled';

export type CommissionStatus = 'pending' | 'approved' | 'paid' | 'rejected';
export type PreferredContactMethod = 'phone' | 'email' | 'text';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  partnerSince: string;
  role: 'referral-partner';
}

export interface Customer {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface Commission {
  amount: number;
  status: CommissionStatus;
}

export interface Referral {
  id: string;
  customer: Customer;
  problem: string;
  submittedAt: string;
  status: ReferralStatus;
  commission: Commission;
  preferredContactMethod?: PreferredContactMethod;
  notes?: string;
  timeline: {
    contactedAt?: string;
    bookedAt?: string;
    completedAt?: string;
    approvedAt?: string;
    paidAt?: string;
  };
}

export interface DashboardStats {
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  paidReferrals: number;
}

export interface EarningsSummary {
  totalEarned: number;
  paid: number;
  approved: number;
  pending: number;
}

export interface EarningsTransaction {
  id: string;
  customerName: string;
  amount: number;
  status: CommissionStatus;
  date: string;
}

export interface DashboardData {
  user: User;
  earnings: EarningsSummary;
  stats: DashboardStats;
  recentReferrals: Referral[];
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
  phone: string;
}

export interface CreateReferralData {
  customerName: string;
  phone: string;
  email?: string;
  address?: string;
  problem: string;
  preferredContactMethod?: PreferredContactMethod;
  notes?: string;
}

export type UpdateProfileData = Pick<User, 'firstName' | 'lastName' | 'email' | 'phone'>;