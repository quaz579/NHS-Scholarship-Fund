# Apple Pay Integration Plan

## Overview

This document provides step-by-step instructions for integrating Apple Pay as a payment method for the NHS Scholarship Fund donation website.

### Why Apple Pay?
Apple Pay provides a seamless checkout experience for iOS and macOS users. It's particularly popular on Safari browsers and Apple devices, offering strong security through Face ID, Touch ID, or device passcode authentication.

### Prerequisites
- [ ] Apple Developer Account ($99/year)
- [ ] Merchant ID configured in Apple Developer Portal
- [ ] Payment processor that supports Apple Pay (e.g., Stripe, Braintree)
- [ ] Completed base website (Phase 1-4 of main PLAN.md)
- [ ] HTTPS-enabled website (absolutely required for Apple Pay)
- [ ] Domain verification with Apple

### Important Notes
- Apple Pay REQUIRES HTTPS in production (no exceptions)
- Apple Pay only works on Safari (macOS/iOS) and in native apps
- Testing requires real Apple Pay cards (no sandbox cards)
- Domain verification is required before Apple Pay will work

---

## Nonprofit Fee Considerations

> ℹ️ **Important**: Apple charges no fees, but your payment processor and Apple Developer account do have costs.

### How Apple Pay Fees Work

Like Google Pay, Apple Pay is a **payment method**, not a processor:
1. Apple Pay securely provides card/payment details
2. Your **payment processor** (Stripe, Braintree) charges their standard fee
3. Apple charges **nothing** for Apple Pay transactions

### Cost Breakdown

| Cost Type | Amount | Notes |
|-----------|--------|-------|
| Apple Pay transaction fee | **$0** | Apple charges nothing |
| Apple Developer Account | **$99/year** | Required for Apple Pay integration |
| Payment processor fee | Varies | See comparison below |

### Payment Processor Fees (with Apple Pay)

| Payment Processor | Standard Fee | Nonprofit Fee* |
|-------------------|--------------|----------------|
| Stripe | 2.9% + $0.30 | 2.2% + $0.30 |
| Braintree/PayPal | 2.89% + $0.49 | 1.99% + $0.49 |

*Requires nonprofit verification with processor

### Nonprofit Eligibility for Apple Pay

To use Apple Pay for donations, your organization must meet **one** of these requirements:

**Option 1: Candid Seal of Transparency**
- Register at [candid.org](https://www.candid.org/) (formerly GuideStar)
- Obtain a 2025 Seal of Transparency (Bronze, Silver, Gold, or Platinum)
- Provides credibility and meets Apple's requirements

**Option 2: Benevity Verification**
- [Benevity](https://www.benevity.com/) is an Apple partner for nonprofit verification
- They vet and approve organizations for Apple Pay eligibility
- May have additional requirements/fees

### Total Cost Example ($50 donation via Apple Pay + Stripe)

| Item | Cost |
|------|------|
| Apple Pay fee | $0 |
| Stripe nonprofit fee | $1.40 (2.2% + $0.30) |
| **Net to charity** | **$48.60** |
| Apple Developer Account | $99/year (one-time annual cost) |

### Recommendation for NHS Scholarship Fund

**Apple Pay is worth including** despite the $99/year developer fee because:
1. High adoption among Apple users (500M+ users worldwide)
2. 41% growth in Apple Pay usage (2022-2024)
3. Seamless checkout increases conversion rates
4. No per-transaction fees from Apple

**Break-even analysis**: At 2.2% + $0.30 Stripe fee, you'd need ~$4,500 in annual Apple Pay donations to justify the $99 developer fee (less than 1% overhead).

### Pre-Launch Checklist

- [ ] Verify NHS Scholarship Fund has/can get Candid Seal of Transparency
- [ ] Enroll in Apple Developer Program ($99/year)
- [ ] Apply for Stripe nonprofit discount (if using Stripe)
- [ ] Complete domain verification with Apple
- [ ] Generate required certificates

### Important: Recurring Donations Limitation

Apple Pay tokens change when:
- User gets a new device
- User updates their credit card
- Card expires

This makes recurring donations challenging with Apple Pay. For recurring gifts, recommend PayPal/Venmo subscription features instead.

---

## Phase 1: Apple Developer Account Setup

### Task 1.1: Access Apple Developer Portal
- [ ] Go to https://developer.apple.com/
- [ ] Sign in with Apple Developer Account
- [ ] Navigate to Certificates, Identifiers & Profiles

**Testing Checkpoint 1.1:**
- [ ] Can access Apple Developer Portal

### Task 1.2: Create Merchant ID
- [ ] Go to Identifiers section
- [ ] Click "+" to add new identifier
- [ ] Select "Merchant IDs"
- [ ] Enter description: "NHS Scholarship Fund Donations"
- [ ] Enter identifier: `merchant.org.negauneeschools.donations`
- [ ] Click Continue and Register

**Testing Checkpoint 1.2:**
- [ ] Merchant ID appears in identifiers list
- [ ] Identifier format is correct

### Task 1.3: Create Payment Processing Certificate
- [ ] Select your Merchant ID
- [ ] Under "Apple Pay Payment Processing Certificate", click "Create Certificate"
- [ ] Follow CSR generation steps (or get from payment processor)
- [ ] Upload CSR and download certificate
- [ ] Install certificate or provide to payment processor

**Testing Checkpoint 1.3:**
- [ ] Payment Processing Certificate created
- [ ] Certificate downloaded

### Task 1.4: Create Merchant Identity Certificate
- [ ] Under "Apple Pay Merchant Identity Certificate", click "Create Certificate"
- [ ] Generate CSR and upload
- [ ] Download certificate
- [ ] This is used for server-side communication with Apple Pay

**Testing Checkpoint 1.4:**
- [ ] Merchant Identity Certificate created
- [ ] Certificate installed on server

---

## Phase 2: Domain Verification

### Task 2.1: Register Domain with Apple
- [ ] In Apple Developer Portal, go to Merchant ID
- [ ] Under "Merchant Domains", click "Add Domain"
- [ ] Enter your website domain (e.g., `donate.negauneeschools.org`)

**Testing Checkpoint 2.1:**
- [ ] Domain added to list (pending verification)

### Task 2.2: Download Verification File
- [ ] Download the domain verification file from Apple
- [ ] File is typically named `apple-developer-merchantid-domain-association`

**Testing Checkpoint 2.2:**
- [ ] Verification file downloaded

### Task 2.3: Host Verification File
- [ ] Create directory: `/.well-known/` in your web root
- [ ] Place the verification file at:
  `https://yourdomain.com/.well-known/apple-developer-merchantid-domain-association`
- [ ] Ensure no extension is added to the filename
- [ ] File must be served with correct content type

```
Project structure:
/
├── .well-known/
│   └── apple-developer-merchantid-domain-association
├── index.html
└── ...
```

**Testing Checkpoint 2.3:**
- [ ] File accessible at the correct URL
- [ ] No 404 or redirect errors
- [ ] File served with `text/plain` or `application/octet-stream` content type

### Task 2.4: Verify Domain
- [ ] Return to Apple Developer Portal
- [ ] Click "Verify" next to your domain
- [ ] Wait for verification to complete

**Testing Checkpoint 2.4:**
- [ ] Domain shows "Verified" status in portal

---

## Phase 3: Basic Apple Pay Integration

### Task 3.1: Check Apple Pay Availability
- [ ] Create `js/payments/applepay.js`:
  ```javascript
  // Apple Pay Integration for NHS Scholarship Fund
  
  // Check if Apple Pay is available
  function checkApplePayAvailability() {
    if (window.ApplePaySession) {
      // Check if the device can make payments
      if (ApplePaySession.canMakePayments()) {
        console.log('Apple Pay is available');
        return true;
      } else {
        console.log('Apple Pay is available but no cards set up');
        return false;
      }
    } else {
      console.log('Apple Pay is not available on this device/browser');
      return false;
    }
  }
  
  // Check if user has cards that can make payments
  function canMakeApplePayPayments() {
    return new Promise((resolve) => {
      if (!window.ApplePaySession) {
        resolve(false);
        return;
      }
      
      // Check if user has cards set up
      ApplePaySession.canMakePaymentsWithActiveCard('merchant.org.negauneeschools.donations')
        .then((canMake) => resolve(canMake))
        .catch(() => resolve(false));
    });
  }
  ```

**Testing Checkpoint 3.1:**
- [ ] Script loads without errors
- [ ] `checkApplePayAvailability()` returns correct result on Safari

### Task 3.2: Create Apple Pay Button Container
- [ ] Add container in `index.html`:
  ```html
  <div id="apple-pay-button-container">
    <apple-pay-button 
      buttonstyle="black" 
      type="donate" 
      locale="en-US"
      onclick="onApplePayButtonClicked()">
    </apple-pay-button>
  </div>
  ```

- [ ] Or use CSS-based button:
  ```html
  <style>
    #apple-pay-button {
      display: inline-block;
      -webkit-appearance: -apple-pay-button;
      -apple-pay-button-type: donate;
      -apple-pay-button-style: black;
      width: 100%;
      max-width: 400px;
      height: 48px;
      cursor: pointer;
    }
  </style>
  
  <div id="apple-pay-button-container">
    <button id="apple-pay-button" onclick="onApplePayButtonClicked()"></button>
  </div>
  ```

**Testing Checkpoint 3.2:**
- [ ] Apple Pay button appears in Safari
- [ ] Button has correct Apple Pay styling

### Task 3.3: Conditionally Show Button
- [ ] Add initialization code:
  ```javascript
  document.addEventListener('DOMContentLoaded', function() {
    initApplePay();
  });
  
  function initApplePay() {
    const container = document.getElementById('apple-pay-button-container');
    
    if (!checkApplePayAvailability()) {
      container.style.display = 'none';
      return;
    }
    
    canMakeApplePayPayments().then((canMake) => {
      if (!canMake) {
        container.innerHTML = '<p class="unavailable">Please set up Apple Pay to use this payment method.</p>';
      }
    });
  }
  ```

**Testing Checkpoint 3.3:**
- [ ] Button only appears on Apple Pay-capable devices
- [ ] Message appears if Apple Pay not set up

---

## Phase 4: Payment Processing

### Task 4.1: Create Payment Request
- [ ] Add payment request function:
  ```javascript
  function createApplePayRequest(amount) {
    return {
      countryCode: 'US',
      currencyCode: 'USD',
      supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
      merchantCapabilities: ['supports3DS', 'supportsDebit', 'supportsCredit'],
      total: {
        label: 'NHS Scholarship Fund Donation',
        amount: amount,
        type: 'final'
      },
      requiredBillingContactFields: ['email', 'name'],
      // Optional: collect additional info
      // requiredShippingContactFields: ['phone']
    };
  }
  ```

**Testing Checkpoint 4.1:**
- [ ] Payment request object is properly structured

### Task 4.2: Handle Button Click
- [ ] Add click handler:
  ```javascript
  function onApplePayButtonClicked() {
    const amount = getDonationAmount();
    
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }
    
    const request = createApplePayRequest(amount);
    
    // Create Apple Pay session
    const session = new ApplePaySession(6, request);
    
    // Handle merchant validation
    session.onvalidatemerchant = (event) => {
      validateMerchant(event.validationURL)
        .then((merchantSession) => {
          session.completeMerchantValidation(merchantSession);
        })
        .catch((error) => {
          console.error('Merchant validation failed:', error);
          session.abort();
        });
    };
    
    // Handle payment authorization
    session.onpaymentauthorized = (event) => {
      processApplePayPayment(event.payment)
        .then((success) => {
          session.completePayment(
            success 
              ? ApplePaySession.STATUS_SUCCESS 
              : ApplePaySession.STATUS_FAILURE
          );
          
          if (success) {
            window.location.href = 'pages/thank-you.html?method=applepay&amount=' + 
              encodeURIComponent(amount);
          }
        });
    };
    
    // Handle cancel
    session.oncancel = (event) => {
      console.log('Apple Pay cancelled by user');
    };
    
    // Start the session
    session.begin();
  }
  ```

**Testing Checkpoint 4.2:**
- [ ] Clicking button opens Apple Pay sheet
- [ ] Cancel is handled gracefully

### Task 4.3: Implement Merchant Validation
- [ ] Merchant validation requires server-side code:
  ```javascript
  async function validateMerchant(validationURL) {
    // This MUST be done server-side for security
    // The server calls Apple's validation endpoint with your merchant certificate
    
    const response = await fetch('/api/apple-pay/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        validationURL: validationURL
      })
    });
    
    if (!response.ok) {
      throw new Error('Merchant validation failed');
    }
    
    return response.json();
  }
  ```

**Server-side endpoint (Node.js example)**:
```javascript
// server/apple-pay-validate.js
const express = require('express');
const https = require('https');
const fs = require('fs');

const app = express();
app.use(express.json());

app.post('/api/apple-pay/validate', (req, res) => {
  const { validationURL } = req.body;
  
  const merchantIdentityCert = fs.readFileSync('./certs/merchant-identity.pem');
  const merchantIdentityKey = fs.readFileSync('./certs/merchant-identity-key.pem');
  
  const data = JSON.stringify({
    merchantIdentifier: 'merchant.org.negauneeschools.donations',
    displayName: 'NHS Scholarship Fund',
    initiative: 'web',
    initiativeContext: 'donate.negauneeschools.org'
  });
  
  const options = {
    method: 'POST',
    cert: merchantIdentityCert,
    key: merchantIdentityKey,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };
  
  const request = https.request(validationURL, options, (response) => {
    let body = '';
    response.on('data', chunk => body += chunk);
    response.on('end', () => res.json(JSON.parse(body)));
  });
  
  request.on('error', (error) => {
    res.status(500).json({ error: error.message });
  });
  
  request.write(data);
  request.end();
});
```

**Testing Checkpoint 4.3:**
- [ ] Merchant validation endpoint works
- [ ] Apple Pay sheet shows your merchant name

### Task 4.4: Process Payment
- [ ] Add payment processing function:
  ```javascript
  async function processApplePayPayment(payment) {
    try {
      // Payment contains the encrypted payment token
      const token = payment.token;
      
      // Extract billing info if requested
      const billingContact = payment.billingContact;
      const donorEmail = billingContact?.emailAddress;
      const donorName = billingContact?.givenName + ' ' + billingContact?.familyName;
      
      // Send token to your payment processor
      const response = await fetch('/api/process-donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: 'apple_pay',
          token: token.paymentData,
          amount: getDonationAmount(),
          donorName: donorName,
          donorEmail: donorEmail
        })
      });
      
      return response.ok;
    } catch (error) {
      console.error('Payment processing error:', error);
      return false;
    }
  }
  ```

**Testing Checkpoint 4.4:**
- [ ] Payment token is received
- [ ] Token is sent to server for processing
- [ ] Success/failure status is returned

---

## Phase 5: Testing Apple Pay

### Task 5.1: Test on macOS Safari
- [ ] Open donation page in Safari on Mac
- [ ] Ensure Apple Pay button appears
- [ ] Click button
- [ ] Use Touch ID or click-to-pay
- [ ] Complete test payment

**Testing Checkpoint 5.1:**
- [ ] Apple Pay sheet appears
- [ ] Touch ID/password authentication works
- [ ] Payment completes (or fails expectedly in test)

### Task 5.2: Test on iOS Safari
- [ ] Open donation page on iPhone/iPad
- [ ] Apple Pay button should appear
- [ ] Tap button
- [ ] Use Face ID or Touch ID
- [ ] Complete test payment

**Testing Checkpoint 5.2:**
- [ ] Apple Pay sheet appears on iOS
- [ ] Face ID/Touch ID works
- [ ] Payment completes

### Task 5.3: Test Error Scenarios
- [ ] Cancel payment mid-flow
- [ ] Test merchant validation failure (disconnect server)
- [ ] Test payment processing failure

**Testing Checkpoint 5.3:**
- [ ] Cancellation handled gracefully
- [ ] Error messages are user-friendly
- [ ] User can retry payment

### Task 5.4: Test with Sandbox Environment
Note: Apple Pay doesn't have a true sandbox. Testing options:
- [ ] Use Stripe test mode (processes Apple Pay without charging)
- [ ] Use small real transactions and refund immediately
- [ ] Test on iOS Simulator (limited functionality)

**Testing Checkpoint 5.4:**
- [ ] Understand testing limitations
- [ ] Have a testing strategy in place

---

## Phase 6: Production Setup

### Task 6.1: Verify Domain in Production
- [ ] Ensure domain verification file is on production server
- [ ] Verify domain is marked as verified in Apple Developer Portal
- [ ] Test verification file is accessible via HTTPS

**Testing Checkpoint 6.1:**
- [ ] Production domain verified

### Task 6.2: Install Certificates on Production Server
- [ ] Install Payment Processing Certificate
- [ ] Install Merchant Identity Certificate
- [ ] Ensure certificates are secure and not publicly accessible

**Testing Checkpoint 6.2:**
- [ ] Certificates installed
- [ ] Server can communicate with Apple

### Task 6.3: Perform Live Test
- [ ] Make a small real donation using Apple Pay
- [ ] Verify payment is processed correctly
- [ ] Verify receipt/confirmation
- [ ] Optionally refund the test payment

**Testing Checkpoint 6.3:**
- [ ] Real Apple Pay payment succeeds
- [ ] Funds received correctly

---

## Troubleshooting Guide

### Common Issues

#### Apple Pay button doesn't appear
1. Ensure you're using Safari (macOS or iOS)
2. Check if `ApplePaySession` is available in console
3. Verify Apple Pay is set up on the device
4. Ensure page is served over HTTPS

#### "Payment not completed" error
1. Check merchant validation is succeeding
2. Verify certificates are valid and not expired
3. Check server logs for errors

#### Merchant validation fails
1. Verify Merchant Identity Certificate is correct
2. Check domain matches what's registered
3. Ensure validationURL is being passed correctly
4. Check certificate is not expired

#### Payment sheet shows wrong merchant name
1. Check `displayName` in merchant validation request
2. Verify Merchant ID configuration in Apple Portal

#### Works on macOS but not iOS
1. Both require same configuration
2. Check iOS device has cards set up
3. Test on real device (not simulator)

---

## Complete Code Reference

### Client-Side (js/payments/applepay.js)

```javascript
// Apple Pay Integration for NHS Scholarship Fund

const MERCHANT_IDENTIFIER = 'merchant.org.negauneeschools.donations';

function checkApplePayAvailability() {
  return window.ApplePaySession && ApplePaySession.canMakePayments();
}

async function canMakeApplePayPayments() {
  if (!window.ApplePaySession) return false;
  try {
    return await ApplePaySession.canMakePaymentsWithActiveCard(MERCHANT_IDENTIFIER);
  } catch {
    return false;
  }
}

function initApplePay() {
  const container = document.getElementById('apple-pay-button-container');
  
  if (!checkApplePayAvailability()) {
    container.style.display = 'none';
    return;
  }
  
  canMakeApplePayPayments().then((canMake) => {
    if (!canMake) {
      container.innerHTML = '<p>Set up Apple Pay to donate</p>';
    } else {
      showApplePayButton();
    }
  });
}

function showApplePayButton() {
  const container = document.getElementById('apple-pay-button-container');
  container.innerHTML = '<button id="apple-pay-button" onclick="onApplePayButtonClicked()"></button>';
}

function getDonationAmount() {
  const customAmount = document.getElementById('custom-amount');
  const selectedPreset = document.querySelector('.amount-btn.selected');
  
  if (customAmount && customAmount.value) {
    return parseFloat(customAmount.value).toFixed(2);
  } else if (selectedPreset) {
    return parseFloat(selectedPreset.dataset.amount).toFixed(2);
  }
  return '0.00';
}

function createApplePayRequest(amount) {
  return {
    countryCode: 'US',
    currencyCode: 'USD',
    supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
    merchantCapabilities: ['supports3DS'],
    total: {
      label: 'NHS Scholarship Fund Donation',
      amount: amount,
      type: 'final'
    },
    requiredBillingContactFields: ['email', 'name']
  };
}

function onApplePayButtonClicked() {
  const amount = getDonationAmount();
  
  if (!amount || parseFloat(amount) <= 0) {
    alert('Please enter a valid donation amount.');
    return;
  }
  
  const request = createApplePayRequest(amount);
  const session = new ApplePaySession(6, request);
  
  session.onvalidatemerchant = async (event) => {
    try {
      const merchantSession = await validateMerchant(event.validationURL);
      session.completeMerchantValidation(merchantSession);
    } catch (error) {
      console.error('Merchant validation failed:', error);
      session.abort();
    }
  };
  
  session.onpaymentauthorized = async (event) => {
    const success = await processApplePayPayment(event.payment);
    session.completePayment(
      success ? ApplePaySession.STATUS_SUCCESS : ApplePaySession.STATUS_FAILURE
    );
    
    if (success) {
      window.location.href = 'pages/thank-you.html?method=applepay&amount=' + 
        encodeURIComponent(amount);
    }
  };
  
  session.oncancel = () => {
    console.log('Apple Pay cancelled');
  };
  
  session.begin();
}

async function validateMerchant(validationURL) {
  const response = await fetch('/api/apple-pay/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ validationURL })
  });
  
  if (!response.ok) throw new Error('Validation failed');
  return response.json();
}

async function processApplePayPayment(payment) {
  try {
    const response = await fetch('/api/process-donation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentMethod: 'apple_pay',
        token: payment.token.paymentData,
        amount: getDonationAmount(),
        donorName: payment.billingContact?.givenName + ' ' + payment.billingContact?.familyName,
        donorEmail: payment.billingContact?.emailAddress
      })
    });
    
    return response.ok;
  } catch (error) {
    console.error('Payment processing error:', error);
    return false;
  }
}

document.addEventListener('DOMContentLoaded', initApplePay);
```

### CSS for Apple Pay Button

```css
/* Apple Pay button styles */
#apple-pay-button-container {
  margin: 16px 0;
  display: flex;
  justify-content: center;
}

#apple-pay-button {
  display: inline-block;
  -webkit-appearance: -apple-pay-button;
  -apple-pay-button-type: donate;
  -apple-pay-button-style: black;
  width: 100%;
  max-width: 400px;
  height: 48px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
}

/* Hide on non-Apple browsers */
@supports not (-webkit-appearance: -apple-pay-button) {
  #apple-pay-button-container {
    display: none;
  }
}
```

---

## Integration Notes for Pure HTML/JS

Since Apple Pay requires server-side merchant validation, a minimal server is needed. Options:

1. **Serverless Functions**: Use AWS Lambda, Vercel Functions, or Netlify Functions
2. **Simple Node.js Server**: Express server with validation endpoint
3. **Payment Processor Helpers**: Stripe/Braintree provide simplified Apple Pay integration

### Using Stripe for Simplified Integration

Stripe handles much of the Apple Pay complexity:

```javascript
// Using Stripe for Apple Pay
const stripe = Stripe('pk_test_XXXX');
const paymentRequest = stripe.paymentRequest({
  country: 'US',
  currency: 'usd',
  total: {
    label: 'NHS Scholarship Fund Donation',
    amount: getDonationAmountInCents()
  },
  requestPayerName: true,
  requestPayerEmail: true
});

// Check if Apple Pay is available through Stripe
paymentRequest.canMakePayment().then((result) => {
  if (result && result.applePay) {
    // Show Apple Pay button
  }
});
```

---

## Summary

Apple Pay integration is more complex than other payment methods due to:
1. Required Apple Developer Account
2. Certificate management
3. Domain verification
4. Server-side merchant validation

**Recommendation**: Consider using Stripe or Braintree to simplify Apple Pay integration, as they handle merchant validation and certificate management through their SDKs.

---

## Next Steps

After completing Apple Pay integration:
1. Test all four payment methods together
2. Ensure form validation works with all methods
3. Perform cross-browser testing
4. Review [PLAN.md](./PLAN.md) Phase 6 for final QA
