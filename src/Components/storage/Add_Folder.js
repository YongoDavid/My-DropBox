import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { db } from "../../firebaseConfig";
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
  function handleSubmit(e) {
    e.preventDefault();
    if (currentFolder == null) return;
    
    const path = [...currentFolder.path];
    if (currentFolder !== ROOT_FOLDER) {
      path.push({ name: currentFolder.name, id: currentFolder.id });
    }

    // Add folder to database
    db.folders.add({
      name: name, 
      parentId: currentFolder.id, 
      userId: currentUser.uid, 
      path: path, 
      createdAt: db.getCurrentTimestamp(),
    })
    .then(() => {
      // SweetAlert for success
      Swal("Success", "Folder created successfully!", "success");
    })
    .catch((error) => {
      // SweetAlert for error
      Swal("Error", "Failed to create folder!", "error");
    });

    setName("");
    closeModal();
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