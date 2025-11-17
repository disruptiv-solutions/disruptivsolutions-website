import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export type UserTier = 'free' | 'premium' | null;

/**
 * Get user tier from Firestore
 * Checks the 'users' collection for the user's tier
 * Returns 'free' if user exists but no tier specified
 * Returns null if user doesn't exist or not authenticated
 */
export async function getUserTier(userId: string | null | undefined): Promise<UserTier> {
  if (!userId) {
    return null;
  }

  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return null;
    }

    const userData = userSnap.data();
    const tier = userData.tier;
    
    // If tier is 'free' or 'premium', return it
    // If user exists but no tier, default to 'free'
    if (tier === 'free' || tier === 'premium') {
      return tier;
    }
    
    // User exists but no tier set - default to free
    return 'free';
  } catch (error) {
    console.error('[getUserTier] Error fetching user tier:', error);
    return null;
  }
}

