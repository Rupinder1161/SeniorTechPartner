import { Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import { SeniorTechLogo } from '../../components/SeniorTechLogo';
import { PrimaryButton, SecondaryButton } from '../../components/Buttons';
import { TextInput } from '../../components/TextInput';
import { colors, spacing } from '../../constants/theme';
import { requestPasswordReset } from '../../services/authService';
import { getUserMessage } from '../../utils/errors';

const schema = z.object({ email: z.email('Enter a valid email address') });
type Values = z.infer<typeof schema>;

export default function ForgotPasswordScreen() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: '' } });
  const submit = handleSubmit(async ({ email }) => {
    setError('');
    try { await requestPasswordReset(email); setSent(true); } catch (reason) { setError(getUserMessage(reason)); }
  });
  return <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
    <SeniorTechLogo /><View style={styles.intro}><Text style={styles.heading}>{sent ? 'Check your email' : 'Reset your password'}</Text><Text style={styles.copy}>{sent ? 'If an account exists for that email, password reset instructions are on the way.' : 'Enter your partner account email and we’ll send reset instructions.'}</Text></View>
    {!sent && <View style={styles.form}><Controller control={control} name="email" render={({ field: { onChange, onBlur, value } }) => <TextInput label="Email address" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.email?.message} keyboardType="email-address" autoCapitalize="none" />} />{error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}<PrimaryButton title="Send instructions" onPress={submit} loading={isSubmitting} /></View>}
    <Link href="/(auth)/login" asChild><SecondaryButton title="Back to sign in" /></Link>
  </ScrollView></KeyboardAvoidingView>;
}

const styles = StyleSheet.create({ flex: { flex: 1 }, page: { flexGrow: 1, padding: spacing.lg, paddingTop: 52, gap: spacing.xl, maxWidth: 540, width: '100%', alignSelf: 'center' }, intro: { gap: 8 }, heading: { color: colors.ink, fontSize: 29, fontWeight: '800' }, copy: { color: colors.muted, fontSize: 16, lineHeight: 23 }, form: { gap: 16 }, error: { color: colors.red } });