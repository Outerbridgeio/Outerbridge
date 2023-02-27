import { INodeParams, INodeCredential } from '../../src/Interface'

class OpenAIApi implements INodeCredential {
    name: string
    version: number
    credentials: INodeParams[]

    constructor() {
        this.name = 'openAIApi'
        this.version = 1.0
        this.credentials = [
            {
                label: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
                description:
                    'Navigate to the <a target="_blank" href="https://platform.openai.com/account/api-keys">API page</a> to copy your "API Key".'
            }
        ]
    }
}

module.exports = { credClass: OpenAIApi }
