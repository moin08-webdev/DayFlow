import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Expense, ExpenseCategory } from '../constants/types';
import { useAppTheme } from '../hooks/useThemeContext';
import { formatFriendlyDate } from '../utils/dateUtils';
import { PressableCard3D } from './PressableCard3D';

interface ExpenseItemCardProps {
  expense: Expense;
  onEdit: () => void;
  onDelete: () => void;
}

const CATEGORY_ICONS: Record<ExpenseCategory, keyof typeof Ionicons.glyphMap> = {
  Food: 'restaurant-outline',
  Travel: 'car-outline',
  Study: 'book-outline',
  Shopping: 'bag-handle-outline',
  Other: 'receipt-outline',
};

const CATEGORY_COLORS: Record<ExpenseCategory, { bg: string; color: string }> = {
  Food: { bg: 'rgba(249, 115, 22, 0.15)', color: '#FB923C' },
  Travel: { bg: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4' },
  Study: { bg: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6' },
  Shopping: { bg: 'rgba(236, 72, 153, 0.15)', color: '#EC4899' },
  Other: { bg: 'rgba(100, 116, 139, 0.15)', color: '#94A3B8' },
};

export function ExpenseItemCard({ expense, onEdit, onDelete }: ExpenseItemCardProps) {
  const { theme } = useAppTheme();
  const iconName = CATEGORY_ICONS[expense.category] || 'receipt-outline';
  const catStyle = CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other;

  return (
    <PressableCard3D variant="surface">
      <View style={styles.content}>
        {/* Category Icon Badge */}
        <View style={[styles.iconCircle, { backgroundColor: catStyle.bg }]}>
          <Ionicons name={iconName} size={20} color={catStyle.color} />
        </View>

        {/* Center: Category, Note, Date */}
        <View style={styles.centerInfo}>
          <View style={styles.categoryRow}>
            <Text style={[styles.categoryName, { color: theme.text }]}>
              {expense.category}
            </Text>
            <Text style={[styles.dateText, { color: theme.textMuted }]}>
              • {formatFriendlyDate(expense.date)}
            </Text>
          </View>
          {expense.note ? (
            <Text
              style={[styles.noteText, { color: theme.textSecondary }]}
              numberOfLines={1}
            >
              {expense.note}
            </Text>
          ) : null}
        </View>

        {/* Amount in ₹ */}
        <View style={styles.amountContainer}>
          <Text style={[styles.amountText, { color: theme.text }]}>
            -₹{expense.amount.toLocaleString('en-IN')}
          </Text>
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
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  centerInfo: {
    flex: 1,
    paddingRight: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
  },
  noteText: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
    marginRight: 10,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    padding: 2,
  },
});
