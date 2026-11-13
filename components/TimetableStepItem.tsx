import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TimetableStep } from '../constants/types';
import { useAppTheme } from '../hooks/useThemeContext';
import { CheckmarkPop } from './CheckmarkPop';
import { PressableCard3D } from './PressableCard3D';

interface TimetableStepItemProps {
  step: TimetableStep;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TimetableStepItem({
  step,
  onToggle,
  onEdit,
  onDelete,
}: TimetableStepItemProps) {
  const { theme } = useAppTheme();

  return (
    <PressableCard3D
      onPress={onToggle}
      variant={step.completedToday ? 'subtle' : 'surface'}
      style={step.completedToday ? { opacity: 0.82 } : undefined}
    >
      <View style={styles.cardContent}>
        {/* Left: Checkmark */}
        <View style={styles.checkWrapper}>
          <CheckmarkPop checked={step.completedToday} onToggle={onToggle} size={26} />
        </View>

        {/* Center: Time, Title, Note */}
        <View style={styles.mainInfo}>
          <View style={styles.timeBadgeRow}>
            <View
              style={[
                styles.timeBadge,
                {
                  backgroundColor: step.completedToday
                    ? theme.isDark
                      ? 'rgba(16, 185, 129, 0.12)'
                      : 'rgba(16, 185, 129, 0.1)'
                    : theme.isDark
                    ? 'rgba(99, 102, 241, 0.15)'
                    : 'rgba(99, 102, 241, 0.08)',
                },
              ]}
            >
              <Ionicons
                name="time-outline"
                size={12}
                color={step.completedToday ? '#10B981' : theme.primary}
              />
              <Text
                style={[
                  styles.timeText,
                  { color: step.completedToday ? '#10B981' : theme.primary },
                ]}
              >
                {step.startTime} - {step.endTime}
              </Text>
            </View>
          </View>

          <Text
            style={[
              styles.title,
              {
                color: step.completedToday ? theme.textSecondary : theme.text,
                textDecorationLine: step.completedToday ? 'line-through' : 'none',
              },
            ]}
            numberOfLines={2}
          >
            {step.title}
          </Text>

          {step.note ? (
            <Text
              style={[styles.note, { color: theme.textMuted }]}
              numberOfLines={2}
            >
              {step.note}
            </Text>
          ) : null}
        </View>

        {/* Right: Quick Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={onEdit}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.actionBtn}
          >
            <Ionicons name="pencil-outline" size={17} color={theme.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDelete}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.actionBtn}
          >
            <Ionicons name="trash-outline" size={17} color="#F43F5E" />
          </TouchableOpacity>
        </View>
      </View>
    </PressableCard3D>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  checkWrapper: {
    marginRight: 12,
  },
  mainInfo: {
    flex: 1,
    paddingRight: 8,
  },
  timeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  note: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 3,
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  actionBtn: {
    padding: 3,
  },
});
