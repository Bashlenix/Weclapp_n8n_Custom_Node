import { ILoadOptionsFunctions } from 'n8n-workflow';
import * as loadOptions from '../methods/loadOptions';
import { weclappRequest } from '../transport/request';

jest.mock('../transport/request');
const mockRequest = weclappRequest as jest.MockedFunction<typeof weclappRequest>;

const ctx = {} as unknown as ILoadOptionsFunctions;

const STANDARD_LOADERS = [
	'getCurrencies',
	'getPaymentMethods',
	'getTermsOfPayment',
	'getShipmentMethods',
	'getShippingCarriers',
	'getWarehouses',
	'getArticleCategories',
	'getManufacturers',
	'getCustomsTariffNumbers',
	'getCommercialLanguages',
	'getCustomerCategories',
	'getPersonDepartments',
	'getPersonRoles',
	'getLeadRatings',
	'getLeadSources',
	'getSectors',
	'getTaxes',
	'getPartyRatings',
	'getCustomerTopics',
	'getFulfillmentProviders',
	'getTags',
] as const;

describe('loadOptions', () => {
	beforeEach(() => jest.clearAllMocks());

	describe('standard loaders (id as value)', () => {
		it.each(STANDARD_LOADERS)('%s maps {name, id} result to options', async (loaderName) => {
			mockRequest.mockResolvedValue({ result: [{ id: '1', name: 'Foo' }] });
			const loader = loadOptions[loaderName] as unknown as (this: ILoadOptionsFunctions) => Promise<unknown>;
			const result = await loader.call(ctx);
			expect(result).toEqual([{ name: 'Foo (1)', value: '1' }]);
		});

		it.each(STANDARD_LOADERS)('%s returns [] when result is empty', async (loaderName) => {
			mockRequest.mockResolvedValue({ result: [] });
			const loader = loadOptions[loaderName] as unknown as (this: ILoadOptionsFunctions) => Promise<unknown>;
			const result = await loader.call(ctx);
			expect(result).toEqual([]);
		});
	});

	describe('getSalesChannels', () => {
		it('maps activeSalesChannels response using key as value', async () => {
			mockRequest.mockResolvedValue({ result: [{ key: 'DIRECT', name: 'Direct Sales' }] });
			const result = await loadOptions.getSalesChannels.call(ctx);
			expect(result).toEqual([{ name: 'Direct Sales (DIRECT)', value: 'DIRECT' }]);
		});

		it('returns [] when result is empty', async () => {
			mockRequest.mockResolvedValue({ result: [] });
			const result = await loadOptions.getSalesChannels.call(ctx);
			expect(result).toEqual([]);
		});
	});
});
