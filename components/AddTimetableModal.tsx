import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { TimetableStep } from '../constants/types';
import { useAppTheme } from '../hooks/useThemeContext';

interface AddTimetableModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (stepData: { title: string; startTime: string; endTime: string; note?: string }) => void;
  initialStep?: TimetableStep | null;
}

const TIME_PRESETS = [
  { start: '06:00 AM', end: '07:00 AM', label: '6 - 7 AM' },
  { start: '07:30 AM', end: '08:30 AM', label: '7:30 - 8:30 AM' },
  { start: '09:00 AM', end: '12:00 PM', label: '9 - 12 PM' },
  { start: '01:00 PM', end: '02:00 PM', label: '1 - 2 PM' },
  { start: '02:00 PM', end: '05:00 PM', label: '2 - 5 PM' },
  { start: '06:00 PM', end: '07:30 PM', label: '6 - 7:30 PM' },
  { start: '08:00 PM', end: '09:30 PM', label: '8 - 9:30 PM' },
  { start: '10:00 PM', end: '11:00 PM', label: '10 - 11 PM' },
];

export function AddTimetableModal({
  visible,
  onClose,
  onSave,
  initialStep,
}: AddTimetableModalProps) {
  const { theme } = useAppTheme();
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('10:00 AM');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (initialStep) {
      setTitle(initialStep.title);
      setStartTime(initialStep.startTime);
      setEndTime(initialStep.endTime);
      setNote(initialStep.note || '');
    } else {
      setTitle('');
      setStartTime('09:00 AM');
      setEndTime('10:00 AM');
      setNote('');
    }
  }, [initialStep, visible]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      startTime: startTime.trim(),
      endTime: endTime.trim(),
      note: note.trim() || undefined,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              {initialStep ? 'Edit Timetable Step' : 'Add Timetable Step'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            {/* Title Input */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>Title</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.surfaceSubtle,
                  borderColor: theme.borderSubtle,
                  color: theme.text,
                },
              ]}
              placeholder="e.g. Deep Focus Work or Morning Run"
              placeholderTextColor={theme.textMuted}
              value={title}
              onChangeText={setTitle}
            />

            {/* Time Presets */}
            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 14 }]}>
              Quick Time Presets
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
              {TIME_PRESETS.map((p, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => {
                    setStartTime(p.start);
                    setEndTime(p.end);
                  }}
                  style={[
                    styles.presetPill,
                    {
                      backgroundColor:
                        startTime === p.start && endTime === p.end
                          ? theme.primary
                          : theme.surfaceSubtle,
                      borderColor: theme.borderSubtle,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.presetText,
                      {
                        color:
                          startTime === p.start && endTime === p.end
                            ? '#FFFFFF'
                            : theme.textSecondary,
                      },
                    ]}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Time Row */}
            <View style={styles.row}>
              <View style={styles.halfCol}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Start Time</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.surfaceSubtle,
                      borderColor: theme.borderSubtle,
                      color: theme.text,
                    },
                  ]}
                  placeholder="09:00 AM"
                  placeholderTextColor={theme.textMuted}
                  value={startTime}
                  onChangeText={setStartTime}
                />
              </View>
              <View style={styles.halfCol}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>End Time</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.surfaceSubtle,
                      borderColor: theme.borderSubtle,
                      color: theme.text,
                    },
                  ]}
                  placeholder="10:00 AM"
                  placeholderTextColor={theme.textMuted}
                  value={endTime}
                  onChangeText={setEndTime}
                />
              </View>
            </View>

            {/* Note Input */}
            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 14 }]}>
              Note (Optional)
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor: theme.surfaceSubtle,
                  borderColor: theme.borderSubtle,
                  color: theme.text,
                },
              ]}
              placeholder="e.g. Focus on API design, stay hydrated"
              placeholderTextColor={theme.textMuted}
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
            />

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSave}
              disabled={!title.trim()}
              style={[styles.saveButton, !title.trim() && { opacity: 0.5 }]}
            >
              <LinearGradient
                colors={['#8B5CF6', '#6366F1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBtn}
              >
                <Text style={styles.saveBtnText}>
                  {initialStep ? 'Update Step' : 'Add to Timetable'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 6,
  },
  scroll: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  presetScroll: {
    marginBottom: 14,
  },
  presetPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  presetText: {
    fontSize: 12,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  halfCol: {
    flex: 1,
  },
  saveButton: {
    marginTop: 22,
    borderRadius: 14,
    overflow: 'hidden',
  },
  gradientBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
