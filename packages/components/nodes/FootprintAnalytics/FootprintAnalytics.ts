import { ICommonObject, INode, INodeData, INodeExecutionData, INodeOptionsValue, INodeParams, NodeType } from '../../src/Interface'
import { handleErrorMessage, returnNodeExecutionData, serializeQueryParams } from '../../src/utils'
import axios, { AxiosRequestConfig, Method } from 'axios'
import {
    ALL_OPERATIONS,
    chainInputParameters,
    CHAIN_OPERATIONS,
    gamefiParams,
    GAMEFI_OPERATIONS,
    limitOffetParams,
    nftBalanceParams,
    nftParams,
    nftWashTradeCheckerParams,
    NFT_OPERATIONS,
    timeRangeParams,
    tokenBalanceParams,
    tokenParams,
    TOKEN_OPERATIONS
} from './constants'

class FootprintAnalytics implements INode {
    // properties
    label: string
    name: string
    type: NodeType
    description?: string
    version: number
    icon: string
    category: string
    incoming: number
    outgoing: number

    // parameter
    actions: INodeParams[]
    credentials?: INodeParams[]
    networks?: INodeParams[]
    inputParameters?: INodeParams[]

    constructor() {
        // properties
        this.label = 'Footprint Analytics'
        this.name = 'footprintAnalytics'
        this.icon = 'footprint-analytics.png'
        this.type = 'action'
        this.category = 'Block Explorer'
        this.version = 1.0
        this.description = 'Execute Footprint Analytics APIs and SQL query'
        this.incoming = 1
        this.outgoing = 1

        // parameter
        this.actions = [
            {
                label: 'API',
                name: 'api',
                type: 'options',
                options: [
                    {
                        label: 'Rest API (V2)',
                        name: 'restAPI'
                    },
                    {
                        label: 'SQL API (Synchronous)',
                        name: 'sqlAPISynchronous',
                        description: 'Suitable for simple table lookup query'
                    },
                    {
                        label: 'SQL API (Asynchronous)',
                        name: 'sqlAPIAsynchronous',
                        description: 'For complex analysis table lookup query'
                    }
                ]
            },
            {
                label: 'Category',
                name: 'category',
                type: 'options',
                options: [
                    {
                        label: 'NFT',
                        name: 'nft'
                    },
                    {
                        label: 'Token',
                        name: 'token'
                    },
                    {
                        label: 'GameFi',
                        name: 'gamefi'
                    },
                    {
                        label: 'Chain',
                        name: 'chain'
                    }
                ],
                show: {
                    'actions.api': ['restAPI']
                }
            },
            {
                label: 'Operation',
                name: 'operation',
                type: 'asyncOptions',
                loadMethod: 'getOperations',
                show: {
                    'actions.api': ['restAPI']
                }
            }
        ] as INodeParams[]

        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Footprint Analytics API Key',
                        name: 'footprintAnalyticsApi'
                    }
                ],
                default: 'footprintAnalyticsApi'
            }
        ] as INodeParams[]

        this.inputParameters = [
            ...chainInputParameters,
            ...nftParams,
            ...nftWashTradeCheckerParams,
            ...nftBalanceParams,
            ...tokenParams,
            ...tokenBalanceParams,
            ...gamefiParams,
            ...timeRangeParams,
            ...limitOffetParams,
            {
                label: 'SQL query',
                name: 'sqlQuery',
                type: 'string',
                rows: 5,
                placeholder: `select * from ethereum_token_transfers where block_timestamp >= date_add('day',-1,current_date) limit 10`,
                description: 'SQL query to execute. Must be Scale or Enterprise plan',
                show: {
                    'actions.api': ['sqlAPISynchronous', 'sqlAPIAsynchronous']
                }
            }
        ]
    }

    getFormattedDate(date: Date, operation: string) {
        const hours = date.toISOString().split('T')[1].split(':')[0]
        const minutes = date.toISOString().split('T')[1].split(':')[1]
        const seconds = date.toISOString().split('T')[1].split(':')[2]
        return operation === 'nftCollectionStatistics'
            ? date.getTime()
            : `${date.toISOString().split('T')[0]} ${hours}:${minutes}:${seconds}`
    }

    loadMethods = {
        async getOperations(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []
            const actionsData = nodeData.actions

            if (actionsData === undefined) {
                return returnData
            }

            const category = actionsData.category as string
            let operations: any[] = []

            switch (category) {
                case 'nft':
                    operations = NFT_OPERATIONS
                    break
                case 'token':
                    operations = TOKEN_OPERATIONS
                    break
                case 'gamefi':
                    operations = GAMEFI_OPERATIONS
                    break
                case 'chain':
                    operations = CHAIN_OPERATIONS
                    break
            }

            for (const op of operations) {
                returnData.push({
                    label: op.label,
                    name: op.name,
                    description: op.description
                })
            }

            return returnData
        }
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        const { actions, inputParameters, credentials } = nodeData

        if (actions === undefined || inputParameters === undefined || credentials === undefined) {
            throw new Error('Required data missing')
        }

        const api = actions.api as string
        const apiKey = credentials.apiKey as string
        const operation = actions.operation as string

        const chain = inputParameters.chain as string
        const collection_contract_address = inputParameters.collection_contract_address as string
        const type = inputParameters.type as string
        const status = inputParameters.status as string
        const statistics_metrics = inputParameters.statistics_metrics as string
        const statistics_time_model = inputParameters.statistics_time_model as string
        const wallet_address = inputParameters.wallet_address as string
        const nft_type = inputParameters.nft_type as string
        const nft_token_id = inputParameters.nft_token_id as string
        const token_address = inputParameters.token_address as string
        const from_address = inputParameters.from_address as string
        const to_address = inputParameters.to_address as string
        const protocol_slug = inputParameters.protocol_slug as string
        const address_type = inputParameters.address_type as string
        const statistics_frequency_model = inputParameters.statistics_frequency_model as string
        const contract_address = inputParameters.contract_address as string

        const startTime = inputParameters.start_time as string
        const endTime = inputParameters.end_time as string
        const offset = inputParameters.offset as number
        const limit = inputParameters.limit as number

        const start_time = startTime ? this.getFormattedDate(new Date(startTime), operation) : undefined
        const end_time = endTime ? this.getFormattedDate(new Date(endTime), operation) : undefined

        const sqlQuery = inputParameters.sqlQuery as string

        const queryParameters = {
            chain,
            collection_contract_address,
            type,
            status,
            statistics_metrics,
            statistics_time_model,
            nft_type,
            protocol_slug,
            address_type
        } as any

        if (nft_token_id) queryParameters.nft_token_id = nft_token_id
        if (start_time) queryParameters.start_time = start_time
        if (end_time) queryParameters.end_time = end_time
        if (wallet_address) queryParameters.wallet_address = wallet_address
        if (token_address) queryParameters.token_address = token_address
        if (from_address) queryParameters.from_address = from_address
        if (to_address) queryParameters.to_address = to_address
        if (statistics_frequency_model) queryParameters.statistics_frequency_model = statistics_frequency_model
        if (contract_address) queryParameters.contract_address = contract_address
        if (offset) queryParameters.offset = offset
        if (limit) queryParameters.limit = limit

        const returnData: ICommonObject[] = []
        let responseData: any

        if (api === 'sqlAPISynchronous') {
            try {
                const axiosConfig: AxiosRequestConfig = {
                    method: 'POST' as Method,
                    url: 'https://api.footprint.network/api/v1/native',
                    data: JSON.stringify({
                        query: sqlQuery
                    }),
                    headers: { 'Content-Type': 'application/json', 'API-KEY': apiKey }
                }
                const response = await axios(axiosConfig)
                responseData = response.data
            } catch (error) {
                console.error(error)
                throw handleErrorMessage(error)
            }
        } else if (api === 'sqlAPIAsynchronous') {
            try {
                const axiosConfig: AxiosRequestConfig = {
                    method: 'POST' as Method,
                    url: 'https://api.footprint.network/api/v1/native/async',
                    data: JSON.stringify({
                        query: sqlQuery
                    }),
                    headers: { 'Content-Type': 'application/json', 'API-KEY': apiKey }
                }
                const response = await axios(axiosConfig)
                responseData = response.data

                const promise = (execution_id: string) => {
                    let data: ICommonObject = {}
                    return new Promise((resolve, reject) => {
                        const timeout = setInterval(async () => {
                            const axiosConfig: AxiosRequestConfig = {
                                method: 'GET' as Method,
                                url: `https://api.footprint.network/api/v1/native/${execution_id}/results`,
                                headers: { 'Content-Type': 'application/json', 'API-KEY': apiKey }
                            }
                            const response = await axios(axiosConfig)
                            data = response.data
                            const state = response.data.data.state as 'INIT' | 'PENDING' | 'SUCCESS' | 'FAIL' | 'EXPIRED'

                            if (state === 'SUCCESS') {
                                clearInterval(timeout)
                                resolve(data)
                            } else if (state === 'FAIL' || state === 'EXPIRED') {
                                clearInterval(timeout)
                                reject(new Error(`Error querying async SQL request: ${state}`))
                            }
                        }, 1500)
                    })
                }

                responseData = await promise(responseData.data.execution_id || '')
            } catch (error) {
                console.error(error)
                throw handleErrorMessage(error)
            }
        } else if (api === 'restAPI') {
            try {
                const axiosConfig: AxiosRequestConfig = {
                    method: 'GET' as Method,
                    url: ALL_OPERATIONS.find((op) => op.name === operation)?.endpoint,
                    params: queryParameters,
                    paramsSerializer: (params) => serializeQueryParams(params),
                    headers: { 'Content-Type': 'application/json', 'API-KEY': apiKey }
                }
                const response = await axios(axiosConfig)
                responseData = response.data
            } catch (error) {
                console.error(error)
                throw handleErrorMessage(error)
            }
        }

        if (Array.isArray(responseData)) {
            returnData.push(...responseData)
        } else {
            returnData.push(responseData)
        }

        return returnNodeExecutionData(returnData)
    }
}

module.exports = { nodeClass: FootprintAnalytics }
