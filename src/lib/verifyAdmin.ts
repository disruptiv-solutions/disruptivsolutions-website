import { auth } from '@/lib/firebase';
import { isAdmin } from '@/lib/adminConfig';

/**
 * Verify if a user is an admin from their Firebase ID token
 * This is used in API routes to verify admin status
 */
export async function verifyAdminFromToken(idToken: string | null): Promise<boolean> {
  if (!idToken) {
    return false;
  }

  try {
    // Note: In a production app, you should use Firebase Admin SDK here
    // For now, we'll verify the token client-side and check admin status
    // This requires the client to pass the token
    
    // Decode the token to get the user ID
    // Simple JWT decode (without verification - not secure for production)
    // In production, use Firebase Admin SDK to verify the token properly
    
    const base64Url = idToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const decoded = JSON.parse(jsonPayload);
    const uid = decoded.user_id || decoded.sub;
    
    return isAdmin(uid);
  } catch (error) {
    console.error('[verifyAdmin] Error verifying token:', error);
    return false;
  }
}

