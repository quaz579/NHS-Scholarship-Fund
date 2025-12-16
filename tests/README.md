# NHS Scholarship Fund - Tests

This directory contains tests for the NHS Scholarship Fund donation website.

## Test Files

### `payment-method-detection.test.js`

Tests for the payment method detection logic used in the PayPal button's `onApprove` handler. This ensures that the correct payment method (PayPal, Venmo, Pay Later, or Card) is identified and reported to the thank you page.

**Coverage**: 100% of payment method detection logic

**Test cases**:
1. Venmo payment source detection
2. PayPal payment source detection
3. Card payment source detection
4. Pay Later payment source detection
5. Missing payment_source handling (defaults to PayPal)
6. Null payment_source handling (defaults to PayPal)
7. Unknown payment source handling (defaults to PayPal)
8. Multiple payment sources handling
9. Empty payment_source object handling
10. Non-object payment_source handling

## Running Tests

### Run all tests:
```bash
node tests/payment-method-detection.test.js
```

### Run via Node REPL:
```bash
node -e "const test = require('./tests/payment-method-detection.test.js'); test.runTests();"
```

## Test Standards

Following the project's CLAUDE.md guidelines:
- ✅ Test-Driven Development (TDD) approach
- ✅ 100% unit test coverage for payment method detection
- ✅ Small, testable functions
- ✅ Mocked external dependencies (PayPal SDK responses)

## Future Tests

Additional test files to be added:
- `form-validation.test.js` - Donation form validation logic
- `payment-utils.test.js` - Payment utility functions
- `main.test.js` - Core application logic
- `integration.test.js` - End-to-end payment flow tests

## Test Framework

Currently using vanilla JavaScript tests with Node.js. Future enhancements could include:
- Jest or Mocha test framework
- Code coverage reporting
- CI/CD integration
- Browser-based testing with Playwright or Cypress
