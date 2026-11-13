import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useAppTheme } from '../hooks/useThemeContext';

interface ProgressRingProps {
  total: number;
  completed: number;
  size?: number;
  strokeWidth?: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function ProgressRing({
  total,
  completed,
  size = 170,
  strokeWidth = 14,
}: ProgressRingProps) {
  const { theme } = useAppTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = total > 0 ? Math.min(Math.max(completed / total, 0), 1) : 0;
  const percentage = Math.round(progress * 100);

  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference - animatedProgress.value * circumference;
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* 3D ambient glow background blur circle */}
      <View
        style={[
          styles.glowCircle,
          {
            width: size * 0.8,
            height: size * 0.8,
            borderRadius: (size * 0.8) / 2,
            backgroundColor: theme.primary,
            opacity: theme.isDark ? 0.15 : 0.08,
          },
        ]}
      />

      <Svg width={size} height={size} style={styles.svg}>
        <Defs>
          <LinearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#818CF8" />
            <Stop offset="50%" stopColor="#6366F1" />
            <Stop offset="100%" stopColor="#10B981" />
          </LinearGradient>
        </Defs>

        {/* Background track circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress fill circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ringGrad)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          fill="transparent"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      {/* Center content */}
      <View style={styles.centerTextContainer}>
        <View style={styles.countRow}>
          <Text style={[styles.completedText, { color: theme.text }]}>
            {completed}
          </Text>
          <Text style={[styles.totalText, { color: theme.textMuted }]}>
            /{total}
          </Text>
        </View>
        <Text style={[styles.subText, { color: theme.textSecondary }]}>
          steps done
        </Text>
        <View
          style={[
            styles.percentBadge,
            {
              backgroundColor:
                percentage === 100
                  ? 'rgba(16, 185, 129, 0.15)'
                  : theme.isDark
                  ? 'rgba(99, 102, 241, 0.18)'
                  : 'rgba(99, 102, 241, 0.1)',
            },
          ]}
        >
          <Text
            style={[
              styles.percentText,
              { color: percentage === 100 ? '#10B981' : theme.primary },
            ]}
          >
            {percentage}%
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    alignSelf: 'center',
  },
  glowCircle: {
    position: 'absolute',
  },
  svg: {
    position: 'absolute',
  },
  centerTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  completedText: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  totalText: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 2,
  },
  subText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: -2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  percentBadge: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  percentText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
