// src/theme/ThemeProvider.jsx
import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';
import { GlobalStyles } from './GlobalStyles';

const ThemeContext = createContext({
  mode: 'light',
  toggleColorMode: () => {},
});

export const useAppTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  useEffect(() => {
    // Optionally check system preference here or local storage
    const storedMode = localStorage.getItem('app-theme-mode');
    if (storedMode === 'dark' || storedMode === 'light') {
      setMode(storedMode);
    }
  }, []);

  const themeContextValue = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('app-theme-mode', newMode);
          return newMode;
        });
      },
    }),
    [mode]
  );

  const theme = useMemo(
    () => (mode === 'light' ? lightTheme : darkTheme),
    [mode]
  );

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
