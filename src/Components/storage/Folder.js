import React from "react"
import { Link } from "react-router-dom"
import { Td, IconButton, HStack, Text, useToast, Flex, Box } from "@chakra-ui/react"
import { FolderIcon, Trash2, MoreVertical } from "lucide-react"
import Swal from "sweetalert2"
import { supabase } from "../../supabaseConfig"

export default function Folder({ folder }) {
  const toast = useToast()

  const handleDelete = async (e) => {
    e.preventDefault()

    const result = await Swal.fire({
      title: `Delete "${folder.name}"?`,
      text: "Once deleted, you will not be able to recover this folder!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      borderRadius: "10px",
    })

    if (result.isConfirmed) {
      try {
        const { error } = await supabase.from("folders").delete().match({ id: folder.id })

        if (error) throw error

        toast({
          title: "Folder deleted",
          description: "Folder has been successfully deleted",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      } catch (error) {
        console.error("Error deleting folder: ", error)
        toast({
          title: "Error",
          description: "Failed to delete folder",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      }
    }
  }

  return (
    <>
      <Td>
        <Flex
          direction={{ base: "row", md: "row" }}
          align={{ base: "center", md: "center" }}
          justify="space-between"
        >
          <HStack spacing={3} flex="1">
            <Flex marginTop={4} gap={2}>
              <FolderIcon size={20} color="#68A1F8" />
              <Link
                to={{
                  pathname: `/folder/${folder.id}`,
                  state: { folder: folder },
                }}
                style={{ textDecoration: "none" }}
              >
                <Text _hover={{ color: "blue.500" }}  isTruncated maxWidth={{ base: "150px", md: "300px", lg: "400px" }}>
                  {folder.name}
                </Text>
              </Link>
            </Flex>
          </HStack>
          <Box>
            <HStack spacing={1}>
              <IconButton
                icon={<Trash2 size={18} />}
                variant="ghost"
                size="sm"
                aria-label="Delete folder"
                onClick={handleDelete}
                _hover={{ color: "red.500" }}
              />
              <IconButton
                icon={<MoreVertical size={18} />}
                variant="ghost"
                size="sm"
                aria-label="More options"
                display={{ base: "inline-flex", md: "none" }}
              />
            </HStack>
          </Box>
        </Flex>
      </Td>
      <Td display={{ base: "none", md: "table-cell" }} color="gray.600" fontSize="sm">
        {new Date(folder.created_at).toLocaleString()}
      </Td>
      <Td display={{ base: "none", md: "table-cell" }} color="gray.600" fontSize="sm">
        Only you
      </Td>
      <Td display={{ base: "none", md: "table-cell" }}>
        <HStack spacing={1} justify="flex-end">
          <IconButton icon={<MoreVertical size={18} />} variant="ghost" size="sm" aria-label="More options" />
        </HStack>
      </Td>
    </>
  )
}

