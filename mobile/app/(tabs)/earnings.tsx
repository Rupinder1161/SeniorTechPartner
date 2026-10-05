import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/ScreenHeader';
import { EarningsCard } from '../../components/EarningsCard';
import { CommissionBadge } from '../../components/StatusBadge';
import { FilterTabs } from '../../components/SearchAndFilters';
import { EmptyState, ErrorState, LoadingState } from '../../components/DataStates';
import { colors, radius, spacing } from '../../constants/theme';
import { useEarningsHistoryQuery, useEarningsQuery } from '../../hooks/useAppQueries';
import type { CommissionStatus } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';
import { getUserMessage } from '../../utils/errors';

const filters = ['All', 'Pending', 'Approved', 'Paid'] as const;
type Filter = typeof filters[number];

export default function EarningsScreen() {
  const summary = useEarningsQuery();
  const history = useEarningsHistoryQuery();
  const [filter, setFilter] = useState<Filter>('All');
  if (summary.isLoading || history.isLoading) return <SafeAreaView style={styles.safe}><LoadingState label="Loading earnings…" /></SafeAreaView>;
  if (summary.isError || history.isError || !summary.data || !history.data) return <SafeAreaView style={styles.safe}><ErrorState message={getUserMessage(summary.error ?? history.error)} onRetry={() => { void summary.refetch(); void history.refetch(); }} /></SafeAreaView>;
  const transactions = history.data.filter((transaction) => filter === 'All' || transaction.status === filter.toLowerCase());
  return <SafeAreaView style={styles.safe} edges={['top']}><FlatList
    data={transactions}
    keyExtractor={(item) => item.id}
    contentContainerStyle={styles.page}
    ListHeaderComponent={<View style={styles.header}><ScreenHeader title="Earnings" subtitle="Your commission at a glance." /><EarningsCard summary={summary.data} /><Text style={styles.title}>Earnings history</Text><FilterTabs options={filters} selected={filter} onSelect={setFilter} /></View>}
    ItemSeparatorComponent={() => <View style={{ height: 9 }} />}
    renderItem={({ item }) => <View style={styles.transaction}><View style={styles.left}><Text style={styles.customer}>{item.customerName}</Text><CommissionBadge status={item.status} /><Text style={styles.date}>{formatDate(item.date)}</Text></View><Text style={styles.amount}>{formatCurrency(item.amount)}</Text></View>}
    ListEmptyComponent={<EmptyState title="No earnings yet" description="Commission activity will appear here when your referrals progress." />}
  /></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.canvas }, page: { padding: spacing.md, paddingBottom: 30, maxWidth: 760, width: '100%', alignSelf: 'center' }, header: { gap: spacing.lg, marginBottom: spacing.md }, title: { color: colors.ink, fontSize: 20, fontWeight: '800', marginBottom: -10 }, transaction: { minHeight: 102, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.white, padding: spacing.md }, left: { flex: 1, gap: 8 }, customer: { color: colors.ink, fontSize: 16, fontWeight: '700' }, date: { color: colors.muted, fontSize: 13 }, amount: { color: colors.greenDark, fontSize: 18, fontWeight: '800' } });