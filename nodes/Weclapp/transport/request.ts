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

type WeclappContext =
	| IExecuteFunctions
	| ILoadOptionsFunctions
	| IHookFunctions
	| IWebhookFunctions;

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
		throw new NodeApiError(context.getNode(), response.body as JsonObject, {
			httpCode: String(response.statusCode),
		});
	}

	return response.body as IDataObject;
}
