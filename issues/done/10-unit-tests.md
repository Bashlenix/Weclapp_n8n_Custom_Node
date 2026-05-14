# Issue 10: Unit tests — Transport, Options Loaders, Custom Attributes Loader

## What to build

Set up Jest + ts-jest and write unit tests for the three independently-testable modules: the request transport, the options loaders, and the custom attributes loader. Tests assert external behaviour only (inputs → outputs), not implementation details.

## Acceptance criteria

- [ ] `jest.config.js` and `ts-jest` are configured; `npm test` runs the suite.

**Transport (`weclappRequest`)**
- [ ] Given subdomain `acme` and endpoint `party`, the constructed URL is `https://acme.weclapp.com/webapp/api/v2/party`.
- [ ] When the HTTP response status is 404, the function returns `null`.
- [ ] When the HTTP response status is 422, the function throws a `NodeApiError` containing the response body.
- [ ] When a non-empty body is provided, `Content-Type: application/json` is present in the request headers.
- [ ] When no body is provided, `Content-Type` is absent from the request headers.

**Options Loaders**
- [ ] Each loader maps a mock Weclapp list response `{ result: [{ id: '1', name: 'Foo' }] }` to `[{ name: 'Foo (1)', value: '1' }]`.
- [ ] The `getSalesChannels` loader maps the `activeSalesChannels` response shape (using `key` as value, not `id`) correctly.
- [ ] Each loader returns an empty array when the API returns `{ result: [] }` without throwing.

**Custom Attributes Loader**
- [ ] An attribute with `attributeType: 'DATE'` produces a field with `type: 'dateTime'`.
- [ ] An attribute with `attributeType: 'LIST'` and three `selectableValues` produces an `options` field with three entries.
- [ ] An attribute with `attributeType: 'MULTISELECT_LIST'` produces a `multiOptions` field.
- [ ] An attribute with `attributeType: 'BOOLEAN'` produces a `boolean` field with a text-input toggle fallback.
- [ ] An attribute with `entities: ['article']` does NOT appear when loading fields for the `party` entity.
- [ ] An attribute with id `12345` produces a field named `customAttribute12345`.
- [ ] When `groupName` is present, the label is formatted as `"<label> (<groupName>)"`.

## Blocked by

- Issue 05: Custom Attributes Loader
