import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';

export function SeniorTechLogo({ compact = false }: { compact?: boolean }) {
  return (
    <View style={styles.row} accessibilityRole="image" accessibilityLabel="SeniorTech, Simple Tech Support for Seniors">
      <View style={[styles.mark, compact && styles.markSmall]}>
        <Feather name="heart" size={compact ? 17 : 21} color={colors.white} />
      </View>
      <View>
        <Text style={[styles.name, compact && styles.nameSmall]}>SeniorTech</Text>
        {!compact && <Text style={styles.tagline}>Simple Tech Support for Seniors</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mark: { width: 42, height: 42, borderRadius: 13, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  markSmall: { width: 34, height: 34, borderRadius: 10 },
  name: { fontSize: 20, fontWeight: '800', color: colors.ink },
  nameSmall: { fontSize: 18 },
  tagline: { fontSize: 12, color: colors.muted, marginTop: 1 },
});