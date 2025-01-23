import React, { useState, useEffect } from "react"
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  useToast,
  Avatar,
  Container,
  Card,
  CardBody,
  Badge,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react"
import { useAuthenticate } from "../Context"
import { Link, useHistory } from "react-router-dom"
import { LogOut, Edit } from "lucide-react"

export default function Profile() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuthenticate()
  const toast = useToast()
  const history = useHistory()

  const containerWidth = useBreakpointValue({ base: "100%", md: "400px" })

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
    <Box minH="100vh" bg="gray.50" py={10} display="flex" alignItems="center" justifyContent="center">
      <Container maxW={containerWidth} p={{ base: 4, md: 8 }}>
        <Card borderRadius="xl" boxShadow="md" bg="white">
          <CardBody>
            <VStack spacing={6} align="center">
              <Box position="relative">
                <Avatar
                  size={{ base: "xl", md: "2xl" }}
                  name={currentUser.email}
                  src={currentUser.photoURL}
                  borderWidth={4}
                  borderColor="white"
                  boxShadow="lg"
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
                <Heading size="md">{currentUser.displayName || "User"}</Heading>
                <Text color="gray.500" fontSize="sm">
                  {currentUser.email}
                </Text>
              </VStack>
              <Flex direction="column" width="100%" gap={4}>
                <Button
                  as={Link}
                  to="/update-profile"
                  colorScheme="blue"
                  leftIcon={<Edit size={18} />}
                  size="md"
                  width="100%"
                >
                  Edit Profile
                </Button>
                <Button
                  as={Link}
                  to="/update-profile"
                  colorScheme="blue"
                  leftIcon={<Edit size={18} />}
                  size="md"
                  width="100%"
                >
                  Update Profile
                </Button>
                <Button
                  onClick={handleLogout}
                  colorScheme="red"
                  variant="outline"
                  leftIcon={<LogOut size={18} />}
                  size="md"
                  width="100%"
                >
                  Log Out
                </Button>
              </Flex>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  )
}

