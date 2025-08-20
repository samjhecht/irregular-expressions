import { extendTheme } from '@chakra-ui/react'

const extraBreakpointsExtender = extendTheme({
  breakpoints: {
    xxxs: '5em', // 160px
    xxs: '15em', // 240px
    xs: '20em', // 320px
    sm: '30em', // 480px
    md: '48em', // 768px
    lg: '62em', // 992px
    xl: '80em', // 1280px
    '2xl': '96em', // 1536px
  },
})

export default extraBreakpointsExtender
