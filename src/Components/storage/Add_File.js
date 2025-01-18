import React, { useState, useEffect } from "react";
import {
  Button,
  Progress,
  VStack,
  Text,
  useToast,
  Box,
} from "@chakra-ui/react";
import { Upload } from 'lucide-react';
// import { useAuthenticate } from "../../Context";
import { useAuthenticate } from "../../Context";
import { supabase } from "../../supabaseConfig";

export default function AddFileButton({ currentFolder }) {
  console.log('Component rendering'); // Basic mount check

  const [uploadingFiles, setUploadingFiles] = useState([]);
  const { currentUser } = useAuthenticate();
  const toast = useToast();

  // Component mount check
  useEffect(() => {
    console.log('Component mounted');
    return () => console.log('Component unmounted');
  }, []);

  // Separate auth check
  useEffect(() => {
    console.log('Auth check running, currentUser:', currentUser);
  }, [currentUser]);

  // Simplified file handler for testing
  const handleFileChange = (event) => {
    console.log('File input changed');
    const files = event.target.files;
    
    if (!files || files.length === 0) {
      console.log('No files selected');
      return;
    }

    console.log('Files selected:', files);
    handleUpload(event);
  };

  // Test click handler
  const handleButtonClick = () => {
    console.log('Upload button clicked');
  };

  async function handleUpload(e) {
    console.log("Upload handler triggered");
    
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (!currentUser?.id) {
      console.log("No current user found:", currentUser);
      toast({
        title: "Authentication Error",
        description: "You must be logged in to upload files",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    for (let file of files) {
      const id = Math.random().toString(36).substring(7);
      setUploadingFiles(prevUploadingFiles => [
        ...prevUploadingFiles,
        { id, file, progress: 0 }
      ]);

      const filePath = currentFolder?.id
        ? `files/${currentUser.id}/${currentFolder.id}/${file.name}`
        : `files/${currentUser.id}/${file.name}`;

      try {
        // Check if file already exists in storage
        const { data: existingFiles } = await supabase
          .storage
          .from('files')
          .list(filePath.split('/').slice(0, -1).join('/'));

        const fileExists = existingFiles?.some(f => f.name === file.name);
        if (fileExists) {
          throw new Error('File already exists');
        }

        // Upload to storage first
        const { data: storageData, error: storageError } = await supabase.storage
          .from('files')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            onUploadProgress: (progress) => {
              const percentage = (progress.loaded / progress.total) * 100;
              setUploadingFiles(prevUploadingFiles =>
                prevUploadingFiles.map(uploadFile =>
                  uploadFile.id === id ? { ...uploadFile, progress: percentage } : uploadFile
                )
              );
            }
          });

        if (storageError) throw storageError;

        // Then create database record
        const fileData = {
          name: file.name,
          type: file.type,
          size: file.size,
          folder_id: currentFolder?.id || null,
          user_id: currentUser.id,
          storage_path: filePath
        };

        const { data: dbData, error: dbError } = await supabase
          .from('files')
          .insert([fileData])
          .select();

        if (dbError) {
          // If database insert fails, clean up the uploaded file
          await supabase.storage
            .from('files')
            .remove([filePath]);
          throw dbError;
        }

        toast({
          title: "File Uploaded",
          description: `${file.name} has been successfully uploaded`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Remove the file from uploadingFiles after a delay
        setTimeout(() => {
          setUploadingFiles(prevUploadingFiles => 
            prevUploadingFiles.filter(uploadFile => uploadFile.id !== id)
          );
        }, 1000);

      } catch (error) {
        console.error('Error handling file upload:', error);
        setUploadingFiles(prevUploadingFiles => 
          prevUploadingFiles.filter(uploadFile => uploadFile.id !== id)
        );

        toast({
          title: "Upload Error",
          description: error.message === 'File already exists' 
            ? `${file.name} already exists`
            : `There was an error uploading ${file.name}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  }

  const testClick = () => {
    console.log('Test button clicked');
    alert('Test button clicked');
  };

  return (
    <Box>
      <Button
        as="label"
        htmlFor="file-upload"
        leftIcon={<Upload size={18} />}
        colorScheme="blue"
        variant="outline"
        cursor="pointer"
        onClick={handleButtonClick}
      >
        Upload File
      </Button>
      <input
        id="file-upload"
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
        multiple
      />
      {uploadingFiles.length > 0 && (
        <VStack mt={4} spacing={2} align="stretch">
          {uploadingFiles.map(file => (
            <Box key={file.id}>
              <Text fontSize="sm" mb={1}>{file.file.name}</Text>
              <Progress size="sm" value={file.progress} colorScheme="blue" />
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}

