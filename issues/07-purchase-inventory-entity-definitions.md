# Issue 07: Purchase + Inventory entity definitions

## What to build

Add full entity definitions for Purchase Order, Purchase Invoice, Incoming Goods, and Shipment. These four entities cover the purchase and inventory domain and complete the supply-chain side of the Workato connector parity.

## Acceptance criteria

- [ ] **Purchase Order** entity is available in the Resource dropdown.
  - Create requires `supplierId`.
  - Ignored on create: `shipmentMethodName`, `paymentMethodName`, `termOfPaymentName`.
  - Ignored on update: `paymentMethodName`, `termOfPaymentName`.
- [ ] **Purchase Invoice** entity is available in the Resource dropdown.
  - Create requires `supplierId`.
  - Ignored on create: `shipmentMethodName`, `paymentMethodName`, `termOfPaymentName`.
  - Ignored on update: `paymentMethodName`, `termOfPaymentName`.
- [ ] **Incoming Goods** entity is available in the Resource dropdown.
  - No required or ignored fields defined; all fields from the Weclapp API spec are exposed.
- [ ] **Shipment** entity is available in the Resource dropdown.
  - Ignored on create and update: `shipmentMethodName`, `declaredValueAmountCurrencyName`, `warehouseName`.
  - Dropdown fields (shipmentMethod, shippingCarrier, warehouse) use the appropriate Options Loader.
- [ ] All four entities support Get by ID, Search (with pagination + customQuery), Create, and Update.
- [ ] All four entities include custom attribute fields via the Custom Attributes Loader.

## Blocked by

- Issue 06: Sales entity definitions
