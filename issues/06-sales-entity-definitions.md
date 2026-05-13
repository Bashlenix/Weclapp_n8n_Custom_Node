# Issue 06: Sales entity definitions

## What to build

Add full entity definitions for the four sales-domain entities — Sales Order, Sales Invoice, Sales Open Item, and Quotation — with all four operations (Get by ID, Search, Create, Update) wired up end-to-end. These are the highest-value entities for the primary use case of migrating Workato automations.

## Acceptance criteria

- [ ] **Sales Order** entity is available in the Resource dropdown.
  - Create requires `customerId`.
  - Create ignores: `shipmentMethodName`, `paymentMethodName`, `termOfPaymentName`, `recordCurrencyId`, `nonStandardTaxName`, `taxName`, `defaultShippingCarrierName`.
  - Update requires `salesChannel`.
  - Update ignores same list as Create.
  - Dropdown fields (salesChannel, paymentMethod, shipmentMethod, currency, termOfPayment) use the appropriate Options Loader.
- [ ] **Sales Invoice** entity is available in the Resource dropdown.
  - Create requires `customerId`.
  - Ignored fields on both create and update: `shipmentMethodName`, `paymentMethodName`, `termOfPaymentName`.
- [ ] **Sales Open Item** entity is available in the Resource dropdown.
  - Create requires `moneyTransactionId`.
- [ ] **Quotation** entity is available in the Resource dropdown.
  - Create requires `customerId` and `salesChannel`.
- [ ] All four entities support Get by ID, Search (with pagination + customQuery), Create, and Update.
- [ ] All four entities include custom attribute fields via the Custom Attributes Loader.
- [ ] Date/timestamp fields use ISO date-time (not epoch milliseconds).

## Blocked by

- Issue 03: Action node — Create + Update operations (Party entity)
- Issue 04: Dynamic Options Loaders
- Issue 05: Custom Attributes Loader
