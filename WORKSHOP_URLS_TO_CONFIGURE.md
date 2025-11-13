# Workshop URLs to Configure

All the conversion URLs are already hardcoded in the components. You'll need to update these to point to your actual pages when ready.

## Current URLs in WhatsNextStep.tsx

Located in: `src/components/class-registration/steps/WhatsNextStep.tsx` (lines 3-9)

```typescript
const WAITLIST_URL = 'https://launchbox.ai/waitlist';
const NEWSLETTER_URL = 'https://ianmcdonald.ai/newsletter';
const COMMUNITY_URL = 'https://www.facebook.com/groups/ideatoai';
const CONNECT_URL = 'https://www.linkedin.com/in/ianmcdonald/';
const BOOTCAMP_URL = 'https://ianmcdonald.ai/bootcamp';
const CONSULTING_URL = 'https://ianmcdonald.ai/consulting';
const FEEDBACK_URL = 'https://ianmcdonald.ai/feedback';
```

## What Each URL Should Link To

### 1. **Launchbox Waitlist** (Primary CTA)
- Current: `https://launchbox.ai/waitlist`
- Purpose: Collect emails for Launchbox launch
- Tool suggestions: ConvertKit, Mailchimp, or custom landing page
- Expected conversion: 30-40% of attendees

### 2. **Newsletter Signup**
- Current: `https://ianmcdonald.ai/newsletter`
- Purpose: Future workshop announcements, AI tips, tools
- Tool suggestions: ConvertKit, Substack, Beehiiv
- Expected conversion: 50-60% of attendees

### 3. **Facebook Group**
- Current: `https://www.facebook.com/groups/ideatoai`
- Purpose: Community for builders helping builders
- Action: Create "Idea to AI" Facebook group if it doesn't exist
- Expected conversion: 40-50% of attendees

### 4. **LinkedIn/Social Connect**
- Current: `https://www.linkedin.com/in/ianmcdonald/`
- Purpose: Direct connection with you
- Action: Update to your actual LinkedIn profile URL
- Expected conversion: 20-30% of attendees

### 5. **Bootcamp Booking** (Revenue Generator)
- Current: `https://ianmcdonald.ai/bootcamp`
- Purpose: 4-week intensive ($297)
- Tool suggestions: 
  - Calendly + Stripe for payment
  - Teachable/Thinkific for course platform
  - Custom landing page with payment link
- Expected conversion: 10-15% of attendees = $2,079-2,970 revenue

### 6. **Consulting Booking** (High-Touch Revenue)
- Current: `https://ianmcdonald.ai/consulting`
- Purpose: 1-on-1 sessions ($197/90 min)
- Tool suggestions: Calendly with Stripe integration
- Expected conversion: 3-5% of attendees = $591-985 revenue

### 7. **Feedback Form**
- Current: `https://ianmcdonald.ai/feedback`
- Purpose: Improve future workshops, gather testimonials
- Tool suggestions: Google Forms, Typeform, Tally
- Expected completion: 30-40% of attendees

## Quick Setup Priority

### Immediate (Before First Workshop):
1. ✅ **Feedback Form** - Google Form (5 min setup)
2. ✅ **Newsletter** - ConvertKit landing page (10 min)
3. ✅ **Facebook Group** - Create group (5 min)

### High Priority (Within 24 hours):
4. ✅ **Launchbox Waitlist** - Landing page with email capture
5. ✅ **Consulting Booking** - Calendly link

### Can Wait (Within 1 week):
6. ⏳ **Bootcamp Page** - Full landing page with payment

## Revenue Potential (70 attendees)

| Offer | Conversion | # People | Price | Revenue |
|-------|-----------|----------|-------|---------|
| Bootcamp | 10-15% | 7-10 | $297 | $2,079-2,970 |
| Consulting | 3-5% | 2-3 | $197 | $394-591 |
| **Total Immediate** | | | | **$2,473-3,561** |
| Launchbox Waitlist | 30-40% | 21-28 | Future | Future Revenue |
| Newsletter | 50-60% | 35-42 | Free | Audience Growth |

## Recommended Tools

### For Quick Setup:
- **Forms**: Google Forms (free)
- **Email**: ConvertKit (free up to 1,000 subscribers)
- **Scheduling**: Calendly (free tier works)
- **Payments**: Stripe (2.9% + 30¢ per transaction)
- **Landing Pages**: Carrd.co ($19/year) or your own site

### For Long-Term:
- **Course Platform**: Teachable or Thinkific
- **Email Marketing**: ConvertKit or ActiveCampaign
- **CRM**: HubSpot (free tier) or Notion

## How to Update URLs

When you have your actual URLs ready, update them in:

**File**: `src/components/class-registration/steps/WhatsNextStep.tsx`

**Lines 3-9**: Change the URL constants

```typescript
// Example:
const WAITLIST_URL = 'https://your-actual-domain.com/waitlist';
const NEWSLETTER_URL = 'https://your-actual-domain.com/newsletter';
// etc.
```

## Share Workshop URL

The "Share This Workshop" button on Slide 13 automatically copies:
```
https://[your-domain]/free-class/1
```

This is dynamically generated from `window.location.origin`, so it will work on any domain.

## Testing Checklist

Before your first workshop:
- [ ] Click every button to verify links work
- [ ] Test form submissions
- [ ] Verify payment links process correctly
- [ ] Check mobile responsiveness of all landing pages
- [ ] Set up email notifications for new signups
- [ ] Prepare welcome emails for each list

## Post-Workshop Follow-Up Sequence

**Email 1** (Within 1 hour):
- Workshop resources
- Prompt retrieval link
- Lovable tutorial
- Bootcamp/consulting offer (48-hour timer starts)

**Email 2** (24 hours later):
- Request feedback
- Remind about bootcamp offer
- Share social proof

**Email 3** (48 hours - Final reminder):
- Bootcamp offer expires tonight
- Scarcity (X spots left)
- Last chance CTA

---

**Need help setting any of these up? Let me know which ones you want to tackle first!**

