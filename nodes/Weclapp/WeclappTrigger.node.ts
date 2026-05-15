import {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';

import { weclappRequest } from './transport/request';

export class WeclappTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Weclapp Trigger',
		name: 'weclappTrigger',
		icon: 'fa:plug',
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
		hints: [
			{
				message:
					'No data yet — <a href="https://docs.n8n.io/workflows/executions/debug/" target="_blank">pin a test payload</a> '
					+ 'on this node to enable field autocompletion in downstream nodes (IF, Switch, Set, etc.).<br/>'
					+ '<strong>Shipment fields:</strong> '
					+ '<code>id</code>, <code>shipmentNumber</code>, <code>status</code>, '
					+ '<code>createdDate</code>, <code>lastModifiedDate</code>, '
					+ '<code>deliveryDate</code>, <code>warehouseId</code>, <code>shipmentMethodId</code>, '
					+ '<code>shippingCarrierId</code>, <code>shippingReturnCarrierId</code>, '
					+ '<code>recipientPartyId</code>, <code>mainSalesOrderId</code>, '
					+ '<code>packageTrackingNumber</code>, <code>packageReturnTrackingNumber</code>, '
					+ '<code>declaredValueAmount</code>, <code>responsibleUserId</code>, '
					+ '<code>description</code>, <code>recordComment</code>, <code>version</code>',
				type: 'info',
				location: 'outputPane',
				whenToDisplay: 'beforeExecution',
				displayCondition: '={{ $parameter.resource === "shipment" }}',
			},
		],
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
