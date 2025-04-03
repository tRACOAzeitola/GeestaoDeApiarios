import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Theme from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';

interface ListItemProps {
  title: string;
  subtitle?: string;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  bordered?: boolean;
  disabled?: boolean;
  selected?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  badgeColor?: string;
  badgeTextColor?: string;
  highlightColor?: string;
}

export const ListItem = ({
  title,
  subtitle,
  leftContent,
  rightContent,
  onPress,
  showChevron = false,
  containerStyle,
  titleStyle,
  subtitleStyle,
  bordered = true,
  disabled = false,
  selected = false,
  showBadge = false,
  badgeText,
  badgeColor,
  badgeTextColor,
  highlightColor,
}: ListItemProps) => {
  const Wrapper = onPress ? TouchableOpacity : View;
  
  const badgeBackgroundColor = badgeColor || Theme.COLORS.primary.default;
  const badgeTxtColor = badgeTextColor || Theme.COLORS.surface.light;
  const highlightBgColor = highlightColor || Theme.COLORS.primary.light;

  return (
    <Wrapper
      style={[
        styles.container,
        bordered && styles.bordered,
        selected && { backgroundColor: highlightBgColor },
        disabled && styles.disabled,
        containerStyle,
      ]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      {leftContent && (
        <View style={styles.leftContentContainer}>
          {leftContent}
        </View>
      )}
      
      <View style={styles.textContainer}>
        <View style={styles.titleContainer}>
          <Text 
            style={[
              styles.title, 
              disabled && styles.disabledText,
              titleStyle,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          
          {showBadge && badgeText && (
            <View style={[styles.badge, { backgroundColor: badgeBackgroundColor }]}>
              <Text style={[styles.badgeText, { color: badgeTxtColor }]}>
                {badgeText}
              </Text>
            </View>
          )}
        </View>
        
        {subtitle && (
          <Text 
            style={[
              styles.subtitle, 
              disabled && styles.disabledText,
              subtitleStyle,
            ]}
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        )}
      </View>
      
      {rightContent && (
        <View style={styles.rightContentContainer}>
          {rightContent}
        </View>
      )}
      
      {showChevron && (
        <View style={styles.chevronContainer}>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={disabled ? Theme.COLORS.text.disabled : Theme.COLORS.text.secondary}
          />
        </View>
      )}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.SPACING.md,
    paddingHorizontal: Theme.SPACING.lg,
    backgroundColor: Theme.COLORS.surface.light,
  },
  bordered: {
    borderBottomWidth: 1,
    borderBottomColor: Theme.COLORS.border.light,
  },
  disabled: {
    opacity: 0.6,
  },
  disabledText: {
    color: Theme.COLORS.text.disabled,
  },
  leftContentContainer: {
    marginRight: Theme.SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: Theme.FONT.body,
    fontWeight: '500',
    color: Theme.COLORS.text.primary,
    flex: 1,
  },
  subtitle: {
    fontSize: Theme.FONT.bodySmall,
    color: Theme.COLORS.text.secondary,
    marginTop: Theme.SPACING.xxs,
  },
  rightContentContainer: {
    marginLeft: Theme.SPACING.md,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  chevronContainer: {
    marginLeft: Theme.SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: Theme.SPACING.xs,
    paddingVertical: Theme.SPACING.tiny,
    borderRadius: Theme.SIZES.radius.xs,
    marginLeft: Theme.SPACING.sm,
  },
  badgeText: {
    fontSize: Theme.FONT.caption,
    fontWeight: '500',
  },
}); 