import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { SeniorTechLogo } from '../../components/SeniorTechLogo';
import { PrimaryButton } from '../../components/Buttons';
import { TextInput } from '../../components/TextInput';
import { colors, spacing } from '../../constants/theme';
import { isMockApiEnabled } from '../../services/api';
import { useAuth } from '../../providers/AuthProvider';
import { getUserMessage } from '../../utils/errors';
import { registerSchema, type RegisterFormValues } from '../../utils/validation';
import { promptToContactSeniorTech } from '../../utils/contact';

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema), defaultValues: { firstName: '', lastName: '', email: '', phone: '', password: '' } });
  const submit = handleSubmit(async (values) => {
    setServerError('');
    try { await register(values); router.replace('/(tabs)'); } catch (error) { setServerError(getUserMessage(error)); }
  });
  return <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
    <SeniorTechLogo /><View style={styles.intro}><Text style={styles.heading}>Become a referral partner</Text><Text style={styles.copy}>Create your account to start referring customers to SeniorTech.</Text></View>
    {isMockApiEnabled ? <View style={styles.form}>
      {([['firstName', 'First name'], ['lastName', 'Last name'], ['email', 'Email address'], ['phone', 'Phone number'], ['password', 'Password']] as const).map(([name, label]) => <Controller key={name} control={control} name={name} render={({ field: { onChange, onBlur, value } }) => <TextInput label={label} value={value} onChangeText={onChange} onBlur={onBlur} error={errors[name]?.message} autoCapitalize={name === 'email' ? 'none' : 'words'} keyboardType={name === 'email' ? 'email-address' : name === 'phone' ? 'phone-pad' : 'default'} secureTextEntry={name === 'password'} />} />)}
      {serverError ? <Text accessibilityRole="alert" style={styles.error}>{serverError}</Text> : null}<PrimaryButton title="Create account" onPress={submit} loading={isSubmitting} />
    </View> : <View style={styles.form}><Text style={styles.copy}>Partner accounts are set up by our team.</Text><PrimaryButton title="Contact SeniorTech to join" onPress={() => promptToContactSeniorTech('join SeniorTech as a partner')} /></View>}
    <Text style={styles.footer}>Already a partner? <Link href="/(auth)/login" style={styles.link}>Sign in</Link></Text>
  </ScrollView></KeyboardAvoidingView>;
}

const styles = StyleSheet.create({ flex: { flex: 1 }, page: { flexGrow: 1, padding: spacing.lg, paddingTop: 42, paddingBottom: 36, gap: spacing.lg, maxWidth: 540, width: '100%', alignSelf: 'center' }, intro: { gap: 7 }, heading: { color: colors.ink, fontSize: 28, fontWeight: '800' }, copy: { color: colors.muted, fontSize: 16, lineHeight: 22 }, form: { gap: 14 }, error: { color: colors.red, fontSize: 14 }, footer: { textAlign: 'center', color: colors.muted, fontSize: 15 }, link: { color: colors.greenDark, fontWeight: '700' } });