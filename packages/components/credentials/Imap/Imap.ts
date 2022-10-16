import { INodeParams, INodeCredential } from '../../src/Interface'

class Imap implements INodeCredential {
    name: string
    version: number
    credentials: INodeParams[]

    constructor() {
        this.name = 'imap'
        this.version = 1.0
        this.credentials = [
            {
                label: 'User Email',
                name: 'userEmail',
                type: 'string',
                default: ''
            },
            {
                label: 'Password',
                name: 'password',
                type: 'password',
                default: ''
            },
            {
                label: 'Host',
                name: 'host',
                type: 'string',
                default: ''
            },
            {
                label: 'Port',
                name: 'port',
                type: 'number',
                default: 993
            },
            {
                label: 'Enable TLS',
                name: 'tls',
                type: 'boolean',
                default: true
            }
        ]
    }
}

module.exports = { credClass: Imap }
