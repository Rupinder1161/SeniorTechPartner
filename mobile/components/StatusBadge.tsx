import { StyleSheet, Text, View } from 'react-native';
import type { CommissionStatus, ReferralStatus } from '../types';
import { colors } from '../constants/theme';

const referralPresentation: Record<ReferralStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: colors.amber, bg: colors.amberSoft },
  contacted: { label: 'Contacted', color: colors.blue, bg: colors.blueSoft },
  booked: { label: 'Booked', color: colors.blue, bg: colors.blueSoft },
  completed: { label: 'Completed', color: colors.greenDark, bg: colors.greenSoft },
  approved: { label: 'Approved', color: colors.greenDark, bg: colors.greenSoft },
  paid: { label: 'Paid', color: colors.greenDark, bg: colors.greenSoft },
  rejected: { label: 'Rejected', color: colors.red, bg: colors.redSoft },
  cancelled: { label: 'Cancelled', color: colors.muted, bg: '#EDF0EE' },
};

const commissionPresentation: Record<CommissionStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Commission Pending', color: colors.amber, bg: colors.amberSoft },
  approved: { label: 'Commission Approved', color: colors.greenDark, bg: colors.greenSoft },
  paid: { label: 'Commission Paid', color: colors.blue, bg: colors.blueSoft },
  rejected: { label: 'Commission Rejected', color: colors.red, bg: colors.redSoft },
};

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return <View style={[styles.badge, { backgroundColor: bg }]}><Text style={[styles.text, { color }]}>{label}</Text></View>;
}

export function StatusBadge({ status }: { status: ReferralStatus }) {
  return <Badge {...referralPresentation[status]} />;
}

export function CommissionBadge({ status }: { status: CommissionStatus }) {
  return <Badge {...commissionPresentation[status]} />;
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', borderRadius: 7, paddingHorizontal: 9, paddingVertical: 5, maxWidth: '100%' },
  text: { fontSize: 12, fontWeight: '700', lineHeight: 16 },
});