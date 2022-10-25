import { INodeParams, INodeCredential } from '../../src/Interface'
class MailchimpApi implements INodeCredential {
    name: string
    version: number
    credentials: INodeParams[]
    constructor() {
        this.name = 'mailChimpCredential'
        this.version = 1.0
        this.credentials = [
            {
                label: 'Mailchimp API Key',
                name: 'apiKey',
                type: 'string',
                default: ''
            }
        ]
    }
}
module.exports = { credClass: MailchimpApi }
