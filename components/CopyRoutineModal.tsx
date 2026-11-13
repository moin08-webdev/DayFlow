import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { DAY_NAMES, DayOfWeek, DAYS_OF_WEEK } from '../constants/types';
import { useAppTheme } from '../hooks/useThemeContext';

interface CopyRoutineModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (targetDays: DayOfWeek[]) => void;
  sourceDay: DayOfWeek;
  itemCount: number;
}

export function CopyRoutineModal({
  visible,
  onClose,
  onConfirm,
  sourceDay,
  itemCount,
}: CopyRoutineModalProps) {
  const { theme } = useAppTheme();
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);

  const toggleDay = (d: DayOfWeek) => {
    if (d === sourceDay) return; // Cannot copy to itself
    if (selectedDays.includes(d)) {
      setSelectedDays(selectedDays.filter((x) => x !== d));
    } else {
      setSelectedDays([...selectedDays, d]);
    }
  };

  const selectWeekdays = () => {
    const weekdays: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    setSelectedDays(weekdays.filter((d) => d !== sourceDay));
  };

  const selectWeekend = () => {
    const weekend: DayOfWeek[] = ['Sat', 'Sun'];
    setSelectedDays(weekend.filter((d) => d !== sourceDay));
  };

  const selectAll = () => {
    setSelectedDays(DAYS_OF_WEEK.filter((d) => d !== sourceDay));
  };

  const handleCopy = () => {
    if (selectedDays.length === 0) return;
    onConfirm(selectedDays);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
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
                Copy {DAY_NAMES[sourceDay]}'s Routine
              </Text>
              <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
                Copying {itemCount} habit{itemCount === 1 ? '' : 's'} to target days
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Quick Filter Buttons */}
          <View style={styles.quickFiltersRow}>
            <TouchableOpacity
              onPress={selectWeekdays}
              style={[styles.quickFilterBtn, { backgroundColor: theme.surfaceSubtle }]}
            >
              <Text style={[styles.quickFilterText, { color: theme.textSecondary }]}>
                Weekdays
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={selectWeekend}
              style={[styles.quickFilterBtn, { backgroundColor: theme.surfaceSubtle }]}
            >
              <Text style={[styles.quickFilterText, { color: theme.textSecondary }]}>
                Weekend
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={selectAll}
              style={[styles.quickFilterBtn, { backgroundColor: theme.surfaceSubtle }]}
            >
              <Text style={[styles.quickFilterText, { color: theme.textSecondary }]}>
                All Days
              </Text>
            </TouchableOpacity>
          </View>

          {/* Day List */}
          <View style={styles.daysList}>
            {DAYS_OF_WEEK.map((d) => {
              const isSource = d === sourceDay;
              const isSelected = selectedDays.includes(d);

              return (
                <TouchableOpacity
                  key={d}
                  disabled={isSource}
                  onPress={() => toggleDay(d)}
                  style={[
                    styles.dayRow,
                    {
                      backgroundColor: isSource
                        ? theme.surfaceSubtle
                        : isSelected
                        ? theme.isDark
                          ? 'rgba(6, 182, 212, 0.15)'
                          : 'rgba(6, 182, 212, 0.08)'
                        : theme.surfaceSubtle,
                      borderColor: isSelected ? '#06B6D4' : theme.borderSubtle,
                      opacity: isSource ? 0.45 : 1,
                    },
                  ]}
                >
                  <View style={styles.dayLeft}>
                    <Ionicons
                      name={
                        isSource
                          ? 'lock-closed-outline'
                          : isSelected
                          ? 'checkbox'
                          : 'square-outline'
                      }
                      size={20}
                      color={isSelected ? '#06B6D4' : theme.textMuted}
                    />
                    <Text
                      style={[
                        styles.dayName,
                        {
                          color: isSelected ? theme.text : theme.textSecondary,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {DAY_NAMES[d]} {isSource ? '(Source)' : ''}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.dayShort,
                      { color: isSelected ? '#06B6D4' : theme.textMuted },
                    ]}
                  >
                    {d}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Action Button */}
          <TouchableOpacity
            onPress={handleCopy}
            disabled={selectedDays.length === 0}
            style={[styles.copyButton, selectedDays.length === 0 && { opacity: 0.5 }]}
          >
            <LinearGradient
              colors={['#06B6D4', '#6366F1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBtn}
            >
              <Text style={styles.copyBtnText}>
                Copy to {selectedDays.length} Selected Day{selectedDays.length === 1 ? '' : 's'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
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
  quickFiltersRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  quickFilterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  quickFilterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  daysList: {
    gap: 8,
    marginBottom: 20,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  dayLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dayName: {
    fontSize: 14,
  },
  dayShort: {
    fontSize: 12,
    fontWeight: '700',
  },
  copyButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  gradientBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
