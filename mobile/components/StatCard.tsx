import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';

export function StatCard({ label, value }: { label: string; value: number | string }) {
  return <View style={styles.card}><Text style={styles.value}>{value}</Text><Text style={styles.label}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: '45%', backgroundColor: colors.white, borderColor: colors.line, borderWidth: 1, borderRadius: radius.md, padding: spacing.md, gap: 5 },
  value: { color: colors.ink, fontSize: 25, lineHeight: 31, fontWeight: '800' },
  label: { color: colors.muted, fontSize: 11, fontWeight: '800' },
});