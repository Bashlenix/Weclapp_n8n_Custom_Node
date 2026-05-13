# Issue 02: Action node skeleton + Party entity — Get by ID + Search

## What to build

Create the `Weclapp` action node class and the `Party` entity definition. Implement the **Get by ID** and **Search** operations end-to-end. This slice proves the entire generic architecture (resource picker → entity definition → transport → Weclapp API → n8n output) using one entity, and establishes the template all remaining entities must follow.

## Acceptance criteria

- [ ] `Weclapp.node.ts` exists with a `Resource` dropdown listing entity types; `Party (Customer/Contact)` is the first entry.
- [ ] **Get by ID**: given a Party ID, the node calls `GET /party/id/<id>` and outputs the full Party record.
- [ ] **Get by ID**: when Weclapp returns 404, the node outputs an empty item rather than throwing.
- [ ] **Search**: calls `GET /party` and returns the `result` array.
- [ ] **Search**: supports `pageSize`, `page`, and `sort` parameters.
- [ ] **Search**: supports a `customQuery` text field that is appended as raw query-string parameters (e.g. `customerNumber-eq=K10001`).
- [ ] `continueOnFail()` is respected: a failing item does not abort processing of subsequent items.
- [ ] Party entity definition covers all fields present in the Workato connector's `party` object definition, with correct types.
- [ ] Date/timestamp fields (e.g. `birthDate`, `createdDate`, `lastModifiedDate`) are exposed as ISO date-time, not epoch milliseconds.
- [ ] Node compiles and loads into a local n8n instance without errors.

## Blocked by

- Issue 01: Project scaffold, credentials + transport
