import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const menuAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const toggleMenu = () => {
    const newValue = !menuOpen;
    setMenuOpen(newValue);

    Animated.timing(menuAnim, {
      toValue: newValue ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={{ flex: 1 }}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>Light Meter</Text>

        <TouchableOpacity onPress={toggleMenu}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* DROPDOWN */}
      {menuOpen && (
        <Animated.View
          style={[
            styles.dropdown,
            {
              opacity: menuAnim,
              transform: [
                {
                  translateY: menuAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity onPress={() => router.push('/about')}>
            <Text style={styles.menuItem}>About Us</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={styles.menuItem}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.menuItem}>Log In</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* CONTENT */}
      <Animated.ScrollView
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.headline}>
            Make Good{'\n'}
            <Text style={styles.highlight}>PICTURES</Text>
            {'\n'}
            Every Day
          </Text>

          <Image
            source={require('../assets/images/camera.png')}
            style={styles.heroImage}
          />
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    elevation: 4,
    zIndex: 100,
  },
  logo: {
    fontSize: 22,
    fontWeight: '800',
    color: '#33ce7d',
  },
  menuIcon: {
    fontSize: 28,
  },
  dropdown: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 190,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(30, 30, 30, 0.85)',
    elevation: 10,
    zIndex: 200,
  },
  divider: {
    height: 1,
    backgroundColor: '#555',
    marginHorizontal: 10,
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  hero: {
    paddingTop: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headline: {
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
  },
  highlight: {
    color: '#33ce7d',
  },
  heroImage: {
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: width,
    resizeMode: 'cover',
    marginTop: 30,
  },
});
