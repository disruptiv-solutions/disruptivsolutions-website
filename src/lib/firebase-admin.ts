import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage, Bucket } from 'firebase-admin/storage';

interface FirebaseAdminInitResult {
  adminApp: App | null;
  adminDb: Firestore | null;
  adminStorage: Bucket | null;
  error?: string;
}

let cachedApp: App | null = null;
let cachedDb: Firestore | null = null;
let cachedStorage: Bucket | null = null;

export const initFirebaseAdmin = (): FirebaseAdminInitResult => {
  if (cachedApp && cachedDb && cachedStorage) {
    return {
      adminApp: cachedApp,
      adminDb: cachedDb,
      adminStorage: cachedStorage,
    };
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const configuredBucket =
    process.env.FIREBASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  if (!serviceAccountKey) {
    return {
      adminApp: null,
      adminDb: null,
      adminStorage: null,
      error:
        'FIREBASE_SERVICE_ACCOUNT_KEY is not configured. Please add it to your environment variables.',
    };
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountKey);

    const bucketName =
      configuredBucket || `${serviceAccount.project_id}.appspot.com`;

    if (!getApps().length) {
      cachedApp = initializeApp({
        credential: cert(serviceAccount),
        storageBucket: bucketName,
      });
    } else {
      cachedApp = getApps()[0];
    }

    cachedDb = getFirestore(cachedApp);
    cachedStorage = getStorage(cachedApp).bucket();

    return {
      adminApp: cachedApp,
      adminDb: cachedDb,
      adminStorage: cachedStorage,
    };
  } catch (error) {
    console.error('[Firebase Admin] Initialization error:', error);
    return {
      adminApp: null,
      adminDb: null,
      adminStorage: null,
      error:
        'Failed to initialize Firebase Admin. Verify FIREBASE_SERVICE_ACCOUNT_KEY is valid JSON.',
    };
  }
};

