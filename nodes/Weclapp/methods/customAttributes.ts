import {
	IDataObject,
	ILoadOptionsFunctions,
	INodeProperties,
	INodePropertyOptions,
	ResourceMapperField,
	ResourceMapperFields,
} from 'n8n-workflow';
import { weclappRequest } from '../transport/request';

export type WeclappAttributeType =
	| 'BOOLEAN'
	| 'DATE'
	| 'DECIMAL'
	| 'ENTITY'
	| 'INTEGER'
	| 'LARGE_TEXT'
	| 'LIST'
	| 'MULTISELECT_LIST'
	| 'REFERENCE'
	| 'STRING'
	| 'URL';

export interface WeclappSelectableValue {
	id: string;
	value: string;
}

export interface WeclappCustomAttributeDefinition {
	id: string;
	label: string;
	attributeType: WeclappAttributeType;
	entities: string[];
	groupName?: string;
	selectableValues?: WeclappSelectableValue[];
	attributeEntityType?: string;
}

function buildLabel(attr: WeclappCustomAttributeDefinition): string {
	return attr.groupName ? `${attr.label} (${attr.groupName})` : attr.label;
}

function buildOptions(attr: WeclappCustomAttributeDefinition): INodePropertyOptions[] {
	return (attr.selectableValues ?? []).map(v => ({ name: v.value, value: v.id }));
}

/**
 * Converts a Weclapp custom attribute definition to an n8n INodeProperties descriptor.
 * Pure function — used by unit tests and documentation.
 */
export function attributeDefinitionToNodeProperty(
	attr: WeclappCustomAttributeDefinition,
): INodeProperties {
	const name = `customAttribute${attr.id}`;
	const displayName = buildLabel(attr);

	switch (attr.attributeType) {
		case 'DATE':
			return { displayName, name, type: 'dateTime', default: '' };

		case 'DECIMAL':
		case 'INTEGER':
			return { displayName, name, type: 'number', default: 0 };

		case 'ENTITY':
			return {
				displayName,
				name,
				type: 'number',
				default: 0,
				description: `Must be the ID of entity type: ${attr.attributeEntityType ?? 'unknown'}`,
			};

		case 'BOOLEAN':
			// n8n boolean fields include a text-input expression toggle by default.
			return { displayName, name, type: 'boolean', default: false };

		case 'LIST':
			return {
				displayName,
				name,
				type: 'options',
				default: '',
				options: buildOptions(attr),
			};

		case 'MULTISELECT_LIST':
			return {
				displayName,
				name,
				type: 'multiOptions',
				default: [],
				options: buildOptions(attr),
			};

		default: // STRING, LARGE_TEXT, URL, REFERENCE
			return { displayName, name, type: 'string', default: '' };
	}
}

/**
 * Converts a Weclapp custom attribute definition to a ResourceMapperField for use in the
 * n8n resourceMapper UI. MULTISELECT_LIST is mapped to `string` (comma-separated IDs) because
 * FieldType does not support multiOptions; the `|multiselect` suffix in the id flags this in
 * execute() so the values can be serialised correctly.
 */
export function attributeDefinitionToResourceField(
	attr: WeclappCustomAttributeDefinition,
): ResourceMapperField {
	const isMultiselect = attr.attributeType === 'MULTISELECT_LIST';
	// The |multiselect suffix lets execute() distinguish MULTISELECT_LIST from plain string fields
	// without an extra API call; users never see the id, only the displayName.
	const id = isMultiselect
		? `customAttribute${attr.id}|multiselect`
		: `customAttribute${attr.id}`;
	const displayName = buildLabel(attr);

	const base: ResourceMapperField = {
		id,
		displayName,
		defaultMatch: false,
		required: false,
		display: true,
	};

	switch (attr.attributeType) {
		case 'DATE':
			return { ...base, type: 'dateTime' };

		case 'DECIMAL':
		case 'INTEGER':
		case 'ENTITY':
			return { ...base, type: 'number' };

		case 'BOOLEAN':
			return { ...base, type: 'boolean' };

		case 'LIST':
			return {
				...base,
				type: 'options',
				options: (attr.selectableValues ?? []).map(v => ({ name: v.value, value: v.id })),
			};

		case 'MULTISELECT_LIST':
			// Stored as a comma-separated string of selected-value IDs.
			return { ...base, type: 'string' };

		default:
			return { ...base, type: 'string' };
	}
}

export async function getCustomAttributesForEntity(
	context: ILoadOptionsFunctions,
	entityName: string,
): Promise<WeclappCustomAttributeDefinition[]> {
	try {
		const response = await weclappRequest(context, 'GET', '/customAttributeDefinition', undefined, {
			pageSize: 1000,
		});
		const attrs =
			((response as IDataObject)?.result as WeclappCustomAttributeDefinition[]) ?? [];
		return attrs.filter(a => Array.isArray(a.entities) && a.entities.includes(entityName));
	} catch {
		return [];
	}
}

export async function getCustomAttributesForParty(
	this: ILoadOptionsFunctions,
): Promise<ResourceMapperFields> {
	const attrs = await getCustomAttributesForEntity(this, 'party');
	return { fields: attrs.map(attributeDefinitionToResourceField) };
}

/**
 * Converts a resourceMapper value (from getNodeParameter) into the Weclapp customAttributes
 * array format expected by POST /party and PUT /party/id/{id}.
 */
export function buildWeclappCustomAttributes(rmv: {
	value: { [key: string]: string | number | boolean | null } | null;
	schema?: ResourceMapperField[];
}): IDataObject[] {
	if (!rmv.value) return [];

	return Object.entries(rmv.value).flatMap(([fieldId, fieldValue]) => {
		if (fieldValue === null || fieldValue === undefined) return [];

		const isMultiselect = fieldId.endsWith('|multiselect');
		const cleanId = fieldId.replace('|multiselect', '').replace('customAttribute', '');
		const field = rmv.schema?.find(f => f.id === fieldId);

		const weclappAttr: IDataObject = { attributeDefinitionId: cleanId };

		if (field?.type === 'dateTime') {
			weclappAttr.dateValue = new Date(fieldValue as string).getTime();
		} else if (field?.type === 'number') {
			weclappAttr.numberValue = String(fieldValue);
		} else if (field?.type === 'boolean') {
			weclappAttr.booleanValue = fieldValue;
		} else if (field?.type === 'options') {
			weclappAttr.selectedValueId = fieldValue;
		} else if (isMultiselect) {
			weclappAttr.selectedValues = String(fieldValue)
				.split(',')
				.map(id => ({ id: id.trim() }));
		} else {
			weclappAttr.stringValue = fieldValue;
		}

		return [weclappAttr];
	});
}
