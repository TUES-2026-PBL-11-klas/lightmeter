import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import DatePicker from '../../components/DatePicker';
import { useRouter } from 'expo-router';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const validateEmail = (text: string) => {
    setEmail(text);
    if (text && !EMAIL_REGEX.test(text)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  // date picker logic is moved into a reusable component


  const handleSignup = () => {
    // TODO: Replace with actual authentication
    router.push('/login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us and get started</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />

          <TouchableOpacity 
            style={[styles.input, styles.dateInput]}
            onPress={() => setDatePickerOpen(true)}
          >
            <Text style={!birthdate ? { color: '#999' } : { color: '#000' }}>
              {birthdate || 'Select Birthdate'}
            </Text>
          </TouchableOpacity>

          <TextInput
            style={[styles.input, emailError ? styles.inputError : null]}
            placeholder="Email"
            value={email}
            onChangeText={validateEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.btn} onPress={handleSignup}>
            <Text style={styles.btnText}>Sign Up</Text>
          </TouchableOpacity>

          <Text style={styles.switchText}>
            Already have an account?{' '}
            <Text
              style={styles.linkText}
              onPress={() => router.push('/login')}
            >
              Log In
            </Text>
          </Text>
        </View>
      </ScrollView>

      <DatePicker
        visible={datePickerOpen}
        initialDate={birthdate}
        onChange={setBirthdate}
        onClose={() => setDatePickerOpen(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0a0a0a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ccc',
    fontSize: 16,
    marginBottom: 16,
  },
  btn: {
    backgroundColor: '#33ce7d',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  switchText: {
    fontSize: 15,
    color: '#555',
  },
  linkText: {
    color: '#33ce7d',
    fontWeight: '700',
  },
  dateInput: {
    justifyContent: 'center',
    paddingVertical: 14,
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginBottom: 8,
    marginTop: -8,
    width: '100%',
  },

});