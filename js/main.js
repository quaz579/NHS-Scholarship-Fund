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
    donorEmail: ''
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
    initializePaymentButtons();
  }

  /**
   * Initialize PayPal and Venmo buttons automatically on page load
   * Both use the PayPal SDK - Venmo is rendered separately with fundingSource parameter
   */
  function initializePaymentButtons() {
    const paypalContainerId = 'paypal-button-container';
    const venmoContainerId = 'venmo-button-container';
    const paypalContainer = document.getElementById(paypalContainerId);
    const venmoContainer = document.getElementById(venmoContainerId);

    if (!paypalContainer || !venmoContainer) {
      if (!paypalContainer) {
        console.warn('PayPal button container not found: ' + paypalContainerId);
      }
      if (!venmoContainer) {
        console.warn('Venmo button container not found: ' + venmoContainerId);
      }
      return;
    }

    // Initialize PayPal and Venmo buttons
    // Both need the PayPal SDK to be loaded first
    if (window.NHSPayPal && window.NHSVenmo) {
      window.NHSPayPal.init(paypalContainerId);
      window.NHSVenmo.init(venmoContainerId);
    } else {
      // PayPal SDK may not be loaded yet, retry up to 20 times every 250ms (5 seconds total)
      var retries = 0;
      var maxRetries = 20;
      var interval = setInterval(function() {
        if (window.NHSPayPal && window.NHSVenmo) {
          window.NHSPayPal.init(paypalContainerId);
          window.NHSVenmo.init(venmoContainerId);
          clearInterval(interval);
        } else if (++retries >= maxRetries) {
          clearInterval(interval);
          console.error('Payment SDKs failed to load after ' + maxRetries + ' retries');
        }
      }, 250);
    }
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
    getAmount: function() {
      return donationState.amount;
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
