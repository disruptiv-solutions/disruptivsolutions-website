import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCPXFfcgUvK1vsRf7dI6jsFvrls19i2hh8',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'studio-1755608744-bec6d.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'studio-1755608744-bec6d',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'studio-1755608744-bec6d.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '6023599771',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:6023599771:web:5455d06d6236061c45183e',
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firestore
export const db: Firestore = getFirestore(app);

// Initialize Storage
export const storage: FirebaseStorage = getStorage(app);

/**
 * Uploads a file to Firebase Storage and returns the download URL
 * @param file - The file to upload
 * @param path - Optional custom path (defaults to 'profile-images/{timestamp}-{filename}')
 * @returns Promise resolving to the download URL
 */
export const uploadFileToStorage = async (
  file: File,
  path?: string
): Promise<string> => {
  try {
    // Generate a unique filename if path is not provided
    const fileName = path || `profile-images/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, fileName);

    // Upload the file
    await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file to Firebase Storage:', error);
    throw new Error('Failed to upload file. Please try again.');
  }
};

export default app;



