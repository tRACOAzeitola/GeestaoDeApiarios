import React from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  View, 
  Text,
  Animated,
  Easing
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

type ThemeToggleProps = {
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: any;
};

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  showLabel = false,
  size = 'medium',
  style
}) => {
  const { isDarkMode, toggleTheme, theme } = useTheme();
  
  // Configuração de tamanho
  const getSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'large': return 28;
      default: return 22;
    }
  };
  
  // Animação de rotação
  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isDarkMode ? 1 : 0,
      duration: 400,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true
    }).start();
  }, [isDarkMode]);
  
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  
  return (
    <TouchableOpacity 
      onPress={toggleTheme}
      style={[styles.button, style]}
      activeOpacity={0.7}
    >
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Ionicons 
          name={isDarkMode ? 'moon' : 'sunny'} 
          size={getSize()} 
          color={isDarkMode ? theme.COLORS.primary.default : theme.COLORS.primary.default} 
        />
      </Animated.View>
      
      {showLabel && (
        <Text style={[
          styles.label,
          { color: theme.COLORS.text.primary, marginLeft: 8 }
        ]}>
          {isDarkMode ? 'Modo Escuro' : 'Modo Claro'}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  }
}); 