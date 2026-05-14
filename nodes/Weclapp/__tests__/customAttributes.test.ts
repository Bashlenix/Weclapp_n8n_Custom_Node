import {
	attributeDefinitionToNodeProperty,
	buildWeclappCustomAttributes,
	getCustomAttributesForEntity,
	WeclappCustomAttributeDefinition,
} from '../methods/customAttributes';
import { weclappRequest } from '../transport/request';

jest.mock('../transport/request');
const mockRequest = weclappRequest as jest.MockedFunction<typeof weclappRequest>;

const ctx = {} as Parameters<typeof getCustomAttributesForEntity>[0];

function attr(overrides: Partial<WeclappCustomAttributeDefinition> & { attributeType: WeclappCustomAttributeDefinition['attributeType'] }): WeclappCustomAttributeDefinition {
	return { id: '1', label: 'Test', entities: ['party'], ...overrides };
}

describe('attributeDefinitionToNodeProperty', () => {
	it('DATE → type dateTime', () => {
		expect(attributeDefinitionToNodeProperty(attr({ attributeType: 'DATE' })).type).toBe('dateTime');
	});

	it('LIST with 3 selectableValues → options field with 3 entries', () => {
		const result = attributeDefinitionToNodeProperty(attr({
			attributeType: 'LIST',
			selectableValues: [
				{ id: '1', value: 'Red' },
				{ id: '2', value: 'Green' },
				{ id: '3', value: 'Blue' },
			],
		}));
		expect(result.type).toBe('options');
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect((result as any).options).toHaveLength(3);
	});

	it('MULTISELECT_LIST → type multiOptions', () => {
		expect(attributeDefinitionToNodeProperty(attr({ attributeType: 'MULTISELECT_LIST' })).type).toBe('multiOptions');
	});

	it('BOOLEAN → type boolean', () => {
		expect(attributeDefinitionToNodeProperty(attr({ attributeType: 'BOOLEAN' })).type).toBe('boolean');
	});

	it('id 12345 → field name customAttribute12345', () => {
		const result = attributeDefinitionToNodeProperty(attr({ id: '12345', attributeType: 'STRING' }));
		expect(result.name).toBe('customAttribute12345');
	});

	it('groupName present → displayName formatted as "label (groupName)"', () => {
		const result = attributeDefinitionToNodeProperty(attr({ attributeType: 'STRING', label: 'Color', groupName: 'Appearance' }));
		expect(result.displayName).toBe('Color (Appearance)');
	});
});

describe('getCustomAttributesForEntity', () => {
	beforeEach(() => jest.clearAllMocks());

	it('filters out attributes that do not belong to the requested entity', async () => {
		mockRequest.mockResolvedValue({
			result: [
				attr({ id: '10', label: 'Party Attr', attributeType: 'STRING', entities: ['party'] }),
				attr({ id: '20', label: 'Article Attr', attributeType: 'STRING', entities: ['article'] }),
			],
		});
		const result = await getCustomAttributesForEntity(ctx, 'party');
		expect(result).toHaveLength(1);
		expect(result[0].label).toBe('Party Attr');
	});

	it('returns [] when the API call returns no attributes', async () => {
		mockRequest.mockResolvedValue({ result: [] });
		const result = await getCustomAttributesForEntity(ctx, 'party');
		expect(result).toEqual([]);
	});
});

describe('buildWeclappCustomAttributes', () => {
	it('converts dateTime field to dateValue (epoch ms)', () => {
		const schema = [{ id: 'customAttribute1', displayName: 'Date', type: 'dateTime' as const, defaultMatch: false, required: false, display: true }];
		const result = buildWeclappCustomAttributes({ value: { customAttribute1: '2024-01-15T00:00:00.000Z' }, schema });
		expect(result[0]).toMatchObject({ attributeDefinitionId: '1', dateValue: new Date('2024-01-15T00:00:00.000Z').getTime() });
	});

	it('converts multiselect field (|multiselect suffix) to selectedValues array', () => {
		const schema = [{ id: 'customAttribute5|multiselect', displayName: 'Tags', type: 'string' as const, defaultMatch: false, required: false, display: true }];
		const result = buildWeclappCustomAttributes({ value: { 'customAttribute5|multiselect': '10,20,30' }, schema });
		expect(result[0]).toMatchObject({
			attributeDefinitionId: '5',
			selectedValues: [{ id: '10' }, { id: '20' }, { id: '30' }],
		});
	});

	it('returns [] when value is null', () => {
		expect(buildWeclappCustomAttributes({ value: null })).toEqual([]);
	});

	it('skips null field values', () => {
		const schema = [{ id: 'customAttribute1', displayName: 'Name', type: 'string' as const, defaultMatch: false, required: false, display: true }];
		const result = buildWeclappCustomAttributes({ value: { customAttribute1: null }, schema });
		expect(result).toEqual([]);
	});
});
