import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle, TouchableOpacity } from 'react-native';
import Theme from '../../constants/Theme';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const Card = ({ children, style, onPress, variant = 'default' }: CardProps) => {
  const cardStyle = [
    styles.card,
    variant === 'elevated' && styles.cardElevated,
    variant === 'outlined' && styles.cardOutlined,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity 
        style={cardStyle} 
        onPress={onPress} 
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.COLORS.surface.light,
    borderRadius: Theme.SIZES.radius.md,
    padding: Theme.SPACING.md,
    margin: Theme.SPACING.md,
    ...Theme.SHADOWS.light,
  },
  cardElevated: {
    ...Theme.SHADOWS.medium,
  },
  cardOutlined: {
    backgroundColor: Theme.COLORS.transparent,
    borderWidth: Theme.SIZES.border.thin,
    borderColor: Theme.COLORS.border.light,
    shadowOpacity: 0,
    elevation: 0,
  },
}); 