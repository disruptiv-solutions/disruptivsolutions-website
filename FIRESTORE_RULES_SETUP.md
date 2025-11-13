# Firestore Security Rules Setup

## Overview

The deployed sites feature now uses Firebase Firestore for persistent storage. This means submitted sites will persist across server restarts and page refreshes.

## Setup Instructions

### Option 1: Deploy Rules via Firebase Console (Easiest)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `studio-1755608744-bec6d`
3. Navigate to **Firestore Database** in the left sidebar
4. Click on the **Rules** tab
5. Copy the contents of `firestore.rules` from this project
6. Paste into the Firebase Console rules editor
7. Click **Publish**

### Option 2: Deploy Rules via Firebase CLI

1. Install Firebase CLI (if not already installed):
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project (if not already done):
```bash
firebase init firestore
```
- Select your existing project: `studio-1755608744-bec6d`
- Accept default filenames (firestore.rules, firestore.indexes.json)

4. Deploy the rules:
```bash
firebase deploy --only firestore:rules
```

## Security Rules Explained

### deployed-sites Collection

**Read Access**: Public (anyone can view the showcase)
- Allows all workshop participants to see submitted sites

**Write Access**: Create only (anyone can submit)
- Validates required fields: `url`, `description`, `timestamp`
- Enforces 60-character limit on description
- Prevents updates/deletes (sites are immutable once submitted)

**Why this is safe**:
- No authentication required (workshop participants don't need accounts)
- Sites cannot be modified or deleted after submission
- URL validation happens server-side in the API route
- Consider adding rate limiting in production

### Data Structure

Each document in `deployed-sites` contains:
```typescript
{
  url: string,           // Full URL to deployed site
  description: string,   // Short description (max 60 chars)
  timestamp: number      // Unix timestamp (Date.now())
}
```

## Testing

After deploying the rules, test the functionality:

1. Submit a test site on Step 13 of the workshop
2. Verify it appears on Step 14 (CelebrationStep with CardSwap)
3. Refresh the page
4. Navigate back to Step 14
5. Confirm the test site is still visible

## Production Considerations

### Rate Limiting
Consider adding rate limiting to prevent spam:
- Use Firebase App Check
- Implement server-side rate limiting by IP
- Add CAPTCHA for submissions

### Content Moderation
Currently no moderation system. Consider:
- Admin dashboard to review/remove inappropriate sites
- Flagging system for participants
- Automatic URL validation against known malicious domains

### Monitoring
Monitor Firebase usage in the console:
- **Firestore**: Check read/write operations
- **Quota**: Free tier has limits (50K reads/day, 20K writes/day)
- **Billing**: Upgrade to Blaze plan if needed

## Troubleshooting

### "Permission Denied" Errors
- Verify rules are deployed correctly in Firebase Console
- Check browser console for detailed error messages
- Ensure the collection name is exactly `deployed-sites`

### Sites Not Persisting
- Verify Firebase config in `src/app/api/deployed-sites/route.ts`
- Check Firebase Console → Firestore Database to see if documents are being created
- Ensure you're using the correct Firebase project

### Quota Exceeded
- Check Firebase Console → Usage tab
- Upgrade to Blaze (pay-as-you-go) plan if needed
- Implement caching to reduce reads

## Firebase Project Info

- **Project ID**: `studio-1755608744-bec6d`
- **Collection Name**: `deployed-sites`
- **Region**: (check Firebase Console)

## Support

For Firebase-specific issues:
- [Firebase Documentation](https://firebase.google.com/docs/firestore)
- [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)

