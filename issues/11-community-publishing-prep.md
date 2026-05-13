# Issue 11: Community publishing prep (HITL)

## What to build

Prepare the package for publication to the n8n community node registry. This includes the Weclapp SVG icon, a user-facing README, final package.json metadata, and a dry-run publish to verify the package structure is correct. Requires human review and npm credentials.

**HITL:** This slice requires the developer to review the README for accuracy, verify the icon looks correct in the n8n canvas, and execute the `npm publish` step with their npm account.

## Acceptance criteria

- [ ] A `weclapp.svg` icon is present and renders cleanly at 60×60px in the n8n node palette.
- [ ] `README.md` covers: installation instructions (n8n community node install flow), credential setup (where to find the API token in Weclapp), at least one example workflow description for each of the 4 operations, and a description of the trigger node.
- [ ] `package.json` `keywords` array includes `n8n-community-node-package` and `weclapp`.
- [ ] `npm pack --dry-run` completes without errors and the listed files match the expected package contents (compiled `dist/`, credentials, nodes, package.json, README, LICENSE).
- [ ] The node passes n8n's built-in community node verification checks (if available locally).
- [ ] Package is published to npm as `n8n-nodes-weclapp` and is installable via n8n's community node UI.

## Blocked by

- Issue 07: Purchase + Inventory entity definitions
- Issue 08: Article, Article Category, Comment, Document + Accounting Transaction entities
- Issue 09: Webhook Trigger Node
- Issue 10: Unit tests
