import { INodeParams, INodeCredential } from '../../src/Interface'
class TypeformApi implements INodeCredential {
    name: string
    version: number
    credentials: INodeParams[]
    constructor() {
        this.name = 'typeformApi'
        this.version = 1.0
        this.credentials = [
            {
                label: 'Typeform Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
                description: 'Get your access token from typeform account section'
            }
        ]
    }
}
module.exports = { credClass: TypeformApi }
