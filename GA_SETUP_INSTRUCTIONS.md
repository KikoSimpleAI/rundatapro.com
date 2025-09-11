# Google Analytics 4 Setup Instructions

## GDPR-Compliant Google Analytics 4 Implementation

This implementation includes a fully GDPR-compliant Google Analytics 4 setup with cookie consent management.

### Setup Steps:

1. **Create Google Analytics 4 Property:**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create a new GA4 property for your website
   - Copy your Measurement ID (format: G-XXXXXXXXXX)

2. **Update the Measurement ID:**
   - Open `index.html`
   - Find `GA_MEASUREMENT_ID` in the Google Analytics script
   - Replace `GA_MEASUREMENT_ID` with your actual Measurement ID
   - Example: `gtag('config', 'G-1234567890', {`

3. **GDPR Compliance Features:**
   - ✅ Cookie consent banner before any tracking
   - ✅ IP anonymization enabled
   - ✅ Google Signals disabled
   - ✅ Ad personalization disabled
   - ✅ Consent mode implementation
   - ✅ Granular cookie controls
   - ✅ Easy consent withdrawal

### Privacy Features:

- **Consent Mode**: Analytics only starts after explicit user consent
- **IP Anonymization**: All IP addresses are anonymized
- **No Cross-Site Tracking**: Google Signals disabled
- **No Ad Personalization**: Ad personalization signals disabled
- **Secure Cookies**: SameSite=Strict;Secure cookie flags
- **Local Storage**: Consent preferences stored locally

### Cookie Categories:

1. **Essential Cookies**: Always enabled (website functionality)
2. **Analytics Cookies**: Optional (Google Analytics tracking)

### User Experience:

- **First Visit**: Cookie banner appears at bottom of page
- **Consent Options**: Accept, Decline, or Manage preferences
- **Settings Modal**: Detailed cookie category controls
- **Persistent Choice**: User preference remembered across visits
- **Easy Withdrawal**: Users can change preferences anytime

### Legal Compliance:

- ✅ GDPR compliant (EU)
- ✅ Austrian data protection laws
- ✅ Clear privacy information
- ✅ Granular consent options
- ✅ Easy consent withdrawal
- ✅ No pre-checked boxes

### Testing:

1. Clear browser cookies and localStorage
2. Refresh the page
3. Cookie banner should appear
4. Test all consent options
5. Verify GA only loads after consent
6. Check browser developer tools for proper implementation

### Customization:

- Modify cookie banner text in `index.html`
- Adjust styling in `css/styles.css`
- Update privacy information as needed
- Add additional cookie categories if required

### Important Notes:

- Replace `GA_MEASUREMENT_ID` with your actual Google Analytics Measurement ID
- Test thoroughly before going live
- Consider adding a privacy policy page
- Monitor consent rates and user behavior
- Regular compliance reviews recommended
