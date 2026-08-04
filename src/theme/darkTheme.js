// src/theme/darkTheme.js
import { createTheme } from '@mui/material/styles';
import { colors } from './tokens/colors';
import { typography } from './tokens/typography';
import { shape, radii } from './tokens/spacing';
import { customShadows } from './tokens/shadows';
import { breakpoints } from './tokens/breakpoints';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
    background: colors.background.dark,
    text: colors.text.dark,
    grey: colors.grey,
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography,
  shape,
  breakpoints,
  customShadows: customShadows.dark,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: radii.sm,
          padding: '8px 24px',
          boxShadow: customShadows.dark.button,
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: radii.md,
          boxShadow: customShadows.dark.card,
          backgroundColor: colors.background.dark.paper,
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: radii.md,
        },
        elevation1: {
          boxShadow: customShadows.dark.card,
        },
        elevation2: {
          boxShadow: customShadows.dark.cardHover,
        },
        elevation3: {
          boxShadow: customShadows.dark.dropdown,
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: radii.sm,
          }
        }
      }
    }
  }
});
