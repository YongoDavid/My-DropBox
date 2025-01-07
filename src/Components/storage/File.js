// File.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../../supabaseConfig";
import {storageUtils} from "../../storageUtils"

export default function File({ file }) {
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
    } catch (error) {
      console.error('Error deleting file:', error);
      // Handle error (show message to user, etc.)
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
    } catch (error) {
      console.error('Error downloading file:', error);
      // Handle error (show message to user, etc.)
    }
  }

  return (
    <div className="d-flex align-items-center px-2 py-1">
      <FontAwesomeIcon icon={faFile} className="mr-2" />
      <div 
        className="text-truncate flex-grow-1 mr-2" 
        style={{ cursor: "pointer" }}
        onClick={handleDownload}
      >
        {file.name}
      </div>
      <button
        className="btn btn-outline-danger btn-sm"
        onClick={handleDelete}
      >
        Delete
      </button>
    </div>
  );
}