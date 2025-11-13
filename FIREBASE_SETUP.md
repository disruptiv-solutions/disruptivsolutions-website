# Firebase Firestore Setup

**Note**: Firebase integration has been temporarily disabled to improve performance. The poll currently uses in-memory storage (data resets on server restart). Firebase can be re-enabled later for persistence.

## Current Implementation

The poll currently uses **in-memory storage** for fast performance:
- No external database connections
- Instant response times
- No browser lag
- Data is shared across all users during the session
- Data resets when the server restarts

## Future Firebase Integration

If you want to add Firebase Firestore for persistence later, here's what you'll need:

### Firebase Configuration

Your Firebase project details:
- **Project ID**: `studio-1755608744-bec6d`
- **API Key**: `AIzaSyCPXFfcgUvK1vsRf7dI6jsFvrls19i2hh8`
- **Auth Domain**: `studio-1755608744-bec6d.firebaseapp.com`

### Firestore Database Structure

When implementing Firebase, the poll votes would be stored at:
- **Collection**: `polls`
- **Document ID**: `ai-knowledge-poll`
- **Fields**:
  - `clueless` (number)
  - `little` (number)
  - `goodAmount` (number)
  - `expert` (number)

### Setting Up Firestore (For Future Use)

1. **Enable Firestore Database**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project: `studio-1755608744-bec6d`
   - Navigate to "Firestore Database" in the left sidebar
   - Click "Create database"
   - Choose "Start in test mode" (for development) or "Start in production mode"
   - Select a location for your database
   - Click "Enable"

2. **Set Firestore Security Rules**:
   - In Firestore Database, go to the "Rules" tab
   - Update the rules to allow read/write access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /polls/{pollId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

   - Click "Publish" to save the rules

**Note**: For production, implement proper security rules to prevent abuse (e.g., rate limiting, authentication).

### Implementation Notes

When re-enabling Firebase:
- Use Firebase Admin SDK for server-side API routes (not client SDK)
- Consider using Firebase REST API for simpler implementation
- Add proper error handling and fallback mechanisms
- Test connection timeouts and performance impact

