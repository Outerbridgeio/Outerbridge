import {
    INodeParams, 
    INodeCredential,
} from '../../src/Interface';
class TypeformApi implements INodeCredential {
    name: string;
    version: number;
    credentials: INodeParams[];
    constructor() { 
        this.name = 'typeformApi';
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
module.exports = { credClass: TypeformApi }