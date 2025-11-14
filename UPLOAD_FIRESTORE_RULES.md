# 📤 How to Upload Firestore Rules to Firebase

## Quick Steps:

1. **Open Firebase Console**
   - Go to: https://console.firebase.google.com/
   - Select your project: `studio-1755608744-bec6d`

2. **Navigate to Firestore Rules**
   - Click **Firestore Database** in the left sidebar
   - Click the **Rules** tab at the top

3. **Copy Rules**
   - Open the `firestore.rules` file in your project
   - Select all content (Ctrl+A / Cmd+A)
   - Copy it (Ctrl+C / Cmd+C)

4. **Paste into Firebase Console**
   - Delete all existing rules in the Firebase Console editor
   - Paste the copied rules (Ctrl+V / Cmd+V)

5. **Publish**
   - Click the **Publish** button
   - Wait for confirmation that rules are published

6. **Verify**
   - You should see a success message
   - Rules are now active!

## ✅ What These Rules Do:

- **Resources Collection:**
  - ✅ Public can read published resources
  - ✅ Authenticated users can read drafts
  - ✅ Writes allowed (admin verified in API routes)

- **Workshop Participants:**
  - ✅ Public read
  - ✅ Anyone can create
  - ✅ Users can update their own data
  - ✅ Only admins can delete

- **Deployed Sites:**
  - ✅ Public read
  - ✅ Anyone can submit
  - ✅ Only admins can delete

- **Default:**
  - ✅ All other collections are denied

## 🔒 Admin UID:
Current admin: `Pw6izWRUHzam4qPrmEeE56fFsYC2`

To add more admins, add their UID to the `isAdmin()` function array.

---

**That's it!** Once published, your permission errors should be resolved. 🎉

