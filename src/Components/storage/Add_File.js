import React, { useState } from "react"
import ReactDOM from "react-dom"
import { useAuthenticate } from "../../Context"
import { storage, db } from "../../firebaseConfig"
import { ROOT_FOLDER } from "../../CustomHook"
import { v4 as uuidV4 } from "uuid"
import { ProgressBar, Toast } from "react-bootstrap"

export default function AddFileButton({ currentFolder }) {
  const [uploadingFiles, setUploadingFiles] = useState([])
  const { currentUser } = useAuthenticate()
  function handleUpload(e) {
    const file = e.target.files[0]
    if (currentFolder == null || file == null) return
    const id = uuidV4()
    setUploadingFiles(prevUploadingFiles => [
      ...prevUploadingFiles,
      { id: id, name: file.name, progress: 0, error: false },
    ])
    const filePath =
      currentFolder === ROOT_FOLDER
        ? `${currentFolder.path.join("/")}/${file.name}`
        : `${currentFolder.path.join("/")}/${currentFolder.name}/${file.name}`
    const uploadTask = storage
      .ref(`/files/${currentUser.uid}/${filePath}`)
      .put(file)
    uploadTask.on("state_changed",
      snapshot => {
        const progress = snapshot.bytesTransferred / snapshot.totalBytes
        setUploadingFiles(prevUploadingFiles => {
          return prevUploadingFiles.map(uploadFile => {
            if (uploadFile.id === id) {
              return { ...uploadFile, progress: progress }
            }
            return uploadFile
          })
        })
      },
      () => {
        setUploadingFiles(prevUploadingFiles => {
          return prevUploadingFiles.map(uploadFile => {
            if (uploadFile.id === id) {
              return { ...uploadFile, error: true }
            }
            return uploadFile
          })
        })
      },
      () => {
        setUploadingFiles(prevUploadingFiles => {
          return prevUploadingFiles.filter(uploadFile => {
            return uploadFile.id !== id
          })
        })

        uploadTask.snapshot.ref.getDownloadURL().then(url => {
          db.files
            .where("name", "==", file.name)
            .where("userId", "==", currentUser.uid)
            .where("folderId", "==", currentFolder.id)
            .get()
            .then(existingFiles => {
              const existingFile = existingFiles.docs[0]
              if (existingFile) {
                let doouble = db.files.add({ url: url, name: file.name, createdAt: db.getCurrentTimestamp(), folderId: currentFolder.id, userId: currentUser.uid,
                })
                if (doouble) {
                  setInterval(() => {
                    window.location.reload();
                  }, 1500);
                }
              } else {
                db.files.add({ url: url, name: file.name, createdAt: db.getCurrentTimestamp(), folderId: currentFolder.id, userId: currentUser.uid,
                })
              }
            })
        })
      }
    )
  }

  return (
    <>
      <label className="btn btn-primary  btn-lg m-2 text-white" variant="outline-success">
        Upload File 
        <input
          type="file"
          onChange={handleUpload}
          style={{ opacity: 0, position: "absolute", left: "-9999px" }}
        />
      </label>
      {uploadingFiles.length > 0 &&
        ReactDOM.createPortal(
          <div style={{ position: "absolute", bottom: "1rem", right: "1rem", maxWidth: "250px",}}>
            {uploadingFiles.map(file => (
              <Toast
                key={file.id}
                onClose={() => {
                  setUploadingFiles(prevUploadingFiles => {
                    return prevUploadingFiles.filter(uploadFile => {
                      return uploadFile.id !== file.id
                    })
                  })
                }}>
                <Toast.Header closeButton={file.error} className="text-truncate w-100 d-block">
                  {file.name}
                </Toast.Header>
                <Toast.Body>
                  <ProgressBar animated={!file.error} variant={file.error ? "danger" : "primary"} now={file.error ? 100 : file.progress * 100}
                    label={
                      file.error
                        ? "Error"
                        : `${Math.round(file.progress * 100)}%`
                    }/>
                </Toast.Body>
              </Toast>
            ))}
          </div>,
          document.body
        )}
    </>
  )
}