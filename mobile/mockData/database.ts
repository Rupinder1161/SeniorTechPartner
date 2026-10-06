import type {
  DashboardStats,
  EarningsSummary,
  EarningsTransaction,
  Notification,
  Referral,
  User,
} from '../types';

export const initialUser: User = {
  id: 'partner-1',
  firstName: 'Alex',
  lastName: 'Morgan',
  email: 'alex.morgan@example.com',
  phone: '021 555 0142',
  partnerSince: '2024-03-12T00:00:00.000Z',
  role: 'referral-partner',
  referralCode: 'ALEX20',
};

export const earningsSummary: EarningsSummary = {
  totalEarned: 420,
  paid: 300,
  approved: 40,
  pending: 80,
};

export const dashboardStats: DashboardStats = {
  totalReferrals: 21,
  completedReferrals: 15,
  pendingReferrals: 3,
  paidReferrals: 13,
};

const examples: Referral[] = [
  {
    id: 'ref-1001',
    customer: { name: 'John Smith', phone: '021 333 0044', email: 'john@example.com', address: '12 Kauri Road, Wellington' },
    problem: 'Computer Support', submittedAt: '2026-10-03T09:00:00.000Z', status: 'completed',
    commission: { amount: 20, status: 'approved' },
    timeline: { contactedAt: '2026-10-03T11:00:00.000Z', bookedAt: '2026-10-04T09:00:00.000Z', completedAt: '2026-10-05T11:00:00.000Z', approvedAt: '2026-10-05T14:00:00.000Z' },
  },
  {
    id: 'ref-1002',
    customer: { name: 'Sarah Williams', phone: '027 444 0088', email: 'sarah@example.com', address: '8 Park Lane, Lower Hutt' },
    problem: 'Wi-Fi Support', submittedAt: '2026-10-04T09:00:00.000Z', status: 'pending',
    commission: { amount: 20, status: 'pending' }, timeline: {},
  },
  {
    id: 'ref-1003',
    customer: { name: 'David Singh', phone: '022 555 0177', email: 'david@example.com', address: '41 Queen Street, Porirua' },
    problem: 'Printer Setup', submittedAt: '2026-10-05T09:00:00.000Z', status: 'paid',
    commission: { amount: 20, status: 'paid' },
    timeline: { contactedAt: '2026-10-05T10:00:00.000Z', bookedAt: '2026-10-06T09:00:00.000Z', completedAt: '2026-10-07T11:00:00.000Z', approvedAt: '2026-10-08T14:00:00.000Z', paidAt: '2026-10-10T14:00:00.000Z' },
  },
];

const extraNames = ['Margaret Brown', 'Peter Wilson', 'Anne Taylor', 'Robert Chen', 'Judy Patel', 'Michael Jones', 'Helen Clark', 'George Lee', 'Susan Martin', 'Brian King', 'Dorothy White', 'Colin Scott', 'Janet Young', 'Bruce Hall', 'Moana Rangi', 'Graham Walker', 'Linda Green', 'Paul Adams'];
const problems = ['Email Help', 'Device Setup', 'Phone Support', 'Tablet Help', 'Online Safety'];
const exampleDate = new Date('2026-10-01T09:00:00.000Z');

export const initialReferrals: Referral[] = [
  ...examples,
  ...extraNames.map((name, index): Referral => {
    const status: Referral['status'] = index < 13 ? 'completed' : index < 15 ? 'pending' : 'contacted';
    const commissionStatus = index < 12 ? 'paid' : index === 12 ? 'approved' : 'pending';
    const submittedAt = new Date(exampleDate.getTime() - index * 86400000).toISOString();
    return {
      id: `ref-${1004 + index}`,
      customer: { name, phone: `021 555 ${String(1000 + index)}` },
      problem: problems[index % problems.length],
      submittedAt,
      status,
      commission: { amount: 20, status: commissionStatus },
      timeline: status === 'completed' ? { contactedAt: submittedAt, bookedAt: submittedAt, completedAt: submittedAt } : {},
    };
  }),
];

export const initialTransactions: EarningsTransaction[] = [
  { id: 'txn-1', customerName: 'John Smith', amount: 20, status: 'paid', date: '2026-10-03T09:00:00.000Z' },
  { id: 'txn-2', customerName: 'Sarah Williams', amount: 20, status: 'approved', date: '2026-10-04T09:00:00.000Z' },
  { id: 'txn-3', customerName: 'David Singh', amount: 20, status: 'pending', date: '2026-10-05T09:00:00.000Z' },
];

export const initialNotifications: Notification[] = [
  { id: 'notice-1', title: 'Commission approved', body: 'Your referral for John Smith has been approved.', createdAt: '2026-10-05T14:00:00.000Z', read: false },
  { id: 'notice-2', title: 'Referral completed', body: 'David Singh’s Printer Setup referral is complete.', createdAt: '2026-10-07T11:00:00.000Z', read: false },
];