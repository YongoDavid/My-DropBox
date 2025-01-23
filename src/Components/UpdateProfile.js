import React, { useState } from "react"
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Text,
  InputGroup,
  InputRightElement,
  IconButton,
  Container,
  useBreakpointValue,
} from "@chakra-ui/react"
import { useAuthenticate } from "../Context"
import { Link, useHistory } from "react-router-dom"
import { Mail, Key, Eye, EyeOff, Save, X } from "lucide-react"

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
  const containerWidth = useBreakpointValue({ base: "100%", md: "400px" })

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
    <Box minH="100vh" bg="gray.50" py={10}alignItems="center" justifyContent="center" >
      <Container maxW={containerWidth} p={{ base: 4, md: 8 }}>
        <VStack spacing={6} mx="auto" maxW="400px" bg="white" p={8} borderRadius="xl" boxShadow="md">
          <Heading size="lg" color="blue.500">
            Update Profile
          </Heading>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <VStack spacing={4} align="stretch">
              <FormControl id="email">
                <FormLabel>Email</FormLabel>
                <InputGroup>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={currentUser.email}
                  />
                  <InputRightElement children={<Mail size={18} color="gray.300" />} />
                </InputGroup>
              </FormControl>
              <FormControl id="password">
                <FormLabel>New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep the same"
                  />
                  <InputRightElement>
                    <IconButton
                      icon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl id="password-confirm">
                <FormLabel>Confirm New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPasswordConfirm ? "text" : "password"}
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="Leave blank to keep the same"
                  />
                  <InputRightElement>
                    <IconButton
                      icon={showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                      variant="ghost"
                      aria-label={showPasswordConfirm ? "Hide password" : "Show password"}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={loading}
                loadingText="Updating"
                leftIcon={<Save size={18} />}
              >
                Update
              </Button>
            </VStack>
          </form>
          <Button as={Link} to="/user" variant="outline" colorScheme="gray" leftIcon={<X size={18} />} w="100%">
            Cancel
          </Button>
        </VStack>
      </Container>
    </Box>
  )
}

