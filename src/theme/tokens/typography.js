// src/theme/tokens/typography.js

export const typography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,
  fontWeightExtraBold: 800,
  
  h1: {
    fontSize: 'clamp(2.5rem, 5vw + 1rem, 3.5rem)', // 40px to 56px
    fontWeight: 800,
    letterSpacing: '-1.5px',
    lineHeight: 1.2,
  },
  h2: {
    fontSize: 'clamp(2rem, 4vw + 1rem, 2.5rem)', // 32px to 40px
    fontWeight: 700,
    letterSpacing: '-0.5px',
    lineHeight: 1.3,
  },
  h3: {
    fontSize: 'clamp(1.75rem, 3vw + 1rem, 2rem)', // 28px to 32px
    fontWeight: 700,
    lineHeight: 1.3,
  },
  h4: {
    fontSize: 'clamp(1.25rem, 2vw + 1rem, 1.5rem)', // 20px to 24px
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: 'clamp(1.1rem, 1.5vw + 1rem, 1.25rem)', // 18px to 20px
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h6: {
    fontSize: '1.05rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  button: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.95rem',
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 500,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '1px',
    textTransform: 'uppercase',
  }
};
