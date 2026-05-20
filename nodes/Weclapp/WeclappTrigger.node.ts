import {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
	NodeHint,
} from 'n8n-workflow';

import { weclappRequest } from './transport/request';

const HINT_PREFIX =
	'No data yet — <a href="https://docs.n8n.io/workflows/executions/debug/" target="_blank">pin a test payload</a> '
	+ 'on this node to enable field autocompletion in downstream nodes (IF, Switch, Set, etc.).<br/>';

function fieldHint(resource: string, label: string, fields: string): NodeHint {
	return {
		message: HINT_PREFIX + `<strong>${label} fields:</strong> ${fields}`,
		type: 'info',
		location: 'outputPane',
		whenToDisplay: 'beforeExecution',
		displayCondition: `={{ $parameter.resource === "${resource}" }}`,
	};
}

function fc(name: string): string {
	return `<code>${name}</code>`;
}

const ENTITY_HINTS: NodeHint[] = [
	fieldHint(
		'accountingTransaction',
		'Accounting Transaction',
		[
			fc('id'), fc('bookingDate'), fc('bookingText'), fc('bookingType'),
			fc('amount'), fc('costCenterId'), fc('createdDate'), fc('lastModifiedDate'),
		].join(', '),
	),
	fieldHint(
		'article',
		'Article',
		[
			fc('id'), fc('articleNumber'), fc('name'), fc('articleType'), fc('active'),
			fc('taxRateType'), fc('articleCategoryId'), fc('manufacturerId'),
			fc('launchDate'), fc('sellFromDate'), fc('sellByDate'), fc('supportUntilDate'),
			fc('createdDate'), fc('lastModifiedDate'), fc('version'),
		].join(', '),
	),
	fieldHint(
		'articleCategory',
		'Article Category',
		[
			fc('id'), fc('name'), fc('description'), fc('parentCategoryId'),
			fc('createdDate'), fc('lastModifiedDate'),
		].join(', '),
	),
	fieldHint(
		'comment',
		'Comment',
		[
			fc('id'), fc('entityName'), fc('entityId'), fc('comment'), fc('htmlComment'),
			fc('privateComment'), fc('publicComment'), fc('solution'), fc('parentCommentId'),
			fc('createdDate'), fc('lastModifiedDate'),
		].join(', '),
	),
	fieldHint(
		'document',
		'Document',
		[
			fc('id'), fc('entityName'), fc('entityId'), fc('fileName'), fc('title'),
			fc('documentType'), fc('mimeType'), fc('createdDate'), fc('lastModifiedDate'),
		].join(', '),
	),
	fieldHint(
		'incomingGoods',
		'Incoming Goods',
		[
			fc('id'), fc('incomingGoodsNumber'), fc('incomingGoodsType'), fc('status'),
			fc('senderPartyId'), fc('deliveryNoteNumber'), fc('warehouseId'),
			fc('responsibleUserId'), fc('createdDate'), fc('lastModifiedDate'), fc('version'),
		].join(', '),
	),
	fieldHint(
		'party',
		'Party',
		[
			fc('id'), fc('partyNumber'), fc('partyType'), fc('company'), fc('firstName'), fc('lastName'),
			fc('customerNumber'), fc('supplierNumber'), fc('customer'), fc('supplier'),
			fc('leadStatus'), fc('responsibleUserId'), fc('createdDate'), fc('lastModifiedDate'), fc('version'),
		].join(', '),
	),
	fieldHint(
		'purchaseInvoice',
		'Purchase Invoice',
		[
			fc('id'), fc('invoiceNumber'), fc('supplierId'), fc('status'), fc('purchaseInvoiceType'),
			fc('invoiceDate'), fc('dueDate'), fc('paymentStatus'),
			fc('responsibleUserId'), fc('createdDate'), fc('lastModifiedDate'), fc('version'),
		].join(', '),
	),
	fieldHint(
		'purchaseOrder',
		'Purchase Order',
		[
			fc('id'), fc('purchaseOrderNumber'), fc('supplierId'), fc('status'), fc('purchaseOrderType'),
			fc('orderDate'), fc('plannedDeliveryDate'), fc('warehouseId'),
			fc('responsibleUserId'), fc('createdDate'), fc('lastModifiedDate'), fc('version'),
		].join(', '),
	),
	fieldHint(
		'quotation',
		'Quotation',
		[
			fc('id'), fc('quotationNumber'), fc('customerId'), fc('status'), fc('quotationType'),
			fc('quotationDate'), fc('expectedSignatureDate'), fc('validFrom'), fc('validTo'),
			fc('responsibleUserId'), fc('createdDate'), fc('lastModifiedDate'), fc('version'),
		].join(', '),
	),
	fieldHint(
		'salesInvoice',
		'Sales Invoice',
		[
			fc('id'), fc('invoiceNumber'), fc('customerId'), fc('status'), fc('salesInvoiceType'),
			fc('invoiceDate'), fc('dueDate'), fc('paymentStatus'),
			fc('responsibleUserId'), fc('createdDate'), fc('lastModifiedDate'), fc('version'),
		].join(', '),
	),
	fieldHint(
		'salesOpenItem',
		'Sales Open Item',
		[
			fc('id'), fc('openItemNumber'), fc('openItemType'), fc('customerId'),
			fc('amount'), fc('amountDiscount'), fc('dueDate'), fc('paymentStatus'), fc('cleared'),
			fc('createdDate'), fc('lastModifiedDate'),
		].join(', '),
	),
	fieldHint(
		'salesOrder',
		'Sales Order',
		[
			fc('id'), fc('orderNumber'), fc('orderNumberAtCustomer'), fc('customerId'),
			fc('status'), fc('orderDate'), fc('plannedDeliveryDate'), fc('deliveryDate'),
			fc('salesChannel'), fc('warehouseId'), fc('responsibleUserId'),
			fc('createdDate'), fc('lastModifiedDate'), fc('version'),
		].join(', '),
	),
	fieldHint(
		'shipment',
		'Shipment',
		[
			fc('id'), fc('shipmentNumber'), fc('status'),
			fc('createdDate'), fc('lastModifiedDate'), fc('deliveryDate'),
			fc('warehouseId'), fc('shipmentMethodId'),
			fc('shippingCarrierId'), fc('shippingReturnCarrierId'),
			fc('recipientPartyId'), fc('mainSalesOrderId'),
			fc('packageTrackingNumber'), fc('packageReturnTrackingNumber'),
			fc('declaredValueAmount'), fc('responsibleUserId'),
			fc('description'), fc('recordComment'), fc('version'),
		].join(', '),
	),
	fieldHint(
		'currency',
		'Currency',
		[fc('id'), fc('name'), fc('currencySymbol'), fc('createdDate'), fc('lastModifiedDate')].join(', '),
	),
	fieldHint(
		'manufacturer',
		'Manufacturer',
		[
			fc('id'), fc('name'), fc('active'), fc('email'),
			fc('createdDate'), fc('lastModifiedDate'), fc('version'),
		].join(', '),
	),
	fieldHint(
		'variantArticle',
		'Variant Article',
		[
			fc('id'), fc('variantArticleNumber'), fc('variantArticleName'), fc('primaryArticleId'),
			fc('createdDate'), fc('lastModifiedDate'), fc('version'),
		].join(', '),
	),
];

export class WeclappTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Weclapp Trigger',
		name: 'weclappTrigger',
		icon: 'file:weclapp.svg',
		group: ['trigger'],
		version: 1,
		description: 'Starts the workflow when a Weclapp event occurs',
		defaults: {
			name: 'Weclapp Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'weclappApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		hints: ENTITY_HINTS,
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Accounting Transaction', value: 'accountingTransaction' },
					{ name: 'Article', value: 'article' },
					{ name: 'Article Category', value: 'articleCategory' },
					{ name: 'Comment', value: 'comment' },
					{ name: 'Currency', value: 'currency' },
					{ name: 'Document', value: 'document' },
					{ name: 'Incoming Goods', value: 'incomingGoods' },
					{ name: 'Manufacturer', value: 'manufacturer' },
					{ name: 'Party (Customer / Contact)', value: 'party' },
					{ name: 'Purchase Invoice', value: 'purchaseInvoice' },
					{ name: 'Purchase Order', value: 'purchaseOrder' },
					{ name: 'Quotation', value: 'quotation' },
					{ name: 'Sales Invoice', value: 'salesInvoice' },
					{ name: 'Sales Open Item', value: 'salesOpenItem' },
					{ name: 'Sales Order', value: 'salesOrder' },
					{ name: 'Shipment', value: 'shipment' },
					{ name: 'Variant Article', value: 'variantArticle' },
				],
				default: 'party',
				description: 'The Weclapp entity type to watch',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: [
					{ name: 'Created', value: 'create' },
					{ name: 'Updated', value: 'update' },
					{ name: 'Deleted', value: 'delete' },
				],
				default: ['create', 'update', 'delete'],
				required: true,
				description: 'Which Weclapp events trigger this workflow',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const staticData = this.getWorkflowStaticData('node');
				const webhookId = staticData.webhookId as string | undefined;
				if (!webhookId) return false;

				const result = await weclappRequest(this, 'GET', `/webhook/id/${webhookId}`);
				return result !== null;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const resource = this.getNodeParameter('resource') as string;
				const events = this.getNodeParameter('events') as string[];
				const webhookUrl = this.getNodeWebhookUrl('default') as string;

				const body: IDataObject = {
					entityName: resource,
					url: webhookUrl,
					atCreate: events.includes('create'),
					atUpdate: events.includes('update'),
					atDelete: events.includes('delete'),
				};

				const response = await weclappRequest(this, 'POST', '/webhook', body);
				if (!response?.id) return false;

				const staticData = this.getWorkflowStaticData('node');
				staticData.webhookId = response.id as string;
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const staticData = this.getWorkflowStaticData('node');
				const webhookId = staticData.webhookId as string | undefined;
				if (!webhookId) return true;

				try {
					await weclappRequest(this, 'DELETE', `/webhook/id/${webhookId}`);
				} catch {
					// Webhook may have been manually deleted in Weclapp; allow deactivation to complete.
				}
				delete staticData.webhookId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData() as IDataObject | null;

		if (!body || Object.keys(body).length === 0) {
			return { workflowData: [[]] };
		}

		return { workflowData: [this.helpers.returnJsonArray([body])] };
	}
}
