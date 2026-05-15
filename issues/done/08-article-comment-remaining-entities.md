# Issue 08: Article, Article Category, Comment, Document + Accounting Transaction entities

## What to build

Add entity definitions for the five remaining Phase-1 entities. Two of these (Document, Accounting Transaction) are read-only (Get + Search only). Comment has atypical required fields that must be handled distinctly. This slice completes Workato connector parity.

## Acceptance criteria

- [ ] **Article** entity is available in the Resource dropdown (Get, Search, Create, Update).
  - Ignored on create and update: `customsTariffNumber`, `manufacturerName`.
  - Dropdown fields (manufacturer, customsTariffNumber, articleCategory, salesChannel) use the appropriate Options Loader.
- [ ] **Article Category** entity is available in the Resource dropdown (Get, Search, Create, Update).
  - Create requires `name`.
- [ ] **Comment** entity is available in the Resource dropdown (Get, Search, Create, Update).
  - Create requires `entityName`, `entityId`, and `comment`.
  - Search requires `entityName` and `entityId` (shown as mandatory search filter fields, not optional).
  - Update ignores: `lastEditDate`, `createdDate`, `lastModifiedDate`, `version`.
  - `entityName` field on Comment is a dropdown of supported entity types (at minimum: `shipment`, `salesOrder`).
- [ ] **Document** entity is available in the Resource dropdown (Get + Search only; Create and Update operations are hidden).
  - Search requires `entityName` and `entityId` as mandatory filter fields.
- [ ] **Accounting Transaction** entity is available in the Resource dropdown (Get + Search only).
- [ ] All five entities include custom attribute fields via the Custom Attributes Loader where applicable.
- [ ] All operations respect `continueOnFail()`.

## Blocked by

- Issue 06: Sales entity definitions
