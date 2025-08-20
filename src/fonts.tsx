import { Global } from '@emotion/react'

const Fonts = () => (
  <Global
    styles={`
      /* latin */
      @font-face {
        font-family: 'Vulf Sans';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('/fonts/Vulf_Sans-Regular.woff2') format('woff2');
      }
      /* latin */
      @font-face {
        font-family: 'Vulf Sans Body';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('/fonts/Vulf_Sans-Regular.woff2') format('woff2');
      }

      /* latin */
      @font-face {
        font-family: 'Vulf Sans Bold';
        font-style: normal;
        font-weight: 600;
        font-display: swap;
        src: url('/fonts/Vulf_Sans-Bold.woff2') format('woff2');
      }
      /* latin */
      @font-face {
        font-family: 'Vulf Sans Italic';
        font-style: italic;
        font-weight: 400;
        font-display: swap;
        src: url('/fonts/Vulf_Sans-Italic.woff2') format('woff2');
      }
      /* latin */
      @font-face {
        font-family: 'Vulf Sans Bold Italic';
        font-style: italic;
        font-weight: 600;
        font-display: swap;
        src: url('/fonts/Vulf_Sans-Bold_Italic.woff2') format('woff2');
      }
      `}
  />
)

export default Fonts
