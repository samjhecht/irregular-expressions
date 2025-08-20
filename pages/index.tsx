import { Text, Box, useBreakpointValue } from '@chakra-ui/react'
import Layout from '../components/layout'

export default function Home() {
  const bodyTextBreakpoints = useBreakpointValue({
    base: 'xs',
    md: 'md',
    lg: 'md',
    xl: 'md',
  })
  // const bodyTextBreakpoints = useBreakpointValue({
  //   xxxs: '10px', // Value for xxxs breakpoint and above
  //   xxs: '12px', // Value for xxs breakpoint and above
  //   xs: '14px', // Value for xs breakpoint and above
  //   sm: '16px', // Value for sm breakpoint and above
  //   md: '18px', // Value for md breakpoint and above
  //   lg: '20px', // Value for lg breakpoint and above
  //   xl: '22px', // Value for xl breakpoint and above
  //   '2xl': '24px', // Value for 2xl breakpoint and above
  // });
  return (
    <Layout>
      <Box
        my={4}
        alignContent="center"
        justifyContent="center"
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
      >
        <Text
          fontFamily="body"
          textAlign="center"
          whiteSpace="nowrap"
          fontSize={bodyTextBreakpoints}
        >
          At my window
          <br />
          Watching the sun go
          <br />
          Hoping the stars know
          <br />
          It&apos;s time to shine...
          <br />
          <br />
        </Text>
        <Text
          textAlign="center"
          fontStyle="italic"
          whiteSpace="nowrap"
          fontSize={bodyTextBreakpoints}
        >
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - Townes Van Zandt
        </Text>
      </Box>
    </Layout>
  )
}
