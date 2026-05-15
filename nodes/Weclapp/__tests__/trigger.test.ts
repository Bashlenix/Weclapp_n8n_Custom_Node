import { IHookFunctions, IWebhookFunctions } from 'n8n-workflow';
import { WeclappTrigger } from '../WeclappTrigger.node';
import { weclappRequest } from '../transport/request';

jest.mock('../transport/request');
const mockRequest = weclappRequest as jest.MockedFunction<typeof weclappRequest>;

const mockNode = {
	id: 'n1',
	name: 'Weclapp Trigger',
	type: 'weclappTrigger',
	typeVersion: 1,
	position: [0, 0] as [number, number],
	parameters: {},
};

function makeHookContext(staticData: Record<string, unknown> = {}): IHookFunctions {
	return {
		getWorkflowStaticData: jest.fn().mockReturnValue(staticData),
		getNodeParameter: jest.fn(),
		getNodeWebhookUrl: jest.fn().mockReturnValue('https://n8n.example.com/webhook/abc123'),
		getNode: jest.fn().mockReturnValue(mockNode),
		helpers: {},
	} as unknown as IHookFunctions;
}

function makeWebhookContext(body: unknown): IWebhookFunctions {
	return {
		getBodyData: jest.fn().mockReturnValue(body),
		getNode: jest.fn().mockReturnValue(mockNode),
		helpers: {
			returnJsonArray: jest.fn((items: unknown[]) =>
				items.map((item) => ({ json: item, pairedItem: { item: 0 } })),
			),
		},
	} as unknown as IWebhookFunctions;
}

const trigger = new WeclappTrigger();

describe('WeclappTrigger', () => {
	beforeEach(() => jest.clearAllMocks());

	describe('description', () => {
		it('has all 14 Phase-1 resource options', () => {
			const values = trigger.description.properties
				.find((p) => p.name === 'resource')
				?.options?.map((o) => (o as { value: string }).value);
			expect(values).toHaveLength(14);
			expect(values).toContain('party');
			expect(values).toContain('salesOrder');
			expect(values).toContain('accountingTransaction');
		});

		it('has events multiOptions with Created, Updated, Deleted', () => {
			const events = trigger.description.properties.find((p) => p.name === 'events');
			expect(events?.type).toBe('multiOptions');
			const vals = events?.options?.map((o) => (o as { value: string }).value);
			expect(vals).toEqual(expect.arrayContaining(['create', 'update', 'delete']));
		});
	});

	describe('webhookMethods.default.checkExists', () => {
		it('returns false and skips API call when no webhookId stored', async () => {
			const ctx = makeHookContext({});
			const result = await trigger.webhookMethods.default.checkExists.call(ctx);
			expect(result).toBe(false);
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it('returns true when stored webhookId resolves via GET', async () => {
			const ctx = makeHookContext({ webhookId: 'wh-1' });
			mockRequest.mockResolvedValue({ id: 'wh-1', entityName: 'party' });
			const result = await trigger.webhookMethods.default.checkExists.call(ctx);
			expect(result).toBe(true);
			expect(mockRequest).toHaveBeenCalledWith(ctx, 'GET', '/webhook/id/wh-1');
		});

		it('returns false when GET returns null (webhook not found in Weclapp)', async () => {
			const ctx = makeHookContext({ webhookId: 'wh-missing' });
			mockRequest.mockResolvedValue(null);
			const result = await trigger.webhookMethods.default.checkExists.call(ctx);
			expect(result).toBe(false);
		});
	});

	describe('webhookMethods.default.create', () => {
		it('posts correct body and stores the returned webhook id', async () => {
			const staticData: Record<string, unknown> = {};
			const ctx = makeHookContext(staticData);
			(ctx.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('party')
				.mockReturnValueOnce(['create', 'update']);
			mockRequest.mockResolvedValue({ id: 'wh-99' });

			const result = await trigger.webhookMethods.default.create.call(ctx);

			expect(result).toBe(true);
			expect(mockRequest).toHaveBeenCalledWith(ctx, 'POST', '/webhook', {
				entityName: 'party',
				url: 'https://n8n.example.com/webhook/abc123',
				atCreate: true,
				atUpdate: true,
				atDelete: false,
			});
			expect(staticData.webhookId).toBe('wh-99');
		});

		it('sets atDelete true when delete event selected', async () => {
			const ctx = makeHookContext({});
			(ctx.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('salesOrder')
				.mockReturnValueOnce(['delete']);
			mockRequest.mockResolvedValue({ id: 'wh-10' });

			await trigger.webhookMethods.default.create.call(ctx);

			const body = mockRequest.mock.calls[0][3] as Record<string, unknown>;
			expect(body.atCreate).toBe(false);
			expect(body.atUpdate).toBe(false);
			expect(body.atDelete).toBe(true);
		});

		it('returns false when API returns no id', async () => {
			const ctx = makeHookContext({});
			(ctx.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('salesOrder')
				.mockReturnValueOnce(['create']);
			mockRequest.mockResolvedValue({});

			const result = await trigger.webhookMethods.default.create.call(ctx);
			expect(result).toBe(false);
		});
	});

	describe('webhookMethods.default.delete', () => {
		it('returns true immediately when no webhookId is stored', async () => {
			const ctx = makeHookContext({});
			const result = await trigger.webhookMethods.default.delete.call(ctx);
			expect(result).toBe(true);
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it('calls DELETE with stored id and removes it from static data', async () => {
			const staticData: Record<string, unknown> = { webhookId: 'wh-5' };
			const ctx = makeHookContext(staticData);
			mockRequest.mockResolvedValue(null);

			const result = await trigger.webhookMethods.default.delete.call(ctx);

			expect(result).toBe(true);
			expect(mockRequest).toHaveBeenCalledWith(ctx, 'DELETE', '/webhook/id/wh-5');
			expect(staticData.webhookId).toBeUndefined();
		});

		it('returns true even when DELETE throws (webhook already deleted in Weclapp)', async () => {
			const staticData: Record<string, unknown> = { webhookId: 'wh-gone' };
			const ctx = makeHookContext(staticData);
			mockRequest.mockRejectedValue(new Error('Connection failed'));

			const result = await trigger.webhookMethods.default.delete.call(ctx);

			expect(result).toBe(true);
			expect(staticData.webhookId).toBeUndefined();
		});
	});

	describe('webhook', () => {
		it('passes payload body to workflowData', async () => {
			const body = { id: '123', entityName: 'party', createdDate: 1700000000000 };
			const ctx = makeWebhookContext(body);

			const result = await trigger.webhook.call(ctx);

			expect(result.workflowData!.length).toBe(1);
			expect(result.workflowData![0][0].json).toEqual(body);
		});

		it('returns empty workflowData for an empty ping payload', async () => {
			const ctx = makeWebhookContext({});
			const result = await trigger.webhook.call(ctx);
			expect(result.workflowData).toEqual([[]]);
		});

		it('returns empty workflowData when body is null', async () => {
			const ctx = makeWebhookContext(null);
			const result = await trigger.webhook.call(ctx);
			expect(result.workflowData).toEqual([[]]);
		});
	});
});
