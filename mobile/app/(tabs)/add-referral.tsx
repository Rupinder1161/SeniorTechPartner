import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from '../../components/TextInput';
import { PrimaryButton } from '../../components/Buttons';
import { ScreenHeader } from '../../components/ScreenHeader';
import { colors, radius, spacing } from '../../constants/theme';
import { queryKeys } from '../../hooks/useAppQueries';
import { createReferral } from '../../services/referralService';
import type { PreferredContactMethod } from '../../types';
import { getUserMessage } from '../../utils/errors';
import { referralSchema, type ReferralFormValues } from '../../utils/validation';

const contactOptions: { value: PreferredContactMethod; label: string }[] = [{ value: 'phone', label: 'Phone' }, { value: 'email', label: 'Email' }, { value: 'text', label: 'Text' }];

export default function AddReferralScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState('');
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<ReferralFormValues>({ resolver: zodResolver(referralSchema), defaultValues: { customerName: '', phone: '', email: '', address: '', problem: '', preferredContactMethod: 'phone', notes: '' } });
  const selectedContact = watch('preferredContactMethod');
  const mutation = useMutation({ mutationFn: createReferral, onSuccess: async (referral) => {
    await Promise.all([queryClient.invalidateQueries({ queryKey: queryKeys.referrals }), queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })]);
    Alert.alert('Referral submitted successfully', 'Your referral has been sent to SeniorTech.', [{ text: 'View referral', onPress: () => router.replace(`/referrals/${referral.id}`) }]);
  }, onError: (error) => setServerError(getUserMessage(error)) });
  const field = (name: keyof ReferralFormValues, label: string, extra: { keyboardType?: 'default' | 'phone-pad' | 'email-address'; multiline?: boolean; required?: boolean } = {}) => <Controller control={control} name={name} render={({ field: { onChange, onBlur, value } }) => <TextInput label={`${label}${extra.required ? ' *' : ''}`} value={String(value ?? '')} onChangeText={onChange} onBlur={onBlur} error={errors[name]?.message} keyboardType={extra.keyboardType} multiline={extra.multiline} autoCapitalize={extra.keyboardType === 'email-address' ? 'none' : 'sentences'} />} />;
  const submit = handleSubmit((values) => { setServerError(''); mutation.mutate({ ...values, email: values.email || undefined }); });
  return <SafeAreaView style={styles.safe} edges={['top']}><KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
    <ScreenHeader title="Add a referral" subtitle="Share a customer’s details and we’ll take it from here." />
    <View style={styles.form}>
      {field('customerName', 'Customer name', { required: true })}
      {field('phone', 'Phone number', { keyboardType: 'phone-pad', required: true })}
      {field('email', 'Email address', { keyboardType: 'email-address' })}
      {field('address', 'Address')}
      {field('problem', 'Problem / support required', { multiline: true, required: true })}
      <View style={styles.contactGroup}><Text style={styles.label}>Preferred contact method</Text><View style={styles.options}>{contactOptions.map((option) => <Pressable key={option.value} accessibilityRole="radio" accessibilityState={{ checked: selectedContact === option.value }} onPress={() => setValue('preferredContactMethod', option.value)} style={[styles.option, selectedContact === option.value && styles.optionSelected]}><Text style={[styles.optionText, selectedContact === option.value && styles.optionTextSelected]}>{option.label}</Text></Pressable>)}</View></View>
      {field('notes', 'Notes for the support team', { multiline: true })}
      <Text style={styles.requiredNote}>* Required</Text>
      {serverError ? <Text accessibilityRole="alert" style={styles.error}>{serverError}</Text> : null}
      <PrimaryButton title="Submit referral" onPress={submit} loading={mutation.isPending} />
    </View>
  </ScrollView></KeyboardAvoidingView></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.canvas }, flex: { flex: 1 }, page: { padding: spacing.md, paddingBottom: 32, gap: spacing.md, maxWidth: 660, width: '100%', alignSelf: 'center' }, form: { gap: spacing.md }, contactGroup: { gap: 9 }, label: { color: colors.ink, fontSize: 14, fontWeight: '700' }, options: { flexDirection: 'row', gap: 8 }, option: { flex: 1, minHeight: 47, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white, borderColor: colors.line, borderWidth: 1, borderRadius: radius.md }, optionSelected: { backgroundColor: colors.greenSoft, borderColor: colors.green }, optionText: { color: colors.ink, fontSize: 15, fontWeight: '600' }, optionTextSelected: { color: colors.greenDark }, requiredNote: { color: colors.muted, fontSize: 13 }, error: { color: colors.red, fontSize: 14 } });