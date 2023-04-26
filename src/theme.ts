
import { extendTheme } from '@chakra-ui/react';

const colors = {
  primary: '#000000',
  secondary: '#19857b',
  black: '#16161D',
  error: '#f44336', // red.A400 equivalent
};

const breakpoints = {
  sm: '40em',
  md: '52em',
  lg: '64em',
  xl: '80em',
}

const theme = extendTheme({
  fonts: {
    heading: `'Vulf Sans Bold', system-ui, arial`,
    body: `'Vulf Sans Body', system-ui, arial`,
  },
  colors,
  breakpoints,
});

export default theme;

