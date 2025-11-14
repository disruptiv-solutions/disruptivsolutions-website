# Firestore Security Rules Setup

## 🔥 Quick Fix for Permission Denied Error

The error you're seeing is because Firestore security rules are blocking the API route operations. Here's how to fix it:

### Step 1: Update Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database** → **Rules** tab
4. Replace the rules with the content from `firestore.rules` file
5. Click **Publish**

### Step 2: Verify Rules Are Active

The rules should allow:
- ✅ **Public read** of published resources
- ✅ **Authenticated users** to create/update/delete (admin verification happens in API routes)

### Current Rules Summary:

```javascript
// Resources collection
match /resources/{resourceId} {
  // Anyone can read published resources
  allow read: if resource.data.published == true || request.auth != null;
  
  // Authenticated users can write (admin verified in API routes)
  allow create: if request.auth != null;
  allow update: if request.auth != null;
  allow delete: if request.auth != null;
}
```

## ⚠️ Important Notes

### Current Limitation:
The Firebase **client SDK** in Next.js API routes doesn't automatically include authentication context. The rules above allow authenticated users, but the API routes need to be updated to properly pass auth tokens.

### Better Solution (Recommended):
For production, you should use **Firebase Admin SDK** in API routes:

1. **Install Admin SDK:**
   ```bash
   npm install firebase-admin
   ```

2. **Create service account:**
   - Firebase Console → Project Settings → Service Accounts
   - Generate new private key
   - Save as `firebase-admin-key.json` (add to `.gitignore`)

3. **Update API routes** to use Admin SDK instead of client SDK

### Temporary Workaround:
For now, the rules above will work if you:
1. Make sure users are logged in when accessing admin features
2. The API routes verify admin status client-side before making requests

## 🔒 Security Best Practices

1. **Never expose service account keys** in client-side code
2. **Always verify admin status** in API routes (even if rules allow)
3. **Use Admin SDK** for server-side operations in production
4. **Keep security rules restrictive** - only allow what's necessary

## 📝 Next Steps

1. ✅ Copy rules from `firestore.rules` to Firebase Console
2. ✅ Publish the rules
3. ✅ Test creating a resource as admin
4. 🔄 (Optional) Set up Admin SDK for better security

---

**Need help?** Check Firebase documentation:
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

