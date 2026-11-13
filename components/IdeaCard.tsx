import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Idea } from '../constants/types';
import { useAppTheme } from '../hooks/useThemeContext';
import { ideaService } from '../services/storage/ideaService';
import { PressableCard3D } from './PressableCard3D';

interface IdeaCardProps {
  idea: Idea;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const STATUS_CONFIG = {
  Brainstorming: { color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.14)', icon: 'bulb-outline' },
  'In Progress': { color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.14)', icon: 'trending-up' },
  Shipped: { color: '#10B981', bg: 'rgba(16, 185, 129, 0.14)', icon: 'checkmark-circle' },
  Paused: { color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.14)', icon: 'pause-circle' },
};

export function IdeaCard({ idea, onPress, onEdit, onDelete }: IdeaCardProps) {
  const { theme, isDark } = useAppTheme();
  const { completed, total, percentage } = ideaService.calculateProgress(idea);
  const statusCfg = STATUS_CONFIG[idea.status] || STATUS_CONFIG.Brainstorming;

  return (
    <PressableCard3D onPress={onPress} variant="surface">
      <View style={styles.cardContent}>
        {/* Top Header: Tag & Status & Actions */}
        <View style={styles.topRow}>
          <View style={styles.tagGroup}>
            <View
              style={[
                styles.tagPill,
                {
                  backgroundColor: isDark
                    ? 'rgba(99, 102, 241, 0.15)'
                    : 'rgba(99, 102, 241, 0.08)',
                },
              ]}
            >
              <Text style={[styles.tagText, { color: theme.primary }]}>
                {idea.tag}
              </Text>
            </View>

            <View style={[styles.statusPill, { backgroundColor: statusCfg.bg }]}>
              <Ionicons
                name={statusCfg.icon as keyof typeof Ionicons.glyphMap}
                size={11}
                color={statusCfg.color}
              />
              <Text style={[styles.statusText, { color: statusCfg.color }]}>
                {idea.status}
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onEdit}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.actionBtn}
            >
              <Ionicons name="pencil-outline" size={16} color={theme.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onDelete}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.actionBtn}
            >
              <Ionicons name="trash-outline" size={16} color="#F43F5E" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
          {idea.title}
        </Text>

        {/* Description */}
        {idea.description ? (
          <Text
            style={[styles.description, { color: theme.textSecondary }]}
            numberOfLines={2}
          >
            {idea.description}
          </Text>
        ) : null}

        {/* Roadmap Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressLabels}>
            <Text style={[styles.roadmapLabel, { color: theme.textMuted }]}>
              ROADMAP PROGRESS
            </Text>
            <Text style={[styles.progressCount, { color: theme.text }]}>
              {completed}/{total} steps ({percentage}%)
            </Text>
          </View>

          <View
            style={[
              styles.progressBarTrack,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.06)',
              },
            ]}
          >
            <LinearGradient
              colors={
                percentage === 100
                  ? ['#10B981', '#059669']
                  : ['#06B6D4', '#6366F1']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.progressBarFill,
                { width: `${Math.max(percentage, total > 0 ? 4 : 0)}%` },
              ]}
            />
          </View>
        </View>

        {/* Bottom CTA hint */}
        <View style={styles.cardFooter}>
          <Text style={[styles.ctaText, { color: theme.primary }]}>
            View Roadmap & Milestones
          </Text>
          <Ionicons name="chevron-forward" size={15} color={theme.primary} />
        </View>
      </View>
    </PressableCard3D>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionBtn: {
    padding: 2,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 22,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  progressSection: {
    marginTop: 4,
    marginBottom: 12,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  roadmapLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  progressCount: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 7,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 2,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.1)',
  },
  ctaText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
