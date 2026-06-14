export const Colors = {
  // Base
  background: '#07090F',
  surface: '#0F1320',
  surfaceElevated: '#161B2E',
  border: '#1C2338',
  borderSubtle: '#141929',

  // Text
  textPrimary: '#EEF0FA',
  textSecondary: '#7B88A8',
  textMuted: '#3D4A66',

  // Accent — electric indigo
  accent: '#6366F1',
  accentBright: '#818CF8',
  accentDim: '#1E2052',
  accentGlow: 'rgba(99,102,241,0.18)',

  // Semantic
  live: '#EF4444',
  liveDim: 'rgba(239,68,68,0.15)',
  success: '#22C55E',
  warning: '#F59E0B',

  // Overlay
  overlay: 'rgba(7,9,15,0.85)',
  overlayLight: 'rgba(7,9,15,0.5)',

  // Gradients (as arrays for LinearGradient)
  gradientHero: ['rgba(7,9,15,0)', 'rgba(7,9,15,0.7)', '#07090F'] as [string, string, string],
  gradientCard: ['rgba(7,9,15,0)', 'rgba(7,9,15,0.95)'] as [string, string],
  gradientAccent: ['#6366F1', '#4338CA'] as [string, string],
} as const;
