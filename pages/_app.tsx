
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../src/createEmotionCache';
import Fonts from '../src/fonts';
import theme from '../src/theme';
import '../src/global-styles.css';
import 'highlight.js/styles/atom-one-dark-reasonable.css';
import { Analytics } from '@vercel/analytics/react';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

// const isProd = process.env.NODE_ENV === "production";

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

// export default function MyApp({ Component, pageProps }) {
export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ChakraProvider theme={theme}>
        <Fonts />
        {/* <CSSReset /> */}
        <Component {...pageProps} />
        <Analytics />
      </ChakraProvider>
    </CacheProvider>
  );
}
