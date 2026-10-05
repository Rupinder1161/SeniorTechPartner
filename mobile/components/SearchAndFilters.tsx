import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius } from '../constants/theme';

export function SearchBar({ value, onChangeText, placeholder = 'Search by customer' }: { value: string; onChangeText: (text: string) => void; placeholder?: string }) {
  return <View style={styles.search}><Feather name="search" size={19} color={colors.muted} /><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.muted} accessibilityLabel={placeholder} style={styles.searchInput} returnKeyType="search" /></View>;
}

export function FilterTabs<T extends string>({ options, selected, onSelect }: { options: readonly T[]; selected: T; onSelect: (value: T) => void }) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters} accessibilityRole="tablist">{options.map((option) => <Pressable key={option} accessibilityRole="tab" accessibilityState={{ selected: selected === option }} onPress={() => onSelect(option)} style={[styles.filter, selected === option && styles.selected]}><Text style={[styles.filterText, selected === option && styles.selectedText]}>{option}</Text></Pressable>)}</ScrollView>;
}

const styles = StyleSheet.create({
  search: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 15, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  searchInput: { flex: 1, color: colors.ink, fontSize: 16, paddingVertical: 10 },
  filters: { gap: 8, paddingVertical: 3 },
  filter: { minHeight: 40, justifyContent: 'center', paddingHorizontal: 15, borderRadius: 9, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  selected: { backgroundColor: colors.green, borderColor: colors.green },
  filterText: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  selectedText: { color: colors.white },
});