import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PriorityColors } from '../constants/theme';
import { Task } from '../constants/types';
import { useAppTheme } from '../hooks/useThemeContext';
import { formatFriendlyDate } from '../utils/dateUtils';
import { CheckmarkPop } from './CheckmarkPop';
import { PressableCard3D } from './PressableCard3D';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const { theme } = useAppTheme();
  const priorityInfo = PriorityColors[task.priority] || PriorityColors.medium;

  return (
    <PressableCard3D
      onPress={onToggle}
      variant={task.completed ? 'subtle' : 'surface'}
      style={task.completed ? { opacity: 0.78 } : undefined}
    >
      <View style={styles.cardContent}>
        {/* Left Checkmark */}
        <View style={styles.checkWrapper}>
          <CheckmarkPop checked={task.completed} onToggle={onToggle} size={26} />
        </View>

        {/* Center Details */}
        <View style={styles.details}>
          {/* Metadata Row: Priority & Due Date & Category */}
          <View style={styles.metaRow}>
            {/* Priority Badge */}
            <View
              style={[
                styles.priorityBadge,
                {
                  backgroundColor: priorityInfo.bg,
                  borderColor: priorityInfo.border,
                },
              ]}
            >
              <View
                style={[styles.priorityDot, { backgroundColor: priorityInfo.color }]}
              />
              <Text style={[styles.priorityText, { color: priorityInfo.color }]}>
                {priorityInfo.label}
              </Text>
            </View>

            {/* Category if any */}
            {task.category ? (
              <View
                style={[
                  styles.categoryBadge,
                  {
                    backgroundColor: theme.isDark
                      ? 'rgba(255, 255, 255, 0.06)'
                      : 'rgba(0, 0, 0, 0.05)',
                  },
                ]}
              >
                <Text style={[styles.categoryText, { color: theme.textSecondary }]}>
                  {task.category}
                </Text>
              </View>
            ) : null}

            {/* Due Date if any */}
            {task.dueDate ? (
              <View style={styles.dueDateBadge}>
                <Ionicons
                  name="calendar-outline"
                  size={12}
                  color={theme.textMuted}
                />
                <Text style={[styles.dueDateText, { color: theme.textMuted }]}>
                  {formatFriendlyDate(task.dueDate)}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Title */}
          <Text
            style={[
              styles.title,
              {
                color: task.completed ? theme.textSecondary : theme.text,
                textDecorationLine: task.completed ? 'line-through' : 'none',
              },
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Text>

          {/* Description */}
          {task.description ? (
            <Text
              style={[styles.description, { color: theme.textMuted }]}
              numberOfLines={2}
            >
              {task.description}
            </Text>
          ) : null}
        </View>

        {/* Right Actions */}
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
  details: {
    flex: 1,
    paddingRight: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 5,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  categoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  dueDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateText: {
    fontSize: 11,
    fontWeight: '500',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  description: {
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
