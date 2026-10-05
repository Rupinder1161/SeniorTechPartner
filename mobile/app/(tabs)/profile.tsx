import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ScreenHeader } from '../../components/ScreenHeader';
import { PrimaryButton, SecondaryButton } from '../../components/Buttons';
import { LoadingState, ErrorState } from '../../components/DataStates';
import { EditProfileDialog, ChangePasswordDialog } from '../../components/ProfileDialogs';
import { colors, radius, spacing } from '../../constants/theme';
import { queryKeys, useProfileQuery } from '../../hooks/useAppQueries';
import { useAuth } from '../../providers/AuthProvider';
import { updateProfile } from '../../services/profileService';
import { changePassword } from '../../services/authService';
import type { UpdateProfileData } from '../../types';
import { formatDate } from '../../utils/format';
import { getUserMessage } from '../../utils/errors';

export default function ProfileScreen() {
  const query = useProfileQuery();
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const [editVisible, setEditVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const profileMutation = useMutation({ mutationFn: updateProfile, onSuccess: async (user) => { queryClient.setQueryData(queryKeys.profile, user); await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard }); setEditVisible(false); }, onError: (error) => Alert.alert('Could not update profile', getUserMessage(error)) });
  const passwordMutation = useMutation({ mutationFn: changePassword, onSuccess: () => { setPasswordVisible(false); Alert.alert('Password updated', 'Your password has been changed.'); }, onError: (error) => Alert.alert('Could not change password', getUserMessage(error)) });
  const edit = (data: UpdateProfileData) => profileMutation.mutate(data);
  if (query.isLoading) return <SafeAreaView style={styles.safe}><LoadingState label="Loading profile…" /></SafeAreaView>;
  if (query.isError || !query.data) return <SafeAreaView style={styles.safe}><ErrorState message={getUserMessage(query.error)} onRetry={() => { void query.refetch(); }} /></SafeAreaView>;
  const user = query.data;
  const confirmLogout = () => Alert.alert('Sign out?', 'You can sign back in at any time.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Sign out', style: 'destructive', onPress: () => { void logout(); } }]);
  return <SafeAreaView style={styles.safe} edges={['top']}><View style={styles.page}>
    <ScreenHeader title="Your profile" subtitle="Your SeniorTech partner details." />
    <View style={styles.panel}><ProfileRow label="First name" value={user.firstName} /><ProfileRow label="Last name" value={user.lastName} /><ProfileRow label="Email" value={user.email} /><ProfileRow label="Phone" value={user.phone} /><ProfileRow label="Partner since" value={formatDate(user.partnerSince)} /></View>
    <View style={styles.actions}><PrimaryButton title="Edit profile" onPress={() => setEditVisible(true)} /><SecondaryButton title="Change password" onPress={() => setPasswordVisible(true)} /><SecondaryButton title="Sign out" onPress={confirmLogout} /></View>
    <EditProfileDialog visible={editVisible} user={user} saving={profileMutation.isPending} onClose={() => setEditVisible(false)} onSave={edit} />
    <ChangePasswordDialog visible={passwordVisible} saving={passwordMutation.isPending} onClose={() => setPasswordVisible(false)} onSave={(data) => passwordMutation.mutate(data)} />
  </View></SafeAreaView>;
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return <View style={styles.row}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View>;
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.canvas }, page: { flex: 1, padding: spacing.md, gap: spacing.lg, maxWidth: 650, width: '100%', alignSelf: 'center' }, panel: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: spacing.md }, row: { minHeight: 62, borderBottomWidth: 1, borderBottomColor: colors.line, justifyContent: 'center', gap: 4 }, label: { color: colors.muted, fontSize: 13, fontWeight: '600' }, value: { color: colors.ink, fontSize: 16, fontWeight: '700' }, actions: { gap: 10 } });