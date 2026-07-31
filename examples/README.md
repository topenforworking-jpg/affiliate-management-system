## Product-rate example

This folder contains an example that demonstrates:

- Creating an affiliate with a Manager tier (tier 2) which has a 5% commission rate.
- Calculating commission for a normal product (should use the affiliate's tier rate).
- Calculating commission for a specific product ID (PROD-40-EXAMPLE) which uses a product-specific 40% rate configured in commission.productRates.

How to run

1. Install dependencies:

   npm install

2. Run the example:

   npm run example:product-rate

Notes

- The example uses the in-memory mock affiliate storage provided by the library's createAffiliate method; it does not require external services.
