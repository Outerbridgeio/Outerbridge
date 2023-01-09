import { ICommonObject, INode, INodeData, INodeExecutionData, INodeParams, NodeType } from '../../src/Interface'
import { handleErrorMessage, returnNodeExecutionData, serializeQueryParams } from '../../src/utils'
import { NETWORK, NETWORK_LABEL, etherscanAPIs } from '../../src/ChainNetwork'
import axios, { AxiosRequestConfig, Method } from 'axios'
import {
    SORT_BY,
    OPERATIONS,
    GET_BNB_BALANCE,
    GET_HISTORICAL_BNB_BALANCE,
    GET_NORMAL_TRANSACTIONS,
    GET_INTERNAL_TRANSACTIONS,
    GET_INTERNAL_TRANSACTIONS_BY_HASH,
    GET_INTERNAL_TRANSACTIONS_BY_BLOCK,
    GET_BLOCKS_VALIDATED,
    GET_ABI,
    GET_CONTRACT_SOURCE_CODE,
    CHECK_TRANSACTION_RECEIPT_STATUS,
    GET_BEP20_TOKEN_SUPPLY,
    GET_BEP20_TOKEN_BALANCE,
    GET_HISTORICAL_BEP20_TOKEN_SUPPLY,
    GET_HISTORICAL_BEP20_TOKEN_BALANCE,
    GET_TOKEN_INFO,
    GET_BNB_PRICE,
    GET_HISTORICAL_BNB_PRICE,
    GET_MULTI_BNB_BALANCE,
    GET_BEP20_CIRCULATION_TOKEN_SUPPLY
} from './constants'
class Bscscan implements INode {
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
        this.label = 'BscScan'
        this.name = 'BscScan'
        this.icon = 'bscscan.svg'
        this.type = 'action'
        this.category = 'Block Explorer'
        this.version = 1.0
        this.description = 'Perform Bscscan operations'
        this.incoming = 1
        this.outgoing = 1
        this.actions = [
            {
                label: 'API',
                name: 'api',
                type: 'options',
                options: [
                    {
                        label: 'Get Bnb Balance for a Single Address',
                        name: GET_BNB_BALANCE.name,
                        description: 'Returns the Bnb balance of a given address.'
                    },
                    {
                        label: 'Get Bnb Balance for Multiple Addresses(separated by a comma)',
                        name: GET_MULTI_BNB_BALANCE.name,
                        description: 'Returns the Bnb balance of the addresses(each address separated by a comma) entered.'
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
                        label: 'Get BEP-20 Token Circulating Supply by ContractAddress',
                        name: GET_BEP20_CIRCULATION_TOKEN_SUPPLY.name,
                        description: `Returns the current circulating supply of a BEP-20 token. 
                        Eg. a token with a balance of 215.241526476136819398 and 18 decimal places will be returned as 215241526476136819398`
                    },
                    {
                        label: 'Get BEP20 Token Supply',
                        name: GET_BEP20_TOKEN_SUPPLY.name,
                        description: `Returns the total supply of a BEP-20 token. The result is returned in the token's smallest decimal representation.
                        Eg. a token with a balance of 215.241526476136819398 and 18 decimal places will be returned as 215241526476136819398`
                    },
                    {
                        label: 'Get BEP20 Token Balance',
                        name: GET_BEP20_TOKEN_BALANCE.name,
                        description: `Returns the current balance of a BEP-20 token of an address. The result is returned in the token's smallest decimal representation.
                        Eg. a token with a balance of 215.241526476136819398 and 18 decimal places will be returned as 215241526476136819398`
                    },
                    {
                        label: 'Get Historical BEP-20 Token TotalSupply by ContractAddress & BlockNo [PRO]',
                        name: GET_HISTORICAL_BEP20_TOKEN_SUPPLY.name,
                        description: `Returns the historical amount of a BEP-20 token in circulation at a certain block height. The result is returned in the token's smallest decimal representation.
                        Eg. a token with a balance of 215.241526476136819398 and 18 decimal places will be returned as 215241526476136819398`
                    },
                    {
                        label: 'Get Historical BEP-20 Token Account Balance by ContractAddress & BlockNo [PRO]',
                        name: GET_HISTORICAL_BEP20_TOKEN_BALANCE.name,
                        description: `Returns the balance of a BEP-20 token of an address at a certain block height. The result is returned in the token's smallest decimal representation.
                        Eg. a token with a balance of 215.241526476136819398 and 18 decimal places will be returned as 215241526476136819398`
                    },
                    {
                        label: 'Get Token Info [PRO]',
                        name: GET_TOKEN_INFO.name,
                        description: 'Returns project information and social media links of an BEP-20/ERC-721 token.'
                    },
                    {
                        label: 'Get BNB Price',
                        name: GET_BNB_PRICE.name,
                        description: 'Returns the latest price of 1 BNB.'
                    },
                    {
                        label: 'Get Historical BNB Price [PRO]',
                        name: GET_HISTORICAL_BNB_PRICE.name,
                        description: 'Returns the historical price of BNB.'
                    }
                ],

                default: 'getBnbBalance'
            }
        ] as INodeParams[]
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [
                    {
                        label: NETWORK_LABEL.BSC,
                        name: NETWORK.BSC
                    },
                    {
                        label: NETWORK_LABEL.BSC_TESTNET,
                        name: NETWORK.BSC_TESTNET
                    }
                ],
                default: 'homestead'
            }
        ] as INodeParams[]
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'BscScan API Key',
                        name: 'bscscanApi'
                    }
                ],
                default: 'bscscanApi'
            }
        ] as INodeParams[]
        this.inputParameters = [
            {
                label: 'Address',
                name: 'address',
                type: 'string',
                description: 'The address parameter(s) required',
                show: {
                    'actions.api': [
                        GET_BNB_BALANCE.name,
                        GET_HISTORICAL_BNB_BALANCE.name,
                        GET_NORMAL_TRANSACTIONS.name,
                        GET_INTERNAL_TRANSACTIONS.name,
                        GET_BLOCKS_VALIDATED.name,
                        GET_ABI.name,
                        GET_CONTRACT_SOURCE_CODE.name,
                        GET_BEP20_TOKEN_BALANCE.name,
                        GET_HISTORICAL_BEP20_TOKEN_BALANCE.name
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
                        GET_HISTORICAL_BNB_BALANCE.name,
                        GET_HISTORICAL_BEP20_TOKEN_SUPPLY.name,
                        GET_HISTORICAL_BEP20_TOKEN_BALANCE.name
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
                description: 'the contract address of the BEP-20 token',
                show: {
                    'actions.api': [
                        GET_BEP20_TOKEN_SUPPLY.name,
                        GET_BEP20_TOKEN_BALANCE.name,
                        GET_HISTORICAL_BEP20_TOKEN_SUPPLY.name,
                        GET_HISTORICAL_BEP20_TOKEN_BALANCE.name,
                        GET_TOKEN_INFO.name,
                        GET_BEP20_CIRCULATION_TOKEN_SUPPLY.name
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
                    'actions.api': [GET_BEP20_TOKEN_BALANCE.name]
                }
            },
            {
                label: 'Start Time',
                name: 'startTime',
                type: 'date',
                optional: true,
                show: {
                    'actions.api': [GET_HISTORICAL_BNB_PRICE.name]
                }
            },
            {
                label: 'End Time',
                name: 'endTime',
                type: 'date',
                optional: true,
                show: {
                    'actions.api': [GET_HISTORICAL_BNB_PRICE.name]
                }
            }
        ] as INodeParams[]
    }

    getNetwork(network: NETWORK): string {
        return `${etherscanAPIs[network]}`
    }

    getBaseParams(api: string) {
        const operation = OPERATIONS.filter(({ name }) => name === api)[0]
        return { module: operation.module, action: operation.action }
    }

    getISODate(date: Date) {
        return date.toISOString().split('T')[0]
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        const actionData = nodeData.actions
        const networksData = nodeData.networks
        const inputParameters = nodeData.inputParameters
        const credentials = nodeData.credentials
        if (actionData === undefined || inputParameters === undefined || credentials === undefined || networksData === undefined) {
            throw new Error('Required data missing')
        }
        // GET api
        const api = actionData.api as string

        // GET network
        const network = networksData.network as NETWORK
        // GET credentials
        const apiKey = credentials.apiKey as string

        // GET address
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
module.exports = { nodeClass: Bscscan }
