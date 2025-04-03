import React from 'react';
import {
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  ImageSourcePropType,
  ImageStyle
} from 'react-native';
import Theme from '../../constants/Theme';

type AvatarSize = 'tiny' | 'small' | 'medium' | 'large' | 'xlarge';
type AvatarShape = 'circle' | 'square' | 'rounded';
type AvatarBadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

interface AvatarProps {
  source?: ImageSourcePropType;
  name?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  backgroundColor?: string;
  textColor?: string;
  containerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  textStyle?: TextStyle;
  showBadge?: boolean;
  badgeContent?: React.ReactNode;
  badgePosition?: AvatarBadgePosition;
  badgeColor?: string;
  badgeSize?: number;
  badgeStyle?: ViewStyle;
}

export const Avatar = ({
  source,
  name = "",
  size = 'medium',
  shape = 'circle',
  backgroundColor,
  textColor,
  containerStyle,
  imageStyle,
  textStyle,
  showBadge = false,
  badgeContent,
  badgePosition = 'top-right',
  badgeColor = Theme.COLORS.status.good,
  badgeSize,
  badgeStyle,
}: AvatarProps) => {
  // Get initials from name (max 2 characters)
  const getInitials = (name: string) => {
    if (!name) return '';
    
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    } else {
      return (
        nameParts[0].charAt(0).toUpperCase() +
        nameParts[nameParts.length - 1].charAt(0).toUpperCase()
      );
    }
  };
  
  const avatarSize = {
    tiny: Theme.SIZES.icon.tiny * 2,
    small: Theme.SIZES.icon.small * 2,
    medium: Theme.SIZES.icon.medium * 2,
    large: Theme.SIZES.icon.large * 2,
    xlarge: Theme.SIZES.icon.xlarge * 2,
  }[size];
  
  const avatarBorderRadius = {
    circle: avatarSize / 2,
    square: 0,
    rounded: Theme.SIZES.radius.sm,
  }[shape];
  
  const initials = getInitials(name);
  const bgColor = backgroundColor || stringToColor(name);
  
  const defaultBadgeSize = avatarSize / 4;
  const actualBadgeSize = badgeSize || defaultBadgeSize;
  
  const badgePositionStyle = {
    'top-right': {
      top: 0,
      right: 0,
    },
    'top-left': {
      top: 0,
      left: 0,
    },
    'bottom-right': {
      bottom: 0,
      right: 0,
    },
    'bottom-left': {
      bottom: 0,
      left: 0,
    },
  }[badgePosition];
  
  return (
    <View
      style={[
        styles.container,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarBorderRadius,
          backgroundColor: bgColor,
        },
        containerStyle,
      ]}
    >
      {source ? (
        <Image
          source={source}
          style={[
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarBorderRadius,
            },
            imageStyle,
          ]}
          resizeMode="cover"
        />
      ) : (
        <Text
          style={[
            styles.initialsText,
            {
              fontSize: avatarSize / 2.5,
              color: textColor || Theme.COLORS.surface.light,
            },
            textStyle,
          ]}
        >
          {initials}
        </Text>
      )}
      
      {showBadge && (
        <View
          style={[
            styles.badge,
            {
              width: actualBadgeSize,
              height: actualBadgeSize,
              borderRadius: actualBadgeSize / 2,
              backgroundColor: badgeColor,
              ...badgePositionStyle,
            },
            badgeStyle,
          ]}
        >
          {badgeContent}
        </View>
      )}
    </View>
  );
};

// Helper function to generate a consistent color from a string
const stringToColor = (str: string): string => {
  if (!str) return Theme.COLORS.primary.default;
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    Theme.COLORS.primary.default,
    Theme.COLORS.secondary.default,
    Theme.COLORS.accent.default,
    Theme.COLORS.primary.dark,
    Theme.COLORS.secondary.dark,
    Theme.COLORS.accent.dark,
  ];
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  initialsText: {
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Theme.COLORS.surface.light,
  },
}); 