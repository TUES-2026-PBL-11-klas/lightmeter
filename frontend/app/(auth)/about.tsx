import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import TeamMember from '@/components/teamMember';

export default function AboutScreen(): JSX.Element {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuAnim = useRef<Animated.Value>(new Animated.Value(0)).current;

  const toggleMenu = (): void => {
    const newValue = !menuOpen;
    setMenuOpen(newValue);

    menuAnim.stopAnimation();

    Animated.timing(menuAnim, {
      toValue: newValue ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const navigate = (path: string) => {
    setMenuOpen(false);
    router.push(path as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>Light Meter</Text>
        <TouchableOpacity onPress={toggleMenu}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* DROPDOWN MENU */}
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
          <TouchableOpacity onPress={() => navigate('/')}>
            <Text style={styles.menuItem}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigate('/about')}>
            <Text style={styles.menuItem}>About Us</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity onPress={() => navigate('/signup')}>
            <Text style={styles.menuItem}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigate('/login')}>
            <Text style={styles.menuItem}>Log In</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <ScrollView style={styles.container}>
        {/* HERO */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>About Us</Text>
          <Text style={styles.heroText}>
            In the world of photography, light is everything. But capturing that perfect exposure shouldn't feel like a guessing game. Light Meter was born out of a passion for the craft, designed to bridge the gap between technical precision and creative vision.
          </Text>
        </View>

        {/* CARDS */}
        <View style={styles.cards}>
          <View style={[styles.card, { backgroundColor: '#f2fbf8' }]}>
            <Text style={styles.cardIcon}>✨</Text>
            <Text style={styles.cardTitle}>Our Mission</Text>
            <Text style={styles.cardText}>To build the ultimate companion for storytellers. Whether you're shooting on vintage 35mm film or a high-end mirrorless setup, we’re here to ensure you never miss a moment due to poor exposure.</Text>
            <Image
              source={require('../../assets/images/AboutUs/OurMission.jpg')}
              style={styles.cardImage}
            />
          </View>

          <View style={[styles.card, { backgroundColor: '#fdf0f9' }]}>
            <Text style={styles.cardIcon}>🎞️</Text>
            <Text style={styles.cardTitle}>What We Do?</Text>
            <Text style={styles.cardText}>We help photographers—from film enthusiasts to digital pros—master their environment. Our app doesn't just measure light; it understands it. By providing real-time exposure data and smart, actionable advice, we empower you to make every shot count.</Text>
            <Image
              source={require('../../assets/images/AboutUs/WhatWeDo.jpg')}
              style={styles.cardImage}
            />
          </View>

          <View style={[styles.card, { backgroundColor: '#f2fbf8' }]}>
            <Text style={styles.cardIcon}>🔆</Text>
            <Text style={styles.cardTitle}>Your Light. Perfected.</Text>
            <Text style={styles.cardText}>In the world of photography, light is everything. But capturing that perfect exposure shouldn't feel like a guessing game. Light Meter was born out of a passion for the craft, designed to bridge the gap between technical precision and creative vision.</Text>
            <Image
              source={require('../../assets/images/AboutUs/YourLight.jpg')}
              style={styles.cardImage}
            />
          </View>
        </View>

        {/* TEAM */}
        <View style={styles.team}>
          <Text style={styles.teamTitle}>Meet the Team</Text>
          <View style={styles.teamGrid}>
            <TeamMember
              name="Didi"
              role="Founder"
              image={require('../../assets/images/AboutUs/didi.jpg')}
            />
            <TeamMember
              name="Kircho"
              role="Founder"
              image={require('../../assets/images/AboutUs/Kircho.jpg')}
            />
            <TeamMember
              name="Vladi"
              role="Founder"
              image={require('../../assets/images/AboutUs/Vladi.jpg')}
            />
            <TeamMember
              name="Nikol"
              role="Founder"
              image={require('../../assets/images/AboutUs/nikol.jpg')}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

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

  logo: { fontSize: 22, fontWeight: '800', color: '#33ce7d' },
  menuIcon: { fontSize: 28 },

  dropdown: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 190,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(30,30,30,0.85)',
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
    color: '#fff',
  },

  hero: { padding: 20, alignItems: 'center' },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#161616',
    marginBottom: 10,
  },
  heroText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    lineHeight: 24,
  },

  cards: { padding: 20 },

  card: {
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  cardIcon: { fontSize: 40, marginBottom: 10 },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#33ce7d',
    marginBottom: 6,
  },
  cardText: { fontSize: 14, color: '#333', lineHeight: 24 },

  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 15,
    resizeMode: 'cover',
    marginTop: 10,
  },

  team: { padding: 20 },
  teamTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
  },
});