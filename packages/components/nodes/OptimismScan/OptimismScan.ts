import { ICommonObject, INode, INodeData, INodeExecutionData, INodeParams, NodeType } from '../../src/Interface'
import { handleErrorMessage, returnNodeExecutionData, serializeQueryParams } from '../../src/utils'
import axios, { AxiosRequestConfig, Method } from 'axios'
import {
    OPERATIONS,
    SORT_BY,
    GET_ETH_BALANCE,
    GET_ETH_BALANCE_MULTI,
    GET_NORMAL_TRANSACTIONS,
    GET_ERC20_TOKEN_TRANSFER,
    GET_DEPOSIT,
    GET_WITHDRAWAL,
    GET_CONTRACT_ABI,
    GET_CONTRACT_SOURCE_CODE,
    GET_ERC20_TOKEN_SUPPLY,
    GET_ERC20_TOKEN_ACCOUNT_BALANCE
} from './constants'

class OptimismScan implements INode {
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
        this.label = 'Optimism Scan'
        this.name = 'optimismscan'
        this.icon = 'optimismScan.svg'
        this.type = 'action'
        this.category = 'Block Explorer'
        this.version = 1.0
        this.description = 'Optimism Public API'
        this.incoming = 1
        this.outgoing = 1

        // parameter
        this.actions = [
            {
                label: 'API',
                name: 'api',
                type: 'options',
                description: 'Choose the API to execute',
                options: [
                    // Account
                    {
                        label: 'Get ETH Balance',
                        name: GET_ETH_BALANCE.name,
                        description: 'Get ETH Balance for a single Address'
                    },
                    {
                        label: 'Get ETH Balance Multi',
                        name: GET_ETH_BALANCE_MULTI.name,
                        description: 'Get ETH Balance for multiple Addresses in a single call'
                    },
                    {
                        label: 'Get ERC20 Token Transfer Events',
                        name: GET_ERC20_TOKEN_TRANSFER.name,
                        description: 'Get a list of "ERC-20 - Token Transfer Events" by Address'
                    },
                    {
                        label: 'Get Deposit History',
                        name: GET_DEPOSIT.name,
                        description: 'Get list of L1 Deposits done by Address'
                    },
                    {
                        label: 'Get Withdrawal History',
                        name: GET_WITHDRAWAL.name,
                        description: 'Get list of L2 Withdrawals done by Address'
                    },
                    {
                        label: 'Get Contract ABI',
                        name: GET_CONTRACT_ABI.name,
                        description: 'Get Contract ABI for Verified Contract Source Codes'
                    },
                    {
                        label: 'Get Contract Source Code',
                        name: GET_CONTRACT_SOURCE_CODE.name,
                        description:
                            'Get Contract Source Code for Verified Contract Source Codes. (Replace the address with the actual contract address)'
                    },
                    {
                        label: 'Get ERC-20 Token Total Supply',
                        name: GET_ERC20_TOKEN_SUPPLY.name,
                        description: 'Get ERC-20 Token Total Supply by Contract Address'
                    },
                    {
                        label: 'Get ERC-20 Token Account Balance',
                        name: GET_ERC20_TOKEN_ACCOUNT_BALANCE.name,
                        description: 'Get ERC-20 Token Account Balance by Contract Address and Address'
                    }
                ],
                default: GET_ETH_BALANCE.name
            }
        ] as INodeParams[]

        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'OptimismScan API Key',
                        name: 'optimisticEtherscanApi'
                    }
                ],
                default: 'optimisticEtherscanApi'
            }
        ] as INodeParams[]

        this.inputParameters = [
            {
                label: 'Address',
                name: 'address',
                type: 'string',
                show: {
                    'actions.api': [
                        GET_ETH_BALANCE.name,
                        GET_NORMAL_TRANSACTIONS.name,
                        GET_ERC20_TOKEN_TRANSFER.name,
                        GET_DEPOSIT.name,
                        GET_WITHDRAWAL.name,
                        GET_CONTRACT_ABI.name,
                        GET_CONTRACT_SOURCE_CODE.name,
                        GET_ERC20_TOKEN_ACCOUNT_BALANCE.name
                    ]
                }
            },
            {
                label: 'Addresses',
                name: 'addresses',
                type: 'array',
                array: [
                    {
                        label: 'Address',
                        name: 'address',
                        type: 'string'
                    }
                ],
                show: {
                    'actions.api': [GET_ETH_BALANCE_MULTI.name]
                }
            },
            {
                label: 'Tag',
                name: 'tag',
                type: 'options',
                options: [{ label: 'latest', name: 'latest' }],
                default: 'latest',
                show: {
                    'actions.api': [GET_ETH_BALANCE.name, GET_ETH_BALANCE_MULTI.name, GET_ERC20_TOKEN_ACCOUNT_BALANCE.name]
                }
            },
            {
                label: 'Start Block',
                name: 'startBlock',
                type: 'number',
                optional: true,
                description: 'the block number to start searching for transactions',
                show: {
                    'actions.api': [GET_NORMAL_TRANSACTIONS.name, GET_ERC20_TOKEN_TRANSFER.name]
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
                    'actions.api': [GET_NORMAL_TRANSACTIONS.name, GET_ERC20_TOKEN_TRANSFER.name]
                }
            },
            {
                label: 'Page',
                name: 'page',
                type: 'number',
                optional: true,
                description: 'the page number, if pagination is enabled',
                show: {
                    'actions.api': [GET_NORMAL_TRANSACTIONS.name, GET_ERC20_TOKEN_TRANSFER.name]
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
                    'actions.api': [GET_NORMAL_TRANSACTIONS.name, GET_ERC20_TOKEN_TRANSFER.name]
                },
                default: 10
            },
            {
                label: 'Sort By',
                name: 'sortBy',
                type: 'options',
                options: SORT_BY,
                optional: true,
                show: {
                    'actions.api': [GET_NORMAL_TRANSACTIONS.name, GET_ERC20_TOKEN_TRANSFER.name, GET_DEPOSIT.name]
                },
                default: 'desc'
            },
            {
                label: 'Contract Address [Optional]',
                name: 'contractAddressOptional',
                type: 'string',
                description: 'the contract address of the ERC-20 token',
                optional: true,
                show: {
                    'actions.api': [GET_ERC20_TOKEN_TRANSFER.name]
                }
            },
            {
                label: 'Contract Address',
                name: 'contractAddress',
                type: 'string',
                description: 'the contract address of the ERC-20 token',
                show: {
                    'actions.api': [GET_ERC20_TOKEN_SUPPLY.name, GET_ERC20_TOKEN_ACCOUNT_BALANCE.name]
                }
            },
            {
                label: 'Token Address',
                name: 'tokenAddress',
                type: 'string',
                description: 'the contract address of the ERC-20 token',
                optional: true,
                show: {
                    'actions.api': [GET_DEPOSIT.name]
                }
            }
        ] as INodeParams[]
    }

    getBaseParams(api: string) {
        const operation = OPERATIONS.filter(({ name }) => name === api)[0]
        return { module: operation.module, action: operation.action }
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        const url = 'https://api-optimistic.etherscan.io/api'
        const { actions, inputParameters, credentials } = nodeData

        if (actions === undefined || inputParameters === undefined || credentials === undefined) {
            throw new Error('Required data missing')
        }

        const api = actions.api as string
        const apiKey = credentials.apiKey as string

        const singleAddress = inputParameters.address as string
        const multiAddresses = (inputParameters.addresses as ICommonObject[]) || []
        const startblock = inputParameters.startBlock as number
        const endblock = inputParameters.endBlock as number
        const page = inputParameters.page as number
        const offset = inputParameters.offset as number
        const sort = inputParameters.sortBy as string
        const tag = inputParameters.tag as string
        const contractAddress = inputParameters.contractAddress as string
        const tokenAddress = inputParameters.tokenAddress as string
        const contractAddressOptional = inputParameters.contractAddressOptional || undefined

        const { module, action } = this.getBaseParams(api)
        const address = singleAddress || multiAddresses.map(({ address }) => address).join(',')
        const contractaddress = contractAddress ? contractAddress : contractAddressOptional

        const queryParameters = {
            module,
            action,
            address,
            tag,
            apiKey,
            startblock,
            endblock,
            page,
            offset,
            sort,
            tokenAddress,
            contractaddress
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

module.exports = { nodeClass: OptimismScan }
