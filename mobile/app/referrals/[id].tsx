import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoadingState, ErrorState } from '../../components/DataStates';
import { ReferralTimeline } from '../../components/ReferralTimeline';
import { StatusBadge, CommissionBadge } from '../../components/StatusBadge';
import { colors, radius, spacing } from '../../constants/theme';
import { useReferralQuery } from '../../hooks/useAppQueries';
import { formatCurrency, formatDate } from '../../utils/format';
import { getUserMessage } from '../../utils/errors';

export default function ReferralDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const query = useReferralQuery(id ?? '');
  if (query.isLoading) return <SafeAreaView style={styles.safe}><LoadingState label="Loading referral…" /></SafeAreaView>;
  if (query.isError || !query.data) return <SafeAreaView style={styles.safe}><View style={styles.page}><Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Go back" style={styles.back}><Feather name="arrow-left" size={21} color={colors.ink} /></Pressable><ErrorState message={getUserMessage(query.error)} onRetry={() => { void query.refetch(); }} /></View></SafeAreaView>;
  const referral = query.data;
  return <SafeAreaView style={styles.safe} edges={['top']}><ScrollView contentContainerStyle={styles.page}>
    <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Go back" style={styles.back}><Feather name="arrow-left" size={21} color={colors.ink} /><Text style={styles.backText}>My Referrals</Text></Pressable>
    <View style={styles.panel}><Text style={styles.name}>{referral.customer.name}</Text><Text style={styles.problem}>{referral.problem}</Text><Text style={styles.label}>Submitted {formatDate(referral.submittedAt)}</Text><View style={styles.badges}><StatusBadge status={referral.status} /><CommissionBadge status={referral.commission.status} /></View></View>
    <View style={styles.panel}><Text style={styles.sectionTitle}>Customer details</Text><Detail label="Phone" value={referral.customer.phone} /><Detail label="Email" value={referral.customer.email || 'Not provided'} /><Detail label="Address" value={referral.customer.address || 'Not provided'} /><Detail label="Support required" value={referral.problem} /></View>
    <View style={styles.panel}><Text style={styles.sectionTitle}>Commission</Text><View style={styles.commission}><Text style={styles.amount}>{referral.commission.amount === undefined ? '—' : formatCurrency(referral.commission.amount)}</Text><CommissionBadge status={referral.commission.status} /></View></View>
    <View style={styles.panel}><Text style={styles.sectionTitle}>Referral progress</Text><ReferralTimeline referral={referral} /></View>
  </ScrollView></SafeAreaView>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <View style={styles.detail}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View>;
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.canvas }, page: { padding: spacing.md, paddingBottom: 30, gap: spacing.md, maxWidth: 660, width: '100%', alignSelf: 'center' }, back: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 8 }, backText: { color: colors.greenDark, fontSize: 15, fontWeight: '700' }, panel: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md, gap: spacing.md }, name: { color: colors.ink, fontSize: 23, fontWeight: '800' }, problem: { color: colors.ink, fontSize: 16 }, label: { color: colors.muted, fontSize: 14 }, value: { color: colors.ink, fontSize: 16, lineHeight: 22 }, badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, sectionTitle: { color: colors.ink, fontSize: 18, fontWeight: '800' }, detail: { gap: 4 }, commission: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 9 }, amount: { color: colors.greenDark, fontSize: 25, fontWeight: '800' } });