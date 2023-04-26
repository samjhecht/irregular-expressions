// import * as React from 'react';
// import theme from '../src/theme';
// import { ColorModeScript } from '@chakra-ui/react'
// import NextDocument, {
//   Html,
//   Head,
//   Main,
//   NextScript,
// } from 'next/document';


// export default class Document extends NextDocument {
//   render() {
//     return (
//       <Html>
//         <Head>
//           <link
//             rel="alternate"
//             type="application/rss+xml"
//             title="irregular-expressions.com rss feed"
//             href="/rss.xml"
//           />
//           <meta name="theme-color" content={theme.colors.primary} />
//           <link rel="shortcut icon" href="/favicon.ico" />
//         </Head>
//         <body>
//           {/* Make Color mode to persists when you refresh the page. */}
//           <ColorModeScript />
//           <Main />
//           <NextScript />
//         </body>
//       </Html>
//     )
//   }
// }


import * as React from 'react';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentProps,
  DocumentContext,
} from 'next/document';
import { ColorModeScript } from '@chakra-ui/react'
import createEmotionServer from '@emotion/server/create-instance';
import { AppType } from 'next/app';
import theme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';
import { MyAppProps } from './_app';
import { ServerStyleSheet } from 'styled-components'

interface MyDocumentProps extends DocumentProps {
  emotionStyleTags: JSX.Element[];
  styledComponentStyles: JSX.Element;
}

// const isProd = process.env.NODE_ENV === "production";

export default function MyDocument({ emotionStyleTags, styledComponentStyles }: MyDocumentProps) {
  return (
    <Html lang="en">
      <Head>
        {/* PWA primary color */}
        <link rel="alternate" type="application/rss+xml" title="irregular-expressions.com rss feed" href="/rss.xml" />
        <meta name="theme-color" content={theme.colors.primary} />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="emotion-insertion-point" content="" />
        {emotionStyleTags}
        {styledComponentStyles}
      </Head>
      <body>
        {/* Make Color mode to persists when you refresh the page. */}
        <ColorModeScript />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const sheet = new ServerStyleSheet();
  const originalRenderPage = ctx.renderPage;

  // You can consider sharing the same Emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: React.ComponentType<React.ComponentProps<AppType> & MyAppProps>) =>
        function EnhanceApp(props) {
          // return <App emotionCache={cache} {...props} />;
          return sheet.collectStyles(<App emotionCache={createEmotionCache()} {...props} />);
        },
    });

  const initialProps = await Document.getInitialProps(ctx);

  // This is important. It prevents Emotion to render invalid HTML.
  // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
    styledComponentStyles: sheet.getStyleElement(),
  };
};