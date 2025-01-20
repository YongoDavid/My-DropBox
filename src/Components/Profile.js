import React, { useState, useEffect } from "react"
import { Box, VStack, Heading, Text, Button, useToast, Avatar, Divider } from "@chakra-ui/react"
import { useAuthenticate } from "../Context"
import { Link, useHistory } from "react-router-dom"
import { User, Mail, LogOut, Edit } from "lucide-react"

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
  }, [currentUser])

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
    <Box minH="100vh" bg="gray.50" py={10}>
      <VStack spacing={6} mx="auto" maxW="400px" bg="white" p={8} borderRadius="xl" boxShadow="md">
        <Heading size="lg" color="blue.500">
          My Profile
        </Heading>
        <Avatar size="xl" name={currentUser.email} src={currentUser.photoURL} />
        <VStack spacing={4} align="stretch" w="100%">
          <Box>
            <Text fontWeight="bold" fontSize="sm" color="gray.500" mb={1}>
              <User size={16} style={{ display: "inline", marginRight: "8px" }} />
              Name
            </Text>
            <Text fontSize="md">{currentUser.displayName || "Not set"}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold" fontSize="sm" color="gray.500" mb={1}>
              <Mail size={16} style={{ display: "inline", marginRight: "8px" }} />
              Email
            </Text>
            <Text fontSize="md">{currentUser.email}</Text>
          </Box>
        </VStack>
        <Divider />
        <Button as={Link} to="/update-profile" colorScheme="blue" leftIcon={<Edit size={18} />} w="100%">
          Update Profile
        </Button>
        <Button onClick={handleLogout} colorScheme="red" variant="outline" leftIcon={<LogOut size={18} />} w="100%">
          Log Out
        </Button>
      </VStack>
    </Box>
  )
}