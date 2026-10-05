import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import type { UpdateProfileData, User } from '../types';
import { colors, radius, spacing } from '../constants/theme';
import { PrimaryButton, SecondaryButton } from './Buttons';
import { TextInput } from './TextInput';

const profileSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.email('Enter a valid email address'),
  phone: z.string().trim().min(7, 'Enter a valid phone number'),
});
type ProfileValues = z.infer<typeof profileSchema>;
const passwordSchema = z.object({ currentPassword: z.string().min(1, 'Current password is required'), newPassword: z.string().min(8, 'Use at least 8 characters'), confirmPassword: z.string() }).refine((values) => values.newPassword === values.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match' });
type PasswordValues = z.infer<typeof passwordSchema>;

export function EditProfileDialog({ visible, user, saving, onClose, onSave }: { visible: boolean; user: User; saving: boolean; onClose: () => void; onSave: (data: UpdateProfileData) => void }) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ProfileValues>({ resolver: zodResolver(profileSchema), defaultValues: { firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone } });
  useEffect(() => { reset({ firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone }); }, [reset, user]);
  const input = (name: keyof ProfileValues, label: string, keyboardType?: 'default' | 'phone-pad' | 'email-address') => <Controller control={control} name={name} render={({ field: { onChange, onBlur, value } }) => <TextInput label={label} value={value} onChangeText={onChange} onBlur={onBlur} error={errors[name]?.message} keyboardType={keyboardType} autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'} />} />;
  return <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"><Text style={styles.title}>Edit profile</Text>{input('firstName', 'First name')}{input('lastName', 'Last name')}{input('email', 'Email address', 'email-address')}{input('phone', 'Phone number', 'phone-pad')}<PrimaryButton title="Save changes" loading={saving} onPress={handleSubmit(onSave)} /><SecondaryButton title="Cancel" onPress={onClose} /></ScrollView></Modal>;
}

export function ChangePasswordDialog({ visible, saving, onClose, onSave }: { visible: boolean; saving: boolean; onClose: () => void; onSave: (data: { currentPassword: string; newPassword: string }) => void }) {
  const { control, handleSubmit, formState: { errors }, reset } = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema), defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' } });
  useEffect(() => { if (!visible) reset(); }, [reset, visible]);
  const input = (name: keyof PasswordValues, label: string) => <Controller control={control} name={name} render={({ field: { onChange, onBlur, value } }) => <TextInput label={label} value={value} onChangeText={onChange} onBlur={onBlur} error={errors[name]?.message} secureTextEntry autoCapitalize="none" />} />;
  return <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}><View style={styles.content}><Text style={styles.title}>Change password</Text>{input('currentPassword', 'Current password')}{input('newPassword', 'New password')}{input('confirmPassword', 'Confirm new password')}<PrimaryButton title="Update password" loading={saving} onPress={handleSubmit(({ currentPassword, newPassword }) => onSave({ currentPassword, newPassword }))} /><SecondaryButton title="Cancel" onPress={onClose} /></View></Modal>;
}

const styles = StyleSheet.create({ content: { flexGrow: 1, padding: spacing.lg, paddingTop: spacing.xl, gap: spacing.md, backgroundColor: colors.canvas }, title: { color: colors.ink, fontSize: 24, fontWeight: '800', marginBottom: spacing.sm } });