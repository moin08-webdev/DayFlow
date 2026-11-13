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
import { DayOfWeek, DAYS_OF_WEEK, RoutineItem } from '../constants/types';
import { useAppTheme } from '../hooks/useThemeContext';

interface AddRoutineModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    day: DayOfWeek;
    time: string;
    title: string;
    description?: string;
    category?: string;
  }) => void;
  defaultDay: DayOfWeek;
  initialItem?: RoutineItem | null;
}

const ROUTINE_CATEGORIES = ['Focus', 'Fitness', 'Wellness', 'Work', 'Study', 'Leisure', 'Life'];

export function AddRoutineModal({
  visible,
  onClose,
  onSave,
  defaultDay,
  initialItem,
}: AddRoutineModalProps) {
  const { theme } = useAppTheme();
  const [day, setDay] = useState<DayOfWeek>(defaultDay);
  const [time, setTime] = useState('07:00 AM');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Focus');

  useEffect(() => {
    if (initialItem) {
      setDay(initialItem.day);
      setTime(initialItem.time);
      setTitle(initialItem.title);
      setDescription(initialItem.description || '');
      setCategory(initialItem.category || 'Focus');
    } else {
      setDay(defaultDay);
      setTime('07:00 AM');
      setTitle('');
      setDescription('');
      setCategory('Focus');
    }
  }, [initialItem, defaultDay, visible]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      day,
      time: time.trim(),
      title: title.trim(),
      description: description.trim() || undefined,
      category: category.trim() || undefined,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
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
              {initialItem ? 'Edit Routine Habit' : 'Add Routine Habit'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            {/* Day Selector */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>Assigned Day</Text>
            <View style={styles.daySelectorRow}>
              {DAYS_OF_WEEK.map((d) => {
                const isSelected = day === d;
                return (
                  <TouchableOpacity
                    key={d}
                    onPress={() => setDay(d)}
                    style={[
                      styles.dayBtn,
                      {
                        backgroundColor: isSelected ? theme.primary : theme.surfaceSubtle,
                        borderColor: isSelected ? theme.primary : theme.borderSubtle,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayBtnText,
                        { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                      ]}
                    >
                      {d}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Time */}
            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 14 }]}>
              Scheduled Time
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.surfaceSubtle,
                  borderColor: theme.borderSubtle,
                  color: theme.text,
                },
              ]}
              placeholder="e.g. 07:00 AM"
              placeholderTextColor={theme.textMuted}
              value={time}
              onChangeText={setTime}
            />

            {/* Title */}
            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 14 }]}>
              Routine Title
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.surfaceSubtle,
                  borderColor: theme.borderSubtle,
                  color: theme.text,
                },
              ]}
              placeholder="e.g. Deep Architectural Design Session"
              placeholderTextColor={theme.textMuted}
              value={title}
              onChangeText={setTitle}
            />

            {/* Category */}
            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 14 }]}>
              Category
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
              {ROUTINE_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={[
                    styles.catPill,
                    {
                      backgroundColor:
                        category === cat ? theme.secondary : theme.surfaceSubtle,
                      borderColor: theme.borderSubtle,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.catText,
                      {
                        color: category === cat ? '#FFFFFF' : theme.textSecondary,
                      },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Description */}
            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 14 }]}>
              Notes / Description (Optional)
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
              placeholder="Key instructions or mindset cue"
              placeholderTextColor={theme.textMuted}
              value={description}
              onChangeText={setDescription}
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
                colors={['#06B6D4', '#6366F1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBtn}
              >
                <Text style={styles.saveBtnText}>
                  {initialItem ? 'Update Routine' : 'Save Routine'}
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
    maxHeight: '88%',
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
  daySelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  dayBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
  },
  dayBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
  },
  textArea: {
    minHeight: 65,
    textAlignVertical: 'top',
  },
  catScroll: {
    flexDirection: 'row',
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  catText: {
    fontSize: 12,
    fontWeight: '600',
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
