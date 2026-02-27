import React, { useState, useEffect } from 'react';
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
  Alert,
} from 'react-native';
import DatePicker from '../../components/DatePicker';
import ChipPicker from '../../components/ChipPicker';
import { APERTURE_VALUES, FILM_ISOS, SHUTTER_SPEEDS } from '@/src/types/photoConstants';
import { formatShutterSpeed } from '@/src/utils/exposureMath';
import { notesApi } from '@/src/api/notes';

const { width } = Dimensions.get('window');

interface Note {
  iso: typeof FILM_ISOS[number];
  id: string;
  date: string;
  place: string;
  aperture: typeof APERTURE_VALUES[number];
  shutterSpeed: typeof SHUTTER_SPEEDS[number];
}

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState('');
  const [place, setPlace] = useState('');
  const [iso, setIso] = useState<typeof FILM_ISOS[number] | ''>('');
  const [shutterSpeed, setShutterSpeed] = useState<typeof SHUTTER_SPEEDS[number] | ''>('');
  const [aperture, setAperture] = useState<typeof APERTURE_VALUES[number] | ''>('');
  const [search, setSearch] = useState('');
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  useEffect(() => {
    notesApi.getAll().then(data => {
      if (Array.isArray(data)) {
        setNotes(data.map(n => ({
          id: n.id,
          date: n.date,
          place: n.place,
          iso: Number(n.iso) as typeof FILM_ISOS[number],
          aperture: Number(n.aperture) as typeof APERTURE_VALUES[number],
          shutterSpeed: Number(n.shutter_speed) as typeof SHUTTER_SPEEDS[number],
        })));
      }
    });
  }, []);

  const filteredNotes = notes.filter(
    (note) =>
      note.date.includes(search) ||
      note.place.toLowerCase().includes(search.toLowerCase()) ||
      note.iso.toString().includes(search) ||
      note.aperture.toString().includes(search) ||
      note.shutterSpeed.toString().includes(search)
  );

  const addNote = async () => {
    if (!date || !place || iso === '' || aperture === '' || shutterSpeed === '') return;

    const data = await notesApi.create({
      iso: iso.toString(),
      aperture: aperture.toString(),
      shutter_speed: shutterSpeed.toString(),
      date,
      place,
    });

    if (data.id) {
      setNotes([...notes, {
        id: data.id,
        date: data.date,
        place: data.place,
        iso: iso as typeof FILM_ISOS[number],
        aperture: aperture as typeof APERTURE_VALUES[number],
        shutterSpeed: shutterSpeed as typeof SHUTTER_SPEEDS[number],
      }]);
      setDate('');
      setPlace('');
      setIso('');
      setAperture('');
      setShutterSpeed('');
      setModalVisible(false);
    } else {
      Alert.alert('Error', 'Failed to save note');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Notes</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by date, place, iso, aperture, or shutter speed"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={styles.noteCard}>
            <Text style={styles.noteDate}>{item.date}</Text>
            <Text style={styles.notePlace}>{item.place}</Text>
            <Text style={styles.noteLog}>ISO: {item.iso}</Text>
            <Text style={styles.noteLog}>Aperture: f/{item.aperture}</Text>
            <Text style={styles.noteLog}>Shutter: {formatShutterSpeed(item.shutterSpeed)}</Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Note</Text>

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
            <ChipPicker label="ISO" values={FILM_ISOS} selected={iso} onSelect={(v) => setIso(v)} />
            <ChipPicker label="Aperture" values={APERTURE_VALUES} selected={aperture} onSelect={(v) => setAperture(v)} />
            <ChipPicker label="Shutter" values={SHUTTER_SPEEDS} selected={shutterSpeed} onSelect={(v) => setShutterSpeed(v)} format={(v) => formatShutterSpeed(v)} />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#33ce7d' }]} onPress={addNote}>
                <Text style={styles.modalBtnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#f0f0f0' }]} onPress={() => setModalVisible(false)}>
                <Text style={[styles.modalBtnText, { color: '#33ce7d' }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <DatePicker
        visible={datePickerOpen}
        initialDate={date}
        onChange={setDate}
        onClose={() => setDatePickerOpen(false)}
      />
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
  dateInput: { justifyContent: 'center', paddingVertical: 14 },
});