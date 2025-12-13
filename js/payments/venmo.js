/**
 * NHS Scholarship Fund - Venmo Integration
 * See VENMO_INTEGRATION.md for full documentation
 *
 * Note: Venmo is integrated through the PayPal SDK
 * PLACEHOLDER: Uses same Client ID as PayPal
 */

(function() {
  'use strict';

  // Configuration
  const VENMO_CONFIG = {
    // Venmo uses PayPal's SDK and credentials
    enabled: true
  };

  /**
   * Initialize Venmo button
   * @param {string} containerId - ID of container element for Venmo button
   */
  function initVenmoButton(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn('Venmo container not found:', containerId);
      return;
    }

    // Check if PayPal SDK is loaded (Venmo is part of PayPal SDK)
    if (typeof paypal === 'undefined') {
      container.innerHTML =
        '<p class="text-warning text-center">' +
        '<i class="bi bi-exclamation-triangle"></i> ' +
        'Venmo SDK not loaded. Add PayPal Client ID to enable Venmo payments.' +
        '</p>';
      return;
    }

    // Render Venmo button (through PayPal SDK)
    paypal.Buttons({
      fundingSource: paypal.FUNDING.VENMO,

      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'venmo'
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
              currency_code: 'USD',
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
          params.set('method', 'Venmo');
          params.set('transaction', data.orderID);
          if (state.scholarshipName) {
            params.set('scholarship', state.scholarshipName);
          }

          window.location.href = 'pages/thank-you.html?' + params.toString();
        });
      },

      onError: function(err) {
        console.error('Venmo Error:', err);
        window.location.href = 'pages/error.html?reason=payment_failed';
      },

      onCancel: function(data) {
        console.log('Venmo payment cancelled');
        // User cancelled, stay on page
      }
    }).render('#' + containerId);
  }

  // Export for use by other modules
  window.NHSVenmo = {
    init: initVenmoButton,
    config: VENMO_CONFIG
  };
})();
