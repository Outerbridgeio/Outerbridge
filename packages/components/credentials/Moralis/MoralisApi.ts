import { INodeParams, INodeCredential } from '../../src/Interface'

class MoralisApi implements INodeCredential {
    name: string
    version: number
    credentials: INodeParams[]

    constructor() {
        this.name = 'moralisApi'
        this.version = 1.0
        this.credentials = [
            {
                label: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
                description: 'How to get API key: https://docs.moralis.io/reference/getting-the-api-key'
            }
        ]
    }
}

module.exports = { credClass: MoralisApi }
