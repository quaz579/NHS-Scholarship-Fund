# NHS Scholarship Fund Donation Website

Open Source Website To Make It Easy to Donate to the Negaunee Scholarship Fund

## Overview

This project provides a simple, framework-free donation website for the Negaunee Public Schools (NHS) Scholarship Fund. The website enables donors to contribute using modern payment methods (PayPal, Venmo, Google Pay, and Apple Pay) instead of mailing checks.

## Documentation

### Project Planning

- **[PLAN.md](./PLAN.md)** - Main project plan with phased implementation tasks, testing checkpoints, and project structure

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

## Getting Started

1. Review the [PLAN.md](./PLAN.md) document for the complete project overview
2. Complete Phase 1-4 to build the base website
3. Integrate payment methods in order:
   - PayPal first (foundation for Venmo)
   - Venmo (uses PayPal SDK)
   - Google Pay
   - Apple Pay

## School Reference

- **School Website**: https://nhs.negauneeschools.org/
- **Colors and Logo**: To be extracted from school website during Phase 1.2

## Clarifying Questions

The following questions are documented in PLAN.md and should be answered before implementation begins:

1. Which specific scholarship(s) should donations support?
2. Should there be preset donation amounts?
3. What donor information should be collected?
4. Should the system send automatic tax receipts?
5. Should recurring donations be supported?
6. Who will set up the payment merchant accounts?
7. Where will the website be hosted?
8. Additional requirements?

## License

[To be determined]

## Contributing

See the planning documents for task lists and testing checkpoints.
