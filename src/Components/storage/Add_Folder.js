import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { FolderPlus } from 'lucide-react';
import { supabase } from "../../supabaseConfig";
import { useAuthenticate } from "../../Context";
import { ROOT_FOLDER } from "../../CustomHook";

export default function AddFolderButton({ currentFolder, isOpen, onClose }) {
  const [name, setName] = useState("");
  const { currentUser } = useAuthenticate();
  const toast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!currentUser) {
      console.log("Authentication state:", { currentUser });
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create folders",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (currentFolder == null) return;

    try {
      console.log("Current User:", currentUser);
      
      const path = [...currentFolder.path];
      if (currentFolder !== ROOT_FOLDER) {
        path.push({ name: currentFolder.name, id: currentFolder.id });
      }

      const folderData = {
        name: name, 
        parent_id: currentFolder.id,
        user_id: currentUser.id,
        path: path, 
        created_at: new Date().toISOString(),
      };

      console.log("Attempting to insert folder with data:", folderData);

      const { data, error } = await supabase
        .from('folders')
        .insert([folderData])
        .select()

      if (error) {
        console.error("Supabase error:", error);
        toast({
          title: "Error",
          description: "Failed to create folder: " + error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      console.log("Successfully created folder:", data);
      toast({
        title: "Success",
        description: "Folder created successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setName("");
      onClose();
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "Failed to create folder!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Folder</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormControl>
              <FormLabel>Folder Name</FormLabel>
              <Input 
                placeholder="Enter folder name" 
                value={name} 
                onChange={e => setName(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" leftIcon={<FolderPlus size={18} />} colorScheme="blue">
              Create
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

