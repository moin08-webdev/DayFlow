import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Expense, EXPENSE_CATEGORIES, ExpenseCategory } from '../constants/types';
import { useAppTheme } from '../hooks/useThemeContext';
import { getTodayDateString } from '../utils/dateUtils';

interface AddExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (expenseData: {
    amount: number;
    category: ExpenseCategory;
    note?: string;
    date: string;
  }) => void;
  initialExpense?: Expense | null;
}

const CATEGORY_ICONS: Record<ExpenseCategory, keyof typeof Ionicons.glyphMap> = {
  Food: 'restaurant-outline',
  Travel: 'car-outline',
  Study: 'book-outline',
  Shopping: 'bag-handle-outline',
  Other: 'receipt-outline',
};

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Food: '#FB923C',
  Travel: '#06B6D4',
  Study: '#8B5CF6',
  Shopping: '#EC4899',
  Other: '#94A3B8',
};

export function AddExpenseModal({
  visible,
  onClose,
  onSave,
  initialExpense,
}: AddExpenseModalProps) {
  const { theme } = useAppTheme();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(getTodayDateString());

  useEffect(() => {
    if (initialExpense) {
      setAmount(initialExpense.amount.toString());
      setCategory(initialExpense.category);
      setNote(initialExpense.note || '');
      setDate(initialExpense.date);
    } else {
      setAmount('');
      setCategory('Food');
      setNote('');
      setDate(getTodayDateString());
    }
  }, [initialExpense, visible]);

  const handleSave = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;

    onSave({
      amount: num,
      category,
      note: note.trim() || undefined,
      date: date.trim() || getTodayDateString(),
    });
    onClose();
  };

  const handleQuickAmount = (val: number) => {
    setAmount(val.toString());
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
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
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              {initialExpense ? 'Edit Expense' : 'Log New Expense'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            {/* Amount Input with ₹ symbol */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>Amount</Text>
            <View
              style={[
                styles.amountRow,
                {
                  backgroundColor: theme.surfaceSubtle,
                  borderColor: theme.borderSubtle,
                },
              ]}
            >
              <Text style={[styles.currencySymbol, { color: theme.primary }]}>₹</Text>
              <TextInput
                style={[styles.amountInput, { color: theme.text }]}
                placeholder="0.00"
                placeholderTextColor={theme.textMuted}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                autoFocus={!initialExpense}
              />
            </View>

            {/* Quick Amount Chips */}
            <View style={styles.quickChipsRow}>
              {[50, 100, 250, 500, 1000].map((val) => (
                <TouchableOpacity
                  key={val}
                  onPress={() => handleQuickAmount(val)}
                  style={[styles.quickChip, { backgroundColor: theme.surfaceSubtle }]}
                >
                  <Text style={[styles.quickChipText, { color: theme.textSecondary }]}>
                    +₹{val}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Category Selector */}
            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 16 }]}>
              Category
            </Text>
            <View style={styles.categoryGrid}>
              {EXPENSE_CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                const icon = CATEGORY_ICONS[cat];
                const color = CATEGORY_COLORS[cat];

                return (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setCategory(cat)}
                    style={[
                      styles.categoryCard,
                      {
                        backgroundColor: isSelected
                          ? theme.isDark
                            ? 'rgba(99, 102, 241, 0.2)'
                            : 'rgba(99, 102, 241, 0.1)'
                          : theme.surfaceSubtle,
                        borderColor: isSelected ? theme.primary : theme.borderSubtle,
                      },
                    ]}
                  >
                    <Ionicons
                      name={icon}
                      size={20}
                      color={isSelected ? theme.primary : color}
                    />
                    <Text
                      style={[
                        styles.catLabel,
                        {
                          color: isSelected ? theme.primary : theme.textSecondary,
                          fontWeight: isSelected ? '700' : '600',
                        },
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Date */}
            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 16 }]}>
              Date
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.surfaceSubtle,
                  borderColor: theme.borderSubtle,
                  color: theme.text,
                },
              ]}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.textMuted}
              value={date}
              onChangeText={setDate}
            />

            {/* Note / Description */}
            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 14 }]}>
              Note / Description (Optional)
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor: theme.surfaceSubtle,
                  borderColor: theme.borderSubtle,
                  color: theme.text,
                },
              ]}
              placeholder="e.g. Starbucks cold brew, Uber ride to office"
              placeholderTextColor={theme.textMuted}
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={2}
            />

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSave}
              disabled={!amount || parseFloat(amount) <= 0}
              style={[
                styles.saveButton,
                (!amount || parseFloat(amount) <= 0) && { opacity: 0.5 },
              ]}
            >
              <LinearGradient
                colors={['#F59E0B', '#EF4444']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBtn}
              >
                <Text style={styles.saveBtnText}>
                  {initialExpense ? 'Update Expense' : 'Record Expense'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
    maxHeight: '88%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 6,
  },
  scroll: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  currencySymbol: {
    fontSize: 26,
    fontWeight: '800',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 26,
    fontWeight: '800',
  },
  quickChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  quickChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  quickChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryCard: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  catLabel: {
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: 22,
    borderRadius: 14,
    overflow: 'hidden',
  },
  gradientBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
