import { useState } from "react"
import {
  Box,
  VStack,
  Heading,
  FormControl,
  Input,
  Button,
  useToast,
  Text,
  InputGroup,
  InputRightElement,
  IconButton,
  Flex,
  Image,
} from "@chakra-ui/react"
import { useAuthenticate } from "../Context"
import { Link, useHistory } from "react-router-dom"
import { Mail, Eye, EyeOff, Save, X } from "lucide-react"
import cloud from "./Images/happyman.jpg"

export default function UpdateProfile() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const { currentUser, updatePassword, updateEmail } = useAuthenticate()
  const toast = useToast()
  const history = useHistory()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== passwordConfirm) {
      return toast({
        title: "Error",
        description: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }

    const promises = []
    setLoading(true)

    if (email !== currentUser.email) {
      promises.push(updateEmail(email))
    }
    if (password) {
      promises.push(updatePassword(password))
    }

    Promise.all(promises)
      .then(() => {
        toast({
          title: "Success",
          description: "Profile updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
        history.push("/user")
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to update account",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      })
      .finally(() => {
        setLoading(false)
      })
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
              Update Profile
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Modify your account details
            </Text>
          </VStack>

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <VStack spacing={4} align="stretch">
              <FormControl id="email">
                <InputGroup size="lg">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={currentUser.email || "Email Address"}
                    bg="whiteAlpha.800"
                    border="1px solid"
                    borderColor="gray.200"
                    _hover={{ borderColor: "blue.400" }}
                    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                  />
                  <InputRightElement children={<Mail size={18} color="gray.400" />} />
                </InputGroup>
              </FormControl>
              <FormControl id="password">
                <InputGroup size="lg">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New Password"
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
              <FormControl id="password-confirm">
                <InputGroup size="lg">
                  <Input
                    type={showPasswordConfirm ? "text" : "password"}
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="Confirm New Password"
                    bg="whiteAlpha.800"
                    border="1px solid"
                    borderColor="gray.200"
                    _hover={{ borderColor: "blue.400" }}
                    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                  />
                  <InputRightElement>
                    <IconButton
                      icon={showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                      variant="ghost"
                      color="gray.500"
                      aria-label={showPasswordConfirm ? "Hide password" : "Show password"}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Button
                type="submit"
                leftIcon={<Save size={18} />}
                size="lg"
                colorScheme="blue"
                isLoading={loading}
                loadingText="Updating"
                width="full"
                bg="blue.500"
                color="white"
                _hover={{ bg: "blue.600" }}
              >
                Update Profile
              </Button>
            </VStack>
          </form>
          <Button
            as={Link}
            to="/user"
            leftIcon={<X size={18} />}
            size="lg"
            variant="outline"
            colorScheme="gray"
            width="full"
          >
            Cancel
          </Button>
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

