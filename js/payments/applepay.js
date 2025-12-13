/**
 * NHS Scholarship Fund - Apple Pay Integration
 * See APPLEPAY_INTEGRATION.md for full documentation
 *
 * PLACEHOLDER: Requires merchant certificate and domain verification
 * Location: Apple Developer Account > Certificates, Identifiers & Profiles
 */

(function() {
  'use strict';

  // Configuration
  const APPLEPAY_CONFIG = {
    merchantId: 'YOUR_MERCHANT_ID_HERE', // PLACEHOLDER - Replace with Apple Merchant ID
    merchantName: 'NHS Scholarship Fund',
    supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
    merchantCapabilities: ['supports3DS'],
    countryCode: 'US',
    currencyCode: 'USD'
  };

  /**
   * Initialize Apple Pay
   * @param {string} containerId - ID of container element for Apple Pay button
   */
  function initApplePay(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn('Apple Pay container not found:', containerId);
      return;
    }

    // Check if Apple Pay is available
    if (!window.ApplePaySession) {
      container.innerHTML =
        '<p class="text-muted text-center">' +
        '<i class="bi bi-info-circle"></i> ' +
        'Apple Pay is not available on this device/browser.' +
        '</p>';
      return;
    }

    // Check if Apple Pay can make payments
    if (!ApplePaySession.canMakePayments()) {
      container.innerHTML =
        '<p class="text-muted text-center">' +
        '<i class="bi bi-info-circle"></i> ' +
        'Apple Pay is not set up on this device.' +
        '</p>';
      return;
    }

    // Create Apple Pay button
    createApplePayButton(containerId);
  }

  /**
   * Create and render Apple Pay button
   * @param {string} containerId - ID of container element
   */
  function createApplePayButton(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Create Apple Pay button using CSS
    const button = document.createElement('button');
    button.className = 'apple-pay-button apple-pay-button-donate';
    button.style.cssText =
      'width: 100%; height: 48px; border-radius: 8px; cursor: pointer; ' +
      '-webkit-appearance: -apple-pay-button; -apple-pay-button-type: donate; ' +
      '-apple-pay-button-style: black;';
    button.addEventListener('click', handleApplePayClick);

    container.appendChild(button);
  }

  /**
   * Handle Apple Pay button click
   */
  function handleApplePayClick() {
    const amount = window.NHSDonation ? window.NHSDonation.getAmount() : 0;

    if (!amount || amount <= 0) {
      alert('Please select a donation amount.');
      return;
    }

    const paymentRequest = {
      countryCode: APPLEPAY_CONFIG.countryCode,
      currencyCode: APPLEPAY_CONFIG.currencyCode,
      supportedNetworks: APPLEPAY_CONFIG.supportedNetworks,
      merchantCapabilities: APPLEPAY_CONFIG.merchantCapabilities,
      total: {
        label: 'NHS Scholarship Fund Donation',
        amount: amount.toFixed(2)
      }
    };

    // Create Apple Pay session
    const session = new ApplePaySession(3, paymentRequest);

    // Merchant validation
    session.onvalidatemerchant = function(event) {
      // In production, call your server to validate the merchant
      // and get the merchant session from Apple
      console.log('Merchant validation URL:', event.validationURL);

      // PLACEHOLDER: Replace with actual merchant validation
      // Your server should call Apple's validation endpoint and return the session
      session.abort();
      alert('Apple Pay merchant validation not configured. Please set up your Apple Merchant ID.');
    };

    // Payment authorization
    session.onpaymentauthorized = function(event) {
      // Process the payment
      const payment = event.payment;

      // In production, send payment.token to your payment processor
      processApplePayPayment(payment, session);
    };

    // Payment cancelled
    session.oncancel = function(event) {
      console.log('Apple Pay payment cancelled');
    };

    // Start the session
    session.begin();
  }

  /**
   * Process Apple Pay payment
   * @param {Object} payment - Payment data from Apple Pay
   * @param {ApplePaySession} session - Apple Pay session
   */
  function processApplePayPayment(payment, session) {
    // In production, send payment.token.paymentData to your payment processor

    // Complete the session
    session.completePayment(ApplePaySession.STATUS_SUCCESS);

    // Redirect to thank you page
    const state = window.NHSDonation ? window.NHSDonation.getState() : {};
    const params = new URLSearchParams();
    params.set('amount', state.amount || 0);
    params.set('method', 'ApplePay');
    if (state.scholarshipName) {
      params.set('scholarship', state.scholarshipName);
    }

    window.location.href = 'pages/thank-you.html?' + params.toString();
  }

  // Export for use by other modules
  window.NHSApplePay = {
    init: initApplePay,
    config: APPLEPAY_CONFIG
  };
})();
