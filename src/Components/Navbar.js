import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Flex,
  Button,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { LogOut, User, UserPen  } from 'lucide-react';
import { useAuthenticate } from "../Context";

export default function NavbarComponent() {
  const { logout } = useAuthenticate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Box bg="white" px={6} py={4} borderBottom="1px" borderColor="gray.200">
      <Flex alignItems="center" justifyContent="space-between">
        <Link to="/">
          <Flex alignItems="center" gap={2}>
            <Image
              src="https://www.dropbox.com/static/30168/images/favicon.ico"
              alt="Dropbox"
              h="24px"
            />
            <Box fontSize="xl" fontWeight="bold" color="blue.500">
              My Dropbox
            </Box>
          </Flex>
        </Link>

        <Flex alignItems="center" gap={4}>
          <Menu>
            <MenuButton
              as={Button}
              leftIcon={<User size={18} />}
              variant="ghost"
              colorScheme="blue"
            >
              Profile
            </MenuButton>
            <MenuList>
              <MenuItem
              as={Link}
              to="/user"
              icon={<UserPen size={18} />}
              >
                Update Profile
              </MenuItem>
              <MenuItem 
                onClick={handleLogout} 
                icon={<LogOut size={18} />} 
                color="red.500"
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
}

