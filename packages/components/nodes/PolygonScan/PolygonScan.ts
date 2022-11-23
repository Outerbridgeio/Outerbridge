import { ICommonObject, INode, INodeData, INodeExecutionData, INodeParams, NodeType } from '../../src/Interface'
import { handleErrorMessage, returnNodeExecutionData, serializeQueryParams } from '../../src/utils'
import axios, { AxiosRequestConfig, Method } from 'axios'
import {
    SORT_BY,
    OPERATIONS,
    GET_MATIC_BALANCE,
    GET_HISTORICAL_MATIC_BALANCE,
    GET_NORMAL_TRANSACTIONS,
    GET_INTERNAL_TRANSACTIONS,
    GET_INTERNAL_TRANSACTIONS_BY_HASH,
    GET_INTERNAL_TRANSACTIONS_BY_BLOCK,
    GET_BLOCKS_VALIDATED,
    GET_ABI,
    GET_CONTRACT_SOURCE_CODE,
    CHECK_TRANSACTION_RECEIPT_STATUS,
    GET_ERC20_TOKEN_SUPPLY,
    GET_ERC20_TOKEN_BALANCE,
    GET_HISTORICAL_ERC20_TOKEN_SUPPLY,
    GET_HISTORICAL_ERC20_TOKEN_BALANCE,
    GET_TOKEN_INFO,
    GET_MATIC_PRICE,
    GET_HISTORICAL_MATIC_PRICE
} from './constants'

class PolygonScan implements INode {
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
        this.label = 'PolygonScan'
        this.name = 'polygonscan'
        this.icon = 'polygonscan.png'
        this.type = 'action'
        this.category = 'Block Explorer'
        this.version = 1.0
        this.description = 'PolygonScan Public API'
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
                        label: 'Get MATIC Balance',
                        name: GET_MATIC_BALANCE.name,
                        description: 'Returns the MATIC balance of a given address. The result is returned in wei.'
                    },
                    {
                        label: 'Get Historical MATIC Balance [PRO]',
                        name: GET_HISTORICAL_MATIC_BALANCE.name,
                        description:
                            'Returns the historical MATIC balance of an address at a certain block height. The result is returned in wei'
                    },
                    {
                        label: 'Get transactions',
                        name: GET_NORMAL_TRANSACTIONS.name,
                        description: 'Returns the list of transactions performed by an address, with optional pagination.'
                    },
                    {
                        label: 'Get internal transactions',
                        name: GET_INTERNAL_TRANSACTIONS.name,
                        description: 'Returns the list of internal transactions performed by an address, with optional pagination.'
                    },
                    {
                        label: 'Get internal transactions by hash',
                        name: GET_INTERNAL_TRANSACTIONS_BY_HASH.name,
                        description: 'Returns the list of internal transactions performed within a transaction.'
                    },
                    {
                        label: 'Get internal transactions by block',
                        name: GET_INTERNAL_TRANSACTIONS_BY_BLOCK.name,
                        description: 'Returns the list of internal transactions performed within a block range, with optional pagination.'
                    },
                    {
                        label: 'Get list of Blocks Validated by Address',
                        name: GET_BLOCKS_VALIDATED.name,
                        description: 'Returns the list of blocks validated by an address.'
                    },
                    {
                        label: 'Get Contract ABI',
                        name: GET_ABI.name,
                        description: 'Returns the contract Application Binary Interface ( ABI ) of a verified smart contract.'
                    },
                    {
                        label: 'Get Contract Source Code',
                        name: GET_CONTRACT_SOURCE_CODE.name,
                        description: 'Returns the Solidity source code of a verified smart contract.'
                    },
                    {
                        label: 'Check Transaction Receipt Status',
                        name: CHECK_TRANSACTION_RECEIPT_STATUS.name,
                        description: 'Returns the status code of a transaction execution.'
                    },
                    {
                        label: 'Get ERC20 Token Supply',
                        name: GET_ERC20_TOKEN_SUPPLY.name,
                        description: `Returns the total supply of a ERC-20 token. The result is returned in the token's smallest decimal representation.
                        Eg. a token with a balance of 215.241526476136819398 and 18 decimal places will be returned as 215241526476136819398`
                    },
                    {
                        label: 'Get ERC20 Token Balance',
                        name: GET_ERC20_TOKEN_BALANCE.name,
                        description: `Returns the current balance of a ERC-20 token of an address. The result is returned in the token's smallest decimal representation.
                        Eg. a token with a balance of 215.241526476136819398 and 18 decimal places will be returned as 215241526476136819398`
                    },
                    {
                        label: 'Get Historical ERC-20 Token TotalSupply by ContractAddress & BlockNo [PRO]',
                        name: GET_HISTORICAL_ERC20_TOKEN_SUPPLY.name,
                        description: `Returns the historical amount of a ERC-20 token in circulation at a certain block height. The result is returned in the token's smallest decimal representation.
                        Eg. a token with a balance of 215.241526476136819398 and 18 decimal places will be returned as 215241526476136819398`
                    },
                    {
                        label: 'Get Historical ERC-20 Token Account Balance by ContractAddress & BlockNo [PRO]',
                        name: GET_HISTORICAL_ERC20_TOKEN_BALANCE.name,
                        description: `Returns the balance of a ERC-20 token of an address at a certain block height. The result is returned in the token's smallest decimal representation.
                        Eg. a token with a balance of 215.241526476136819398 and 18 decimal places will be returned as 215241526476136819398`
                    },
                    {
                        label: 'Get Token Info [PRO]',
                        name: GET_TOKEN_INFO.name,
                        description: 'Returns project information and social media links of an ERC-20/ERC-721 token.'
                    },
                    {
                        label: 'Get MATIC Price',
                        name: GET_MATIC_PRICE.name,
                        description: 'Returns the latest price of 1 MATIC.'
                    },
                    {
                        label: 'Get Historical MATIC Price [PRO]',
                        name: GET_HISTORICAL_MATIC_PRICE.name,
                        description: 'Returns the historical price of 1 MATIC.'
                    }
                ],
                default: GET_MATIC_BALANCE.name
            }
        ] as INodeParams[]

        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                description: 'Network to execute API: Test or Real',
                options: [
                    {
                        label: 'Polygon Testnet',
                        name: 'testnet'
                    },
                    {
                        label: 'Polygon Mainnet',
                        name: 'mainnet'
                    }
                ],
                default: 'testnet'
            }
        ] as INodeParams[]

        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'PolygonScan API Key',
                        name: 'polygonscanApi'
                    }
                ],
                default: 'polygonscanApi'
            }
        ] as INodeParams[]

        this.inputParameters = [
            {
                label: 'Polygon Address',
                name: 'address',
                type: 'string',
                show: {
                    'actions.api': [
                        GET_MATIC_BALANCE.name,
                        GET_HISTORICAL_MATIC_BALANCE.name,
                        GET_NORMAL_TRANSACTIONS.name,
                        GET_INTERNAL_TRANSACTIONS.name,
                        GET_BLOCKS_VALIDATED.name,
                        GET_ABI.name,
                        GET_CONTRACT_SOURCE_CODE.name,
                        GET_ERC20_TOKEN_BALANCE.name,
                        GET_HISTORICAL_ERC20_TOKEN_BALANCE.name
                    ]
                }
            },
            {
                label: 'Block Number',
                name: 'blockno',
                type: 'number',
                description: 'the block number to check balance for eg. 2000000',
                show: {
                    'actions.api': [
                        GET_HISTORICAL_MATIC_BALANCE.name,
                        GET_HISTORICAL_ERC20_TOKEN_SUPPLY.name,
                        GET_HISTORICAL_ERC20_TOKEN_BALANCE.name
                    ]
                }
            },
            {
                label: 'Start Block',
                name: 'startBlock',
                type: 'number',
                optional: true,
                description: 'the block number to start searching for transactions',
                show: {
                    'actions.api': [GET_NORMAL_TRANSACTIONS.name, GET_INTERNAL_TRANSACTIONS.name, GET_INTERNAL_TRANSACTIONS_BY_BLOCK.name]
                },
                default: 0
            },
            {
                label: 'End Block',
                name: 'endBlock',
                type: 'number',
                optional: true,
                description: 'the block number to stop searching for transactions',
                show: {
                    'actions.api': [GET_NORMAL_TRANSACTIONS.name, GET_INTERNAL_TRANSACTIONS.name, GET_INTERNAL_TRANSACTIONS_BY_BLOCK.name]
                }
            },
            {
                label: 'Page',
                name: 'page',
                type: 'number',
                optional: true,
                description: 'the page number, if pagination is enabled',
                show: {
                    'actions.api': [
                        GET_NORMAL_TRANSACTIONS.name,
                        GET_INTERNAL_TRANSACTIONS.name,
                        GET_INTERNAL_TRANSACTIONS_BY_BLOCK.name,
                        GET_BLOCKS_VALIDATED.name
                    ]
                },
                default: 1
            },
            {
                label: 'Offset',
                name: 'offset',
                type: 'number',
                optional: true,
                description: 'the number of transactions displayed per page',
                show: {
                    'actions.api': [
                        GET_NORMAL_TRANSACTIONS.name,
                        GET_INTERNAL_TRANSACTIONS.name,
                        GET_INTERNAL_TRANSACTIONS_BY_BLOCK.name,
                        GET_BLOCKS_VALIDATED.name
                    ]
                },
                default: 10
            },
            {
                label: 'Sort By',
                name: 'sortBy',
                type: 'options',
                optional: true,
                options: SORT_BY,
                show: {
                    'actions.api': [GET_NORMAL_TRANSACTIONS.name, GET_INTERNAL_TRANSACTIONS.name, GET_INTERNAL_TRANSACTIONS_BY_BLOCK.name]
                },
                default: 'desc'
            },
            {
                label: 'Transaction Hash',
                name: 'txhash',
                type: 'string',
                description: 'the string representing the transaction hash to check for internal transactions',
                show: {
                    'actions.api': [GET_INTERNAL_TRANSACTIONS_BY_HASH.name, CHECK_TRANSACTION_RECEIPT_STATUS.name]
                }
            },
            {
                label: 'Block Type',
                name: 'blockType',
                type: 'options',
                options: [
                    {
                        label: 'blocks',
                        name: 'blocks'
                    }
                ],
                default: 'blocks',
                show: {
                    'actions.api': [GET_BLOCKS_VALIDATED.name]
                }
            },
            {
                label: 'Contract Address',
                name: 'contractAddress',
                type: 'string',
                description: 'the contract address of the ERC-20 token',
                show: {
                    'actions.api': [
                        GET_ERC20_TOKEN_SUPPLY.name,
                        GET_ERC20_TOKEN_BALANCE.name,
                        GET_HISTORICAL_ERC20_TOKEN_SUPPLY.name,
                        GET_HISTORICAL_ERC20_TOKEN_BALANCE.name,
                        GET_TOKEN_INFO.name
                    ]
                }
            },
            {
                label: 'Tag',
                name: 'tag',
                type: 'options',
                options: [{ label: 'latest', name: 'latest' }],
                default: 'latest',
                show: {
                    'actions.api': [GET_ERC20_TOKEN_BALANCE.name]
                }
            },
            {
                label: 'Start Time',
                name: 'startTime',
                type: 'date',
                optional: true,
                show: {
                    'actions.api': [GET_HISTORICAL_MATIC_PRICE.name]
                }
            },
            {
                label: 'End Time',
                name: 'endTime',
                type: 'date',
                optional: true,
                show: {
                    'actions.api': [GET_HISTORICAL_MATIC_PRICE.name]
                }
            }
        ]
    }

    getNetwork(network: string): string {
        switch (network) {
            case 'mainnet':
                return 'https://api.polygonscan.com/api'
            case 'testnet':
            default:
                return 'https://api-testnet.polygonscan.com/api'
        }
    }

    getBaseParams(api: string) {
        const operation = OPERATIONS.filter(({ name }) => name === api)[0]
        return { module: operation.module, action: operation.action }
    }

    getISODate(date: Date) {
        return date.toISOString().split('T')[0]
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        const { actions, networks, inputParameters, credentials } = nodeData

        if (actions === undefined || inputParameters === undefined || credentials === undefined || networks === undefined) {
            throw new Error('Required data missing')
        }

        const api = actions.api as string
        const network = networks.network as string
        const apiKey = credentials.apiKey as string

        const address = inputParameters.address as string
        const startblock = inputParameters.startBlock as number
        const endblock = inputParameters.endBlock as number
        const page = inputParameters.page as number
        const offset = inputParameters.offset as number
        const sort = inputParameters.sortBy as string
        const txhash = inputParameters.txhash as string
        const blocktype = inputParameters.blockType as string
        const contractaddress = inputParameters.contractAddress as string
        const tag = inputParameters.tag as string
        const startTime = inputParameters.startTime as string
        const endTime = inputParameters.endTime as string

        const startdate = startTime ? this.getISODate(new Date(startTime)) : undefined
        const enddate = endTime ? this.getISODate(new Date(endTime)) : undefined

        const url = this.getNetwork(network)
        const { module, action } = this.getBaseParams(api)

        const queryParameters = {
            module,
            action,
            address,
            apiKey,
            startblock,
            endblock,
            page,
            offset,
            sort,
            txhash,
            blocktype,
            contractaddress,
            tag,
            startdate,
            enddate
        }

        const returnData: ICommonObject[] = []
        let responseData: any

        try {
            const axiosConfig: AxiosRequestConfig = {
                method: 'GET' as Method,
                url,
                params: queryParameters,
                paramsSerializer: (params) => serializeQueryParams(params),
                headers: { 'Content-Type': 'application/json' }
            }
            const response = await axios(axiosConfig)
            responseData = response.data
        } catch (error) {
            throw handleErrorMessage(error)
        }

        if (Array.isArray(responseData)) {
            returnData.push(...responseData)
        } else {
            returnData.push(responseData)
        }

        return returnNodeExecutionData(returnData)
    }
}

module.exports = { nodeClass: PolygonScan }
