import { useState } from "react"
import { useAuthenticate } from "../Context"
import { Link, useHistory } from "react-router-dom"
import cloud from "./Images/happyman.jpg"
import {
  Box,
  Button,
  FormControl,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Image,
  Flex,
} from "@chakra-ui/react"
import { Eye, EyeOff, LogIn } from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuthenticate()
  const history = useHistory()
  const toast = useToast()

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      history.push("/")
    } catch (error) {
      let errorMessage = "Failed to log in"
      switch (error.message) {
        case "Invalid login credentials":
          errorMessage = "Invalid email or password"
          break
        case "Email not confirmed":
          errorMessage = "Please verify your email address"
          break
      }
      toast({
        title: "Error",
        description: errorMessage,
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
              Welcome!
            </Heading>
            <Text fontSize="lg" color="gray.600">
              We're Glad to see you
            </Text>
          </VStack>

          <FormControl id="email">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              size="lg"
              bg="whiteAlpha.800"
              border="1px solid"
              borderColor="gray.200"
              _hover={{ borderColor: "blue.400" }}
              _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
            />
          </FormControl>

          <FormControl id="password">
            <InputGroup size="lg">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Type a password"
                bg="whiteAlpha.800"
                border="1px solid"
                borderColor="gray.200"
                _hover={{ borderColor: "blue.400" }}
                _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
              />
              <InputRightElement>
                <IconButton
                  icon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  onClick={() => setShowPassword(!showPassword)}
                  variant="ghost"
                  color="gray.500"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button
            leftIcon={<LogIn size={18} />}
            size="lg"
            colorScheme="blue"
            isLoading={loading}
            onClick={handleLogin}
            width="full"
            bg="blue.500"
            color="white"
            _hover={{ bg: "blue.600" }}
          >
            Login
          </Button>

          <Text color="blue.600" fontSize="sm">
            <Link to="/forgot-password">Forgot Password?</Link>
          </Text>

          <Text color="gray.600" fontSize="sm">
            Need an account?{" "}
            <Link to="/signup" style={{ color: "blue" }}>
              Sign Up
            </Link>
          </Text>
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

