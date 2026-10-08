import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useNotificationsQuery } from '../hooks/useAppQueries';
import { requestNotificationPermission } from '../services/notificationService';
import { LoadingState, EmptyState, ErrorState } from '../components/DataStates';
import { PrimaryButton } from '../components/Buttons';
import { colors, radius, spacing } from '../constants/theme';
import { formatCurrency, formatDate } from '../utils/format';
import { getUserMessage } from '../utils/errors';

export default function NotificationsScreen() {
  const router = useRouter();
  const query = useNotificationsQuery();
  const [enabling, setEnabling] = useState(false);
  const [permissionMessage, setPermissionMessage] = useState('');
  const enable = async () => {
    setEnabling(true);
    try { const token = await requestNotificationPermission(); setPermissionMessage(token ? 'Notifications are enabled on this device.' : 'Notifications are not enabled. You can change this in device settings.'); }
    catch (error) { setPermissionMessage(getUserMessage(error)); }
    finally { setEnabling(false); }
  };
  return <SafeAreaView style={styles.safe} edges={['top']}><ScrollView contentContainerStyle={styles.page}>
    <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Go back" style={styles.back}><Feather name="arrow-left" size={21} color={colors.ink} /><Text style={styles.backLabel}>Dashboard</Text></Pressable>
    <Text style={styles.title}>Notifications</Text><Text style={styles.subtitle}>Updates about your referral progress and commissions.</Text>
    <PrimaryButton title={enabling ? 'Enabling…' : 'Enable notifications'} onPress={() => { void enable(); }} disabled={enabling} />
    {permissionMessage ? <Text accessibilityRole="alert" style={styles.message}>{permissionMessage}</Text> : null}
    {query.isLoading ? <LoadingState label="Loading notifications…" /> : query.isError ? <ErrorState message={getUserMessage(query.error)} onRetry={() => { void query.refetch(); }} /> : query.data?.length ? <View style={styles.list}>{query.data.map((item) => <View key={item.id} style={styles.notice}><View style={styles.icon}><Feather name="bell" size={18} color={colors.green} /></View><View style={styles.content}><Text style={styles.noticeTitle}>{item.title}</Text><Text style={styles.body}>{item.body}</Text>{item.amount !== undefined ? <Text style={styles.amount}>Reward: {formatCurrency(item.amount)}</Text> : null}<Text style={styles.date}>{formatDate(item.createdAt)}</Text></View></View>)}</View> : <EmptyState title="You're all caught up" description="Referral and commission updates will show here." />}
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.canvas }, page: { flexGrow: 1, padding: spacing.md, paddingBottom: 28, gap: spacing.md, maxWidth: 660, width: '100%', alignSelf: 'center' }, back: { minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 8 }, backLabel: { color: colors.greenDark, fontSize: 15, fontWeight: '700' }, title: { color: colors.ink, fontSize: 27, fontWeight: '800' }, subtitle: { color: colors.muted, fontSize: 15, lineHeight: 21 }, message: { color: colors.greenDark, fontSize: 14 }, list: { gap: 9, marginTop: spacing.sm }, notice: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md, flexDirection: 'row', gap: spacing.md }, icon: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.greenSoft, alignItems: 'center', justifyContent: 'center' }, content: { flex: 1, gap: 6 }, noticeTitle: { color: colors.ink, fontSize: 16, fontWeight: '800' }, body: { color: colors.ink, fontSize: 14, lineHeight: 20 }, amount: { color: colors.greenDark, fontSize: 15, fontWeight: '800' }, date: { color: colors.muted, fontSize: 12 } });