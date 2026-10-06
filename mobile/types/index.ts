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
export type AppointmentIssueType = 'mobile' | 'pc' | 'wifi' | 'other';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  partnerSince: string;
  role: 'referral-partner';
  referralCode?: string;
}

export interface Customer {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface Commission {
  amount?: number;
  status: CommissionStatus;
}

export interface BackendAppointment {
  _id: string;
  customerName?: string;
  phone?: string;
  email?: string;
  address?: string;
  issueType?: string;
  issueDescription?: string;
  createdAt?: string;
  status?: string;
  referralStatus?: string;
  referralCode?: string;
  referrer?: { email?: string; referralCode?: string };
  referralRewardGiven?: boolean;
}

export interface AddressCheckResponse {
  valid: boolean;
  formattedAddress?: string;
  message?: string;
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
  paidReferrals?: number;
}

export interface EarningsSummary {
  totalEarned: number;
  paid: number;
  approved?: number;
  pending: number;
}

export interface EarningsTransaction {
  id: string;
  customerName: string;
  amount?: number;
  status: CommissionStatus;
  date: string;
  dateLabel?: string;
}

export interface DashboardData {
  user: User;
  earnings: EarningsSummary;
  stats: DashboardStats;
  recentReferrals?: Referral[];
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

export interface BackendAuthUser {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface BackendLoginResponse {
  token?: string;
  user?: BackendAuthUser;
}

export interface BackendReferrer {
  _id: string;
  userId: string | BackendAuthUser;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  referralCode: string;
  totalReferrals: number;
  scheduledReferrals: number;
  successfulReferrals: number;
  unsuccessfulReferrals: number;
  totalRevenue: number;
  paidOut: number;
  balance: number;
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
  address: string;
  issueType: AppointmentIssueType;
  issueDescription: string;
  referralCode: string;
  preferredDate?: string;
  preferredTime?: string;
  consentAccepted: boolean;
}

export type UpdateProfileData = Pick<User, 'firstName' | 'lastName' | 'email' | 'phone'>;