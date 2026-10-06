import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from '../../components/TextInput';
import { PrimaryButton, SecondaryButton } from '../../components/Buttons';
import { ScreenHeader } from '../../components/ScreenHeader';
import { colors, radius, spacing } from '../../constants/theme';
import { queryKeys, useProfileQuery } from '../../hooks/useAppQueries';
import { checkAppointmentAddress, createReferral } from '../../services/referralService';
import type { AppointmentIssueType } from '../../types';
import { getUserMessage } from '../../utils/errors';
import { referralSchema, type ReferralFormValues } from '../../utils/validation';

const issueOptions: { value: AppointmentIssueType; label: string }[] = [{ value: 'mobile', label: 'Mobile' }, { value: 'pc', label: 'PC' }, { value: 'wifi', label: 'Wi-Fi' }, { value: 'other', label: 'Other' }];

export default function AddReferralScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const profile = useProfileQuery();
  const [serverError, setServerError] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [addressCheckMessage, setAddressCheckMessage] = useState('');
  const [addressValid, setAddressValid] = useState<boolean | null>(null);
  const [checkingAddress, setCheckingAddress] = useState(false);
  const { control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ReferralFormValues>({ resolver: zodResolver(referralSchema), defaultValues: { customerName: '', phone: '', email: '', address: '', issueType: 'mobile', issueDescription: '', referralCode: '', preferredDate: '', preferredTime: '', consentAccepted: false } });
  const selectedIssue = watch('issueType');
  const consentAccepted = watch('consentAccepted');
  const referralCode = profile.data?.referralCode ?? '';

  useEffect(() => {
    if (referralCode) setValue('referralCode', referralCode, { shouldValidate: true });
  }, [referralCode, setValue]);

  const mutation = useMutation({ mutationFn: createReferral, onSuccess: async () => {
    await Promise.all([queryClient.invalidateQueries({ queryKey: queryKeys.referrals }), queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })]);
    reset({ customerName: '', phone: '', email: '', address: '', issueType: 'mobile', issueDescription: '', referralCode, preferredDate: '', preferredTime: '', consentAccepted: false });
    setAddressCheckMessage('');
    setAddressValid(null);
    setServerError('');
    setSubmissionSuccess(true);
  }, onError: (error) => setServerError(getUserMessage(error)) });
  const field = (name: keyof ReferralFormValues, label: string, extra: { keyboardType?: 'default' | 'phone-pad' | 'email-address'; multiline?: boolean; required?: boolean; editable?: boolean; placeholder?: string } = {}) => <Controller control={control} name={name} render={({ field: { onChange, onBlur, value } }) => <TextInput label={`${label}${extra.required ? ' *' : ''}`} value={String(value ?? '')} onChangeText={onChange} onBlur={onBlur} error={errors[name]?.message} keyboardType={extra.keyboardType} multiline={extra.multiline} editable={extra.editable} placeholder={extra.placeholder} autoCapitalize={extra.keyboardType === 'email-address' ? 'none' : 'sentences'} />} />;

  const handleCheckAddress = async () => {
    const address = watch('address').trim();
    if (!address) {
      setAddressValid(false);
      setAddressCheckMessage('Please enter an address first.');
      return;
    }
    setCheckingAddress(true);
    setAddressValid(null);
    setAddressCheckMessage('Checking address…');
    try {
      const result = await checkAppointmentAddress(address);
      setAddressValid(result.valid);
      setAddressCheckMessage(result.valid
        ? `Valid address: ${result.formattedAddress ?? address}`
        : result.message ?? 'Address not found.');
    } catch (error) {
      setAddressValid(false);
      setAddressCheckMessage(getUserMessage(error));
    } finally {
      setCheckingAddress(false);
    }
  };

  const submit = handleSubmit((values) => {
    setServerError('');
    setSubmissionSuccess(false);
    mutation.mutate({ ...values, email: values.email || undefined, referralCode });
  });
  return <SafeAreaView style={styles.safe} edges={['top']}><KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
    <ScreenHeader title="Add a referral" subtitle="Share a customer’s details and we’ll take it from here." />
    {submissionSuccess ? <View accessibilityRole="alert" style={styles.successPanel}>
      <View style={styles.successHeading}><Feather name="check-circle" size={22} color={colors.green} /><Text style={styles.successTitle}>Submitted successfully</Text></View>
      <Text style={styles.successBody}>Your appointment request has been sent to SeniorTech. Would you like to submit another?</Text>
      <View style={styles.successActions}>
        <SecondaryButton title="Done" onPress={() => router.replace('/(tabs)')} style={styles.actionButton} />
        <PrimaryButton title="Submit another" onPress={() => setSubmissionSuccess(false)} style={styles.actionButton} />
      </View>
    </View> : null}
    <View style={styles.form}>
      {field('customerName', 'Customer name', { required: true })}
      {field('phone', 'Phone number', { keyboardType: 'phone-pad', required: true })}
      {field('email', 'Email address', { keyboardType: 'email-address' })}
      {field('referralCode', 'Your referral code', { editable: false, required: true })}
      <View style={styles.issueGroup}><Text style={styles.label}>Support required</Text><View style={styles.options}>{issueOptions.map((option) => <Pressable key={option.value} accessibilityRole="radio" accessibilityState={{ checked: selectedIssue === option.value }} onPress={() => setValue('issueType', option.value)} style={[styles.option, selectedIssue === option.value && styles.optionSelected]}><Text style={[styles.optionText, selectedIssue === option.value && styles.optionTextSelected]}>{option.label}</Text></Pressable>)}</View></View>
      {field('preferredDate', 'Preferred date', { placeholder: 'YYYY-MM-DD' })}
      {field('preferredTime', 'Preferred time', { placeholder: 'HH:MM' })}
      {field('address', 'Address', { required: true })}
      <SecondaryButton title={checkingAddress ? 'Checking address…' : 'Check address'} onPress={() => { void handleCheckAddress(); }} disabled={checkingAddress} />
      {addressCheckMessage ? <Text accessibilityRole="alert" style={addressValid ? styles.success : styles.error}>{addressCheckMessage}</Text> : null}
      {field('issueDescription', 'Describe the issue', { multiline: true, required: true })}
      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: consentAccepted }} onPress={() => setValue('consentAccepted', !consentAccepted, { shouldValidate: true })} style={styles.consentRow}>
        <View style={[styles.checkbox, consentAccepted && styles.checkboxChecked]}>{consentAccepted ? <Feather name="check" size={16} color={colors.white} /> : null}</View>
        <Text style={styles.consentText}>I agree that the technician may access the customer’s device/network for repair purposes and understand data loss may occur. The company is not liable for pre-existing issues or data loss during troubleshooting.</Text>
      </Pressable>
      {errors.consentAccepted?.message ? <Text accessibilityRole="alert" style={styles.error}>{errors.consentAccepted.message}</Text> : null}
      <Text style={styles.requiredNote}>* Required</Text>
      {profile.isLoading ? <Text style={styles.requiredNote}>Loading your partner referral code…</Text> : null}
      {profile.isError ? <Text accessibilityRole="alert" style={styles.error}>{getUserMessage(profile.error)}</Text> : null}
      {!profile.isLoading && !profile.isError && !referralCode ? <Text accessibilityRole="alert" style={styles.error}>Your referral code is unavailable. Please sign in again.</Text> : null}
      {serverError ? <Text accessibilityRole="alert" style={styles.error}>{serverError}</Text> : null}
      <PrimaryButton title="Submit referral" onPress={submit} loading={mutation.isPending} disabled={profile.isLoading || profile.isError || !referralCode} />
    </View>
  </ScrollView></KeyboardAvoidingView></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.canvas }, flex: { flex: 1 }, page: { padding: spacing.md, paddingBottom: 32, gap: spacing.md, maxWidth: 660, width: '100%', alignSelf: 'center' }, form: { gap: spacing.md }, successPanel: { backgroundColor: colors.greenSoft, borderWidth: 1, borderColor: colors.mint, borderRadius: radius.md, padding: spacing.md, gap: spacing.md }, successHeading: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, successTitle: { color: colors.greenDark, fontSize: 18, fontWeight: '800' }, successBody: { color: colors.ink, fontSize: 15, lineHeight: 22 }, successActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }, actionButton: { flexGrow: 1, flexBasis: 140 }, issueGroup: { gap: 9 }, label: { color: colors.ink, fontSize: 14, fontWeight: '700' }, options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, option: { flexGrow: 1, minWidth: '22%', minHeight: 47, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white, borderColor: colors.line, borderWidth: 1, borderRadius: radius.md }, optionSelected: { backgroundColor: colors.greenSoft, borderColor: colors.green }, optionText: { color: colors.ink, fontSize: 15, fontWeight: '600' }, optionTextSelected: { color: colors.greenDark }, consentRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }, checkbox: { width: 25, height: 25, borderWidth: 1, borderColor: colors.line, borderRadius: 5, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' }, checkboxChecked: { backgroundColor: colors.green, borderColor: colors.green }, consentText: { flex: 1, color: colors.ink, fontSize: 14, lineHeight: 21 }, requiredNote: { color: colors.muted, fontSize: 13 }, success: { color: colors.greenDark, fontSize: 14 }, error: { color: colors.red, fontSize: 14 } });