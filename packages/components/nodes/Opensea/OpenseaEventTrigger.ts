import { CronJob } from 'cron'
import { ICommonObject, ICronJobs, INode, INodeData, INodeParams, NodeType } from '../../src/Interface'
import { handleErrorMessage, returnNodeExecutionData, serializeQueryParams } from '../../src/utils'
import EventEmitter from 'events'
import { eventsTriggerParams } from './extendedParameters'
import axios, { AxiosRequestConfig, AxiosRequestHeaders, Method } from 'axios'

class OpenSeaEventTrigger extends EventEmitter implements INode {
    label: string
    name: string
    type: NodeType
    description?: string
    version: number
    icon?: string
    incoming: number
    outgoing: number
    actions?: INodeParams[]
    credentials?: INodeParams[]
    inputParameters?: INodeParams[]
    cronJobs: ICronJobs

    constructor() {
        super()
        this.label = 'OpenSea Event Trigger'
        this.name = 'openSeaEventTrigger'
        this.icon = 'opensea.svg'
        this.type = 'trigger'
        this.version = 1.0
        this.description = 'Start workflow whenever OpenSea event occurs'
        this.incoming = 0
        this.outgoing = 1
        this.cronJobs = {}
        this.actions = [
            {
                label: 'Event Type',
                name: 'event_type',
                type: 'options',
                options: [
                    {
                        label: 'New Auctions',
                        name: 'created'
                    },
                    {
                        label: 'New Sales',
                        name: 'successful'
                    },
                    {
                        label: 'New Transfer',
                        name: 'transfer'
                    },
                    {
                        label: 'New Approve',
                        name: 'approve'
                    },
                    {
                        label: 'New Bid Entered',
                        name: 'bid_entered'
                    },
                    {
                        label: 'Bid Withdrawn',
                        name: 'bid_withdrawn'
                    },
                    {
                        label: 'Cancelled',
                        name: 'cancelled'
                    }
                ],
                default: '',
                description: 'The event type to filter'
            },
            {
                label: 'Auction Type',
                name: 'auction_type',
                type: 'options',
                options: [
                    {
                        label: 'Sell to the highest bidder',
                        name: 'english',
                        description: 'The highest bid wins at the end'
                    },
                    {
                        label: 'Sell with a declining price',
                        name: 'dutch',
                        description: 'The price falls until someone purchases the item'
                    },
                    {
                        label: 'CryptoPunks Auctions',
                        name: 'min-price'
                    }
                ],
                default: '',
                optional: true,
                description: 'Filter by an auction type',
                show: {
                    'actions.event_type': ['created']
                }
            },
            {
                label: 'Environment',
                name: 'environment',
                type: 'options',
                description: 'Environment to listen to event: Test or Main',
                options: [
                    {
                        label: 'TEST',
                        name: 'https://testnets-api.opensea.io/api/v1',
                        description: 'Testnet: https://testnets.opensea.io/'
                    },
                    {
                        label: 'MAIN',
                        name: 'https://api.opensea.io/api/v1',
                        description: 'Mainnet: https://opensea.io/'
                    }
                ],
                default: ''
            }
        ] as INodeParams[]
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'OpenSea API Key',
                        name: 'openSeaApi',
                        description: 'How to get API key: https://docs.opensea.io/reference/request-an-api-key'
                    }
                ],
                default: 'openSeaApi',
                show: {
                    'actions.environment': ['https://api.opensea.io/api/v1']
                }
            }
        ] as INodeParams[]
        this.inputParameters = [
            ...eventsTriggerParams,
            {
                label: 'Polling Time',
                name: 'pollTime',
                type: 'options',
                description: 'How often should we keep checking the event',
                options: [
                    {
                        label: 'Every 15 secs',
                        name: '15s'
                    },
                    {
                        label: 'Every 30 secs',
                        name: '30s'
                    },
                    {
                        label: 'Every 1 min',
                        name: '1min'
                    },
                    {
                        label: 'Every 5 min',
                        name: '5min'
                    },
                    {
                        label: 'Every 10 min',
                        name: '10min'
                    }
                ],
                default: '30s'
            }
        ] as INodeParams[]
    }

    async runTrigger(nodeData: INodeData): Promise<void> {
        const inputParametersData = nodeData.inputParameters
        const actionData = nodeData.actions

        if (actionData === undefined) {
            throw new Error('Required data missing')
        }

        const baseURL = actionData.environment as string

        let url = ''
        const queryParameters: ICommonObject = {}
        let method: Method = 'GET'
        const headers: AxiosRequestHeaders = {
            'Content-Type': 'application/json'
        }

        if (baseURL === 'https://api.opensea.io/api/v1') {
            // Mainnet
            const credentials = nodeData.credentials
            if (credentials === undefined) {
                throw new Error('Missing credentials')
            }
            const apiKey = credentials!.apiKey as string
            headers['X-API-KEY'] = apiKey
        }

        const emitEventKey = nodeData.emitEventKey as string
        const pollTime = (inputParametersData?.pollTime as string) || '30s'
        const cronTimes: string[] = []

        if (pollTime === '15s') {
            cronTimes.push(`*/15 * * * * *`)
        } else if (pollTime === '30s') {
            cronTimes.push(`*/30 * * * * *`)
        } else if (pollTime === '1min') {
            cronTimes.push(`*/1 * * * *`)
        } else if (pollTime === '5min') {
            cronTimes.push(`*/5 * * * *`)
        } else if (pollTime === '10min') {
            cronTimes.push(`*/10 * * * *`)
        }

        function mapEventName(event: string) {
            switch (event) {
                case 'created':
                    return 'New Auctions'
                case 'successful':
                    return 'New Sales'
                case 'transfer':
                    return 'New Transfer'
                case 'approve':
                    return 'New Approve'
                case 'bid_entered':
                    return 'New Bid Entered'
                case 'bid_withdrawn':
                    return 'Bid Withdrawn'
                case 'cancelled':
                    return 'Cancelled'
                default:
                    return ''
            }
        }

        async function executeEventAPI(lastEventTimestamp?: any) {
            // Get initial data
            url = `${baseURL}/events`

            const event_type = actionData?.event_type as string
            if (event_type) queryParameters['event_type'] = event_type

            const auction_type = actionData?.auction_type as string
            if (auction_type) queryParameters['auction_type'] = auction_type

            const asset_contract_address = inputParametersData?.asset_contract_address as string
            if (asset_contract_address) queryParameters['asset_contract_address'] = asset_contract_address

            const collection_slug = inputParametersData?.collection_slug as string
            if (collection_slug) queryParameters['collection_slug'] = collection_slug

            const token_id = inputParametersData?.token_id as number
            if (token_id) queryParameters['token_id'] = token_id

            const account_address = inputParametersData?.account_address as string
            if (account_address) queryParameters['account_address'] = account_address

            const only_opensea = inputParametersData?.only_opensea as boolean
            if (only_opensea) queryParameters['only_opensea'] = only_opensea

            if (lastEventTimestamp) queryParameters['occurred_after'] = lastEventTimestamp

            const axiosConfig: AxiosRequestConfig = {
                method,
                url,
                headers
            }

            if (Object.keys(queryParameters).length > 0) {
                axiosConfig.params = queryParameters
                axiosConfig.paramsSerializer = (params) => serializeQueryParams(params, true)
            }

            return await axios(axiosConfig)
        }

        try {
            // Get initial data

            let lastEventTimestamp: any

            const response = await executeEventAPI()
            const responseData = response.data

            if (responseData.asset_events && responseData.asset_events.length)
                lastEventTimestamp = responseData.asset_events[0].event_timestamp

            // Trigger when cron job hits
            const executeTrigger = async () => {
                const newResponse = await executeEventAPI(lastEventTimestamp)
                const newResponseData = newResponse.data

                if (newResponseData.asset_events && newResponseData.asset_events.length) {
                    lastEventTimestamp = newResponseData.asset_events[0].event_timestamp

                    const returnItem = {
                        event: mapEventName(actionData?.event_type as string),
                        eventData: newResponseData
                    }
                    this.emit(emitEventKey, returnNodeExecutionData(returnItem))
                }
            }

            // Start the cron-jobs
            if (Object.prototype.hasOwnProperty.call(this.cronJobs, emitEventKey)) {
                for (const cronTime of cronTimes) {
                    // Automatically start the cron job
                    this.cronJobs[emitEventKey].push(new CronJob(cronTime, executeTrigger, undefined, true))
                }
            } else {
                for (const cronTime of cronTimes) {
                    // Automatically start the cron job
                    this.cronJobs[emitEventKey] = [new CronJob(cronTime, executeTrigger, undefined, true)]
                }
            }
        } catch (e) {
            throw handleErrorMessage(e)
        }
    }

    async removeTrigger(nodeData: INodeData): Promise<void> {
        const emitEventKey = nodeData.emitEventKey as string

        if (Object.prototype.hasOwnProperty.call(this.cronJobs, emitEventKey)) {
            const cronJobs = this.cronJobs[emitEventKey]
            for (const cronJob of cronJobs) {
                cronJob.stop()
            }
            this.removeAllListeners(emitEventKey)
        }
    }
}

module.exports = { nodeClass: OpenSeaEventTrigger }
