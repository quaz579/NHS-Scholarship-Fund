# Venmo Integration Plan

## Overview

This document provides step-by-step instructions for integrating Venmo as a payment method for the NHS Scholarship Fund donation website.

### Why Venmo?
Venmo is extremely popular among younger donors and provides a familiar, mobile-friendly payment experience. Venmo is owned by PayPal, so integration leverages the same PayPal JavaScript SDK.

### Prerequisites
- [ ] Completed PayPal integration (see [PAYPAL_INTEGRATION.md](./PAYPAL_INTEGRATION.md))
- [ ] PayPal Business Account with Venmo enabled
- [ ] Completed base website (Phase 1-4 of main PLAN.md)

### Important Notes
- Venmo is only available for US-based transactions
- Venmo payments require a mobile device (the button only appears on mobile or when using PayPal with Venmo enabled)
- Venmo integration uses the PayPal JavaScript SDK

---

## Phase 1: Enable Venmo in PayPal

### Task 1.1: Enable Venmo for Business
- [ ] Log in to your PayPal Business account
- [ ] Go to Account Settings > Payment Preferences
- [ ] Enable Venmo as a payment method
- [ ] Accept Venmo terms of service

**Testing Checkpoint 1.1:**
- [ ] Venmo option appears in PayPal Business settings
- [ ] Venmo is enabled/active

### Task 1.2: Verify Sandbox Venmo Support
- [ ] In PayPal Developer Dashboard, verify sandbox supports Venmo
- [ ] Note: Venmo may have limited sandbox testing capabilities
- [ ] Create a sandbox buyer account with Venmo enabled (if available)

**Testing Checkpoint 1.2:**
- [ ] Sandbox configuration checked
- [ ] Understand Venmo testing limitations

---

## Phase 2: Add Venmo to PayPal SDK

### Task 2.1: Update SDK Script to Include Venmo
- [ ] Modify the PayPal SDK script in `index.html`:
  ```html
  <!-- Update the SDK script to enable Venmo -->
  <!-- IMPORTANT: Replace YOUR_CLIENT_ID with your actual PayPal Client ID from the Developer Dashboard -->
  <script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD&enable-funding=venmo"></script>
  ```
  
  > ⚠️ **Note**: Do not deploy to production with `YOUR_CLIENT_ID` placeholder. Replace it with your actual PayPal Client ID from https://developer.paypal.com/

**Testing Checkpoint 2.1:**
- [ ] SDK loads without errors
- [ ] No console errors related to Venmo

### Task 2.2: Verify Venmo Button Appears
- [ ] View the page on a mobile device OR
- [ ] Use browser DevTools to simulate mobile device
- [ ] Venmo button should appear alongside/below PayPal button

**Testing Checkpoint 2.2:**
- [ ] Venmo button visible on mobile view
- [ ] Button has Venmo branding (blue color, Venmo logo)

---

## Phase 3: Configure Venmo Button Behavior

### Task 3.1: Update PayPal Button Configuration
- [ ] Modify `js/payments/paypal.js` to handle Venmo:
  ```javascript
  function initPayPalButton() {
    paypal.Buttons({
      // Style configuration
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'donate'
      },
      
      // Funding source to determine which button was clicked
      fundingSource: undefined, // Let PayPal decide
      
      createOrder: function(data, actions) {
        const amount = getDonationAmount();
        
        if (!amount || parseFloat(amount) <= 0) {
          alert('Please enter a valid donation amount.');
          return;
        }
        
        return actions.order.create({
          purchase_units: [{
            description: 'NHS Scholarship Fund Donation',
            amount: {
              currency_code: 'USD',
              value: amount
            }
          }],
          application_context: {
            shipping_preference: 'NO_SHIPPING' // Donations don't need shipping
          }
        });
      },
      
      onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          // Determine payment source
          const paymentSource = details.payment_source ? 
            Object.keys(details.payment_source)[0] : 'paypal';
          
          console.log('Payment via: ' + paymentSource);
          
          // Redirect to thank you page
          window.location.href = 'pages/thank-you.html?method=' + 
            encodeURIComponent(paymentSource) + 
            '&amount=' + encodeURIComponent(details.purchase_units[0].amount.value);
        });
      },
      
      onError: function(err) {
        console.error('Payment Error:', err);
        alert('There was an error processing your donation. Please try again.');
      }
    }).render('#paypal-button-container');
  }
  ```

**Testing Checkpoint 3.1:**
- [ ] Both PayPal and Venmo buttons render
- [ ] Each button opens appropriate payment flow

### Task 3.2: Create Separate Venmo Button Container (Optional)
If you want more control over button placement:
- [ ] Add a separate container:
  ```html
  <div id="venmo-button-container"></div>
  ```
- [ ] Render Venmo button separately:
  ```javascript
  // Render Venmo button in its own container
  paypal.Buttons({
    fundingSource: paypal.FUNDING.VENMO,
    style: {
      color: 'blue',
      shape: 'rect',
      label: 'pay'
    },
    // ... same createOrder, onApprove, onError as above
  }).render('#venmo-button-container');
  ```

**Testing Checkpoint 3.2:**
- [ ] Venmo button appears in separate container
- [ ] Button styling matches Venmo branding

### Task 3.3: Handle Venmo-Specific Flow
- [ ] Note: Venmo payments on mobile open the Venmo app
- [ ] On desktop, users may be prompted to scan a QR code
- [ ] Ensure your onApprove handles both flows:
  ```javascript
  onApprove: function(data, actions) {
    // Add loading indicator while capturing payment
    showLoadingSpinner();
    
    return actions.order.capture()
      .then(function(details) {
        hideLoadingSpinner();
        
        const payerName = details.payer.name.given_name || 'Donor';
        const amount = details.purchase_units[0].amount.value;
        
        // Store donation info for thank you page
        sessionStorage.setItem('donationComplete', JSON.stringify({
          name: payerName,
          amount: amount,
          method: 'venmo',
          orderId: data.orderID
        }));
        
        window.location.href = 'pages/thank-you.html';
      })
      .catch(function(error) {
        hideLoadingSpinner();
        console.error('Capture failed:', error);
        alert('Unable to complete your donation. Please try again.');
      });
  }
  ```

**Testing Checkpoint 3.3:**
- [ ] Payment flow works on mobile
- [ ] Loading states display appropriately
- [ ] Thank you page receives correct data

---

## Phase 4: Mobile Optimization

### Task 4.1: Ensure Button is Touch-Friendly
- [ ] Verify button has adequate tap target size (min 44x44 pixels)
- [ ] Add appropriate spacing around button
- [ ] Test on actual mobile devices if possible

**Testing Checkpoint 4.1:**
- [ ] Button is easy to tap on mobile
- [ ] No accidental clicks on surrounding elements

### Task 4.2: Venmo App Deep Linking
- [ ] Venmo button automatically handles app opening
- [ ] Ensure your page doesn't block the deep link
- [ ] Test on iOS and Android devices

**Testing Checkpoint 4.2:**
- [ ] Tapping Venmo button opens Venmo app (if installed)
- [ ] Falls back to web flow if app not installed

### Task 4.3: Responsive Button Layout
- [ ] Adjust button container for mobile:
  ```css
  #paypal-button-container {
    max-width: 400px;
    margin: 0 auto;
  }
  
  @media (max-width: 480px) {
    #paypal-button-container {
      max-width: 100%;
      padding: 0 16px;
    }
  }
  ```

**Testing Checkpoint 4.3:**
- [ ] Buttons fit well on small screens
- [ ] Buttons don't extend past screen edges

---

## Phase 5: Testing Venmo Payments

### Task 5.1: Desktop Browser Testing
- [ ] Open donation page in desktop browser
- [ ] Venmo button should appear
- [ ] Click Venmo button
- [ ] Should show QR code or login prompt
- [ ] Complete test payment

**Testing Checkpoint 5.1:**
- [ ] Venmo flow works on desktop
- [ ] QR code displays correctly

### Task 5.2: Mobile Browser Testing
- [ ] Open donation page on mobile device
- [ ] Venmo button should be prominent
- [ ] Tap Venmo button
- [ ] Should open Venmo app or mobile web flow
- [ ] Complete test payment

**Testing Checkpoint 5.2:**
- [ ] Venmo flow works on mobile
- [ ] App or web flow completes successfully

### Task 5.3: Test Error Scenarios
- [ ] Cancel payment mid-flow
- [ ] Test with insufficient Venmo balance (if possible)
- [ ] Test network interruption

**Testing Checkpoint 5.3:**
- [ ] Cancellation handled gracefully
- [ ] Error messages are user-friendly
- [ ] User can retry payment

---

## Phase 6: Production Configuration

### Task 6.1: Enable Venmo for Production
- [ ] Ensure Venmo is enabled on your production PayPal Business account
- [ ] Verify Venmo acceptance settings

**Testing Checkpoint 6.1:**
- [ ] Venmo enabled in production PayPal settings

### Task 6.2: Live Testing
- [ ] Make a small real Venmo donation
- [ ] Verify funds arrive in receiving account
- [ ] Check transaction appears as Venmo in PayPal

**Testing Checkpoint 6.2:**
- [ ] Real Venmo payment successful
- [ ] Funds visible in account
- [ ] Transaction labeled as Venmo

---

## Troubleshooting Guide

### Common Issues

#### Venmo button doesn't appear
1. Ensure `enable-funding=venmo` is in SDK URL
2. Venmo may only show on mobile devices
3. Venmo is US-only - check if browser locale is set to US
4. Check if PayPal Business account has Venmo enabled

#### Venmo button appears but payment fails
1. Check browser console for specific error
2. Ensure order creation is successful before Venmo opens
3. Verify amount is valid (Venmo may have minimum amounts)

#### Venmo app doesn't open on mobile
1. App may not be installed - falls back to web
2. Check if device allows app deep linking
3. Ensure no popup blockers are active

#### Payment stuck after returning from Venmo
1. Check if onApprove is being called
2. Verify capture step is completing
3. Check for network issues during capture

---

## Code Reference

### Complete Venmo-Enabled Button Code

```javascript
// js/payments/venmo.js (or add to paypal.js)

function initVenmoButton() {
  // Check if Venmo is available
  if (!paypal.FUNDING.VENMO) {
    console.log('Venmo not available');
    return;
  }
  
  // Check if Venmo button can be rendered
  const venmoEligible = paypal.Buttons({
    fundingSource: paypal.FUNDING.VENMO
  }).isEligible();
  
  if (!venmoEligible) {
    console.log('Venmo not eligible for this transaction');
    document.getElementById('venmo-button-container').style.display = 'none';
    return;
  }
  
  paypal.Buttons({
    fundingSource: paypal.FUNDING.VENMO,
    
    style: {
      color: 'blue',
      shape: 'rect',
      label: 'pay',
      height: 48
    },
    
    createOrder: function(data, actions) {
      const amount = getDonationAmount();
      const donorName = document.getElementById('donor-name').value;
      
      return actions.order.create({
        purchase_units: [{
          description: 'NHS Scholarship Fund Donation from ' + donorName,
          amount: {
            currency_code: 'USD',
            value: amount
          }
        }]
      });
    },
    
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        window.location.href = 'pages/thank-you.html?method=venmo&amount=' + 
          encodeURIComponent(details.purchase_units[0].amount.value);
      });
    },
    
    onError: function(err) {
      console.error('Venmo Error:', err);
      alert('There was an error processing your Venmo payment. Please try again.');
    },
    
    onCancel: function() {
      console.log('Venmo payment cancelled');
    }
  }).render('#venmo-button-container');
}

document.addEventListener('DOMContentLoaded', function() {
  if (typeof paypal !== 'undefined') {
    initVenmoButton();
  }
});
```

---

## SDK Parameters for Venmo

| Parameter | Value | Description |
|-----------|-------|-------------|
| `enable-funding` | `venmo` | Enables Venmo button |
| `disable-funding` | `credit,card` | Can hide other options to emphasize Venmo |
| `fundingSource` | `paypal.FUNDING.VENMO` | Render only Venmo button |

---

## Next Steps

After completing Venmo integration:
1. Proceed to [GOOGLEPAY_INTEGRATION.md](./GOOGLEPAY_INTEGRATION.md)
2. Test PayPal and Venmo together
3. Ensure form validation works with all payment methods
