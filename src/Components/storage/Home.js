import React from "react";
import {
  Box,
  Container,
  Flex,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Text,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useCustomHook } from "../../CustomHook";
import AddFolderButton from "./Add_Folder";
import AddFileButton from "./Add_File";
import Folder from "./Folder";
import File from "./File";
import Navbar from "../Navbar";
import FolderBreadcrumbs from "./FolderBreadcrumbs";
import { useParams, useLocation } from "react-router-dom";
import { FolderPlus, Upload, ChevronDown, Star } from 'lucide-react';

function Home() {
  const { folderId } = useParams();
  const { state = {} } = useLocation();
  const { folder, childFolders, childFiles } = useCustomHook(
    folderId,
    state.folder
  );

  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <Container maxW="container.xl" py={6}>
        <Flex direction="column" gap={6}>
          {/* Header Section */}
          <Flex justify="space-between" align="center" mb={4}>
            <HStack spacing={4}>
              <FolderBreadcrumbs currentFolder={folder} />
            </HStack>
            <HStack spacing={3}>
              <Button
                leftIcon={<Upload size={18} />}
                colorScheme="blue"
                size="md"
                onClick={() => document.getElementById('file-upload').click()}
              >
                Upload
              </Button>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDown size={18} />}
                  leftIcon={<FolderPlus size={18} />}
                  variant="outline"
                >
                  Create New
                </MenuButton>
                <MenuList>
                  <MenuItem>
                    <AddFolderButton currentFolder={folder} />
                  </MenuItem>
                  <MenuItem>
                    <AddFileButton currentFolder={folder} />
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>

          {/* Content Section */}
          <Box bg="white" borderRadius="xl" boxShadow="sm" overflow="hidden">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th width="50%">Name</Th>
                  <Th width="20%">Modified</Th>
                  <Th width="20%">Who can access</Th>
                  <Th width="10%"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {childFolders.length === 0 && childFiles.length === 0 ? (
                  <Tr>
                    <td colSpan={4}>
                      <Flex 
                        direction="column" 
                        align="center" 
                        justify="center" 
                        py={10}
                        color="gray.500"
                      >
                        <FolderPlus size={48} strokeWidth={1} />
                        <Text mt={4}>This folder is empty</Text>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          variant="link"
                          onClick={() => document.getElementById('file-upload').click()}
                          mt={2}
                        >
                          Upload files
                        </Button>
                      </Flex>
                    </td>
                  </Tr>
                ) : (
                  <>
                    {childFolders.map(childFolder => (
                      <Tr key={childFolder.id}>
                        <Folder folder={childFolder} />
                      </Tr>
                    ))}
                    {childFiles.map(childFile => (
                      <Tr key={childFile.id}>
                        <File file={childFile} />
                      </Tr>
                    ))}
                  </>
                )}
              </Tbody>
            </Table>
          </Box>

          {/* Hidden file input for upload functionality */}
          <input
            type="file"
            id="file-upload"
            style={{ display: 'none' }}
            multiple
          />
        </Flex>
      </Container>
    </Box>
  );
}

export default Home;

