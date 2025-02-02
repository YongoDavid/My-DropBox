import { useState } from "react"
import { useAuthenticate } from "../Context"
import { Link, useHistory } from "react-router-dom"
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
import { Eye, EyeOff, UserPlus } from "lucide-react"
import cloud from "./Images/happyman.jpg"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signup } = useAuthenticate()
  const history = useHistory()
  const toast = useToast()

  async function handleSignup(e) {
    e.preventDefault()
    if (password !== confirmPassword) {
      return toast({
        title: "Error",
        description: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
    setLoading(true)
    try {
      await signup(email, password)
      history.push("/")
    } catch (error) {
      let errorMessage = "Failed to create account"
      switch (error.message) {
        case "User already registered":
          errorMessage = "An account with this email already exists"
          break
        case "Password should be at least 6 characters":
          errorMessage = "Password must be at least 6 characters long"
          break
        case "Unable to validate email address: invalid format":
          errorMessage = "Please enter a valid email address"
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
              Create Account
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Join us today!
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
                placeholder="Password"
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

          <FormControl id="confirm-password">
            <InputGroup size="lg">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                bg="whiteAlpha.800"
                border="1px solid"
                borderColor="gray.200"
                _hover={{ borderColor: "blue.400" }}
                _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
              />
              <InputRightElement>
                <IconButton
                  icon={showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  variant="ghost"
                  color="gray.500"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button
            leftIcon={<UserPlus size={18} />}
            size="lg"
            colorScheme="blue"
            isLoading={loading}
            onClick={handleSignup}
            width="full"
            bg="blue.500"
            color="white"
            _hover={{ bg: "blue.600" }}
          >
            Sign Up
          </Button>

          <Text color="gray.600" fontSize="sm">
            Already have an account?{" "}
            <Link to="/login" style={{ color: "blue" }}>
              Log In
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

