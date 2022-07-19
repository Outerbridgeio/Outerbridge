import {
    INodeParams, 
	INodeCredential,
} from '../../src/Interface';

class HTTPBearerTokenAuth implements INodeCredential {

	name: string;
    version: number;
    credentials: INodeParams[];

	constructor() {	
		this.name = 'httpBearerTokenAuth';
		this.version = 1.0;
		this.credentials = [
			{
				label: 'Token',
				name: 'token',
				type: 'string',
				default: '',
			},
		];
	}
}

module.exports = { credClass: HTTPBearerTokenAuth }
