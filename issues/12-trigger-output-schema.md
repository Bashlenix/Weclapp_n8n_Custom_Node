# Issue 12: Trigger output schema (field autocompletion in downstream nodes)

## Problem

When a user adds a Weclapp Trigger and connects an IF or Switch node, the downstream
node shows no fields to select from — n8n's expression editor only populates field
suggestions from actual execution data (pinned or from a real prior run). This is
unlike Workato, which ships entity schemas in the connector and shows all fields
immediately, without needing the trigger to have fired.

## What to build (full solution)

Add a per-entity output schema to the `WeclappTrigger` node so n8n can offer field
autocompletion in downstream nodes without requiring prior execution data.

## Constraint

`n8n-workflow` 1.x (the version pinned in this package) does **not** expose an
`outputSchema` property on `INodeTypeDescription`. Field suggestions in the n8n
expression editor are driven solely by execution data stored in the workflow run.
This issue is therefore **blocked by n8n adding first-class output schema support**,
or by a future upgrade to an n8n-workflow version that exposes such an API.

## Partial mitigation (implemented in this issue — hints approach)

Until n8n adds schema support, the best in-package improvement is to add `hints`
to the trigger node that list the available fields for the selected resource. The
hint is shown in the trigger node's output pane and serves as inline documentation,
but it does **not** enable dropdown field selection in IF / Switch nodes.

### Acceptance criteria for partial mitigation

- [x] A `hints` entry is defined for each Phase-1 resource that lists its
  most-useful top-level fields.
- [x] The hint uses `displayCondition` so only the hint for the currently selected
  resource is shown.
- [x] The hint is shown `beforeExecution` (i.e. when the trigger has not yet fired)
  and is suppressed once real data is available.
- [x] Hint is confirmed visible in a local n8n instance — verified for all 14 resources.

### Acceptance criteria for full solution (future)

- [ ] `outputSchema` (or equivalent) is defined per resource on the trigger node
  description, using a JSON Schema or n8n field-list format.
- [ ] Downstream IF / Switch nodes show the correct field list without needing the
  trigger to have fired.
- [ ] Schema is conditional on the selected `resource` value.
- [ ] All 14 Phase-1 entities have field definitions.

## Workaround for users (document in README)

Until the full solution is shipped, users can get field autocompletion by either:
1. Activating the workflow, triggering one real Weclapp event, then deactivating —
   n8n keeps the last execution data and uses it for expression editor suggestions.
2. Right-clicking the trigger node → **Edit Output** → pasting a sample Weclapp
   webhook payload manually.

## Blocked by

- n8n adding output schema support to `INodeTypeDescription` in `n8n-workflow`
