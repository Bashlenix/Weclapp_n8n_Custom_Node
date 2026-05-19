# n8n-nodes-weclapp

An [n8n](https://n8n.io/) community node for the [Weclapp](https://www.weclapp.com/) ERP/CRM platform. It lets you read and write Weclapp data — customers, orders, articles, shipments, documents, and more — directly from your n8n workflows, and react to Weclapp events in real time with the built-in trigger node.

## Installation

In your n8n instance, open **Settings → Community Nodes → Install** and enter:

```
n8n-nodes-weclapp
```

n8n will install the package and restart. The **Weclapp** and **Weclapp Trigger** nodes will appear in the node palette.

> Requires n8n ≥ 0.187.0 (community node support).

## Credentials

1. Log in to your Weclapp account.
2. Click your avatar (top-right) → **My Settings → API**.
3. Copy your **API token**.
4. In n8n, create a new **Weclapp API** credential:
   - **Subdomain** — the part before `.weclapp.com` in your URL (e.g. `mycompany` for `mycompany.weclapp.com`).
   - **API Token** — the token you copied above.

n8n will test the credential automatically against the `/user/count` endpoint.

## Weclapp Node

Performs CRUD operations on the following Weclapp resources:

| Resource | Create | Get by ID | Search | Update | Download |
|---|:---:|:---:|:---:|:---:|:---:|
| Party (Customer / Contact) | ✓ | ✓ | ✓ | ✓ | |
| Article | ✓ | ✓ | ✓ | ✓ | |
| Article Category | ✓ | ✓ | ✓ | ✓ | |
| Sales Order | ✓ | ✓ | ✓ | ✓ | |
| Quotation | ✓ | ✓ | ✓ | ✓ | |
| Sales Invoice | ✓ | ✓ | ✓ | ✓ | |
| Sales Open Item | | ✓ | ✓ | | |
| Shipment | ✓ | ✓ | ✓ | ✓ | |
| Purchase Order | ✓ | ✓ | ✓ | ✓ | |
| Purchase Invoice | ✓ | ✓ | ✓ | ✓ | |
| Incoming Goods | ✓ | ✓ | ✓ | ✓ | |
| Comment | ✓ | ✓ | ✓ | ✓ | |
| Document | | ✓ | ✓ | | ✓ |
| Accounting Transaction | | ✓ | ✓ | | |
| Warehouse Stock Movement | | ✓ | ✓ | | |
| User | ✓ | ✓ | ✓ | ✓ | |

### Operations

#### Get by ID

Fetches a single record by its Weclapp internal ID.

**Example — look up a customer:**
- Resource: `Party (Customer / Contact)`
- Operation: `Get by ID`
- Record ID: `{{ $json.partyId }}`

#### Search

Returns a list of records, with optional filtering, sorting, and pagination.

**Fields:**
- **Custom Query** — Weclapp filter syntax, e.g. `salesChannel-eq=NET1&createdDate-gt=1700000000000`. Multiple conditions are ANDed.
- **Sort** — field name, prefix with `-` for descending, e.g. `-lastModifiedDate`.
- **Return All** — when enabled, fetches every page automatically. When disabled, use **Page** and **Page Size** to paginate manually.

**Example — find all open sales orders modified in the last hour:**
- Resource: `Sales Order`
- Operation: `Search`
- Custom Query: `orderStatusId-eq=OPEN&lastModifiedDate-gt={{ Date.now() - 3600000 }}`
- Return All: `true`

**Example — search for a customer by number:**
- Resource: `Party (Customer / Contact)`
- Custom Query: `customerNumber-eq=K10001`

#### Create

Creates a new record. Map the fields you want to set in the **Additional Fields** section using n8n expressions or fixed values.

**Example — create a sales order:**
- Resource: `Sales Order`
- Operation: `Create`
- Additional Fields → `customerId`: `{{ $json.customerId }}`

#### Update

Updates an existing record by ID. Only the fields you map are sent — unset fields are left unchanged.

**Example — mark a shipment as dispatched:**
- Resource: `Shipment`
- Operation: `Update`
- Record ID: `{{ $json.id }}`
- Additional Fields → `status`: `SHIPPED`

#### Download Document

Downloads a Weclapp document as a binary file (available for the **Document** resource only). The binary output can be passed to a Write Binary File node or an email attachment.

**Example — attach a PDF invoice to an email:**
1. Weclapp node: Resource `Document`, Operation `Download Document`, Record ID `{{ $json.documentId }}`
2. Send Email node: attach `{{ $binary.data }}`

## Weclapp Trigger Node

Starts a workflow automatically whenever a Weclapp entity is created, updated, or deleted. It registers a webhook in Weclapp on activation and removes it on deactivation — no manual webhook setup required.

**Configuration:**
- **Resource** — the entity type to watch (same list as the main node).
- **Events** — one or more of `Created`, `Updated`, `Deleted`.

**Example — notify Slack when a new sales order arrives:**
1. Weclapp Trigger: Resource `Sales Order`, Events `Created`
2. Slack node: post `New order {{ $json.orderNumber }} from {{ $json.customerName }}`

**Example — sync customer updates to a CRM:**
1. Weclapp Trigger: Resource `Party (Customer / Contact)`, Events `Updated`
2. HTTP Request node: `PUT https://crm.example.com/contacts/{{ $json.id }}`

**Example — alert on shipment deletion:**
1. Weclapp Trigger: Resource `Shipment`, Events `Deleted`
2. Send Email node: notify the logistics team

> **Tip:** Before your first live run, use n8n's **Pin Data** feature on the trigger node to capture a sample payload. This enables field autocompletion in downstream nodes (IF, Switch, Set, etc.) without waiting for a real event.

## Weclapp Query Syntax

The **Custom Query** field uses Weclapp's native filter format:

```
fieldName-operator=value&anotherField-operator=value
```

Common operators:

| Operator | Meaning |
|---|---|
| `eq` | equals |
| `ne` | not equals |
| `lt` / `gt` | less / greater than |
| `le` / `ge` | less / greater than or equal |
| `like` | wildcard match (`%` = any chars) |
| `null` | field is null (`true`/`false`) |

Timestamps are Unix milliseconds (e.g. `1700000000000`).

See the [Weclapp API documentation](https://www.weclapp.com/api/) for the full list of filterable fields per entity.

## License

MIT — see [LICENSE](./LICENSE).
