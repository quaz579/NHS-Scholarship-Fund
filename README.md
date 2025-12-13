# NHS Scholarship Fund Donation Website

Open Source Website To Make It Easy to Donate to the Negaunee Scholarship Fund

## Overview

This project provides a simple, framework-free donation website for the Negaunee Public Schools (NHS) Scholarship Fund. The website enables donors to contribute using modern payment methods (PayPal, Venmo, Google Pay, and Apple Pay) instead of mailing checks.

## Confirmed Requirements

| Feature | Implementation |
|---------|----------------|
| Scholarship Selection | Text input (future: dropdown from JSON) |
| Donation Amounts | $25, $50, $100 presets + custom |
| Donor Information | Minimal (only what payment providers require) |
| Recurring Donations | Phase 2 (not in initial build) |
| Hosting | GitHub Pages with auto-deploy |
| Payment Accounts | Placeholders until school provides |

## Documentation

### Project Planning

- **[PLAN.md](./PLAN.md)** - Main project plan with phased implementation tasks, testing checkpoints, and confirmed requirements

### Payment Integration Guides

Detailed implementation guides for each payment method:

1. **[PAYPAL_INTEGRATION.md](./PAYPAL_INTEGRATION.md)** - PayPal integration (start here)
2. **[VENMO_INTEGRATION.md](./VENMO_INTEGRATION.md)** - Venmo integration (builds on PayPal)
3. **[GOOGLEPAY_INTEGRATION.md](./GOOGLEPAY_INTEGRATION.md)** - Google Pay integration
4. **[APPLEPAY_INTEGRATION.md](./APPLEPAY_INTEGRATION.md)** - Apple Pay integration

## Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Styling with CSS variables for theming
- **JavaScript (ES6+)** - Vanilla JavaScript, no frameworks
- **Payment APIs** - PayPal SDK, Google Pay API, Apple Pay JS
- **Hosting** - GitHub Pages (auto-deploy from `main` branch)

## Getting Started

1. Review the [PLAN.md](./PLAN.md) document for the complete project overview
2. Complete Phase 1-4 to build the base website
3. Integrate payment methods in order:
   - PayPal first (foundation for Venmo)
   - Venmo (uses PayPal SDK)
   - Google Pay
   - Apple Pay

## Deployment

The site auto-deploys to GitHub Pages when changes are pushed to the `main` branch.

1. Enable GitHub Pages in repository settings (Settings > Pages > Source: GitHub Actions)
2. Push to `main` to trigger deployment
3. Access site at `https://<username>.github.io/NHS-Scholarship-Fund/`

## School Reference

- **School Website**: https://nhs.negauneeschools.org/
- **Colors and Logo**: To be extracted from school website during Phase 1.3

## License

[To be determined]

## Contributing

See the planning documents for task lists and testing checkpoints.
