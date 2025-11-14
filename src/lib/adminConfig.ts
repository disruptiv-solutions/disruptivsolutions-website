/**
 * Admin Configuration
 * List of Firebase User IDs that have admin access
 */

export const ADMIN_UIDS = [
  'Pw6izWRUHzam4qPrmEeE56fFsYC2', // Admin user
];

/**
 * Check if a user ID is an admin
 */
export const isAdmin = (uid: string | undefined | null): boolean => {
  if (!uid) return false;
  return ADMIN_UIDS.includes(uid);
};

