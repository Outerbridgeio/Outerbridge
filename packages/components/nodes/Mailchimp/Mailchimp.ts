import { ICommonObject, INode, INodeData, INodeExecutionData, INodeOptionsValue, INodeParams, NodeType } from '../../src/Interface'
import { handleErrorMessage, returnNodeExecutionData } from '../../src/utils'
import axios, { AxiosRequestConfig, Method } from 'axios'

interface Auth {
    username: string
    password: string
}

class Mailchimp implements INode {
    label: string
    name: string
    type: NodeType
    description: string
    version: number
    icon: string
    category: string
    incoming: number
    outgoing: number
    actions: INodeParams[]
    credentials?: INodeParams[]
    networks?: INodeParams[]
    inputParameters?: INodeParams[]

    constructor() {
        this.label = 'Mailchimp'
        this.name = 'mailchimp'
        this.icon = 'mailchimp.svg'
        this.type = 'action'
        this.category = 'Communication'
        this.version = 2.0
        this.description = 'Execute Mailchimp API integration'
        this.incoming = 1
        this.outgoing = 1
        this.actions = [
            {
                label: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        label: 'Get list of campaigns',
                        name: 'listCampaigns',
                        description: 'Returns the list of campaigns'
                    },
                    {
                        label: 'Get campaign',
                        name: 'getCampaign',
                        description: 'Return single campaign'
                    },
                    {
                        label: 'Delete campaign',
                        name: 'deleteCampaign',
                        description: 'It will delete campaigns'
                    },
                    {
                        label: 'Add user to subscribe list',
                        name: 'addUser',
                        description: 'Add or update user to a subscribe list'
                    },
                    {
                        label: 'Get user',
                        name: 'getUser',
                        description: 'Get information about a specific audience'
                    },
                    {
                        label: 'Get list of users',
                        name: 'listUsers',
                        description: 'Get information about list of members in a specific audience list'
                    }
                ],
                default: 'listCampaigns'
            }
        ] as INodeParams[]
        this.credentials = [
            // credentialMethod is mandatory field
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Mailchimp Credentials',
                        name: 'mailChimpCredential'
                    }
                ],
                default: 'mailChimpCredential'
            }
        ] as INodeParams[]
        this.inputParameters = [
            {
                label: 'Campaign',
                name: 'campaignId',
                type: 'asyncOptions',
                loadMethod: 'getCampaigns',
                show: {
                    'actions.operation': ['deleteCampaign', 'getCampaign']
                }
            },
            {
                label: 'Audience List',
                name: 'listId',
                type: 'asyncOptions',
                loadMethod: 'getLists',
                show: {
                    'actions.operation': ['addUser', 'getUser', 'listUsers']
                }
            },
            {
                label: 'Customer Email',
                name: 'email',
                type: 'string',
                show: {
                    'actions.operation': ['addUser', 'getUser']
                }
            }
        ] as INodeParams[]
    }

    loadMethods = {
        async getCampaigns(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []
            const credentials = nodeData.credentials

            const apiKey = credentials!.apiKey as string
            const dc = ((apiKey && apiKey.split('-')[1]) || '') as string

            if (!apiKey || !dc) return returnData

            try {
                const authObj: Auth = { username: '', password: apiKey }
                const axiosConfig: AxiosRequestConfig = {
                    method: 'GET' as Method,
                    url: `https://${dc}.api.mailchimp.com/3.0/campaigns`,
                    headers: { 'Content-Type': 'application/json' },
                    auth: {
                        ...authObj
                    }
                }
                const response = await axios(axiosConfig)
                const campaigns = response.data?.campaigns

                campaigns.forEach((campaign: any) => {
                    const data = {
                        label: campaign.settings.title || campaign.web_id,
                        name: campaign.id
                    } as INodeOptionsValue
                    returnData.push(data)
                })
                return returnData
            } catch (e) {
                return returnData
            }
        },

        async getLists(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []
            const credentials = nodeData.credentials

            const apiKey = credentials!.apiKey as string
            const dc = ((apiKey && apiKey.split('-')[1]) || '') as string

            if (!apiKey || !dc) return returnData

            try {
                const authObj: Auth = { username: '', password: apiKey }
                const axiosConfig: AxiosRequestConfig = {
                    method: 'GET' as Method,
                    url: `https://${dc}.api.mailchimp.com/3.0/lists`,
                    headers: { 'Content-Type': 'application/json' },
                    auth: {
                        ...authObj
                    }
                }

                const response = await axios(axiosConfig)
                const lists = response.data?.lists

                lists.forEach((list: any) => {
                    const data = {
                        label: list.name || list.web_id,
                        name: list.id
                    } as INodeOptionsValue
                    returnData.push(data)
                })
                return returnData
            } catch (e) {
                return returnData
            }
        }
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        // function to make calls
        let authObj: Auth

        async function makeApiCall(method: string, url: string, operation: string, body?: ICommonObject): Promise<any[]> {
            const axiosConfig: AxiosRequestConfig = {
                method: method as Method,
                url,
                headers: { 'Content-Type': 'application/json' },
                auth: {
                    ...authObj
                }
            }
            if (method === 'post' && body) axiosConfig.data = body
            let responseData: any[] = []
            try {
                const response = await axios(axiosConfig)
                if (response?.data) {
                    responseData.push(response?.data)
                }
            } catch (err) {
                if (operation === 'addUser' && err.response.data.title.includes('Member Exists')) {
                    // dont throw error
                } else throw handleErrorMessage(err)
            }
            return responseData
        }

        // function to start running the node
        const actionData = nodeData.actions
        const credentials = nodeData.credentials
        if (actionData === undefined || credentials === undefined) {
            throw handleErrorMessage({ message: 'Required data missing' })
        }

        const operation = actionData.operation as string
        const apiKey = credentials.apiKey as string
        const dc = ((apiKey && apiKey.split('-')[1]) || '') as string

        if (!apiKey) {
            throw handleErrorMessage({ message: 'Api key is required' })
        }
        if (!dc) {
            throw handleErrorMessage({ message: 'Date center is required' })
        }

        let campaignId

        if (['deleteCampaign', 'getCampaign'].includes(operation)) {
            if (nodeData?.inputParameters?.campaignId === undefined) throw handleErrorMessage({ message: 'Campaign id is required' })
            else {
                campaignId = nodeData?.inputParameters?.campaignId
            }
        }

        let returnData: ICommonObject[] = []
        let url = `https://${dc}.api.mailchimp.com/3.0/campaigns`
        authObj = { username: '', password: apiKey }

        if (['deleteCampaign', 'getCampaign'].includes(operation)) url += `/${campaignId}`

        if (operation === 'listCampaigns') {
            returnData = await makeApiCall('get', url, operation)
        } else if (operation === 'getCampaign') {
            returnData = await makeApiCall('get', url, operation)
        } else if (operation === 'deleteCampaign') {
            returnData = await makeApiCall('delete', url, operation)
        } else if (operation === 'getUser') {
            const audienceList = nodeData?.inputParameters?.listId as string
            const email = nodeData?.inputParameters?.email as string
            url = `https://${dc}.api.mailchimp.com/3.0/lists/${audienceList}/members/${email}`
            returnData = await makeApiCall('get', url, operation)
        } else if (operation === 'listUsers') {
            const audienceList = nodeData?.inputParameters?.listId as string
            url = `https://${dc}.api.mailchimp.com/3.0/lists/${audienceList}/members`
            returnData = await makeApiCall('get', url, operation)
        } else if (operation === 'addUser') {
            const audienceList = nodeData?.inputParameters?.listId as string
            const email = nodeData?.inputParameters?.email as string
            url = `https://${dc}.api.mailchimp.com/3.0/lists/${audienceList}/members`
            const body = {
                email_address: email,
                status: 'subscribed'
            }
            await makeApiCall('post', url, operation, body)
            url = `https://${dc}.api.mailchimp.com/3.0/lists/${audienceList}/members/${email}`
            returnData = await makeApiCall('get', url, operation)
        }

        return returnNodeExecutionData(returnData)
    }
}
module.exports = { nodeClass: Mailchimp }
