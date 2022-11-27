import { ICommonObject, INode, INodeData, INodeExecutionData, INodeOptionsValue, INodeParams, NodeType } from '../../src/Interface'
import { handleErrorMessage, returnNodeExecutionData, serializeQueryParams } from '../../src/utils'
import { alchemyHTTPAPIs, NETWORK } from '../../src/ChainNetwork'
import {
    alchemySupportedNetworks,
    ethOperations,
    IETHOperation,
    operationCategoryMapping,
    polygonOperations
} from '../../src/ETHOperations'
import {
    getContractsForOwnerProperties,
    getNFTMetadataProperties,
    getNFTsForCollectionProperties,
    getNFTsProperties,
    getOwnersForCollectionProperties,
    getOwnersForTokenProperties,
    isHolderOfCollectionProperties,
    NFTOperationsOptions,
    searchContractMetadataProperties,
    tokenAPIOperations,
    transactionReceiptsOperations
} from './extendedOperation'
import axios, { AxiosRequestConfig, Method } from 'axios'
import { solanaAPIOperations, solanaOperationsNetworks } from './solanaOperation'
import { AlchemySupportedNetworks } from './supportedNetwork'

class Alchemy implements INode {
    label: string
    name: string
    type: NodeType
    description: string
    version: number
    icon: string
    category: string
    incoming: number
    outgoing: number
    credentials?: INodeParams[]
    networks?: INodeParams[]
    inputParameters?: INodeParams[]

    constructor() {
        this.label = 'Alchemy'
        this.name = 'alchemy'
        this.icon = 'alchemy.svg'
        this.type = 'action'
        this.category = 'Network Provider'
        this.version = 1.1
        this.description = 'Perform Alchemy on-chain operations'
        this.incoming = 1
        this.outgoing = 1
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [...AlchemySupportedNetworks]
            }
        ] as INodeParams[]
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Alchemy API Key',
                        name: 'alchemyApi'
                    }
                ],
                default: 'alchemyApi'
            }
        ] as INodeParams[]
        this.inputParameters = [
            {
                label: 'API',
                name: 'api',
                type: 'options',
                options: [
                    {
                        label: 'EVM Chain API',
                        name: 'chainAPI',
                        description: 'API for fetching standard EVM onchain data using Alchemy supported calls',
                        show: {
                            'networks.network': alchemySupportedNetworks
                        }
                    },
                    {
                        label: 'NFT API',
                        name: 'nftAPI',
                        description: 'API for fetching NFT data, including ownership, metadata attributes, and more.',
                        show: {
                            'networks.network': [NETWORK.MAINNET, NETWORK.GÖRLI, NETWORK.MATIC, NETWORK.MATIC_MUMBAI]
                        }
                    },
                    {
                        label: 'Transaction Receipts API',
                        name: 'txReceiptsAPI',
                        description: 'API that gets all transaction receipts for a given block by number or block hash.',
                        show: {
                            'networks.network': [
                                NETWORK.MAINNET,
                                NETWORK.GÖRLI,
                                NETWORK.MATIC,
                                NETWORK.MATIC_MUMBAI,
                                NETWORK.ARBITRUM,
                                NETWORK.ARBITRUM_GOERLI
                            ]
                        }
                    },
                    {
                        label: 'Token API',
                        name: 'tokenAPI',
                        description:
                            'The Token API allows you to easily get token information, minimizing the number of necessary requests.',
                        show: {
                            'networks.network': alchemySupportedNetworks
                        }
                    },
                    {
                        label: 'Solana API',
                        name: 'solanaAPI',
                        description: 'API for fetching Solana on-chain data using Alchemy supported calls',
                        show: {
                            'networks.network': solanaOperationsNetworks
                        }
                    }
                ],
                default: 'chainAPI'
            },
            {
                label: 'Chain Category',
                name: 'chainCategory',
                type: 'options',
                options: [
                    {
                        label: 'Retrieving Blocks',
                        name: 'retrievingBlocks',
                        description: 'Retrieve onchain blocks data'
                    },
                    {
                        label: 'EVM/Smart Contract Execution',
                        name: 'evmExecution',
                        description: 'Execute or submit transaction onto blockchain'
                    },
                    {
                        label: 'Reading Transactions',
                        name: 'readingTransactions',
                        description: 'Read onchain transactions data'
                    },
                    {
                        label: 'Account Information',
                        name: 'accountInformation',
                        description: 'Retrieve onchain account information'
                    },
                    {
                        label: 'Event Logs',
                        name: 'eventLogs',
                        description: 'Fetch onchain logs'
                    },
                    {
                        label: 'Chain Information',
                        name: 'chainInformation',
                        description: 'Get general selected blockchain information'
                    },
                    {
                        label: 'Retrieving Uncles',
                        name: 'retrievingUncles',
                        description: 'Retrieve onchain uncles blocks data'
                    },
                    {
                        label: 'Filters',
                        name: 'filters',
                        description: 'Get block filters and logs, or create new filter'
                    }
                ],
                show: {
                    'inputParameters.api': ['chainAPI']
                }
            },
            {
                label: 'Chain Category',
                name: 'chainCategory',
                type: 'options',
                options: [
                    {
                        label: 'Reading & Writing Transactions',
                        name: 'readWriteTransactions',
                        description: 'Read and Write transactins onto Solana chain'
                    },
                    {
                        label: 'Getting Blocks',
                        name: 'gettingBlocks',
                        description: 'Get Solana blocks data'
                    },
                    {
                        label: 'Account Information',
                        name: 'accountInformation',
                        description: 'Retrieve Solana onchain account information'
                    },
                    {
                        label: 'Network Information',
                        name: 'networkInformation',
                        description: 'Get Solana network onchain information'
                    },
                    {
                        label: 'Slot Information',
                        name: 'slotInformation',
                        description: 'Fetch Solana slot information'
                    },
                    {
                        label: 'Node Information',
                        name: 'nodeInformation',
                        description: 'Retrieve Solana node onchain information'
                    },
                    {
                        label: 'Token Information',
                        name: 'tokenInformation',
                        description: 'Fetch Solana onchain token information'
                    },
                    {
                        label: 'Network Inflation',
                        name: 'networkInflation',
                        description: 'Retrieve Solana network inflation onchain data'
                    }
                ],
                show: {
                    'inputParameters.api': ['solanaAPI']
                }
            },
            {
                label: 'Operation',
                name: 'operation',
                type: 'asyncOptions',
                loadMethod: 'getOperations'
            },
            ...getNFTsProperties,
            ...getNFTMetadataProperties,
            ...getNFTsForCollectionProperties,
            ...getOwnersForCollectionProperties,
            ...getOwnersForTokenProperties,
            ...searchContractMetadataProperties,
            ...isHolderOfCollectionProperties,
            ...getContractsForOwnerProperties,
            {
                label: 'Parameters',
                name: 'parameters',
                type: 'json',
                placeholder: '["param1", "param2"]',
                optional: true,
                description: 'Operation parameters in array. Ex: ["param1", "param2"]',
                show: {
                    'inputParameters.api': ['chainAPI', 'txReceiptsAPI', 'tokenAPI', 'solanaAPI']
                }
            }
        ] as INodeParams[]
    }

    loadMethods = {
        async getOperations(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []
            const inputParametersData = nodeData.inputParameters
            const networksData = nodeData.networks

            if (inputParametersData === undefined || networksData === undefined) {
                return returnData
            }

            const api = inputParametersData.api as string
            const chainCategory = inputParametersData.chainCategory as string
            const network = networksData.network as NETWORK

            if (api === 'chainAPI' || api === 'txReceiptsAPI' || api === 'tokenAPI' || api === 'solanaAPI') {
                const operations = getSelectedOperations(api, network).filter(
                    (op: IETHOperation) =>
                        Object.prototype.hasOwnProperty.call(op.providerNetworks, 'alchemy') &&
                        op.providerNetworks['alchemy'].includes(network)
                )

                if (api === 'chainAPI' && !chainCategory) return returnData
                if (api === 'solanaAPI' && !chainCategory) return returnData

                let filteredOperations: IETHOperation[] = operations
                if (api === 'chainAPI' || api === 'solanaAPI')
                    filteredOperations = operations.filter(
                        (op: IETHOperation) => op.parentGroup === operationCategoryMapping[chainCategory]
                    )

                for (const op of filteredOperations) {
                    returnData.push({
                        label: op.name,
                        name: op.value,
                        parentGroup: op.parentGroup,
                        description: op.description,
                        inputParameters: op.inputParameters,
                        exampleParameters: op.exampleParameters,
                        exampleResponse: op.exampleResponse
                    })
                }
                return returnData
            } else if (api === 'nftAPI') {
                return NFTOperationsOptions
            } else {
                return returnData
            }
        }
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        const networksData = nodeData.networks
        const inputParametersData = nodeData.inputParameters
        const credentials = nodeData.credentials

        if (inputParametersData === undefined || networksData === undefined) {
            throw new Error('Required data missing')
        }

        if (credentials === undefined) {
            throw new Error('Missing credentials')
        }

        // GET api
        const api = inputParametersData.api as string

        // GET network
        const network = networksData.network as NETWORK

        // GET credentials
        const apiKey = credentials.apiKey as string

        // GET operation
        const operation = inputParametersData.operation as string

        if (api === 'chainAPI' || api === 'txReceiptsAPI' || api === 'tokenAPI' || api === 'solanaAPI') {
            const uri = `${alchemyHTTPAPIs[network]}${apiKey}`

            let responseData: any // tslint:disable-line: no-any
            let bodyParameters: any[] = [] // tslint:disable-line: no-any
            const returnData: ICommonObject[] = []

            const parameters = inputParametersData.parameters as string
            if (parameters) {
                try {
                    bodyParameters = JSON.parse(parameters.replace(/\s/g, ''))
                } catch (error) {
                    throw handleErrorMessage(error)
                }
            }

            try {
                let totalOperations: IETHOperation[] = []
                totalOperations = getSelectedOperations(api, network)

                const result = totalOperations.find((obj) => {
                    return obj.value === operation
                })

                if (result === undefined) throw new Error('Invalid Operation')

                const requestBody = JSON.parse(JSON.stringify(result.body))
                const bodyParams = requestBody.params
                requestBody.params = Array.isArray(bodyParameters) ? bodyParameters.concat(bodyParams) : bodyParameters

                const axiosConfig: AxiosRequestConfig = {
                    method: result.method as Method,
                    url: uri,
                    data: requestBody,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                const response = await axios(axiosConfig)
                responseData = response.data
            } catch (error) {
                throw handleErrorMessage(error)
            }

            if (Array.isArray(responseData)) returnData.push(...responseData)
            else returnData.push(responseData)

            return returnNodeExecutionData(returnData)
        }

        //NFT API
        else if (api === 'nftAPI') {
            const uri = `${alchemyHTTPAPIs[network]}${apiKey}/${operation}/`

            let responseData: any // tslint:disable-line: no-any
            const queryParameters: ICommonObject = {}
            const returnData: ICommonObject[] = []

            if (operation === 'getNFTs') {
                const owner = inputParametersData.owner as string
                const pageKey = inputParametersData.pageKey as string
                const withMetadata = inputParametersData.withMetadata as boolean

                queryParameters['owner'] = owner
                queryParameters['withMetadata'] = withMetadata
                if (pageKey) queryParameters['pageKey'] = pageKey
            } else if (operation === 'getNFTMetadata') {
                const contractAddress = inputParametersData.contractAddress as string
                const tokenId = inputParametersData.tokenId as string
                const tokenType = inputParametersData.tokenType as string

                queryParameters['contractAddress'] = contractAddress
                queryParameters['tokenId'] = tokenId
                if (tokenType) queryParameters['tokenType'] = tokenType
            } else if (operation === 'getNFTsForCollection') {
                const contractAddress = inputParametersData.contractAddress as string
                const startToken = inputParametersData.startToken as string
                const withMetadata = inputParametersData.withMetadata as boolean
                const limit = inputParametersData.limit as number
                const tokenUriTimeoutInMs = inputParametersData.tokenUriTimeoutInMs as number

                queryParameters['contractAddress'] = contractAddress
                if (startToken) queryParameters['startToken'] = startToken
                if (withMetadata) queryParameters['withMetadata'] = withMetadata
                if (limit) queryParameters['limit'] = limit
                if (tokenUriTimeoutInMs) queryParameters['tokenUriTimeoutInMs'] = tokenUriTimeoutInMs
            } else if (operation === 'getOwnersForCollection') {
                const contractAddress = inputParametersData.contractAddress as string
                const withTokenBalances = inputParametersData.withTokenBalances as boolean
                const block = inputParametersData.block as string
                const pageKey = inputParametersData.pageKey as string

                queryParameters['contractAddress'] = contractAddress
                if (withTokenBalances) queryParameters['withTokenBalances'] = withTokenBalances
                if (block) queryParameters['block'] = block
                if (pageKey) queryParameters['pageKey'] = pageKey
            } else if (operation === 'getOwnersForToken' || operation === 'computeRarity') {
                const contractAddress = inputParametersData.contractAddress as string
                const tokenId = inputParametersData.tokenId as string

                queryParameters['contractAddress'] = contractAddress
                queryParameters['tokenId'] = tokenId
            } else if (
                operation === 'isSpamContract' ||
                operation === 'reingestContract' ||
                operation === 'getFloorPrice' ||
                operation === 'summarizeNFTAttributes' ||
                operation === 'reportSpamContract'
            ) {
                const contractAddress = inputParametersData.contractAddress as string
                queryParameters['contractAddress'] = contractAddress
            } else if (operation === 'searchContractMetadata') {
                const query = inputParametersData.query as string
                queryParameters['query'] = query
            } else if (operation === 'isHolderOfCollection') {
                const contractAddress = inputParametersData.contractAddress as string
                const wallet = inputParametersData.wallet as string

                queryParameters['contractAddress'] = contractAddress
                queryParameters['wallet'] = wallet
            } else if (operation === 'getNFTSales') {
                const contractAddress = inputParametersData.contractAddress as string
                const tokenId = inputParametersData.tokenId as string
                const startBlock = inputParametersData.startBlock as string
                const startLogIndex = inputParametersData.startLogIndex as number
                const startBundleIndex = inputParametersData.startBundleIndex as number
                const ascendingOrder = inputParametersData.ascendingOrder as boolean
                const marketplace = inputParametersData.marketplace as string
                const buyerAddress = inputParametersData.buyerAddress as string
                const sellerAddress = inputParametersData.sellerAddress as string
                const buyerIsMaker = inputParametersData.buyerIsMaker as boolean
                const limit = inputParametersData.limit as number

                queryParameters['contractAddress'] = contractAddress
                queryParameters['tokenId'] = tokenId
                if (startBlock) queryParameters['startBlock'] = startBlock
                if (startLogIndex) queryParameters['startLogIndex'] = startLogIndex
                if (startBundleIndex) queryParameters['startBundleIndex'] = startBundleIndex
                if (ascendingOrder) queryParameters['ascendingOrder'] = ascendingOrder
                if (marketplace) queryParameters['marketplace'] = marketplace
                if (buyerAddress) queryParameters['buyerAddress'] = buyerAddress
                if (sellerAddress) queryParameters['sellerAddress'] = sellerAddress
                if (buyerIsMaker) queryParameters['buyerIsMaker'] = buyerIsMaker
                if (limit) queryParameters['limit'] = limit
            } else if (operation === 'getContractsForOwner') {
                const owner = inputParametersData.owner as string
                const pageKey = inputParametersData.pageKey as string

                queryParameters['owner'] = owner
                if (pageKey) queryParameters['pageKey'] = pageKey
            }

            try {
                const axiosConfig: AxiosRequestConfig = {
                    method: 'GET',
                    url: uri,
                    params: queryParameters,
                    paramsSerializer: (params) => serializeQueryParams(params),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }

                const response = await axios(axiosConfig)
                responseData = response.data
            } catch (error) {
                throw handleErrorMessage(error)
            }

            if (Array.isArray(responseData)) returnData.push(...responseData)
            else returnData.push(responseData)

            return returnNodeExecutionData(returnData)
        }
        return returnNodeExecutionData([])
    }
}

const getSelectedOperations = (api: string, network: string) => {
    switch (api) {
        case 'chainAPI':
            if (network === NETWORK.MATIC || network === NETWORK.MATIC_MUMBAI) return [...polygonOperations, ...ethOperations]
            else return ethOperations
        case 'txReceiptsAPI':
            return transactionReceiptsOperations
        case 'tokenAPI':
            return tokenAPIOperations
        case 'solanaAPI':
            return solanaAPIOperations
        default:
            return ethOperations
    }
}

module.exports = { nodeClass: Alchemy }
