/**
 * NHS Scholarship Fund - Venmo Integration
 * See VENMO_INTEGRATION.md for full documentation
 *
 * ============================================================
 * DEPRECATED - THIS FILE IS NO LONGER USED
 * ============================================================
 * 
 * As of the fix for the Venmo button duplication issue, Venmo
 * is now handled automatically by the PayPal SDK. When the PayPal
 * SDK is loaded with the 'enable-funding=venmo' parameter, it
 * automatically renders ALL enabled funding sources in a single
 * container, including:
 * - PayPal
 * - Venmo
 * - Pay Later
 * - Debit or Credit Card
 * 
 * Previously, this file was used to render a separate Venmo button,
 * which caused duplicate Venmo buttons to appear (one from PayPal SDK
 * and one from this file).
 * 
 * The PayPal button handler in paypal.js now detects which payment
 * method was used (PayPal, Venmo, etc.) and reports it correctly
 * to the thank you page.
 * 
 * This file is retained for historical reference only.
 *
 * ============================================================
 * VENMO USES THE PAYPAL SDK
 * ============================================================
 *
 * Venmo is integrated through the PayPal JavaScript SDK.
 * The same PayPal Client ID is used for both PayPal and Venmo.
 *
 * Requirements:
 * 1. PayPal Client ID must be configured in index.html
 * 2. The SDK URL must include: enable-funding=venmo
 * 3. PayPal Business account must have Venmo enabled
 *
 * To enable Venmo on your PayPal account:
 * 1. Log into PayPal Business Dashboard
 * 2. Go to Account Settings > Payment Preferences
 * 3. Enable Venmo as a payment method
 *
 * ============================================================
 * 
 * DO NOT USE THIS FILE - Use the PayPal SDK integration in paypal.js
 * 
 * ============================================================
 */

// This file is deprecated and should not be used.
// The functionality has been moved to the PayPal SDK automatic rendering.
// See js/payments/paypal.js for the current implementation.

