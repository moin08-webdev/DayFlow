import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../hooks/useThemeContext';

interface CheckmarkPopProps {
  checked: boolean;
  onToggle: () => void;
  size?: number;
  gradientColors?: [string, string];
}

export function CheckmarkPop({
  checked,
  onToggle,
  size = 28,
  gradientColors = ['#10B981', '#059669'],
}: CheckmarkPopProps) {
  const { theme } = useAppTheme();
  const scale = useSharedValue(1);
  const iconScale = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    if (checked) {
      scale.value = withSequence(
        withSpring(1.28, { damping: 10, stiffness: 350 }),
        withSpring(1.0, { damping: 12, stiffness: 250 })
      );
      iconScale.value = withSpring(1, { damping: 12, stiffness: 300 });
    } else {
      scale.value = withSequence(
        withTiming(0.85, { duration: 100 }),
        withSpring(1.0, { damping: 14, stiffness: 250 })
      );
      iconScale.value = withTiming(0, { duration: 120 });
    }
  }, [checked]);

  const handlePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics fallback on web or unsupported devices
    }
    onToggle();
  };

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
    opacity: iconScale.value,
  }));

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      style={styles.touchArea}
    >
      <Animated.View
        style={[
          styles.container,
          animatedContainerStyle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: checked ? 'transparent' : theme.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.18)',
            backgroundColor: checked ? 'transparent' : theme.surfaceSubtle,
          },
        ]}
      >
        {checked ? (
          <LinearGradient
            colors={gradientColors}
            style={[styles.gradient, { width: size, height: size, borderRadius: size / 2 }]}
          >
            <Animated.View style={animatedIconStyle}>
              <Ionicons name="checkmark" size={size * 0.64} color="#FFFFFF" />
            </Animated.View>
          </LinearGradient>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touchArea: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  gradient: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
