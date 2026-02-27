import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FILM_ISOS, FilmISO } from '@/src/types/photoConstants'

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
  label: { color: '#33ce7d', fontWeight: '700', marginRight: 10, letterSpacing: 1 },
  scroll: { gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  chipActive: { backgroundColor: '#33ce7d', borderColor: '#33ce7d' },
  chipText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#000' },
});