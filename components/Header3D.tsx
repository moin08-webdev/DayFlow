import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../hooks/useThemeContext';
import { getFormattedTodayHeader } from '../utils/dateUtils';

interface Header3DProps {
  title?: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
  showThemeToggle?: boolean;
}

export function Header3D({
  title = 'DayFlow',
  subtitle,
  rightAction,
  showThemeToggle = true,
}: Header3DProps) {
  const { theme, isDark, toggleTheme } = useAppTheme();
  const insets = useSafeAreaInsets();

  // 3D floating animation values
  const floatAnim = useSharedValue(0);
  const rotateAnim = useSharedValue(0);
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 2500, easing: Easing.inOut(Easing.quad) }),
        withTiming(5, { duration: 2500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    rotateAnim.value = withRepeat(
      withSequence(
        withTiming(6, { duration: 3200, easing: Easing.inOut(Easing.quad) }),
        withTiming(-6, { duration: 3200, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
        withTiming(1.0, { duration: 2000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, []);

  const shape1Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: floatAnim.value },
      { rotate: `${rotateAnim.value}deg` },
      { scale: pulseAnim.value },
    ],
  }));

  const shape2Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: -floatAnim.value * 0.7 },
      { rotate: `${-rotateAnim.value * 1.2}deg` },
    ],
  }));

  const displaySubtitle = subtitle ?? getFormattedTodayHeader();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, 14),
          backgroundColor: theme.background,
          borderBottomColor: theme.borderSubtle,
        },
      ]}
    >
      <View style={styles.contentRow}>
        {/* Left: 3D Animated Layered Shapes Avatar / Emblem */}
        <View style={styles.brandContainer}>
          <View style={styles.shape3DWrapper}>
            {/* Ambient Background Glow */}
            <View
              style={[
                styles.ambientGlow,
                { backgroundColor: theme.primary, opacity: isDark ? 0.35 : 0.2 },
              ]}
            />

            {/* Back Layer Shape */}
            <Animated.View style={[styles.backShape, shape2Style]}>
              <LinearGradient
                colors={['#06B6D4', '#6366F1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.shapeGradient}
              />
            </Animated.View>

            {/* Front 3D Card Layer */}
            <Animated.View style={[styles.frontShape, shape1Style]}>
              <LinearGradient
                colors={['#8B5CF6', '#4F46E5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.shapeGradient}
              >
                <Ionicons name="sparkles" size={17} color="#FFFFFF" />
              </LinearGradient>
            </Animated.View>
          </View>

          {/* Title & Subtitle */}
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              {displaySubtitle}
            </Text>
          </View>
        </View>

        {/* Right Actions: Custom action or Theme switch */}
        <View style={styles.actionsRow}>
          {rightAction}

          {showThemeToggle && (
            <TouchableOpacity
              onPress={toggleTheme}
              activeOpacity={0.7}
              style={[
                styles.themeBtn,
                {
                  backgroundColor: theme.surfaceSubtle,
                  borderColor: theme.border,
                },
              ]}
            >
              <Ionicons
                name={isDark ? 'sunny' : 'moon'}
                size={18}
                color={isDark ? '#FBBF24' : '#6366F1'}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shape3DWrapper: {
    width: 44,
    height: 44,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ambientGlow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  backShape: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 10,
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  frontShape: {
    width: 34,
    height: 34,
    borderRadius: 11,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  shapeGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
