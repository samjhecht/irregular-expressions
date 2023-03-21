import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import localFont from 'next/font/local'

export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

export const myFonts = localFont({
  src: [
    {
      path: '../public/fonts/Vulf_Sans-Regular.woff2',
      style: 'normal',
      weight: '400',
    },
    {
      path: '../public/fonts/Vulf_Sans-Bold.woff2',
      style: 'normal',
      weight: '600',
    },
    {
      path: '../public/fonts/Vulf_Sans-Italic.woff2',
      style: 'italic',
      weight: '400',
    },
    {
      path: '../public/fonts/Vulf_Sans-Bold_Italic.woff2',
      style: 'italic',
      weight: '600',
    }
  ],
  variable: '--font-vulf-sans',
  fallback: ['system-ui', 'arial'],
});

//  const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#556cd6',
//     },
//     secondary: {
//       main: '#19857b',
//     },
//     error: {
//       main: red.A400,
//     },
//   },
//   typography: {
//     fontFamily: roboto.style.fontFamily,
//   },
// });


// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },

  typography: {
    fontFamily: myFonts.style.fontFamily,
    // fontFamily: 'Vulf Sans, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@font-face': [myFonts],
      },
    },
  },
});

export default theme;
