import { INodeProperties } from 'n8n-workflow';

export const resourceOptions: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	default: 'party',
	options: [
		{ name: 'Accounting Transaction', value: 'accountingTransaction' },
		{ name: 'Article', value: 'article' },
		{ name: 'Article Category', value: 'articleCategory' },
		{ name: 'Comment', value: 'comment' },
		{ name: 'Document', value: 'document' },
		{ name: 'Incoming Goods', value: 'incomingGoods' },
		{ name: 'Party (Customer / Contact)', value: 'party' },
		{ name: 'Purchase Invoice', value: 'purchaseInvoice' },
		{ name: 'Purchase Order', value: 'purchaseOrder' },
		{ name: 'Quotation', value: 'quotation' },
		{ name: 'Sales Invoice', value: 'salesInvoice' },
		{ name: 'Sales Open Item', value: 'salesOpenItem' },
		{ name: 'Sales Order', value: 'salesOrder' },
		{ name: 'Shipment', value: 'shipment' },
	],
};

// Read-only resources that do not support Create or Update
export const READ_ONLY_RESOURCES = ['document', 'accountingTransaction'];

export const operationOptions: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	default: 'getById',
	options: [
		{
			name: 'Create',
			value: 'create',
			action: 'Create a record',
		},
		{
			name: 'Get by ID',
			value: 'getById',
			action: 'Get a record by ID',
		},
		{
			name: 'Search',
			value: 'search',
			action: 'Search records',
		},
		{
			name: 'Update',
			value: 'update',
			action: 'Update a record',
		},
	],
};

// ── Get by ID ─────────────────────────────────────────────────────────────────

export const getByIdFields: INodeProperties[] = [
	{
		displayName: 'Record ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				operation: ['getById', 'update'],
			},
		},
		description: 'The Weclapp internal ID of the record',
	},
];

// ── Search ────────────────────────────────────────────────────────────────────

export const searchFields: INodeProperties[] = [
	{
		displayName: 'Custom Query',
		name: 'customQuery',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				operation: ['search'],
			},
		},
		placeholder: 'customerNumber-eq=K10001&lastModifiedDate-gt=1398436281262',
		description:
			'Filter using Weclapp query syntax. Multiple filters are combined with AND logic. '
			+ 'Each condition is a key-value pair separated by <code>=</code>; '
			+ 'pairs are joined with <code>&</code>.',
		hint: 'Example: <code>salesChannel-eq=NET1&createdDate-gt=1398436281262</code>',
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 1,
		typeOptions: { minValue: 1 },
		displayOptions: {
			show: {
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Page Size',
		name: 'pageSize',
		type: 'number',
		default: 100,
		typeOptions: { minValue: 1, maxValue: 1000 },
		displayOptions: {
			show: {
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'string',
		default: '-lastModifiedDate',
		displayOptions: {
			show: {
				operation: ['search'],
			},
		},
		placeholder: '-lastModifiedDate',
		description:
			'Sort field. Prefix with <code>-</code> for descending order '
			+ '(e.g. <code>-lastModifiedDate</code>).',
	},
];
