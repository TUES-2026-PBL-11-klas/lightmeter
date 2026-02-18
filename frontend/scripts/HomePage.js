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
  Easing
} from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // 🔹 Page animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // 🔹 Menu animation
  const menuAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true
      })
    ]).start();
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    Animated.timing(menuAnim, {
      toValue: menuOpen ? 0 : 1,
      duration: 250,
      useNativeDriver: true
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
                    outputRange: [-10, 0]
                  })
                }
              ]
            }
          ]}
        >
          <TouchableOpacity onPress={() => navigation.navigate('About')}>
            <Text style={styles.menuItem}>About Us</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity onPress={() => navigation.navigate('')}>
            <Text style={styles.menuItem}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('')}>
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
            transform: [{ translateY: slideAnim }]
          }
        ]}
        showsVerticalScrollIndicator={false}
      >

        {/* HERO */}
        <View style={styles.hero}>
          <Text style={styles.headline}>
            Make Good{'\n'}
            <Text style={styles.highlight}>PICTURES</Text>{'\n'}
            Every Day
          </Text>

          <Image
            source={require('../assets/images/camera.png')}
            style={styles.heroImage}
          />
        </View>

        {/* CTA */}
        <View style={styles.cta}>
          <Text style={styles.ctaTitle}>Join Us Now</Text>
          <Text style={styles.ctaSubtitle}>Your success starts here</Text>

          <View style={styles.ctaButtons}>
            <TouchableOpacity style={styles.btnOutline}>
              <Text style={styles.btnOutlineText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnSolid}>
              <Text style={styles.btnSolidText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SERVICES */}
        <View style={styles.services}>
          <Text style={styles.servicesTitle}>Our Solution</Text>

          <View style={styles.serviceCard}>
            <Text style={styles.serviceChip}>Device</Text>
            <Text style={styles.serviceText}>
              Need to put text here.
            </Text>
            <Image
              source={require('../assets/images/camera.png')}
              style={styles.serviceImage}
            />
          </View>

          <View style={styles.serviceCard}>
            <Text style={styles.serviceChip}>App</Text>
            <Text style={styles.serviceText}>
              Need to put text here.
            </Text>
            <Image
              source={require('../assets/images/camera.png')}
              style={styles.serviceImage}
            />
          </View>
        </View>

      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },

  /* HEADER */
  header: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    elevation: 4,
    zIndex: 100
  },
  logo: {
    fontSize: 22,
    fontWeight: '800',
    color: '#33ce7d'
  },
  menuIcon: {
    fontSize: 28
  },
  dropdown: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 190,
    paddingVertical: 10,
    borderRadius: 16,

    backgroundColor: 'rgba(30, 30, 30, 0.85)', // 🔥 тъмно сив прозрачен

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,

    elevation: 10,
    zIndex: 200
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff'
  },

  /* HERO */
  hero: {
    paddingTop: 40,
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  headline: {
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center'
  },
  highlight: {
    color: '#33ce7d'
  },
  heroImage: {
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: width,
    resizeMode: 'cover',
    marginTop: 30
  },

  /* CTA */
  cta: {
    marginTop: 60,
    alignItems: 'center',
    paddingHorizontal: 20
  },
  ctaTitle: {
    fontSize: 36,
    fontWeight: '800'
  },
  ctaSubtitle: {
    fontSize: 18,
    color: '#444',
    marginBottom: 20
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 12
  },
  btnOutline: {
    borderWidth: 2,
    borderColor: '#33ce7d',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 24
  },
  btnOutlineText: {
    color: '#33ce7d',
    fontWeight: '700'
  },
  btnSolid: {
    backgroundColor: '#33ce7d',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 24
  },
  btnSolidText: {
    color: '#fff',
    fontWeight: '700'
  },

  /* SERVICES */
  services: {
    marginTop: 60,
    paddingHorizontal: 20
  },
  servicesTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#8a2b5e',
    marginBottom: 20,
    textAlign: 'center'
  },
  serviceCard: {
    backgroundColor: '#f2fbf8',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20
  },
  serviceChip: {
    backgroundColor: '#33ce7d',
    color: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    fontWeight: '700',
    marginBottom: 10,
    alignSelf: 'flex-start'
  },
  serviceText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12
  },
  serviceImage: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    resizeMode: 'cover'
  }
});