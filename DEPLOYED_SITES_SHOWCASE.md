# Deployed Sites Showcase Feature

## Overview

After participants generate their prompt and build their site in Lovable, they can submit their deployed site URL to be showcased alongside other workshop participants. This creates social proof, celebration, and community engagement.

## User Flow

### Slide 13: Share Your Site! 🚀
Participants submit their deployed site:
1. Paste their site URL (e.g., `https://your-site.lovable.app`)
2. Enter a short description (max 60 characters)
3. Click "Submit My Site"
4. See success confirmation
5. Click "Next" to see the showcase

### Slide 14: You Just Built That! 🎉
Live showcase of all submitted sites:
- **3-column grid** on desktop (3x2 visible, scrollable for more)
- **2-column grid** on tablet
- **1-column grid** on mobile
- Each card shows:
  - Live iframe preview of the actual site (scaled to 50%)
  - Site description
  - Full URL
  - "Visit Site →" button on hover
- Clicking any card opens the site in a new tab
- Auto-refreshes every 10 seconds for new submissions

## Technical Implementation

### Firebase Firestore Collection

**Collection Name**: `deployed-sites`

**Document Structure**:
```javascript
{
  url: string,           // Full URL to deployed site
  description: string,   // Short description (max 60 chars)
  timestamp: number      // Unix timestamp (Date.now())
}
```

**Firestore Rules** (add to your Firebase console):
```javascript
match /deployed-sites/{siteId} {
  // Allow anyone to read
  allow read: if true;
  
  // Allow anyone to create (for workshop participants)
  allow create: if request.resource.data.keys().hasAll(['url', 'description', 'timestamp'])
                && request.resource.data.url is string
                && request.resource.data.description is string
                && request.resource.data.description.size() <= 60
                && request.resource.data.timestamp is number;
  
  // Deny updates and deletes (or restrict to admin only)
  allow update, delete: if false;
}
```

### API Route

**File**: `src/app/api/deployed-sites/route.ts`

**Endpoints**:

1. **GET** `/api/deployed-sites?limit=50`
   - Fetches deployed sites from Firestore
   - Sorted by timestamp (newest first)
   - Returns: `{ sites: DeployedSite[], total: number }`

2. **POST** `/api/deployed-sites`
   - Submits a new deployed site
   - Validates URL format (must be HTTP/HTTPS)
   - Truncates description to 60 characters
   - Returns: `{ success: true, site: DeployedSite }`

### Components

#### SubmitSiteStep (Slide 13)
**File**: `src/components/class-registration/steps/SubmitSiteStep.tsx`

**Features**:
- URL input with validation
- Description input with character counter (60 max)
- Submit button (disabled until valid)
- Loading state during submission
- Success state after submission
- Error handling with user-friendly messages
- Skip option (participants can proceed without submitting)

**Props**:
```typescript
interface SubmitSiteStepProps {
  onSubmit: (url: string, description: string) => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
  hasSubmitted: boolean;
}
```

#### CelebrationStep (Slide 14)
**File**: `src/components/class-registration/steps/CelebrationStep.tsx`

**Features**:
- Fetches sites from API on mount
- Polls every 10 seconds for new sites
- Displays sites in responsive grid (3x2 on desktop)
- iframe preview with 50% scale
- Click-through to open site in new tab
- Hover effects (shadow, overlay, "Visit Site →" button)
- Loading state
- Empty state (if no sites submitted yet)
- Scrollable container (max-height to avoid navigation overlap)

**iframe Implementation**:
```typescript
<iframe
  src={site.url}
  title={site.description}
  className="w-full h-full pointer-events-none transform scale-[0.5] origin-top-left"
  style={{
    width: '200%',
    height: '200%',
  }}
  sandbox="allow-same-origin"
/>
```

**Why this works**:
- `scale-[0.5]` shrinks the iframe to 50%
- `origin-top-left` ensures scaling from top-left corner
- `width: 200%` and `height: 200%` compensate for the 50% scale
- `pointer-events-none` prevents interaction with iframe
- `sandbox="allow-same-origin"` provides security (prevents scripts)
- Overlay div captures clicks to open site in new tab

## Security Considerations

### URL Validation
- Server-side validation ensures only HTTP/HTTPS URLs
- Client-side validation provides immediate feedback
- Malformed URLs are rejected before reaching Firestore

### iframe Sandbox
- `sandbox="allow-same-origin"` restricts iframe capabilities
- Prevents malicious scripts from running
- Prevents navigation/popups from iframe content
- `pointer-events-none` ensures iframe is non-interactive

### Firestore Security
- Read access: Public (anyone can view showcase)
- Write access: Anyone can create (for workshop participants)
- Update/Delete: Disabled (prevents tampering)
- Consider adding rate limiting in production

### Content Moderation
Currently no moderation system. Consider adding:
- Admin dashboard to review/remove inappropriate sites
- Flagging system for participants
- Automatic URL validation against known malicious domains
- Character limits prevent spam (60 chars for description)

## Testing Checklist

Before your first workshop:
- [ ] Submit a test site and verify it appears on Slide 14
- [ ] Test with multiple sites to verify grid layout
- [ ] Test scrolling with 10+ sites
- [ ] Verify iframe preview loads correctly
- [ ] Test click-through opens site in new tab
- [ ] Test on mobile/tablet (responsive grid)
- [ ] Verify auto-refresh (submit site in another browser, wait 10 sec)
- [ ] Test error handling (invalid URL, network error)
- [ ] Test skip functionality (proceed without submitting)
- [ ] Verify Firebase security rules are active

## Troubleshooting

### iframes Not Loading
**Issue**: Some sites may not load in iframes due to X-Frame-Options or CSP headers.

**Solution**: This is expected behavior for security. Sites that block iframes will show blank. The click-through still works, opening the site in a new tab.

**Alternative**: Consider using a screenshot service (e.g., ScreenshotAPI, Urlbox) to capture static images instead of live iframes.

### Slow Loading
**Issue**: Multiple iframes loading simultaneously can be slow.

**Solution**: 
- Limit initial display to 6-9 sites
- Lazy load iframes as user scrolls
- Consider screenshot service for better performance

### Firebase Quota
**Issue**: Free tier has limits (50K reads/day, 20K writes/day).

**Solution**:
- Monitor usage in Firebase console
- Upgrade to Blaze plan if needed (pay-as-you-go)
- Implement caching to reduce reads

## Future Enhancements

### Short-term:
1. **Screenshot Service**: Replace iframes with static screenshots for better performance
2. **Vote/Like System**: Let participants vote for their favorite sites
3. **Admin Moderation**: Dashboard to review/remove inappropriate submissions

### Long-term:
1. **Categories**: Let participants tag their site type (portfolio, business, etc.)
2. **Search/Filter**: Filter by category, search by description
3. **Export**: Download list of all participant sites (CSV)
4. **Analytics**: Track which sites get the most clicks
5. **Testimonials**: Collect feedback from participants about their experience

## Cost Estimate

### Firebase Firestore (Free Tier)
- 50K document reads/day
- 20K document writes/day
- 1GB storage

**Workshop with 70 participants**:
- 70 writes (site submissions)
- ~500 reads (70 participants × ~7 page loads each)
- Well within free tier limits

**Monthly (4 workshops)**:
- 280 writes
- 2,000 reads
- Still within free tier

### Paid Tier (if needed)
- $0.06 per 100K reads
- $0.18 per 100K writes
- Minimal cost even with heavy usage

## Summary

The Deployed Sites Showcase feature:
✅ Creates social proof (participants see others' success)  
✅ Builds community (shared accomplishment)  
✅ Increases engagement (participants want to see their site showcased)  
✅ Provides celebration moment (validates their achievement)  
✅ Encourages completion (motivation to finish and submit)  

**Result**: Higher completion rates, more engagement, and a memorable workshop experience that participants will want to share! 🚀

