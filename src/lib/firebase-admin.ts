import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

type AdminStorage = ReturnType<typeof getStorage>;
type AdminBucket = ReturnType<AdminStorage['bucket']>;

interface FirebaseAdminInitResult {
  adminApp: App | null;
  adminDb: Firestore | null;
  adminStorage: AdminBucket | null;
  error?: string;
}

let cachedApp: App | null = null;
let cachedDb: Firestore | null = null;
let cachedStorage: AdminBucket | null = null;

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

    // Validate required fields
    const requiredFields = ['type', 'project_id', 'private_key_id', 'private_key', 'client_email'];
    const missingFields = requiredFields.filter(field => !serviceAccount[field]);
    
    if (missingFields.length > 0) {
      throw new Error(
        `Service account JSON is missing required fields: ${missingFields.join(', ')}. ` +
        `Please download the complete service account JSON from Firebase Console: ` +
        `Project Settings > Service Accounts > Generate New Private Key`
      );
    }

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

