# PayPal Integration Plan

## Overview

This document provides step-by-step instructions for integrating PayPal as a payment method for the NHS Scholarship Fund donation website.

### Why PayPal First?
PayPal is the most widely used online payment platform and provides a well-documented JavaScript SDK that works without server-side code for simple implementations. It also serves as the foundation for Venmo integration (both are owned by the same company).

### Prerequisites
- [ ] PayPal Business Account (or PayPal account linked to the school's nonprofit status)
- [ ] PayPal Developer Account access
- [ ] Completed base website (Phase 1-4 of main PLAN.md)

---

## Phase 1: PayPal Account Setup

### Task 1.1: Create/Access PayPal Developer Account
- [ ] Go to https://developer.paypal.com/
- [ ] Log in with PayPal credentials
- [ ] Navigate to Dashboard

**Testing Checkpoint 1.1:**
- [ ] Can access PayPal Developer Dashboard

### Task 1.2: Create Sandbox Accounts
- [ ] Navigate to Sandbox > Accounts
- [ ] Create a sandbox Business account (for receiving donations)
- [ ] Create a sandbox Personal account (for testing donations)
- [ ] Note down credentials for both accounts

**Testing Checkpoint 1.2:**
- [ ] Both sandbox accounts appear in the account list
- [ ] Can log into sandbox with both accounts

### Task 1.3: Get API Credentials
- [ ] Go to Apps & Credentials
- [ ] Ensure you're in "Sandbox" mode (toggle at top)
- [ ] Create a new app OR use the default sandbox app
- [ ] Copy the Client ID (you'll need this for the JavaScript SDK)

**Testing Checkpoint 1.3:**
- [ ] Have a valid sandbox Client ID

---

## Phase 2: Basic PayPal Button Integration

### Task 2.1: Add PayPal JavaScript SDK
- [ ] Add the PayPal SDK script to `index.html`:
  ```html
  <!-- Add before closing </body> tag -->
  <script src="https://www.paypal.com/sdk/js?client-id=YOUR_SANDBOX_CLIENT_ID&currency=USD"></script>
  ```
- [ ] Replace `YOUR_SANDBOX_CLIENT_ID` with your actual sandbox Client ID

**Testing Checkpoint 2.1:**
- [ ] Open browser DevTools Console
- [ ] No JavaScript errors related to PayPal loading
- [ ] `paypal` object is available in console

### Task 2.2: Create PayPal Button Container
- [ ] Add a container div in the payment section of `index.html`:
  ```html
  <div id="paypal-button-container"></div>
  ```

**Testing Checkpoint 2.2:**
- [ ] Element exists on page (inspect with DevTools)

### Task 2.3: Create PayPal Integration Script
- [ ] Create/edit `js/payments/paypal.js`:
  ```javascript
  // PayPal Integration for NHS Scholarship Fund
  
  function initPayPalButton() {
    // Get donation amount from form
    function getDonationAmount() {
      // This should be connected to your form logic
      const customAmount = document.getElementById('custom-amount');
      const selectedPreset = document.querySelector('.amount-btn.selected');
      
      if (customAmount && customAmount.value) {
        return customAmount.value;
      } else if (selectedPreset) {
        return selectedPreset.dataset.amount;
      }
      return '0';
    }
    
    paypal.Buttons({
      // Style the button
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'donate'
      },
      
      // Create the order
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
          }]
        });
      },
      
      // Handle successful payment
      onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          // Show success message
          console.log('Transaction completed by ' + details.payer.name.given_name);
          
          // Redirect to thank you page
          window.location.href = 'pages/thank-you.html?method=paypal&amount=' + 
            encodeURIComponent(details.purchase_units[0].amount.value);
        });
      },
      
      // Handle errors
      onError: function(err) {
        console.error('PayPal Error:', err);
        alert('There was an error processing your donation. Please try again.');
      },
      
      // Handle cancellation
      onCancel: function(data) {
        console.log('Payment cancelled by user');
        // Optionally show a message or just let them try again
      }
    }).render('#paypal-button-container');
  }
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    // Wait for PayPal SDK to load
    if (typeof paypal !== 'undefined') {
      initPayPalButton();
    } else {
      console.error('PayPal SDK not loaded');
    }
  });
  ```

**Testing Checkpoint 2.3:**
- [ ] PayPal button appears on the page
- [ ] Button shows the yellow "Donate with PayPal" style

### Task 2.4: Test Sandbox Payment
- [ ] Enter a donation amount on the form
- [ ] Click the PayPal button
- [ ] Log in with your sandbox Personal account
- [ ] Complete the payment
- [ ] Verify redirect to thank you page

**Testing Checkpoint 2.4:**
- [ ] Payment flow opens PayPal popup/redirect
- [ ] Can log in with sandbox credentials
- [ ] Payment completes without errors
- [ ] Redirects to thank you page with correct amount

---

## Phase 3: Enhanced PayPal Features

### Task 3.1: Add Donor Information to PayPal Order
- [ ] Modify `createOrder` to include donor name:
  ```javascript
  createOrder: function(data, actions) {
    const amount = getDonationAmount();
    const donorName = document.getElementById('donor-name').value;
    const donorEmail = document.getElementById('donor-email').value;
    
    return actions.order.create({
      purchase_units: [{
        description: 'NHS Scholarship Fund Donation',
        custom_id: donorEmail, // Store donor email for reference
        amount: {
          currency_code: 'USD',
          value: amount
        }
      }],
      payer: {
        name: {
          given_name: donorName.split(' ')[0],
          surname: donorName.split(' ').slice(1).join(' ')
        },
        email_address: donorEmail
      }
    });
  }
  ```

**Testing Checkpoint 3.1:**
- [ ] Complete a test donation
- [ ] Verify donor info appears in PayPal transaction details

### Task 3.2: Add Debit/Credit Card Option
- [ ] Modify the SDK script URL to enable credit card:
  ```html
  <script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD&disable-funding=credit"></script>
  ```
- [ ] Or enable all funding sources:
  ```html
  <script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD"></script>
  ```

**Testing Checkpoint 3.2:**
- [ ] Debit or Credit card option appears below PayPal button
- [ ] Can enter card details directly without PayPal account

### Task 3.3: Add Loading State
- [ ] Show loading indicator while PayPal processes:
  ```javascript
  onClick: function(data, actions) {
    // Validate form before opening PayPal
    const amount = getDonationAmount();
    if (!amount || parseFloat(amount) <= 0) {
      document.getElementById('amount-error').textContent = 'Please enter a valid amount';
      return actions.reject();
    }
    return actions.resolve();
  }
  ```

**Testing Checkpoint 3.3:**
- [ ] Form validation runs before PayPal popup opens
- [ ] Error messages display for invalid input

---

## Phase 4: Error Handling & Edge Cases

### Task 4.1: Handle Network Errors
- [ ] Add try-catch around PayPal operations
- [ ] Display user-friendly error messages
- [ ] Log errors for debugging

**Testing Checkpoint 4.1:**
- [ ] Disconnect network during payment - should show error message
- [ ] Error is logged to console

### Task 4.2: Handle Payment Failures
- [ ] Test with a card that will decline
- [ ] Ensure error message displays
- [ ] Allow user to try again

**Testing Checkpoint 4.2:**
- [ ] Payment failure shows appropriate message
- [ ] User can attempt payment again

### Task 4.3: Handle Button Not Rendering
- [ ] Add fallback if PayPal SDK fails to load:
  ```javascript
  // Add timeout to check if PayPal loaded
  setTimeout(function() {
    if (typeof paypal === 'undefined') {
      document.getElementById('paypal-button-container').innerHTML = 
        '<p class="error">PayPal is currently unavailable. Please try again later or use another payment method.</p>';
    }
  }, 5000);
  ```

**Testing Checkpoint 4.3:**
- [ ] Block PayPal SDK (via DevTools) - fallback message appears
- [ ] Page still functions for other payment methods

---

## Phase 5: Production Deployment

### Task 5.1: Create Live PayPal App
- [ ] In PayPal Developer Dashboard, switch to "Live" mode
- [ ] Create a new app for production
- [ ] Get the Live Client ID

**Testing Checkpoint 5.1:**
- [ ] Have a valid live Client ID

### Task 5.2: Update SDK to Use Live Credentials
- [ ] Replace sandbox Client ID with live Client ID
- [ ] Or use environment-based configuration:
  ```javascript
  // Detect environment and use appropriate client ID
  const PAYPAL_CLIENT_ID = window.location.hostname === 'localhost' 
    ? 'SANDBOX_CLIENT_ID'
    : 'LIVE_CLIENT_ID';
  ```

**Testing Checkpoint 5.2:**
- [ ] Live PayPal button appears
- [ ] Clicking button opens real PayPal (don't complete a real transaction yet)

### Task 5.3: Perform Live Test Transaction
- [ ] Make a small real donation (e.g., $1)
- [ ] Verify funds arrive in the receiving PayPal account
- [ ] Verify thank you page displays correctly

**Testing Checkpoint 5.3:**
- [ ] Real payment completes successfully
- [ ] Funds visible in receiving account
- [ ] Receipt email received

### Task 5.4: Document Configuration
- [ ] Create `CONFIG.example.js` with placeholder values:
  ```javascript
  // Copy this file to CONFIG.js and fill in your values
  const PAYPAL_CONFIG = {
    clientId: 'YOUR_LIVE_CLIENT_ID_HERE',
    currency: 'USD',
    intent: 'capture'
  };
  ```
- [ ] Add `CONFIG.js` to `.gitignore`

**Testing Checkpoint 5.4:**
- [ ] Example config file exists in repo
- [ ] Actual config file is gitignored

---

## Troubleshooting Guide

### Common Issues

#### PayPal button doesn't appear
1. Check browser console for errors
2. Verify Client ID is correct
3. Ensure SDK script is loading (check Network tab)
4. Verify button container element exists

#### Payment completes but no redirect
1. Check `onApprove` function for errors
2. Verify redirect URL is correct
3. Check browser console for errors

#### "INVALID_CURRENCY" error
1. Verify currency code is "USD" (uppercase)
2. Ensure amount is a valid number string (e.g., "25.00")

#### Popup blocker preventing PayPal window
1. PayPal buttons must be clicked directly by user (not programmatically)
2. Inform users to allow popups for payment processing

---

## Code Summary

### Required Files

| File | Purpose |
|------|---------|
| `index.html` | Include PayPal SDK and button container |
| `js/payments/paypal.js` | PayPal button initialization and handlers |
| `pages/thank-you.html` | Handle PayPal-specific thank you message |

### SDK Parameters Reference

| Parameter | Description | Example |
|-----------|-------------|---------|
| `client-id` | Your PayPal Client ID | `sb-xxxxx` (sandbox) |
| `currency` | Currency code | `USD` |
| `intent` | Payment intent | `capture` (immediate) |
| `disable-funding` | Hide specific payment options | `credit,card` |
| `enable-funding` | Show additional payment options | `venmo` |

---

## Next Steps

After completing PayPal integration:
1. Proceed to [VENMO_INTEGRATION.md](./VENMO_INTEGRATION.md) - Venmo is built on PayPal
2. Test both payment methods together
3. Ensure form validation works with both methods
