# Placeholder Credentials - Configuration Guide

This document lists all placeholder credentials that need to be replaced before the NHS Scholarship Fund donation website goes live.

## Quick Reference

| Service | Placeholder | File Location | Documentation |
|---------|-------------|---------------|---------------|
| PayPal | `YOUR_PAYPAL_CLIENT_ID_HERE` | `index.html` (line ~267) | [PAYPAL_INTEGRATION.md](../PAYPAL_INTEGRATION.md) |
| Venmo | Uses PayPal Client ID | Same as PayPal | [VENMO_INTEGRATION.md](../VENMO_INTEGRATION.md) |
| Google Pay | `YOUR_GOOGLE_MERCHANT_ID_HERE` | `js/payments/googlepay.js` (line ~43) | [GOOGLEPAY_INTEGRATION.md](../GOOGLEPAY_INTEGRATION.md) |
| Google Pay | `YOUR_GATEWAY_MERCHANT_ID_HERE` | `js/payments/googlepay.js` (line ~64) | [GOOGLEPAY_INTEGRATION.md](../GOOGLEPAY_INTEGRATION.md) |
| Apple Pay | `YOUR_APPLE_MERCHANT_ID_HERE` | `js/payments/applepay.js` (line ~42) | [APPLEPAY_INTEGRATION.md](../APPLEPAY_INTEGRATION.md) |

---

## PayPal Configuration

### Location
- **File**: `index.html`
- **Line**: ~267 (PayPal SDK script tag)

### Current Placeholder
```html
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID_HERE&currency=USD&intent=capture&enable-funding=venmo"></script>
```

### How to Get Your Client ID
1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/applications/sandbox) (sandbox) or [Live](https://developer.paypal.com/dashboard/applications/live)
2. Log in with PayPal Business account credentials
3. Create a new app or use the default sandbox app
4. Copy the **Client ID**
5. Replace `YOUR_PAYPAL_CLIENT_ID_HERE` with your actual Client ID

### Sandbox vs Production
- **Sandbox Client ID**: Starts with `sb-` (for testing)
- **Live Client ID**: Starts with `A` (for production)

---

## Venmo Configuration

Venmo uses the PayPal SDK, so **no separate configuration is needed**. Once PayPal is configured:

1. Ensure the SDK URL includes `enable-funding=venmo`
2. Enable Venmo in your PayPal Business account settings:
   - Log into PayPal Business Dashboard
   - Go to Account Settings > Payment Preferences
   - Enable Venmo as a payment option

---

## Google Pay Configuration

### Location
- **File**: `js/payments/googlepay.js`
- **Lines**: 43 (merchantId), 64 (gatewayMerchantId)

### Placeholders to Replace

#### 1. Google Merchant ID
```javascript
merchantId: 'YOUR_GOOGLE_MERCHANT_ID_HERE',
```

**How to get**:
1. Go to [Google Pay & Wallet Console](https://pay.google.com/business/console)
2. Register your business
3. Create a new integration (Web)
4. Copy your Merchant ID

#### 2. Payment Gateway Configuration
```javascript
gateway: 'example',
gatewayMerchantId: 'YOUR_GATEWAY_MERCHANT_ID_HERE'
```

**Choose your payment gateway** (one of):
- **Stripe**: Use `gateway: 'stripe'` and add `'stripe:publishableKey': 'pk_xxx'`
- **Braintree**: Use `gateway: 'braintree'` with Braintree credentials
- **Other**: See [Google Pay documentation](https://developers.google.com/pay/api/web/guides/tutorial)

### Environment Setting
Change `environment` from `'TEST'` to `'PRODUCTION'` when ready to go live:
```javascript
environment: 'PRODUCTION', // Change from 'TEST'
```

---

## Apple Pay Configuration

### Location
- **File**: `js/payments/applepay.js`
- **Line**: 42

### Placeholder
```javascript
merchantId: 'YOUR_APPLE_MERCHANT_ID_HERE',
```

### Requirements
Apple Pay has additional requirements beyond just the Merchant ID:

1. **Apple Developer Account** with Apple Pay capability
2. **Merchant ID** registered with Apple
   - Format: `merchant.com.yourcompany.yourapp`
   - Register at [Apple Developer Portal](https://developer.apple.com/account/resources/identifiers)
3. **Payment Processing Certificate**
4. **Domain Verification** - Apple requires you to host a verification file
5. **HTTPS** - Required for Apple Pay (no HTTP)
6. **Server-side endpoint** for merchant validation

### Server-Side Requirement
Apple Pay requires a server endpoint to validate the merchant session. Update this in the config:
```javascript
merchantValidationEndpoint: '/api/apple-pay/validate-merchant'
```

Your server must:
1. Receive the validation URL from Apple
2. Call Apple's validation endpoint with your merchant certificate
3. Return the merchant session to the client

---

## Testing Checklist

Before going live, verify:

- [ ] PayPal sandbox payments work
- [ ] Venmo appears as payment option (US only)
- [ ] Google Pay TEST mode works
- [ ] Apple Pay shows on Safari (if configured)
- [ ] All placeholder values have been replaced
- [ ] Environment settings changed from TEST/sandbox to PRODUCTION/live

---

## Security Notes

1. **Never commit real credentials** to version control
2. Consider using environment variables for production
3. Keep sandbox/test credentials separate from production
4. Rotate credentials if they are ever exposed
5. Use `.gitignore` to exclude any config files with real credentials

---

## Support

For integration support:
- **PayPal**: [PayPal Developer Support](https://developer.paypal.com/support/)
- **Google Pay**: [Google Pay Support](https://support.google.com/pay/business/)
- **Apple Pay**: [Apple Developer Support](https://developer.apple.com/support/)
