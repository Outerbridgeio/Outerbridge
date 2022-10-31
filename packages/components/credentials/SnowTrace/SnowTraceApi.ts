import { INodeCredential, INodeParams } from '../../src/Interface'

class SnowTraceApi implements INodeCredential {
    name: string
    version: number
    credentials: INodeParams[]
    constructor() {
        this.name = 'snowtraceApi'
        this.version = 1.0
        this.credentials = [
            {
                label: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: ''
            }
        ]
    }
}
module.exports = { credClass: SnowTraceApi }
