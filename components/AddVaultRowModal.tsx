import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { VaultRow } from '../constants/types';
import { useAppTheme } from '../hooks/useThemeContext';

interface AddVaultRowModalProps {
  visible: boolean;
  fileId: string;
  fileName: string;
  onClose: () => void;
  onSave: (data: {
    fileId: string;
    name: string;
    value: string;
    description: string;
    tag?: string;
    isSecret?: boolean;
  }) => void;
  initialRow?: VaultRow | null;
}

export function AddVaultRowModal({
  visible,
  fileId,
  fileName,
  onClose,
  onSave,
  initialRow,
}: AddVaultRowModalProps) {
  const { theme } = useAppTheme();
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');
  const [isSecret, setIsSecret] = useState(false);

  useEffect(() => {
    if (initialRow) {
      setName(initialRow.name);
      setValue(initialRow.value);
      setDescription(initialRow.description);
      setTag(initialRow.tag || '');
      setIsSecret(!!initialRow.isSecret);
    } else {
      setName('');
      setValue('');
      setDescription('');
      setTag('');
      setIsSecret(false);
    }
  }, [initialRow, visible]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      fileId,
      name: name.trim(),
      value: value.trim(),
      description: description.trim(),
      tag: tag.trim() || undefined,
      isSecret,
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
            <View>
              <Text style={[styles.headerTitle, { color: theme.text }]}>
                {initialRow ? 'Edit Record' : 'Add to ' + fileName}
              </Text>
              <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
                Store tools, links, credentials, or private info
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            {/* Name / Tool Name */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              Item / Tool Name
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
              placeholder="e.g. Supabase, OpenAI Key, Wi-Fi"
              placeholderTextColor={theme.textMuted}
              value={name}
              onChangeText={setName}
            />

            {/* Value / Link / Key */}
            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 14 }]}>
              Link URL, Key, or Value
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
              placeholder="e.g. https://supabase.com or sk-proj-1234..."
              placeholderTextColor={theme.textMuted}
              value={value}
              onChangeText={setValue}
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* What it does / Description */}
            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 14 }]}>
              What It Does / Description
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
              placeholder="e.g. Postgres DB with auth and real-time subscriptions"
              placeholderTextColor={theme.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={2}
            />

            {/* Tag / Category */}
            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 14 }]}>
              Tag / Category (Optional)
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
              placeholder="e.g. Database, AI, Frontend, Private"
              placeholderTextColor={theme.textMuted}
              value={tag}
              onChangeText={setTag}
            />

            {/* Mask as Secret Toggle */}
            <View
              style={[
                styles.switchRow,
                {
                  backgroundColor: theme.surfaceSubtle,
                  borderColor: theme.borderSubtle,
                },
              ]}
            >
              <View style={styles.switchInfo}>
                <View style={styles.switchTitleRow}>
                  <Ionicons name="eye-off-outline" size={17} color={theme.primary} />
                  <Text style={[styles.switchTitle, { color: theme.text }]}>
                    Mask as Secret / Password
                  </Text>
                </View>
                <Text style={[styles.switchDesc, { color: theme.textSecondary }]}>
                  Hides value with dots (••••) until you tap the eye icon
                </Text>
              </View>

              <Switch
                value={isSecret}
                onValueChange={setIsSecret}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSave}
              disabled={!name.trim()}
              style={[styles.saveButton, !name.trim() && { opacity: 0.5 }]}
            >
              <LinearGradient
                colors={['#06B6D4', '#6366F1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBtn}
              >
                <Text style={styles.saveBtnText}>
                  {initialRow ? 'Update Record' : 'Save to File'}
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
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  headerSub: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
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
    minHeight: 60,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 16,
  },
  switchInfo: {
    flex: 1,
    paddingRight: 10,
  },
  switchTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  switchDesc: {
    fontSize: 11,
    marginTop: 2,
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
