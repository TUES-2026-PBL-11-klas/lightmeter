import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Light Meter Project</Text>
      
      <Link href="/modal" style={styles.link}>
        <Text style={{ color: '#007AFF' }}>Open Modal</Text>
      </Link>
      
      <View style={styles.stepContainer}>
        <Text style={styles.subtitle}>Step 1: The math is ready ✅</Text>
        <Text style={styles.text}>Your 4 tests passed!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
  stepContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  link: {
    marginTop: 15,
    padding: 10,
  },
});