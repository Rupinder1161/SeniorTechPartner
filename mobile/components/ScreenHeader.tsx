import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../constants/theme';

export function ScreenHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg, gap: spacing.md },
  text: { flex: 1 },
  title: { color: colors.ink, fontSize: 26, lineHeight: 32, fontWeight: '800' },
  subtitle: { color: colors.muted, fontSize: 15, marginTop: 4, lineHeight: 21 },
});