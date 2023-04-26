import { Text, Box } from '@chakra-ui/react';
import Layout from '../components/layout';

export default function Home() {
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
        <Text fontFamily="body" textAlign="center" whiteSpace="nowrap">
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
        <Text textAlign="center" fontStyle="italic" whiteSpace="nowrap">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - Townes Van Zandt
        </Text>
      </Box>
    </Layout>
  );
}
