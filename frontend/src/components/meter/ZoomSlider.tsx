import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface Props {
  zoom: number;
  onZoomChange: (value: number) => void;
}

export function ZoomSlider({ zoom, onZoomChange }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>W</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={zoom}
        onValueChange={onZoomChange}
        minimumTrackTintColor="#33ce7d"
        maximumTrackTintColor="rgba(255,255,255,0.3)"
        thumbTintColor="#fff"
      />
      <Text style={styles.label}>T</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  slider: { flex: 1, height: 40 },
  label: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '700', width: 16, textAlign: 'center' },
});