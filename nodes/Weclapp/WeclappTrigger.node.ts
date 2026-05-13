import {
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';

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
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Party (Customer / Contact)', value: 'party' },
				],
				default: 'party',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData();
		return { workflowData: [this.helpers.returnJsonArray([body])] };
	}
}
