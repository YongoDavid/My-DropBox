import React from "react"
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
  ButtonGroup,
  IconButton,
  VStack,
} from "@chakra-ui/react"
import { useCustomHook } from "../../CustomHook"
import AddFolderButton from "./Add_Folder"
import AddFileButton from "./Add_File"
import Folder from "./Folder"
import File from "./File"
import Navbar from "../Navbar"
import FolderBreadcrumbs from "./FolderBreadcrumbs"
import { useParams, useLocation } from "react-router-dom"
import { FolderPlus, Upload, FolderGit2, ChevronDown, FileText, LayoutGrid, List } from "lucide-react"

function Home() {
  const { folderId } = useParams()
  const { state = {} } = useLocation()
  const { folder, childFolders, childFiles } = useCustomHook(folderId, state.folder)
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box minH="100vh" bg="gray.50" w="100%">
      <Navbar />
      <Container maxW="100%" px={{ base: 2, md: 6 }} pt={6}>
        <Flex direction="column" gap={6}>
          {/* Header Section */}
          <Box bg="white" p={3} borderRadius="md" boxShadow="sm" width="100%">
            <VStack spacing={4} align="stretch">
              <Flex gap={2} >
                <FolderGit2 size={20} />
                <Box flex="1" overflow="hidden">
                  <FolderBreadcrumbs currentFolder={folder} />
                </Box>
              </Flex>
              <HStack spacing={3} justify="space-between" width="100%">
                <AddFileButton currentFolder={folder} />
                <Menu>
                  <MenuButton as={Button} colorScheme="blue" rightIcon={<ChevronDown size={18} />} maxw="100%">
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
            </VStack>
          </Box>

          {/* Content Section */}
          <Box bg="white" borderRadius="md" boxShadow="sm" overflow="hidden" width="100%">
            <Flex justify="space-between" align="center" p={4} borderBottom="1px" borderColor="gray.200">
              <Text fontSize="lg" fontWeight="medium">
                All files
              </Text>
              <ButtonGroup size="sm" isAttached variant="outline">
                <IconButton aria-label="List view" icon={<List size={18} />} />
                <IconButton aria-label="Grid view" icon={<LayoutGrid size={18} />} />
              </ButtonGroup>
            </Flex>
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th width="60%" fontSize="sm" color="gray.600">
                      Name
                    </Th>
                    <Th width="20%" display={{ base: "none", md: "table-cell" }} fontSize="sm" color="gray.600">
                      Modified
                    </Th>
                    <Th width="20%" display={{ base: "none", md: "table-cell" }} fontSize="sm" color="gray.600">
                      Who can access
                    </Th>
                    <Th width="40%"></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {childFolders.length === 0 && childFiles.length === 0 ? (
                    <Tr>
                      <td colSpan={4}>
                        <Flex direction="column" align="center" justify="center" py={10} color="gray.500">
                          <FolderPlus size={48} strokeWidth={1} />
                          <Text mt={4}>This folder is empty</Text>
                        </Flex>
                      </td>
                    </Tr>
                  ) : (
                    <>
                      {childFolders.map((childFolder) => (
                        <Tr key={childFolder.id}>
                          <Folder folder={childFolder} />
                        </Tr>
                      ))}
                      {childFiles.map((childFile) => (
                        <Tr key={childFile.id}>
                          <File file={childFile} />
                        </Tr>
                      ))}
                    </>
                  )}
                </Tbody>
              </Table>
            </Box>
          </Box>

          {/* Hidden file input for upload functionality */}
          <input type="file" id="file-upload" style={{ display: "none" }} multiple />
        </Flex>
      </Container>
      <AddFolderButton currentFolder={folder} isOpen={isOpen} onClose={onClose} />
    </Box>
  )
}

export default Home

