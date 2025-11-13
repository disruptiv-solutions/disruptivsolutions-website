# Quick Firestore Setup - Fix "Submitting..." Issue

## The Problem

You're seeing the error: `Code: 5 NOT_FOUND` because **Firestore hasn't been initialized** in your Firebase project yet.

## Quick Fix (2 minutes)

### Step 1: Create Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **studio-1755608744-bec6d**
3. In the left sidebar, click **Firestore Database** (or Build → Firestore Database)
4. Click **Create database**
5. Choose **Start in test mode** (we'll add security rules after)
6. Select a location (choose closest to your users, e.g., `us-central1`)
7. Click **Enable**

⏱️ This takes about 30 seconds to provision.

### Step 2: Configure Firebase Storage & Service Account

This project now captures screenshots server-side and stores them in **Firebase Storage**. You'll need to set up a service account so the API can upload files securely.

1. In Firebase Console, go to **Project Settings** → **Service accounts**
2. Click **Generate new private key** (JSON) and download the file
3. Copy the entire JSON contents and add it to your environment:
   - Windows (PowerShell):
     ```powershell
     setx FIREBASE_SERVICE_ACCOUNT_KEY "<PASTE_JSON_HERE>"
     ```
   - macOS/Linux (`.env.local`):
     ```
     FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
     ```
4. Note your Storage bucket name (found in **Storage** → **Files**). If it differs from the default `<project-id>.appspot.com`, set:
   ```
   FIREBASE_STORAGE_BUCKET=your-bucket-name
   ```
5. Restart your dev server after updating environment variables

### Step 3: Deploy Security Rules

After the database is created:

1. In Firebase Console, go to **Firestore Database** → **Rules** tab
2. Copy and paste the rules from `firestore.rules` file in this project
3. Click **Publish**

### Step 4: Test

1. Refresh your workshop page
2. Go to Step 13 and submit a test site
3. Should now submit successfully!
4. Go to Step 14 to see it in the CardSwap showcase

## Verify It Worked

In Firebase Console → Firestore Database → Data tab:
- You should see a collection called `deployed-sites`
- With documents containing `url`, `description`, and `timestamp` fields

## What If It Still Doesn't Work?

### Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for specific error messages
4. Share the error with me

### Check Firebase Console
1. Go to Firestore Database → Data
2. Verify the database exists
3. Check if any documents were created

### Common Issues

**"Permission denied"**
- Deploy the security rules from `firestore.rules`

**"Network error"**
- Check your internet connection
- Verify Firebase project ID is correct in `src/lib/firebase.ts`

**Still stuck on "Submitting..."**
- Check browser console for errors
- Verify the API route is working: open `http://localhost:3000/api/deployed-sites?limit=50` in browser
- Should return: `{"sites":[],"total":0}`

## Alternative: Use Test Mode Temporarily

If you just want to test quickly:

1. Firebase Console → Firestore Database → Rules
2. Paste this (⚠️ INSECURE - only for testing):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
3. Click Publish
4. Test your site submission
5. **IMPORTANT**: Replace with proper rules from `firestore.rules` after testing!

## Need Help?

If you're still having issues:
1. Share the browser console errors
2. Share the terminal/server logs
3. Verify Firestore is enabled in Firebase Console

