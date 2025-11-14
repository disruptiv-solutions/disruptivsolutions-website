# Admin System Documentation

## ✅ Admin User Configured

**Admin UID:** `Pw6izWRUHzam4qPrmEeE56fFsYC2`

This user now has admin privileges across the entire site.

## 🎯 What's Been Implemented

### 1. Admin Configuration (`src/lib/adminConfig.ts`)
- Centralized list of admin user IDs
- `isAdmin()` helper function to check admin status
- Easy to add more admins by adding UIDs to the array

### 2. Auth Context Updates (`src/contexts/AuthContext.tsx`)
- Added `isAdmin` boolean to auth context
- Automatically checks if logged-in user is an admin
- Available throughout the entire app via `useAuth()` hook

### 3. Visual Admin Indicators
**Desktop Navigation:**
- Red dot badge on user avatar
- "ADMIN" badge in dropdown menu

**Mobile Navigation:**
- Red dot badge on user avatar
- "ADMIN" badge next to user name

### 4. Admin Route Protection (`src/components/AdminRoute.tsx`)
- `<AdminRoute>` component to wrap admin-only pages
- Automatically redirects non-admin users
- Shows custom fallback or default "Access Denied" message

## 🚀 How to Use

### Check if User is Admin (in any component):

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAdmin } = useAuth();

  return (
    <div>
      {isAdmin && (
        <button>Admin Only Button</button>
      )}
    </div>
  );
}
```

### Protect an Entire Page (Admin Only):

```typescript
import { AdminRoute } from '@/components/AdminRoute';

export default function AdminDashboard() {
  return (
    <AdminRoute>
      <div>
        <h1>Admin Dashboard</h1>
        <p>Only admins can see this page.</p>
      </div>
    </AdminRoute>
  );
}
```

### Protect with Custom Fallback:

```typescript
import { AdminRoute } from '@/components/AdminRoute';

export default function SpecialPage() {
  return (
    <AdminRoute
      fallback={
        <div>
          <h1>Premium Feature</h1>
          <p>This feature is only available to admins.</p>
        </div>
      }
    >
      <div>
        <h1>Admin Content</h1>
      </div>
    </AdminRoute>
  );
}
```

### Use the Hook:

```typescript
import { useIsAdmin } from '@/components/AdminRoute';

function MyComponent() {
  const isAdmin = useIsAdmin();

  if (!isAdmin) return null;

  return <div>Admin-only content</div>;
}
```

## 👥 Adding More Admins

To add more admin users, edit `src/lib/adminConfig.ts`:

```typescript
export const ADMIN_UIDS = [
  'Pw6izWRUHzam4qPrmEeE56fFsYC2', // Current admin
  'ANOTHER_USER_UID_HERE',         // Add new admin UID
  'YET_ANOTHER_UID',               // Add another
];
```

### How to Get a User's UID:

1. Have the user log in to your site
2. Open browser console (F12)
3. Run: `firebase.auth().currentUser.uid`
4. Copy the UID and add it to `ADMIN_UIDS` array

Or check Firebase Console → Authentication → Users → Click user → Copy UID

## 🎨 Visual Indicators

### Admin Badge Styling:
- **Red dot**: Small red circle on avatar (top-right corner)
- **"ADMIN" badge**: Red background with white text
- Visible in both desktop dropdown and mobile menu

### Where Admins See Badges:
- ✅ Desktop: Avatar in header + dropdown menu
- ✅ Mobile: Avatar in mobile menu + next to name
- ✅ Any custom admin UI you build

## 🔒 Security Notes

**Important:** This is a **client-side admin check**. 

For true security:
1. **Always verify admin status on the server** (API routes)
2. Use Firebase Admin SDK in API routes to check custom claims
3. Never trust client-side checks for sensitive operations

### Example: Secure API Route

```typescript
// src/app/api/admin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/adminConfig';

export async function POST(request: NextRequest) {
  // Get user from request (you'd need to implement this)
  const userUid = request.headers.get('x-user-uid');
  
  // Check if admin
  if (!isAdmin(userUid)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 403 }
    );
  }
  
  // Admin-only logic here
  return NextResponse.json({ success: true });
}
```

## 📝 Use Cases

### Common Admin Features to Build:

1. **Admin Dashboard** (`/admin`)
   - View all users
   - Site analytics
   - Content management

2. **User Management**
   - View/edit/delete users
   - Assign roles
   - Ban users

3. **Content Moderation**
   - Approve/reject submissions
   - Edit user content
   - Delete inappropriate content

4. **Site Settings**
   - Update site configuration
   - Manage resources
   - Feature flags

5. **Analytics & Reports**
   - View detailed analytics
   - Export data
   - Generate reports

## 🎯 Example: Admin Dashboard Page

Create `src/app/admin/page.tsx`:

```typescript
import { AdminRoute } from '@/components/AdminRoute';

export default function AdminDashboard() {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-black pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">
            Admin Dashboard
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="bg-zinc-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-gray-400 text-sm mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-white">1,234</p>
            </div>
            
            <div className="bg-zinc-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-gray-400 text-sm mb-2">Active Today</h3>
              <p className="text-3xl font-bold text-white">89</p>
            </div>
            
            <div className="bg-zinc-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-gray-400 text-sm mb-2">Total Resources</h3>
              <p className="text-3xl font-bold text-white">42</p>
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
```

## ✨ Current Admin

**User:** `Pw6izWRUHzam4qPrmEeE56fFsYC2`

This user will see:
- ✅ Red dot badge on their avatar
- ✅ "ADMIN" badge in dropdown/mobile menu
- ✅ Access to all `<AdminRoute>` protected pages
- ✅ `isAdmin === true` in `useAuth()` hook

---

**Need help?** Check the code in:
- `src/lib/adminConfig.ts` - Admin configuration
- `src/contexts/AuthContext.tsx` - Admin status in auth
- `src/components/AdminRoute.tsx` - Route protection
- `src/components/Navigation.tsx` - Visual badges

