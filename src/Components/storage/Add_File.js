import React, { useState, useEffect } from "react"
import { Button, Progress, VStack, Text, useToast, Box } from "@chakra-ui/react"
import { Upload } from "lucide-react"
import { useAuthenticate } from "../../Context"
import { supabase } from "../../supabaseConfig"

export default function AddFileButton({ currentFolder }) {
  const [uploadingFiles, setUploadingFiles] = useState([])
  const { currentUser } = useAuthenticate()
  const toast = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
      console.log("Current session:", session)
      console.log("Session user:", session?.user)
    }

    checkAuth()
  }, [])

  async function handleUpload(e) {
    const files = e.target.files
    if (files.length === 0) return

    if (!currentUser?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to upload files",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    for (const file of files) {
      const id = Math.random().toString(36).substring(7)
      setUploadingFiles((prevUploadingFiles) => [...prevUploadingFiles, { id, file, progress: 0 }])

      const filePath = currentFolder?.id
        ? `files/${currentUser.id}/${currentFolder.id}/${file.name}`
        : `files/${currentUser.id}/${file.name}`

      try {
        // First insert the database record
        const fileData = {
          name: file.name,
          type: file.type,
          size: file.size,
          folder_id: currentFolder?.id || null,
          user_id: currentUser.id,
          storage_path: filePath,
        }

        console.log("Attempting to insert:", fileData)

        const { data: dbData, error: dbError } = await supabase.from("files").insert([fileData]).select()

        if (dbError) {
          console.error("Database error:", dbError)
          throw dbError
        }

        // Then upload to storage
        const { data: storageData, error: storageError } = await supabase.storage.from("files").upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        })

        if (storageError) {
          console.error("Storage error:", storageError)
          throw storageError
        }

        console.log("Upload successful:", { dbData, storageData })

        toast({
          title: "File Uploaded",
          description: `${file.name} has been successfully uploaded`,
          status: "success",
          duration: 3000,
          isClosable: true,
        })

        // Update progress to 100%
        setUploadingFiles((prevUploadingFiles) =>
          prevUploadingFiles.map((uploadFile) =>
            uploadFile.id === id ? { ...uploadFile, progress: 100 } : uploadFile,
          ),
        )

        // Remove the file from uploadingFiles after a delay
        setTimeout(() => {
          setUploadingFiles((prevUploadingFiles) => prevUploadingFiles.filter((uploadFile) => uploadFile.id !== id))
        }, 1000)
      } catch (error) {
        console.error("Error handling file upload:", error)
        setUploadingFiles((prevUploadingFiles) => prevUploadingFiles.filter((uploadFile) => uploadFile.id !== id))

        if (error.message.includes("row-level security")) {
          try {
            await supabase.storage.from("files").remove([filePath])
          } catch (cleanupError) {
            console.error("Error cleaning up stored file:", cleanupError)
          }
        }

        toast({
          title: "Upload Error",
          description: `There was an error uploading ${file.name}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      }
    }
  }

  const handleButtonClick = () => {
    // Add any necessary logic for the button click here.  This is a placeholder.
  }

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
        width={{ base: "100%", sm: "auto" }}
        mb={{ base: 2, sm: 0 }}
      >
        Upload File
      </Button>
      <input id="file-upload" type="file" onChange={handleUpload} style={{ display: "none" }} multiple />
      {uploadingFiles.length > 0 && (
        <VStack mt={4} spacing={2} align="stretch">
          {uploadingFiles.map((file) => (
            <Box key={file.id}>
              <Text fontSize="sm" mb={1}>
                {file.file.name}
              </Text>
              <Progress size="sm" value={file.progress} colorScheme="blue" />
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  )
}

