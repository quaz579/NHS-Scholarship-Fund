# Google Pay Integration Plan

## Overview

This document provides step-by-step instructions for integrating Google Pay as a payment method for the NHS Scholarship Fund donation website.

### Why Google Pay?
Google Pay provides a fast checkout experience for Android users and Chrome browser users who have saved payment methods. It's particularly popular on mobile devices and offers strong security through tokenization.

### Prerequisites
- [ ] Google Pay Merchant Account (via Google Pay & Wallet Console)
- [ ] Payment processor that supports Google Pay (e.g., Stripe, Braintree, or direct integration)
- [ ] Completed base website (Phase 1-4 of main PLAN.md)
- [ ] HTTPS-enabled website (required for Google Pay in production)

### Important Notes
- Google Pay requires HTTPS in production
- Testing can be done in TEST mode without real credentials
- Google Pay works on Chrome, Android devices, and other supported platforms

---

## Phase 1: Google Pay Account Setup

### Task 1.1: Register for Google Pay & Wallet Console
- [ ] Go to https://pay.google.com/business/console
- [ ] Sign in with a Google account
- [ ] Accept the Google Pay API Terms of Service
- [ ] Complete business registration

**Testing Checkpoint 1.1:**
- [ ] Can access Google Pay & Wallet Console

### Task 1.2: Create a New Integration
- [ ] In the console, create a new integration
- [ ] Select "Web" as the integration type
- [ ] Note your Merchant ID
- [ ] Configure allowed payment methods

**Testing Checkpoint 1.2:**
- [ ] Have a Merchant ID
- [ ] Integration appears in console

### Task 1.3: Understand Payment Gateway Options
Google Pay can work in two modes:
1. **PAYMENT_GATEWAY** mode - Uses a payment processor (recommended)
2. **DIRECT** mode - Processes cards directly (requires PCI compliance)

For donations, PAYMENT_GATEWAY mode with Stripe or PayPal is recommended.

- [ ] Decide on payment gateway (Stripe recommended for simplicity)
- [ ] Note gateway-specific configuration requirements

**Testing Checkpoint 1.3:**
- [ ] Payment gateway selected and documented

---

## Phase 2: Basic Google Pay Integration

### Task 2.1: Add Google Pay JavaScript Library
- [ ] Add the Google Pay script to `index.html`:
  ```html
  <script async src="https://pay.google.com/gp/p/js/pay.js" onload="onGooglePayLoaded()"></script>
  ```

**Testing Checkpoint 2.1:**
- [ ] Script loads without errors
- [ ] `google.payments.api.PaymentsClient` is available in console

### Task 2.2: Create Google Pay Button Container
- [ ] Add container in payment section of `index.html`:
  ```html
  <div id="google-pay-button-container"></div>
  ```

**Testing Checkpoint 2.2:**
- [ ] Element exists on page

### Task 2.3: Create Google Pay Configuration
- [ ] Create `js/payments/googlepay.js`:
  ```javascript
  // Google Pay Integration for NHS Scholarship Fund
  
  // Payment configuration
  const googlePayConfig = {
    apiVersion: 2,
    apiVersionMinor: 0,
    environment: 'TEST', // Change to 'PRODUCTION' for live
    merchantInfo: {
      merchantId: 'YOUR_MERCHANT_ID', // From Google Pay Console
      merchantName: 'NHS Scholarship Fund'
    },
    allowedPaymentMethods: [{
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
        allowedCardNetworks: ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER']
      },
      tokenizationSpecification: {
        type: 'PAYMENT_GATEWAY',
        parameters: {
          // For Stripe:
          // IMPORTANT: Replace YOUR_STRIPE_PUBLISHABLE_KEY with your actual Stripe publishable key
          // Get your key from https://dashboard.stripe.com/apikeys
          gateway: 'stripe',
          'stripe:version': '2023-10-16',
          'stripe:publishableKey': 'YOUR_STRIPE_PUBLISHABLE_KEY' // Replace with pk_test_xxx or pk_live_xxx
          
          // For PayPal/Braintree:
          // gateway: 'braintree',
          // 'braintree:clientKey': 'YOUR_BRAINTREE_KEY',
          // 'braintree:sdkVersion': 'braintree.client.VERSION'
        }
      }
    }]
  };
  
  let paymentsClient = null;
  
  // Initialize Google Pay client
  function getGooglePaymentsClient() {
    if (paymentsClient === null) {
      paymentsClient = new google.payments.api.PaymentsClient({
        environment: googlePayConfig.environment
      });
    }
    return paymentsClient;
  }
  ```

**Testing Checkpoint 2.3:**
- [ ] Configuration object is valid
- [ ] No JavaScript errors on page load

### Task 2.4: Check Google Pay Availability
- [ ] Add availability check function:
  ```javascript
  function onGooglePayLoaded() {
    const client = getGooglePaymentsClient();
    
    client.isReadyToPay({
      apiVersion: googlePayConfig.apiVersion,
      apiVersionMinor: googlePayConfig.apiVersionMinor,
      allowedPaymentMethods: googlePayConfig.allowedPaymentMethods
    })
    .then(function(response) {
      if (response.result) {
        // Google Pay is available
        addGooglePayButton();
      } else {
        // Google Pay not available
        console.log('Google Pay is not available');
        document.getElementById('google-pay-button-container').style.display = 'none';
      }
    })
    .catch(function(err) {
      console.error('Error checking Google Pay availability:', err);
    });
  }
  ```

**Testing Checkpoint 2.4:**
- [ ] `isReadyToPay` returns true in Chrome with saved cards
- [ ] Function handles "not available" gracefully

### Task 2.5: Add Google Pay Button
- [ ] Add button creation function:
  ```javascript
  function addGooglePayButton() {
    const client = getGooglePaymentsClient();
    
    const button = client.createButton({
      onClick: onGooglePayButtonClicked,
      buttonColor: 'black', // or 'white'
      buttonType: 'donate', // donate button style
      buttonRadius: 4,
      buttonSizeMode: 'fill'
    });
    
    document.getElementById('google-pay-button-container').appendChild(button);
  }
  ```

**Testing Checkpoint 2.5:**
- [ ] Google Pay button appears on page
- [ ] Button has correct "Donate with G Pay" styling

---

## Phase 3: Payment Processing

### Task 3.1: Create Payment Data Request
- [ ] Add function to build payment request:
  ```javascript
  function getGooglePaymentDataRequest(amount) {
    return {
      apiVersion: googlePayConfig.apiVersion,
      apiVersionMinor: googlePayConfig.apiVersionMinor,
      merchantInfo: googlePayConfig.merchantInfo,
      allowedPaymentMethods: googlePayConfig.allowedPaymentMethods,
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPrice: amount,
        currencyCode: 'USD',
        countryCode: 'US',
        displayItems: [{
          label: 'NHS Scholarship Fund Donation',
          type: 'LINE_ITEM',
          price: amount
        }],
        checkoutOption: 'COMPLETE_IMMEDIATE_PURCHASE'
      }
    };
  }
  ```

**Testing Checkpoint 3.1:**
- [ ] Payment data request is properly structured

### Task 3.2: Handle Button Click
- [ ] Add click handler:
  ```javascript
  function onGooglePayButtonClicked() {
    // Get donation amount from form
    const amount = getDonationAmount();
    
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }
    
    const paymentDataRequest = getGooglePaymentDataRequest(amount);
    const client = getGooglePaymentsClient();
    
    client.loadPaymentData(paymentDataRequest)
      .then(function(paymentData) {
        // Payment authorized
        processGooglePayPayment(paymentData);
      })
      .catch(function(err) {
        // Payment cancelled or error
        if (err.statusCode === 'CANCELED') {
          console.log('Payment cancelled by user');
        } else {
          console.error('Payment error:', err);
          alert('There was an error processing your payment. Please try again.');
        }
      });
  }
  ```

**Testing Checkpoint 3.2:**
- [ ] Clicking button opens Google Pay payment sheet
- [ ] Cancellation is handled gracefully

### Task 3.3: Process Payment with Gateway
- [ ] Add payment processing function:
  ```javascript
  async function processGooglePayPayment(paymentData) {
    // Extract token from Google Pay response
    const paymentToken = paymentData.paymentMethodData.tokenizationData.token;
    
    // Parse the token (it's a JSON string)
    const tokenData = JSON.parse(paymentToken);
    
    // For Stripe integration:
    // Send token to Stripe to create a charge
    // This requires a backend endpoint
    
    try {
      // If using client-side only (for testing):
      console.log('Payment token received:', tokenData);
      
      // In production, send to your server:
      // const response = await fetch('/api/process-donation', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     token: paymentToken,
      //     amount: getDonationAmount(),
      //     donorName: document.getElementById('donor-name').value,
      //     donorEmail: document.getElementById('donor-email').value
      //   })
      // });
      
      // Redirect to thank you page
      window.location.href = 'pages/thank-you.html?method=googlepay&amount=' + 
        encodeURIComponent(getDonationAmount());
        
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('Unable to process your donation. Please try again.');
    }
  }
  ```

**Testing Checkpoint 3.3:**
- [ ] Payment data is received after authorization
- [ ] Token can be extracted from response
- [ ] Thank you page redirect works

---

## Phase 4: Styling and UX

### Task 4.1: Style Google Pay Button Container
- [ ] Add CSS for the button container:
  ```css
  #google-pay-button-container {
    margin: 16px 0;
    min-height: 48px;
    display: flex;
    justify-content: center;
  }
  
  #google-pay-button-container button {
    min-width: 200px;
    max-width: 400px;
    width: 100%;
  }
  ```

**Testing Checkpoint 4.1:**
- [ ] Button is centered
- [ ] Button has appropriate size

### Task 4.2: Add Loading State
- [ ] Show loading while payment processes:
  ```javascript
  function onGooglePayButtonClicked() {
    const container = document.getElementById('google-pay-button-container');
    container.classList.add('loading');
    
    // ... payment code ...
    
    client.loadPaymentData(paymentDataRequest)
      .then(function(paymentData) {
        container.classList.remove('loading');
        processGooglePayPayment(paymentData);
      })
      .catch(function(err) {
        container.classList.remove('loading');
        // ... error handling ...
      });
  }
  ```

**Testing Checkpoint 4.2:**
- [ ] Loading state appears during payment
- [ ] Loading state clears after completion/error

### Task 4.3: Handle Unavailability Gracefully
- [ ] Show alternative when Google Pay unavailable:
  ```javascript
  function showGooglePayUnavailable() {
    const container = document.getElementById('google-pay-button-container');
    container.innerHTML = '<p class="payment-unavailable">Google Pay is not available on this device/browser. Please use another payment method.</p>';
  }
  ```

**Testing Checkpoint 4.3:**
- [ ] Unavailable message shows when appropriate
- [ ] Message is styled appropriately

---

## Phase 5: Testing

### Task 5.1: Test in Chrome (Desktop)
- [ ] Ensure test cards are available in Chrome
- [ ] Navigate to donation page
- [ ] Enter donation amount
- [ ] Click Google Pay button
- [ ] Select a test card
- [ ] Complete payment

**Testing Checkpoint 5.1:**
- [ ] Payment flow works in Chrome
- [ ] Test card is accepted

### Task 5.2: Test on Android Device
- [ ] Open donation page on Android
- [ ] Verify Google Pay button appears
- [ ] Complete test payment
- [ ] Verify fingerprint/authentication works

**Testing Checkpoint 5.2:**
- [ ] Payment flow works on Android
- [ ] Native Google Pay sheet appears

### Task 5.3: Test Error Scenarios
- [ ] Cancel payment mid-flow
- [ ] Test with expired test card
- [ ] Test network disconnection

**Testing Checkpoint 5.3:**
- [ ] All errors handled gracefully
- [ ] User can retry payment

### Task 5.4: Test with Real Cards (TEST Mode)
- [ ] In TEST environment, real cards work but don't charge
- [ ] Test with various card types
- [ ] Verify token generation

**Testing Checkpoint 5.4:**
- [ ] Various card types work in test mode
- [ ] Tokens generate correctly

---

## Phase 6: Production Setup

### Task 6.1: Submit for Google Pay Approval
- [ ] Complete production checklist in Google Pay Console
- [ ] Submit screenshots of integration
- [ ] Provide test instructions for Google reviewers
- [ ] Wait for approval (typically 1-2 weeks)

**Testing Checkpoint 6.1:**
- [ ] Approval submission completed
- [ ] Received confirmation from Google

### Task 6.2: Configure Production Credentials
- [ ] Update environment to 'PRODUCTION'
- [ ] Add production Merchant ID
- [ ] Configure production payment gateway credentials
- [ ] Update tokenization parameters

**Testing Checkpoint 6.2:**
- [ ] Production configuration applied
- [ ] No TEST mode indicators visible

### Task 6.3: Perform Live Test
- [ ] Make a small real donation
- [ ] Verify charge appears on card
- [ ] Verify funds received by payment processor
- [ ] Test receipt/confirmation

**Testing Checkpoint 6.3:**
- [ ] Real payment succeeds
- [ ] Funds received correctly

---

## Troubleshooting Guide

### Common Issues

#### Google Pay button doesn't appear
1. Ensure script is loaded (`pay.js`)
2. Check if `isReadyToPay` returns true
3. Verify you're testing in Chrome or on Android
4. Ensure HTTPS is being used (or localhost for testing)

#### "Payments not enabled" error
1. Verify Merchant ID is correct
2. Check Google Pay Console for approval status
3. Ensure environment matches (TEST vs PRODUCTION)

#### Token is not accepted by payment processor
1. Verify tokenization parameters match gateway requirements
2. Check gateway documentation for format
3. Ensure gateway supports Google Pay

#### Payment sheet closes immediately
1. Check for JavaScript errors in console
2. Verify payment data request is complete
3. Ensure amount is formatted correctly

---

## Complete Code Reference

```javascript
// js/payments/googlepay.js

const googlePayConfig = {
  apiVersion: 2,
  apiVersionMinor: 0,
  environment: 'TEST',
  merchantInfo: {
    merchantId: 'YOUR_MERCHANT_ID',
    merchantName: 'NHS Scholarship Fund'
  },
  allowedPaymentMethods: [{
    type: 'CARD',
    parameters: {
      allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
      allowedCardNetworks: ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER']
    },
    tokenizationSpecification: {
      type: 'PAYMENT_GATEWAY',
      parameters: {
        gateway: 'stripe',
        'stripe:version': '2023-10-16',
        'stripe:publishableKey': 'pk_test_XXXXXX'
      }
    }
  }]
};

let paymentsClient = null;

function getGooglePaymentsClient() {
  if (paymentsClient === null) {
    paymentsClient = new google.payments.api.PaymentsClient({
      environment: googlePayConfig.environment
    });
  }
  return paymentsClient;
}

function onGooglePayLoaded() {
  const client = getGooglePaymentsClient();
  
  client.isReadyToPay({
    apiVersion: googlePayConfig.apiVersion,
    apiVersionMinor: googlePayConfig.apiVersionMinor,
    allowedPaymentMethods: googlePayConfig.allowedPaymentMethods
  })
  .then(function(response) {
    if (response.result) {
      addGooglePayButton();
    } else {
      document.getElementById('google-pay-button-container').innerHTML = 
        '<p class="unavailable">Google Pay not available</p>';
    }
  })
  .catch(function(err) {
    console.error('Google Pay error:', err);
  });
}

function addGooglePayButton() {
  const client = getGooglePaymentsClient();
  const button = client.createButton({
    onClick: onGooglePayButtonClicked,
    buttonColor: 'black',
    buttonType: 'donate',
    buttonRadius: 4
  });
  document.getElementById('google-pay-button-container').appendChild(button);
}

function getGooglePaymentDataRequest(amount) {
  return {
    apiVersion: googlePayConfig.apiVersion,
    apiVersionMinor: googlePayConfig.apiVersionMinor,
    merchantInfo: googlePayConfig.merchantInfo,
    allowedPaymentMethods: googlePayConfig.allowedPaymentMethods,
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPrice: amount,
      currencyCode: 'USD',
      countryCode: 'US'
    }
  };
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

function onGooglePayButtonClicked() {
  const amount = getDonationAmount();
  
  if (!amount || parseFloat(amount) <= 0) {
    alert('Please enter a valid donation amount.');
    return;
  }
  
  const paymentDataRequest = getGooglePaymentDataRequest(amount);
  const client = getGooglePaymentsClient();
  
  client.loadPaymentData(paymentDataRequest)
    .then(processGooglePayPayment)
    .catch(function(err) {
      if (err.statusCode !== 'CANCELED') {
        console.error('Payment error:', err);
        alert('Payment failed. Please try again.');
      }
    });
}

function processGooglePayPayment(paymentData) {
  const paymentToken = paymentData.paymentMethodData.tokenizationData.token;
  
  // Send to your server for processing
  console.log('Payment token:', paymentToken);
  
  // Redirect to thank you
  window.location.href = 'pages/thank-you.html?method=googlepay&amount=' + 
    encodeURIComponent(getDonationAmount());
}
```

---

## Next Steps

After completing Google Pay integration:
1. Proceed to [APPLEPAY_INTEGRATION.md](./APPLEPAY_INTEGRATION.md)
2. Test all payment methods together
3. Ensure form validation works with all methods
