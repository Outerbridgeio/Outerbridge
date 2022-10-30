import { ICommonObject, INode, INodeData, INodeExecutionData, INodeParams, NodeType } from '../../src/Interface'
import { handleErrorMessage, returnNodeExecutionData } from '../../src/utils'
import axios, { AxiosRequestConfig, Method } from 'axios'

class Twitter implements INode {
    label: string
    name: string
    icon: string
    type: NodeType
    description: string
    version: number
    incoming: number
    outgoing: number
    inputParameters?: INodeParams[]
    credentials?: INodeParams[]

    constructor() {
        this.label = 'Twitter'
        this.name = 'twitter'
        this.icon = 'Twitter-Logo.png'
        this.type = 'action'
        this.description = "Search Twitter User's tweets by keyword"
        this.version = 1.0
        this.incoming = 1
        this.outgoing = 1
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Twitter Bearer Token',
                        name: 'twitterApi'
                    }
                ],
                default: 'twitterApi'
            }
        ] as INodeParams[]
        this.inputParameters = [
            {
                label: 'Twitter ID',
                name: 'TwitterId',
                type: 'string',
                default: '',
                description: ''
            },
            {
                label: 'Keyword',
                name: 'Keyword',
                type: 'string',
                default: '',
                description: 'Message contents (up to 512 characters long)'
            },
            {
                label: 'From',
                name: 'fromDate',
                type: 'options',
                description: 'Date of start search',
                options: [
                    {
                        label: 'From Today UTC',
                        name: 'fromTodayUTC'
                    }
                ],
                default: 'fromTodayUTC'
            }
        ] as INodeParams[]
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        const inputParametersData = nodeData.inputParameters
        const credentials = nodeData.credentials

        if (inputParametersData === undefined || credentials === undefined) {
            throw new Error('Required data missing')
        }

        const returnData: ICommonObject[] = []

        const bearerToken = credentials.bearerToken as string
        const TwitterId = inputParametersData.TwitterId as string
        const keyword = inputParametersData.Keyword as string
        const query = 'from:' + TwitterId + ' ' + keyword
        const timestamp = new Date()
        timestamp.setUTCHours(0, 0, 0, 0)

        let responseData: any
        let maxRetries = 5

        do {
            try {
                const axiosConfig: AxiosRequestConfig = {
                    method: 'GET' as Method,
                    url: `https://api.twitter.com/2/tweets/search/recent?query=${query}&start_time=${timestamp.toISOString()}&tweet.fields=created_at&sort_order=recency`,
                    headers: {
                        Authorization: `Bearer ${bearerToken}`
                    }
                }
                const response = await axios(axiosConfig)
                responseData = response.data
                break
            } catch (error) {
                throw handleErrorMessage(error)
            }
        } while (--maxRetries)

        if (maxRetries <= 0) {
            throw new Error('Error getting message from twitter API. Max retries limit was reached.')
        }

        if (Array.isArray(responseData)) {
            returnData.push(...responseData)
        } else {
            returnData.push(responseData)
        }

        return returnNodeExecutionData(returnData)
    }
}

module.exports = { nodeClass: Twitter }
