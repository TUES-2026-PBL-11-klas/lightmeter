import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';

export type DatePickerProps = {
  visible: boolean;
  onClose: () => void;
  onChange: (isoDate: string) => void;
  /**
   * An optional ISO date string (YYYY-MM-DD) to use as the
   * initial month/day when the picker opens. If not provided, the
   * current date will be used.
   */
  initialDate?: string;
};

export default function DatePicker({
  visible,
  onClose,
  onChange,
  initialDate,
}: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (initialDate) {
      const d = new Date(initialDate);
      if (!isNaN(d.getTime())) {
        setSelectedDate(d);
      }
    }
  }, [initialDate, visible]);

  const handleDateSelect = (day: number) => {
    const d = new Date(selectedDate);
    d.setDate(day);
    setSelectedDate(d);
    onChange(d.toISOString().split('T')[0]);
    onClose();
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
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <Text key={day} style={styles.datePickerWeekday}>
              {day}
            </Text>
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
              {day && (
                <Text
                  style={
                    day === selectedDate.getDate()
                      ? styles.datePickerDayTextSelected
                      : styles.datePickerDayText
                  }
                >
                  {day}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.datePickerConfirm} onPress={onClose}>
          <Text style={styles.datePickerConfirmText}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.datePickerModal}>
        <View style={styles.datePickerWrapper}>{renderDatePicker()}</View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
