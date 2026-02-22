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

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const menuAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
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
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>💡 Light Meter</Text>

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
          <TouchableOpacity
            onPress={() => {
              setMenuOpen(false);
              router.push('/about');
            }}
          >
            <Text style={styles.menuItem}>About Us</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            onPress={() => {
              setMenuOpen(false);
              // router.push('/signup');
            }}
          >
            <Text style={styles.menuItem}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setMenuOpen(false);
              // router.push('/login');
            }}
          >
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
        scrollEventThrottle={16}
      >
        {/* HERO SECTION */}
        <View style={styles.heroGradient}>
          <View style={styles.hero}>
            <Text style={styles.headline}>
              Master Your{'\n'}
              <Text style={styles.highlight}>LIGHT</Text>
            </Text>
            <Text style={styles.subheadline}>
              Professional light metering for analog photography
            </Text>

            <Image
              source={require('../../assets/images/camera.png')}
              resizeMode="cover"
              style={styles.heroImage}
            />

            <TouchableOpacity
              style={styles.primaryBtn}
              // onPress={() => router.push('/login')}
            >
              <Text style={styles.primaryBtnText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FEATURES SECTION */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Why Light Meter?</Text>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>📸</Text>
            <Text style={styles.featureTitle}>Precise Metering</Text>
            <Text style={styles.featureText}>
              Get accurate light measurements for perfect exposure every time
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>⚡</Text>
            <Text style={styles.featureTitle}>Instant Results</Text>
            <Text style={styles.featureText}>
              Real-time light analysis powered by advanced AI
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🎨</Text>
            <Text style={styles.featureTitle}>Easy to Use</Text>
            <Text style={styles.featureText}>
              Intuitive interface designed for photographers of all levels
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={styles.featureTitle}>Analytics</Text>
            <Text style={styles.featureText}>
              Track your metering history and improve over time
            </Text>
          </View>
        </View>

        {/* STATS SECTION */}
        <View style={styles.statsSection}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>10K+</Text>
            <Text style={styles.statLabel}>Users</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>50K+</Text>
            <Text style={styles.statLabel}>Photos</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>4.9★</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* GALLERY SECTION */}
        <View style={styles.gallerySection}>
          <Text style={styles.sectionTitle}>Professional Tools</Text>

          <View style={styles.galleryGrid}>
            <View style={styles.galleryItem}>
              <Image
                source={require('../../assets/images/camera.png')}
                resizeMode="cover"
                style={styles.galleryImage}
              />
              <Text style={styles.galleryLabel}>DSLR Mode</Text>
            </View>

            <View style={styles.galleryItem}>
              <Image
                source={require('../../assets/images/camera.png')}
                resizeMode="cover"
                style={styles.galleryImage}
              />
              <Text style={styles.galleryLabel}>Manual Focus</Text>
            </View>
          </View>

          <View style={styles.galleryGrid}>
            <View style={styles.galleryItem}>
              <Image
                source={require('../../assets/images/camera.png')}
                resizeMode="cover"
                style={styles.galleryImage}
              />
              <Text style={styles.galleryLabel}>Instant Mode</Text>
            </View>
            
            <View style={styles.galleryItem}>
              <Image
                source={require('../../assets/images/camera.png')}
                resizeMode="cover"
                style={styles.galleryImage}
              />
              <Text style={styles.galleryLabel}>Film Mode</Text>
            </View>
          </View>
        </View>

        {/* HOW IT WORKS */}
        <View style={styles.howSection}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          
          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Point Your Camera</Text>
              <Text style={styles.stepText}>
                Aim your device at the subject you want to photograph
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Analyze Light</Text>
              <Text style={styles.stepText}>
                Our AI instantly analyzes the light conditions and exposure levels
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Get Results</Text>
              <Text style={styles.stepText}>
                Receive perfect camera settings for optimal exposure
              </Text>
            </View>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 Light Meter. All rights reserved.</Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
  },
  logo: {
    fontSize: 20,
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
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
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

  /* HERO */
  heroGradient: {
    backgroundColor: '#fff',
    paddingBottom: 40,
  },
  hero: {
    paddingTop: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headline: {
    fontSize: 42,
    fontWeight: '900',
    textAlign: 'center',
    color: '#1a1a1a',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  highlight: {
    color: '#33ce7d',
  },
  subheadline: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
    lineHeight: 24,
  },
  heroImage: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 30,
    marginBottom: 30,
    marginTop: 20,
    elevation: 10,
  },

  /* BUTTONS */
  primaryBtn: {
    backgroundColor: '#33ce7d',
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 50,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
    elevation: 8,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryBtn: {
    backgroundColor: '#f0f7ff',
    borderWidth: 2,
    borderColor: '#33ce7d',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 50,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
  },
  secondaryBtnText: {
    color: '#33ce7d',
    fontWeight: '700',
    fontSize: 16,
  },

  /* FEATURES */
  featuresSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 25,
    textAlign: 'center',
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: '#33ce7d',
  },
  featureIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },

  /* STATS */
  statsSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginHorizontal: 0,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#33ce7d',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },

  /* GALLERY */
  gallerySection: {
    paddingHorizontal: 20,
    paddingVertical: 50,
    backgroundColor: '#fff',
  },
  galleryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 15,
  },
  galleryItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#33ce7d',
  },
  galleryImage: {
    width: '100%',
    height: 150,
    borderRadius: 15,
    marginBottom: 12,
  },
  galleryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#33ce7d',
    textAlign: 'center',
  },

  /* HOW IT WORKS */
  howSection: {
    paddingHorizontal: 20,
    paddingVertical: 50,
    backgroundColor: '#fff',
  },
  stepCard: {
    flexDirection: 'row',
    marginBottom: 25,
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
  },
  stepNumber: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#33ce7d',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },

  /* FOOTER */
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});
