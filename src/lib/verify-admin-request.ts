import { getAuth } from 'firebase-admin/auth';
import { initFirebaseAdmin } from '@/lib/firebase-admin';
import { isAdmin } from '@/lib/adminConfig';

/**
 * Verifies Firebase ID token and checks uid against ADMIN_UIDS.
 */
export const verifyAdminBearer = async (
  request: Request
): Promise<{ uid: string } | null> => {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  if (!token) {
    return null;
  }

  const { adminApp, error } = initFirebaseAdmin();
  if (!adminApp) {
    console.error('[verifyAdminBearer] Admin app unavailable:', error);
    return null;
  }

  try {
    const decoded = await getAuth(adminApp).verifyIdToken(token);
    if (!isAdmin(decoded.uid)) {
      return null;
    }
    return { uid: decoded.uid };
  } catch (e) {
    console.error('[verifyAdminBearer] verifyIdToken failed:', e);
    return null;
  }
};
