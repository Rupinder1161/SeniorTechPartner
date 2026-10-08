import { StyleSheet, Text, View } from 'react-native';
import type { EarningsSummary } from '../types';
import { colors, radius, spacing } from '../constants/theme';
import { formatCurrency } from '../utils/format';

export function EarningsCard({ summary }: { summary: EarningsSummary }) {
  const items = [
    { label: 'PAID', value: summary.paid, currency: true },
    { label: 'COMPLETED JOBS', value: summary.completedJobs, currency: false },
    { label: 'UNPAID', value: summary.pending, currency: true },
  ];
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>TOTAL EARNED</Text>
      <Text style={styles.total}>{formatCurrency(summary.totalEarned)}</Text>
      <View style={styles.rule} />
      <View style={styles.row}>
        {items.map((item) => <View key={item.label} style={styles.metric}><Text numberOfLines={2} style={styles.label}>{item.label}</Text><Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75} style={styles.value}>{item.value === undefined ? '—' : item.currency ? formatCurrency(item.value) : item.value}</Text></View>)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.green, borderRadius: radius.lg, padding: spacing.lg, overflow: 'hidden' },
  eyebrow: { color: '#D1E9D9', fontSize: 12, fontWeight: '800' },
  total: { color: colors.white, fontSize: 38, lineHeight: 47, fontWeight: '800', marginTop: 5 },
  rule: { height: 1, backgroundColor: '#FFFFFF40', marginVertical: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  metric: { flex: 1, minWidth: 0, gap: 5 },
  label: { color: '#D1E9D9', fontSize: 11, lineHeight: 13, fontWeight: '800', height: 26 },
  value: { color: colors.white, fontSize: 17, fontWeight: '700' },
});