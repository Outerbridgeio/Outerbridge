import {
    INodeParams, 
	INodeCredential,
} from '../../src/Interface';

class ArbiscanApi implements INodeCredential {

	name: string;
    version: number;
    credentials: INodeParams[];

	constructor() {	
		this.name = 'arbiscanApi';
		this.version = 1.0;
		this.credentials = [
			{
				label: 'API Key',
				name: 'apiKey',
				type: 'string',
				default: '',
			},
		];
	}
}

module.exports = { credClass: ArbiscanApi }

