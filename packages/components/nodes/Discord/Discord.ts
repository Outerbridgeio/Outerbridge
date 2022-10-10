import { ICommonObject, INode, INodeData, INodeExecutionData, INodeParams, NodeType } from '../../src/Interface'
import { handleErrorMessage, returnNodeExecutionData } from '../../src/utils'
import axios, { AxiosRequestConfig, Method } from 'axios'

interface IDiscordWebhook {
    content?: string
    username?: string
    avatar_url?: string
    tts?: boolean
}

class Discord implements INode {
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
        this.label = 'Discord'
        this.name = 'discord'
        this.icon = 'discord.svg'
        this.type = 'action'
        this.version = 1.0
        this.description = 'Post message in Discord channel'
        this.incoming = 1
        this.outgoing = 1
        this.inputParameters = [
            {
                label: 'Webhook URL',
                name: 'webhookUrl',
                type: 'string',
                default: '',
                description: 'Webhook URL for the channel. Learn how to get: https://www.youtube.com/watch?v=K8vgRWZnSZw'
            },
            {
                label: 'Content',
                description: 'Message contents (up to 2000 characters)',
                name: 'content',
                type: 'string',
                default: ''
            },
            {
                label: 'Username',
                name: 'username',
                type: 'string',
                default: '',
                description: 'Override the default username of the webhook',
                optional: true
            },
            {
                label: 'Avatar URL',
                name: 'avatarUrl',
                type: 'string',
                default: '',
                description: 'Override the default avatar of the webhook',
                optional: true
            },
            {
                label: 'TTS',
                name: 'tts',
                type: 'boolean',
                default: false,
                description: 'Send as Text To Speech message',
                optional: true
            }
        ] as INodeParams[]
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        const inputParametersData = nodeData.inputParameters

        if (inputParametersData === undefined) {
            throw new Error('Required data missing')
        }

        const returnData: ICommonObject[] = []
        const body: IDiscordWebhook = {}

        const webhookUrl = inputParametersData.webhookUrl as string
        const content = inputParametersData.content as string
        body.content = content

        if (inputParametersData.username) body.username = inputParametersData.username as string
        if (inputParametersData.avatarUrl) body.avatar_url = inputParametersData.avatarUrl as string
        if (inputParametersData.tts) body.tts = inputParametersData.tts as boolean

        let responseData: any
        let maxRetries = 5

        do {
            try {
                const axiosConfig: AxiosRequestConfig = {
                    method: 'POST' as Method,
                    url: `${webhookUrl}?wait=true`,
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
            throw new Error('Error posting message to discord channel. Max retries limit was reached.')
        }

        if (Array.isArray(responseData)) {
            returnData.push(...responseData)
        } else {
            returnData.push(responseData)
        }

        return returnNodeExecutionData(returnData)
    }
}

module.exports = { nodeClass: Discord }
