import * as React from 'react'
import { Button, Box, Input, Text, useToast } from '@chakra-ui/react'
import { FormControl, VStack, FormErrorMessage } from '@chakra-ui/react'
import { Formik, Field } from 'formik'

const SubscribeBox = () => {
  const toast = useToast()

  return (
    <Box mt={3} display="flex" flexDirection="column" alignItems="center">
      <Box bg="white" p={6} rounded="md" w={64}>
        <Formik
          initialValues={{
            email: '',
          }}
          onSubmit={async (values, { setSubmitting, setStatus }) => {
            // Clear previous status
            setStatus(null)

            try {
              const res = await fetch('/api/subscribe', {
                body: JSON.stringify({
                  email: values.email,
                }),
                headers: {
                  'Content-Type': 'application/json',
                },
                method: 'POST',
              })

              const data = await res.json()

              if (data.error) {
                setStatus({ error: data.error })
                return
              }

              setStatus({ success: true })

              values.email = ''
              toast({
                title: 'Success!',
                description: 'You are now subscribed! 🎉',
                status: 'success',
                duration: 3000,
                isClosable: true,
              })
            } catch (error) {
              setStatus({
                error: 'An unexpected error occurred. Please try again later.',
              })
            } finally {
              setSubmitting(false)
            }
          }}
        >
          {({ handleSubmit, errors, touched, status, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="flex-start">
                <Text fontSize="xl" fontWeight="bold" mb="2">
                  Subscribe
                </Text>
                <FormControl isInvalid={!!errors.email && touched.email}>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Your email address..."
                    variant="filled"
                    validate={(value) => {
                      let error

                      if (value == '') {
                        error = 'Email is required'
                      } else if (!/\S+@\S+\.\S+/.test(value)) {
                        error = 'Please enter a valid email address'
                      }

                      return error
                    }}
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
                {status && status.error && (
                  <Text color="red.500" fontSize="sm" mt={2}>
                    {status.error}
                  </Text>
                )}
                <Button
                  type="submit"
                  colorScheme="teal"
                  width="full"
                  bg="black"
                  color="white"
                  isLoading={isSubmitting}
                >
                  Sign Up
                </Button>
              </VStack>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  )
}

export default SubscribeBox
