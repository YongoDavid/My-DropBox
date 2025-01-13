import React, { useState } from "react";
import { useAuthenticate } from "../Context";
import { Link, useHistory } from "react-router-dom";
import cloud from './Images/happyman.jpg';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthenticate();
  const history = useHistory();
  const toast = useToast();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      history.push("/");
    } catch (error) {
      let errorMessage = "Failed to log in";
      switch (error.message) {
        case "Invalid login credentials":
          errorMessage = "Invalid email or password";
          break;
        case "Email not confirmed":
          errorMessage = "Please verify your email address";
          break;
      }
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bg="blue.50"
    >
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="xl"
        width={{ base: "90%", sm: "400px", md: "900px" }}
        display={{ md: "flex" }}
      >
        <VStack spacing={6} width={{ base: "100%", md: "50%" }}>
          <Heading color="blue.500">Log In</Heading>
          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              borderColor="blue.300"
              _hover={{ borderColor: "blue.400" }}
              _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                borderColor="blue.300"
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
            colorScheme="blue"
            isLoading={loading}
            onClick={handleLogin}
            width="full"
          >
            Log In
          </Button>
          <Text color="blue.600">
            <Link to="/forgot-password">Forgot Password?</Link>
          </Text>
          <Text>
            Need an account?{" "}
            <Link to="/signup" style={{ color: "blue" }}>
              Sign Up
            </Link>
          </Text>
        </VStack>
        <Box width={{ base: "100%", md: "50%" }} display={{ base: "none", md: "block" }}>
          <Image
            mx="20px"
            my="40px"
            src={cloud}
            alt="Cloud Storage Illustration"
            objectFit="cover"
            borderRadius="xl"
          />
        </Box>
      </Box>
    </Box>
  );
}

