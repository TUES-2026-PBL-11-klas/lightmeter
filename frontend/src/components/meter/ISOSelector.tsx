import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const FILM_ISOS = [25, 50, 100, 200, 400, 800, 1600, 3200];

interface Props {
  selected: number;
  onSelect: (iso: number) => void;
}

export function ISOSelector({ selected, onSelect }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>ISO</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {FILM_ISOS.map((value) => (
          <TouchableOpacity
            key={value}
            onPress={() => onSelect(value)}
            style={[styles.chip, selected === value && styles.chipActive]}
          >
            <Text style={[styles.chipText, selected === value && styles.chipTextActive]}>
              {value}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: 16 },
  label: { color: '#ffd700', fontWeight: '700', marginRight: 10, letterSpacing: 1 },
  scroll: { gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  chipActive: { backgroundColor: '#ffd700', borderColor: '#ffd700' },
  chipText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#000' },
});