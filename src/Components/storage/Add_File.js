import React, { useState } from "react";
import { Button, ProgressBar } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { useAuthenticate } from "../../Context";
import { supabase } from "../../supabaseConfig";
import { storageUtils } from "../../storageUtils";

export default function AddFileButton({ currentFolder }) {
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const { currentUser } = useAuthenticate();

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Verify user is authenticated
    if (!currentUser?.id) {
      console.error('User must be authenticated to upload files');
      return;
    }

    const id = Math.random().toString(36).substring(7);
    setUploadingFiles(prevUploadingFiles => [
      ...prevUploadingFiles,
      { id, file, progress: 0 }
    ]);

    // Move filePath declaration outside try block
    const filePath = currentFolder?.id
      ? `${currentUser.id}/${currentFolder.id}/${file.name}`
      : `${currentUser.id}/${file.name}`;

    try {
      // Upload to Supabase Storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('files')
        .upload(filePath, file, {
          onUploadProgress: progress => {
            setUploadingFiles(prevUploadingFiles => {
              return prevUploadingFiles.map(uploadFile => {
                if (uploadFile.id === id) {
                  return { ...uploadFile, progress: (progress.loaded / progress.total) * 100 }
                }
                return uploadFile
              })
            })
          }
        });

      if (storageError) {
        throw storageError;
      }

      // Add file record to database
      const { error: dbError } = await supabase
        .from('files')
        .insert({
          name: file.name,
          type: file.type,
          size: file.size,
          folder_id: currentFolder?.id || null,
          user_id: currentUser.id,
          storage_path: filePath
        });

      if (dbError) {
        throw dbError;
      }

      // Clear the upload progress
      setUploadingFiles(prevUploadingFiles => 
        prevUploadingFiles.filter(uploadFile => uploadFile.id !== id)
      );

    } catch (error) {
      console.error('Error handling file upload:', error);
      
      // Clean up the upload progress
      setUploadingFiles(prevUploadingFiles => 
        prevUploadingFiles.filter(uploadFile => uploadFile.id !== id)
      );
      
      // Now filePath is accessible here
      if (error.message.includes('row-level security')) {
        try {
          await supabase.storage
            .from('files')
            .remove([filePath]);
        } catch (cleanupError) {
          console.error('Error cleaning up stored file:', cleanupError);
        }
      }
    }
  }

  return (
    <>
      <label className="btn btn-outline-success btn-sm m-0 mr-2">
        <FontAwesomeIcon icon={faFileUpload} />
        <input
          type="file"
          onChange={handleUpload}
          style={{ opacity: 0, position: "absolute", left: "-9999px" }}
        />
      </label>
      {uploadingFiles.length > 0 &&
        <div className="mt-3">
          {uploadingFiles.map(file => (
            <div key={file.id} className="mb-2">
              <div className="text-truncate" style={{ maxWidth: "200px" }}>
                {file.file.name}
              </div>
              <ProgressBar
                animated
                variant="primary"
                now={file.progress}
                label={`${Math.round(file.progress)}%`}
              />
            </div>
          ))}
        </div>
      }
    </>
  );
}