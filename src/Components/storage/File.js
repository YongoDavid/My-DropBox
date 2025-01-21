import React from "react";
import { Td, IconButton, HStack, Text, useToast, Flex , Box } from "@chakra-ui/react";
import { FileText, Trash2, Download, MoreVertical } from 'lucide-react';
import { supabase } from "../../supabaseConfig";

export default function File({ file }) {
  const toast = useToast();

  async function handleDelete() {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('files')
        .remove([file.storage_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .match({ id: file.id });

      if (dbError) throw dbError;

      toast({
        title: "File deleted",
        description: "File has been successfully deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  async function handleDownload() {
    try {
      const { data, error } = await supabase.storage
        .from('files')
        .download(file.storage_path);

      if (error) throw error;

      // Create download link
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: "Your file download has begun",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Error",
        description: "Failed to download file",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return (
    <>
      <Td>
        <Flex>
          <HStack spacing={3}>
            <FileText size={20} color="#68A1F8" />
              <Text
                cursor="pointer"
                onClick={handleDownload}
                _hover={{ color: "blue.500" }}
                isTruncated
                maxWidth={{ base: "150px", md: "200px", lg: "200px" }}
              >
                {file.name}
              </Text>
            </HStack>
            <HStack spacing={1} display={{ base: "flex", md: "none" }}>
              <IconButton
                icon={<Download size={18} />}
                variant="ghost"
                size="sm"
                aria-label="Download file"
                onClick={handleDownload}
              />
              <IconButton
                icon={<Trash2 size={18} />}
                variant="ghost"
                size="sm"
                aria-label="Delete file"
                onClick={handleDelete}
                _hover={{ color: "red.500" }}
              />
          </HStack>
        </Flex>
      </Td>
      <Td display={{ base: "none", md: "table-cell" }} color="gray.600" fontSize="sm">
        {new Date(file.created_at).toLocaleString()}
      </Td>
      <Td display={{ base: "none", md: "table-cell" }} color="gray.600" fontSize="sm">
        Only you
      </Td>
      <Td display={{base: "none", md: "table-cell"}}>
        <HStack spacing={1} justify="flex-end">
          <IconButton
            icon={<Download size={18} />}
            variant="ghost"
            size="sm"
            aria-label="Download file"
            onClick={handleDownload}
          />
          <IconButton
            icon={<Trash2 size={18} />}
            variant="ghost"
            size="sm"
            aria-label="Delete file"
            onClick={handleDelete}
            _hover={{ color: "red.500" }}
          />
          <IconButton icon={<MoreVertical size={18} />} variant="ghost" size="sm" aria-label="More options" />
        </HStack>
      </Td>
    </>
  );
}

