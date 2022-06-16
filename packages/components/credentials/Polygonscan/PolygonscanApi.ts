import {
    INodeParams, 
	INodeCredential,
} from '../../src/Interface';

class PolygonscanApi implements INodeCredential {

	name: string;
    version: number;
    credentials: INodeParams[];

	constructor() {	
		this.name = 'polygonscanApi';
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

module.exports = { credClass: PolygonscanApi }

