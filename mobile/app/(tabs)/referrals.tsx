import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SearchBar, FilterTabs } from '../../components/SearchAndFilters';
import { ReferralCard } from '../../components/ReferralCard';
import { EmptyState, ErrorState, LoadingState } from '../../components/DataStates';
import { colors, spacing } from '../../constants/theme';
import { useReferralsQuery } from '../../hooks/useAppQueries';
import type { Referral } from '../../types';
import { getUserMessage } from '../../utils/errors';

const filters = ['All', 'Pending', 'Completed', 'Approved', 'Paid', 'Rejected'] as const;
type Filter = typeof filters[number];

function matchesFilter(referral: Referral, filter: Filter): boolean {
  if (filter === 'All') return true;
  if (filter === 'Pending') return ['pending', 'contacted', 'booked'].includes(referral.status);
  if (filter === 'Approved' || filter === 'Paid') return referral.commission.status === filter.toLowerCase();
  return referral.status === filter.toLowerCase();
}

export default function ReferralsScreen() {
  const router = useRouter();
  const query = useReferralsQuery();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const referrals = useMemo(() => (query.data ?? []).filter((referral) => matchesFilter(referral, filter) && referral.customer.name.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())), [filter, query.data, search]);
  const listHeader = <View style={styles.header}><ScreenHeader title="My Referrals" subtitle="Keep track of everyone you’ve referred." /><SearchBar value={search} onChangeText={setSearch} /><FilterTabs options={filters} selected={filter} onSelect={setFilter} /></View>;
  if (query.isLoading) return <SafeAreaView style={styles.safe}><View style={styles.page}>{listHeader}<LoadingState label="Loading referrals…" /></View></SafeAreaView>;
  if (query.isError) return <SafeAreaView style={styles.safe}><View style={styles.page}>{listHeader}<ErrorState message={getUserMessage(query.error)} onRetry={() => { void query.refetch(); }} /></View></SafeAreaView>;
  return <SafeAreaView style={styles.safe} edges={['top']}><FlatList
    data={referrals}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => <ReferralCard referral={item} onPress={() => router.push(`/referrals/${item.id}`)} />}
    contentContainerStyle={styles.page}
    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
    ListHeaderComponent={listHeader}
    ListEmptyComponent={<EmptyState title="No referrals found" description={search ? 'Try another customer name or filter.' : 'No referrals yet. Refer your first customer to SeniorTech.'} />}
    refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={() => { void query.refetch(); }} tintColor={colors.green} />}
  /></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.canvas }, page: { padding: spacing.md, paddingBottom: 30, maxWidth: 760, width: '100%', alignSelf: 'center' }, header: { gap: spacing.md, marginBottom: spacing.md } });