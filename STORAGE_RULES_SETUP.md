# Firebase Storage Security Rules Setup

## Overview

The profile image upload feature uses Firebase Storage to store uploaded images. Storage rules need to be configured to allow users to upload images to the `profile-images/` path.

## Setup Instructions

### Option 1: Deploy Rules via Firebase Console (Easiest)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `studio-1755608744-bec6d`
3. Navigate to **Storage** in the left sidebar
4. Click on the **Rules** tab
5. Copy the contents of `storage.rules` from this project
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

3. Initialize Firebase Storage in your project (if not already done):
```bash
firebase init storage
```
- Select your existing project: `studio-1755608744-bec6d`
- Accept default filename (storage.rules)

4. Deploy the rules:
```bash
firebase deploy --only storage:rules
```

## Security Rules Explained

### profile-images/ Path

**Read Access**: Public (anyone can view/download images)
- Allows the generated download URLs to be accessible
- Images are public once uploaded

**Write Access**: Public uploads with validation
- Maximum file size: 5MB (matches client-side validation)
- Content type validation: Only image files (`image/*`)
- Prevents non-image files from being uploaded

**Delete Access**: Denied
- Prevents users from deleting uploaded images
- This keeps the storage clean and prevents abuse

**Why this is safe**:
- File size limit prevents large file abuse (5MB max)
- Content type validation ensures only images are uploaded
- No authentication required (workshop participants don't need accounts)
- Files are stored with unique timestamps to prevent overwrites
- Consider adding rate limiting in production

## Storage Structure

Files are stored at:
```
profile-images/{timestamp}-{filename}
```

Example:
```
profile-images/1704067200000-profile-photo.jpg
```

## Testing

After deploying the rules, test the functionality:

1. Go to the class registration form
2. Click "Upload File" in the Profile Image section
3. Select an image file (under 5MB)
4. Verify the upload completes and shows "Uploaded!" message
5. Check Firebase Console → Storage → Files to see the uploaded image
6. Verify the image URL is included in the generated prompt

## Production Considerations

### Rate Limiting
Consider adding rate limiting to prevent abuse:
- Use Firebase App Check
- Implement server-side rate limiting by IP
- Limit uploads per user/session

### Content Moderation
Currently no moderation system. Consider:
- Admin dashboard to review/remove inappropriate images
- Image content scanning/validation
- File type whitelist (e.g., only jpg, png, webp)

### Storage Costs
Monitor Firebase Storage usage:
- **Storage**: Free tier includes 5GB storage
- **Bandwidth**: Free tier includes 1GB/day downloads
- **Operations**: Free tier includes 20K operations/day
- **Billing**: Upgrade to Blaze plan if needed

### Security Enhancements
For production, consider:
- Adding authentication requirement
- Implementing file scanning for malicious content
- Adding expiration dates for old files
- Implementing file cleanup jobs

## Troubleshooting

### "Permission Denied" Errors
- Verify rules are deployed correctly in Firebase Console
- Check browser console for detailed error messages
- Ensure the path is exactly `profile-images/`
- Verify file size is under 5MB
- Verify file is an image type

### Uploads Not Working
- Verify Firebase Storage is enabled in Firebase Console
- Check Firebase config in `src/lib/firebase.ts`
- Ensure `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` is set correctly
- Check browser console for error messages

### Files Not Appearing
- Check Firebase Console → Storage → Files
- Verify the file was uploaded successfully
- Check the download URL is accessible
- Ensure Storage bucket is in the same region as your app

### Quota Exceeded
- Check Firebase Console → Usage tab
- Upgrade to Blaze (pay-as-you-go) plan if needed
- Implement file cleanup for old images
- Consider compressing images before upload

## Firebase Project Info

- **Project ID**: `studio-1755608744-bec6d`
- **Storage Bucket**: `studio-1755608744-bec6d.firebasestorage.app`
- **Path**: `profile-images/`

## Support

For Firebase-specific issues:
- [Firebase Storage Documentation](https://firebase.google.com/docs/storage)
- [Storage Security Rules Guide](https://firebase.google.com/docs/storage/security)
- [Storage Rules Reference](https://firebase.google.com/docs/rules/rules-language)

