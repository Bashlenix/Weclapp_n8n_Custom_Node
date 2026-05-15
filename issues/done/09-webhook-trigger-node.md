# Issue 09: Webhook Trigger Node

## What to build

Create the `WeclappTrigger` node. When a workflow is activated, it registers a webhook with the Weclapp tenant for the selected entity and event types. When a webhook payload arrives, n8n executes the downstream workflow with the full Weclapp record. On workflow deactivation, the webhook is deregistered automatically.

## Acceptance criteria

- [ ] `WeclappTrigger.node.ts` exists as a separate node class registered in `package.json`.
- [ ] Node displays a **Resource** dropdown with all 14 Phase-1 entity types.
- [ ] Node displays an **Events** multi-select with three options: `Created`, `Updated`, `Deleted`.
- [ ] On workflow **activate**: calls `POST /webhook` with `{ entityName, url: <n8n webhook URL>, atCreate, atUpdate, atDelete }` and stores the returned webhook `id` in node static data.
- [ ] On workflow **deactivate**: calls `DELETE /webhook/id/<stored-id>` to clean up the webhook registration in Weclapp.
- [ ] On payload **receive**: the full Weclapp webhook payload is passed as output to downstream nodes.
- [ ] If Weclapp sends a test/ping payload on webhook creation (no recognisable entity data), the node returns an empty array without erroring.
- [ ] If the stored webhook `id` is missing at deactivate time (e.g. was manually deleted in Weclapp), deactivation completes without throwing.
- [ ] Node loads into a local n8n instance and the webhook URL is correctly displayed in the node UI.

## Blocked by

- Issue 01: Project scaffold, credentials + transport
