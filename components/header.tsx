import { useRouter } from 'next/router'
import { Text, Flex, HStack, Link } from '@chakra-ui/react'

const Header: React.FC = () => {
  const router = useRouter()
  const pathname = router.pathname
  const pathnameArray = pathname.split('/')
  const page = pathnameArray[1]

  return (
    <>
      <Flex
        direction="column"
        mb={14}
        alignItems="center"
        justifyContent="flex-start"
        alignContent="center"
        minW="100%"
      >
        <Link
          href="/"
          color="black"
          textDecoration="none"
          _hover={{ textDecoration: 'none' }}
        >
          <Text
            fontSize="4xl"
            fontFamily={'Vulf Sans Bold'}
            mb="1rem"
            whiteSpace="nowrap"
            ml="1rem"
          >
            Irregular Expressions
          </Text>
        </Link>

        <HStack spacing={6} justifyContent="center" alignItems="center">
          <Text
            fontSize="2xl"
            fontFamily={page === 'poetry' ? 'Vulf Sans Bold Italic' : 'body'}
          >
            <Link
              href="/poetry"
              color="black"
              textDecoration="none"
              _hover={{ textDecoration: 'none' }}
            >
              Poetry
            </Link>
          </Text>
          <Text
            fontSize="2xl"
            fontFamily={page === 'essays' ? 'Vulf Sans Bold Italic' : 'body'}
          >
            <Link
              href="/essays"
              color="black"
              textDecoration="none"
              _hover={{ textDecoration: 'none' }}
            >
              Essays
            </Link>
          </Text>
          <Text
            fontSize="2xl"
            fontFamily={page === 'about' ? 'Vulf Sans Bold Italic' : 'body'}
          >
            <Link
              href="/about"
              color="black"
              textDecoration="none"
              _hover={{ textDecoration: 'none' }}
            >
              About
            </Link>
          </Text>
        </HStack>
      </Flex>
    </>
  )
}

export default Header
