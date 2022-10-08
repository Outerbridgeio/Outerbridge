import {
    INodeParams, 
	INodeCredential,
} from '../../src/Interface';

class AlchemyApi implements INodeCredential {

	name: string;
    version: number;
    credentials: INodeParams[];

	constructor() {
		this.name = 'alchemyApi';
		this.version = 1.0;
		this.credentials = [
			{
				label: 'API Key',
				name: 'apiKey',
				type: 'string',
				default: '',
				description: 'Navigate to the <a target="_blank" href="https://dashboard.alchemyapi.io">Dashboard page</a> to copy your "API Key".'
			},
			{
				label: 'Webhook Auth Token',
				name: 'authToken',
				type: 'string',
				default: '',
				optional: true,
				description: 'Navigate to the top right corner of <a target="_blank" href="https://dashboard.alchemyapi.io/notify">Notify page</a> to copy your "Auth Token".'
			},
		];
	}
}

module.exports = { credClass: AlchemyApi }
