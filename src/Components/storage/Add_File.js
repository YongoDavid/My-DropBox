import React, { useState , useEffect } from "react";
import { Button, ProgressBar } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { useAuthenticate } from "../../Context";
import { supabase } from "../../supabaseConfig";
import { storageUtils } from "../../storageUtils";

export default function AddFileButton({ currentFolder }) {
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const { currentUser } = useAuthenticate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Current session:", session);
      console.log("Session user:", session?.user);
    };
    
    checkAuth();
  }, []);

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!currentUser?.id) {
      console.error('User not authenticated');
      return;
    }

    const id = Math.random().toString(36).substring(7);
    setUploadingFiles(prevUploadingFiles => [
      ...prevUploadingFiles,
      { id, file, progress: 0 }
    ]);

    const filePath = currentFolder?.id
      ? `files/${currentUser.id}/${currentFolder.id}/${file.name}`
      : `files/${currentUser.id}/${file.name}`;

    try {
      // First insert the database record
      const fileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        folder_id: currentFolder?.id || null,
        user_id: currentUser.id,
        storage_path: filePath
      };

      console.log('Attempting to insert:', fileData);

      const { data: dbData, error: dbError } = await supabase
        .from('files')
        .insert([fileData])
        .select();

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      // Then upload to storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (storageError) {
        console.error('Storage error:', storageError);
        throw storageError;
      }

      console.log('Upload successful:', { dbData, storageData });

      // Clear the upload progress
      setUploadingFiles(prevUploadingFiles => 
        prevUploadingFiles.filter(uploadFile => uploadFile.id !== id)
      );

    } catch (error) {
      console.error('Error handling file upload:', error);
      setUploadingFiles(prevUploadingFiles => 
        prevUploadingFiles.filter(uploadFile => uploadFile.id !== id)
      );

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