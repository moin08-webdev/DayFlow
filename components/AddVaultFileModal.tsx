import React, { useState } from 'react';
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
import { useAppTheme } from '../hooks/useThemeContext';

interface AddVaultFileModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: { name: string; icon: string; description?: string }) => void;
}

const ICONS_LIST: Array<keyof typeof Ionicons.glyphMap> = [
  'construct-outline',
  'key-outline',
  'shield-checkmark-outline',
  'globe-outline',
  'server-outline',
  'card-outline',
  'bookmark-outline',
  'document-text-outline',
  'cube-outline',
];

export function AddVaultFileModal({ visible, onClose, onSave }: AddVaultFileModalProps) {
  const { theme } = useAppTheme();
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string>('construct-outline');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      icon: selectedIcon,
      description: description.trim() || undefined,
    });
    setName('');
    setDescription('');
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
              Create New Vault File
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            {/* File Name */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              File / Collection Name
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
              placeholder="e.g. AI Tools, Cloud Keys, Passwords"
              placeholderTextColor={theme.textMuted}
              value={name}
              onChangeText={setName}
            />

            {/* Icon Picker */}
            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 14 }]}>
              Choose File Icon
            </Text>
            <View style={styles.iconGrid}>
              {ICONS_LIST.map((ic) => {
                const isSelected = selectedIcon === ic;
                return (
                  <TouchableOpacity
                    key={ic}
                    onPress={() => setSelectedIcon(ic)}
                    style={[
                      styles.iconBtn,
                      {
                        backgroundColor: isSelected
                          ? theme.primary
                          : theme.surfaceSubtle,
                        borderColor: isSelected ? theme.primary : theme.borderSubtle,
                      },
                    ]}
                  >
                    <Ionicons
                      name={ic}
                      size={22}
                      color={isSelected ? '#FFFFFF' : theme.textSecondary}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Description */}
            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 14 }]}>
              Description (Optional)
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
              placeholder="What kind of records are stored in this file?"
              placeholderTextColor={theme.textMuted}
              value={description}
              onChangeText={setDescription}
            />

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
                <Text style={styles.saveBtnText}>Create File</Text>
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
    maxHeight: '75%',
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
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
