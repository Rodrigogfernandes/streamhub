import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Layout = {
  screenWidth: width,
  screenHeight: height,
  
  // Spacing scale
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  // Component sizes
  cardWidth: width * 0.38,
  cardHeight: width * 0.38 * 1.5,
  heroBannerHeight: height * 0.52,
  channelCardWidth: width * 0.28,
  channelCardHeight: width * 0.28 * 0.6,

  // Border radius
  radiusSm: 6,
  radiusMd: 10,
  radiusLg: 16,
  radiusXl: 24,
  radiusFull: 999,

  // Tab bar
  tabBarHeight: 64,
} as const;
