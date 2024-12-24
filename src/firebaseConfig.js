import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, listAll, deleteObject } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDxThwgZ6Hi5AQLp_Iwq_6uoqnNdZnHJ3U",
    authDomain: "drop-box-6ae43.firebaseapp.com",
    projectId: "drop-box-6ae43",
    storageBucket: "drop-box-6ae43.appspot.com",
    messagingSenderId: "475093793030",
    appId: "1:475093793030:web:273167d7268516b9418687"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = {
  folders: collection(getFirestore(app), "folders"),
  files: collection(getFirestore(app), "files"),
  formatDoc: doc => {
    return { id: doc.id, ...doc.data() };
  },
  getCurrentTimestamp: serverTimestamp
};
export const storage = getStorage(app);

// Function to delete all files in a folder
export const deleteFolder = async (folderPath) => {
    const folderRef = ref(storage, folderPath);

    try {
        const result = await listAll(folderRef);
        const deletePromises = result.items.map((itemRef) => deleteObject(itemRef));
        await Promise.all(deletePromises);
        console.log(`Folder ${folderPath} deleted successfully.`);
    } catch (error) {
        console.error("Error deleting folder:", error);
    }
};

export default app;
