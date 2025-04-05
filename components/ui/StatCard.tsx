import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { AnimatedText } from './AnimatedText';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  color?: string;
  style?: ViewStyle;
  onPress?: () => void;
  animationType?: 'fade' | 'scale' | 'highlight';
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color,
  style,
  onPress,
  animationType = 'highlight',
  delay = 0
}) => {
  const { theme, isDarkMode } = useTheme();
  const scale = useSharedValue(1);
  
  // Configurar cores
  const cardColor = color || theme.COLORS.primary.default;
  const cardBgColor = isDarkMode 
    ? `${cardColor}22` // Versão mais escura com opacidade
    : `${cardColor}15`; // Versão mais clara com opacidade
  
  // Configurar ícone de tendência
  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend.direction) {
      case 'up':
        return 'arrow-up';
      case 'down':
        return 'arrow-down';
      default:
        return 'remove';
    }
  };
  
  const getTrendColor = () => {
    if (!trend) return theme.COLORS.text.secondary;
    
    switch (trend.direction) {
      case 'up':
        return theme.COLORS.status.good;
      case 'down':
        return theme.COLORS.status.weak;
      default:
        return theme.COLORS.text.secondary;
    }
  };
  
  // Estilo animado para o toque
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });
  
  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.97, { damping: 10, stiffness: 300 });
    }
  };
  
  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 10, stiffness: 300 });
    }
  };
  
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Animated.View style={[animatedStyle, styles.container, style]}>
      <Container 
        style={[
          styles.card, 
          { backgroundColor: cardBgColor, borderLeftColor: cardColor, borderLeftWidth: 4 }
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.COLORS.text.secondary }]}>
              {title}
            </Text>
            {icon && (
              <Ionicons 
                name={icon as any} 
                size={20} 
                color={cardColor} 
                style={styles.icon}
              />
            )}
          </View>
          
          <AnimatedText
            text={value.toString()}
            style={[styles.value, { color: theme.COLORS.text.primary }]}
            animationType={animationType}
            delay={delay}
            duration={1200}
          />
          
          {trend && (
            <View style={styles.trendContainer}>
              <Ionicons 
                name={getTrendIcon() as any} 
                size={14} 
                color={getTrendColor()} 
                style={styles.trendIcon}
              />
              <Text style={[styles.trendValue, { color: getTrendColor() }]}>
                {trend.value}%
              </Text>
              {trend.label && (
                <Text style={[styles.trendLabel, { color: theme.COLORS.text.secondary }]}>
                  {trend.label}
                </Text>
              )}
            </View>
          )}
        </View>
      </Container>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 150,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 6,
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  icon: {
    marginLeft: 6,
  },
  value: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  trendIcon: {
    marginRight: 4,
  },
  trendValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  trendLabel: {
    fontSize: 12,
    marginLeft: 6,
  }
}); 