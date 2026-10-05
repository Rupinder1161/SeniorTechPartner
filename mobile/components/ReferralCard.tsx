import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { Referral } from '../types';
import { colors, radius, spacing } from '../constants/theme';
import { formatCurrency, formatDate } from '../utils/format';
import { CommissionBadge, StatusBadge } from './StatusBadge';

export function ReferralCard({ referral, onPress }: { referral: Referral; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${referral.customer.name}, ${referral.problem}, ${referral.status}`} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.top}>
        <View style={styles.details}><View style={styles.nameRow}><Text style={styles.name}>{referral.customer.name}</Text><Text style={styles.amount}>{formatCurrency(referral.commission.amount)}</Text></View><Text style={styles.problem}>{referral.problem}</Text><Text style={styles.date}>Submitted {formatDate(referral.submittedAt)}</Text></View>
        <Feather name="chevron-right" size={20} color={colors.muted} />
      </View>
      <View style={styles.badges}><StatusBadge status={referral.status} /><CommissionBadge status={referral.commission.status} /></View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderColor: colors.line, borderWidth: 1, borderRadius: radius.md, padding: spacing.md, gap: 12 },
  pressed: { opacity: 0.78 },
  top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  details: { flex: 1, gap: 3 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, paddingRight: 4 },
  name: { color: colors.ink, fontSize: 17, fontWeight: '800', flex: 1 },
  problem: { color: colors.ink, fontSize: 14 },
  date: { color: colors.muted, fontSize: 13, marginTop: 3 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  amount: { color: colors.greenDark, fontSize: 15, fontWeight: '800' },
});