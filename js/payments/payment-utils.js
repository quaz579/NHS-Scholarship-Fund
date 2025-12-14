/**
 * NHS Scholarship Fund - Payment Utilities
 * Shared utility functions for all payment integrations
 */

(function() {
  'use strict';

  /**
   * Show error message in payment container
   * Accessible: 15s timeout, close button, hides processing indicator
   * @param {string} message - Error message to display
   */
  function showPaymentError(message) {
    // First, hide any processing indicator
    hidePaymentProcessing();

    const container = document.getElementById('payment-container');
    if (!container) return;

    // Remove existing error alert if present
    const existingAlert = container.querySelector('.alert-danger');
    if (existingAlert) existingAlert.remove();

    // Create alert element
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger alert-dismissible mt-3 d-flex align-items-start';
    alert.setAttribute('role', 'alert');

    // Create message content
    const messageSpan = document.createElement('span');
    messageSpan.innerHTML = '<i class="bi bi-exclamation-circle me-2"></i>' + message;

    // Create close button for manual dismissal (accessibility)
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'btn-close ms-auto';
    closeBtn.setAttribute('aria-label', 'Close alert');
    closeBtn.addEventListener('click', function() {
      alert.remove();
    });

    alert.appendChild(messageSpan);
    alert.appendChild(closeBtn);
    container.appendChild(alert);

    // Remove after 15 seconds for accessibility (longer than 5s)
    setTimeout(function() {
      if (alert.parentNode) {
        alert.remove();
      }
    }, 15000);
  }

  /**
   * Show processing indicator
   */
  function showPaymentProcessing() {
    const container = document.getElementById('payment-container');
    if (!container) return;

    // Remove existing processing indicator if present
    const existing = document.getElementById('payment-processing');
    if (existing) existing.remove();

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

  /**
   * Hide processing indicator
   */
  function hidePaymentProcessing() {
    const processing = document.getElementById('payment-processing');
    if (processing) {
      processing.remove();
    }
  }

  /**
   * Generate a non-sensitive unique transaction ID
   * Use this instead of donor email for custom_id fields
   * @returns {string} Unique transaction identifier
   */
  function generateTransactionId() {
    // Generate a unique ID using timestamp and random string
    var timestamp = Date.now().toString(36);
    var randomPart = Math.random().toString(36).substring(2, 10);
    return 'nhs_' + timestamp + '_' + randomPart;
  }

  /**
   * Build thank you page redirect URL
   * @param {Object} state - Donation state object
   * @param {string} method - Payment method name
   * @param {string} transactionId - Optional transaction ID
   * @returns {string} Redirect URL
   */
  function buildThankYouUrl(state, method, transactionId) {
    var params = new URLSearchParams();
    params.set('amount', state.amount || 0);
    params.set('method', method);
    if (transactionId) {
      params.set('transaction', transactionId);
    }
    if (state.scholarshipName) {
      params.set('scholarship', state.scholarshipName);
    }
    if (state.donorName) {
      params.set('donor', state.donorName);
    }
    return 'pages/thank-you.html?' + params.toString();
  }

  // Export utilities globally
  window.NHSPaymentUtils = {
    showError: showPaymentError,
    showProcessing: showPaymentProcessing,
    hideProcessing: hidePaymentProcessing,
    generateTransactionId: generateTransactionId,
    buildThankYouUrl: buildThankYouUrl
  };
})();
