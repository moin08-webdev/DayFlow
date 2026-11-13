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
import { AddTaskModal } from '../../components/AddTaskModal';
import { Header3D } from '../../components/Header3D';
import { TaskItem } from '../../components/TaskItem';
import { Priority, Task } from '../../constants/types';
import { useAppTheme } from '../../hooks/useThemeContext';
import { taskService } from '../../services/storage/taskService';

export default function TasksScreen() {
  const { theme, isDark } = useAppTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | Priority>('all');
  const [showDoneList, setShowDoneList] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTasks();
  };

  const handleToggleTask = async (id: string) => {
    const updated = await taskService.toggleTask(id);
    setTasks(updated);
  };

  const handleSaveTask = async (taskData: {
    title: string;
    description?: string;
    priority: Priority;
    dueDate?: string;
    category?: string;
  }) => {
    if (editingTask) {
      const updated = await taskService.updateTask(editingTask.id, taskData);
      setTasks(updated);
      setEditingTask(null);
    } else {
      const updated = await taskService.addTask(taskData);
      setTasks(updated);
    }
  };

  const handleDeleteTask = (task: Task) => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = await taskService.deleteTask(task.id);
            setTasks(updated);
          },
        },
      ]
    );
  };

  const handleClearCompleted = () => {
    Alert.alert(
      'Clear Completed Tasks',
      'Remove all completed tasks permanently?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            const updated = await taskService.clearCompleted();
            setTasks(updated);
          },
        },
      ]
    );
  };

  // Filter tasks
  const activeTasks = tasks.filter((t) => {
    if (t.completed) return false;
    if (selectedFilter !== 'all' && t.priority !== selectedFilter) return false;
    return true;
  });

  const completedTasks = tasks.filter((t) => {
    if (!t.completed) return false;
    if (selectedFilter !== 'all' && t.priority !== selectedFilter) return false;
    return true;
  });

  const renderHeader = () => (
    <View style={styles.headerComponent}>
      {/* Priority Filter Bar */}
      <View style={styles.filterScroll}>
        {(['all', 'high', 'medium', 'low'] as const).map((filter) => {
          const isSelected = selectedFilter === filter;
          const colors = {
            all: theme.primary,
            high: '#F43F5E',
            medium: '#F59E0B',
            low: '#10B981',
          };
          const count =
            filter === 'all'
              ? tasks.filter((t) => !t.completed).length
              : tasks.filter((t) => !t.completed && t.priority === filter).length;

          return (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              style={[
                styles.filterPill,
                {
                  backgroundColor: isSelected
                    ? colors[filter]
                    : theme.surfaceSubtle,
                  borderColor: isSelected ? colors[filter] : theme.borderSubtle,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                ]}
              >
                {filter === 'all' ? 'All Tasks' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
              <View
                style={[
                  styles.countBadge,
                  {
                    backgroundColor: isSelected
                      ? 'rgba(255, 255, 255, 0.25)'
                      : theme.isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.06)',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.countText,
                    { color: isSelected ? '#FFFFFF' : theme.textMuted },
                  ]}
                >
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Action Bar */}
      <View style={styles.actionBar}>
        <View>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Active To-Dos
          </Text>
          <Text style={[styles.sectionSub, { color: theme.textSecondary }]}>
            {activeTasks.length} pending task{activeTasks.length === 1 ? '' : 's'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            setEditingTask(null);
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
            <Text style={styles.addBtnText}>New Task</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (completedTasks.length === 0) return null;

    return (
      <View style={styles.doneSection}>
        {/* Done Section Header */}
        <TouchableOpacity
          onPress={() => setShowDoneList(!showDoneList)}
          style={[styles.doneHeader, { borderTopColor: theme.borderSubtle }]}
          activeOpacity={0.7}
        >
          <View style={styles.doneHeaderLeft}>
            <Ionicons
              name={showDoneList ? 'chevron-down' : 'chevron-forward'}
              size={18}
              color={theme.textMuted}
            />
            <Text style={[styles.doneTitle, { color: theme.textSecondary }]}>
              Completed ({completedTasks.length})
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleClearCompleted}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.clearText, { color: '#F43F5E' }]}>
              Clear
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Done Items */}
        {showDoneList && (
          <View style={styles.doneList}>
            {completedTasks.map((t) => (
              <TaskItem
                key={t.id}
                task={t}
                onToggle={() => handleToggleTask(t.id)}
                onEdit={() => {
                  setEditingTask(t);
                  setModalVisible(true);
                }}
                onDelete={() => handleDeleteTask(t)}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header3D title="Tasks" subtitle="Daily & Project Priorities" />

      <FlatList
        data={activeTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={() => handleToggleTask(item.id)}
            onEdit={() => {
              setEditingTask(item);
              setModalVisible(true);
            }}
            onDelete={() => handleDeleteTask(item)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !loading && activeTasks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="checkmark-done-circle-outline"
                size={52}
                color={theme.primary}
              />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                All clear! No pending tasks
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                Add a new task or review completed ones below.
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

      <AddTaskModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        initialTask={editingTask}
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
  filterScroll: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
  },
  countBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  sectionSub: {
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
  doneSection: {
    marginTop: 20,
  },
  doneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  doneHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  doneTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clearText: {
    fontSize: 12,
    fontWeight: '700',
  },
  doneList: {
    marginTop: 4,
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
