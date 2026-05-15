import {
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	ResourceMapperFields,
	ResourceMapperValue,
} from 'n8n-workflow';

import { weclappRequest } from './transport/request';
import {
	getByIdFields,
	operationOptions,
	READ_ONLY_RESOURCES,
	resourceOptions,
	searchFields,
} from './descriptions/shared';
import { partyCreateUpdateFields } from './descriptions/party';
import {
	quotationCreateUpdateFields,
	SALES_ENTITY_DATE_FIELDS,
	SALES_ENTITY_RESOURCES,
	salesInvoiceCreateUpdateFields,
	salesOpenItemCreateUpdateFields,
	salesOrderCreateUpdateFields,
} from './descriptions/salesEntities';
import * as loadOptionsMethods from './methods/loadOptions';
import {
	buildWeclappCustomAttributes,
	getCustomAttributesForParty,
	getCustomAttributesForQuotation,
	getCustomAttributesForSalesInvoice,
	getCustomAttributesForSalesOpenItem,
	getCustomAttributesForSalesOrder,
} from './methods/customAttributes';

function convertDateFieldsToMs(body: IDataObject, resource: string): void {
	const fields = SALES_ENTITY_DATE_FIELDS[resource] ?? [];
	for (const field of fields) {
		const val = body[field];
		if (typeof val === 'string' && val) {
			const ms = new Date(val).getTime();
			if (!isNaN(ms)) body[field] = ms;
		}
	}
}

function parseCustomQuery(raw: string): IDataObject {
	const params: IDataObject = {};
	for (const pair of raw.split('&')) {
		const eqIdx = pair.indexOf('=');
		if (eqIdx === -1) continue;
		const key = pair.slice(0, eqIdx).trim();
		const value = pair.slice(eqIdx + 1).trim();
		if (key) params[key] = value;
	}
	return params;
}

export class Weclapp implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Weclapp',
		name: 'weclapp',
		icon: 'fa:plug',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Weclapp ERP/CRM API',
		defaults: {
			name: 'Weclapp',
		},
		usableAsTool: true,
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'weclappApi',
				required: true,
			},
		],
		properties: [
			resourceOptions,
			operationOptions,
			...getByIdFields,
			...searchFields,
			...partyCreateUpdateFields,
			...salesOrderCreateUpdateFields,
			...salesInvoiceCreateUpdateFields,
			...salesOpenItemCreateUpdateFields,
			...quotationCreateUpdateFields,
		],
	};

	methods = {
		loadOptions: loadOptionsMethods as Record<string, (this: ILoadOptionsFunctions) => Promise<INodePropertyOptions[]>>,
		resourceMapping: {
			getCustomAttributesForParty: getCustomAttributesForParty as (this: ILoadOptionsFunctions) => Promise<ResourceMapperFields>,
			getCustomAttributesForSalesOrder: getCustomAttributesForSalesOrder as (this: ILoadOptionsFunctions) => Promise<ResourceMapperFields>,
			getCustomAttributesForSalesInvoice: getCustomAttributesForSalesInvoice as (this: ILoadOptionsFunctions) => Promise<ResourceMapperFields>,
			getCustomAttributesForSalesOpenItem: getCustomAttributesForSalesOpenItem as (this: ILoadOptionsFunctions) => Promise<ResourceMapperFields>,
			getCustomAttributesForQuotation: getCustomAttributesForQuotation as (this: ILoadOptionsFunctions) => Promise<ResourceMapperFields>,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		if (READ_ONLY_RESOURCES.includes(resource) && (operation === 'create' || operation === 'update')) {
			throw new NodeOperationError(
				this.getNode(),
				`The "${resource}" resource does not support ${operation}.`,
			);
		}

		for (let i = 0; i < items.length; i++) {
			try {
				// ── Get by ID ──────────────────────────────────────────────────────────
				if (operation === 'getById') {
					const id = this.getNodeParameter('id', i) as string;
					if (!id) throw new NodeOperationError(this.getNode(), 'Record ID is required for the Get by ID operation.', { itemIndex: i });
					const result = await weclappRequest(this, 'GET', `/${resource}/id/${encodeURIComponent(id)}`);
					returnData.push({ json: result ?? {}, pairedItem: { item: i } });

				// ── Search ─────────────────────────────────────────────────────────────
				} else if (operation === 'search') {
					const customQuery = this.getNodeParameter('customQuery', i, '') as string;
					const page = this.getNodeParameter('page', i, 1) as number;
					const pageSize = this.getNodeParameter('pageSize', i, 100) as number;
					const sort = this.getNodeParameter('sort', i, '-lastModifiedDate') as string;

					const qs: IDataObject = {
						page,
						pageSize,
						sort,
						...(customQuery ? parseCustomQuery(customQuery) : {}),
					};

					const result = await weclappRequest(this, 'GET', `/${resource}`, undefined, qs);
					const records = ((result as IDataObject)?.result as IDataObject[]) ?? [];

					for (const record of records) {
						returnData.push({ json: record, pairedItem: { item: i } });
					}

				// ── Create ─────────────────────────────────────────────────────────────
				} else if (operation === 'create') {
					const body = this.getNodeParameter('createFields', i, {}) as IDataObject;
					if (resource === 'party' || SALES_ENTITY_RESOURCES.includes(resource)) {
						const customAttrsRMV = this.getNodeParameter('customAttributes', i, null) as ResourceMapperValue | null;
						const customAttrs = buildWeclappCustomAttributes(customAttrsRMV ?? { value: null });
						if (customAttrs.length > 0) body.customAttributes = customAttrs;
					}
					convertDateFieldsToMs(body, resource);
					const result = await weclappRequest(this, 'POST', `/${resource}`, body, {
						ignoreMissingProperties: true,
					});
					returnData.push({ json: result ?? {}, pairedItem: { item: i } });

				// ── Update ─────────────────────────────────────────────────────────────
				} else if (operation === 'update') {
					const id = this.getNodeParameter('id', i) as string;
					if (!id) throw new NodeOperationError(this.getNode(), 'Record ID is required for the Update operation.', { itemIndex: i });
					const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
					if (resource === 'party' || SALES_ENTITY_RESOURCES.includes(resource)) {
						const customAttrsRMV = this.getNodeParameter('customAttributes', i, null) as ResourceMapperValue | null;
						const customAttrs = buildWeclappCustomAttributes(customAttrsRMV ?? { value: null });
						if (customAttrs.length > 0) body.customAttributes = customAttrs;
					}
					convertDateFieldsToMs(body, resource);
					const result = await weclappRequest(
						this, 'PUT', `/${resource}/id/${encodeURIComponent(id)}`, body,
						{ ignoreMissingProperties: true },
					);
					returnData.push({ json: result ?? {}, pairedItem: { item: i } });

				} else {
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
						itemIndex: i,
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
