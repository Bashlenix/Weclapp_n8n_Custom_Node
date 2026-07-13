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
 * Result of a paginated query. `referencedEntities` is only present when the
 * request used `includeReferencedEntities` and weclapp returned the extra
 * top-level object described in the API docs. `additionalProperties` is only
 * present when the request used `additionalProperties`; weclapp returns it as
 * `{ propertyName: value[] }` where each value's index aligns with the entity
 * at the same index in `records`.
 */
export interface WeclappQueryResult {
	records: IDataObject[];
	referencedEntities?: IDataObject;
	additionalProperties?: IDataObject;
}

/**
 * weclapp returns referenced entities as `{ entityName: Entity[] }`. When paging
 * we accumulate them across pages, de-duplicating by `id` so the same referenced
 * record isn't repeated.
 */
function mergeReferencedEntities(target: IDataObject, source: unknown): void {
	if (!source || typeof source !== 'object') return;
	for (const [entityName, entities] of Object.entries(source as IDataObject)) {
		if (!Array.isArray(entities)) continue;
		const existing = (target[entityName] as IDataObject[] | undefined) ?? [];
		const seen = new Set(
			existing.map((e) => (e as IDataObject).id).filter((id) => id !== undefined),
		);
		for (const entity of entities as IDataObject[]) {
			const id = entity?.id;
			if (id !== undefined && seen.has(id)) continue;
			if (id !== undefined) seen.add(id);
			existing.push(entity);
		}
		target[entityName] = existing;
	}
}

/**
 * weclapp returns additional properties as `{ propertyName: value[] }`, where
 * each value's index aligns with the entity at the same index in the page's
 * `result`. When paging we concatenate the arrays in page order so the combined
 * arrays stay index-aligned with the combined records.
 */
function mergeAdditionalProperties(target: IDataObject, source: unknown): void {
	if (!source || typeof source !== 'object') return;
	for (const [propertyName, values] of Object.entries(source as IDataObject)) {
		if (!Array.isArray(values)) continue;
		const existing = (target[propertyName] as unknown[] | undefined) ?? [];
		existing.push(...values);
		target[propertyName] = existing;
	}
}

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

	// weclapp may return text/plain error bodies (see API docs), which n8n does
	// not JSON-parse. Try to parse a string body as JSON first; if that fails,
	// use the raw plain-text string as the message so the real cause is shown.
	let parsed: unknown = body;
	if (typeof body === 'string') {
		const trimmed = body.trim();
		if (!trimmed) return { httpCode };
		try {
			parsed = JSON.parse(trimmed);
		} catch {
			return { httpCode, message: `weclapp: ${trimmed}` };
		}
	}

	if (!parsed || typeof parsed !== 'object') return { httpCode };

	const b = parsed as IDataObject;
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

	// weclapp often leaves the top-level RFC 7807 fields empty and only fills
	// validationErrors. Fall back to those so the message isn't the generic one.
	const message = main || description;

	return {
		httpCode,
		...(message ? { message: `weclapp: ${message}` } : {}),
		...(main && description ? { description } : {}),
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
): Promise<WeclappQueryResult> {
	const PAGE_SIZE = 1000;
	const records: IDataObject[] = [];
	const referencedEntities: IDataObject = {};
	let hasReferencedEntities = false;
	const additionalProperties: IDataObject = {};
	let hasAdditionalProperties = false;
	let page = 1;

	while (true) {
		const url = appendQuery(endpoint, [...pairs, ['page', page], ['pageSize', PAGE_SIZE]]);
		const result = await weclappRequest(context, 'GET', url);
		const batch = ((result as IDataObject)?.result as IDataObject[]) ?? [];
		records.push(...batch);

		const refs = (result as IDataObject)?.referencedEntities;
		if (refs && typeof refs === 'object') {
			hasReferencedEntities = true;
			mergeReferencedEntities(referencedEntities, refs);
		}

		const addl = (result as IDataObject)?.additionalProperties;
		if (addl && typeof addl === 'object') {
			hasAdditionalProperties = true;
			mergeAdditionalProperties(additionalProperties, addl);
		}

		if (batch.length < PAGE_SIZE) break;
		page++;
	}

	return {
		records,
		...(hasReferencedEntities ? { referencedEntities } : {}),
		...(hasAdditionalProperties ? { additionalProperties } : {}),
	};
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
