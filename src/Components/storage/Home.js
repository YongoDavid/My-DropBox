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
  useDisclosure,
} from "@chakra-ui/react";
import { useCustomHook } from "../../CustomHook";
import AddFolderButton from "./Add_Folder";
import AddFileButton from "./Add_File";
import Folder from "./Folder";
import File from "./File";
import Navbar from "../Navbar";
import FolderBreadcrumbs from "./FolderBreadcrumbs";
import { useParams, useLocation } from "react-router-dom";
import { FolderPlus, Upload, ChevronDown, FileText } from 'lucide-react';

function Home() {
  const { folderId } = useParams();
  const { state = {} } = useLocation();
  const { folder, childFolders, childFiles } = useCustomHook(
    folderId,
    state.folder
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

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
              {/* CREATE FILE / FOLDER SETUP  */}
              <Menu>
                <MenuButton
                  as={Button}
                  colorScheme="blue"
                  rightIcon={<ChevronDown size={18} />}
                  leftIcon={<Upload size={18} />}
                >
                  New
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<FolderPlus size={18} />} onClick={onOpen}>
                    New Folder
                  </MenuItem>
                  <MenuItem icon={<FileText size={18} />} as="label" htmlFor="file-upload">
                    Upload File
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>

          {/* Add the AddFileButton component here */}
          <AddFileButton currentFolder={folder} />

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
                          onClick={onOpen}
                          mt={2}
                        >
                          Create a new folder
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
      <AddFolderButton currentFolder={folder} isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}

export default Home;

