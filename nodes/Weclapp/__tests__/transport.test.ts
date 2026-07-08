import { NodeApiError } from 'n8n-workflow';
import { weclappRequest, weclappRequestAll } from '../transport/request';

function makeContext(response: { statusCode: number; body: unknown } = { statusCode: 200, body: {} }) {
	const mockHttpRequest = jest.fn().mockResolvedValue(response);
	const ctx = {
		getCredentials: jest.fn().mockResolvedValue({ subdomain: 'acme' }),
		helpers: { httpRequestWithAuthentication: mockHttpRequest },
		getNode: jest.fn().mockReturnValue({
			id: 'n1',
			name: 'Weclapp',
			type: 'Weclapp',
			typeVersion: 1,
			position: [0, 0] as [number, number],
			parameters: {},
		}),
	} as unknown as Parameters<typeof weclappRequest>[0];
	return { ctx, mockHttpRequest };
}

describe('weclappRequest', () => {
	it('constructs the URL from subdomain and endpoint', async () => {
		const { ctx, mockHttpRequest } = makeContext();
		await weclappRequest(ctx, 'GET', '/party');
		const opts = mockHttpRequest.mock.calls[0][1] as { url: string };
		expect(opts.url).toBe('https://acme.weclapp.com/webapp/api/v2/party');
	});

	it('returns null for a 404 response', async () => {
		const { ctx } = makeContext({ statusCode: 404, body: null });
		const result = await weclappRequest(ctx, 'GET', '/party');
		expect(result).toBeNull();
	});

	it('throws NodeApiError for a 422 response', async () => {
		const { ctx } = makeContext({ statusCode: 422, body: { message: 'Validation failed' } });
		await expect(weclappRequest(ctx, 'POST', '/party', { name: 'Test' })).rejects.toBeInstanceOf(NodeApiError);
	});

	it('includes Content-Type when a non-empty body is provided', async () => {
		const { ctx, mockHttpRequest } = makeContext();
		await weclappRequest(ctx, 'POST', '/party', { name: 'Test' });
		const opts = mockHttpRequest.mock.calls[0][1] as { headers: Record<string, string> };
		expect(opts.headers).toHaveProperty('Content-Type', 'application/json');
	});

	it('omits Content-Type when no body is provided', async () => {
		const { ctx, mockHttpRequest } = makeContext();
		await weclappRequest(ctx, 'GET', '/party');
		const opts = mockHttpRequest.mock.calls[0][1] as { headers: Record<string, string> };
		expect(opts.headers).not.toHaveProperty('Content-Type');
	});
});

describe('weclappRequestAll', () => {
	it('returns all records when a single page has fewer than 1000 items', async () => {
		const records = [{ id: '1' }, { id: '2' }];
		const { ctx } = makeContext({ statusCode: 200, body: { result: records } });
		const result = await weclappRequestAll(ctx, '/shipment');
		expect(result.records).toEqual(records);
		expect(result.referencedEntities).toBeUndefined();
	});

	it('fetches multiple pages until a short page is received', async () => {
		const page1 = Array.from({ length: 1000 }, (_, i) => ({ id: String(i) }));
		const page2 = [{ id: '1000' }, { id: '1001' }];
		const mockHttpRequest = jest.fn()
			.mockResolvedValueOnce({ statusCode: 200, body: { result: page1 } })
			.mockResolvedValueOnce({ statusCode: 200, body: { result: page2 } });
		const ctx = {
			getCredentials: jest.fn().mockResolvedValue({ subdomain: 'acme' }),
			helpers: { httpRequestWithAuthentication: mockHttpRequest },
			getNode: jest.fn().mockReturnValue({
				id: 'n1', name: 'Weclapp', type: 'Weclapp', typeVersion: 1,
				position: [0, 0] as [number, number], parameters: {},
			}),
		} as unknown as Parameters<typeof weclappRequest>[0];

		const result = await weclappRequestAll(ctx, '/shipment');
		expect(result.records).toHaveLength(1002);
		expect(mockHttpRequest).toHaveBeenCalledTimes(2);
	});

	it('passes page and pageSize=1000 on each request', async () => {
		const page1 = Array.from({ length: 1000 }, (_, i) => ({ id: String(i) }));
		const page2: unknown[] = [];
		const mockHttpRequest = jest.fn()
			.mockResolvedValueOnce({ statusCode: 200, body: { result: page1 } })
			.mockResolvedValueOnce({ statusCode: 200, body: { result: page2 } });
		const ctx = {
			getCredentials: jest.fn().mockResolvedValue({ subdomain: 'acme' }),
			helpers: { httpRequestWithAuthentication: mockHttpRequest },
			getNode: jest.fn().mockReturnValue({
				id: 'n1', name: 'Weclapp', type: 'Weclapp', typeVersion: 1,
				position: [0, 0] as [number, number], parameters: {},
			}),
		} as unknown as Parameters<typeof weclappRequest>[0];

		await weclappRequestAll(ctx, '/shipment');
		const call1Url = (mockHttpRequest.mock.calls[0][1] as { url: string }).url;
		const call2Url = (mockHttpRequest.mock.calls[1][1] as { url: string }).url;
		expect(call1Url).toContain('page=1');
		expect(call1Url).toContain('pageSize=1000');
		expect(call2Url).toContain('page=2');
		expect(call2Url).toContain('pageSize=1000');
	});

	it('returns an empty array when the first page is empty', async () => {
		const { ctx } = makeContext({ statusCode: 200, body: { result: [] } });
		const result = await weclappRequestAll(ctx, '/shipment');
		expect(result.records).toEqual([]);
	});

	it('forwards extra query params to every page request', async () => {
		const { ctx, mockHttpRequest } = makeContext({ statusCode: 200, body: { result: [{ id: '1' }] } });
		await weclappRequestAll(ctx, '/shipment', [['sort', '-createdDate'], ['status-eq', 'SENT']]);
		const url = (mockHttpRequest.mock.calls[0][1] as { url: string }).url;
		expect(url).toContain('sort=-createdDate');
		expect(url).toContain('status-eq=SENT');
		expect(url).toContain('page=1');
		expect(url).toContain('pageSize=1000');
	});

	it('collects and de-duplicates referencedEntities across pages', async () => {
		const page1 = Array.from({ length: 1000 }, (_, i) => ({ id: String(i) }));
		const page2 = [{ id: '1000' }];
		const mockHttpRequest = jest.fn()
			.mockResolvedValueOnce({
				statusCode: 200,
				body: { result: page1, referencedEntities: { unit: [{ id: 'u1', name: 'Stk.' }] } },
			})
			.mockResolvedValueOnce({
				statusCode: 200,
				body: {
					result: page2,
					referencedEntities: { unit: [{ id: 'u1', name: 'Stk.' }, { id: 'u2', name: 'kg' }] },
				},
			});
		const ctx = {
			getCredentials: jest.fn().mockResolvedValue({ subdomain: 'acme' }),
			helpers: { httpRequestWithAuthentication: mockHttpRequest },
			getNode: jest.fn().mockReturnValue({
				id: 'n1', name: 'Weclapp', type: 'Weclapp', typeVersion: 1,
				position: [0, 0] as [number, number], parameters: {},
			}),
		} as unknown as Parameters<typeof weclappRequest>[0];

		const result = await weclappRequestAll(ctx, '/article');
		expect(result.records).toHaveLength(1001);
		expect(result.referencedEntities).toEqual({
			unit: [{ id: 'u1', name: 'Stk.' }, { id: 'u2', name: 'kg' }],
		});
	});

	it('preserves duplicate keys for OR groups', async () => {
		const { ctx, mockHttpRequest } = makeContext({ statusCode: 200, body: { result: [{ id: '1' }] } });
		await weclappRequestAll(ctx, '/shipment', [
			['orGroup1-status-eq', 'CANCELLED'],
			['orGroup1-status-eq', 'INCOMING_CANCELLED'],
		]);
		const url = (mockHttpRequest.mock.calls[0][1] as { url: string }).url;
		expect(url).toContain('orGroup1-status-eq=CANCELLED');
		expect(url).toContain('orGroup1-status-eq=INCOMING_CANCELLED');
	});
});
