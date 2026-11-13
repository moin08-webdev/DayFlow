import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Idea, IdeaStatus, RoadmapStep } from '../constants/types';
import { useAppTheme } from '../hooks/useThemeContext';
import { ideaService } from '../services/storage/ideaService';
import { CheckmarkPop } from './CheckmarkPop';
import { PressableCard3D } from './PressableCard3D';
import { ProgressRing } from './ProgressRing';

interface RoadmapDetailModalProps {
  visible: boolean;
  idea: Idea | null;
  onClose: () => void;
  onUpdateIdea: (updatedIdea: Idea) => void;
  onOpenAddStep: () => void;
  onEditStep: (step: RoadmapStep) => void;
}

export function RoadmapDetailModal({
  visible,
  idea,
  onClose,
  onUpdateIdea,
  onOpenAddStep,
  onEditStep,
}: RoadmapDetailModalProps) {
  const { theme, isDark } = useAppTheme();

  if (!idea) return null;

  const { completed, total, percentage } = ideaService.calculateProgress(idea);

  const handleToggleStep = async (stepId: string) => {
    const updated = await ideaService.toggleRoadmapStep(idea.id, stepId);
    if (updated) {
      onUpdateIdea(updated);
    }
  };

  const handleDeleteStep = (step: RoadmapStep) => {
    Alert.alert(
      'Delete Milestone',
      `Delete "${step.title}" from this roadmap?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = await ideaService.deleteRoadmapStep(idea.id, step.id);
            if (updated) onUpdateIdea(updated);
          },
        },
      ]
    );
  };

  const handleChangeStatus = async (newStatus: IdeaStatus) => {
    const updated = await ideaService.updateIdea(idea.id, { status: newStatus });
    const fresh = updated.find((i) => i.id === idea.id);
    if (fresh) onUpdateIdea(fresh);
  };

  const sortedRoadmap = [...idea.roadmap].sort((a, b) => a.order - b.order);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Top App Bar */}
        <View style={[styles.appBar, { borderBottomColor: theme.borderSubtle }]}>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={[styles.backBtn, { backgroundColor: theme.surfaceSubtle }]}
          >
            <Ionicons name="arrow-back" size={20} color={theme.text} />
          </TouchableOpacity>

          <View style={styles.appBarTitleGroup}>
            <Text style={[styles.appBarCategory, { color: theme.primary }]}>
              {idea.tag} ROADMAP
            </Text>
            <Text style={[styles.appBarTitle, { color: theme.text }]} numberOfLines={1}>
              {idea.title}
            </Text>
          </View>

          <TouchableOpacity
            onPress={onOpenAddStep}
            style={styles.addMilestoneBtn}
          >
            <LinearGradient
              colors={['#06B6D4', '#6366F1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addMilestoneGradient}
            >
              <Ionicons name="add" size={17} color="#FFFFFF" />
              <Text style={styles.addMilestoneText}>Add Step</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Card: Progress Ring & Stats */}
          <PressableCard3D variant="surface" style={styles.heroCard}>
            <LinearGradient
              colors={
                isDark
                  ? ['#1E1B4B', '#0F172A']
                  : ['#EEF2FF', '#FFFFFF']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            >
              <View style={styles.heroRow}>
                {/* Left: Progress Ring */}
                <ProgressRing
                  total={total}
                  completed={completed}
                  size={140}
                  strokeWidth={12}
                />

                {/* Right: Info & Status Pills */}
                <View style={styles.heroRight}>
                  <Text style={[styles.heroHeading, { color: theme.text }]}>
                    Execution Tracker
                  </Text>
                  <Text style={[styles.heroSub, { color: theme.textSecondary }]}>
                    {completed} of {total} milestones done
                  </Text>

                  {/* Status Pills */}
                  <View style={styles.statusRow}>
                    {(['Brainstorming', 'In Progress', 'Shipped', 'Paused'] as IdeaStatus[]).map((st) => {
                      const isSelected = idea.status === st;
                      return (
                        <TouchableOpacity
                          key={st}
                          onPress={() => handleChangeStatus(st)}
                          style={[
                            styles.statusBtn,
                            {
                              backgroundColor: isSelected
                                ? theme.primary
                                : isDark
                                ? 'rgba(255, 255, 255, 0.08)'
                                : 'rgba(0, 0, 0, 0.05)',
                              borderColor: isSelected ? theme.primary : theme.borderSubtle,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusBtnText,
                              { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                            ]}
                          >
                            {st}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>

              {idea.description ? (
                <View style={[styles.descBox, { borderTopColor: theme.borderSubtle }]}>
                  <Text style={[styles.descText, { color: theme.textSecondary }]}>
                    {idea.description}
                  </Text>
                </View>
              ) : null}
            </LinearGradient>
          </PressableCard3D>

          {/* Section Heading */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Roadmap Timeline
            </Text>
            <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
              Check off steps as you make progress
            </Text>
          </View>

          {/* Milestone Steps List */}
          {sortedRoadmap.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="git-commit-outline" size={44} color={theme.textMuted} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                No milestones added yet
              </Text>
              <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
                Tap "+ Add Step" above to lay out your roadmap phases.
              </Text>
            </View>
          ) : (
            <View style={styles.stepsTimeline}>
              {sortedRoadmap.map((step, index) => (
                <PressableCard3D
                  key={step.id}
                  variant={step.completed ? 'subtle' : 'surface'}
                  style={step.completed ? { opacity: 0.82 } : undefined}
                >
                  <View style={styles.stepContent}>
                    {/* Left Checkmark with pop */}
                    <View style={styles.stepCheck}>
                      <CheckmarkPop
                        checked={step.completed}
                        onToggle={() => handleToggleStep(step.id)}
                        size={26}
                      />
                    </View>

                    {/* Step Body */}
                    <View style={styles.stepBody}>
                      <View style={styles.stepMetaRow}>
                        <View
                          style={[
                            styles.phaseBadge,
                            {
                              backgroundColor: step.completed
                                ? 'rgba(16, 185, 129, 0.12)'
                                : 'rgba(99, 102, 241, 0.12)',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.phaseText,
                              { color: step.completed ? '#10B981' : theme.primary },
                            ]}
                          >
                            Step {index + 1}
                          </Text>
                        </View>

                        {step.targetDate ? (
                          <View style={styles.dateBadge}>
                            <Ionicons
                              name="calendar-outline"
                              size={11}
                              color={theme.textMuted}
                            />
                            <Text
                              style={[styles.dateText, { color: theme.textMuted }]}
                            >
                              {step.targetDate}
                            </Text>
                          </View>
                        ) : null}
                      </View>

                      <Text
                        style={[
                          styles.stepTitle,
                          {
                            color: step.completed ? theme.textSecondary : theme.text,
                            textDecorationLine: step.completed ? 'line-through' : 'none',
                          },
                        ]}
                      >
                        {step.title}
                      </Text>

                      {step.description ? (
                        <Text
                          style={[styles.stepDesc, { color: theme.textMuted }]}
                        >
                          {step.description}
                        </Text>
                      ) : null}
                    </View>

                    {/* Right Action Icons */}
                    <View style={styles.stepActions}>
                      <TouchableOpacity
                        onPress={() => onEditStep(step)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Ionicons
                          name="pencil-outline"
                          size={16}
                          color={theme.textMuted}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteStep(step)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={16}
                          color="#F43F5E"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </PressableCard3D>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appBarTitleGroup: {
    flex: 1,
  },
  appBarCategory: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  appBarTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  addMilestoneBtn: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  addMilestoneGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  addMilestoneText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  heroCard: {
    marginBottom: 16,
  },
  heroGradient: {
    padding: 16,
    borderRadius: 20,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroRight: {
    flex: 1,
  },
  heroHeading: {
    fontSize: 17,
    fontWeight: '800',
  },
  heroSub: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  statusBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusBtnText: {
    fontSize: 10,
    fontWeight: '700',
  },
  descBox: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  descText: {
    fontSize: 13,
    lineHeight: 18,
  },
  sectionHeader: {
    marginTop: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  stepsTimeline: {
    gap: 4,
  },
  stepContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  stepCheck: {
    marginRight: 12,
  },
  stepBody: {
    flex: 1,
    paddingRight: 8,
  },
  stepMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  phaseBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  phaseText: {
    fontSize: 10,
    fontWeight: '700',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 11,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  stepDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  stepActions: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptySub: {
    fontSize: 12,
    textAlign: 'center',
  },
});
