// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore, collection, serverTimestamp } from "firebase/firestore";
// import { getStorage, ref, listAll, deleteObject } from "firebase/storage";


// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAU1VsVR_cS6DgRzmTzLPgQB-AK4JQEwBM",
//   authDomain: "box-drop-e2af5.firebaseapp.com",
//   projectId: "box-drop-e2af5",
//   storageBucket: "box-drop-e2af5.firebasestorage.app",
//   messagingSenderId: "180835731115",
//   appId: "1:180835731115:web:91f2bdc959c262a53a59ee"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
// export const db = {
//   folders: collection(getFirestore(app), "folders"),
//   files: collection(getFirestore(app), "files"),
//   formatDoc: doc => {
//     return { id: doc.id, ...doc.data() }
//   },
//   getCurrentTimestamp: serverTimestamp
// }
// export const storage = getStorage(app);

// // Function to delete all files in a folder
// export const deleteFolder = async (folderPath) => {
//     const folderRef = ref(storage, folderPath);

//     try {
//         const result = await listAll(folderRef);
//         const deletePromises = result.items.map((itemRef) => deleteObject(itemRef));
//         await Promise.all(deletePromises);
//         console.log(`Folder ${folderPath} deleted successfully.`);
//     } catch (error) {
//         console.error("Error deleting folder:", error);
//     }
// };


// export default app;

