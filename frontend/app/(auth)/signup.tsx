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
  Modal,
} from 'react-native';
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
  const [selectedDate, setSelectedDate] = useState(new Date());

  const validateEmail = (text: string) => {
    setEmail(text);
    if (text && !EMAIL_REGEX.test(text)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const handleDateSelect = (day: number) => {
    const date = new Date(selectedDate);
    date.setDate(day);
    setSelectedDate(date);
    setBirthdate(date.toISOString().split('T')[0]);
    setDatePickerOpen(false);
  };

  const handleMonthChange = (offset: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setSelectedDate(newDate);
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderDatePicker = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);
    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    const monthYear = selectedDate.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });

    return (
      <View style={styles.datePickerContainer}>
        <View style={styles.datePickerHeader}>
          <TouchableOpacity onPress={() => handleMonthChange(-1)}>
            <Text style={styles.datePickerArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.datePickerMonth}>{monthYear}</Text>
          <TouchableOpacity onPress={() => handleMonthChange(1)}>
            <Text style={styles.datePickerArrow}>→</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.datePickerWeekdays}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <Text key={day} style={styles.datePickerWeekday}>{day}</Text>
          ))}
        </View>
        <View style={styles.datePickerDays}>
          {days.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.datePickerDay,
                day === null && styles.datePickerDayEmpty,
                day === selectedDate.getDate() && styles.datePickerDaySelected,
              ]}
              onPress={() => day !== null && handleDateSelect(day)}
              disabled={day === null}
            >
              {day && <Text style={day === selectedDate.getDate() ? styles.datePickerDayTextSelected : styles.datePickerDayText}>{day}</Text>}
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity 
          style={styles.datePickerConfirm}
          onPress={() => setDatePickerOpen(false)}
        >
          <Text style={styles.datePickerConfirmText}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  };

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
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
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

      <Modal
        visible={datePickerOpen}
        transparent
        animationType="fade"
      >
        <View style={styles.datePickerModal}>
          <View style={styles.datePickerWrapper}>
            {renderDatePicker()}
          </View>
        </View>
      </Modal>
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
  datePickerModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  datePickerWrapper: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  datePickerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  datePickerArrow: {
    fontSize: 24,
    color: '#33ce7d',
    fontWeight: '700',
  },
  datePickerMonth: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  datePickerWeekdays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  datePickerWeekday: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  datePickerDays: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  datePickerDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 8,
  },
  datePickerDayEmpty: {
    backgroundColor: 'transparent',
  },
  datePickerDaySelected: {
    backgroundColor: '#33ce7d',
  },
  datePickerDayText: {
    fontSize: 14,
    color: '#333',
  },
  datePickerDayTextSelected: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  datePickerConfirm: {
    backgroundColor: '#33ce7d',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  datePickerConfirmText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
});