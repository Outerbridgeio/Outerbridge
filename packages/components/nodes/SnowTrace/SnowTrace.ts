import axios, { AxiosRequestConfig, Method } from 'axios'
import { etherscanAPIs, NETWORK } from '../../src'
import { ICommonObject, INode, INodeData, INodeExecutionData, INodeParams, NodeType } from '../../src/Interface'
import { handleErrorMessage, serializeQueryParams } from '../../src/utils'

class SnowTrace implements INode {
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
        this.label = 'SnowTrace'
        this.name = 'snowtrace'
        this.icon = 'snowtrace.svg'
        this.type = 'action'
        this.category = 'Block Explorer'
        this.version = 1.0
        this.description = 'Perform SnowTrace operations'
        this.incoming = 1
        this.outgoing = 1
        this.actions = [
            {
                label: 'API',
                name: 'api',
                type: 'options',
                options: [
                    {
                        label: 'Get AVAX Balance for a Single Address',
                        name: 'getAvaxBalance',
                        description: 'Returns the AVAX balance of a given address.'
                    },
                    {
                        label: 'Get AVAX Balance for Multiple Addresses',
                        name: 'getAvaxMultipleBalance',
                        description: 'Returns the AVAX balance of given addresses.'
                    },
                    {
                        label: 'Get a list of "Normal" Transactions By Address',
                        name: 'getNormalTransactions',
                        description: 'Returns a list of "Normal" transaction by address.'
                    },
                    {
                        label: 'Get a list of "Internal" Transactions by Address',
                        name: 'getInternalTransactions',
                        description: 'Returns a list of "Internal" transaction by address.'
                    },
                    {
                        label: 'Get "Internal Transactions" by Transaction Hash',
                        name: 'getInternalTransactionsByHash',
                        description: 'Returns "Internal Transactions" by hash.'
                    },
                    {
                        label: 'Get "Internal Transactions" by Block Range',
                        name: 'getInternalTransactionsByBlockRange',
                        description: 'Returns "Internal Transactions" transaction by block range.'
                    },
                    {
                        label: 'Get a list of "ERC20 - Token Transfer Events" by Address',
                        name: 'getErc20TokenTransferEvents',
                        description: 'Returns a list of "ERC20 - Token Transfer Events" by address.'
                    },
                    {
                        label: 'Get a list of "ERC721 - Token Transfer Events" by Address',
                        name: 'getErc721TokenTransferEvents',
                        description: 'Returns a list of "ERC721 - Token Transfer Events" by address.'
                    },
                    {
                        label: 'Get list of Blocks Validated by Address',
                        name: 'getBlocksValidated',
                        description: 'Returns a list of blocks validated by address.'
                    },
                    {
                        label: 'Get Contract ABI for Verified Contract Source Codes',
                        name: 'getContractABI',
                        description: 'Returns the contract ABI for verified contract source codes.'
                    }
                ],
                default: 'getAvaxBalance'
            }
        ] as INodeParams[]
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [
                    {
                        label: 'Avalanche Mainnet',
                        name: NETWORK.AVALANCHE
                    },
                    {
                        label: 'Avalanche Testnet',
                        name: NETWORK.AVALANCHE_TESTNET
                    }
                ],
                default: NETWORK.AVALANCHE
            }
        ] as INodeParams[]
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'SnowTrace API Key',
                        name: 'snowtraceApi'
                    }
                ],
                default: 'snowtraceApi'
            }
        ] as INodeParams[]
        this.inputParameters = [
            {
                label: 'Address',
                name: 'address',
                type: 'string',
                description: 'The address to check for balance',
                show: {
                    'actions.api': [
                        'getAvaxBalance',
                        'getNormalTransactions',
                        'getInternalTransactions',
                        'getErc20TokenTransferEvents',
                        'getErc721TokenTransferEvents',
                        'getBlocksValidated',
                        'getContractABI'
                    ]
                }
            },
            {
                label: 'Addresses',
                name: 'addresses',
                type: 'json',
                placeholder: `[
  '0x0000000000000000000000000000000000001004',
  '0x0000000000000000000000000000000000001000'
]`,
                description: 'The addresses to check for balance',
                show: {
                    'actions.api': ['getAvaxMultipleBalance']
                }
            },
            {
                label: 'Transaction Hash',
                name: 'hash',
                type: 'string',
                placeholder: '0x4d74a6fc84d57f18b8e1dfa07ee517c4feb296d16a8353ee41adc03669982028',
                description: 'The hash of the transaction',
                show: {
                    'actions.api': ['getInternalTransactionsByHash']
                }
            },
            {
                label: 'Start Block',
                name: 'startBlock',
                type: 'number',
                placeholder: '0',
                description: 'The starting block to check for internal transactions',
                show: {
                    'actions.api': ['getInternalTransactionsByBlockRange']
                }
            },
            {
                label: 'End Block',
                name: 'endBlock',
                type: 'number',
                placeholder: '2702578',
                description: 'The ending block to check for internal transactions',
                show: {
                    'actions.api': ['getInternalTransactionsByBlockRange']
                }
            }
        ] as INodeParams[]
    }

    async fetch(url: string, queryParameters: any) {
        try {
            const axiosConfig: AxiosRequestConfig = {
                method: 'GET' as Method,
                url,
                params: queryParameters,
                paramsSerializer: (params) => serializeQueryParams(params),
                headers: { 'Content-Type': 'application/json' }
            }
            const response = await axios(axiosConfig)
            return response.data
        } catch (error) {
            throw handleErrorMessage(error)
        }
    }

    getQueryParameters(api: string, value: any) {
        switch (api) {
            case 'getAvaxBalance':
                return {
                    module: 'account',
                    action: 'balance',
                    tag: 'latest',
                    address: value
                }
            case 'getAvaxMultipleBalance':
                return {
                    module: 'account',
                    action: 'balancemulti',
                    tag: 'latest',
                    address: value
                }
            case 'getNormalTransactions':
                return {
                    module: 'account',
                    action: 'txlist',
                    address: value
                }
            case 'getInternalTransactions':
                return {
                    module: 'account',
                    action: 'txlistinternal',
                    address: value
                }
            case 'getInternalTransactionsByHash':
                return {
                    module: 'account',
                    action: 'txlistinternal',
                    txhash: value
                }
            case 'getInternalTransactionsByBlockRange':
                return {
                    module: 'account',
                    action: 'txlistinternal',
                    startblock: value[0],
                    endblock: value[1]
                }
            case 'getErc20TokenTransferEvents':
                return {
                    module: 'account',
                    action: 'tokentx',
                    address: value
                }
            case 'getErc721TokenTransferEvents':
                return {
                    module: 'account',
                    action: 'tokennfttx',
                    address: value
                }

            case 'getBlocksValidated':
                return {
                    module: 'account',
                    action: 'getminedblocks',
                    address: value
                }
            case 'getContractABI':
                return {
                    module: 'contract',
                    action: 'getabi',
                    address: value
                }
            default:
                return {}
        }
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        const actionData = nodeData.actions
        const networksData = nodeData.networks
        const inputParametersData = nodeData.inputParameters
        const credentials = nodeData.credentials
        if (actionData === undefined || inputParametersData === undefined || credentials === undefined || networksData === undefined) {
            throw new Error('Required data missing')
        }

        const api = actionData.api as string

        const network = networksData.network as NETWORK

        const apiKey = credentials.apiKey as string

        const address = inputParametersData.address as string
        const addresses = (inputParametersData.addresses as string) || '[]'
        let addressesArray = []
        if (addresses) addressesArray = JSON.parse(addresses.replace(/\s/g, ''))
        const hash = inputParametersData.hash as string
        const startBlock = inputParametersData.startBlock as number
        const endBlock = inputParametersData.endBlock as number

        const url = etherscanAPIs[network] as string

        let responseData: any
        const returnData: ICommonObject[] = []
        let queryParameters: ICommonObject = {}

        switch (api) {
            case 'getContractABI':
            case 'getBlocksValidated':
            case 'getErc721TokenTransferEvents':
            case 'getErc20TokenTransferEvents':
            case 'getInternalTransactions':
            case 'getNormalTransactions':
            case 'getAvaxBalance':
                queryParameters = { ...this.getQueryParameters(api, address), apiKey }
                break
            case 'getAvaxMultipleBalance':
                queryParameters = { ...this.getQueryParameters(api, addressesArray.join(',')), apiKey }
                break
            case 'getInternalTransactionsByHash':
                queryParameters = { ...this.getQueryParameters(api, hash), apiKey }
                break
            case 'getInternalTransactionsByBlockRange':
                queryParameters = { ...this.getQueryParameters(api, [startBlock, endBlock]), apiKey }
                break
            default:
                break
        }

        responseData = await this.fetch(url, queryParameters)

        if (Array.isArray(responseData)) returnData.push(...responseData)
        else returnData.push(responseData)
        return responseData
    }
}

module.exports = { nodeClass: SnowTrace }
