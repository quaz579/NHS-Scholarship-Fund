/**
 * NHS Scholarship Fund - Form Validation
 * Handles validation of the donation form
 */

(function() {
  'use strict';

  // ================================
  // Validation Rules
  // ================================
  const validators = {
    /**
     * Validates email format
     * @param {string} email - Email address to validate
     * @returns {boolean} - True if valid or empty (optional field)
     */
    email: function(email) {
      if (!email || email.trim() === '') {
        return true; // Email is optional
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email.trim());
    },

    /**
     * Validates donation amount
     * @param {number|string} amount - Amount to validate
     * @returns {boolean} - True if valid positive number
     */
    amount: function(amount) {
      if (amount === null || amount === undefined || amount === '') {
        return false;
      }
      const num = parseFloat(amount);
      return !isNaN(num) && num > 0;
    },

    /**
     * Validates payment method selection
     * @param {string} method - Payment method identifier
     * @returns {boolean} - True if valid method selected
     */
    paymentMethod: function(method) {
      const validMethods = ['paypal', 'venmo', 'googlepay', 'applepay'];
      return method && validMethods.includes(method);
    }
  };

  // ================================
  // Validation State
  // ================================
  const validationState = {
    amount: false,
    email: true, // Optional, starts valid
    paymentMethod: false
  };

  // ================================
  // DOM Elements
  // ================================
  let form = null;
  let customAmountInput = null;
  let emailInput = null;
  let selectedAmountInput = null;
  let selectedPaymentInput = null;

  // ================================
  // Initialization
  // ================================
  function init() {
    cacheElements();
    bindEvents();
  }

  function cacheElements() {
    form = document.getElementById('donation-form');
    customAmountInput = document.getElementById('custom-amount');
    emailInput = document.getElementById('donor-email');
    selectedAmountInput = document.getElementById('selected-amount');
    selectedPaymentInput = document.getElementById('selected-payment');
  }

  function bindEvents() {
    if (form) {
      form.addEventListener('submit', handleFormSubmit);
    }

    if (emailInput) {
      emailInput.addEventListener('blur', validateEmailField);
      emailInput.addEventListener('input', clearEmailValidation);
    }

    // Listen for amount changes
    if (selectedAmountInput) {
      // Use MutationObserver to watch for value changes
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
            validateAmountField();
          }
        });
      });
      observer.observe(selectedAmountInput, { attributes: true });

      // Also check on input events
      selectedAmountInput.addEventListener('change', validateAmountField);
    }

    // Listen for payment method changes
    if (selectedPaymentInput) {
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
            validatePaymentField();
          }
        });
      });
      observer.observe(selectedPaymentInput, { attributes: true });

      selectedPaymentInput.addEventListener('change', validatePaymentField);
    }
  }

  // ================================
  // Field Validation
  // ================================
  function validateEmailField() {
    if (!emailInput) return true;

    const email = emailInput.value.trim();
    const isValid = validators.email(email);

    validationState.email = isValid;

    if (email === '') {
      // Empty is valid (optional field), remove any validation classes
      emailInput.classList.remove('is-invalid', 'is-valid');
    } else if (isValid) {
      emailInput.classList.remove('is-invalid');
      emailInput.classList.add('is-valid');
    } else {
      emailInput.classList.remove('is-valid');
      emailInput.classList.add('is-invalid');
    }

    return isValid;
  }

  function clearEmailValidation() {
    if (!emailInput) return;
    // Remove validation classes while typing
    emailInput.classList.remove('is-invalid');
  }

  function validateAmountField() {
    let amount = null;

    // Check hidden input first
    if (selectedAmountInput && selectedAmountInput.value) {
      amount = selectedAmountInput.value;
    }
    // Fall back to custom amount input
    else if (customAmountInput && customAmountInput.value) {
      amount = customAmountInput.value;
    }

    const isValid = validators.amount(amount);
    validationState.amount = isValid;

    // Update custom amount input validation state
    if (customAmountInput && customAmountInput.value) {
      if (isValid) {
        customAmountInput.classList.remove('is-invalid');
        customAmountInput.classList.add('is-valid');
      } else {
        customAmountInput.classList.remove('is-valid');
        customAmountInput.classList.add('is-invalid');
      }
    }

    return isValid;
  }

  function validatePaymentField() {
    const method = selectedPaymentInput ? selectedPaymentInput.value : null;
    const isValid = validators.paymentMethod(method);
    validationState.paymentMethod = isValid;

    const paymentError = document.getElementById('payment-error');
    if (paymentError) {
      paymentError.style.display = isValid ? 'none' : 'block';
    }

    return isValid;
  }

  // ================================
  // Form Submission
  // ================================
  function handleFormSubmit(event) {
    event.preventDefault();

    // Validate all fields
    const isAmountValid = validateAmountField();
    const isEmailValid = validateEmailField();
    const isPaymentValid = validatePaymentField();

    // Show validation feedback
    showValidationFeedback();

    if (!isAmountValid || !isEmailValid || !isPaymentValid) {
      // Focus first invalid field
      if (!isAmountValid) {
        const amountButtons = document.querySelectorAll('.amount-btn');
        if (amountButtons.length > 0) {
          amountButtons[0].focus();
        } else if (customAmountInput) {
          customAmountInput.focus();
        }
      } else if (!isEmailValid && emailInput) {
        emailInput.focus();
      } else if (!isPaymentValid) {
        const paymentButtons = document.querySelectorAll('.payment-btn');
        if (paymentButtons.length > 0) {
          paymentButtons[0].focus();
        }
      }
      return false;
    }

    // Form is valid - proceed with payment
    processPayment();
    return true;
  }

  function showValidationFeedback() {
    // Show amount error if no amount selected
    if (!validationState.amount && customAmountInput) {
      customAmountInput.classList.add('is-invalid');
    }

    // Show payment error if no method selected
    if (!validationState.paymentMethod) {
      const paymentError = document.getElementById('payment-error');
      if (paymentError) {
        paymentError.style.display = 'block';
      }
    }
  }

  // ================================
  // Payment Processing
  // ================================
  function processPayment() {
    // Get current state from NHSDonation module
    const state = window.NHSDonation ? window.NHSDonation.getState() : {};

    // Build query string for thank you page
    const params = new URLSearchParams();
    params.set('amount', state.amount || 0);
    if (state.scholarshipName) {
      params.set('scholarship', state.scholarshipName);
    }
    if (state.donorName) {
      params.set('donor', state.donorName);
    }

    // For POC, redirect to thank you page
    // In production, this would trigger actual payment processing
    window.location.href = 'pages/thank-you.html?' + params.toString();
  }

  // ================================
  // Public API
  // ================================
  window.NHSValidation = {
    validate: function() {
      return {
        amount: validateAmountField(),
        email: validateEmailField(),
        paymentMethod: validatePaymentField()
      };
    },
    isValid: function() {
      return validationState.amount &&
             validationState.email &&
             validationState.paymentMethod;
    },
    getState: function() {
      return Object.assign({}, validationState);
    },
    validators: validators
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
