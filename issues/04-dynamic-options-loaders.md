# Issue 04: Dynamic Options Loaders

## What to build

Implement all `loadOptionsMethod` functions that populate dropdown fields inside entity forms from the user's live Weclapp tenant. Integrate the loaders into the existing Party entity fields as the first concrete use case (e.g. `customerSalesChannel`, `personDepartmentId`, `personRoleId`, `customerCategoryId`, `shipmentMethodId`, etc.).

## Acceptance criteria

- [ ] The following `loadOptionsMethod` functions are implemented, each calling the corresponding Weclapp endpoint and returning `{ name, value }` pairs:
  - `getSalesChannels` → `GET /salesChannel/activeSalesChannels`
  - `getCurrencies` → `GET /currency`
  - `getPaymentMethods` → `GET /paymentMethod`
  - `getTermsOfPayment` → `GET /termOfPayment`
  - `getShipmentMethods` → `GET /shipmentMethod`
  - `getShippingCarriers` → `GET /shippingCarrier`
  - `getWarehouses` → `GET /warehouse`
  - `getArticleCategories` → `GET /articleCategory`
  - `getManufacturers` → `GET /manufacturer`
  - `getCustomsTariffNumbers` → `GET /customsTariffNumber`
  - `getCommercialLanguages` → `GET /commercialLanguage`
  - `getCustomerCategories` → `GET /customerCategory`
  - `getPersonDepartments` → `GET /personDepartment`
  - `getPersonRoles` → `GET /personRole`
  - `getLeadRatings` → `GET /leadRating`
  - `getLeadSources` → `GET /leadSource`
  - `getSectors` → `GET /sector`
  - `getTaxes` → `GET /tax`
  - `getPartyRatings` → `GET /partyRating`
  - `getCustomerTopics` → `GET /customerTopic`
  - `getFulfillmentProviders` → `GET /fulfillmentProvider`
  - `getTags` → `GET /tag`
- [ ] Each loader option label follows the format `Name (id)` to help users identify values.
- [ ] Party entity fields that correspond to these loaders display a live dropdown instead of a text input.
- [ ] Each loader falls back gracefully (returns empty list, does not crash) if the endpoint returns an empty result or a non-200 response.

## Blocked by

- Issue 01: Project scaffold, credentials + transport
