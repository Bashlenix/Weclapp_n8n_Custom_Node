# Issue 05: Custom Attributes Loader

## What to build

Implement the custom attributes loader that fetches your Weclapp tenant's `customAttributeDefinition` list at workflow-build-time and injects typed input fields into entity forms. Integrate into the Party entity as proof of concept.

Custom attributes are tenant-specific fields defined in Weclapp settings (e.g. a date field "Contract Renewal Date" on Party, a dropdown "Customer Segment" on Sales Order). Without this slice, those fields can only be written via raw HTTP nodes.

## Acceptance criteria

- [ ] At workflow build-time, `GET /customAttributeDefinition?pageSize=1000` is called once per entity form render.
- [ ] Attributes are filtered by their `entities` array so only attributes relevant to the selected entity appear.
- [ ] Each Weclapp attribute type maps to the correct n8n field descriptor:
  - `DATE` → `dateTime` control with epoch↔ISO conversion
  - `DECIMAL` → `number` control
  - `INTEGER` → `number` control (integer)
  - `BOOLEAN` → `boolean` toggle with a text-input fallback labeled "Use value"
  - `TEXT` / `STRING` → `string` control
  - `ENTITY` → `number` control with a hint indicating the referenced entity type
  - `LIST` → `options` (select) control, with options from `selectableValues`
  - `MULTISELECT_LIST` → `multiOptions` control, same options source, comma-delimited
- [ ] Field names follow the convention `customAttribute<id>` (matching Workato).
- [ ] Field labels use the Weclapp `label` value, appended with the group name in parentheses when `groupName` is present (e.g. `"Contract Renewal Date (Finance)"`).
- [ ] Custom attribute fields appear appended after the static fields in the entity form.
- [ ] If the tenant has no custom attributes for an entity, the form renders without error.

## Blocked by

- Issue 04: Dynamic Options Loaders
