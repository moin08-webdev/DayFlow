import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { CategoryColors } from '../constants/theme';
import { ExpenseCategory } from '../constants/types';
import { useAppTheme } from '../hooks/useThemeContext';

interface CategoryChartProps {
  categoryTotals: Record<ExpenseCategory, number>;
  total: number;
  size?: number;
}

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Food: '#FB923C',     // Orange
  Travel: '#06B6D4',   // Cyan
  Study: '#8B5CF6',    // Purple
  Shopping: '#EC4899', // Pink
  Other: '#94A3B8',    // Slate
};

export function CategoryChart({
  categoryTotals,
  total,
  size = 190,
}: CategoryChartProps) {
  const { theme } = useAppTheme();
  const center = size / 2;
  const radius = size * 0.44;
  const innerRadius = size * 0.29;

  // Filter categories with spending > 0
  const categories = Object.keys(categoryTotals) as ExpenseCategory[];
  const activeCategories = categories
    .map((cat) => ({
      category: cat,
      amount: categoryTotals[cat] || 0,
      color: CATEGORY_COLORS[cat] || '#818CF8',
      percentage: total > 0 ? ((categoryTotals[cat] || 0) / total) * 100 : 0,
    }))
    .filter((c) => c.amount > 0);

  // Generate SVG arcs
  let currentAngle = -Math.PI / 2; // start from top (12 o'clock)
  const paths: { path: string; color: string; category: string }[] = [];

  activeCategories.forEach((cat) => {
    const sliceAngle = (cat.amount / total) * (2 * Math.PI);
    const endAngle = currentAngle + sliceAngle;

    // Small gap between slices if multiple categories
    const gap = activeCategories.length > 1 ? 0.04 : 0;
    const a1 = currentAngle + gap / 2;
    const a2 = endAngle - gap / 2;

    const x1 = center + radius * Math.cos(a1);
    const y1 = center + radius * Math.sin(a1);
    const x2 = center + radius * Math.cos(a2);
    const y2 = center + radius * Math.sin(a2);

    const x3 = center + innerRadius * Math.cos(a2);
    const y3 = center + innerRadius * Math.sin(a2);
    const x4 = center + innerRadius * Math.cos(a1);
    const y4 = center + innerRadius * Math.sin(a1);

    const largeArc = sliceAngle > Math.PI ? 1 : 0;

    const d = `
      M ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
      Z
    `;

    paths.push({ path: d, color: cat.color, category: cat.category });
    currentAngle = endAngle;
  });

  return (
    <View style={styles.container}>
      <View style={[styles.chartWrapper, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          {total === 0 ? (
            // Placeholder empty ring
            <Circle
              cx={center}
              cy={center}
              r={(radius + innerRadius) / 2}
              stroke={theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}
              strokeWidth={radius - innerRadius}
              fill="transparent"
            />
          ) : (
            <G>
              {paths.map((p, idx) => (
                <Path
                  key={idx}
                  d={p.path}
                  fill={p.color}
                  stroke={theme.isDark ? '#131B2E' : '#FFFFFF'}
                  strokeWidth={2}
                />
              ))}
            </G>
          )}
        </Svg>

        {/* Center Total Display */}
        <View style={styles.centerLabel}>
          <Text style={[styles.totalAmount, { color: theme.text }]}>
            ₹{total.toLocaleString('en-IN')}
          </Text>
          <Text style={[styles.totalSub, { color: theme.textSecondary }]}>
            Total Spent
          </Text>
        </View>
      </View>

      {/* Category Legends */}
      <View style={styles.legendContainer}>
        {categories.map((cat) => {
          const amt = categoryTotals[cat] || 0;
          const pct = total > 0 ? Math.round((amt / total) * 100) : 0;
          const color = CATEGORY_COLORS[cat];

          return (
            <View
              key={cat}
              style={[
                styles.legendItem,
                {
                  backgroundColor: theme.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                  borderColor: theme.borderSubtle,
                },
              ]}
            >
              <View style={styles.legendLeft}>
                <View style={[styles.legendDot, { backgroundColor: color }]} />
                <Text style={[styles.legendName, { color: theme.text }]}>{cat}</Text>
              </View>
              <View style={styles.legendRight}>
                <Text style={[styles.legendAmount, { color: theme.text }]}>
                  ₹{amt.toLocaleString('en-IN')}
                </Text>
                <Text style={[styles.legendPercent, { color: theme.textMuted }]}>
                  {pct}%
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  chartWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  centerLabel: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  totalSub: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  legendContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 18,
    justifyContent: 'space-between',
  },
  legendItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendName: {
    fontSize: 13,
    fontWeight: '600',
  },
  legendRight: {
    alignItems: 'flex-end',
  },
  legendAmount: {
    fontSize: 13,
    fontWeight: '700',
  },
  legendPercent: {
    fontSize: 10,
    fontWeight: '500',
  },
});
