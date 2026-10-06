import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SeniorTechLogo } from '../../components/SeniorTechLogo';
import { EarningsCard } from '../../components/EarningsCard';
import { StatCard } from '../../components/StatCard';
import { ReferralCard } from '../../components/ReferralCard';
import { LoadingState, ErrorState } from '../../components/DataStates';
import { colors, spacing } from '../../constants/theme';
import { useDashboardQuery } from '../../hooks/useAppQueries';
import { getUserMessage } from '../../utils/errors';

export default function DashboardScreen() {
  const router = useRouter();
  const query = useDashboardQuery();
  if (query.isLoading) return <SafeAreaView style={styles.safe}><LoadingState label="Loading your dashboard…" /></SafeAreaView>;
  if (query.isError || !query.data) return <SafeAreaView style={styles.safe}><ErrorState message={getUserMessage(query.error)} onRetry={() => { void query.refetch(); }} /></SafeAreaView>;
  const { user, earnings, stats, recentReferrals } = query.data;
  return <SafeAreaView style={styles.safe} edges={['top']}><ScrollView contentContainerStyle={styles.page}>
    <View style={styles.brandRow}><SeniorTechLogo compact /><Pressable onPress={() => router.push('/notifications')} accessibilityRole="button" accessibilityLabel="Notifications" style={styles.bell}><Feather name="bell" size={21} color={colors.ink} /></Pressable></View>
    <View style={styles.welcome}><Text style={styles.greeting}>Welcome back, {user.firstName}</Text><Text style={styles.subheading}>Here’s how your referrals are going.</Text></View>
    <EarningsCard summary={earnings} />
    <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>Referral statistics</Text></View>
    <View style={styles.stats}>
      <StatCard label="TOTAL REFERRALS" value={stats.totalReferrals} />
      <StatCard label="COMPLETED" value={stats.completedReferrals} />
      <StatCard label="PENDING" value={stats.pendingReferrals} />
      <StatCard label="PAID" value={stats.paidReferrals ?? '—'} />
    </View>
    <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>Recent referrals</Text>{recentReferrals ? <Pressable onPress={() => router.push('/(tabs)/referrals')} accessibilityRole="button"><Text style={styles.viewAll}>View all referrals</Text></Pressable> : null}</View>
    {recentReferrals ? <View style={styles.recent}>{recentReferrals.map((referral) => <ReferralCard key={referral.id} referral={referral} onPress={() => router.push(`/referrals/${referral.id}`)} />)}</View> : <Text style={styles.subheading}>Referral details aren’t available through the current partner API.</Text>}
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.canvas }, page: { padding: spacing.md, paddingBottom: 32, gap: spacing.lg, maxWidth: 760, width: '100%', alignSelf: 'center' }, brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, bell: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: 13 }, welcome: { gap: 5 }, greeting: { color: colors.ink, fontSize: 25, fontWeight: '800' }, subheading: { color: colors.muted, fontSize: 15 }, sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: -8 }, sectionTitle: { color: colors.ink, fontSize: 19, fontWeight: '800' }, stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, viewAll: { color: colors.greenDark, fontSize: 14, fontWeight: '700' }, recent: { gap: 10 } });