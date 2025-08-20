import {
  Image,
  Link,
  Text,
  Box,
  VStack,
  HStack,
  Grid,
  GridItem,
} from '@chakra-ui/react'
import Layout from '../components/layout'

export default function About() {
  return (
    <Layout>
      <Text fontSize="2xl" fontWeight="bold" pb="1rem">
        About
      </Text>
      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
        gap={5}
      >
        <GridItem>
          <VStack spacing={4}>
            <Text>
              Welcome to Irregular-Expressions.com!&nbsp;&nbsp; I&apos;m{' '}
              <strong>Julius Hecht</strong>.&nbsp;&nbsp; My website is a
              necessary extravagance.&nbsp;&nbsp;I made it so I can publish my
              poetry and other stuff I feel like creating.&nbsp;&nbsp; Now,
              please excuse me while I express myself.
              {` `}
            </Text>
            <HStack spacing={6}>
              <Link href="https://github.com/samjhecht">
                <Image
                  w="40px"
                  h="40px"
                  src="/static/images/github_icon_128.png"
                  alt="Github logo"
                  loading="eager"
                />
              </Link>
              <Link href="https://instagram.com/juliushecht">
                <Image
                  w="40px"
                  h="40px"
                  src="/static/images/instagram_logo_128.png"
                  alt="Instagram logo"
                  loading="eager"
                />
              </Link>
              <Link href="https://linkedin.com/in/sam-hecht-4ab65713/">
                <Image
                  w="40px"
                  h="40px"
                  src="/static/images/linkedin_logo_128.png"
                  alt="LinkedIn logo"
                  loading="eager"
                />
              </Link>
            </HStack>
          </VStack>
        </GridItem>
        <GridItem display="flex" alignItems="center" justifyContent="center">
          <Box
            as="img"
            src="/static/images/with_david_800_915.jpg"
            minWidth="200px"
            maxWidth="100%"
            maxHeight="400px"
            borderRadius="100%"
            alt="Julius Hecht"
            loading="eager"
          />
        </GridItem>
      </Grid>
    </Layout>
  )
}
