import { INodeParams, INodeCredential } from '../../src/Interface'

class GitHubApi implements INodeCredential {
    name: string
    version: number
    credentials: INodeParams[]

    constructor() {
        this.name = 'gitHubApi'
        this.version = 1.0
        this.credentials = [
            {
                label: 'Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
                description: '<a target="_blank" href="https://github.com/settings/tokens">Register GitHub and get your access token.</a>"'
            }
        ]
    }
}

module.exports = { credClass: GitHubApi }
