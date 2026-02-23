import React from 'react';
import { View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';

type Props = {
  name: string;
  role: string;
  image: ImageSourcePropType;
};

export default function TeamMember({ name, role, image }: Props) {
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.role}>{role}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', width: 120 },
  image: { width: 100, height: 100, borderRadius: 50, marginBottom: 8 },
  name: { fontWeight: 'bold' },
  role: { color: '#777', fontSize: 12 },
});
