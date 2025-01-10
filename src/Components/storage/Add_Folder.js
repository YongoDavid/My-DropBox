import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { supabase } from "../../supabaseConfig";
import { useAuthenticate } from "../../Context";
import { ROOT_FOLDER } from "../../CustomHook";
import Swal from 'sweetalert2'
export default function AddFolderButton({ currentFolder }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const { currentUser } = useAuthenticate();

  function openModal() {
    setOpen(true);
  }
  function closeModal() {
    setOpen(false);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!currentUser) {
      console.log("Authentication state:", { currentUser });
      Swal.fire("Error", "You must be logged in to create folders", "error");
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
        Swal.fire("Error", "Failed to create folder: " + error.message, "error");
        return;
      }

      console.log("Successfully created folder:", data);
      Swal.fire("Success", "Folder created successfully!", "success");
      setName("");
      closeModal();
    } catch (error) {
      console.error("Unexpected error:", error);
      Swal.fire("Error", "Failed to create folder!", "error");
    }
  }

  return (
    <>
      <Button onClick={openModal} variant="outline-primary" size="lg" style={{ fontSize: 20 }}>
        Create Folder
      </Button>
      <Modal show={open} onHide={closeModal}>
        <Form className="bg-light border border-primary rounded" onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group>
              <Form.Label className="text-dark">Folder Name</Form.Label>
              <Form.Control type="text" className="bg-light text-dark border border-primary rounded" required value={name} onChange={e => setName(e.target.value)} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Button className="col-3 bg-danger border border-primary rounded" onClick={closeModal}>
              Cancel
            </Button>
            <Button className="col-3 bg-primary border border-primary rounded" type="submit">
              Create
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}