import { INodeProperties } from 'n8n-workflow';

// ─── Shared base fields (baseSalesRecord, minus *Name computed fields) ────────

const BASE_SALES_FIELDS: INodeProperties[] = [
	{ displayName: 'Commercial Language', name: 'commercialLanguage', type: 'string', default: '' },
	{ displayName: 'Commission', name: 'commission', type: 'string', default: '' },
	{
		displayName: 'Currency Conversion Date',
		name: 'currencyConversionDate',
		type: 'dateTime',
		default: '',
	},
	{
		displayName: 'Currency Conversion Locked',
		name: 'currencyConversionLocked',
		type: 'boolean',
		default: false,
	},
	{ displayName: 'Currency Conversion Rate', name: 'currencyConversionRate', type: 'number', default: 0 },
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		default: '',
		description: 'Required for create.',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Disable Record Emailing Rule',
		name: 'disableRecordEmailingRule',
		type: 'boolean',
		default: false,
	},
	{ displayName: 'Dispatch Country Code', name: 'dispatchCountryCode', type: 'string', default: '' },
	{ displayName: 'Factoring', name: 'factoring', type: 'boolean', default: false },
	{ displayName: 'Header Discount', name: 'headerDiscount', type: 'number', default: 0 },
	{ displayName: 'Header Surcharge', name: 'headerSurcharge', type: 'number', default: 0 },
	{
		displayName: 'Payment Method',
		name: 'paymentMethodId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getPaymentMethods' },
		default: '',
	},
	{ displayName: 'Pricing Date', name: 'pricingDate', type: 'dateTime', default: '' },
	{
		displayName: 'Record Comment',
		name: 'recordComment',
		type: 'string',
		default: '',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Record Free Text',
		name: 'recordFreeText',
		type: 'string',
		default: '',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Record Opening',
		name: 'recordOpening',
		type: 'string',
		default: '',
		typeOptions: { rows: 3 },
	},
	{ displayName: 'Responsible User ID', name: 'responsibleUserId', type: 'string', default: '' },
	{
		displayName: 'Sales Channel',
		name: 'salesChannel',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getSalesChannels' },
		default: '',
	},
	{ displayName: 'Sent To Recipient', name: 'sentToRecipient', type: 'boolean', default: false },
	{ displayName: 'Service Period From', name: 'servicePeriodFrom', type: 'dateTime', default: '' },
	{ displayName: 'Service Period To', name: 'servicePeriodTo', type: 'dateTime', default: '' },
	{
		displayName: 'Shipment Method',
		name: 'shipmentMethodId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getShipmentMethods' },
		default: '',
	},
	{
		displayName: 'Term of Payment',
		name: 'termOfPaymentId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getTermsOfPayment' },
		default: '',
	},
	{
		displayName: 'Version',
		name: 'version',
		type: 'string',
		default: '',
		description: 'Entity version for optimistic locking. Send the value from a prior GET to prevent overwriting concurrent changes.',
	},
];

// Currency field — included by salesInvoice and quotation, excluded from salesOrder
const CURRENCY_FIELD: INodeProperties = {
	displayName: 'Currency',
	name: 'recordCurrencyId',
	type: 'options',
	typeOptions: { loadOptionsMethod: 'getCurrencies' },
	default: '',
};

// Additional fields for entities inheriting baseSalesRecordWithAddresses
const BASE_WITH_ADDRESSES_FIELDS: INodeProperties[] = [
	{
		displayName: 'Default Shipping Carrier',
		name: 'defaultShippingCarrierId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getShippingCarriers' },
		default: '',
	},
	{ displayName: 'Planned Delivery Date', name: 'plannedDeliveryDate', type: 'dateTime', default: '' },
	{ displayName: 'Planned Shipping Date', name: 'plannedShippingDate', type: 'dateTime', default: '' },
];

// ─── Sales Order ──────────────────────────────────────────────────────────────
// Excluded: recordCurrencyId, *Name computed fields

const SALES_ORDER_EXTRA: INodeProperties[] = [
	{ displayName: 'Advance Payment Amount', name: 'advancePaymentAmount', type: 'number', default: 0 },
	{
		displayName: 'Advance Payment Status',
		name: 'advancePaymentStatus',
		type: 'options',
		default: 'OPEN',
		options: [
			{ name: 'Open', value: 'OPEN' },
			{ name: 'Paid', value: 'PAID' },
		],
	},
	{
		displayName: 'Apply Shipping Costs Only Once',
		name: 'applyShippingCostsOnlyOnce',
		type: 'boolean',
		default: false,
	},
	{ displayName: 'Cash Account ID', name: 'cashAccountId', type: 'string', default: '' },
	{
		displayName: 'Customer Habitual Exporter Letter of Intent ID',
		name: 'customerHabitualExporterLetterOfIntentId',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Default Shipping Return Carrier ID',
		name: 'defaultShippingReturnCarrierId',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Fulfillment Provider',
		name: 'fulfillmentProviderId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getFulfillmentProviders' },
		default: '',
	},
	{ displayName: 'Invoice Recipient ID', name: 'invoiceRecipientId', type: 'string', default: '' },
	{ displayName: 'Note', name: 'note', type: 'string', default: '', typeOptions: { rows: 3 } },
	{ displayName: 'Only Services', name: 'onlyServices', type: 'boolean', default: false },
	{ displayName: 'Order Date', name: 'orderDate', type: 'dateTime', default: '' },
	{ displayName: 'Order Number', name: 'orderNumber', type: 'string', default: '' },
	{ displayName: 'Order Number at Customer', name: 'orderNumberAtCustomer', type: 'string', default: '' },
	{ displayName: 'Planned Project End Date', name: 'plannedProjectEndDate', type: 'dateTime', default: '' },
	{ displayName: 'Planned Project Start Date', name: 'plannedProjectStartDate', type: 'dateTime', default: '' },
	{ displayName: 'Project Goals', name: 'projectGoals', type: 'string', default: '' },
	{ displayName: 'Project Mode Active', name: 'projectModeActive', type: 'boolean', default: false },
	{ displayName: 'Quotation ID', name: 'quotationId', type: 'string', default: '' },
	{ displayName: 'Record ASN', name: 'recordAsn', type: 'string', default: '' },
	{
		displayName: 'Record Comment Inheritance',
		name: 'recordCommentInheritance',
		type: 'boolean',
		default: false,
	},
	{
		displayName: 'Record Free Text Inheritance',
		name: 'recordFreeTextInheritance',
		type: 'boolean',
		default: false,
	},
	{
		displayName: 'Record Opening Inheritance',
		name: 'recordOpeningInheritance',
		type: 'boolean',
		default: false,
	},
	{
		displayName: 'Sales Order Payment Type',
		name: 'salesOrderPaymentType',
		type: 'options',
		default: 'STANDARD',
		options: [
			{ name: 'Advance Payment', value: 'ADVANCE_PAYMENT' },
			{ name: 'Counter Sales', value: 'COUNTER_SALES' },
			{ name: 'Part Payment', value: 'PART_PAYMENT' },
			{ name: 'Prepayment', value: 'PREPAYMENT' },
			{ name: 'Standard', value: 'STANDARD' },
		],
	},
	{ displayName: 'SEPA Direct Debit Mandate ID', name: 'sepaDirectDebitMandateId', type: 'string', default: '' },
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		default: 'ORDER_ENTRY_IN_PROGRESS',
		options: [
			{ name: 'Cancelled', value: 'CANCELLED' },
			{ name: 'Closed', value: 'CLOSED' },
			{ name: 'Manually Closed', value: 'MANUALLY_CLOSED' },
			{ name: 'Order Confirmation Printed', value: 'ORDER_CONFIRMATION_PRINTED' },
			{ name: 'Order Entry In Progress', value: 'ORDER_ENTRY_IN_PROGRESS' },
		],
	},
	{ displayName: 'Template', name: 'template', type: 'boolean', default: false },
	{
		displayName: 'Warehouse',
		name: 'warehouseId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getWarehouses' },
		default: '',
	},
];

const ALL_SALES_ORDER_OPTIONS: INodeProperties[] = [
	...BASE_SALES_FIELDS,
	...BASE_WITH_ADDRESSES_FIELDS,
	...SALES_ORDER_EXTRA,
];

// ─── Sales Invoice ────────────────────────────────────────────────────────────
// Excluded: *Name computed fields. Includes recordCurrencyId.
// Does NOT inherit baseSalesRecordWithAddresses (no address fields).

const SALES_INVOICE_EXTRA: INodeProperties[] = [
	{ displayName: 'Booking Date', name: 'bookingDate', type: 'dateTime', default: '' },
	{ displayName: 'Booking Text', name: 'bookingText', type: 'string', default: '' },
	{
		displayName: 'Collective Invoice Position Print Type',
		name: 'collectiveInvoicePositionPrintType',
		type: 'options',
		default: 'OWN_POSITION_GROUP',
		options: [
			{ name: 'Order Position Group', value: 'ORDER_POSITION_GROUP' },
			{ name: 'Own Position Group', value: 'OWN_POSITION_GROUP' },
			{ name: 'Performance Record Position Group', value: 'PERFORMANCE_RECORD_POSITION_GROUP' },
			{ name: 'Shipment Position Group', value: 'SHIPMENT_POSITION_GROUP' },
		],
	},
	{ displayName: 'Commission Block', name: 'commissionBlock', type: 'boolean', default: false },
	{ displayName: 'Commission Settlement Done', name: 'commissionSettlementDone', type: 'boolean', default: false },
	{ displayName: 'Cost Centre ID', name: 'costCenterId', type: 'string', default: '' },
	{ displayName: 'Cost Type ID', name: 'costTypeId', type: 'string', default: '' },
	{ displayName: 'Credit Resets Order State', name: 'creditResetsOrderState', type: 'boolean', default: false },
	{
		displayName: 'Customer Habitual Exporter Letter of Intent ID',
		name: 'customerHabitualExporterLetterOfIntentId',
		type: 'string',
		default: '',
	},
	{ displayName: 'Delivery Date', name: 'deliveryDate', type: 'dateTime', default: '' },
	{ displayName: 'Due Date', name: 'dueDate', type: 'dateTime', default: '' },
	{ displayName: 'Dunning Block Date Until', name: 'dunningBlockDateUntilDate', type: 'dateTime', default: '' },
	{ displayName: 'Dunning Block Note', name: 'dunningBlockNote', type: 'string', default: '' },
	{ displayName: 'Invoice Date', name: 'invoiceDate', type: 'dateTime', default: '' },
	{ displayName: 'Invoice Number', name: 'invoiceNumber', type: 'string', default: '' },
	{ displayName: 'Order Number at Customer', name: 'orderNumberAtCustomer', type: 'string', default: '' },
	{
		displayName: 'Payment Status',
		name: 'paymentStatus',
		type: 'options',
		default: 'OPEN',
		options: [
			{ name: 'Cleared with Credit Note', value: 'CLEARED_WITH_CREDIT_NOTE' },
			{ name: 'Credit Note Cleared', value: 'CREDIT_NOTE_CLEARED' },
			{ name: 'No Open Item', value: 'NO_OPEN_ITEM' },
			{ name: 'Open', value: 'OPEN' },
			{ name: 'Paid', value: 'PAID' },
			{ name: 'Unknown', value: 'UNKNOWN' },
		],
	},
	{ displayName: 'Preceding Sales Invoice ID', name: 'precedingSalesInvoiceId', type: 'string', default: '' },
	{ displayName: 'Quotation ID', name: 'quotationId', type: 'string', default: '' },
	{
		displayName: 'Record Comment Inheritance',
		name: 'recordCommentInheritance',
		type: 'boolean',
		default: false,
	},
	{
		displayName: 'Record Free Text Inheritance',
		name: 'recordFreeTextInheritance',
		type: 'boolean',
		default: false,
	},
	{
		displayName: 'Record Opening Inheritance',
		name: 'recordOpeningInheritance',
		type: 'boolean',
		default: false,
	},
	{ displayName: 'Recurring Invoice ID', name: 'recurringInvoiceId', type: 'string', default: '' },
	{
		displayName: 'Sales Invoice Type',
		name: 'salesInvoiceType',
		type: 'options',
		default: 'STANDARD_INVOICE',
		options: [
			{ name: 'Advance Payment Invoice', value: 'ADVANCE_PAYMENT_INVOICE' },
			{ name: 'Credit Note', value: 'CREDIT_NOTE' },
			{ name: 'Final Invoice', value: 'FINAL_INVOICE' },
			{ name: 'Part Payment Invoice', value: 'PART_PAYMENT_INVOICE' },
			{ name: 'Prepayment Invoice', value: 'PREPAYMENT_INVOICE' },
			{ name: 'Retail Invoice', value: 'RETAIL_INVOICE' },
			{ name: 'Standard Invoice', value: 'STANDARD_INVOICE' },
		],
	},
	{ displayName: 'Sales Order ID', name: 'salesOrderId', type: 'string', default: '' },
	{ displayName: 'SEPA Direct Debit Mandate ID', name: 'sepaDirectDebitMandateId', type: 'string', default: '' },
	{ displayName: 'Shipping Date', name: 'shippingDate', type: 'dateTime', default: '' },
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		default: 'NEW',
		options: [
			{ name: 'Cancelled', value: 'CANCELLED' },
			{ name: 'Document Created', value: 'DOCUMENT_CREATED' },
			{ name: 'Entry Completed', value: 'ENTRY_COMPLETED' },
			{ name: 'New', value: 'NEW' },
			{ name: 'Open Item Created', value: 'OPEN_ITEM_CREATED' },
		],
	},
	{ displayName: 'VAT Registration Number', name: 'vatRegistrationNumber', type: 'string', default: '' },
];

const ALL_SALES_INVOICE_OPTIONS: INodeProperties[] = [
	CURRENCY_FIELD,
	...BASE_SALES_FIELDS,
	...SALES_INVOICE_EXTRA,
];

// ─── Sales Open Item ──────────────────────────────────────────────────────────

const ALL_SALES_OPEN_ITEM_OPTIONS: INodeProperties[] = [
	{ displayName: 'Amount', name: 'amount', type: 'number', default: 0 },
	{ displayName: 'Amount Discount', name: 'amountDiscount', type: 'number', default: 0 },
	{ displayName: 'Clearance Date', name: 'clearanceDate', type: 'dateTime', default: '' },
	{ displayName: 'Cleared', name: 'cleared', type: 'boolean', default: false },
	{
		displayName: 'Money Transaction ID',
		name: 'moneyTransactionId',
		type: 'string',
		default: '',
		description: 'Required for create.',
	},
	{ displayName: 'Open Item Number', name: 'openItemNumber', type: 'string', default: '' },
	{
		displayName: 'Open Item Type',
		name: 'openItemType',
		type: 'options',
		default: 'DEBTOR',
		options: [
			{ name: 'Creditor', value: 'CREDITOR' },
			{ name: 'Creditor Inverted', value: 'CREDITOR_INVERTED' },
			{ name: 'Credit Advice', value: 'CREDIT_ADVICE' },
			{ name: 'Credit Advice Inverted', value: 'CREDIT_ADVICE_INVERTED' },
			{ name: 'Credit Note Creditor', value: 'CREDIT_NOTE_CREDITOR' },
			{ name: 'Credit Note Creditor Inverted', value: 'CREDIT_NOTE_CREDITOR_INVERTED' },
			{ name: 'Credit Note Debitor', value: 'CREDIT_NOTE_DEBITOR' },
			{ name: 'Credit Note Debitor Inverted', value: 'CREDIT_NOTE_DEBITOR_INVERTED' },
			{ name: 'Debtor', value: 'DEBTOR' },
			{ name: 'Debtor Incoming Payment', value: 'DEBTOR_INCOMING_PAYMENT' },
			{ name: 'Debtor Incoming Payment Inverted', value: 'DEBTOR_INCOMING_PAYMENT_INVERTED' },
			{ name: 'Debtor Inverted', value: 'DEBTOR_INVERTED' },
			{ name: 'Debtor Outgoing Payment', value: 'DEBTOR_OUTGOING_PAYMENT' },
			{ name: 'Debtor Outgoing Payment Inverted', value: 'DEBTOR_OUTGOING_PAYMENT_INVERTED' },
			{ name: 'Debtor Party', value: 'DEBTOR_PARTY' },
			{ name: 'Debtor Party Inverted', value: 'DEBTOR_PARTY_INVERTED' },
			{ name: 'Debtor Return Debit', value: 'DEBTOR_RETURN_DEBIT' },
			{ name: 'Debtor Return Debit Fee', value: 'DEBTOR_RETURN_DEBIT_FEE' },
		],
	},
	{
		displayName: 'Version',
		name: 'version',
		type: 'string',
		default: '',
		description: 'Entity version for optimistic locking.',
	},
];

// ─── Quotation ────────────────────────────────────────────────────────────────
// Includes recordCurrencyId. Inherits baseSalesRecordWithAddresses.

const QUOTATION_EXTRA: INodeProperties[] = [
	{ displayName: 'Active Version', name: 'activeVersion', type: 'boolean', default: false },
	{ displayName: 'Expected Signature Date', name: 'expectedSignatureDate', type: 'dateTime', default: '' },
	{ displayName: 'Invoice Recipient ID', name: 'invoiceRecipientId', type: 'string', default: '' },
	{ displayName: 'Merged to Quotation ID', name: 'mergedToQuotationId', type: 'string', default: '' },
	{ displayName: 'Opportunity ID', name: 'opportunityId', type: 'string', default: '' },
	{ displayName: 'Quotation Date', name: 'quotationDate', type: 'dateTime', default: '' },
	{ displayName: 'Quotation Number', name: 'quotationNumber', type: 'string', default: '' },
	{
		displayName: 'Quotation Type',
		name: 'quotationType',
		type: 'options',
		default: 'NONE',
		options: [
			{ name: 'Blanket Sales Order', value: 'BLANKET_SALES_ORDER' },
			{ name: 'Contract', value: 'CONTRACT' },
			{ name: 'None', value: 'NONE' },
			{ name: 'Project', value: 'PROJECT' },
			{ name: 'Sales Invoice', value: 'SALES_INVOICE' },
			{ name: 'Sales Order', value: 'SALES_ORDER' },
		],
	},
	{ displayName: 'Quotation Version', name: 'quotationVersion', type: 'number', default: 0 },
	{
		displayName: 'Record Comment Inheritance',
		name: 'recordCommentInheritance',
		type: 'boolean',
		default: false,
	},
	{
		displayName: 'Record Free Text Inheritance',
		name: 'recordFreeTextInheritance',
		type: 'boolean',
		default: false,
	},
	{
		displayName: 'Record Opening Inheritance',
		name: 'recordOpeningInheritance',
		type: 'boolean',
		default: false,
	},
	{ displayName: 'Rejection Reason', name: 'rejectionReason', type: 'string', default: '' },
	{ displayName: 'Request Date', name: 'requestDate', type: 'dateTime', default: '' },
	{ displayName: 'Sales Probability', name: 'salesProbability', type: 'number', default: 0 },
	{ displayName: 'Sales Stage ID', name: 'salesStageId', type: 'string', default: '' },
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		default: 'OPEN',
		options: [
			{ name: 'Accepted', value: 'ACCEPTED' },
			{ name: 'Cancelled', value: 'CANCELLED' },
			{ name: 'Inquired', value: 'INQUIRED' },
			{ name: 'Open', value: 'OPEN' },
			{ name: 'Rejected', value: 'REJECTED' },
		],
	},
	{ displayName: 'Template', name: 'template', type: 'boolean', default: false },
	{ displayName: 'Valid From', name: 'validFrom', type: 'dateTime', default: '' },
	{ displayName: 'Valid To', name: 'validTo', type: 'dateTime', default: '' },
	{
		displayName: 'Warehouse',
		name: 'warehouseId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getWarehouses' },
		default: '',
	},
];

const ALL_QUOTATION_OPTIONS: INodeProperties[] = [
	CURRENCY_FIELD,
	...BASE_SALES_FIELDS,
	...BASE_WITH_ADDRESSES_FIELDS,
	...QUOTATION_EXTRA,
];

// ─── Resource Mapper (Custom Attributes) ────────────────────────────────────

function buildCustomAttributesField(resource: string): INodeProperties {
	return {
		displayName: 'Custom Attributes',
		name: 'customAttributes',
		type: 'resourceMapper',
		default: { mappingMode: 'defineBelow', value: null },
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [resource],
				operation: ['create', 'update'],
			},
		},
		typeOptions: {
			resourceMapper: {
				resourceMapperMethod: `getCustomAttributesFor${resource.charAt(0).toUpperCase()}${resource.slice(1)}`,
				mode: 'add',
				fieldWords: { singular: 'Custom Attribute', plural: 'Custom Attributes' },
				addAllFields: false,
				noFieldsError: `No custom attributes found for the ${resource} entity.`,
			},
		},
	};
}

// ─── Exported field collections ───────────────────────────────────────────────

export const salesOrderCreateUpdateFields: INodeProperties[] = [
	{
		displayName: 'Fields',
		name: 'createFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['salesOrder'],
				operation: ['create'],
			},
		},
		options: ALL_SALES_ORDER_OPTIONS,
	},
	{
		displayName: 'Fields to Update',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['salesOrder'],
				operation: ['update'],
			},
		},
		options: ALL_SALES_ORDER_OPTIONS,
	},
	buildCustomAttributesField('salesOrder'),
];

export const salesInvoiceCreateUpdateFields: INodeProperties[] = [
	{
		displayName: 'Fields',
		name: 'createFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['salesInvoice'],
				operation: ['create'],
			},
		},
		options: ALL_SALES_INVOICE_OPTIONS,
	},
	{
		displayName: 'Fields to Update',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['salesInvoice'],
				operation: ['update'],
			},
		},
		options: ALL_SALES_INVOICE_OPTIONS,
	},
	buildCustomAttributesField('salesInvoice'),
];

export const salesOpenItemCreateUpdateFields: INodeProperties[] = [
	{
		displayName: 'Fields',
		name: 'createFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['salesOpenItem'],
				operation: ['create'],
			},
		},
		options: ALL_SALES_OPEN_ITEM_OPTIONS,
	},
	{
		displayName: 'Fields to Update',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['salesOpenItem'],
				operation: ['update'],
			},
		},
		options: ALL_SALES_OPEN_ITEM_OPTIONS,
	},
	buildCustomAttributesField('salesOpenItem'),
];

export const quotationCreateUpdateFields: INodeProperties[] = [
	{
		displayName: 'Fields',
		name: 'createFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['quotation'],
				operation: ['create'],
			},
		},
		options: ALL_QUOTATION_OPTIONS,
	},
	{
		displayName: 'Fields to Update',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['quotation'],
				operation: ['update'],
			},
		},
		options: ALL_QUOTATION_OPTIONS,
	},
	buildCustomAttributesField('quotation'),
];

// ─── Date fields for epoch-ms conversion ─────────────────────────────────────

export const SALES_ENTITY_DATE_FIELDS: Record<string, string[]> = {
	salesOrder: [
		'currencyConversionDate',
		'pricingDate',
		'servicePeriodFrom',
		'servicePeriodTo',
		'plannedDeliveryDate',
		'plannedShippingDate',
		'orderDate',
		'plannedProjectEndDate',
		'plannedProjectStartDate',
	],
	salesInvoice: [
		'currencyConversionDate',
		'pricingDate',
		'servicePeriodFrom',
		'servicePeriodTo',
		'bookingDate',
		'deliveryDate',
		'dueDate',
		'dunningBlockDateUntilDate',
		'invoiceDate',
		'shippingDate',
	],
	salesOpenItem: ['clearanceDate'],
	quotation: [
		'currencyConversionDate',
		'pricingDate',
		'servicePeriodFrom',
		'servicePeriodTo',
		'plannedDeliveryDate',
		'plannedShippingDate',
		'expectedSignatureDate',
		'quotationDate',
		'requestDate',
		'validFrom',
		'validTo',
	],
};

export const SALES_ENTITY_RESOURCES = Object.keys(SALES_ENTITY_DATE_FIELDS);
