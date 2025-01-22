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
  IconButton,
  ButtonGroup,
} from "@chakra-ui/react"
import { useCustomHook } from "../../CustomHook"
import AddFolderButton from "./Add_Folder"
import AddFileButton from "./Add_File"
import Folder from "./Folder"
import File from "./File"
import Navbar from "../Navbar"
import FolderBreadcrumbs from "./FolderBreadcrumbs"
import { useParams, useLocation } from "react-router-dom"
import { FolderPlus, Upload, ChevronDown, FileText, LayoutGrid, List } from "lucide-react"

function Home() {
  const { folderId } = useParams()
  const { state = {} } = useLocation()
  const { folder, childFolders, childFiles } = useCustomHook(folderId, state.folder)
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <Container maxW="container.xl" py={6}>
        <Flex direction="column" gap={6}>
          {/* Header Section */}
          <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
            <Flex
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align={{ base: "stretch", md: "center" }}
              gap={4}
            >
              <Box flex="1">
                <FolderBreadcrumbs currentFolder={folder} />
              </Box>
              <HStack spacing={3} justify={{ base: "stretch", md: "flex-end" }}>
                <Button
                  as="label"
                  htmlFor="file-upload"
                  leftIcon={<Upload size={18} />}
                  bg="gray.100"
                  color="gray.700"
                  _hover={{ bg: "gray.200" }}
                  width={{ base: "full", md: "auto" }}
                >
                  Upload
                </Button>
                <Menu>
                  <MenuButton
                    as={Button}
                    bg="gray.100"
                    color="gray.700"
                    _hover={{ bg: "gray.200" }}
                    rightIcon={<ChevronDown size={18} />}
                    width={{ base: "full", md: "auto" }}
                  >
                    Create
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
          </Box>

          {/* Content Section */}
          <Box bg="white" borderRadius="xl" boxShadow="sm" overflow="hidden">
            <Flex justify="space-between" align="center" p={4} borderBottom="1px" borderColor="gray.200">
              <Text fontSize="lg" fontWeight="medium">
                All files
              </Text>
              <ButtonGroup size="sm" isAttached variant="outline">
                <IconButton aria-label="List view" icon={<List size={18} />} />
                <IconButton aria-label="Grid view" icon={<LayoutGrid size={18} />} />
              </ButtonGroup>
            </Flex>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th width={{ base: "60%", md: "50%" }} fontSize="sm" color="gray.600">
                    Name
                  </Th>
                  <Th width="20%" display={{ base: "none", md: "table-cell" }} fontSize="sm" color="gray.600">
                    Modified
                  </Th>
                  <Th width="20%" display={{ base: "none", md: "table-cell" }} fontSize="sm" color="gray.600">
                    Who can access
                  </Th>
                  <Th width={{ base: "40%", md: "10%" }}></Th>
                </Tr>
              </Thead>
              <Tbody>
                {childFolders.length === 0 && childFiles.length === 0 ? (
                  <Tr>
                    <td colSpan={4}>
                      <Flex direction="column" align="center" justify="center" py={10} color="gray.500">
                        <FolderPlus size={48} strokeWidth={1} />
                        <Text mt={4}>This folder is empty</Text>
                        <Button size="sm" colorScheme="blue" variant="link" onClick={onOpen} mt={2}>
                          Create a new folder
                        </Button>
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

          {/* Hidden file input */}
          <input type="file" id="file-upload" style={{ display: "none" }} multiple />
        </Flex>
      </Container>
      <AddFolderButton currentFolder={folder} isOpen={isOpen} onClose={onClose} />
    </Box>
  )
}

export default Home

