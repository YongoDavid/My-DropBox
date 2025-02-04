import { useState } from "react"
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  FormControl,
  Input,
  useToast,
  Flex,
  Image,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react"
import { useAuthenticate } from "../Context"
import { Link } from "react-router-dom"
import { Mail, ArrowRight } from "lucide-react"
import cloud from "./Images/happyman.jpg"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const { resetPassword } = useAuthenticate()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  async function handlePasswordReset(e) {
    e.preventDefault()
    try {
      setError("")
      setLoading(true)
      await resetPassword(email)
      toast({
        title: "Password Reset Email Sent",
        description: "Check your inbox for further instructions",
        status: "success",
        duration: 5000,
        isClosable: true,
      })
    } catch {
      setError("Failed to reset password")
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
    setLoading(false)
  }

  return (
    <Flex
      minHeight="100vh"
      width="100%"
      bgGradient="linear(to-b, blue.300, purple.400)"
      alignItems="center"
      justifyContent="center"
    >
      <Flex direction={{ base: "column", md: "row" }} width="100%" height="100vh" overflow="hidden">
        <VStack
          spacing={{ base: 4, md: 6 }}
          width={{ base: "100%", md: "50%" }}
          height="100%"
          bg="white"
          justifyContent="center"
          p={{ base: 6, md: 8 }}
        >
          <VStack spacing={2} align="center" width="100%">
            <Heading fontSize={{ base: "3xl", md: "4xl" }} color="gray.800">
              Password Reset
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Enter your email to reset your password
            </Text>
          </VStack>

          <form onSubmit={handlePasswordReset} style={{ width: "100%" }}>
            <VStack spacing={4} align="stretch">
              <FormControl id="email">
                <InputGroup size="lg">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    bg="whiteAlpha.800"
                    border="1px solid"
                    borderColor="gray.200"
                    _hover={{ borderColor: "blue.400" }}
                    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                  />
                  <InputRightElement children={<Mail size={18} color="gray.400" />} />
                </InputGroup>
              </FormControl>
              <Button
                type="submit"
                size="lg"
                colorScheme="blue"
                isLoading={loading}
                loadingText="Sending"
                width="full"
                bg="blue.500"
                color="white"
                _hover={{ bg: "blue.600" }}
                rightIcon={<ArrowRight size={18} />}
              >
                Reset Password
              </Button>
            </VStack>
          </form>

          {error && (
            <Text color="red.500" fontSize="sm" textAlign="center">
              {error}
            </Text>
          )}

          <VStack spacing={2} width="100%">
            <Text color="gray.600" fontSize="sm">
              Remember your password?{" "}
              <Link to="/login" style={{ color: "blue" }}>
                Login
              </Link>
            </Text>
            <Text color="gray.600" fontSize="sm">
              Need an account?{" "}
              <Link to="/signup" style={{ color: "blue" }}>
                Sign Up
              </Link>
            </Text>
          </VStack>
        </VStack>

        <Box
          width={{ base: "100%", md: "50%" }}
          height="100%"
          display={{ base: "none", md: "block" }}
          overflow="hidden"
        >
          <Image
            src={cloud || "/placeholder.svg"}
            alt="Cloud Storage Illustration"
            objectFit="cover"
            width="100%"
            height="100%"
          />
        </Box>
      </Flex>
    </Flex>
  )
}

