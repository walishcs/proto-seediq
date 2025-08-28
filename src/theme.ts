import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'red',
  primaryShade: { light: 6, dark: 8 },
  colors: {
    red: [
      '#fdf2f2',
      '#fce4e4', 
      '#f7c6c6',
      '#f2a5a5',
      '#ed8888',
      '#e87272',
      '#e56565',
      '#d94f4f',
      '#cc3f3f',
      '#b82d2d'
    ],
  },
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  headings: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  defaultRadius: 'md',
  cursorType: 'pointer',
});
