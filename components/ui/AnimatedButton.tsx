import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  icon
}) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
  
  const getButtonColors = () => {
    switch (variant) {
      case 'primary':
        return {
          background: theme.COLORS.primary.default,
          text: 'white',
          border: theme.COLORS.primary.default
        };
      case 'secondary':
        return {
          background: theme.COLORS.secondary.default,
          text: 'white',
          border: theme.COLORS.secondary.default
        };
      case 'outline':
        return {
          background: 'transparent',
          text: theme.COLORS.primary.default,
          border: theme.COLORS.primary.default
        };
      case 'danger':
        return {
          background: theme.COLORS.error,
          text: 'white',
          border: theme.COLORS.error
        };
      default:
        return {
          background: theme.COLORS.primary.default,
          text: 'white',
          border: theme.COLORS.primary.default
        };
    }
  };
  
  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 6,
          paddingHorizontal: 12,
          fontSize: 12
        };
      case 'large':
        return {
          paddingVertical: 14,
          paddingHorizontal: 24,
          fontSize: 16
        };
      case 'medium':
      default:
        return {
          paddingVertical: 10,
          paddingHorizontal: 16,
          fontSize: 14
        };
    }
  };
  
  const buttonColors = getButtonColors();
  const buttonSize = getButtonSize();
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });
  
  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <AnimatedTouchable
      onPress={disabled ? undefined : onPress}
      onPressIn={disabled ? undefined : handlePressIn}
      onPressOut={disabled ? undefined : handlePressOut}
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          backgroundColor: disabled ? theme.COLORS.text.disabled : buttonColors.background,
          borderColor: disabled ? theme.COLORS.text.disabled : buttonColors.border,
          paddingVertical: buttonSize.paddingVertical,
          paddingHorizontal: buttonSize.paddingHorizontal,
        },
        variant === 'outline' && styles.outlineButton,
        animatedStyle,
        style
      ]}
      disabled={disabled}
    >
      {icon}
      <Text
        style={[
          styles.buttonText,
          {
            color: disabled ? '#FFFFFF' : buttonColors.text,
            fontSize: buttonSize.fontSize,
          },
          textStyle
        ]}
      >
        {title}
      </Text>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
  },
  outlineButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  }
}); 