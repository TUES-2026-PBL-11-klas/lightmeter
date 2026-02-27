import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  ev: number;
  shutter: string;
  aperture: number;
  iso: number;
}

export const ExposureReadout = ({ ev, shutter, aperture, iso }: Props) => (
  <View style={styles.readoutContainer}>
    <Text style={styles.evLabel}>LIGHT VALUE: EV {ev}</Text>
    <Text style={styles.shutterValue}>{shutter}</Text>
    <View style={styles.divider} />
    <Text style={styles.apertureValue}>f/{aperture}</Text>
    <Text style={styles.isoLabel}>FILM ISO {iso}</Text>
  </View>
);

const styles = StyleSheet.create({
  readoutContainer: { alignItems: 'center', marginTop: 60, padding: 20 },
  evLabel: { color: '#33ce7d', fontWeight: '800', fontSize: 10, letterSpacing: 1 },
  shutterValue: { color: '#fff', fontSize: 70, fontWeight: '100', fontFamily: 'monospace' },
  apertureValue: { color: '#fff', fontSize: 32, fontWeight: '300' },
  isoLabel: { color: '#aaa', fontSize: 14, fontWeight: '700', marginTop: 10 },
  divider: { width: 40, height: 2, backgroundColor: '#33ce7d', marginVertical: 20 },
});