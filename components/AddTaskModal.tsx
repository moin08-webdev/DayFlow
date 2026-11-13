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
import { Priority, Task } from '../constants/types';
import { useAppTheme } from '../hooks/useThemeContext';
import { getTodayDateString } from '../utils/dateUtils';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (taskData: {
    title: string;
    description?: string;
    priority: Priority;
    dueDate?: string;
    category?: string;
  }) => void;
  initialTask?: Task | null;
}

const CATEGORY_OPTIONS = ['Work', 'Personal', 'Study', 'Health', 'Finance', 'Home'];

export function AddTaskModal({
  visible,
  onClose,
  onSave,
  initialTask,
}: AddTaskModalProps) {
  const { theme } = useAppTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Work');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setPriority(initialTask.priority);
      setDueDate(initialTask.dueDate || '');
      setCategory(initialTask.category || 'Work');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate(getTodayDateString());
      setCategory('Work');
    }
  }, [initialTask, visible]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate.trim() || undefined,
      category: category.trim() || undefined,
    });
    onClose();
  };

  const handleQuickDueDate = (daysAhead: number) => {
    const d = new Date(Date.now() + daysAhead * 86400000);
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    setDueDate(`${yr}-${mo}-${day}`);
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
              {initialTask ? 'Edit Task' : 'Add New Task'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            {/* Title */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>Task Title</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.surfaceSubtle,
                  borderColor: theme.borderSubtle,
                  color: theme.text,
                },
              ]}
              placeholder="What needs to get done?"
              placeholderTextColor={theme.textMuted}
              value={title}
              onChangeText={setTitle}
            />

            {/* Priority Selector */}
            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 14 }]}>
              Priority
            </Text>
            <View style={styles.priorityRow}>
              {(['low', 'medium', 'high'] as Priority[]).map((p) => {
                const isSelected = priority === p;
                const colors = {
                  low: '#10B981',
                  medium: '#F59E0B',
                  high: '#F43F5E',
                };
                return (
                  <TouchableOpacity
                    key={p}
                    onPress={() => setPriority(p)}
                    style={[
                      styles.priorityPill,
                      {
                        backgroundColor: isSelected
                          ? colors[p]
                          : theme.surfaceSubtle,
                        borderColor: isSelected ? colors[p] : theme.borderSubtle,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.priorityText,
                        { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                      ]}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Category Selector */}
            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 14 }]}>
              Category
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
              {CATEGORY_OPTIONS.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={[
                    styles.catPill,
                    {
                      backgroundColor:
                        category === cat ? theme.primary : theme.surfaceSubtle,
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

            {/* Due Date */}
            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 14 }]}>
              Due Date
            </Text>
            <View style={styles.datePresetsRow}>
              <TouchableOpacity
                onPress={() => handleQuickDueDate(0)}
                style={[styles.datePresetBtn, { backgroundColor: theme.surfaceSubtle }]}
              >
                <Text style={[styles.datePresetText, { color: theme.textSecondary }]}>
                  Today
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleQuickDueDate(1)}
                style={[styles.datePresetBtn, { backgroundColor: theme.surfaceSubtle }]}
              >
                <Text style={[styles.datePresetText, { color: theme.textSecondary }]}>
                  Tomorrow
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleQuickDueDate(7)}
                style={[styles.datePresetBtn, { backgroundColor: theme.surfaceSubtle }]}
              >
                <Text style={[styles.datePresetText, { color: theme.textSecondary }]}>
                  Next Week
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.surfaceSubtle,
                  borderColor: theme.borderSubtle,
                  color: theme.text,
                  marginTop: 8,
                },
              ]}
              placeholder="YYYY-MM-DD (e.g. 2026-11-15)"
              placeholderTextColor={theme.textMuted}
              value={dueDate}
              onChangeText={setDueDate}
            />

            {/* Description */}
            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 14 }]}>
              Description / Notes (Optional)
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
              placeholder="Additional details, checklist or links"
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
                colors={['#8B5CF6', '#6366F1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBtn}
              >
                <Text style={styles.saveBtnText}>
                  {initialTask ? 'Update Task' : 'Create Task'}
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
  priorityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityPill: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 13,
    fontWeight: '700',
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
  datePresetsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  datePresetBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  datePresetText: {
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
