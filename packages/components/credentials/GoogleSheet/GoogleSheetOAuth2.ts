import { INodeParams, INodeCredential } from '../../src/Interface'

class GoogleSheetOAuth2 implements INodeCredential {
    name: string
    version: number
    credentials: INodeParams[]

    constructor() {
        this.name = 'googleSheetsOAuth2Api'
        this.version = 1.0
        this.credentials = [
            {
                label: 'Client ID',
                name: 'clientID',
                type: 'string',
                default: '',
                description: 'How to get Client ID & Secret: https://www.youtube.com/watch?v=VBwDwHbPaYQ'
            },
            {
                label: 'Client Secret',
                name: 'clientSecret',
                type: 'password',
                default: '',
                description: 'How to get Client ID & Secret: https://www.youtube.com/watch?v=VBwDwHbPaYQ'
            },
            {
                label: 'Authorization URL',
                name: 'authUrl',
                type: 'string',
                default: 'https://accounts.google.com/o/oauth2/v2/auth'
            },
            {
                label: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'string',
                default: 'https://oauth2.googleapis.com/token'
            },
            {
                label: 'Authorization URL Parameters',
                name: 'authorizationURLParameters',
                type: 'string',
                default: 'access_type=offline&prompt=consent&response_type=code'
            },
            {
                label: 'Scope',
                name: 'scope',
                type: 'json',
                default: `["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/spreadsheets"]`
            }
        ]
    }
}

module.exports = { credClass: GoogleSheetOAuth2 }
