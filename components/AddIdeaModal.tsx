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
import { Idea, IdeaStatus } from '../constants/types';
import { useAppTheme } from '../hooks/useThemeContext';

interface AddIdeaModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (ideaData: {
    title: string;
    tag: string;
    description?: string;
    status: IdeaStatus;
    targetDate?: string;
    initialSteps?: string[];
  }) => void;
  initialIdea?: Idea | null;
}

const TAG_OPTIONS = ['Startup', 'Mobile App', 'AI Tool', 'Content', 'Productivity', 'Personal'];
const STATUS_OPTIONS: IdeaStatus[] = ['Brainstorming', 'In Progress', 'Shipped', 'Paused'];

export function AddIdeaModal({
  visible,
  onClose,
  onSave,
  initialIdea,
}: AddIdeaModalProps) {
  const { theme } = useAppTheme();
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('Mobile App');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<IdeaStatus>('Brainstorming');
  const [targetDate, setTargetDate] = useState('');
  const [quickSteps, setQuickSteps] = useState('');

  useEffect(() => {
    if (initialIdea) {
      setTitle(initialIdea.title);
      setTag(initialIdea.tag);
      setDescription(initialIdea.description || '');
      setStatus(initialIdea.status);
      setTargetDate(initialIdea.targetDate || '');
      setQuickSteps('');
    } else {
      setTitle('');
      setTag('Mobile App');
      setDescription('');
      setStatus('Brainstorming');
      setTargetDate('');
      setQuickSteps('');
    }
  }, [initialIdea, visible]);

  const handleSave = () => {
    if (!title.trim()) return;

    const initialSteps = quickSteps
      ? quickSteps
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined;

    onSave({
      title: title.trim(),
      tag: tag.trim(),
      description: description.trim() || undefined,
      status,
      targetDate: targetDate.trim() || undefined,
      initialSteps,
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
              {initialIdea ? 'Edit Idea' : 'Capture New Idea'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            {/* Title */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>Idea Title</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.surfaceSubtle,
                  borderColor: theme.borderSubtle,
                  color: theme.text,
                },
              ]}
              placeholder="e.g. AI-Powered Habit Journal"
              placeholderTextColor={theme.textMuted}
              value={title}
              onChangeText={setTitle}
            />

            {/* Tag / Category */}
            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 14 }]}>
              Category / Tag
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagScroll}>
              {TAG_OPTIONS.map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setTag(t)}
                  style={[
                    styles.tagPill,
                    {
                      backgroundColor: tag === t ? theme.primary : theme.surfaceSubtle,
                      borderColor: theme.borderSubtle,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      { color: tag === t ? '#FFFFFF' : theme.textSecondary },
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Status */}
            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 14 }]}>
              Current Status
            </Text>
            <View style={styles.statusRow}>
              {STATUS_OPTIONS.map((st) => (
                <TouchableOpacity
                  key={st}
                  onPress={() => setStatus(st)}
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor: status === st ? theme.secondary : theme.surfaceSubtle,
                      borderColor: theme.borderSubtle,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      { color: status === st ? '#FFFFFF' : theme.textSecondary },
                    ]}
                  >
                    {st}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Target Date */}
            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 14 }]}>
              Target Completion (Optional)
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
              placeholder="YYYY-MM-DD (e.g. 2026-12-31)"
              placeholderTextColor={theme.textMuted}
              value={targetDate}
              onChangeText={setTargetDate}
            />

            {/* Description */}
            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 14 }]}>
              Description & Vision
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
              placeholder="What problem does this solve? What is the core value proposition?"
              placeholderTextColor={theme.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            {/* Initial Roadmap Steps (only for new ideas) */}
            {!initialIdea && (
              <>
                <Text style={[styles.label, { color: theme.textSecondary, marginTop: 14 }]}>
                  Initial Roadmap Steps (1 per line)
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
                  placeholder={"Phase 1: Market & user research\nPhase 2: Build prototype MVP\nPhase 3: Launch to first 100 users"}
                  placeholderTextColor={theme.textMuted}
                  value={quickSteps}
                  onChangeText={setQuickSteps}
                  multiline
                  numberOfLines={4}
                />
              </>
            )}

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
                  {initialIdea ? 'Update Idea' : 'Create Idea & Roadmap'}
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
  tagScroll: {
    flexDirection: 'row',
  },
  tagPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusPillText: {
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
