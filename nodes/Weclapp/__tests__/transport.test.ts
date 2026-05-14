import { NodeApiError } from 'n8n-workflow';
import { weclappRequest } from '../transport/request';

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
