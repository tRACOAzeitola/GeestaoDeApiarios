import React, { useEffect } from 'react';
import { StyleSheet, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolateColor
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';

interface AnimatedTextProps {
  text: string;
  style?: TextStyle;
  animationType?: 'fade' | 'slide' | 'highlight' | 'typing';
  delay?: number;
  duration?: number;
  highlightColor?: string;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  style,
  animationType = 'fade',
  delay = 0,
  duration = 500,
  highlightColor
}) => {
  const { theme } = useTheme();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const textHighlight = useSharedValue(0);
  const typingProgress = useSharedValue(0);
  
  useEffect(() => {
    setTimeout(() => {
      opacity.value = withTiming(1, { duration, easing: Easing.out(Easing.ease) });
      translateY.value = withTiming(0, { duration, easing: Easing.out(Easing.ease) });
      
      if (animationType === 'highlight') {
        textHighlight.value = withSequence(
          withTiming(1, { duration: duration / 2 }),
          withDelay(
            duration / 2,
            withTiming(0, { duration: duration / 2 })
          )
        );
      }
      
      if (animationType === 'typing') {
        typingProgress.value = withTiming(1, { 
          duration: text.length * 50, 
          easing: Easing.linear 
        });
      }
    }, delay);
  }, [text]);
  
  const getFadeStyle = () => {
    return useAnimatedStyle(() => ({
      opacity: opacity.value
    }));
  };
  
  const getSlideStyle = () => {
    return useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }]
    }));
  };
  
  const getHighlightStyle = () => {
    const highlightBgColor = highlightColor || theme.COLORS.primary.light;
    
    return useAnimatedStyle(() => ({
      opacity: opacity.value,
      backgroundColor: interpolateColor(
        textHighlight.value,
        [0, 1],
        ['transparent', highlightBgColor]
      )
    }));
  };
  
  const getTypingStyle = () => {
    return useAnimatedStyle(() => {
      const visibleChars = Math.floor(text.length * typingProgress.value);
      return {
        opacity: 1,
      };
    });
  };
  
  // Obter o estilo baseado no tipo de animação
  const getAnimatedStyle = () => {
    switch (animationType) {
      case 'slide':
        return getSlideStyle();
      case 'highlight':
        return getHighlightStyle();
      case 'typing':
        return getTypingStyle();
      case 'fade':
      default:
        return getFadeStyle();
    }
  };
  
  // Para simular o efeito de digitação
  const getDisplayText = () => {
    if (animationType === 'typing') {
      return { text }; // Manipulado pelo componente nativo
    } else {
      return { text };
    }
  };
  
  return (
    <Animated.Text
      style={[styles.text, getAnimatedStyle(), style]}
      {...getDisplayText()}
    >
      {text}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4
  }
}); 