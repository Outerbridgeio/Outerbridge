import {
    INodeParams, 
	INodeCredential,
} from '../../src/Interface';

class InfuraApi implements INodeCredential {

	name: string;
    version: number;
    credentials: INodeParams[];

	constructor() {
		this.name = 'infuraApi';
		this.version = 1.0;
		this.credentials = [
			{
				label: 'Project ID',
				name: 'projectID',
				type: 'string',
				default: '',
			},
			{
				label: 'Project Secret',
				name: 'projectSecret',
				type: 'string',
				default: '',
			},
		];
	}
}

module.exports = { credClass: InfuraApi }
