import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../constants/theme';
import type { Referral } from '../types';

const steps = [
  { key: 'submitted', label: 'Referral submitted' },
  { key: 'contacted', label: 'Customer contacted' },
  { key: 'booked', label: 'Job booked' },
  { key: 'completed', label: 'Job completed' },
  { key: 'approved', label: 'Commission approved' },
  { key: 'paid', label: 'Commission paid' },
] as const;

export function ReferralTimeline({ referral }: { referral: Referral }) {
  const done: Record<string, boolean> = {
    submitted: true,
    contacted: Boolean(referral.timeline.contactedAt),
    booked: Boolean(referral.timeline.bookedAt),
    completed: Boolean(referral.timeline.completedAt),
    approved: Boolean(referral.timeline.approvedAt),
    paid: Boolean(referral.timeline.paidAt),
  };
  return <View style={styles.timeline}>{steps.map((step, index) => <View style={styles.row} key={step.key}>
    <View style={styles.markerColumn}><View style={[styles.marker, done[step.key] && styles.markerDone]}><Text style={[styles.check, done[step.key] && styles.checkDone]}>{done[step.key] ? '✓' : '○'}</Text></View>{index < steps.length - 1 && <View style={[styles.line, done[step.key] && styles.lineDone]} />}</View>
    <Text style={[styles.label, !done[step.key] && styles.future]}>{step.label}</Text>
  </View>)}</View>;
}

const styles = StyleSheet.create({
  timeline: { paddingTop: spacing.sm },
  row: { minHeight: 48, flexDirection: 'row', alignItems: 'flex-start', gap: 13 },
  markerColumn: { width: 24, alignItems: 'center', height: 48 },
  marker: { width: 23, height: 23, borderRadius: 12, borderWidth: 1.5, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  markerDone: { backgroundColor: colors.green, borderColor: colors.green },
  check: { color: colors.muted, fontSize: 13, lineHeight: 17, fontWeight: '800' },
  checkDone: { color: colors.white },
  line: { width: 2, flex: 1, backgroundColor: colors.line },
  lineDone: { backgroundColor: colors.mint },
  label: { color: colors.ink, fontSize: 15, fontWeight: '600', paddingTop: 2 },
  future: { color: colors.muted, fontWeight: '500' },
});