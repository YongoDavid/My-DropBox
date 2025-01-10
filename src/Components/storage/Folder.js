import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { supabase } from "../../supabaseConfig";

export default function Folder({ folder }) {
  // Handler for deleting a folder
  const handleDelete = async (e) => {
    e.preventDefault();

    // Updated SweetAlert syntax
    const result = await Swal.fire({
      title: `Are you sure you want to delete the folder "${folder.name}"?`,
      text: "Once deleted, you will not be able to recover this folder!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase
          .from('folders')
          .delete()
          .match({ id: folder.id });

        if (error) throw error;

        // Success message
        await Swal.fire(
          'Deleted!',
          'Folder has been deleted.',
          'success'
        );
      } catch (error) {
        console.error("Error deleting folder: ", error);
        await Swal.fire(
          'Error!',
          'Failed to delete folder.',
          'error'
        );
      }
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center w-100">
      <Button
        to={{
          pathname: `/folder/${folder.id}`,
          state: { folder: folder },
        }}
        variant="outline-primary"
        className="text-truncate w-100 mr-2"
        as={Link}
      >
        <FontAwesomeIcon icon={faFolder} className="mr-2" />
        {folder.name}
      </Button>
      <Button variant="outline-danger" onClick={handleDelete} className="ml-2">
        <FontAwesomeIcon icon={faTrash} />
      </Button>
    </div>
  );
}