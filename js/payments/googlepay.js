/**
 * NHS Scholarship Fund - Google Pay Integration
 * See GOOGLEPAY_INTEGRATION.md for full documentation
 *
 * ============================================================
 * PLACEHOLDER CREDENTIALS - MUST BE REPLACED BEFORE GOING LIVE
 * ============================================================
 *
 * Current environment: TEST (no real payments processed)
 *
 * Placeholders to replace:
 * 1. merchantId: YOUR_GOOGLE_MERCHANT_ID_HERE
 *    - Get from: https://pay.google.com/business/console
 *
 * 2. gateway: Currently set to 'example' for testing
 *    - For production, use your payment processor:
 *      - 'stripe' with stripe:publishableKey
 *      - 'braintree' with braintree:clientKey
 *      - See Google Pay docs for full list
 *
 * 3. gatewayMerchantId: YOUR_GATEWAY_MERCHANT_ID_HERE
 *    - Your merchant ID from your payment processor
 *
 * To go live:
 * 1. Change environment from 'TEST' to 'PRODUCTION'
 * 2. Replace all placeholder values
 * 3. Complete Google Pay integration checklist
 *
 * ============================================================
 */

(function() {
  'use strict';

  // ============================================================
  // CONFIGURATION - Update these values for production
  // ============================================================
  const GOOGLEPAY_CONFIG = {
    // PLACEHOLDER: Change to 'PRODUCTION' when ready to accept real payments
    environment: 'TEST',

    // PLACEHOLDER: Replace with your Google Merchant ID from Google Pay Console
    merchantId: 'YOUR_GOOGLE_MERCHANT_ID_HERE',
    merchantName: 'NHS Scholarship Fund',

    // API version (do not change)
    apiVersion: 2,
    apiVersionMinor: 0,

    // Allowed payment methods
    allowedPaymentMethods: [{
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
        allowedCardNetworks: ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER']
      },
      tokenizationSpecification: {
        type: 'PAYMENT_GATEWAY',
        parameters: {
          // PLACEHOLDER: Replace with your payment gateway
          // Options: 'stripe', 'braintree', 'square', 'adyen', etc.
          gateway: 'example',
          // PLACEHOLDER: Replace with your gateway merchant ID
          gatewayMerchantId: 'YOUR_GATEWAY_MERCHANT_ID_HERE'

          // For Stripe, use:
          // gateway: 'stripe',
          // 'stripe:version': '2023-10-16',
          // 'stripe:publishableKey': 'pk_test_YOUR_STRIPE_KEY'

          // For Braintree, use:
          // gateway: 'braintree',
          // 'braintree:apiVersion': 'v1',
          // 'braintree:sdkVersion': '3.x.x',
          // 'braintree:merchantId': 'YOUR_BRAINTREE_MERCHANT_ID',
          // 'braintree:clientKey': 'YOUR_BRAINTREE_CLIENT_KEY'
        }
      }
    }]
  };

  let googlePayClient = null;
  let googlePayButtonRendered = false;

  /**
   * Get or create Google Pay client
   */
  function getGooglePaymentsClient() {
    if (googlePayClient === null) {
      googlePayClient = new google.payments.api.PaymentsClient({
        environment: GOOGLEPAY_CONFIG.environment
      });
    }
    return googlePayClient;
  }

  /**
   * Called when Google Pay SDK loads
   */
  window.googlePayLoaded = function() {
    console.log('Google Pay SDK loaded');
  };

  /**
   * Initialize Google Pay button in the specified container
   * @param {string} containerId - ID of container element
   */
  function initGooglePay(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn('Google Pay container not found:', containerId);
      return;
    }

    // Clear container
    container.innerHTML = '';

    // Check if Google Pay API is available
    if (typeof google === 'undefined' || !google.payments || !google.payments.api) {
      container.innerHTML =
        '<div class="alert alert-warning" role="alert">' +
        '<i class="bi bi-exclamation-triangle"></i> ' +
        '<strong>Google Pay not available.</strong> ' +
        'The Google Pay SDK is still loading or not supported in this browser.' +
        '</div>';
      return;
    }

    // Check if Google Pay is ready
    const client = getGooglePaymentsClient();

    client.isReadyToPay({
      apiVersion: GOOGLEPAY_CONFIG.apiVersion,
      apiVersionMinor: GOOGLEPAY_CONFIG.apiVersionMinor,
      allowedPaymentMethods: GOOGLEPAY_CONFIG.allowedPaymentMethods
    }).then(function(response) {
      if (response.result) {
        createGooglePayButton(containerId);
      } else {
        container.innerHTML =
          '<div class="alert alert-info" role="alert">' +
          '<i class="bi bi-info-circle"></i> ' +
          'Google Pay is not available on this device or browser. ' +
          'Please use another payment method.' +
          '</div>';
      }
    }).catch(function(err) {
      console.error('Google Pay isReadyToPay error:', err);
      container.innerHTML =
        '<div class="alert alert-warning" role="alert">' +
        '<i class="bi bi-exclamation-triangle"></i> ' +
        'Unable to initialize Google Pay. Please try another payment method.' +
        '</div>';
    });
  }

  /**
   * Create and render Google Pay button
   */
  function createGooglePayButton(containerId) {
    const client = getGooglePaymentsClient();
    const container = document.getElementById(containerId);

    const button = client.createButton({
      onClick: handleGooglePayClick,
      buttonColor: 'black',
      buttonType: 'donate',
      buttonSizeMode: 'fill',
      buttonLocale: 'en'
    });

    // Style the button container
    button.style.width = '100%';
    button.style.minHeight = '48px';

    container.appendChild(button);
    googlePayButtonRendered = true;
  }

  /**
   * Handle Google Pay button click
   */
  function handleGooglePayClick() {
    const amount = window.NHSDonation ? window.NHSDonation.getAmount() : null;

    if (!amount || amount <= 0) {
      showPaymentError('Please select or enter a donation amount first.');
      return;
    }

    const state = window.NHSDonation ? window.NHSDonation.getState() : {};

    const paymentDataRequest = {
      apiVersion: GOOGLEPAY_CONFIG.apiVersion,
      apiVersionMinor: GOOGLEPAY_CONFIG.apiVersionMinor,
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

    const client = getGooglePaymentsClient();

    client.loadPaymentData(paymentDataRequest)
      .then(function(paymentData) {
        processGooglePayPayment(paymentData, state);
      })
      .catch(function(err) {
        if (err.statusCode === 'CANCELED') {
          console.log('Google Pay payment cancelled by user');
        } else {
          console.error('Google Pay error:', err);
          showPaymentError('There was an error with Google Pay. Please try again.');
        }
      });
  }

  /**
   * Process Google Pay payment data
   */
  function processGooglePayPayment(paymentData, state) {
    // In production, send paymentData.paymentMethodData.tokenizationData.token
    // to your server for processing with your payment gateway

    console.log('Google Pay payment data:', paymentData);

    // For demo/test mode, redirect to thank you page
    const params = new URLSearchParams();
    params.set('amount', state.amount || 0);
    params.set('method', 'GooglePay');
    if (state.scholarshipName) {
      params.set('scholarship', state.scholarshipName);
    }
    if (state.donorName) {
      params.set('donor', state.donorName);
    }

    window.location.href = 'pages/thank-you.html?' + params.toString();
  }

  /**
   * Show error message
   */
  function showPaymentError(message) {
    const container = document.getElementById('payment-container');
    if (container) {
      const existingAlert = container.querySelector('.alert-danger');
      if (existingAlert) existingAlert.remove();

      const alert = document.createElement('div');
      alert.className = 'alert alert-danger mt-3';
      alert.setAttribute('role', 'alert');
      alert.innerHTML = '<i class="bi bi-exclamation-circle"></i> ' + message;
      container.appendChild(alert);

      setTimeout(function() { alert.remove(); }, 5000);
    }
  }

  // Export for use by other modules
  window.NHSGooglePay = {
    init: initGooglePay,
    config: GOOGLEPAY_CONFIG,
    isRendered: function() { return googlePayButtonRendered; }
  };
})();
