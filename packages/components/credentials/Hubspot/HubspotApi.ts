import { INodeParams, INodeCredential } from '../../src/Interface'

class HubspotApi implements INodeCredential {
    name: string
    version: number
    credentials: INodeParams[]

    constructor() {
        this.name = 'hubspotCredential'
        this.version = 1.0
        this.credentials = [
            {
                label: 'Private App Access Token',
                name: 'accessToken',
                type: 'string',
                description: `Private apps allow you to use HubSpot's APIs to access specific data from your HubSpot account. Learn how to create one <a target="_blank" href="https://developers.hubspot.com/docs/api/private-apps">here</a>`,
                default: ''
            }
        ]
    }
}

module.exports = { credClass: HubspotApi }
