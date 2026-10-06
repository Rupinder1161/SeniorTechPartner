import { render } from '@testing-library/react-native';
import { EarningsCard } from '../components/EarningsCard';
import { getDashboard } from '../services/dashboardService';
import { getEarnings, getEarningsHistory } from '../services/earningsService';
import { createReferral, getReferrals } from '../services/referralService';

describe('partner data services', () => {
  it('returns dashboard statistics from the data layer', async () => {
    const dashboard = await getDashboard();
    expect(dashboard.stats).toEqual({ totalReferrals: 21, completedReferrals: 15, pendingReferrals: 3, paidReferrals: 13 });
  });

  it('creates a referral, returns it in the list, and refreshes referral counts', async () => {
    await createReferral({
      customerName: 'Casey Test',
      phone: '021 555 0199',
      address: '1 Kauri Road, Wellington',
      issueType: 'other',
      issueDescription: 'Tablet setup',
      referralCode: 'ALEX20',
      consentAccepted: true,
    });
    const referrals = await getReferrals();
    const dashboard = await getDashboard();
    const created = referrals.find((referral) => referral.customer.name === 'Casey Test');
    expect(created?.problem).toBe('Tablet setup');
    expect(created?.status).toBe('pending');
    expect(created?.commission.status).toBe('pending');
    expect(dashboard.stats.totalReferrals).toBe(22);
    expect(dashboard.stats.pendingReferrals).toBe(4);
  });

  it('renders financial values supplied by the earnings service', async () => {
    const summary = await getEarnings();
    const history = await getEarningsHistory();
    const screen = await render(<EarningsCard summary={summary} />);
    expect(screen.getByText('$420')).toBeTruthy();
    expect(screen.getByText('$300')).toBeTruthy();
    expect(screen.getByText('$80')).toBeTruthy();
    expect(screen.getByText('COMPLETED JOBS')).toBeTruthy();
    expect(screen.getByText('15')).toBeTruthy();
    expect(screen.queryByText('APPROVED')).toBeNull();
    expect(history.map((transaction) => transaction.status)).toEqual(['paid', 'approved', 'pending']);
  });
});