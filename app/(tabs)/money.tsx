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
import { AddExpenseModal } from '../../components/AddExpenseModal';
import { CategoryChart } from '../../components/CategoryChart';
import { ExpenseItemCard } from '../../components/ExpenseItemCard';
import { Header3D } from '../../components/Header3D';
import { PressableCard3D } from '../../components/PressableCard3D';
import { Expense, ExpenseCategory } from '../../constants/types';
import { useAppTheme } from '../../hooks/useThemeContext';
import { expenseService, ExpenseSummary } from '../../services/storage/expenseService';

export default function MoneyScreen() {
  const { theme, isDark } = useAppTheme();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary>({
    todayTotal: 0,
    weekTotal: 0,
    monthTotal: 0,
    categoryTotals: {
      Food: 0,
      Travel: 0,
      Study: 0,
      Shopping: 0,
      Other: 0,
    },
    totalAll: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const loadExpenses = useCallback(async () => {
    try {
      const data = await expenseService.getExpenses();
      setExpenses(data);
      setSummary(expenseService.getSummary(data));
    } catch (err) {
      console.error('Failed to load expenses:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const onRefresh = () => {
    setRefreshing(true);
    loadExpenses();
  };

  const handleSaveExpense = async (data: {
    amount: number;
    category: ExpenseCategory;
    note?: string;
    date: string;
  }) => {
    if (editingExpense) {
      const updated = await expenseService.updateExpense(editingExpense.id, data);
      setExpenses(updated);
      setSummary(expenseService.getSummary(updated));
      setEditingExpense(null);
    } else {
      const updated = await expenseService.addExpense(data);
      setExpenses(updated);
      setSummary(expenseService.getSummary(updated));
    }
  };

  const handleDeleteExpense = (item: Expense) => {
    Alert.alert(
      'Delete Expense',
      `Delete expense of ₹${item.amount} (${item.category})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = await expenseService.deleteExpense(item.id);
            setExpenses(updated);
            setSummary(expenseService.getSummary(updated));
          },
        },
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.headerComponent}>
      {/* 3 Summary Cards Row (Today, This Week, This Month) */}
      <View style={styles.summaryCardsRow}>
        {/* Today's Card */}
        <View style={styles.summaryCardWrapper}>
          <PressableCard3D variant="surface">
            <LinearGradient
              colors={
                isDark
                  ? ['#1E1B4B', '#111827']
                  : ['#EEF2FF', '#FFFFFF']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.summaryCardContent}
            >
              <View style={styles.summaryIconPill}>
                <Ionicons name="today" size={14} color="#818CF8" />
              </View>
              <Text style={[styles.summaryCardLabel, { color: theme.textSecondary }]}>
                Today
              </Text>
              <Text style={[styles.summaryCardAmount, { color: theme.text }]}>
                ₹{summary.todayTotal.toLocaleString('en-IN')}
              </Text>
            </LinearGradient>
          </PressableCard3D>
        </View>

        {/* This Week's Card */}
        <View style={styles.summaryCardWrapper}>
          <PressableCard3D variant="surface">
            <LinearGradient
              colors={
                isDark
                  ? ['#0E3345', '#111827']
                  : ['#E0F2FE', '#FFFFFF']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.summaryCardContent}
            >
              <View style={styles.summaryIconPill}>
                <Ionicons name="calendar" size={14} color="#06B6D4" />
              </View>
              <Text style={[styles.summaryCardLabel, { color: theme.textSecondary }]}>
                This Week
              </Text>
              <Text style={[styles.summaryCardAmount, { color: theme.text }]}>
                ₹{summary.weekTotal.toLocaleString('en-IN')}
              </Text>
            </LinearGradient>
          </PressableCard3D>
        </View>

        {/* This Month's Card */}
        <View style={styles.summaryCardWrapper}>
          <PressableCard3D variant="surface">
            <LinearGradient
              colors={
                isDark
                  ? ['#3B1832', '#111827']
                  : ['#FCE7F3', '#FFFFFF']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.summaryCardContent}
            >
              <View style={styles.summaryIconPill}>
                <Ionicons name="stats-chart" size={14} color="#EC4899" />
              </View>
              <Text style={[styles.summaryCardLabel, { color: theme.textSecondary }]}>
                This Month
              </Text>
              <Text style={[styles.summaryCardAmount, { color: theme.text }]}>
                ₹{summary.monthTotal.toLocaleString('en-IN')}
              </Text>
            </LinearGradient>
          </PressableCard3D>
        </View>
      </View>

      {/* Chart Section Card */}
      <PressableCard3D variant="surface" style={styles.chartCard}>
        <View style={styles.chartCardInner}>
          <View style={styles.chartTitleRow}>
            <Text style={[styles.chartCardTitle, { color: theme.text }]}>
              Spending by Category
            </Text>
            <View style={[styles.badgePill, { backgroundColor: theme.surfaceSubtle }]}>
              <Text style={[styles.badgeText, { color: theme.textSecondary }]}>
                All-time Breakdown
              </Text>
            </View>
          </View>

          <CategoryChart
            categoryTotals={summary.categoryTotals}
            total={summary.totalAll}
            size={180}
          />
        </View>
      </PressableCard3D>

      {/* Recent Transactions Section Header */}
      <View style={styles.transactionsHeaderRow}>
        <View>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Recent Expenses
          </Text>
          <Text style={[styles.sectionSub, { color: theme.textSecondary }]}>
            {expenses.length} transaction{expenses.length === 1 ? '' : 's'} recorded
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            setEditingExpense(null);
            setModalVisible(true);
          }}
          activeOpacity={0.8}
          style={styles.addBtn}
        >
          <LinearGradient
            colors={['#F59E0B', '#EF4444']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addBtnGradient}
          >
            <Ionicons name="add" size={17} color="#FFFFFF" />
            <Text style={styles.addBtnText}>Add Expense</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header3D title="Money Flow" subtitle="Personal Expense Tracker" />

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExpenseItemCard
            expense={item}
            onEdit={() => {
              setEditingExpense(item);
              setModalVisible(true);
            }}
            onDelete={() => handleDeleteExpense(item)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="wallet-outline" size={48} color={theme.textMuted} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                No expenses logged yet
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                Tap "Add Expense" to start tracking your daily spending.
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

      {/* Add / Edit Expense Modal */}
      <AddExpenseModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingExpense(null);
        }}
        onSave={handleSaveExpense}
        initialExpense={editingExpense}
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
  summaryCardsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  summaryCardWrapper: {
    flex: 1,
  },
  summaryCardContent: {
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  summaryIconPill: {
    marginBottom: 4,
  },
  summaryCardLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  summaryCardAmount: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
    letterSpacing: -0.4,
  },
  chartCard: {
    marginVertical: 10,
  },
  chartCardInner: {
    padding: 16,
  },
  chartTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chartCardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  transactionsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
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
