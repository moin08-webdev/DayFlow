import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RoutineItem } from '../constants/types';
import { useAppTheme } from '../hooks/useThemeContext';
import { PressableCard3D } from './PressableCard3D';

interface RoutineItemCardProps {
  item: RoutineItem;
  onEdit: () => void;
  onDelete: () => void;
}

export function RoutineItemCard({ item, onEdit, onDelete }: RoutineItemCardProps) {
  const { theme } = useAppTheme();

  return (
    <PressableCard3D variant="surface">
      <View style={styles.content}>
        {/* Time Marker Column */}
        <View style={styles.timeColumn}>
          <View
            style={[
              styles.timePill,
              {
                backgroundColor: theme.isDark
                  ? 'rgba(6, 182, 212, 0.15)'
                  : 'rgba(6, 182, 212, 0.1)',
              },
            ]}
          >
            <Ionicons name="time" size={13} color="#06B6D4" />
            <Text style={styles.timeText}>{item.time}</Text>
          </View>

          {item.category ? (
            <View
              style={[
                styles.categoryPill,
                {
                  backgroundColor: theme.isDark
                    ? 'rgba(255, 255, 255, 0.06)'
                    : 'rgba(0, 0, 0, 0.05)',
                },
              ]}
            >
              <Text style={[styles.categoryText, { color: theme.textSecondary }]}>
                {item.category}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Content Column */}
        <View style={styles.bodyColumn}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
            {item.title}
          </Text>
          {item.description ? (
            <Text
              style={[styles.description, { color: theme.textSecondary }]}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          ) : null}
        </View>

        {/* Actions */}
        <View style={styles.actionsColumn}>
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  timeColumn: {
    alignItems: 'flex-start',
    marginRight: 12,
    gap: 4,
    minWidth: 80,
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  timeText: {
    color: '#06B6D4',
    fontSize: 11,
    fontWeight: '700',
  },
  categoryPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
  },
  bodyColumn: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  description: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 2,
  },
  actionsColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  actionBtn: {
    padding: 3,
  },
});
