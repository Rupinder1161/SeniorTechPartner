import { ActivityIndicator, Pressable, StyleSheet, Text, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius } from '../constants/theme';

type ButtonProps = Omit<PressableProps, 'style'> & { title: string; loading?: boolean; icon?: React.ReactNode; style?: StyleProp<ViewStyle> };

export function PrimaryButton({ title, loading, icon, disabled, style, ...props }: ButtonProps) {
  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel ?? title}
      disabled={disabled || loading}
      style={({ pressed }) => [styles.primary, pressed && styles.pressed, (disabled || loading) && styles.disabled, style]}
    >
      {loading ? <ActivityIndicator color={colors.white} /> : icon}
      {!loading && <Text style={styles.primaryText}>{title}</Text>}
    </Pressable>
  );
}

export function SecondaryButton({ title, style, icon, ...props }: ButtonProps) {
  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel ?? title}
      style={({ pressed }) => [styles.secondary, pressed && styles.pressed, style]}
    >
      {icon}
      <Text style={styles.secondaryText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: { minHeight: 54, backgroundColor: colors.green, borderRadius: radius.md, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 },
  primaryText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  secondary: { minHeight: 50, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 9, backgroundColor: colors.white },
  secondaryText: { color: colors.greenDark, fontSize: 15, fontWeight: '700' },
  disabled: { opacity: 0.55 },
  pressed: { opacity: 0.82 },
});