import { useState, useEffect } from "react"
import { Box, VStack, Heading, Text, Button, useToast, Avatar, Badge, Flex, Image } from "@chakra-ui/react"
import { useAuthenticate } from "../Context"
import { Link, useHistory } from "react-router-dom"
import { LogOut, Edit, User } from "lucide-react"
import cloud from "./Images/happyman.jpg"

export default function Profile() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuthenticate()
  const toast = useToast()
  const history = useHistory()

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // Example: If needed to check current user status
        // await fetchUserData(currentUser.id);
      } catch (err) {
        setError("Failed to fetch user data.")
      }
    }

    checkUserStatus()
  }, []) // Removed unnecessary dependency: currentUser

  const handleLogout = async () => {
    try {
      await logout()
      history.push("/login")
    } catch (err) {
      setError("Failed to log out. Please try again.")
      toast({
        title: "Logout Error",
        description: "Failed to log out. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
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
          spacing={{ base: 6, md: 8 }}
          width={{ base: "100%", md: "50%" }}
          height="100%"
          bg="white"
          justifyContent="center"
          p={{ base: 6, md: 8 }}
        >
          <VStack spacing={4} align="center" width="100%">
            <Box position="relative">
              <Avatar
                size={{ base: "xl", md: "2xl" }}
                name={currentUser.email}
                src={currentUser.photoURL}
                icon={<User size={64} />}
                bg="blue.500"
                color="white"
              />
              <Badge
                position="absolute"
                bottom={0}
                right={0}
                colorScheme="green"
                borderRadius="full"
                px={3}
                py={1}
                boxShadow="sm"
              >
                Active
              </Badge>
            </Box>
            <VStack spacing={1}>
              <Heading size="lg" color="gray.800">
                {currentUser.displayName || "User"}
              </Heading>
              <Text color="gray.500" fontSize="md">
                {currentUser.email}
              </Text>
            </VStack>
          </VStack>

          <VStack spacing={4} width="100%">
            <Button
              as={Link}
              to="/update-profile"
              leftIcon={<Edit size={18} />}
              size="lg"
              colorScheme="blue"
              width="full"
            >
              Edit Profile
            </Button>
            <Button
              onClick={handleLogout}
              leftIcon={<LogOut size={18} />}
              size="lg"
              colorScheme="red"
              variant="outline"
              width="full"
            >
              Log Out
            </Button>
          </VStack>

          {error && (
            <Text color="red.500" fontSize="sm" textAlign="center">
              {error}
            </Text>
          )}
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

