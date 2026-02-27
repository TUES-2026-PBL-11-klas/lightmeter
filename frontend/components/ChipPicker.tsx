import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ChipPickerProps<T extends number | string> {
  label?: string;
  values: readonly T[];
  selected: T | '';
  onSelect: (value: T) => void;
  format?: (value: T) => string;
}

export default function ChipPicker<T extends number | string>({
  label,
  values,
  selected,
  onSelect,
  format = (v) => String(v),
}: ChipPickerProps<T>) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {values.map((value) => (
          <TouchableOpacity
            key={String(value)}
            onPress={() => onSelect(value)}
            style={[styles.chip, selected === value && styles.chipActive]}
          >
            <Text style={[styles.chipText, selected === value && styles.chipTextActive]}>
              {format(value)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  scroll: { gap: 8, paddingHorizontal: 4 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#ccc' },
  chipActive: { backgroundColor: '#33ce7d', borderColor: '#33ce7d' },
  chipText: { color: '#000' },
  chipTextActive: { color: '#fff' },
});
