# NHS Scholarship Fund Donation Website - Project Plan

## Overview

This document outlines the plan to build a donation website for the Negaunee Public Schools (NHS) Scholarship Fund. The website will allow donors to contribute to scholarships using modern payment methods instead of mailing checks.

### Scholarship Focus
**Selected Scholarship: NHS General Scholarship Fund**
*(Note: A specific scholarship name should be confirmed with the school administration)*

### Technology Stack
- **Frontend**: Plain HTML5, CSS3, JavaScript (ES6+)
- **No Frameworks**: Pure vanilla implementation
- **Payment Integrations**: PayPal, Venmo, Google Pay, Apple Pay

### Design Reference
- **School Website**: https://nhs.negauneeschools.org/
- **School Colors**: To be extracted from school website
- **Logo**: To be obtained from school website

> ⚠️ **Important**: Before using the school's logo and colors, obtain proper permission from Negaunee Public Schools administration. School branding may be protected and require authorization for use on third-party donation sites.

---

## Clarifying Questions

Before proceeding with implementation, the following questions should be answered:

1. **Scholarship Selection**: Which specific scholarship(s) should donations go to? Or should there be a dropdown to select from multiple scholarships?

2. **Donation Amounts**: Should there be preset donation amounts (e.g., $25, $50, $100) or only custom amounts?

3. **Donor Information**: What information should be collected from donors?
   - Name (required?)
   - Email (for receipt?)
   - Phone number?
   - Mailing address?
   - Option for anonymous donations?

4. **Tax Receipts**: Should the system send automatic tax receipt emails?

5. **Recurring Donations**: Should the site support recurring monthly/yearly donations?

6. **Payment Account Details**: Who will set up the PayPal/Venmo/Google Pay/Apple Pay merchant accounts?

7. **Hosting**: Where will this website be hosted? (GitHub Pages, school server, etc.)

8. **SSL Certificate**: How will HTTPS be configured for secure payment processing?

9. **Thank You Page**: Should there be a specific thank you message or redirect after donation?

10. **Minimum Donation Amount**: Is there a minimum donation amount?

11. **Administrative Dashboard**: Is there a need for an admin view to track donations?

12. **Contact Information**: What contact info should be displayed for donation questions?

---

## Phase 1: Project Setup & Design Foundation

### Task 1.1: Create Project Structure
- [ ] Create the following directory structure:
  ```
  /
  ├── index.html
  ├── css/
  │   ├── styles.css
  │   └── responsive.css
  ├── js/
  │   ├── main.js
  │   ├── form-validation.js
  │   └── payments/
  │       ├── paypal.js
  │       ├── venmo.js
  │       ├── googlepay.js
  │       └── applepay.js
  ├── images/
  │   └── (logo files)
  ├── pages/
  │   ├── thank-you.html
  │   └── error.html
  └── docs/
      └── (documentation)
  ```

**Testing Checkpoint 1.1:**
- [ ] Verify all folders exist
- [ ] Open `index.html` in browser (should load without errors)

### Task 1.2: Extract School Branding
- [ ] Visit https://nhs.negauneeschools.org/
- [ ] Download/reference the school logo
- [ ] Identify primary school colors (hex values)
- [ ] Identify secondary school colors (hex values)
- [ ] Document colors in CSS variables

**Testing Checkpoint 1.2:**
- [ ] Verify logo displays correctly
- [ ] Verify colors match school branding

### Task 1.3: Create Base HTML Template
- [ ] Create semantic HTML5 structure for `index.html`
- [ ] Include proper meta tags (viewport, description, charset)
- [ ] Add accessibility attributes (ARIA labels, alt text)
- [ ] Link CSS and JavaScript files

**Testing Checkpoint 1.3:**
- [ ] HTML validates (use W3C validator)
- [ ] Page is accessible (test with screen reader or accessibility tools)
- [ ] Page is responsive (test at 320px, 768px, 1024px widths)

---

## Phase 2: Core Website Layout

### Task 2.1: Create Header Section
- [ ] Add school logo
- [ ] Add site title: "NHS Scholarship Fund"
- [ ] Add navigation (if needed)
- [ ] Style header with school colors

**Testing Checkpoint 2.1:**
- [ ] Header displays correctly at all screen sizes
- [ ] Logo is visible and properly sized

### Task 2.2: Create Hero/Introduction Section
- [ ] Add welcoming headline
- [ ] Add description of the scholarship fund
- [ ] Add "Donate Now" call-to-action button
- [ ] Include brief explanation of why donations matter

**Testing Checkpoint 2.2:**
- [ ] Text is readable and properly sized
- [ ] CTA button is prominent and clickable
- [ ] Section looks good on mobile

### Task 2.3: Create Donation Form Section
- [ ] Add donation amount selection (preset + custom)
- [ ] Add donor information fields:
  - Full Name
  - Email Address
  - (Optional) Phone Number
  - (Optional) Make donation anonymous checkbox
- [ ] Add donation frequency option (one-time vs recurring)
- [ ] Add payment method selection area
- [ ] Style form for usability

**Testing Checkpoint 2.3:**
- [ ] Form displays all fields correctly
- [ ] Tab order is logical
- [ ] Form is keyboard accessible
- [ ] Form looks good on mobile devices

### Task 2.4: Create Footer Section
- [ ] Add contact information
- [ ] Add link to Negaunee Public Schools website
- [ ] Add copyright notice
- [ ] Add privacy policy link (if applicable)

**Testing Checkpoint 2.4:**
- [ ] Footer displays correctly
- [ ] All links work properly

---

## Phase 3: Form Validation & JavaScript

### Task 3.1: Create Form Validation
- [ ] Validate required fields (name, email)
- [ ] Validate email format
- [ ] Validate donation amount (positive number, minimum amount)
- [ ] Display inline error messages
- [ ] Prevent form submission if validation fails

**Testing Checkpoint 3.1:**
- [ ] Submit form with empty fields - should show errors
- [ ] Submit form with invalid email - should show error
- [ ] Submit form with negative amount - should show error
- [ ] Submit form with valid data - should proceed

### Task 3.2: Create Amount Selection Logic
- [ ] Handle preset amount button clicks
- [ ] Handle custom amount input
- [ ] Clear preset selection when custom amount entered
- [ ] Display selected amount prominently

**Testing Checkpoint 3.2:**
- [ ] Click preset amount - should be highlighted
- [ ] Enter custom amount - preset should deselect
- [ ] Amount displays correctly in summary

### Task 3.3: Create Payment Method Selection
- [ ] Show available payment methods as buttons/tabs
- [ ] Only show payment form for selected method
- [ ] Store selected payment method in form state

**Testing Checkpoint 3.3:**
- [ ] Each payment method button works
- [ ] Correct payment form displays for each method

---

## Phase 4: Thank You & Error Pages

### Task 4.1: Create Thank You Page
- [ ] Display confirmation message
- [ ] Show donation amount
- [ ] Provide option to make another donation
- [ ] Include share buttons (optional)

**Testing Checkpoint 4.1:**
- [ ] Page displays correctly
- [ ] Return link works

### Task 4.2: Create Error Page
- [ ] Display user-friendly error message
- [ ] Provide option to try again
- [ ] Include contact information for support

**Testing Checkpoint 4.2:**
- [ ] Page displays correctly
- [ ] Try again link works

---

## Phase 5: Payment Integrations

Each payment integration has its own detailed document:

### Task 5.1: PayPal Integration
See [PAYPAL_INTEGRATION.md](./PAYPAL_INTEGRATION.md)

### Task 5.2: Venmo Integration
See [VENMO_INTEGRATION.md](./VENMO_INTEGRATION.md)

### Task 5.3: Google Pay Integration
See [GOOGLEPAY_INTEGRATION.md](./GOOGLEPAY_INTEGRATION.md)

### Task 5.4: Apple Pay Integration
See [APPLEPAY_INTEGRATION.md](./APPLEPAY_INTEGRATION.md)

---

## Phase 6: Testing & Quality Assurance

### Task 6.1: Cross-Browser Testing
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge
- [ ] Test in mobile browsers (iOS Safari, Chrome Android)

### Task 6.2: Accessibility Testing
- [ ] Run automated accessibility scan (e.g., axe, WAVE)
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Verify color contrast ratios

### Task 6.3: Payment Testing
- [ ] Test PayPal sandbox transactions
- [ ] Test Venmo sandbox transactions
- [ ] Test Google Pay test mode
- [ ] Test Apple Pay sandbox
- [ ] Test error handling for failed payments

### Task 6.4: Performance Testing
- [ ] Test page load time
- [ ] Optimize images
- [ ] Minimize CSS/JS files for production

---

## Phase 7: Deployment

### Task 7.1: Prepare for Production
- [ ] Switch all payment integrations from sandbox to production
- [ ] Update API keys/credentials
- [ ] Set up proper error logging
- [ ] Configure analytics (if desired)

### Task 7.2: Deploy Website
- [ ] Choose hosting platform
- [ ] Configure custom domain (if applicable)
- [ ] Set up SSL certificate
- [ ] Test live payment processing

### Task 7.3: Launch Checklist
- [ ] All payment methods working
- [ ] Thank you emails sending (if implemented)
- [ ] Error pages displaying correctly
- [ ] All links functional
- [ ] Contact information accurate

---

## Appendix: File Descriptions

| File | Description |
|------|-------------|
| `index.html` | Main donation page |
| `css/styles.css` | Primary stylesheet |
| `css/responsive.css` | Mobile-responsive styles |
| `js/main.js` | Core JavaScript functionality |
| `js/form-validation.js` | Form validation logic |
| `js/payments/paypal.js` | PayPal integration |
| `js/payments/venmo.js` | Venmo integration |
| `js/payments/googlepay.js` | Google Pay integration |
| `js/payments/applepay.js` | Apple Pay integration |
| `pages/thank-you.html` | Post-donation confirmation |
| `pages/error.html` | Error handling page |

---

## Notes for Coding Agent

1. **Test After Each Checkpoint**: Do not proceed to the next task until the current checkpoint passes all tests.

2. **Commit Frequently**: After each successful testing checkpoint, commit changes with a descriptive message.

3. **Use Browser DevTools**: Test responsive design using browser developer tools.

4. **Payment Sandbox Mode**: Always develop and test with payment provider sandbox/test modes.

5. **Keep Credentials Secure**: Never commit API keys or credentials to the repository. Use environment variables or a separate config file that's in `.gitignore`.

6. **Document Changes**: Update this plan with any deviations or discoveries.
