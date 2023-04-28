
import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';
import Fonts from '../src/fonts';
import theme from '../src/theme';
import '../src/global-styles.css';
import 'highlight.js/styles/atom-one-dark-reasonable.css';
import { Analytics } from '@vercel/analytics/react';

// const isProd = process.env.NODE_ENV === "production";


export default function MyApp({ Component, pageProps }) {

  return (
      <ChakraProvider theme={theme}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
        <Fonts />
        {/* <CSSReset /> */}
        <Component {...pageProps} />
        <Analytics />
      </ChakraProvider>
  );
}
