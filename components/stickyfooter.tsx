import { Box, Text, Container } from '@chakra-ui/react'

const StickyFooter: React.FC = () => {
  return (
    <>
      <Box
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
        }}
      >
        <Container maxWidth="sm">
          <Text
            color="text.primary"
            fontFamily={'body'}
            sx={{ fontSize: '0.92rem', whiteSpace: 'nowrap' }}
          >
            {` `}
            Copyright © {new Date().getFullYear()}, Julius Hecht.
          </Text>
        </Container>
      </Box>
    </>
  )
}

export default StickyFooter
