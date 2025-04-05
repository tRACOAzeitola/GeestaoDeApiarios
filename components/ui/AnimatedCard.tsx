import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  Easing,
  interpolate
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  index?: number; // Para animação em sequência
  animationType?: 'fade' | 'slide' | 'scale' | 'pop';
  delay?: number;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  style, 
  onPress, 
  index = 0,
  animationType = 'fade',
  delay = 0
}) => {
  const { theme } = useTheme();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const scale = useSharedValue(0.9);
  
  useEffect(() => {
    // Adicionar um pequeno delay entre cada card baseado no índice
    const totalDelay = delay + (index * 100);
    
    setTimeout(() => {
      opacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) });
      translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
      scale.value = withSpring(1, { damping: 20, stiffness: 200 });
    }, totalDelay);
  }, []);
  
  const getAnimatedStyle = () => {
    switch (animationType) {
      case 'slide':
        return useAnimatedStyle(() => ({
          opacity: opacity.value,
          transform: [{ translateY: translateY.value }]
        }));
      
      case 'scale':
        return useAnimatedStyle(() => ({
          opacity: opacity.value,
          transform: [{ scale: scale.value }]
        }));
        
      case 'pop':
        return useAnimatedStyle(() => {
          const scaleValue = interpolate(
            opacity.value,
            [0, 0.5, 1],
            [0.85, 1.05, 1]
          );
          return {
            opacity: opacity.value,
            transform: [{ scale: scaleValue }]
          };
        });
        
      case 'fade':
      default:
        return useAnimatedStyle(() => ({
          opacity: opacity.value
        }));
    }
  };
  
  const animatedStyle = getAnimatedStyle();
  
  const handlePress = () => {
    // Animação ao pressionar
    scale.value = withSpring(0.98, { damping: 10, stiffness: 300 }, () => {
      scale.value = withSpring(1, { damping: 15 });
    });
    
    if (onPress) {
      onPress();
    }
  };
  
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container onPress={onPress ? handlePress : undefined} activeOpacity={0.9}>
      <Animated.View
        style={[
          styles.card,
          { backgroundColor: theme.COLORS.surface.light },
          animatedStyle,
          style
        ]}
      >
        {children}
      </Animated.View>
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  }
}); 