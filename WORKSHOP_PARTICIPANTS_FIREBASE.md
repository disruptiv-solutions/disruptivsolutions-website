# Workshop Participants - Firebase Firestore Integration

## Overview

The workshop participants feature now uses Firebase Firestore for persistent storage with real-time updates. When a participant adds their information, it's immediately saved to Firestore and appears in real-time for all users viewing the page.

## How It Works

### Real-Time Updates
- **Firestore Listener**: The `ParticipantIntroductionStep` component uses Firestore's `onSnapshot` listener to receive real-time updates
- **Automatic Sync**: When any user adds a participant, all connected browsers see the update instantly
- **No Polling**: Unlike the previous implementation, there's no need for periodic API calls - Firestore pushes updates automatically

### Data Flow

1. **Adding a Participant**:
   - User fills out the form (name, location, what they want to build, color)
   - Form submission calls `addDoc()` directly to Firestore
   - Firestore listener automatically updates all connected clients
   - New sticky note appears at the top of the board

2. **Viewing Participants**:
   - Component sets up a real-time listener on mount
   - Listener queries the 100 most recent participants, sorted by timestamp (newest first)
   - Any changes to the collection trigger an automatic UI update

3. **Removing Participants**:
   - Individual sticky notes can be removed via `deleteDoc()`
   - "Clear Board" button removes all participants via batch `deleteDoc()` calls
   - Changes propagate in real-time to all viewers

## Firebase Configuration

### Collection Structure
- **Collection Name**: `workshop-participants`
- **Document Fields**:
  - `name` (string): Participant's name or "Anonymous"
  - `location` (string): City/location
  - `wantToBuild` (string): What they want to build (max 100 chars)
  - `timestamp` (number): Unix timestamp in milliseconds
  - `color` (string): Hex color code for sticky note background

### Firestore Rules (Recommended)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /workshop-participants/{document} {
      // Allow anyone to read participants
      allow read: if true;
      
      // Allow anyone to create participants (for workshop)
      allow create: if request.resource.data.keys().hasAll(['name', 'location', 'wantToBuild', 'timestamp', 'color'])
                    && request.resource.data.name is string
                    && request.resource.data.location is string
                    && request.resource.data.wantToBuild is string
                    && request.resource.data.timestamp is number
                    && request.resource.data.color is string;
      
      // Only allow delete from authenticated users (optional - for instructor control)
      // For now, allowing anyone to delete for the "Clear Board" feature
      allow delete: if true;
    }
  }
}
```

### Firestore Indexes

The query uses `orderBy('timestamp', 'desc')` with a `limit()`, which should work with Firestore's automatic indexing. If you encounter any errors about missing indexes, Firestore will provide a link to create the required composite index.

## API Routes

The API routes at `/api/workshop-participants` are still available but now interact with Firestore instead of in-memory storage:

- **GET**: Fetches participants from Firestore (used as fallback, but component uses direct listener)
- **POST**: Adds a new participant to Firestore (used as fallback, but component uses direct `addDoc`)
- **DELETE**: Removes participant(s) from Firestore (used as fallback, but component uses direct `deleteDoc`)

## Environment Variables

The Firebase configuration is set in `src/lib/firebase.ts` with the following environment variables (with fallback values):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCPXFfcgUvK1vsRf7dI6jsFvrls19i2hh8
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=studio-1755608744-bec6d.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=studio-1755608744-bec6d
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=studio-1755608744-bec6d.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=6023599771
NEXT_PUBLIC_FIREBASE_APP_ID=1:6023599771:web:5455d06d6236061c45183e
```

## Benefits Over Previous Implementation

1. **True Real-Time**: No polling interval, updates appear instantly
2. **Persistent Storage**: Data survives server restarts
3. **Scalable**: Firestore handles concurrent writes and reads efficiently
4. **No Server Load**: Real-time updates happen client-side via WebSocket
5. **Offline Support**: Firestore SDK includes offline persistence (can be enabled)
6. **Better Performance**: No lag when adding participants (previous polling approach caused browser lag)

## Testing

To test the real-time functionality:
1. Open the workshop page in two different browsers
2. Add a participant in one browser
3. The sticky note should appear instantly in both browsers
4. Remove or clear participants - changes appear everywhere immediately

## Troubleshooting

### "Firestore: client is offline" errors
- Check your Firebase project configuration
- Ensure Firestore is enabled in your Firebase console
- Verify the API key and project ID are correct

### Participants not appearing in real-time
- Check browser console for Firestore errors
- Verify Firestore rules allow read/write access
- Ensure the collection name matches: `workshop-participants`

### Performance issues
- The limit is set to 100 participants
- If you need more, consider implementing pagination or increasing the limit
- Monitor Firestore usage in Firebase console to track costs

