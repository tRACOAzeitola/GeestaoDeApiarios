import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ViewStyle, 
  TextStyle, 
  ActivityIndicator,
  View
} from 'react-native';
import Theme from '../../constants/Theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';
type IconPosition = 'left' | 'right';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
  fullWidth?: boolean;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
  fullWidth = false,
}: ButtonProps) => {
  // Determine styles based on props
  const buttonStyles = [
    styles.button,
    variant === 'primary' ? styles.buttonPrimary : 
    variant === 'secondary' ? styles.buttonSecondary : 
    variant === 'outline' ? styles.buttonOutline : 
    styles.buttonText,
    
    size === 'small' ? styles.buttonSmall : 
    size === 'medium' ? styles.buttonMedium : 
    styles.buttonLarge,
    
    disabled && styles.buttonDisabled,
    fullWidth && styles.buttonFullWidth,
    style,
  ];

  const textStyles = [
    styles.text,
    variant === 'primary' ? styles.textPrimary : 
    variant === 'secondary' ? styles.textSecondary : 
    variant === 'outline' ? styles.textOutline : 
    styles.textText,
    
    size === 'small' ? styles.textSmall : 
    size === 'medium' ? styles.textMedium : 
    styles.textLarge,
    
    disabled && styles.textDisabled,
    textStyle,
  ];

  const iconSpacing = {
    small: Theme.SPACING.xs,
    medium: Theme.SPACING.sm,
    large: Theme.SPACING.md,
  }[size];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={getLoaderColor(variant)} 
        />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === 'left' && (
            <View style={[styles.iconContainer, { marginRight: iconSpacing }]}>
              {icon}
            </View>
          )}
          
          <Text style={textStyles}>{title}</Text>
          
          {icon && iconPosition === 'right' && (
            <View style={[styles.iconContainer, { marginLeft: iconSpacing }]}>
              {icon}
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

// Helper functions
const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getLoaderColor = (variant: ButtonVariant) => {
  switch (variant) {
    case 'primary':
      return Theme.COLORS.secondary.default;
    case 'secondary':
      return Theme.COLORS.primary.default;
    case 'outline':
    case 'text':
      return Theme.COLORS.primary.default;
    default:
      return Theme.COLORS.secondary.default;
  }
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Theme.SIZES.radius.md,
    paddingHorizontal: Theme.SPACING.lg,
  },
  buttonPrimary: {
    backgroundColor: Theme.COLORS.primary.default,
  },
  buttonSecondary: {
    backgroundColor: Theme.COLORS.secondary.default,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Theme.COLORS.primary.default,
  },
  buttonText: {
    backgroundColor: 'transparent',
    paddingHorizontal: Theme.SPACING.xs,
  },
  buttonSmall: {
    height: Theme.SIZES.button.small,
    paddingHorizontal: Theme.SPACING.md,
  },
  buttonMedium: {
    height: Theme.SIZES.button.medium,
  },
  buttonLarge: {
    height: Theme.SIZES.button.large,
  },
  buttonDisabled: {
    backgroundColor: Theme.COLORS.text.disabled,
    borderColor: Theme.COLORS.text.disabled,
  },
  buttonFullWidth: {
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  textPrimary: {
    color: Theme.COLORS.secondary.default,
  },
  textSecondary: {
    color: Theme.COLORS.surface.light,
  },
  textOutline: {
    color: Theme.COLORS.primary.default,
  },
  textText: {
    color: Theme.COLORS.primary.default,
  },
  textSmall: {
    fontSize: Theme.FONT.bodySmall,
  },
  textMedium: {
    fontSize: Theme.FONT.body,
  },
  textLarge: {
    fontSize: Theme.FONT.title,
  },
  textDisabled: {
    color: Theme.COLORS.text.disabled,
  },
}); 