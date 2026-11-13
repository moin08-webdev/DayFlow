import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useAppTheme } from '../hooks/useThemeContext';

interface PressableCard3DProps {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: ViewStyle;
  variant?: 'surface' | 'elevated' | 'subtle';
  tiltDegree?: number;
}

export function PressableCard3D({
  children,
  onPress,
  onLongPress,
  style,
  variant = 'surface',
}: PressableCard3DProps) {
  const { theme } = useAppTheme();
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const handlePressIn = () => {
    scale.value = withSpring(0.975, { damping: 14, stiffness: 260 });
    translateY.value = withSpring(2, { damping: 14, stiffness: 260 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 14, stiffness: 260 });
    translateY.value = withSpring(0, { damping: 14, stiffness: 260 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
      ],
    };
  });

  const getBackgroundColor = () => {
    switch (variant) {
      case 'elevated':
        return theme.surfaceElevated;
      case 'subtle':
        return theme.surfaceSubtle;
      case 'surface':
      default:
        return theme.surface;
    }
  };

  return (
    <Animated.View style={[animatedStyle, styles.outerWrapper, style]}>
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        android_ripple={{ color: 'rgba(99, 102, 241, 0.08)', borderless: false }}
        style={[
          styles.card,
          {
            backgroundColor: getBackgroundColor(),
            borderColor: theme.border,
            shadowColor: theme.shadowColor,
          },
        ]}
      >
        {/* Subtle top edge 3D light reflection highlight */}
        <Animated.View
          style={[
            styles.topLightBorder,
            { backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(255, 255, 255, 0.9)' },
          ]}
        />
        {children}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    marginVertical: 6,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    // 3D elevation shadow
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  topLightBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
  },
});
