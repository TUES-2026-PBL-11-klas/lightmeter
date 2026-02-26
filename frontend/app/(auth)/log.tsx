import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const { width } = Dimensions.get('window');

interface Note {
  iso: string;
  id: string;
  date: string;
  place: string;
  aperture: string;
  shutterSpeed: string;
}

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState('');
  const [place, setPlace] = useState('');
  const [iso, setIso] = useState('');
  const [shutterSpeed, setShutterSpeed] = useState('');
  const [aperture, setAperture] = useState('');
  const [search, setSearch] = useState('');
  // date picker state (mirrors signup.tsx implementation)
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Filter notes based on search query
  const filteredNotes = notes.filter(
    (note) =>
      note.date.includes(search) ||
      note.place.toLowerCase().includes(search.toLowerCase()) ||
      note.iso.toLowerCase().includes(search.toLowerCase()) ||
      note.aperture.toLowerCase().includes(search.toLowerCase()) ||
      note.shutterSpeed.toLowerCase().includes(search.toLowerCase())
  );

  const addNote = () => {
    if (!date || !place || !iso || !aperture || !shutterSpeed) return;
    setNotes([
      ...notes,
      { id: Math.random().toString(), date, place, iso, aperture, shutterSpeed },
    ]);
    setDate('');
    setPlace('');
    setIso('');
    setAperture('');
    setShutterSpeed('');
    setModalVisible(false);
  };

  // date picker helpers (copied from signup.tsx)
  const handleDateSelect = (day: number) => {
    const d = new Date(selectedDate);
    d.setDate(day);
    setSelectedDate(d);
    setDate(d.toISOString().split('T')[0]);
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
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    const monthYear = selectedDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>My Notes</Text>

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by date, place, iso, aperture, or shutter speed"
        value={search}
        onChangeText={setSearch}
      />

      {/* List of Notes */}
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={styles.noteCard}>
            <Text style={styles.noteDate}>{item.date}</Text>
            <Text style={styles.notePlace}>{item.place}</Text>
            <Text style={styles.noteLog}>{item.iso}</Text>
            <Text style={styles.noteLog}>{item.aperture}</Text>
            <Text style={styles.noteLog}>Shutter Speed:{item.shutterSpeed}</Text>
          </View>
        )}
      />

      {/* Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal for adding new note */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Note</Text>

            {/* date selector using same calendar picker as signup */}
            <TouchableOpacity
              style={[styles.modalInput, styles.dateInput]}
              onPress={() => setDatePickerOpen(true)}
            >
              <Text style={!date ? { color: '#999' } : { color: '#000' }}>
                {date || 'Select Date'}
              </Text>
            </TouchableOpacity>
            <TextInput
              style={styles.modalInput}
              placeholder="Place"
              value={place}
              onChangeText={setPlace}
            />
            <TextInput
              style={[styles.modalInput, { height: 80 }]}
              placeholder="ISO"
              value={iso}
              onChangeText={setIso}
              multiline
            />
            <TextInput
              style={[styles.modalInput, { height: 80 }]}
              placeholder="Aperture"
              value={aperture}
              onChangeText={setAperture}
              multiline
            />
            <TextInput
              style={[styles.modalInput, { height: 80 }]}
              placeholder="Shutter Speed"
              value={shutterSpeed}
              onChangeText={setShutterSpeed}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#33ce7d' }]}
                onPress={addNote}
              >
                <Text style={styles.modalBtnText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#f0f0f0' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.modalBtnText, { color: '#33ce7d' }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* date picker modal (outside of note modal) */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 28, fontWeight: '800', color: '#1a1a1a', marginBottom: 20 },
  searchInput: {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ccc',
    marginBottom: 20,
    fontSize: 16,
  },
  noteCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#33ce7d',
  },
  noteDate: { fontSize: 14, fontWeight: '700', color: '#33ce7d' },
  notePlace: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginTop: 4 },
  noteLog: { fontSize: 14, color: '#666', marginTop: 6 },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#33ce7d',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: { fontSize: 36, color: '#fff', fontWeight: '800' },
  modalContainer: { flex: 1, justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 5,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', marginBottom: 20, color: '#1a1a1a' },
  modalInput: {
    borderWidth: 1.5,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  modalBtn: { paddingVertical: 12, paddingHorizontal: 25, borderRadius: 50, alignItems: 'center' },
  modalBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  dateInput: {
    justifyContent: 'center',
    paddingVertical: 14,
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