import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class WeclappApi implements ICredentialType {
	name = 'weclappApi';
	displayName = 'Weclapp API';
	icon = 'fa:plug' as const;
	documentationUrl = 'https://www.weclapp.com/api/documentation';

	properties: INodeProperties[] = [
		{
			displayName: 'Subdomain',
			name: 'subdomain',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'mycompany',
			hint: 'Your weclapp subdomain — the part before <code>.weclapp.com</code> in your URL.',
		},
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			hint: 'Find your API token under <strong>My Settings → API</strong> in your weclapp account.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				AuthenticationToken: '={{$credentials.apiToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: "={{ `https://${$credentials.subdomain}.weclapp.com/webapp/api/v2` }}",
			url: '/user/count',
		},
	};
}
