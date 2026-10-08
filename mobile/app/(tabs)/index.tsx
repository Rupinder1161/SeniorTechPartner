import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
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
  useFocusEffect(useCallback(() => {
    void query.refetch();
  }, [query.refetch]));
  if (query.isLoading) return <SafeAreaView style={styles.safe}><LoadingState label="Loading your dashboard…" /></SafeAreaView>;
  if (query.isError || !query.data) return <SafeAreaView style={styles.safe}><ErrorState message={getUserMessage(query.error)} onRetry={() => { void query.refetch(); }} /></SafeAreaView>;
  const { user, earnings, stats, recentReferrals } = query.data;
  return <SafeAreaView style={styles.safe} edges={['top']}><ScrollView contentContainerStyle={styles.page}>
    <View style={styles.brandRow}><SeniorTechLogo compact /></View>
    <View style={styles.welcome}><Text style={styles.greeting}>Welcome back, {user.firstName}</Text><Text style={styles.subheading}>Here’s how your referrals are going.</Text></View>
    <EarningsCard summary={earnings} />
    <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>Referral statistics</Text></View>
    <View style={styles.stats}>
      <StatCard label="TOTAL REFERRALS" value={stats.totalReferrals} onPress={() => router.push({ pathname: '/(tabs)/referrals', params: { filter: 'all' } })} />
      <StatCard label="COMPLETED" value={stats.completedReferrals} onPress={() => router.push({ pathname: '/(tabs)/referrals', params: { filter: 'completed' } })} />
      <StatCard label="PENDING" value={stats.pendingReferrals} onPress={() => router.push({ pathname: '/(tabs)/referrals', params: { filter: 'pending' } })} />
      <StatCard label="IN PROGRESS" value={stats.inProgressReferrals ?? 0} onPress={() => router.push({ pathname: '/(tabs)/referrals', params: { filter: 'in-progress' } })} />
    </View>
    <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>Recent referrals</Text>{recentReferrals ? <Pressable onPress={() => router.push('/(tabs)/referrals')} accessibilityRole="button"><Text style={styles.viewAll}>View all referrals</Text></Pressable> : null}</View>
    {recentReferrals ? <View style={styles.recent}>{recentReferrals.map((referral) => <ReferralCard key={referral.id} referral={referral} onPress={() => router.push(`/referrals/${referral.id}`)} />)}</View> : <Text style={styles.subheading}>Referral details aren’t available through the current partner API.</Text>}
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.canvas }, page: { padding: spacing.md, paddingBottom: 32, gap: spacing.lg, maxWidth: 760, width: '100%', alignSelf: 'center' }, brandRow: { flexDirection: 'row', alignItems: 'center' }, welcome: { gap: 5 }, greeting: { color: colors.ink, fontSize: 25, fontWeight: '800' }, subheading: { color: colors.muted, fontSize: 15 }, sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: -8 }, sectionTitle: { color: colors.ink, fontSize: 19, fontWeight: '800' }, stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, viewAll: { color: colors.greenDark, fontSize: 14, fontWeight: '700' }, recent: { gap: 10 } });