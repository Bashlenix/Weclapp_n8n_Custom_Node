import { IDataObject, ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { weclappRequest } from '../transport/request';

async function loadList(
	context: ILoadOptionsFunctions,
	endpoint: string,
	labelKey: string,
	valueKey: string,
	qs?: IDataObject,
): Promise<INodePropertyOptions[]> {
	try {
		const response = await weclappRequest(context, 'GET', endpoint, undefined, {
			pageSize: 1000,
			...qs,
		});
		const items = ((response as IDataObject)?.result as IDataObject[]) ?? [];
		return items.map(item => ({
			name: `${item[labelKey] as string} (${item[valueKey] as string})`,
			value: item[valueKey] as string,
		}));
	} catch {
		return [];
	}
}

export async function getSalesChannels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return loadList(this, '/salesChannel/activeSalesChannels', 'name', 'key');
}

export async function getCurrencies(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return loadList(this, '/currency', 'name', 'id');
}

export async function getPaymentMethods(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return loadList(this, '/paymentMethod', 'name', 'id');
}

export async function getTermsOfPayment(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return loadList(this, '/termOfPayment', 'name', 'id');
}

export async function getShipmentMethods(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return loadList(this, '/shipmentMethod', 'name', 'id');
}

export async function getShippingCarriers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return loadList(this, '/shippingCarrier', 'name', 'id');
}

export async function getWarehouses(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return loadList(this, '/warehouse', 'name', 'id');
}

export async function getArticleCategories(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return loadList(this, '/articleCategory', 'name', 'id');
}

export async function getManufacturers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return loadList(this, '/manufacturer', 'name', 'id');
}

export async function getCustomsTariffNumbers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return loadList(this, '/customsTariffNumber', 'name', 'id');
}

export async function getCommercialLanguages(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return loadList(this, '/commercialLanguage', 'name', 'id');
}

export async function getCustomerCategories(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return loadList(this, '/customerCategory', 'name', 'id');
}

export async function getPersonDepartments(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return loadList(this, '/personDepartment', 'name', 'id');
}

export async function getPersonRoles(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return loadList(this, '/personRole', 'name', 'id');
}

export async function getLeadRatings(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return loadList(this, '/leadRating', 'name', 'id');
}

export async function getLeadSources(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return loadList(this, '/leadSource', 'name', 'id');
}

export async function getSectors(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return loadList(this, '/sector', 'name', 'id');
}

export async function getTaxes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return loadList(this, '/tax', 'name', 'id');
}

export async function getPartyRatings(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return loadList(this, '/partyRating', 'name', 'id');
}

export async function getCustomerTopics(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return loadList(this, '/customerTopic', 'name', 'id');
}

export async function getFulfillmentProviders(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return loadList(this, '/fulfillmentProvider', 'name', 'id');
}

export async function getTags(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return loadList(this, '/tag', 'name', 'id');
}
