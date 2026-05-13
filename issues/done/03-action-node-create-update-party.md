# Issue 03: Action node — Create + Update operations (Party entity)

## What to build

Add **Create** and **Update** operations to the existing Weclapp action node, using the Party entity as the reference implementation. Establishes the required/ignored field conventions and the `ignoreMissingProperties` query parameter pattern that all subsequent entity slices inherit.

## Acceptance criteria

- [ ] **Create**: calls `POST /party?ignoreMissingProperties=true` with the user-supplied body and returns the created Party record.
- [ ] **Create**: fields listed in the Workato connector's `ignoredCreateFields` for Party (e.g. `customerCategoryName`, `sectorName`, `ratingName`, `leadSourceName`, `leadRatingName`, `shipmentMethodName`) are absent from the Create input form.
- [ ] **Create**: no field is marked required on the Create form for Party (Party has no `requiredCreateFields` in the connector).
- [ ] **Update**: calls `PUT /party/id/<id>?ignoreMissingProperties=true` and returns the updated Party record.
- [ ] **Update**: `id` is a required input field on the Update form.
- [ ] **Update**: fields listed in `ignoredUpdateFields` for Party are absent from the Update form.
- [ ] Both operations respect `continueOnFail()`.
- [ ] Both operations surface Weclapp error messages in the `NodeApiError` (e.g. validation errors from Weclapp are readable in n8n's error output).

## Blocked by

- Issue 02: Action node skeleton + Party entity — Get by ID + Search
