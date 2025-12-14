/**
 * NHS Scholarship Fund - Apple Pay Integration
 * See APPLEPAY_INTEGRATION.md for full documentation
 *
 * ============================================================
 * PLACEHOLDER CREDENTIALS - MUST BE REPLACED BEFORE GOING LIVE
 * ============================================================
 *
 * Apple Pay Requirements:
 * 1. Apple Developer Account with Apple Pay capability
 * 2. Merchant ID registered with Apple
 * 3. Payment Processing Certificate
 * 4. Domain verification file hosted on your server
 * 5. HTTPS required (Apple Pay will not work on HTTP)
 *
 * Placeholders to replace:
 * 1. merchantId: YOUR_APPLE_MERCHANT_ID_HERE
 *    - Format: merchant.com.yourcompany.yourapp
 *    - Register at: https://developer.apple.com/account/resources/identifiers
 *
 * 2. Merchant validation endpoint (server-side required)
 *    - You need a server endpoint to validate the merchant session
 *    - Apple provides the validation URL during payment
 *
 * Important Notes:
 * - Apple Pay only works on Safari (macOS/iOS) and supported devices
 * - Requires server-side component for merchant validation
 * - Cannot be fully tested without Apple Developer account
 *
 * ============================================================
 */

(function() {
  'use strict';

  // ============================================================
  // CONFIGURATION - Update these values for production
  // ============================================================
  const APPLEPAY_CONFIG = {
    // PLACEHOLDER: Replace with your Apple Merchant ID
    // Format: merchant.com.yourorganization.yourapp
    merchantId: 'YOUR_APPLE_MERCHANT_ID_HERE',

    // Display name shown on Apple Pay sheet
    merchantName: 'NHS Scholarship Fund',

    // Supported card networks
    supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],

    // Merchant capabilities
    merchantCapabilities: ['supports3DS'],

    // Country and currency
    countryCode: 'US',
    currencyCode: 'USD',

    // PLACEHOLDER: Your server endpoint for merchant validation
    // This endpoint must call Apple's validation URL and return the session
    merchantValidationEndpoint: '/api/apple-pay/validate-merchant'
  };

  let applePayButtonRendered = false;

  /**
   * Initialize Apple Pay button in the specified container
   * @param {string} containerId - ID of container element
   */
  function initApplePay(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn('Apple Pay container not found:', containerId);
      return;
    }

    // Clear container
    container.innerHTML = '';

    // Check if Apple Pay is available
    if (!window.ApplePaySession) {
      container.innerHTML =
        '<div class="alert alert-info" role="alert">' +
        '<i class="bi bi-info-circle"></i> ' +
        'Apple Pay is only available on Safari (macOS/iOS). ' +
        'Please use another payment method or switch to Safari.' +
        '</div>';
      return;
    }

    // Check if Apple Pay can make payments
    if (!ApplePaySession.canMakePayments()) {
      container.innerHTML =
        '<div class="alert alert-info" role="alert">' +
        '<i class="bi bi-info-circle"></i> ' +
        'Apple Pay is not set up on this device. ' +
        'Please add a card to Apple Pay or use another payment method.' +
        '</div>';
      return;
    }

    // Check if merchant is configured
    if (APPLEPAY_CONFIG.merchantId === 'YOUR_APPLE_MERCHANT_ID_HERE') {
      container.innerHTML =
        '<div class="alert alert-warning" role="alert">' +
        '<i class="bi bi-exclamation-triangle"></i> ' +
        '<strong>Apple Pay not configured.</strong> ' +
        'The Apple Merchant ID needs to be set up. ' +
        'See APPLEPAY_INTEGRATION.md for instructions.' +
        '</div>';
      return;
    }

    // Create Apple Pay button
    createApplePayButton(containerId);
  }

  /**
   * Create and render Apple Pay button
   */
  function createApplePayButton(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Create Apple Pay button wrapper
    const buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'apple-pay-button-wrapper';
    buttonWrapper.style.cssText = 'width: 100%; min-height: 48px;';

    // Create the button using Apple's button styles
    const button = document.createElement('button');
    button.className = 'apple-pay-button';
    button.setAttribute('aria-label', 'Donate with Apple Pay');
    button.style.cssText =
      'width: 100%; ' +
      'height: 48px; ' +
      'border-radius: 8px; ' +
      'cursor: pointer; ' +
      'background-color: black; ' +
      'border: none; ' +
      '-webkit-appearance: -apple-pay-button; ' +
      '-apple-pay-button-type: donate; ' +
      '-apple-pay-button-style: black;';

    button.addEventListener('click', handleApplePayClick);

    buttonWrapper.appendChild(button);
    container.appendChild(buttonWrapper);
    applePayButtonRendered = true;
  }

  /**
   * Handle Apple Pay button click
   */
  function handleApplePayClick() {
    const amount = window.NHSDonation ? window.NHSDonation.getAmount() : null;

    if (!amount || amount <= 0) {
      showPaymentError('Please select or enter a donation amount first.');
      return;
    }

    const state = window.NHSDonation ? window.NHSDonation.getState() : {};

    // Create payment request
    const paymentRequest = {
      countryCode: APPLEPAY_CONFIG.countryCode,
      currencyCode: APPLEPAY_CONFIG.currencyCode,
      supportedNetworks: APPLEPAY_CONFIG.supportedNetworks,
      merchantCapabilities: APPLEPAY_CONFIG.merchantCapabilities,
      total: {
        label: 'NHS Scholarship Fund Donation',
        amount: amount.toFixed(2),
        type: 'final'
      }
    };

    // Create Apple Pay session (version 3)
    let session;
    try {
      session = new ApplePaySession(3, paymentRequest);
    } catch (err) {
      console.error('Failed to create Apple Pay session:', err);
      showPaymentError('Unable to start Apple Pay. Please try another payment method.');
      return;
    }

    // Merchant validation handler
    session.onvalidatemerchant = function(event) {
      console.log('Merchant validation requested:', event.validationURL);

      // In production, call your server to validate with Apple
      // Your server must:
      // 1. Call event.validationURL with your merchant certificate
      // 2. Return the merchant session from Apple
      // 3. Pass that session to session.completeMerchantValidation()

      // For now, show configuration message
      // See APPLEPAY_INTEGRATION.md for production implementation example
      showPaymentError(
        'Apple Pay merchant validation not configured. ' +
        'Server-side setup required. See APPLEPAY_INTEGRATION.md'
      );
      session.abort();
    };

    // Payment authorization handler
    session.onpaymentauthorized = function(event) {
      const payment = event.payment;

      // In production, send payment.token to your payment processor
      console.log('Apple Pay payment authorized:', payment);

      // Process the payment (server-side)
      processApplePayPayment(payment, state, session);
    };

    // Payment cancelled handler
    session.oncancel = function(event) {
      console.log('Apple Pay payment cancelled by user');
    };

    // Start the session
    session.begin();
  }

  /**
   * Process Apple Pay payment
   * See APPLEPAY_INTEGRATION.md for production implementation example
   */
  function processApplePayPayment(payment, state, session) {
    // In production:
    // 1. Send payment.token.paymentData to your payment processor
    // 2. Process the payment
    // 3. Call session.completePayment() with result
    // See APPLEPAY_INTEGRATION.md for complete production example

    // For demo, complete with success and redirect
    session.completePayment(ApplePaySession.STATUS_SUCCESS);
    redirectToThankYou(state);
  }

  /**
   * Redirect to thank you page
   */
  function redirectToThankYou(state) {
    const params = new URLSearchParams();
    params.set('amount', state.amount || 0);
    params.set('method', 'ApplePay');
    if (state.scholarshipName) {
      params.set('scholarship', state.scholarshipName);
    }
    if (state.donorName) {
      params.set('donor', state.donorName);
    }

    window.location.href = 'pages/thank-you.html?' + params.toString();
  }

  /**
   * Show error message - uses shared utility for accessibility
   */
  function showPaymentError(message) {
    if (window.NHSPaymentUtils) {
      window.NHSPaymentUtils.showError(message);
    }
  }

  // Export for use by other modules
  window.NHSApplePay = {
    init: initApplePay,
    config: APPLEPAY_CONFIG,
    isRendered: function() { return applePayButtonRendered; }
  };
})();
