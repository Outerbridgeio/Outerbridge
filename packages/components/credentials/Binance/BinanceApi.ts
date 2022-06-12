import {
    INodeParams, 
	INodeCredential,
} from '../../src/Interface';

class BinanceApi implements INodeCredential {

    name: string;
    version: number;
    credentials: INodeParams[];

	constructor() {
		this.name = 'binanceApi';
		this.version = 1.0;
		this.credentials = [
			{
				label: 'API Key',
				name: 'apiKey',
				type: 'string',
				default: '',
			},
			{
				label: 'Secret Key',
				name: 'secretKey',
				type: 'string',
				default: '',
			},
		];
	}
}

module.exports = { credClass: BinanceApi }