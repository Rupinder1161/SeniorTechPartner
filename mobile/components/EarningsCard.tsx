import { StyleSheet, Text, View } from 'react-native';
import type { EarningsSummary } from '../types';
import { colors, radius, spacing } from '../constants/theme';
import { formatCurrency } from '../utils/format';

export function EarningsCard({ summary }: { summary: EarningsSummary }) {
  const items = [
    { label: 'PAID', value: summary.paid },
    { label: 'APPROVED', value: summary.approved },
    { label: 'PENDING', value: summary.pending },
  ];
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>TOTAL EARNED</Text>
      <Text style={styles.total}>{formatCurrency(summary.totalEarned)}</Text>
      <View style={styles.rule} />
      <View style={styles.row}>
        {items.map((item) => <View key={item.label} style={styles.metric}><Text style={styles.label}>{item.label}</Text><Text style={styles.value}>{item.value === undefined ? '—' : formatCurrency(item.value)}</Text></View>)}
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
  metric: { flex: 1, gap: 5 },
  label: { color: '#D1E9D9', fontSize: 11, fontWeight: '800' },
  value: { color: colors.white, fontSize: 17, fontWeight: '700' },
});