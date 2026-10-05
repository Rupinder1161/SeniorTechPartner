import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput as NativeTextInput, View, type TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius, spacing } from '../constants/theme';

type Props = TextInputProps & { label: string; error?: string; multiline?: boolean };

export function TextInput({ label, error, secureTextEntry, multiline, ...props }: Props) {
  const [showSecret, setShowSecret] = useState(false);
  const secret = Boolean(secureTextEntry);
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, multiline && styles.multilineWrap, error && styles.invalid]}>
        <NativeTextInput
          {...props}
          accessibilityLabel={props.accessibilityLabel ?? label}
          secureTextEntry={secret && !showSecret}
          multiline={multiline}
          placeholderTextColor="#7B8981"
          style={[styles.input, multiline && styles.multiline]}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
        {secret && (
          <Pressable onPress={() => setShowSecret((visible) => !visible)} accessibilityRole="button" accessibilityLabel={showSecret ? 'Hide password' : 'Show password'} hitSlop={10}>
            <Feather name={showSecret ? 'eye-off' : 'eye'} size={19} color={colors.muted} />
          </Pressable>
        )}
      </View>
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: 7 },
  label: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  inputWrap: { minHeight: 54, borderColor: colors.line, borderWidth: 1, borderRadius: radius.md, paddingHorizontal: 15, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', gap: 8 },
  multilineWrap: { minHeight: 110, alignItems: 'flex-start', paddingTop: 12 },
  input: { flex: 1, minHeight: 50, color: colors.ink, fontSize: 16, paddingVertical: 10 },
  multiline: { minHeight: 86 },
  invalid: { borderColor: colors.red },
  error: { color: colors.red, fontSize: 13, lineHeight: 18 },
});