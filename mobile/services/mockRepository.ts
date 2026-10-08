import {
  dashboardStats,
  earningsSummary,
  initialNotifications,
  initialReferrals,
  initialTransactions,
  initialUser,
} from '../mockData/database';
import type {
  CreateReferralData,
  EarningsTransaction,
  Notification,
  Referral,
  UpdateProfileData,
  User,
} from '../types';

class MockRepository {
  private user = { ...initialUser };
  private referrals = [...initialReferrals];
  private transactions = [...initialTransactions];
  private stats = { ...dashboardStats };

  getUser(): User { return { ...this.user }; }
  updateUser(data: UpdateProfileData): User {
    this.user = { ...this.user, ...data };
    return this.getUser();
  }
  getDashboard() {
    return {
      user: this.getUser(),
      earnings: earningsSummary,
      stats: {
        ...this.stats,
        pendingReferrals: this.referrals.filter((referral) => referral.status === 'pending').length,
        inProgressReferrals: this.referrals.filter((referral) => referral.status === 'contacted' || referral.status === 'booked').length,
      },
      recentReferrals: this.referrals.slice(0, 3),
    };
  }
  getReferrals(): Referral[] { return [...this.referrals]; }
  getReferral(id: string): Referral | undefined { return this.referrals.find((referral) => referral.id === id); }
  createReferral(data: CreateReferralData): Referral {
    const referral: Referral = {
      id: `ref-${Date.now()}`,
      customer: { name: data.customerName, phone: data.phone, email: data.email, address: data.address },
      problem: data.issueType === 'other' ? data.issueDescription : `${data.issueType.toUpperCase()}: ${data.issueDescription}`,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      commission: { amount: 20, status: 'pending' },
      timeline: {},
    };
    this.referrals = [referral, ...this.referrals];
    this.stats = { ...this.stats, totalReferrals: this.stats.totalReferrals + 1, pendingReferrals: this.stats.pendingReferrals + 1 };
    return referral;
  }
  getTransactions(): EarningsTransaction[] { return [...this.transactions]; }
  getNotifications(): Notification[] { return [...initialNotifications]; }
}

export const mockRepository = new MockRepository();