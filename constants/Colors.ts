/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#FFC107';
const tintColorDark = '#FFA000';

export default {
  light: {
    text: '#212121',
    background: '#FFF8E1',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    primary: '#FFC107',
    primaryDark: '#FFA000',
    secondary: '#795548',
    light: '#FFF8E1',
    danger: '#F44336',
    warning: '#FF9800',
    success: '#4CAF50',
    info: '#2196F3',
    card: '#FFFFFF',
  },
  dark: {
    text: '#e0e0e0',
    background: '#212121',
    tint: tintColorDark,
    tabIconDefault: '#666',
    tabIconSelected: tintColorDark,
    primary: '#FFC107',
    primaryDark: '#FFA000',
    secondary: '#795548',
    light: '#424242',
    danger: '#D32F2F',
    warning: '#F57C00',
    success: '#388E3C',
    info: '#1976D2',
    card: '#333333',
  },
};
