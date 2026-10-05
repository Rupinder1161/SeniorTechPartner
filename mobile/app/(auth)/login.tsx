import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { SeniorTechLogo } from '../../components/SeniorTechLogo';
import { PrimaryButton } from '../../components/Buttons';
import { TextInput } from '../../components/TextInput';
import { colors, spacing } from '../../constants/theme';
import { useAuth } from '../../providers/AuthProvider';
import { getUserMessage } from '../../utils/errors';
import { loginSchema, type LoginFormValues } from '../../utils/validation';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } });
  const submit = handleSubmit(async (values) => {
    setServerError('');
    try { await login(values); router.replace('/(tabs)'); } catch (error) { setServerError(getUserMessage(error)); }
  });

  return <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
    <SeniorTechLogo />
    <View style={styles.intro}><Text style={styles.heading}>Partner sign in</Text><Text style={styles.copy}>Welcome back. Sign in to manage your referrals and earnings.</Text></View>
    <View style={styles.form}>
      <Controller control={control} name="email" render={({ field: { onChange, onBlur, value } }) => <TextInput label="Email address" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.email?.message} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />} />
      <Controller control={control} name="password" render={({ field: { onChange, onBlur, value } }) => <TextInput label="Password" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.password?.message} secureTextEntry autoComplete="password" />} />
      {serverError ? <Text accessibilityRole="alert" style={styles.error}>{serverError}</Text> : null}
      <Link href="/(auth)/forgot-password" style={styles.link}>Forgot password?</Link>
      <PrimaryButton title="Sign in" onPress={submit} loading={isSubmitting} />
    </View>
    <Text style={styles.footer}>New to SeniorTech? <Link href="/(auth)/register" style={styles.link}>Create a partner account</Link></Text>
  </ScrollView></KeyboardAvoidingView>;
}

const styles = StyleSheet.create({ flex: { flex: 1 }, page: { flexGrow: 1, padding: spacing.lg, paddingTop: 52, paddingBottom: 36, gap: spacing.xl, maxWidth: 540, width: '100%', alignSelf: 'center' }, intro: { gap: 8 }, heading: { color: colors.ink, fontSize: 30, fontWeight: '800' }, copy: { color: colors.muted, fontSize: 16, lineHeight: 23 }, form: { gap: 17 }, error: { color: colors.red, fontSize: 14 }, link: { color: colors.greenDark, fontWeight: '700', fontSize: 15 }, footer: { textAlign: 'center', color: colors.muted, fontSize: 15 } });