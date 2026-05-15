import { INodeProperties } from 'n8n-workflow';

// ─── Shared base fields (basePurchaseRecord + baseRecordWithMoney + baseRecord) ──

const BASE_PURCHASE_FIELDS: INodeProperties[] = [
	{ displayName: 'Commercial Language', name: 'commercialLanguage', type: 'string', default: '' },
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
	{ displayName: 'Header Discount', name: 'headerDiscount', type: 'number', default: 0 },
	{ displayName: 'Header Surcharge', name: 'headerSurcharge', type: 'number', default: 0 },
	{ displayName: 'Non-Standard Tax ID', name: 'nonStandardTaxId', type: 'string', default: '' },
	{
		displayName: 'Payment Method',
		name: 'paymentMethodId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getPaymentMethods' },
		default: '',
	},
	{
		displayName: 'Currency',
		name: 'recordCurrencyId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getCurrencies' },
		default: '',
	},
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
	{ displayName: 'Sent To Recipient', name: 'sentToRecipient', type: 'boolean', default: false },
	{ displayName: 'Service Period From', name: 'servicePeriodFrom', type: 'dateTime', default: '' },
	{ displayName: 'Service Period To', name: 'servicePeriodTo', type: 'dateTime', default: '' },
	{
		displayName: 'Supplier ID',
		name: 'supplierId',
		type: 'string',
		default: '',
		description: 'Required for create.',
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

// ─── Purchase Order ───────────────────────────────────────────────────────────
// Excluded on create: shipmentMethodName, paymentMethodName, termOfPaymentName
// Excluded on update: paymentMethodName, termOfPaymentName

const PURCHASE_ORDER_EXTRA: INodeProperties[] = [
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
	{ displayName: 'Commercial Language Customer', name: 'commercialLanguageCustomer', type: 'string', default: '' },
	{ displayName: 'Commission', name: 'commission', type: 'string', default: '' },
	{ displayName: 'Confirmation Number', name: 'confirmationNumber', type: 'string', default: '' },
	{ displayName: 'External Purchase Order Number', name: 'externalPurchaseOrderNumber', type: 'string', default: '' },
	{ displayName: 'Note', name: 'note', type: 'string', default: '', typeOptions: { rows: 3 } },
	{ displayName: 'Order Date', name: 'orderDate', type: 'dateTime', default: '' },
	{ displayName: 'Package Tracking Number', name: 'packageTrackingNumber', type: 'string', default: '' },
	{ displayName: 'Package Tracking URL', name: 'packageTrackingUrl', type: 'string', default: '' },
	{ displayName: 'Planned Delivery Date', name: 'plannedDeliveryDate', type: 'dateTime', default: '' },
	{ displayName: 'Planned Shipping Date', name: 'plannedShippingDate', type: 'dateTime', default: '' },
	{ displayName: 'Purchase Order Number', name: 'purchaseOrderNumber', type: 'string', default: '' },
	{
		displayName: 'Purchase Order Type',
		name: 'purchaseOrderType',
		type: 'options',
		default: 'NORMAL',
		options: [
			{ name: 'Dropshipping', value: 'DROPSHIPPING' },
			{ name: 'Normal', value: 'NORMAL' },
			{ name: 'Sales Order', value: 'SALES_ORDER' },
			{ name: 'Sales Order Commission', value: 'SALES_ORDER_COMMISSION' },
			{ name: 'Triangular', value: 'TRIANGULAR' },
		],
	},
	{ displayName: 'Recipient Country Code', name: 'recipientCountryCode', type: 'string', default: '' },
	{ displayName: 'Sales Order ID', name: 'salesOrderId', type: 'string', default: '' },
	{ displayName: 'Sender Country Code', name: 'senderCountryCode', type: 'string', default: '' },
	{
		displayName: 'Shipment Method',
		name: 'shipmentMethodId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getShipmentMethods' },
		default: '',
	},
	{
		displayName: 'Shipping Carrier',
		name: 'shippingCarrierId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getShippingCarriers' },
		default: '',
	},
	{ displayName: 'Shipping Notification Date', name: 'shippingNotificationDate', type: 'dateTime', default: '' },
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		default: 'ORDER_ENTRY_IN_PROGRESS',
		options: [
			{ name: 'Cancelled', value: 'CANCELLED' },
			{ name: 'Closed', value: 'CLOSED' },
			{ name: 'Confirmed', value: 'CONFIRMED' },
			{ name: 'Order Documents Printed', value: 'ORDER_DOCUMENTS_PRINTED' },
			{ name: 'Order Entry Completed', value: 'ORDER_ENTRY_COMPLETED' },
			{ name: 'Order Entry In Progress', value: 'ORDER_ENTRY_IN_PROGRESS' },
		],
	},
	{
		displayName: 'Supplier Habitual Exporter Letter of Intent ID',
		name: 'supplierHabitualExporterLetterOfIntentId',
		type: 'string',
		default: '',
	},
	{ displayName: 'Supplier Quotation Number', name: 'supplierQuotationNumber', type: 'string', default: '' },
	{
		displayName: 'Warehouse',
		name: 'warehouseId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getWarehouses' },
		default: '',
	},
];

const ALL_PURCHASE_ORDER_OPTIONS: INodeProperties[] = [
	...BASE_PURCHASE_FIELDS,
	...PURCHASE_ORDER_EXTRA,
];

// ─── Purchase Invoice ─────────────────────────────────────────────────────────
// Excluded on create: shipmentMethodName, paymentMethodName, termOfPaymentName
// Excluded on update: paymentMethodName, termOfPaymentName

const PURCHASE_INVOICE_EXTRA: INodeProperties[] = [
	{ displayName: 'Booking Date', name: 'bookingDate', type: 'dateTime', default: '' },
	{ displayName: 'Booking Text', name: 'bookingText', type: 'string', default: '' },
	{ displayName: 'Cost Centre ID', name: 'costCenterId', type: 'string', default: '' },
	{ displayName: 'Cost Type ID', name: 'costTypeId', type: 'string', default: '' },
	{ displayName: 'Credit Resets Order State', name: 'creditResetsOrderState', type: 'boolean', default: false },
	{ displayName: 'Delivery Date', name: 'deliveryDate', type: 'dateTime', default: '' },
	{ displayName: 'Due Date', name: 'dueDate', type: 'dateTime', default: '' },
	{ displayName: 'Gross Prices', name: 'grossPrices', type: 'boolean', default: false },
	{ displayName: 'Import Sales Tax Amount', name: 'importSalesTaxAmount', type: 'number', default: 0 },
	{ displayName: 'Internal Invoice Number', name: 'internalInvoiceNumber', type: 'string', default: '' },
	{ displayName: 'Invoice Date', name: 'invoiceDate', type: 'dateTime', default: '' },
	{ displayName: 'Invoice Number', name: 'invoiceNumber', type: 'string', default: '' },
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
	{ displayName: 'Pricing Date', name: 'pricingDate', type: 'dateTime', default: '' },
	{
		displayName: 'Purchase Invoice Type',
		name: 'purchaseInvoiceType',
		type: 'options',
		default: 'STANDARD_INVOICE',
		options: [
			{ name: 'Advance Payment Invoice', value: 'ADVANCE_PAYMENT_INVOICE' },
			{ name: 'Credit Advice', value: 'CREDIT_ADVICE' },
			{ name: 'Credit Note', value: 'CREDIT_NOTE' },
			{ name: 'Final Invoice', value: 'FINAL_INVOICE' },
			{ name: 'Part Payment Invoice', value: 'PART_PAYMENT_INVOICE' },
			{ name: 'Prepayment Invoice', value: 'PREPAYMENT_INVOICE' },
			{ name: 'Standard Invoice', value: 'STANDARD_INVOICE' },
		],
	},
	{ displayName: 'Recipient Country Code', name: 'recipientCountryCode', type: 'string', default: '' },
	{ displayName: 'Sender Country Code', name: 'senderCountryCode', type: 'string', default: '' },
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
			{ name: 'Invoice Checked', value: 'INVOICE_CHECKED' },
			{ name: 'Invoice Received', value: 'INVOICE_RECEIVED' },
			{ name: 'Invoice Verification', value: 'INVOICE_VERIFICATION' },
			{ name: 'New', value: 'NEW' },
			{ name: 'OCR Verification', value: 'OCR_VERIFICATION' },
			{ name: 'Open Item Created', value: 'OPEN_ITEM_CREATED' },
		],
	},
	{
		displayName: 'Supplier Habitual Exporter Letter of Intent ID',
		name: 'supplierHabitualExporterLetterOfIntentId',
		type: 'string',
		default: '',
	},
	{ displayName: 'VAT Registration Number', name: 'vatRegistrationNumber', type: 'string', default: '' },
];

const ALL_PURCHASE_INVOICE_OPTIONS: INodeProperties[] = [
	...BASE_PURCHASE_FIELDS,
	...PURCHASE_INVOICE_EXTRA,
];

// ─── Incoming Goods ───────────────────────────────────────────────────────────
// No required or ignored fields defined; all primitive fields from the spec are exposed.

const ALL_INCOMING_GOODS_OPTIONS: INodeProperties[] = [
	{ displayName: 'Commercial Language', name: 'commercialLanguage', type: 'string', default: '' },
	{ displayName: 'Delivery Note Number', name: 'deliveryNoteNumber', type: 'string', default: '' },
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		typeOptions: { rows: 3 },
	},
	{ displayName: 'DHL Receiver ID', name: 'dhlReceiverId', type: 'string', default: '' },
	{
		displayName: 'Disable Record Emailing Rule',
		name: 'disableRecordEmailingRule',
		type: 'boolean',
		default: false,
	},
	{ displayName: 'Incoming Goods Number', name: 'incomingGoodsNumber', type: 'string', default: '' },
	{
		displayName: 'Incoming Goods Type',
		name: 'incomingGoodsType',
		type: 'options',
		default: 'STANDARD',
		options: [
			{ name: 'Customer Return', value: 'CUSTOMER_RETURN' },
			{ name: 'Internal', value: 'INTERNAL' },
			{ name: 'Standard', value: 'STANDARD' },
			{ name: 'Supplier Compensation', value: 'SUPPLIER_COMPENSATION' },
		],
	},
	{ displayName: 'Invoice Recipient ID', name: 'invoiceRecipientId', type: 'string', default: '' },
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
	{ displayName: 'Sender Party ID', name: 'senderPartyId', type: 'string', default: '' },
	{ displayName: 'Sent To Recipient', name: 'sentToRecipient', type: 'boolean', default: false },
	{
		displayName: 'Shipping Return Carrier',
		name: 'shippingReturnCarrierId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getShippingCarriers' },
		default: '',
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		default: 'NEW',
		options: [
			{ name: 'Cancelled', value: 'CANCELLED' },
			{ name: 'Delivered', value: 'DELIVERED' },
			{ name: 'Delivery Note Printed', value: 'DELIVERY_NOTE_PRINTED' },
			{ name: 'Incoming Cancelled', value: 'INCOMING_CANCELLED' },
			{ name: 'Incoming Moved Into Store', value: 'INCOMING_MOVED_INTO_STORE' },
			{ name: 'Incoming Shipped', value: 'INCOMING_SHIPPED' },
			{ name: 'In Route', value: 'IN_ROUTE' },
			{ name: 'New', value: 'NEW' },
			{ name: 'Shipped', value: 'SHIPPED' },
		],
	},
	{
		displayName: 'Warehouse',
		name: 'warehouseId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getWarehouses' },
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

// ─── Shipment ─────────────────────────────────────────────────────────────────
// Excluded on create and update: shipmentMethodName, declaredValueAmountCurrencyName, warehouseName

const ALL_SHIPMENT_OPTIONS: INodeProperties[] = [
	{
		displayName: 'Additional Delivery Information',
		name: 'additionalDeliveryInformation',
		type: 'string',
		default: '',
		typeOptions: { rows: 3 },
	},
	{ displayName: 'Commercial Language', name: 'commercialLanguage', type: 'string', default: '' },
	{ displayName: 'Consolidation Storage Place ID', name: 'consolidationStoragePlaceId', type: 'string', default: '' },
	{ displayName: 'Customer Purchase Order Number', name: 'customerPurchaseOrderNumber', type: 'string', default: '' },
	{ displayName: 'Declared Value Amount', name: 'declaredValueAmount', type: 'number', default: 0 },
	{
		displayName: 'Declared Value Currency',
		name: 'declaredValueAmountCurrencyId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getCurrencies' },
		default: '',
	},
	{ displayName: 'Delivery Date', name: 'deliveryDate', type: 'dateTime', default: '' },
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		typeOptions: { rows: 3 },
	},
	{ displayName: 'Destination Storage Place ID', name: 'destinationStoragePlaceId', type: 'string', default: '' },
	{ displayName: 'Destination Warehouse ID', name: 'destinationWarehouseId', type: 'string', default: '' },
	{ displayName: 'DHL Receiver ID', name: 'dhlReceiverId', type: 'string', default: '' },
	{
		displayName: 'Disable Record Emailing Rule',
		name: 'disableRecordEmailingRule',
		type: 'boolean',
		default: false,
	},
	{ displayName: 'Invoice Recipient ID', name: 'invoiceRecipientId', type: 'string', default: '' },
	{ displayName: 'Main Sales Order ID', name: 'mainSalesOrderId', type: 'string', default: '' },
	{ displayName: 'Package Return Tracking Number', name: 'packageReturnTrackingNumber', type: 'string', default: '' },
	{ displayName: 'Package Return Tracking URL', name: 'packageReturnTrackingUrl', type: 'string', default: '' },
	{ displayName: 'Picking Instructions', name: 'pickingInstructions', type: 'string', default: '' },
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
	{ displayName: 'Recipient Party ID', name: 'recipientPartyId', type: 'string', default: '' },
	{ displayName: 'Responsible User ID', name: 'responsibleUserId', type: 'string', default: '' },
	{ displayName: 'Sent To Recipient', name: 'sentToRecipient', type: 'boolean', default: false },
	{
		displayName: 'Shipment Method',
		name: 'shipmentMethodId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getShipmentMethods' },
		default: '',
	},
	{ displayName: 'Shipment Number', name: 'shipmentNumber', type: 'string', default: '' },
	{
		displayName: 'Shipment Type',
		name: 'shipmentType',
		type: 'options',
		default: 'STANDARD',
		options: [
			{ name: 'Consignment', value: 'CONSIGNMENT' },
			{ name: 'Consignment Return', value: 'CONSIGNMENT_RETURN' },
			{ name: 'Customer Compensation', value: 'CUSTOMER_COMPENSATION' },
			{ name: 'Internal', value: 'INTERNAL' },
			{ name: 'Standard', value: 'STANDARD' },
			{ name: 'Supplier Return', value: 'SUPPLIER_RETURN' },
		],
	},
	{
		displayName: 'Shipping Carrier',
		name: 'shippingCarrierId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getShippingCarriers' },
		default: '',
	},
	{ displayName: 'Shipping Date', name: 'shippingDate', type: 'dateTime', default: '' },
	{
		displayName: 'Shipping Return Carrier',
		name: 'shippingReturnCarrierId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getShippingCarriers' },
		default: '',
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		default: 'NEW',
		options: [
			{ name: 'Cancelled', value: 'CANCELLED' },
			{ name: 'Delivered', value: 'DELIVERED' },
			{ name: 'Delivery Note Printed', value: 'DELIVERY_NOTE_PRINTED' },
			{ name: 'Incoming Cancelled', value: 'INCOMING_CANCELLED' },
			{ name: 'Incoming Moved Into Store', value: 'INCOMING_MOVED_INTO_STORE' },
			{ name: 'Incoming Shipped', value: 'INCOMING_SHIPPED' },
			{ name: 'In Route', value: 'IN_ROUTE' },
			{ name: 'New', value: 'NEW' },
			{ name: 'Shipped', value: 'SHIPPED' },
		],
	},
	{ displayName: 'Total Weight', name: 'totalWeight', type: 'number', default: 0 },
	{
		displayName: 'Warehouse',
		name: 'warehouseId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getWarehouses' },
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

// ─── Resource Mapper (Custom Attributes) ─────────────────────────────────────

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

export const purchaseOrderCreateUpdateFields: INodeProperties[] = [
	{
		displayName: 'Fields',
		name: 'createFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['purchaseOrder'],
				operation: ['create'],
			},
		},
		options: ALL_PURCHASE_ORDER_OPTIONS,
	},
	{
		displayName: 'Fields to Update',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['purchaseOrder'],
				operation: ['update'],
			},
		},
		options: ALL_PURCHASE_ORDER_OPTIONS,
	},
	buildCustomAttributesField('purchaseOrder'),
];

export const purchaseInvoiceCreateUpdateFields: INodeProperties[] = [
	{
		displayName: 'Fields',
		name: 'createFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['purchaseInvoice'],
				operation: ['create'],
			},
		},
		options: ALL_PURCHASE_INVOICE_OPTIONS,
	},
	{
		displayName: 'Fields to Update',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['purchaseInvoice'],
				operation: ['update'],
			},
		},
		options: ALL_PURCHASE_INVOICE_OPTIONS,
	},
	buildCustomAttributesField('purchaseInvoice'),
];

export const incomingGoodsCreateUpdateFields: INodeProperties[] = [
	{
		displayName: 'Fields',
		name: 'createFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['incomingGoods'],
				operation: ['create'],
			},
		},
		options: ALL_INCOMING_GOODS_OPTIONS,
	},
	{
		displayName: 'Fields to Update',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['incomingGoods'],
				operation: ['update'],
			},
		},
		options: ALL_INCOMING_GOODS_OPTIONS,
	},
	buildCustomAttributesField('incomingGoods'),
];

export const shipmentCreateUpdateFields: INodeProperties[] = [
	{
		displayName: 'Fields',
		name: 'createFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create'],
			},
		},
		options: ALL_SHIPMENT_OPTIONS,
	},
	{
		displayName: 'Fields to Update',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['update'],
			},
		},
		options: ALL_SHIPMENT_OPTIONS,
	},
	buildCustomAttributesField('shipment'),
];

// ─── Date fields for epoch-ms conversion ─────────────────────────────────────

export const PURCHASE_ENTITY_DATE_FIELDS: Record<string, string[]> = {
	purchaseOrder: [
		'currencyConversionDate',
		'servicePeriodFrom',
		'servicePeriodTo',
		'orderDate',
		'plannedDeliveryDate',
		'plannedShippingDate',
		'shippingNotificationDate',
	],
	purchaseInvoice: [
		'currencyConversionDate',
		'servicePeriodFrom',
		'servicePeriodTo',
		'bookingDate',
		'deliveryDate',
		'dueDate',
		'invoiceDate',
		'pricingDate',
		'shippingDate',
	],
	incomingGoods: [],
	shipment: ['deliveryDate', 'shippingDate'],
};

export const PURCHASE_ENTITY_RESOURCES = Object.keys(PURCHASE_ENTITY_DATE_FIELDS);
