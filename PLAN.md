# NHS Scholarship Fund Donation Website - Project Plan

## Overview

This document outlines the plan to build a donation website for the Negaunee Public Schools (NHS) Scholarship Fund. The website will allow donors to contribute to scholarships using modern payment methods instead of mailing checks.

### Scholarship Focus
**Scholarship Selection**: Text input field allowing donors to specify which scholarship they wish to support
*(Future enhancement: May pull from a JSON document to provide a dropdown list of available scholarships)*

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

## Requirements (Confirmed)

Based on stakeholder feedback, the following requirements have been confirmed:

| Requirement | Decision |
|-------------|----------|
| **Scholarship Selection** | Text box for now (future: may pull from JSON document) |
| **Donation Amounts** | Preset: $25, $50, $100 + Custom amount |
| **Donor Information** | Minimal required fields only |
| **Tax Receipts** | Handled by payment providers (PayPal, etc.) - not in initial build |
| **Recurring Donations** | **Phase 2** - not in initial build |
| **Payment Accounts** | Placeholders for now - school will set up accounts later |
| **Hosting** | GitHub Pages with auto-deploy from `main` branch |
| **SSL Certificate** | Handled by payment providers (external payment flows) |
| **Thank You Page** | Yes - create a dedicated thank you page |
| **Minimum Donation** | No minimum |
| **Admin Dashboard** | Not needed |
| **Contact Information** | Use placeholder or extract from school website |

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
  ├── .github/
  │   └── workflows/
  │       └── deploy.yml
  └── docs/
      └── (documentation)
  ```

- [ ] Create GitHub Actions workflow for auto-deploy to GitHub Pages

**Testing Checkpoint 1.1:**
- [ ] Verify all folders exist
- [ ] Open `index.html` in browser (should load without errors)
- [ ] GitHub Actions workflow file exists

### Task 1.2: Configure GitHub Pages Deployment
- [ ] Create `.github/workflows/deploy.yml`:
  ```yaml
  name: Deploy to GitHub Pages

  on:
    push:
      branches:
        - main

  permissions:
    contents: read
    pages: write
    id-token: write

  concurrency:
    group: "pages"
    cancel-in-progress: false

  jobs:
    deploy:
      environment:
        name: github-pages
        url: ${{ steps.deployment.outputs.page_url }}
      runs-on: ubuntu-latest
      steps:
        - name: Checkout
          uses: actions/checkout@v4
        - name: Setup Pages
          uses: actions/configure-pages@v5
        - name: Upload artifact
          uses: actions/upload-pages-artifact@v3
          with:
            path: '.'
        - name: Deploy to GitHub Pages
          id: deployment
          uses: actions/deploy-pages@v4
  ```
  
  > **Note**: Action versions may change. Verify latest versions at https://github.com/actions

- [ ] Enable GitHub Pages in repository settings (Settings > Pages > Source: GitHub Actions)

**Testing Checkpoint 1.2:**
- [ ] Push to `main` branch triggers deployment
- [ ] Site is accessible at `https://<username>.github.io/<repo-name>/`

### Task 1.3: Extract School Branding
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
- [ ] Add scholarship designation field (text input)
  - Placeholder: "Enter scholarship name (optional)"
  - Note: Future enhancement will replace with dropdown from JSON
- [ ] Add donation amount selection:
  - Preset buttons: $25, $50, $100
  - Custom amount input field
- [ ] Add minimal donor information (only what payment providers require)
- [ ] Add payment method selection area
- [ ] Style form for usability

**Testing Checkpoint 2.3:**
- [ ] Scholarship text field accepts input
- [ ] Preset amount buttons work correctly
- [ ] Custom amount input works
- [ ] Tab order is logical
- [ ] Form is keyboard accessible
- [ ] Form looks good on mobile devices

### Task 2.4: Create Footer Section
- [ ] Add contact information (placeholder or from school website)
- [ ] Add link to Negaunee Public Schools website
- [ ] Add copyright notice
- [ ] Add privacy policy link (if applicable)

**Testing Checkpoint 2.4:**
- [ ] Footer displays correctly
- [ ] All links work properly

---

## Phase 3: Form Validation & JavaScript

### Task 3.1: Create Form Validation
- [ ] Validate donation amount (positive number, no minimum)
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

> ⚠️ **Note**: Payment merchant accounts will be set up by school administration. Use placeholder credentials during development and document where they need to be replaced.

Each payment integration has its own detailed document:

### Task 5.1: PayPal Integration
See [PAYPAL_INTEGRATION.md](./PAYPAL_INTEGRATION.md)
- [ ] Use sandbox/placeholder Client ID during development
- [ ] Document location of Client ID for later replacement

### Task 5.2: Venmo Integration
See [VENMO_INTEGRATION.md](./VENMO_INTEGRATION.md)
- [ ] Built on PayPal SDK (same account)

### Task 5.3: Google Pay Integration
See [GOOGLEPAY_INTEGRATION.md](./GOOGLEPAY_INTEGRATION.md)
- [ ] Use TEST environment during development
- [ ] Document Merchant ID placeholder location

### Task 5.4: Apple Pay Integration
See [APPLEPAY_INTEGRATION.md](./APPLEPAY_INTEGRATION.md)
- [ ] Document certificate and Merchant ID placeholder locations

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

## Phase 7: Deployment (GitHub Pages)

### Task 7.1: Prepare for Production
- [ ] Switch all payment integrations from sandbox to production
- [ ] Update API keys/credentials (provided by school)
- [ ] Set up proper error logging
- [ ] Configure analytics (if desired)

### Task 7.2: Deploy to GitHub Pages
- [ ] Verify GitHub Actions workflow is configured (see Task 1.2)
- [ ] Push to `main` branch to trigger deployment
- [ ] Configure custom domain (if applicable)
- [ ] Verify site is accessible at GitHub Pages URL

### Task 7.3: Launch Checklist
- [ ] All payment methods working with production credentials
- [ ] Error pages displaying correctly
- [ ] All links functional
- [ ] Contact information accurate (replace placeholders with real info)

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
| `.github/workflows/deploy.yml` | GitHub Pages auto-deployment |

---

## Notes for Coding Agent

1. **Test After Each Checkpoint**: Do not proceed to the next task until the current checkpoint passes all tests.

2. **Commit Frequently**: After each successful testing checkpoint, commit changes with a descriptive message.

3. **Use Browser DevTools**: Test responsive design using browser developer tools.

4. **Payment Sandbox Mode**: Always develop and test with payment provider sandbox/test modes.

5. **Keep Credentials Secure**: Never commit API keys or credentials to the repository. Use environment variables or a separate config file that's in `.gitignore`.

6. **Document Changes**: Update this plan with any deviations or discoveries.

7. **Placeholders**: Use clear placeholder values (e.g., `YOUR_CLIENT_ID_HERE`) and document their locations for the school to replace later.

---

## Future Phase: Recurring Donations (Phase 2)

> 📌 **Note**: This feature is planned for a future release, not the initial build.

### Overview
Enable donors to set up recurring monthly or yearly donations.

### Planned Tasks
- [ ] Add recurring donation toggle to form
- [ ] Add frequency selection (monthly/yearly)
- [ ] Integrate PayPal subscription API
- [ ] Integrate Venmo recurring (if available)
- [ ] Create subscription management page
- [ ] Handle subscription cancellation

### Technical Considerations
- PayPal Subscriptions API required
- May need server-side component for subscription management
- Consider webhook handling for subscription events
