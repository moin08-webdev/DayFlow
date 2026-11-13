import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PressableCard3D } from '../components/PressableCard3D';
import { ThemePreference } from '../constants/types';
import { useAppTheme } from '../hooks/useThemeContext';
import { storageClient } from '../services/storage/asyncStorageClient';

export default function SettingsModal() {
  const router = useRouter();
  const { theme, isDark, preference, setPreference } = useAppTheme();

  const themeOptions: { label: string; value: ThemePreference; icon: keyof typeof Ionicons.glyphMap }[] = [
    { label: 'System Default', value: 'system', icon: 'phone-portrait-outline' },
    { label: 'Light Theme', value: 'light', icon: 'sunny-outline' },
    { label: 'Dark Theme', value: 'dark', icon: 'moon-outline' },
  ];

  const handleResetAllData = () => {
    Alert.alert(
      'Reset All App Data',
      'This will erase all timetable items, tasks, routines, and expenses and restore fresh initial presets.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: async () => {
            await storageClient.clearAll();
            Alert.alert('Data Reset', 'App data has been reset to initial state. Please restart or refresh the tabs.');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Modal Header */}
      <View style={[styles.header, { borderBottomColor: theme.borderSubtle }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Settings & Theme</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            DayFlow Customization
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.closeBtn, { backgroundColor: theme.surfaceSubtle }]}
        >
          <Ionicons name="close" size={20} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Appearance Section */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>APPEARANCE</Text>

        <View style={styles.themesList}>
          {themeOptions.map((opt) => {
            const isSelected = preference === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setPreference(opt.value)}
                style={[
                  styles.themeOptionRow,
                  {
                    backgroundColor: theme.surface,
                    borderColor: isSelected ? theme.primary : theme.borderSubtle,
                  },
                ]}
              >
                <View style={styles.themeOptionLeft}>
                  <View
                    style={[
                      styles.iconCircle,
                      {
                        backgroundColor: isSelected
                          ? theme.isDark
                            ? 'rgba(99, 102, 241, 0.2)'
                            : 'rgba(99, 102, 241, 0.1)'
                          : theme.surfaceSubtle,
                      },
                    ]}
                  >
                    <Ionicons
                      name={opt.icon}
                      size={20}
                      color={isSelected ? theme.primary : theme.textSecondary}
                    />
                  </View>
                  <Text
                    style={[
                      styles.themeOptionLabel,
                      {
                        color: isSelected ? theme.text : theme.textSecondary,
                        fontWeight: isSelected ? '700' : '500',
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </View>

                <Ionicons
                  name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={isSelected ? theme.primary : theme.textMuted}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Storage & Architecture Section */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary, marginTop: 24 }]}>
          STORAGE & OFFLINE ARCHITECTURE
        </Text>

        <PressableCard3D variant="surface">
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#10B981" />
              <View style={styles.infoText}>
                <Text style={[styles.infoTitle, { color: theme.text }]}>100% Offline-First</Text>
                <Text style={[styles.infoDesc, { color: theme.textSecondary }]}>
                  All routines, timetable check-ins, tasks, and expenses are encrypted and stored locally on your device using AsyncStorage.
                </Text>
              </View>
            </View>

            <View style={[styles.infoDivider, { backgroundColor: theme.borderSubtle }]} />

            <View style={styles.infoRow}>
              <Ionicons name="server-outline" size={20} color="#06B6D4" />
              <View style={styles.infoText}>
                <Text style={[styles.infoTitle, { color: theme.text }]}>Modular Storage Layer</Text>
                <Text style={[styles.infoDesc, { color: theme.textSecondary }]}>
                  Isolated in services/storage, ready for seamless database or cloud backend sync.
                </Text>
              </View>
            </View>
          </View>
        </PressableCard3D>

        {/* Data Reset Button */}
        <TouchableOpacity
          onPress={handleResetAllData}
          style={[styles.resetButton, { borderColor: 'rgba(244, 63, 94, 0.3)' }]}
        >
          <Ionicons name="trash-bin-outline" size={17} color="#F43F5E" />
          <Text style={styles.resetButtonText}>Restore Sample Presets</Text>
        </TouchableOpacity>

        {/* App Version Info */}
        <View style={styles.footerInfo}>
          <Text style={[styles.footerText, { color: theme.textMuted }]}>
            DayFlow v1.0.0 • Native Android Expo Edition
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {},
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  themesList: {
    gap: 8,
  },
  themeOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  themeOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeOptionLabel: {
    fontSize: 15,
  },
  infoCard: {
    padding: 16,
    gap: 14,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  infoDesc: {
    fontSize: 12,
    marginTop: 3,
    lineHeight: 17,
  },
  infoDivider: {
    height: 1,
    width: '100%',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 24,
    backgroundColor: 'rgba(244, 63, 94, 0.06)',
  },
  resetButtonText: {
    color: '#F43F5E',
    fontSize: 14,
    fontWeight: '700',
  },
  footerInfo: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
