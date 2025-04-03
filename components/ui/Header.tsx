import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Theme from '../../constants/Theme';

interface HeaderProps {
  title: string;
  leftAction?: () => void;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightAction?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  transparent?: boolean;
  backgroundColor?: string;
  textColor?: string;
  showShadow?: boolean;
  subtitle?: string;
  centerTitle?: boolean;
}

export const Header = ({
  title,
  leftAction,
  leftIcon = 'arrow-back',
  rightAction,
  rightIcon,
  containerStyle,
  titleStyle,
  transparent = false,
  backgroundColor,
  textColor,
  showShadow = true,
  subtitle,
  centerTitle = true,
}: HeaderProps) => {
  const insets = useSafeAreaInsets();
  const paddingTop = Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight || 0;
  
  const bgColor = transparent 
    ? 'transparent' 
    : backgroundColor || Theme.COLORS.primary.default;
  
  const txtColor = textColor || (transparent 
    ? Theme.COLORS.text.primary 
    : Theme.COLORS.surface.light);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: paddingTop + 10,
          backgroundColor: bgColor,
          ...(showShadow && !transparent ? styles.shadow : {}),
        },
        containerStyle,
      ]}
    >
      <View style={styles.content}>
        {leftAction ? (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={leftAction}
            activeOpacity={0.7}
          >
            <Ionicons name={leftIcon} size={24} color={txtColor} />
          </TouchableOpacity>
        ) : (
          <View style={styles.actionPlaceholder} />
        )}

        <View style={[
          styles.titleContainer,
          centerTitle ? styles.titleCentered : styles.titleLeft
        ]}>
          <Text
            style={[
              styles.title,
              { color: txtColor },
              titleStyle,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                { color: txtColor + '99' }, // Add transparency
              ]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {rightAction && rightIcon ? (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={rightAction}
            activeOpacity={0.7}
          >
            <Ionicons name={rightIcon} size={24} color={txtColor} />
          </TouchableOpacity>
        ) : (
          <View style={styles.actionPlaceholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 60,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.SPACING.md,
    paddingBottom: Theme.SPACING.sm,
    height: 50,
  },
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  actionPlaceholder: {
    width: 40,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleCentered: {
    alignItems: 'center',
  },
  titleLeft: {
    alignItems: 'flex-start',
    paddingLeft: Theme.SPACING.sm,
  },
  title: {
    fontSize: Theme.FONT.title,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: Theme.FONT.caption,
    marginTop: 2,
  },
}); 