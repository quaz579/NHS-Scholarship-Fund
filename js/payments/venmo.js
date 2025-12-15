/**
 * NHS Scholarship Fund - Venmo Integration
 * See VENMO_INTEGRATION.md for full documentation
 *
 * ============================================================
 * NOTE: This file is kept for documentation purposes only.
 * ============================================================
 * 
 * As of the fix for the Venmo button duplication issue, Venmo
 * is now handled automatically by the PayPal SDK. When the PayPal
 * SDK is loaded with the 'enable-funding=venmo' parameter, it
 * automatically renders ALL enabled funding sources in a single
 * container, including:
 * - PayPal
 * - Venmo
 * - Pay Later
 * - Debit or Credit Card
 * 
 * Previously, this file was used to render a separate Venmo button,
 * which caused duplicate Venmo buttons to appear (one from PayPal SDK
 * and one from this file).
 * 
 * The PayPal button handler in paypal.js now detects which payment
 * method was used (PayPal, Venmo, etc.) and reports it correctly
 * to the thank you page.
 * 
 * This file is retained for historical reference and may be useful
 * if a separate Venmo button is needed in the future.
 *
 * ============================================================
 * VENMO USES THE PAYPAL SDK
 * ============================================================
 *
 * Venmo is integrated through the PayPal JavaScript SDK.
 * The same PayPal Client ID is used for both PayPal and Venmo.
 *
 * Requirements:
 * 1. PayPal Client ID must be configured in index.html
 * 2. The SDK URL must include: enable-funding=venmo
 * 3. PayPal Business account must have Venmo enabled
 *
 * To enable Venmo on your PayPal account:
 * 1. Log into PayPal Business Dashboard
 * 2. Go to Account Settings > Payment Preferences
 * 3. Enable Venmo as a payment method
 *
 * ============================================================
 */

(function() {
  'use strict';

  // Track if Venmo button has been rendered
  let venmoButtonRendered = false;

  /**
   * Initialize Venmo button in the specified container
   * @param {string} containerId - ID of container element for Venmo button
   */
  function initVenmoButton(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn('Venmo container not found:', containerId);
      return;
    }

    // Clear container
    container.innerHTML = '';

    // Check if PayPal SDK is loaded (Venmo uses PayPal SDK)
    if (typeof paypal === 'undefined') {
      container.innerHTML =
        '<div class="alert alert-warning" role="alert">' +
        '<i class="bi bi-exclamation-triangle"></i> ' +
        '<strong>Venmo not available.</strong> ' +
        'The PayPal Client ID needs to be configured. ' +
        'See index.html for setup instructions.' +
        '</div>';
      console.error('PayPal SDK not loaded. Venmo requires PayPal SDK.');
      return;
    }

    // Check if Venmo funding source is available
    if (!paypal.FUNDING || !paypal.FUNDING.VENMO) {
      container.innerHTML =
        '<div class="alert alert-info" role="alert">' +
        '<i class="bi bi-info-circle"></i> ' +
        'Venmo is not available in your region or on this device. ' +
        'Please use another payment method.' +
        '</div>';
      return;
    }

    // Render Venmo button
    try {
      paypal.Buttons({
        fundingSource: paypal.FUNDING.VENMO,

        // Button style - use 'pay' label for Venmo funding source
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'pay',
          height: 48
        },

        // Called when button is clicked - validate before opening Venmo
        onClick: function(data, actions) {
          const amount = window.NHSDonation ? window.NHSDonation.getAmount() : null;

          if (!amount || amount <= 0) {
            showPaymentError('Please select or enter a donation amount first.');
            return actions.reject();
          }

          return actions.resolve();
        },

        // Create the order
        createOrder: function(data, actions) {
          const state = window.NHSDonation ? window.NHSDonation.getState() : {};
          const amount = state.amount || 0;
          const scholarshipName = state.scholarshipName || 'General Fund';
          // Use non-sensitive transaction ID instead of email for privacy
          const transactionId = window.NHSPaymentUtils ? window.NHSPaymentUtils.generateTransactionId() : '';

          return actions.order.create({
            purchase_units: [{
              description: 'NHS Scholarship Fund Donation' + (scholarshipName ? ' - ' + scholarshipName : ''),
              custom_id: transactionId,
              amount: {
                currency_code: 'USD',
                value: amount.toFixed(2)
              }
            }],
            application_context: {
              shipping_preference: 'NO_SHIPPING'
            }
          });
        },

        // Handle successful payment
        onApprove: function(data, actions) {
          showPaymentProcessing();

          return actions.order.capture().then(function(details) {
            // Payment successful - redirect to thank you page
            const state = window.NHSDonation ? window.NHSDonation.getState() : {};
            const params = new URLSearchParams();
            params.set('amount', state.amount || 0);
            params.set('method', 'Venmo');
            params.set('transaction', data.orderID);
            if (state.scholarshipName) {
              params.set('scholarship', state.scholarshipName);
            }
            if (state.donorName) {
              params.set('donor', state.donorName);
            }

            window.location.href = 'pages/thank-you.html?' + params.toString();
          });
        },

        // Handle errors
        onError: function(err) {
          console.error('Venmo Error:', err);
          hidePaymentProcessing();
          showPaymentError('There was an error processing your Venmo payment. Please try again.');
        },

        // Handle cancellation
        onCancel: function(data) {
          console.log('Venmo payment cancelled by user');
          hidePaymentProcessing();
        }
      }).render('#' + containerId).then(function() {
        venmoButtonRendered = true;
      }).catch(function(err) {
        console.error('Venmo button render error:', err);
        // Venmo might not be eligible - show info message
        container.innerHTML =
          '<div class="alert alert-info" role="alert">' +
          '<i class="bi bi-info-circle"></i> ' +
          'Venmo is not available for this transaction. ' +
          'Please use PayPal or another payment method.' +
          '</div>';
      });
    } catch (err) {
      console.error('Venmo initialization error:', err);
    }
  }

  /**
   * Show error message - uses shared utility for accessibility
   */
  function showPaymentError(message) {
    if (window.NHSPaymentUtils) {
      window.NHSPaymentUtils.showError(message);
    }
  }

  /**
   * Show processing indicator - uses shared utility
   */
  function showPaymentProcessing() {
    if (window.NHSPaymentUtils) {
      window.NHSPaymentUtils.showProcessing();
    }
  }

  /**
   * Hide processing indicator - uses shared utility
   */
  function hidePaymentProcessing() {
    if (window.NHSPaymentUtils) {
      window.NHSPaymentUtils.hideProcessing();
    }
  }

  // Export for use by other modules
  window.NHSVenmo = {
    init: initVenmoButton,
    isRendered: function() { return venmoButtonRendered; }
  };
})();
