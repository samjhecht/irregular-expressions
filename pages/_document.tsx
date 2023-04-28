
import * as React from 'react';
import theme from '../src/theme';
import { ColorModeScript } from '@chakra-ui/react'
import NextDocument, {
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';


export default class Document extends NextDocument {
  render() {
    return (
      <Html>
        <Head>
          <link
            rel="alternate"
            type="application/rss+xml"
            title="irregular-expressions.com rss feed"
            href="/rss.xml"
          />
          <meta name="theme-color" content={theme.colors.primary} />
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <body>
          {/* Make Color mode to persists when you refresh the page. */}
          <ColorModeScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}