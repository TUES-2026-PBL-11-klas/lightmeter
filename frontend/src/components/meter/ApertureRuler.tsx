import React, { useRef } from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet } from 'react-native';
import { APERTURE_VALUES } from '@/src/types/photoConstants';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 75;

interface Props {
  currentAperture: number;
  onApertureChange: (value: number) => void;
}

export const ApertureRuler = ({ currentAperture, onApertureChange }: Props) => {
  const flatListRef = useRef<FlatList>(null);

  return (
    <View style={styles.rulerContainer}>
      <FlatList
        ref={flatListRef}
        data={APERTURE_VALUES}
        horizontal
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: (width - ITEM_WIDTH) / 2 }}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
          onApertureChange(APERTURE_VALUES[index]);
        }}
        renderItem={({ item }) => (
          <View style={{ width: ITEM_WIDTH, alignItems: 'center' }}>
            <Text style={[styles.tickLabel, item === currentAperture && styles.activeLabel]}>
              {item}
            </Text>
            <View style={[styles.tick, item === currentAperture && styles.activeTick]} />
          </View>
        )}
      />
      <View style={styles.centerIndicator} />
    </View>
  );
};

const styles = StyleSheet.create({
  rulerContainer: { height: 100, width: '100%', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)' },
  tickLabel: { color: '#666', fontSize: 12, marginBottom: 8 },
  activeLabel: { color: '#ffd700', fontWeight: 'bold' },
  tick: { width: 1, height: 20, backgroundColor: '#444' },
  activeTick: { backgroundColor: '#ffd700', height: 40 },
  centerIndicator: { position: 'absolute', top: 40, left: width / 2, width: 2, height: 60, backgroundColor: '#ffd700' },
});