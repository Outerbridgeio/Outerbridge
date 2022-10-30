import { INodeParams, INodeCredential } from '../../src/Interface'

class HTTPBasicAuth implements INodeCredential {
    name: string
    version: number
    credentials: INodeParams[]

    constructor() {
        this.name = 'httpBasicAuth'
        this.version = 1.0
        this.credentials = [
            {
                label: 'Username',
                name: 'userName',
                type: 'string',
                default: ''
            },
            {
                label: 'Password',
                name: 'password',
                type: 'password',
                default: ''
            }
        ]
    }
}

module.exports = { credClass: HTTPBasicAuth }
