import { UserTier } from './userTier';

/**
 * Check if a user has access to a resource based on their tier and the resource's access level
 * Admins have access to all resources regardless of access level
 * Free resources: require any authenticated user (just needs to be signed in)
 * Premium resources: require premium tier
 */
export function hasResourceAccess(
  resourceAccessLevel: 'public' | 'free' | 'premium' | undefined,
  userTier: UserTier,
  isAdmin: boolean = false,
  userId: string | null = null
): boolean {
  // Admins can access all resources
  if (isAdmin) {
    return true;
  }

  const accessLevel = resourceAccessLevel || 'public';

  if (accessLevel === 'public') {
    // Public resources: anyone can access
    return true;
  } else if (accessLevel === 'free') {
    // Free resources: require any authenticated user (just needs to be signed in)
    // If userId is provided, user is authenticated
    return userId !== null;
  } else if (accessLevel === 'premium') {
    // Premium resources: require premium tier
    return userTier === 'premium';
  }

  return false;
}

