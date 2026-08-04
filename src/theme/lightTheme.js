// src/theme/lightTheme.js
import { createTheme } from '@mui/material/styles';
import { colors } from './tokens/colors';
import { typography } from './tokens/typography';
import { shape, radii } from './tokens/spacing';
import { customShadows } from './tokens/shadows';
import { breakpoints } from './tokens/breakpoints';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
    background: colors.background.light,
    text: colors.text.light,
    grey: colors.grey,
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  typography,
  shape,
  breakpoints,
  customShadows: customShadows.light,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: radii.sm,
          padding: '8px 24px',
          boxShadow: customShadows.light.button,
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: radii.md,
          boxShadow: customShadows.light.card,
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: radii.md,
        },
        elevation1: {
          boxShadow: customShadows.light.card,
        },
        elevation2: {
          boxShadow: customShadows.light.cardHover,
        },
        elevation3: {
          boxShadow: customShadows.light.dropdown,
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
