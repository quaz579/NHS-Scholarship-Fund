/**
 * NHS Scholarship Fund - PayPal Integration
 * See PAYPAL_INTEGRATION.md for full documentation
 *
 * ============================================================
 * PLACEHOLDER CREDENTIALS - MUST BE REPLACED BEFORE GOING LIVE
 * ============================================================
 *
 * Location of Client ID: index.html (PayPal SDK script tag)
 * Current value: YOUR_PAYPAL_CLIENT_ID_HERE
 *
 * To get your Client ID:
 * 1. Go to https://developer.paypal.com/dashboard/applications/sandbox (for testing)
 * 2. Or https://developer.paypal.com/dashboard/applications/live (for production)
 * 3. Create an app or use the default sandbox app
 * 4. Copy the Client ID
 * 5. Replace YOUR_PAYPAL_CLIENT_ID_HERE in index.html
 *
 * ============================================================
 */

(function() {
  'use strict';

  // Track if buttons have been rendered
  let paypalButtonRendered = false;

  /**
   * Initialize PayPal buttons in the specified container
   * @param {string} containerId - ID of container element for PayPal buttons
   */
  function initPayPalButtons(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn('PayPal container not found:', containerId);
      return;
    }

    // Clear container
    container.innerHTML = '';

    // Check if PayPal SDK is loaded
    if (typeof paypal === 'undefined') {
      container.innerHTML =
        '<div class="alert alert-warning" role="alert">' +
        '<i class="bi bi-exclamation-triangle"></i> ' +
        '<strong>PayPal not available.</strong> ' +
        'The PayPal Client ID needs to be configured. ' +
        'See index.html for setup instructions.' +
        '</div>';
      console.error('PayPal SDK not loaded. Check that the Client ID is configured in index.html');
      return;
    }

    // Render PayPal buttons
    try {
      paypal.Buttons({
        // Button style
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'donate',
          height: 48
        },

        // Called when button is clicked - validate before opening PayPal
        onClick: function(data, actions) {
          const amount = window.NHSDonation ? window.NHSDonation.getAmount() : null;

          if (!amount || amount <= 0) {
            showPaymentError('Please select or enter a donation amount first.');
            return actions.reject();
          }

          return actions.resolve();
        },

        // Create the order with PayPal
        createOrder: function(data, actions) {
          const state = window.NHSDonation ? window.NHSDonation.getState() : {};
          const amount = state.amount || 0;
          const scholarshipName = state.scholarshipName || 'General Fund';

          return actions.order.create({
            purchase_units: [{
              description: 'NHS Scholarship Fund Donation' + (scholarshipName ? ' - ' + scholarshipName : ''),
              custom_id: state.donorEmail || '', // Store donor email for reference
              amount: {
                currency_code: 'USD',
                value: amount.toFixed(2)
              }
            }]
          });
        },

        // Handle successful payment approval
        onApprove: function(data, actions) {
          // Show processing message
          showPaymentProcessing();

          return actions.order.capture().then(function(details) {
            // Payment successful - redirect to thank you page
            const state = window.NHSDonation ? window.NHSDonation.getState() : {};
            const params = new URLSearchParams();
            params.set('amount', state.amount || 0);
            params.set('method', 'PayPal');
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
          console.error('PayPal Error:', err);
          hidePaymentProcessing();
          showPaymentError('There was an error processing your payment. Please try again.');
        },

        // Handle cancellation
        onCancel: function(data) {
          console.log('PayPal payment cancelled by user');
          hidePaymentProcessing();
          // User cancelled - they can try again, no error needed
        }
      }).render('#' + containerId).then(function() {
        paypalButtonRendered = true;
      }).catch(function(err) {
        console.error('PayPal button render error:', err);
        container.innerHTML =
          '<div class="alert alert-danger" role="alert">' +
          '<i class="bi bi-x-circle"></i> ' +
          'Unable to load PayPal. Please refresh the page or try another payment method.' +
          '</div>';
      });
    } catch (err) {
      console.error('PayPal initialization error:', err);
    }
  }

  /**
   * Show error message in payment container
   * @param {string} message - Error message to display
   */
  function showPaymentError(message) {
    const container = document.getElementById('payment-container');
    if (container) {
      const existingAlert = container.querySelector('.alert-danger');
      if (existingAlert) {
        existingAlert.remove();
      }

      const alert = document.createElement('div');
      alert.className = 'alert alert-danger mt-3';
      alert.setAttribute('role', 'alert');
      alert.innerHTML = '<i class="bi bi-exclamation-circle"></i> ' + message;
      container.appendChild(alert);

      // Remove after 5 seconds
      setTimeout(function() {
        alert.remove();
      }, 5000);
    }
  }

  /**
   * Show processing indicator
   */
  function showPaymentProcessing() {
    const container = document.getElementById('payment-container');
    if (container) {
      const processing = document.createElement('div');
      processing.id = 'payment-processing';
      processing.className = 'text-center py-3';
      processing.innerHTML =
        '<div class="spinner-border text-primary" role="status">' +
        '<span class="visually-hidden">Processing...</span>' +
        '</div>' +
        '<p class="mt-2 mb-0">Processing your donation...</p>';
      container.appendChild(processing);
    }
  }

  /**
   * Hide processing indicator
   */
  function hidePaymentProcessing() {
    const processing = document.getElementById('payment-processing');
    if (processing) {
      processing.remove();
    }
  }

  // Export for use by other modules
  window.NHSPayPal = {
    init: initPayPalButtons,
    isRendered: function() { return paypalButtonRendered; }
  };
})();
