/**
 * NHS Scholarship Fund - Main JavaScript
 * Core functionality for the donation website
 */

(function() {
  'use strict';

  // ================================
  // State Management
  // ================================
  const donationState = {
    amount: null,
    scholarshipName: '',
    donorName: '',
    donorEmail: '',
    paymentMethod: null
  };

  // ================================
  // DOM Elements
  // ================================
  const elements = {
    form: null,
    amountButtons: null,
    customAmountInput: null,
    selectedAmountInput: null,
    paymentButtons: null,
    selectedPaymentInput: null,
    paymentContainer: null,
    scholarshipInput: null,
    donorNameInput: null,
    donorEmailInput: null,
    currentYearSpan: null
  };

  // ================================
  // Initialization
  // ================================
  function init() {
    cacheElements();
    bindEvents();
    setCurrentYear();
  }

  function cacheElements() {
    elements.form = document.getElementById('donation-form');
    elements.amountButtons = document.querySelectorAll('.amount-btn');
    elements.customAmountInput = document.getElementById('custom-amount');
    elements.selectedAmountInput = document.getElementById('selected-amount');
    elements.paymentButtons = document.querySelectorAll('.payment-btn');
    elements.selectedPaymentInput = document.getElementById('selected-payment');
    elements.paymentContainer = document.getElementById('payment-container');
    elements.scholarshipInput = document.getElementById('scholarship-name');
    elements.donorNameInput = document.getElementById('donor-name');
    elements.donorEmailInput = document.getElementById('donor-email');
    elements.currentYearSpan = document.getElementById('current-year');
  }

  function bindEvents() {
    // Amount button clicks
    elements.amountButtons.forEach(function(btn) {
      btn.addEventListener('click', handleAmountButtonClick);
    });

    // Custom amount input
    if (elements.customAmountInput) {
      elements.customAmountInput.addEventListener('input', handleCustomAmountInput);
      elements.customAmountInput.addEventListener('focus', handleCustomAmountFocus);
    }

    // Payment method buttons
    elements.paymentButtons.forEach(function(btn) {
      btn.addEventListener('click', handlePaymentButtonClick);
    });

    // Form input changes
    if (elements.scholarshipInput) {
      elements.scholarshipInput.addEventListener('input', handleScholarshipInput);
    }
    if (elements.donorNameInput) {
      elements.donorNameInput.addEventListener('input', handleDonorNameInput);
    }
    if (elements.donorEmailInput) {
      elements.donorEmailInput.addEventListener('input', handleDonorEmailInput);
    }
  }

  // ================================
  // Amount Selection Handlers
  // ================================
  function handleAmountButtonClick(event) {
    const btn = event.currentTarget;
    const amount = parseFloat(btn.dataset.amount);

    // Clear custom amount
    if (elements.customAmountInput) {
      elements.customAmountInput.value = '';
      elements.customAmountInput.classList.remove('is-invalid', 'is-valid');
    }

    // Update button states
    elements.amountButtons.forEach(function(b) {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');

    // Update state
    setAmount(amount);
  }

  function handleCustomAmountInput(event) {
    const input = event.currentTarget;
    const value = input.value.trim();

    // Clear preset button selection
    elements.amountButtons.forEach(function(btn) {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    });

    if (value === '') {
      setAmount(null);
      input.classList.remove('is-invalid', 'is-valid');
      return;
    }

    const amount = parseFloat(value);
    if (isNaN(amount) || amount <= 0) {
      setAmount(null);
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
    } else {
      setAmount(amount);
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    }
  }

  function handleCustomAmountFocus() {
    // Clear preset selection when focusing custom amount
    elements.amountButtons.forEach(function(btn) {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    });
  }

  function setAmount(amount) {
    donationState.amount = amount;
    if (elements.selectedAmountInput) {
      elements.selectedAmountInput.value = amount !== null ? amount.toFixed(2) : '';
    }
  }

  // ================================
  // Payment Method Handlers
  // ================================
  function handlePaymentButtonClick(event) {
    const btn = event.currentTarget;
    const method = btn.dataset.method;

    // Update button states
    elements.paymentButtons.forEach(function(b) {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');

    // Update state
    setPaymentMethod(method);

    // Show payment container
    showPaymentContainer(method);

    // Hide payment error if showing
    const paymentError = document.getElementById('payment-error');
    if (paymentError) {
      paymentError.style.display = 'none';
    }
  }

  function setPaymentMethod(method) {
    donationState.paymentMethod = method;
    if (elements.selectedPaymentInput) {
      elements.selectedPaymentInput.value = method || '';
    }
  }

  function showPaymentContainer(method) {
    if (!elements.paymentContainer) return;

    elements.paymentContainer.style.display = 'block';

    // Create container for payment button
    const containerId = method + '-button-container';
    elements.paymentContainer.innerHTML =
      '<div id="' + containerId + '" class="payment-button-wrapper"></div>';

    // Initialize the appropriate payment method
    // Container is synchronously added to DOM, so no delay needed
    initializePaymentMethod(method, containerId);
  }

  /**
   * Initialize payment method SDK buttons
   * @param {string} method - Payment method identifier
   * @param {string} containerId - Container element ID
   */
  function initializePaymentMethod(method, containerId) {
    switch (method) {
      case 'paypal':
        if (window.NHSPayPal && typeof window.NHSPayPal.init === 'function') {
          window.NHSPayPal.init(containerId);
        } else {
          showPaymentFallback(containerId, 'PayPal');
        }
        break;

      case 'venmo':
        if (window.NHSVenmo && typeof window.NHSVenmo.init === 'function') {
          window.NHSVenmo.init(containerId);
        } else {
          showPaymentFallback(containerId, 'Venmo');
        }
        break;

      case 'googlepay':
        if (window.NHSGooglePay && typeof window.NHSGooglePay.init === 'function') {
          window.NHSGooglePay.init(containerId);
        } else {
          showPaymentFallback(containerId, 'Google Pay');
        }
        break;

      case 'applepay':
        if (window.NHSApplePay && typeof window.NHSApplePay.init === 'function') {
          window.NHSApplePay.init(containerId);
        } else {
          showPaymentFallback(containerId, 'Apple Pay');
        }
        break;

      default:
        showPaymentFallback(containerId, method);
    }
  }

  /**
   * Show fallback message when payment SDK is not available
   * @param {string} containerId - Container element ID
   * @param {string} methodName - Payment method display name
   */
  function showPaymentFallback(containerId, methodName) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML =
        '<div class="alert alert-info" role="alert">' +
        '<i class="bi bi-info-circle"></i> ' +
        methodName + ' is being configured. Please check back later or try another payment method.' +
        '</div>';
    }
  }

  // ================================
  // Form Input Handlers
  // ================================
  function handleScholarshipInput(event) {
    donationState.scholarshipName = event.currentTarget.value.trim();
  }

  function handleDonorNameInput(event) {
    donationState.donorName = event.currentTarget.value.trim();
  }

  function handleDonorEmailInput(event) {
    donationState.donorEmail = event.currentTarget.value.trim();
  }

  // ================================
  // Utility Functions
  // ================================
  function setCurrentYear() {
    if (elements.currentYearSpan) {
      elements.currentYearSpan.textContent = new Date().getFullYear();
    }
  }

  // ================================
  // Public API
  // ================================
  window.NHSDonation = {
    getState: function() {
      return Object.assign({}, donationState);
    },
    setAmount: setAmount,
    setPaymentMethod: setPaymentMethod,
    getAmount: function() {
      return donationState.amount;
    },
    getPaymentMethod: function() {
      return donationState.paymentMethod;
    },
    getScholarshipName: function() {
      return donationState.scholarshipName;
    },
    getDonorInfo: function() {
      return {
        name: donationState.donorName,
        email: donationState.donorEmail
      };
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
