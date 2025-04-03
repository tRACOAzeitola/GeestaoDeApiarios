import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
  TextStyle,
  StatusBar,
  Platform,
} from 'react-native';
import Theme from '../../constants/Theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AnimatedHeaderProps {
  title: string;
  scrollY: Animated.Value;
  minHeight?: number;
  maxHeight?: number;
  backgroundColor?: string;
  textColor?: string;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  backgroundImage?: React.ReactNode;
  showShadow?: boolean;
}

export const AnimatedHeader = ({
  title,
  scrollY,
  minHeight = 60,
  maxHeight = 150,
  backgroundColor = Theme.COLORS.primary.default,
  textColor = Theme.COLORS.surface.light,
  containerStyle,
  titleStyle,
  leftComponent,
  rightComponent,
  backgroundImage,
  showShadow = true,
}: AnimatedHeaderProps) => {
  const insets = useSafeAreaInsets();
  const paddingTop = Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight || 0;
  
  // Adjusted heights with insets
  const adjustedMinHeight = minHeight + paddingTop;
  const adjustedMaxHeight = maxHeight + paddingTop;
  const heightDiff = adjustedMaxHeight - adjustedMinHeight;
  
  // Interpolations for animations
  const headerHeight = scrollY.interpolate({
    inputRange: [0, heightDiff],
    outputRange: [adjustedMaxHeight, adjustedMinHeight],
    extrapolate: 'clamp',
  });
  
  const titleOpacity = scrollY.interpolate({
    inputRange: [heightDiff * 0.7, heightDiff],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  const titleScale = scrollY.interpolate({
    inputRange: [heightDiff * 0.7, heightDiff],
    outputRange: [0.8, 1],
    extrapolate: 'clamp',
  });
  
  const titleY = scrollY.interpolate({
    inputRange: [0, heightDiff],
    outputRange: [adjustedMaxHeight - 60, (adjustedMinHeight - paddingTop) / 2],
    extrapolate: 'clamp',
  });
  
  const shadowOpacity = scrollY.interpolate({
    inputRange: [0, heightDiff * 0.5],
    outputRange: [0, showShadow ? 0.3 : 0],
    extrapolate: 'clamp',
  });
  
  const backgroundOpacity = scrollY.interpolate({
    inputRange: [0, heightDiff],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          height: headerHeight,
          backgroundColor,
          paddingTop,
          shadowOpacity: shadowOpacity as any,
        },
        containerStyle,
      ]}
    >
      {/* Background Image */}
      {backgroundImage && (
        <Animated.View
          style={[
            styles.backgroundImage,
            {
              opacity: backgroundOpacity,
            },
          ]}
        >
          {backgroundImage}
        </Animated.View>
      )}
      
      {/* Left Component */}
      {leftComponent && (
        <View style={styles.leftComponent}>{leftComponent}</View>
      )}
      
      {/* Right Component */}
      {rightComponent && (
        <View style={styles.rightComponent}>{rightComponent}</View>
      )}
      
      {/* Title */}
      <Animated.View
        style={[
          styles.titleContainer,
          {
            opacity: titleOpacity,
            transform: [{ scale: titleScale }],
            top: titleY,
          },
        ]}
      >
        <Text
          style={[
            styles.titleCollapsed,
            {
              color: textColor,
            },
            titleStyle,
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </Animated.View>
      
      {/* Expanded Title */}
      <Animated.View
        style={[
          styles.expandedTitleContainer,
          {
            opacity: Animated.subtract(1, titleOpacity),
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, heightDiff],
                  outputRange: [0, -20],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
      >
        <Text
          style={[
            styles.titleExpanded,
            {
              color: textColor,
            },
          ]}
          numberOfLines={2}
        >
          {title}
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    justifyContent: 'center',
  },
  titleContainer: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',
  },
  titleCollapsed: {
    fontSize: Theme.FONT.title,
    fontWeight: '600',
    textAlign: 'center',
  },
  expandedTitleContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  titleExpanded: {
    fontSize: Theme.FONT.headline2,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  leftComponent: {
    position: 'absolute',
    left: 15,
    top: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 0) + 10,
    zIndex: 12,
  },
  rightComponent: {
    position: 'absolute',
    right: 15,
    top: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 0) + 10,
    zIndex: 12,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
}); 