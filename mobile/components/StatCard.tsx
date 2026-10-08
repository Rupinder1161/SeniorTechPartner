import { Pressable } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';

export function StatCard({ label, value, onPress }: { label: string; value: number | string; onPress?: () => void }) {
  const content = <><Text style={styles.value}>{value}</Text><Text style={styles.label}>{label}</Text></>;
  if (!onPress) return <View style={styles.card}>{content}</View>;
  return <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${label}: ${value}`} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>{content}</Pressable>;
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: '45%', backgroundColor: colors.white, borderColor: colors.line, borderWidth: 1, borderRadius: radius.md, padding: spacing.md, gap: 5 },
  value: { color: colors.ink, fontSize: 25, lineHeight: 31, fontWeight: '800' },
  label: { color: colors.muted, fontSize: 11, fontWeight: '800' },
  pressed: { opacity: 0.78 },
});