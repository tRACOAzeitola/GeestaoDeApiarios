import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import Theme from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  touched?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  errorStyle?: TextStyle;
  secure?: boolean;
  multiline?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
}

export const Input = ({
  label,
  error,
  touched,
  leftIcon,
  rightIcon,
  containerStyle,
  inputContainerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  secure = false,
  multiline = false,
  maxLength,
  showCharCount = false,
  value = '',
  ...props
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(secure);

  const hasError = !!error && touched;

  const handleFocus = () => {
    setIsFocused(true);
    if (props.onFocus) {
      props.onFocus(new Event('focus') as any);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (props.onBlur) {
      props.onBlur(new Event('blur') as any);
    }
  };

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      
      <View
        style={[
          styles.inputContainer,
          inputContainerStyle,
          isFocused && styles.inputFocused,
          hasError && styles.inputError,
          multiline && styles.multiline,
        ]}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : null,
            rightIcon ? styles.inputWithRightIcon : null,
            multiline ? styles.multilineInput : null,
            inputStyle,
          ]}
          secureTextEntry={secureTextEntry}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline={multiline}
          maxLength={maxLength}
          placeholderTextColor={Theme.COLORS.text.secondary}
          value={value}
          {...props}
        />
        
        {secure && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={toggleSecureEntry}
          >
            <Ionicons
              name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={Theme.COLORS.text.secondary}
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !secure && (
          <View style={styles.iconContainer}>{rightIcon}</View>
        )}
      </View>
      
      <View style={styles.bottomContainer}>
        {hasError && (
          <Text style={[styles.errorText, errorStyle]}>{error}</Text>
        )}
        
        {showCharCount && maxLength && (
          <Text style={styles.charCount}>
            {value.length}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.SPACING.md,
    width: '100%',
  },
  label: {
    fontSize: Theme.FONT.bodySmall,
    color: Theme.COLORS.text.primary,
    marginBottom: Theme.SPACING.xs,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.COLORS.surface.light,
    borderWidth: 1,
    borderColor: Theme.COLORS.border.light,
    borderRadius: Theme.SIZES.radius.sm,
    height: 44,
    paddingHorizontal: Theme.SPACING.sm,
  },
  input: {
    flex: 1,
    color: Theme.COLORS.text.primary,
    fontSize: Theme.FONT.body,
    height: '100%',
    paddingVertical: Theme.SPACING.sm,
  },
  inputFocused: {
    borderColor: Theme.COLORS.primary.default,
    ...Theme.SHADOWS.light,
  },
  inputError: {
    borderColor: Theme.COLORS.error,
  },
  inputWithLeftIcon: {
    paddingLeft: Theme.SPACING.xs,
  },
  inputWithRightIcon: {
    paddingRight: Theme.SPACING.xs,
  },
  iconContainer: {
    paddingHorizontal: Theme.SPACING.xs,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: Theme.FONT.caption,
    color: Theme.COLORS.error,
    marginTop: Theme.SPACING.xs,
  },
  multiline: {
    height: 120,
    alignItems: 'flex-start',
  },
  multilineInput: {
    textAlignVertical: 'top',
    paddingTop: Theme.SPACING.sm,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCount: {
    fontSize: Theme.FONT.caption,
    color: Theme.COLORS.text.secondary,
    marginTop: Theme.SPACING.xs,
  },
}); 