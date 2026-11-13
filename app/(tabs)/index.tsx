import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AddTimetableModal } from '../../components/AddTimetableModal';
import { Header3D } from '../../components/Header3D';
import { PressableCard3D } from '../../components/PressableCard3D';
import { ProgressRing } from '../../components/ProgressRing';
import { TimetableStepItem } from '../../components/TimetableStepItem';
import { TimetableStep } from '../../constants/types';
import { useAppTheme } from '../../hooks/useThemeContext';
import { timetableService } from '../../services/storage/timetableService';
import { getGreeting } from '../../utils/dateUtils';

export default function TodayScreen() {
  const { theme, isDark } = useAppTheme();
  const [steps, setSteps] = useState<TimetableStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStep, setEditingStep] = useState<TimetableStep | null>(null);

  const loadSteps = useCallback(async () => {
    try {
      const data = await timetableService.getTimetableSteps();
      setSteps(data);
    } catch (error) {
      console.error('Failed to load timetable steps:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSteps();
  }, [loadSteps]);

  const onRefresh = () => {
    setRefreshing(true);
    loadSteps();
  };

  const handleToggleStep = async (id: string) => {
    const updated = await timetableService.toggleStep(id);
    setSteps(updated);
  };

  const handleSaveStep = async (stepData: {
    title: string;
    startTime: string;
    endTime: string;
    note?: string;
  }) => {
    if (editingStep) {
      const updated = await timetableService.updateStep(editingStep.id, stepData);
      setSteps(updated);
      setEditingStep(null);
    } else {
      const updated = await timetableService.addStep(stepData);
      setSteps(updated);
    }
  };

  const handleDeleteStep = (step: TimetableStep) => {
    Alert.alert(
      'Delete Step',
      `Are you sure you want to remove "${step.title}" from your daily schedule?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = await timetableService.deleteStep(step.id);
            setSteps(updated);
          },
        },
      ]
    );
  };

  const handleResetCheckins = () => {
    Alert.alert(
      'Reset Daily Check-ins',
      'This will uncheck all steps for today. Your timetable schedule remains saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            const updated = await timetableService.resetTodayCheckins();
            setSteps(updated);
          },
        },
      ]
    );
  };

  const completedCount = steps.filter((s) => s.completedToday).length;
  const totalCount = steps.length;
  const greeting = getGreeting();

  const renderHeader = () => (
    <View style={styles.headerComponent}>
      {/* 3D Hero Card with Progress Ring */}
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
          {/* Top Row: Greeting & Reset Button */}
          <View style={styles.heroTopRow}>
            <View>
              <Text style={[styles.heroGreeting, { color: theme.textSecondary }]}>
                {greeting}
              </Text>
              <Text style={[styles.heroHeadline, { color: theme.text }]}>
                Today's Flow
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleResetCheckins}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={[
                styles.resetBtn,
                {
                  backgroundColor: theme.isDark
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.05)',
                  borderColor: theme.borderSubtle,
                },
              ]}
            >
              <Ionicons name="refresh" size={14} color={theme.textMuted} />
              <Text style={[styles.resetBtnText, { color: theme.textSecondary }]}>
                Reset
              </Text>
            </TouchableOpacity>
          </View>

          {/* Center Progress Ring */}
          <View style={styles.ringWrapper}>
            <ProgressRing
              total={totalCount}
              completed={completedCount}
              size={174}
              strokeWidth={14}
            />
          </View>

          {/* Bottom Motive Banner */}
          <View
            style={[
              styles.motiveBanner,
              {
                backgroundColor:
                  completedCount === totalCount && totalCount > 0
                    ? 'rgba(16, 185, 129, 0.15)'
                    : theme.isDark
                    ? 'rgba(99, 102, 241, 0.12)'
                    : 'rgba(99, 102, 241, 0.08)',
              },
            ]}
          >
            <Ionicons
              name={
                completedCount === totalCount && totalCount > 0
                  ? 'checkmark-done-circle'
                  : 'flash'
              }
              size={16}
              color={
                completedCount === totalCount && totalCount > 0
                  ? '#10B981'
                  : theme.primary
              }
            />
            <Text
              style={[
                styles.motiveText,
                {
                  color:
                    completedCount === totalCount && totalCount > 0
                      ? '#10B981'
                      : theme.primary,
                },
              ]}
            >
              {completedCount === totalCount && totalCount > 0
                ? 'All routines completed today! Outstanding work.'
                : `${totalCount - completedCount} more step${
                    totalCount - completedCount === 1 ? '' : 's'
                  } to complete your day.`}
            </Text>
          </View>
        </LinearGradient>
      </PressableCard3D>

      {/* Timetable Section Header */}
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleGroup}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Daily Schedule
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Auto-resets every morning
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            setEditingStep(null);
            setModalVisible(true);
          }}
          activeOpacity={0.8}
          style={styles.addBtn}
        >
          <LinearGradient
            colors={['#8B5CF6', '#6366F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addBtnGradient}
          >
            <Ionicons name="add" size={17} color="#FFFFFF" />
            <Text style={styles.addBtnText}>Add Step</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header3D />

      <FlatList
        data={steps}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TimetableStepItem
            step={item}
            onToggle={() => handleToggleStep(item.id)}
            onEdit={() => {
              setEditingStep(item);
              setModalVisible(true);
            }}
            onDelete={() => handleDeleteStep(item)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={48} color={theme.textMuted} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                No schedule steps yet
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                Tap "Add Step" above to build your daily timetable.
              </Text>
            </View>
          ) : undefined
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
      />

      {/* Add / Edit Modal */}
      <AddTimetableModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingStep(null);
        }}
        onSave={handleSaveStep}
        initialStep={editingStep}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  headerComponent: {
    paddingTop: 8,
    marginBottom: 8,
  },
  heroCard: {
    marginBottom: 16,
  },
  heroGradient: {
    padding: 18,
    borderRadius: 20,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroGreeting: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroHeadline: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginTop: 2,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
  },
  resetBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  ringWrapper: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  motiveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  motiveText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitleGroup: {},
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  addBtn: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  addBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
