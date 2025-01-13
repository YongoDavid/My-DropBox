import React, { useState } from "react";
import { useAuthenticate } from "../Context";
import { Link, useHistory } from "react-router-dom";
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
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import cloud from './Images/happyman.jpg';
export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuthenticate();
  const history = useHistory();
  const toast = useToast();

  async function handleSignup(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast({
        title: "Error",
        description: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(true);
    try {
      await signup(email, password);
      history.push("/");
    } catch (error) {
      let errorMessage = "Failed to create account";
      switch (error.message) {
        case "User already registered":
          errorMessage = "An account with this email already exists";
          break;
        case "Password should be at least 6 characters":
          errorMessage = "Password must be at least 6 characters long";
          break;
        case "Unable to validate email address: invalid format":
          errorMessage = "Please enter a valid email address";
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
          <Heading color="blue.500">Sign Up</Heading>
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
          <FormControl id="confirm-password">
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                borderColor="blue.300"
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
            colorScheme="blue"
            isLoading={loading}
            onClick={handleSignup}
            width="full"
          >
            Sign Up
          </Button>
          <Text>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "blue" }}>
              Log In
            </Link>
          </Text>
        </VStack>
        <Box width={{ base: "100%", md: "50%" }} display={{ base: "none", md: "block" }}>
          <Image
            mx="20px"
            my="80px"
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

