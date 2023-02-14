import { ICommonObject, INode, INodeData, INodeParams, IWebhookNodeExecutionData, NodeType } from '../../src/Interface'
import { returnWebhookNodeExecutionData } from '../../src/utils'
import axios, { AxiosRequestConfig, Method } from 'axios'

class HelioWebhook implements INode {
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
    networks?: INodeParams[]
    credentials?: INodeParams[]
    inputParameters?: INodeParams[]

    constructor() {
        this.label = 'Helio Webhook'
        this.name = 'helioWebhook'
        this.icon = 'helio.png'
        this.type = 'webhook'
        this.category = 'Payment'
        this.version = 1.0
        this.description = 'Start workflow whenever Helio webhook event happened'
        this.incoming = 0
        this.outgoing = 1
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                description: 'Network to execute API: Test or Prod',
                options: [
                    {
                        label: 'TEST',
                        name: 'test',
                        description: 'Test network: https://dev.hel.io/'
                    },
                    {
                        label: 'PROD',
                        name: 'prod',
                        description: 'Prod network: https://hel.io/'
                    }
                ],
                default: 'test'
            }
        ] as INodeParams[]
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Helio API Key',
                        name: 'helioApi'
                    }
                ],
                default: 'helioApi'
            }
        ] as INodeParams[]
        this.actions = [
            {
                label: 'Event',
                name: 'event',
                type: 'options',
                options: [
                    {
                        label: 'New payment on Pay Link',
                        name: 'CREATED',
                        description: 'Triggered upon new payment on the Pay Link'
                    },
                    {
                        label: 'New subscription on Pay Stream',
                        name: 'STARTED',
                        description: `Triggered upon new subscription/stream started on the Pay Stream`
                    },
                    {
                        label: 'Cancellation of subscription on Pay Stream',
                        name: 'ENDED',
                        description: `Triggered when a subscription/stream was stopped/ended on the Pay Stream`
                    }
                ]
            }
        ] as INodeParams[]
        this.inputParameters = [
            {
                label: 'Pay Link Id',
                name: 'paylinkId',
                type: 'string',
                placeholder: '63ea24cc1ea62a8e0d272444',
                description: 'For example, pay link id of https://hel.io/pay/63ea24cc1ea62a8e0d272444 is 63ea24cc1ea62a8e0d272444',
                show: {
                    'actions.event': ['CREATED']
                }
            },
            {
                label: 'Pay Stream Id',
                name: 'streamId',
                type: 'string',
                placeholder: '63ea543143507a1df4f6fccf',
                description: 'For example, pay stream id of https://hel.io/pay/63ea543143507a1df4f6fccf is 63ea543143507a1df4f6fccf',
                show: {
                    'actions.event': ['STARTED', 'ENDED']
                }
            }
        ] as INodeParams[]
    }

    webhookMethods = {
        async createWebhook(nodeData: INodeData, webhookFullUrl: string): Promise<string | undefined> {
            // Check if webhook exists
            const credentials = nodeData.credentials
            const inputParametersData = nodeData.inputParameters
            const networksData = nodeData.networks
            const actionsData = nodeData.actions

            if (inputParametersData === undefined || actionsData === undefined || networksData === undefined) {
                throw new Error('Required data missing')
            }

            if (credentials === undefined) {
                throw new Error('Missing credentials')
            }

            const apiKey = credentials.apiKey as string
            const secretKey = credentials.secretKey as string
            const network = networksData.network as string
            const baseUrl = network === 'test' ? 'https://dev.api.hel.io/v1' : 'https://api.hel.io/v1'
            const paylinkId = inputParametersData.paylinkId as string
            const streamId = inputParametersData.streamId as string
            const event = actionsData.event as string
            const payType = paylinkId ? 'paylink' : 'stream'
            const payTypeId = paylinkId ? 'paylinkId' : 'streamId'
            const payId = paylinkId ? paylinkId : streamId

            const axiosConfig: AxiosRequestConfig = {
                method: 'GET' as Method,
                url: `${baseUrl}/webhook/${payType}/transaction?apiKey=${apiKey}&${payTypeId}=${payId}`,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secretKey}` }
            }

            try {
                const response = await axios(axiosConfig)
                const webhooks = response.data
                let webhookExist = false

                for (const webhook of webhooks) {
                    if (webhook.events.includes(event) && webhook.targetUrl === webhookFullUrl) {
                        // Check match pay link id
                        if (paylinkId) {
                            if (webhook.paylink === paylinkId) {
                                webhookExist = true
                                break
                            }
                        }

                        // Check match pay stream id
                        if (streamId) {
                            if (webhook.stream === streamId) {
                                webhookExist = true
                                break
                            }
                        }
                    }
                }

                if (!webhookExist) {
                    const data: ICommonObject = {
                        events: [event],
                        targetUrl: webhookFullUrl
                    }
                    if (paylinkId) data.paylinkId = paylinkId
                    if (streamId) data.streamId = streamId

                    const axiosCreateConfig: AxiosRequestConfig = {
                        method: 'POST' as Method,
                        url: `${baseUrl}/webhook/${payType}/transaction?apiKey=${apiKey}`,
                        data,
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secretKey}` }
                    }
                    const response = await axios(axiosCreateConfig)

                    const createResponseData = response.data
                    if (createResponseData && createResponseData.id) {
                        return createResponseData.id
                    }
                    return
                }
            } catch (error) {
                return
            }
        },

        async deleteWebhook(nodeData: INodeData, webhookId: string): Promise<boolean> {
            const credentials = nodeData.credentials
            const inputParametersData = nodeData.inputParameters
            const networksData = nodeData.networks
            const actionsData = nodeData.actions

            if (inputParametersData === undefined || actionsData === undefined || networksData === undefined) {
                throw new Error('Required data missing')
            }

            if (credentials === undefined) {
                throw new Error('Missing credentials')
            }

            const apiKey = credentials.apiKey as string
            const secretKey = credentials.secretKey as string
            const network = networksData.network as string
            const baseUrl = network === 'test' ? 'https://dev.api.hel.io/v1' : 'https://api.hel.io/v1'
            const paylinkId = inputParametersData.paylinkId as string
            const payType = paylinkId ? 'paylink' : 'stream'

            const axiosConfig: AxiosRequestConfig = {
                method: 'DELETE' as Method,
                url: `${baseUrl}/webhook/${payType}/transaction/${webhookId}?apiKey=${apiKey}`,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secretKey}` }
            }

            try {
                await axios(axiosConfig)
            } catch (error) {
                return false
            }

            return true
        }
    }

    async runWebhook(nodeData: INodeData): Promise<IWebhookNodeExecutionData[] | null> {
        const inputParametersData = nodeData.inputParameters
        const req = nodeData.req

        if (inputParametersData === undefined) {
            throw new Error('Required data missing')
        }

        if (req === undefined) {
            throw new Error('Missing request')
        }

        //TODO: Verify webhook via signing key

        const returnData: ICommonObject[] = []

        returnData.push({
            headers: req?.headers,
            params: req?.params,
            query: req?.query,
            body: req?.body,
            rawBody: (req as any).rawBody,
            url: req?.url
        })

        return returnWebhookNodeExecutionData(returnData)
    }
}

module.exports = { nodeClass: HelioWebhook }
