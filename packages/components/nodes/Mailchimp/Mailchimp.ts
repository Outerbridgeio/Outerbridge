import { ICommonObject, INode, INodeData, INodeExecutionData, INodeParams, NodeType } from '../../src/Interface'
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
        this.version = 1.0
        this.description = 'Mailchimp market api integration'
        this.incoming = 1
        this.outgoing = 1
        this.actions = [
            {
                label: 'API',
                name: 'api',
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
                label: 'Campaign Id',
                name: 'campaignId',
                type: 'string',
                show: {
                    'actions.api': ['deleteCampaign', 'getCampaign']
                },
                default: ''
            }
        ] as INodeParams[]
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        // function to make calls
        let authObj: Auth
        async function makeApiCall(method: string, url: string): Promise<any[]> {
            const axiosConfig: AxiosRequestConfig = {
                method: method as Method,
                url,
                headers: { 'Content-Type': 'application/json' },
                auth: {
                    ...authObj
                }
            }
            let responseData: any[] = []
            try {
                const response = await axios(axiosConfig)
                if (response?.data) {
                    responseData.push(response?.data)
                }
            } catch (err) {
                throw handleErrorMessage(err)
            }
            return responseData
        }
        // function to start running the node
        const actionData = nodeData.actions
        const credentials = nodeData.credentials
        if (actionData === undefined || credentials === undefined) {
            throw handleErrorMessage({ message: 'Required data missing' })
        }
        const api = actionData.api as string
        const apiKey = credentials.apiKey as string
        const dc = ((apiKey && apiKey.split('-')[1]) || '') as string
        if (!apiKey) {
            throw handleErrorMessage({ message: 'Api key is required' })
        }
        if (!dc) {
            throw handleErrorMessage({ message: 'Date center is required' })
        }

        let campaignId

        if (['deleteCampaign', 'getCampaign'].includes(api)) {
            if (nodeData?.inputParameters?.campaignId === undefined) throw handleErrorMessage({ message: 'Campaign id is required' })
            else {
                campaignId = nodeData?.inputParameters?.campaignId
            }
        }

        let returnData: ICommonObject[] = []
        let url = `https://${dc}.api.mailchimp.com/3.0/campaigns`
        authObj = { username: '', password: apiKey }
        if (['deleteCampaign', 'getCampaign'].includes(api)) {
            url += `/${campaignId}`
        }
        if (api === 'listCampaigns') {
            returnData = await makeApiCall('get', url)
        } else if (api === 'getCampaign') {
            returnData = await makeApiCall('get', url)
        } else if (api === 'deleteCampaign') {
            returnData = await makeApiCall('delete', url)
        }

        return returnNodeExecutionData(returnData)
    }
}
module.exports = { nodeClass: Mailchimp }
