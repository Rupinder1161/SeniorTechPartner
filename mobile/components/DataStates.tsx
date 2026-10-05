import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../constants/theme';
import { PrimaryButton } from './Buttons';

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return <View style={styles.center} accessibilityRole="progressbar"><ActivityIndicator size="large" color={colors.green} /><Text style={styles.body}>{label}</Text></View>;
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: { label: string; onPress: () => void } }) {
  return (
    <View style={styles.panel}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{description}</Text>
      {action ? <PrimaryButton title={action.label} onPress={action.onPress} style={styles.action} /> : null}
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <View style={styles.panel}><Text style={styles.title}>We hit a snag</Text><Text style={styles.body}>{message}</Text><PrimaryButton title="Try again" onPress={onRetry} style={styles.action} /></View>;
}

const styles = StyleSheet.create({
  center: { minHeight: 190, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  panel: { backgroundColor: colors.white, borderRadius: 14, padding: spacing.lg, alignItems: 'flex-start', gap: spacing.sm, borderWidth: 1, borderColor: colors.line },
  title: { color: colors.ink, fontSize: 18, fontWeight: '800' },
  body: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  action: { marginTop: spacing.sm, alignSelf: 'stretch' },
});