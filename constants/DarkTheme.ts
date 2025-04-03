import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// COLORS
const COLORS = {
  primary: {
    light: '#FFC107',
    default: '#FFA000',
    dark: '#F57C00',
  },
  secondary: {
    light: '#A1887F',
    default: '#795548',
    dark: '#5D4037',
  },
  accent: {
    light: '#81D4FA',
    default: '#29B6F6',
    dark: '#0288D1',
  },
  status: {
    good: '#4CAF50',
    strong: '#2196F3',
    weak: '#FF9800',
    dead: '#F44336',
  },
  background: {
    light: '#303030',
    default: '#212121',
    dark: '#121212',
  },
  surface: {
    light: '#424242',
    default: '#303030',
    dark: '#212121',
  },
  text: {
    primary: '#E0E0E0',
    secondary: '#B0B0B0',
    disabled: '#757575',
    dark: '#FAFAFA',
  },
  border: {
    light: '#505050',
    dark: '#676767',
  },
  shadow: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.7)',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
};

// TYPOGRAPHY - mesmos valores que o tema claro
const FONT = {
  // Font families
  regular: 'System',
  medium: 'System',
  bold: 'System-Bold',

  // Font sizes
  headline1: 32,
  headline2: 24,
  headline3: 20,
  headline4: 18,
  title: 16,
  subtitle: 14,
  body: 16,
  bodySmall: 14,
  caption: 12,
  button: 16,
  label: 12,

  // Line heights
  headlineHeight: 1.5,
  bodyHeight: 1.6,
  captionHeight: 1.4,
};

// SPACING - mesmos valores que o tema claro
const SPACING = {
  tiny: 2,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 64,
};

// SIZES - mesmos valores que o tema claro
const SIZES = {
  icon: {
    tiny: 12,
    small: 16,
    medium: 24,
    large: 32,
    xlarge: 48,
  },
  border: {
    thin: 1,
    regular: 2,
    thick: 3,
  },
  button: {
    small: 32,
    medium: 44,
    large: 56,
  },
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    circle: 999,
  },
  screen: {
    width,
    height,
    paddingHorizontal: 16,
  },
};

// SHADOWS - versão escura otimizada
const SHADOWS = {
  light: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  dark: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
};

// ANIMATIONS - mesmos valores que o tema claro
const ANIMATION = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  type: {
    easeIn: 'easeIn',
    easeOut: 'easeOut',
    easeInOut: 'easeInOut',
  },
};

export default {
  COLORS,
  FONT,
  SPACING,
  SIZES,
  SHADOWS,
  ANIMATION,
  isDarkMode: true, // Este tema é o escuro
}; 