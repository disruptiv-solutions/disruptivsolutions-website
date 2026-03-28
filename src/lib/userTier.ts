import { initFirebaseAdmin } from '@/lib/firebase-admin';

export type UserTier = 'free' | 'premium' | null;

/**
 * Get user tier from Firestore (server-side / API routes only).
 * Uses Firebase Admin SDK so reads succeed without a client auth session.
 */
export const getUserTier = async (userId: string | null | undefined): Promise<UserTier> => {
  if (!userId) {
    return null;
  }

  try {
    const { adminDb, error: adminError } = initFirebaseAdmin();
    if (!adminDb) {
      if (adminError) {
        console.warn('[getUserTier] Firebase Admin unavailable:', adminError);
      }
      return null;
    }

    const userSnap = await adminDb.collection('users').doc(userId).get();

    if (!userSnap.exists) {
      return null;
    }

    const userData = userSnap.data();
    const tier = userData?.tier;

    if (tier === 'free' || tier === 'premium') {
      return tier;
    }

    return 'free';
  } catch (error) {
    console.error('[getUserTier] Error fetching user tier:', error);
    return null;
  }
};
