import {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
	IN8nHttpFullResponse,
	JsonObject,
	NodeApiError,
} from 'n8n-workflow';

export interface WeclappBinaryResponse {
	buffer: Buffer;
	contentType: string;
	contentDisposition: string;
}

type WeclappContext =
	| IExecuteFunctions
	| ILoadOptionsFunctions
	| IHookFunctions
	| IWebhookFunctions;

export type QueryParamPairs = Array<[string, string | number]>;

/**
 * weclapp returns RFC 7807 error bodies (detail / title / validationErrors).
 * n8n's NodeApiError doesn't understand those fields and falls back to a
 * generic "Bad request - please check your parameters" message, hiding the
 * real cause. This extracts a human-readable message + description so the
 * actual weclapp error (and the offending parameter) is shown.
 */
function weclappErrorOptions(
	body: unknown,
	statusCode: number,
): { httpCode: string; message?: string; description?: string } {
	const httpCode = String(statusCode);
	if (!body || typeof body !== 'object') return { httpCode };

	const b = body as IDataObject;
	const main =
		(typeof b.detail === 'string' && b.detail) ||
		(typeof b.title === 'string' && b.title) ||
		(typeof b.error === 'string' && b.error) ||
		'';

	let description: string | undefined;
	const validationErrors = b.validationErrors;
	if (Array.isArray(validationErrors) && validationErrors.length > 0) {
		description = validationErrors
			.map((v) => {
				const entry = v as IDataObject;
				const location = typeof entry.location === 'string' ? `${entry.location}: ` : '';
				const text =
					(typeof entry.detail === 'string' && entry.detail) ||
					(typeof entry.title === 'string' && entry.title) ||
					'';
				return `${location}${text}`.trim();
			})
			.filter(Boolean)
			.join('; ');
	}

	return {
		httpCode,
		...(main ? { message: `weclapp: ${main}` } : {}),
		...(description ? { description } : {}),
	};
}

/**
 * Builds a query string from an ordered list of key/value pairs and appends it
 * to the given endpoint. Unlike a plain object, this preserves duplicate keys,
 * which weclapp requires for OR groups (e.g. `orGroup1-name-eq=a&orGroup1-name-eq=b`).
 */
export function appendQuery(endpoint: string, pairs: QueryParamPairs): string {
	const search = new URLSearchParams();
	for (const [key, value] of pairs) {
		search.append(key, String(value));
	}
	const query = search.toString();
	return query ? `${endpoint}?${query}` : endpoint;
}

export async function weclappRequest(
	context: WeclappContext,
	method: IHttpRequestOptions['method'],
	endpoint: string,
	body?: IDataObject | IDataObject[],
	qs?: IDataObject,
): Promise<IDataObject | null> {
	const credentials = await context.getCredentials('weclappApi');
	const baseUrl = `https://${credentials.subdomain}.weclapp.com/webapp/api/v2`;

	const hasBody = Array.isArray(body)
		? body.length > 0
		: body !== undefined && Object.keys(body).length > 0;

	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${endpoint}`,
		headers: {
			...(hasBody ? { 'Content-Type': 'application/json' } : {}),
		},
		...(qs && Object.keys(qs).length > 0 ? { qs } : {}),
		...(hasBody ? { body: body as IDataObject } : {}),
		returnFullResponse: true,
		ignoreHttpStatusErrors: true,
	};

	let response: IN8nHttpFullResponse;
	try {
		response = (await context.helpers.httpRequestWithAuthentication.call(
			context,
			'weclappApi',
			options,
		)) as IN8nHttpFullResponse;
	} catch (error) {
		throw new NodeApiError(context.getNode(), error as JsonObject);
	}

	if (response.statusCode === 404) {
		return null;
	}

	if (response.statusCode >= 400) {
		throw new NodeApiError(
			context.getNode(),
			response.body as JsonObject,
			weclappErrorOptions(response.body, response.statusCode),
		);
	}

	return response.body as IDataObject;
}

export async function weclappRequestAll(
	context: WeclappContext,
	endpoint: string,
	pairs: QueryParamPairs = [],
): Promise<IDataObject[]> {
	const PAGE_SIZE = 1000;
	const records: IDataObject[] = [];
	let page = 1;

	while (true) {
		const url = appendQuery(endpoint, [...pairs, ['page', page], ['pageSize', PAGE_SIZE]]);
		const result = await weclappRequest(context, 'GET', url);
		const batch = ((result as IDataObject)?.result as IDataObject[]) ?? [];
		records.push(...batch);
		if (batch.length < PAGE_SIZE) break;
		page++;
	}

	return records;
}

export async function weclappBinaryRequest(
	context: WeclappContext,
	endpoint: string,
	qs?: IDataObject,
): Promise<WeclappBinaryResponse | null> {
	const credentials = await context.getCredentials('weclappApi');
	const baseUrl = `https://${credentials.subdomain}.weclapp.com/webapp/api/v2`;

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `${baseUrl}${endpoint}`,
		headers: {},
		...(qs && Object.keys(qs).length > 0 ? { qs } : {}),
		returnFullResponse: true,
		ignoreHttpStatusErrors: true,
		encoding: 'arraybuffer',
	};

	let response: IN8nHttpFullResponse;
	try {
		response = (await context.helpers.httpRequestWithAuthentication.call(
			context,
			'weclappApi',
			options,
		)) as IN8nHttpFullResponse;
	} catch (error) {
		throw new NodeApiError(context.getNode(), error as JsonObject);
	}

	if (response.statusCode === 404) {
		return null;
	}

	if (response.statusCode >= 400) {
		throw new NodeApiError(
			context.getNode(),
			response.body as JsonObject,
			weclappErrorOptions(response.body, response.statusCode),
		);
	}

	const headers = response.headers as Record<string, string>;
	const rawBody = response.body as ArrayBuffer | Buffer;
	return {
		buffer: Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody),
		contentType: headers['content-type'] ?? 'application/octet-stream',
		contentDisposition: headers['content-disposition'] ?? '',
	};
}
