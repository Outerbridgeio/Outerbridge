import { INodeParams, INodeCredential } from '../../src/Interface'

class QuickNodeEndpoints implements INodeCredential {
    name: string
    version: number
    credentials: INodeParams[]

    constructor() {
        this.name = 'quickNodeEndpoints'
        this.version = 1.0
        this.credentials = [
            {
                label: 'HTTP Provider',
                name: 'httpProvider',
                type: 'string',
                default: '',
                placeholder: 'https://sample-endpoint-name.network.discover.quiknode.pro/token-goes-here/'
            },
            {
                label: 'WSS Provider',
                name: 'wssProvider',
                type: 'string',
                default: '',
                placeholder: 'wss://sample-endpoint-name.network.discover.quiknode.pro/token-goes-here/',
                optional: true
            }
        ]
    }
}

module.exports = { credClass: QuickNodeEndpoints }
