import React, { useState, useEffect } from "react"
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  useToast,
  Avatar,
  Divider,
  Container,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  HStack,
  Badge,
  Flex,
  Icon,
} from "@chakra-ui/react"
import { useAuthenticate } from "../Context"
import { Link, useHistory } from "react-router-dom"
import { User, Mail, LogOut, Edit, Shield, Calendar } from "lucide-react"

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

  const joinDate = new Date(currentUser?.metadata?.creationTime).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Box minH="100vh" bg="gray.50" py={10}>
      <Container spacing={6} mx="auto" maxW="400px" p={8}>
        <Grid templateColumns={{ base: "1fr", lg: "300px 1fr" }} gap={6}>
          {/* Left Column - Profile Overview */}
          <GridItem>
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
                  <Button
                    as={Link}
                    to="/update-profile"
                    colorScheme="blue"
                    leftIcon={<Edit size={18} />}
                    size="sm"
                    width="full"
                  >
                    Edit Profile
                  </Button>
                  <Flex gap={4} direction={{ base: "column", sm: "column" }} align={{ base: "stretch", sm: "center" }}>
                    <Button
                      as={Link}
                      to="/update-profile"
                      colorScheme="blue"
                      leftIcon={<Edit size={18} />}
                      flex={{ base: "1", sm: "initial" }}
                    >
                      Update Profile
                    </Button>
                    <Button
                      onClick={handleLogout}
                      colorScheme="red"
                      variant="outline"
                      leftIcon={<LogOut size={18} />}
                      flex={{ base: "1", sm: "initial" }}
                    >
                      Log Out
                    </Button>
                  </Flex>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  )
}