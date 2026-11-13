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
import { AddRoutineModal } from '../../components/AddRoutineModal';
import { CopyRoutineModal } from '../../components/CopyRoutineModal';
import { Header3D } from '../../components/Header3D';
import { RoutineItemCard } from '../../components/RoutineItemCard';
import { DAY_NAMES, DayOfWeek, DAYS_OF_WEEK, RoutineItem } from '../../constants/types';
import { useAppTheme } from '../../hooks/useThemeContext';
import { routineService } from '../../services/storage/routineService';
import { getCurrentDayOfWeek } from '../../utils/dateUtils';

export default function RoutineScreen() {
  const { theme, isDark } = useAppTheme();
  const todayDay = getCurrentDayOfWeek();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(todayDay);
  const [allRoutines, setAllRoutines] = useState<Record<DayOfWeek, RoutineItem[]>>({
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
    Sun: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [copyModalVisible, setCopyModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<RoutineItem | null>(null);

  const loadRoutines = useCallback(async () => {
    try {
      const data = await routineService.getAllRoutines();
      setAllRoutines(data);
    } catch (err) {
      console.error('Failed to load routines:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadRoutines();
  }, [loadRoutines]);

  const onRefresh = () => {
    setRefreshing(true);
    loadRoutines();
  };

  const currentDayItems = allRoutines[selectedDay] || [];

  const handleSaveRoutine = async (data: {
    day: DayOfWeek;
    time: string;
    title: string;
    description?: string;
    category?: string;
  }) => {
    if (editingItem) {
      const updated = await routineService.updateRoutineItem(editingItem.day, editingItem.id, data);
      setAllRoutines(updated);
      setEditingItem(null);
    } else {
      const updated = await routineService.addRoutineItem(data.day, data);
      setAllRoutines(updated);
    }
  };

  const handleDeleteItem = (item: RoutineItem) => {
    Alert.alert(
      'Delete Habit',
      `Delete "${item.title}" from ${DAY_NAMES[item.day]}'s routine?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = await routineService.deleteRoutineItem(item.day, item.id);
            setAllRoutines(updated);
          },
        },
      ]
    );
  };

  const handleCopyConfirm = async (targetDays: DayOfWeek[]) => {
    const updated = await routineService.copyRoutineToDays(selectedDay, targetDays);
    setAllRoutines(updated);
    Alert.alert(
      'Routine Copied!',
      `Copied ${DAY_NAMES[selectedDay]}'s habits to ${targetDays.map((d) => DAY_NAMES[d]).join(', ')}.`
    );
  };

  const renderHeader = () => (
    <View style={styles.headerComponent}>
      {/* Day Selector Horizontal Strip */}
      <View style={styles.daySelectorContainer}>
        {DAYS_OF_WEEK.map((d) => {
          const isSelected = selectedDay === d;
          const isToday = todayDay === d;

          return (
            <TouchableOpacity
              key={d}
              onPress={() => setSelectedDay(d)}
              style={[
                styles.dayTab,
                {
                  backgroundColor: isSelected
                    ? theme.primary
                    : theme.surfaceSubtle,
                  borderColor: isSelected ? theme.primary : theme.borderSubtle,
                },
              ]}
            >
              {isToday && (
                <View
                  style={[
                    styles.todayBadge,
                    { backgroundColor: isSelected ? '#FFFFFF' : theme.secondary },
                  ]}
                />
              )}
              <Text
                style={[
                  styles.dayTabText,
                  {
                    color: isSelected ? '#FFFFFF' : theme.textSecondary,
                    fontWeight: isSelected ? '800' : '600',
                  },
                ]}
              >
                {d}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Routine Info & Action Header */}
      <View style={styles.routineHeaderRow}>
        <View>
          <View style={styles.dayTitleRow}>
            <Text style={[styles.dayTitle, { color: theme.text }]}>
              {DAY_NAMES[selectedDay]} Routine
            </Text>
            {selectedDay === todayDay && (
              <View style={[styles.todayPill, { backgroundColor: 'rgba(6, 182, 212, 0.15)' }]}>
                <Text style={styles.todayPillText}>Today</Text>
              </View>
            )}
          </View>
          <Text style={[styles.daySubtitle, { color: theme.textSecondary }]}>
            {currentDayItems.length} planned habit{currentDayItems.length === 1 ? '' : 's'}
          </Text>
        </View>

        {/* Buttons Row: Copy and Add */}
        <View style={styles.actionsGroup}>
          <TouchableOpacity
            onPress={() => setCopyModalVisible(true)}
            style={[
              styles.copyBtn,
              {
                backgroundColor: theme.surfaceSubtle,
                borderColor: theme.borderSubtle,
              },
            ]}
          >
            <Ionicons name="copy-outline" size={15} color={theme.textSecondary} />
            <Text style={[styles.copyBtnText, { color: theme.textSecondary }]}>
              Copy
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setEditingItem(null);
              setAddModalVisible(true);
            }}
            activeOpacity={0.8}
            style={styles.addBtn}
          >
            <LinearGradient
              colors={['#06B6D4', '#6366F1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addBtnGradient}
            >
              <Ionicons name="add" size={17} color="#FFFFFF" />
              <Text style={styles.addBtnText}>Add</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header3D title="Routine" subtitle="Day-Wise Habits & Rituals" />

      <FlatList
        data={currentDayItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RoutineItemCard
            item={item}
            onEdit={() => {
              setEditingItem(item);
              setAddModalVisible(true);
            }}
            onDelete={() => handleDeleteItem(item)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="repeat-outline" size={48} color={theme.textMuted} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                No habits set for {DAY_NAMES[selectedDay]}
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                Add a new habit or copy over from another day.
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
      <AddRoutineModal
        visible={addModalVisible}
        onClose={() => {
          setAddModalVisible(false);
          setEditingItem(null);
        }}
        onSave={handleSaveRoutine}
        defaultDay={selectedDay}
        initialItem={editingItem}
      />

      {/* Copy Modal */}
      <CopyRoutineModal
        visible={copyModalVisible}
        onClose={() => setCopyModalVisible(false)}
        onConfirm={handleCopyConfirm}
        sourceDay={selectedDay}
        itemCount={currentDayItems.length}
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
    paddingTop: 10,
    marginBottom: 8,
  },
  daySelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 16,
  },
  dayTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    position: 'relative',
  },
  todayBadge: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    position: 'absolute',
    top: 5,
  },
  dayTabText: {
    fontSize: 13,
  },
  routineHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  todayPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  todayPillText: {
    color: '#06B6D4',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  daySubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },
  copyBtnText: {
    fontSize: 12,
    fontWeight: '700',
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
