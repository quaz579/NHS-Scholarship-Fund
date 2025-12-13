/**
 * NHS Scholarship Fund - Google Pay Integration
 * See GOOGLEPAY_INTEGRATION.md for full documentation
 *
 * PLACEHOLDER: Replace YOUR_MERCHANT_ID_HERE with actual Google Merchant ID
 * Location: Google Pay & Wallet Console
 */

(function() {
  'use strict';

  // Configuration
  const GOOGLEPAY_CONFIG = {
    merchantId: 'YOUR_MERCHANT_ID_HERE', // PLACEHOLDER - Replace with actual Merchant ID
    merchantName: 'NHS Scholarship Fund',
    environment: 'TEST', // Change to 'PRODUCTION' when ready
    allowedPaymentMethods: [{
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
        allowedCardNetworks: ['MASTERCARD', 'VISA', 'AMEX', 'DISCOVER']
      },
      tokenizationSpecification: {
        type: 'PAYMENT_GATEWAY',
        parameters: {
          gateway: 'YOUR_GATEWAY_HERE', // PLACEHOLDER - e.g., 'stripe', 'braintree'
          gatewayMerchantId: 'YOUR_GATEWAY_MERCHANT_ID_HERE' // PLACEHOLDER
        }
      }
    }]
  };

  let googlePayClient = null;

  /**
   * Initialize Google Pay
   * @param {string} containerId - ID of container element for Google Pay button
   */
  function initGooglePay(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn('Google Pay container not found:', containerId);
      return;
    }

    // Check if Google Pay API is loaded
    if (typeof google === 'undefined' || !google.payments) {
      container.innerHTML =
        '<p class="text-warning text-center">' +
        '<i class="bi bi-exclamation-triangle"></i> ' +
        'Google Pay SDK not loaded. Add the Google Pay script to enable Google Pay.' +
        '</p>';
      return;
    }

    // Initialize Google Pay client
    googlePayClient = new google.payments.api.PaymentsClient({
      environment: GOOGLEPAY_CONFIG.environment
    });

    // Check if Google Pay is available
    googlePayClient.isReadyToPay({
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: GOOGLEPAY_CONFIG.allowedPaymentMethods
    }).then(function(response) {
      if (response.result) {
        createGooglePayButton(containerId);
      } else {
        container.innerHTML =
          '<p class="text-muted text-center">' +
          '<i class="bi bi-info-circle"></i> ' +
          'Google Pay is not available on this device/browser.' +
          '</p>';
      }
    }).catch(function(err) {
      console.error('Google Pay isReadyToPay error:', err);
    });
  }

  /**
   * Create and render Google Pay button
   * @param {string} containerId - ID of container element
   */
  function createGooglePayButton(containerId) {
    const button = googlePayClient.createButton({
      onClick: handleGooglePayClick,
      buttonColor: 'black',
      buttonType: 'donate',
      buttonSizeMode: 'fill'
    });

    const container = document.getElementById(containerId);
    if (container) {
      container.appendChild(button);
    }
  }

  /**
   * Handle Google Pay button click
   */
  function handleGooglePayClick() {
    const amount = window.NHSDonation ? window.NHSDonation.getAmount() : 0;

    if (!amount || amount <= 0) {
      alert('Please select a donation amount.');
      return;
    }

    const paymentDataRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: GOOGLEPAY_CONFIG.allowedPaymentMethods,
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPrice: amount.toFixed(2),
        currencyCode: 'USD',
        countryCode: 'US'
      },
      merchantInfo: {
        merchantId: GOOGLEPAY_CONFIG.merchantId,
        merchantName: GOOGLEPAY_CONFIG.merchantName
      }
    };

    googlePayClient.loadPaymentData(paymentDataRequest)
      .then(function(paymentData) {
        // Process payment
        processGooglePayPayment(paymentData);
      })
      .catch(function(err) {
        if (err.statusCode === 'CANCELED') {
          console.log('Google Pay payment cancelled');
        } else {
          console.error('Google Pay error:', err);
          window.location.href = 'pages/error.html?reason=payment_failed';
        }
      });
  }

  /**
   * Process Google Pay payment data
   * @param {Object} paymentData - Payment data from Google Pay
   */
  function processGooglePayPayment(paymentData) {
    // In production, send paymentData.paymentMethodData.tokenizationData.token
    // to your payment processor

    const state = window.NHSDonation ? window.NHSDonation.getState() : {};
    const params = new URLSearchParams();
    params.set('amount', state.amount || 0);
    params.set('method', 'GooglePay');
    if (state.scholarshipName) {
      params.set('scholarship', state.scholarshipName);
    }

    window.location.href = 'pages/thank-you.html?' + params.toString();
  }

  // Export for use by other modules
  window.NHSGooglePay = {
    init: initGooglePay,
    config: GOOGLEPAY_CONFIG
  };
})();
