# CLAUDE.md - Project Guide for Claude Code

## Project Overview

This is a donation website for the Negaunee Public Schools (NHS) Scholarship Fund. The site allows donors to contribute to scholarships for Negaunee High School seniors using modern payment methods.

**Current Status**: Proof of Concept (POC) - not yet live

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **CSS Framework**: Bootstrap 5 (via CDN)
- **Design Approach**: Mobile-first responsive design
- **Payment Integrations**: PayPal, Venmo, Google Pay, Apple Pay (placeholder credentials for now)
- **Hosting**: GitHub Pages with auto-deploy from `main` branch

## Key Requirements

### Design
- **Mobile-first**: All components must be designed for mobile screens first, then enhanced for larger screens
- **School branding**: Use official Negaunee Miners colors (research via web search and school website)
- **Demonstration banner**: Include prominent "DEMONSTRATION ONLY" banner on all pages until live

### Donation Form
- **Scholarship selection**: Text input field (optional) - future enhancement may use JSON dropdown
- **Preset amounts**: $25, $50, $100 + custom amount field
- **Donor info**: All fields optional to allow anonymous donations
- **No minimum donation amount**

### Thank You Page
- Display both the donation amount and scholarship name (if provided)

### Content
- Scholarships are awarded annually to selected Negaunee High School seniors each spring
- Use placeholder content for hero section text (to be reviewed later)
- Contact info: Use placeholders, can reference school website

## Project Structure

```
/
├── index.html              # Main donation page
├── css/
│   ├── styles.css          # Primary stylesheet
│   └── responsive.css      # Mobile-responsive styles
├── js/
│   ├── main.js             # Core JavaScript functionality
│   ├── form-validation.js  # Form validation logic
│   └── payments/
│       ├── paypal.js       # PayPal integration
│       ├── venmo.js        # Venmo integration
│       ├── googlepay.js    # Google Pay integration
│       └── applepay.js     # Apple Pay integration
├── images/                 # Logo files
├── pages/
│   ├── thank-you.html      # Post-donation confirmation
│   └── error.html          # Error handling page
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages auto-deployment
└── docs/                   # Documentation
```

## Reference Documents

- **PLAN.md**: Detailed project plan with tasks and testing checkpoints
- **PAYPAL_INTEGRATION.md**: PayPal SDK integration guide
- **VENMO_INTEGRATION.md**: Venmo integration guide
- **GOOGLEPAY_INTEGRATION.md**: Google Pay integration guide
- **APPLEPAY_INTEGRATION.md**: Apple Pay integration guide

## Design Reference

- **School Website**: https://nhs.negauneeschools.org/
- **School Colors**: Research official Negaunee Miners colors and verify against school website
- **Logo**: Extract from school website

## Development Notes

- Payment merchant accounts will be set up by school administration later
- Use sandbox/test mode for all payment integrations during development
- Use clear placeholder values (e.g., `YOUR_CLIENT_ID_HERE`) and document their locations
- Never commit API keys or credentials to the repository
- Test at Bootstrap breakpoints: 320px, 576px, 768px, 992px, 1200px
- Ensure touch-friendly tap targets (min 44px)

## JavaScript Development Standards

- **Test-Driven Development (TDD)**: Write tests before implementing functionality
- **100% unit test coverage**: All JavaScript code must have complete test coverage
- Write small, testable functions
- Mock external dependencies (payment SDKs, DOM interactions) in tests

## Out of Scope (Initial Build)

- Recurring donations (Phase 2 feature)
- Tax receipts (handled by payment providers)
- Admin dashboard
- Analytics
- Custom domain (using GitHub Pages URL for now)
