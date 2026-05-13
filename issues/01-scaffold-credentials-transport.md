# Issue 01: Project scaffold, credentials + transport

## What to build

Initialize the `n8n-nodes-weclapp` TypeScript project with full build tooling, the `WeclappApi` credential definition, and the `weclappRequest` transport function. When complete, a developer can install dependencies, compile the project, load it into n8n, enter a subdomain + API token, and have the credential verified against the live Weclapp tenant.

This slice is the foundation every other slice depends on. It establishes the project conventions (directory layout, tsconfig, package.json metadata) that all subsequent work must follow, using `n8n-nodes-trackpod` as the reference implementation.

## Acceptance criteria

- [ ] `package.json` declares package name `n8n-nodes-weclapp`, author `muhammad.otahbashi@altruan.de`, license MIT, and the correct `n8n` block registering the credential and both node files.
- [ ] `tsconfig.json` targets CommonJS ES2019, matching the Trackpod reference.
- [ ] `WeclappApi` credential type exposes two fields: `subdomain` (text, required) and `apiToken` (password, required).
- [ ] Credential injects `AuthenticationToken: <token>` header on every request via n8n's generic auth.
- [ ] Credential test calls `GET /user/count` and succeeds when subdomain and token are valid.
- [ ] `weclappRequest(context, method, endpoint, body?, qs?)` builds the base URL as `https://<subdomain>.weclapp.com/webapp/api/v2/<endpoint>`.
- [ ] `weclappRequest` returns `null` on HTTP 404.
- [ ] `weclappRequest` throws `NodeApiError` on any other 4xx or 5xx response, including the Weclapp error body.
- [ ] `Content-Type: application/json` is set only when a non-empty body is provided.
- [ ] `npm run build` compiles without errors.

## Blocked by

None — can start immediately.
