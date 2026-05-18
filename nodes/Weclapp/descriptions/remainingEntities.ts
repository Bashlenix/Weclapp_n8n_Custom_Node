import { INodeProperties } from 'n8n-workflow';

// ─── Shared helpers ───────────────────────────────────────────────────────────

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

// ─── Article ──────────────────────────────────────────────────────────────────
// Excluded on create and update: customsTariffNumber, manufacturerName (computed name fields)

const ALL_ARTICLE_OPTIONS: INodeProperties[] = [
	// ── baseArticle fields ──
	{
		displayName: 'Article Number',
		name: 'articleNumber',
		type: 'string',
		default: '',
		description: 'Required on create.',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		typeOptions: { rows: 3 },
	},
	{ displayName: 'EAN', name: 'ean', type: 'string', default: '' },
	{
		displayName: 'Fixed Purchase Quantity',
		name: 'fixedPurchaseQuantity',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Internal Note',
		name: 'internalNote',
		type: 'string',
		default: '',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Manufacturer Part Number',
		name: 'manufacturerPartNumber',
		type: 'string',
		default: '',
	},
	{ displayName: 'Match Code', name: 'matchCode', type: 'string', default: '' },
	{
		displayName: 'Minimum Purchase Quantity',
		name: 'minimumPurchaseQuantity',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'Required on create.',
	},
	{ displayName: 'Procurement Lead Days', name: 'procurementLeadDays', type: 'number', default: 0 },
	{ displayName: 'Short Description 1', name: 'shortDescription1', type: 'string', default: '' },
	{ displayName: 'Short Description 2', name: 'shortDescription2', type: 'string', default: '' },
	{
		displayName: 'Tax Rate Type',
		name: 'taxRateType',
		type: 'options',
		default: 'STANDARD',
		description: 'Required on create.',
		options: [
			{ name: 'Reduced', value: 'REDUCED' },
			{ name: 'Slightly Reduced', value: 'SLIGHTLY_REDUCED' },
			{ name: 'Standard', value: 'STANDARD' },
			{ name: 'Super Reduced', value: 'SUPER_REDUCED' },
			{ name: 'Zero', value: 'ZERO' },
		],
	},
	{ displayName: 'Unit ID', name: 'unitId', type: 'string', default: '', description: 'Required on create.' },
	// ── article-specific fields ──
	{ displayName: 'Active', name: 'active', type: 'boolean', default: true },
	{ displayName: 'Apply Cash Discount', name: 'applyCashDiscount', type: 'boolean', default: false },
	{
		displayName: 'Article Category',
		name: 'articleCategoryId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getArticleCategories' },
		default: '',
	},
	{ displayName: 'Article Gross Weight', name: 'articleGrossWeight', type: 'string', default: '' },
	{ displayName: 'Article Height', name: 'articleHeight', type: 'string', default: '' },
	{ displayName: 'Article Length', name: 'articleLength', type: 'string', default: '' },
	{ displayName: 'Article Net Weight', name: 'articleNetWeight', type: 'string', default: '' },
	{
		displayName: 'Article Type',
		name: 'articleType',
		type: 'options',
		default: 'STORABLE',
		description: 'Required on create.',
		options: [
			{ name: 'Basic', value: 'BASIC' },
			{ name: 'Loading Equipment', value: 'LOADING_EQUIPMENT' },
			{ name: 'Loading Equipment Storable', value: 'LOADING_EQUIPMENT_STORABLE' },
			{ name: 'Packaging Unit', value: 'PACKAGING_UNIT' },
			{ name: 'Sales Bill of Material', value: 'SALES_BILL_OF_MATERIAL' },
			{ name: 'Service', value: 'SERVICE' },
			{ name: 'Service Quota', value: 'SERVICE_QUOTA' },
			{ name: 'Shipping Cost', value: 'SHIPPING_COST' },
			{ name: 'Storable', value: 'STORABLE' },
		],
	},
	{ displayName: 'Article Width', name: 'articleWidth', type: 'string', default: '' },
	{ displayName: 'Available in Sale', name: 'availableInSale', type: 'boolean', default: true },
	{ displayName: 'Average Delivery Time', name: 'averageDeliveryTime', type: 'number', default: 0 },
	{ displayName: 'Barcode', name: 'barcode', type: 'string', default: '' },
	{ displayName: 'Batch Number Required', name: 'batchNumberRequired', type: 'boolean', default: false },
	{
		displayName: 'Bill of Material Part Delivery Possible',
		name: 'billOfMaterialPartDeliveryPossible',
		type: 'boolean',
		default: false,
	},
	{ displayName: 'Catalog Code', name: 'catalogCode', type: 'string', default: '' },
	{ displayName: 'Customs Description', name: 'customsDescription', type: 'string', default: '' },
	{
		displayName: 'Customs Tariff Number',
		name: 'customsTariffNumberId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getCustomsTariffNumbers' },
		default: '',
	},
	{ displayName: 'Expiration Days', name: 'expirationDays', type: 'number', default: 0 },
	{ displayName: 'Launch Date', name: 'launchDate', type: 'dateTime', default: '' },
	{
		displayName: 'Manufacturer',
		name: 'manufacturerId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getManufacturers' },
		default: '',
	},
	{ displayName: 'Minimum Stock Quantity', name: 'minimumStockQuantity', type: 'string', default: '' },
	{ displayName: 'Packaging Quantity', name: 'packagingQuantity', type: 'number', default: 0 },
	{ displayName: 'Producer Type', name: 'producerType', type: 'string', default: '' },
	{ displayName: 'Production Article', name: 'productionArticle', type: 'boolean', default: false },
	{ displayName: 'Record Item Group Name', name: 'recordItemGroupName', type: 'string', default: '' },
	{ displayName: 'Safety Stock Days', name: 'safetyStockDays', type: 'number', default: 0 },
	{
		displayName: 'Sales Channel',
		name: 'salesChannel',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getSalesChannels' },
		default: '',
	},
	{ displayName: 'Sell By Date', name: 'sellByDate', type: 'dateTime', default: '' },
	{ displayName: 'Sell From Date', name: 'sellFromDate', type: 'dateTime', default: '' },
	{ displayName: 'Serial Number Required', name: 'serialNumberRequired', type: 'boolean', default: false },
	{ displayName: 'Show on Delivery Note', name: 'showOnDeliveryNote', type: 'boolean', default: false },
	{ displayName: 'Support Until Date', name: 'supportUntilDate', type: 'dateTime', default: '' },
	{ displayName: 'System Code', name: 'systemCode', type: 'string', default: '' },
	{ displayName: 'Target Stock Quantity', name: 'targetStockQuantity', type: 'string', default: '' },
];

export const articleCreateUpdateFields: INodeProperties[] = [
	{
		displayName: 'Fields',
		name: 'createFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['article'],
				operation: ['create'],
			},
		},
		options: ALL_ARTICLE_OPTIONS,
	},
	{
		displayName: 'Fields to Update',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['article'],
				operation: ['update'],
			},
		},
		options: ALL_ARTICLE_OPTIONS,
	},
	buildCustomAttributesField('article'),
];

// ─── Article Category ─────────────────────────────────────────────────────────
// Create requires: name

const ALL_ARTICLE_CATEGORY_OPTIONS: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'Required on create.',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		typeOptions: { rows: 3 },
	},
	{
		displayName: 'Parent Category',
		name: 'parentCategoryId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getArticleCategories' },
		default: '',
	},
];

export const articleCategoryCreateUpdateFields: INodeProperties[] = [
	{
		displayName: 'Fields',
		name: 'createFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['articleCategory'],
				operation: ['create'],
			},
		},
		options: ALL_ARTICLE_CATEGORY_OPTIONS,
	},
	{
		displayName: 'Fields to Update',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['articleCategory'],
				operation: ['update'],
			},
		},
		options: ALL_ARTICLE_CATEGORY_OPTIONS,
	},
	buildCustomAttributesField('articleCategory'),
];

// ─── Comment ──────────────────────────────────────────────────────────────────
// Create requires: entityName, entityId, comment
// Update ignores: lastEditDate, createdDate, lastModifiedDate, version (all readOnly — not included here)

const COMMENT_ENTITY_NAME_OPTIONS = [
	{ name: 'Article', value: 'article' },
	{ name: 'Incoming Goods', value: 'incomingGoods' },
	{ name: 'Party', value: 'party' },
	{ name: 'Purchase Invoice', value: 'purchaseInvoice' },
	{ name: 'Purchase Order', value: 'purchaseOrder' },
	{ name: 'Quotation', value: 'quotation' },
	{ name: 'Sales Invoice', value: 'salesInvoice' },
	{ name: 'Sales Order', value: 'salesOrder' },
	{ name: 'Shipment', value: 'shipment' },
];

const ALL_COMMENT_OPTIONS: INodeProperties[] = [
	{
		displayName: 'Entity Name',
		name: 'entityName',
		type: 'options',
		default: 'salesOrder',
		description: 'Required on create.',
		options: COMMENT_ENTITY_NAME_OPTIONS,
	},
	{
		displayName: 'Entity ID',
		name: 'entityId',
		type: 'string',
		default: '',
		description: 'ID of the parent entity. Required on create.',
	},
	{
		displayName: 'Comment',
		name: 'comment',
		type: 'string',
		default: '',
		typeOptions: { rows: 4 },
		description: 'Required on create.',
	},
	{
		displayName: 'HTML Comment',
		name: 'htmlComment',
		type: 'string',
		default: '',
		typeOptions: { rows: 4 },
	},
	{ displayName: 'Parent Comment ID', name: 'parentCommentId', type: 'string', default: '' },
	{ displayName: 'Private Comment', name: 'privateComment', type: 'boolean', default: false },
	{ displayName: 'Public Comment', name: 'publicComment', type: 'boolean', default: true },
	{ displayName: 'Solution', name: 'solution', type: 'boolean', default: false },
];

export const commentCreateUpdateFields: INodeProperties[] = [
	{
		displayName: 'Fields',
		name: 'createFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['comment'],
				operation: ['create'],
			},
		},
		options: ALL_COMMENT_OPTIONS,
	},
	{
		displayName: 'Fields to Update',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['comment'],
				operation: ['update'],
			},
		},
		options: ALL_COMMENT_OPTIONS,
	},
	buildCustomAttributesField('comment'),
];

// ─── Comment / Document mandatory search filters ──────────────────────────────
// These fields are injected into the search query string for comment and document.

export const entitySearchFilterFields: INodeProperties[] = [
	{
		displayName: 'Entity Name',
		name: 'entityName',
		type: 'options',
		required: true,
		default: 'salesOrder',
		displayOptions: {
			show: {
				resource: ['comment'],
				operation: ['search'],
			},
		},
		description: 'The entity type whose comments to search.',
		options: COMMENT_ENTITY_NAME_OPTIONS,
	},
	{
		displayName: 'Entity Name',
		name: 'entityName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['search'],
			},
		},
		description: 'The entity type whose documents to search (e.g. salesOrder, purchaseOrder).',
	},
	{
		displayName: 'Entity ID',
		name: 'entityId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['comment', 'document'],
				operation: ['search'],
			},
		},
		description: 'The ID of the entity whose comments/documents to search.',
	},
];

// ─── User ─────────────────────────────────────────────────────────────────────
// Create requires: email, status
// Skipped: imageId, username (readOnly), licenses, userRoles (filterable: false / complex)

const ALL_USER_OPTIONS: INodeProperties[] = [
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		default: '',
		description: 'Required on create.',
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		default: 'ACTIVE',
		description: 'Required on create.',
		options: [
			{ name: 'Active', value: 'ACTIVE' },
			{ name: 'Departure', value: 'DEPARTURE' },
			{ name: 'Not Active', value: 'NOT_ACTIVE' },
		],
	},
	{ displayName: 'First Name', name: 'firstName', type: 'string', default: '' },
	{ displayName: 'Last Name', name: 'lastName', type: 'string', default: '' },
	{ displayName: 'Title', name: 'title', type: 'string', default: '' },
	{ displayName: 'Phone Number', name: 'phoneNumber', type: 'string', default: '' },
	{ displayName: 'Mobile Phone Number', name: 'mobilePhoneNumber', type: 'string', default: '' },
	{ displayName: 'Fax Number', name: 'faxNumber', type: 'string', default: '' },
	{ displayName: 'Birth Date', name: 'birthDate', type: 'dateTime', default: '' },
];

export const userCreateUpdateFields: INodeProperties[] = [
	{
		displayName: 'Fields',
		name: 'createFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['create'],
			},
		},
		options: ALL_USER_OPTIONS,
	},
	{
		displayName: 'Fields to Update',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['update'],
			},
		},
		options: ALL_USER_OPTIONS,
	},
	buildCustomAttributesField('user'),
];

// ─── Date fields for epoch-ms conversion ─────────────────────────────────────

export const OTHER_ENTITY_DATE_FIELDS: Record<string, string[]> = {
	article: ['launchDate', 'sellByDate', 'sellFromDate', 'supportUntilDate'],
	articleCategory: [],
	comment: [],
	user: ['birthDate'],
};

export const OTHER_ENTITY_RESOURCES = Object.keys(OTHER_ENTITY_DATE_FIELDS);
