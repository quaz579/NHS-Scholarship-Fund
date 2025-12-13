/**
 * NHS Scholarship Fund - PayPal Integration
 * See PAYPAL_INTEGRATION.md for full documentation
 *
 * PLACEHOLDER: Replace YOUR_CLIENT_ID_HERE with actual PayPal Client ID
 * Location: PayPal Developer Dashboard > My Apps & Credentials
 */

(function() {
  'use strict';

  // Configuration
  const PAYPAL_CONFIG = {
    clientId: 'YOUR_CLIENT_ID_HERE', // PLACEHOLDER - Replace with actual Client ID
    currency: 'USD',
    intent: 'capture'
  };

  /**
   * Initialize PayPal buttons
   * @param {string} containerId - ID of container element for PayPal buttons
   */
  function initPayPalButtons(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn('PayPal container not found:', containerId);
      return;
    }

    // Check if PayPal SDK is loaded
    if (typeof paypal === 'undefined') {
      container.innerHTML =
        '<p class="text-warning text-center">' +
        '<i class="bi bi-exclamation-triangle"></i> ' +
        'PayPal SDK not loaded. Add your Client ID to enable PayPal payments.' +
        '</p>';
      return;
    }

    // Render PayPal buttons
    paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal'
      },

      createOrder: function(data, actions) {
        const amount = window.NHSDonation ? window.NHSDonation.getAmount() : 0;

        if (!amount || amount <= 0) {
          alert('Please select a donation amount.');
          return;
        }

        return actions.order.create({
          purchase_units: [{
            description: 'NHS Scholarship Fund Donation',
            amount: {
              currency_code: PAYPAL_CONFIG.currency,
              value: amount.toFixed(2)
            }
          }]
        });
      },

      onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          // Successful payment
          const state = window.NHSDonation ? window.NHSDonation.getState() : {};
          const params = new URLSearchParams();
          params.set('amount', state.amount || 0);
          params.set('method', 'PayPal');
          params.set('transaction', data.orderID);
          if (state.scholarshipName) {
            params.set('scholarship', state.scholarshipName);
          }

          window.location.href = 'pages/thank-you.html?' + params.toString();
        });
      },

      onError: function(err) {
        console.error('PayPal Error:', err);
        window.location.href = 'pages/error.html?reason=payment_failed';
      },

      onCancel: function(data) {
        console.log('PayPal payment cancelled');
        // User cancelled, stay on page
      }
    }).render('#' + containerId);
  }

  // Export for use by other modules
  window.NHSPayPal = {
    init: initPayPalButtons,
    config: PAYPAL_CONFIG
  };
})();
