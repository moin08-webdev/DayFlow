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
import { RoadmapStep } from '../constants/types';
import { useAppTheme } from '../hooks/useThemeContext';

interface AddRoadmapStepModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (stepData: { title: string; description?: string; targetDate?: string }) => void;
  initialStep?: RoadmapStep | null;
}

export function AddRoadmapStepModal({
  visible,
  onClose,
  onSave,
  initialStep,
}: AddRoadmapStepModalProps) {
  const { theme } = useAppTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');

  useEffect(() => {
    if (initialStep) {
      setTitle(initialStep.title);
      setDescription(initialStep.description || '');
      setTargetDate(initialStep.targetDate || '');
    } else {
      setTitle('');
      setDescription('');
      setTargetDate('');
    }
  }, [initialStep, visible]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      targetDate: targetDate.trim() || undefined,
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
              {initialStep ? 'Edit Milestone' : 'Add Roadmap Milestone'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            {/* Title */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              Milestone Objective
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
              placeholder="e.g. Build authentication & session sync"
              placeholderTextColor={theme.textMuted}
              value={title}
              onChangeText={setTitle}
            />

            {/* Target Date */}
            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 14 }]}>
              Target Date (Optional)
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
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.textMuted}
              value={targetDate}
              onChangeText={setTargetDate}
            />

            {/* Description */}
            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 14 }]}>
              Key Deliverables / Notes (Optional)
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
              placeholder="Checklist, technical specs, or target metrics"
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
                  {initialStep ? 'Update Milestone' : 'Add Milestone'}
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
    maxHeight: '80%',
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
