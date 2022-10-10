import { ICommonObject, INode, INodeData, INodeExecutionData, INodeParams, NodeType } from '../../src/Interface'
import { handleErrorMessage, returnNodeExecutionData } from '../../src/utils'
import axios, { AxiosRequestConfig, Method } from 'axios'

interface ITeamsWebhook {
    text?: string
}

class Teams implements INode {
    label: string
    name: string
    type: NodeType
    description: string
    version: number
    icon: string
    incoming: number
    outgoing: number
    inputParameters?: INodeParams[]

    constructor() {
        this.label = 'Teams'
        this.name = 'teams'
        this.icon = 'teams.svg'
        this.type = 'action'
        this.version = 1.0
        this.description = 'Post message in Teams channel'
        this.incoming = 1
        this.outgoing = 1
        this.inputParameters = [
            {
                label: 'Webhook URL',
                name: 'webhookUrl',
                type: 'string',
                default: '',
                description:
                    'Webhook URL for the channel. Learn more: https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook'
            },
            {
                label: 'Message',
                description: 'Message contents',
                name: 'text',
                type: 'string',
                default: ''
            }
        ] as INodeParams[]
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        const inputParametersData = nodeData.inputParameters

        if (inputParametersData === undefined) {
            throw new Error('Required data missing')
        }

        const returnData: ICommonObject[] = []
        const body: ITeamsWebhook = {}

        const webhookUrl = inputParametersData.webhookUrl as string
        const text = inputParametersData.text as string
        body.text = text

        let responseData: any
        let maxRetries = 5

        do {
            try {
                const axiosConfig: AxiosRequestConfig = {
                    method: 'POST' as Method,
                    url: `${webhookUrl}`,
                    data: body,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                }
                const response = await axios(axiosConfig)
                responseData = response.data
                break
            } catch (error) {
                // Rate limit exceeded
                if (error.response && error.response.status === 429) {
                    const retryAfter = error.response?.headers['retry-after'] || 60
                    await new Promise<void>((resolve, _) => {
                        setTimeout(() => {
                            resolve()
                        }, retryAfter * 1000)
                    })
                    continue
                }
                throw handleErrorMessage(error)
            }
        } while (--maxRetries)

        if (maxRetries <= 0) {
            throw new Error('Error posting message to Teams channel. Max retries limit was reached.')
        }

        if (Array.isArray(responseData)) {
            returnData.push(...responseData)
        } else {
            returnData.push(responseData)
        }

        return returnNodeExecutionData(returnData)
    }
}

module.exports = { nodeClass: Teams }
