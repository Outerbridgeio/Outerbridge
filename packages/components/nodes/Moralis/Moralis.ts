import { ICommonObject, INode, INodeData, INodeExecutionData, INodeOptionsValue, INodeParams, NodeType } from '../../src/Interface'
import { handleErrorMessage, returnNodeExecutionData, serializeQueryParams } from '../../src/utils'
import axios, { AxiosRequestConfig, AxiosRequestHeaders, Method } from 'axios'
import { MoralisSupportedNetworks } from './supportedNetwork'
import {
    getBlock,
    getContractEvents,
    getDateToBlock,
    getNativeBalance,
    getTokenBalances,
    getTransaction,
    nativeEvmOperation,
    runContractFunction
} from './extendedEVMOperation'
import {
    getContractNFTs,
    getNFTLowestPrice,
    getWalletNFTs,
    getNFTsForContract,
    getNFTTrades,
    getWalletNFTTransfers,
    getNFTTransfersByBlock,
    getNFTTokenIdMetadata,
    getWalletNFTCollections,
    getNFTTokenIdTransfers,
    nftOperation,
    reSyncMetadata
} from './extendedNFTOperation'
import { defiOperation, getPairAddress, getPairReserves } from './extendedDeFiOperation'

class Moralis implements INode {
    label: string
    name: string
    type: NodeType
    description: string
    version: number
    icon: string
    incoming: number
    outgoing: number
    actions?: INodeParams[]
    networks?: INodeParams[]
    credentials?: INodeParams[]
    inputParameters?: INodeParams[]

    constructor() {
        this.label = 'Moralis'
        this.name = 'moralis'
        this.icon = 'moralis.svg'
        this.type = 'action'
        this.version = 1.0
        this.description = 'Execute Moralis APIs'
        this.incoming = 1
        this.outgoing = 1
        this.actions = [
            {
                label: 'API',
                name: 'api',
                type: 'options',
                options: [
                    {
                        label: 'EVM API',
                        name: 'evmAPI',
                        description: 'API for interacting/fetching standard onchain data using Moralis API key.'
                    },
                    {
                        label: 'NFT API',
                        name: 'nftAPI',
                        description: 'API for interacting/fetching NFT data using Moralis API key.'
                    },
                    {
                        label: 'DeFi API',
                        name: 'defiAPI',
                        description: 'API for interacting/fetching DeFi data using Moralis API key.'
                    },
                    {
                        label: 'Upload to IPFS',
                        name: 'uploadFolder',
                        description: 'Upload multiple files in a folder to IPFS and place them in a folder directory.'
                    }
                ],
                default: 'evmAPI'
            },
            {
                label: 'Folder',
                name: 'folderContent',
                type: 'folder',
                description: 'The path to a folder to be uploaded.',
                show: {
                    'actions.api': ['uploadFolder']
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
                        label: 'Moralis API Key',
                        name: 'moralisApi'
                    }
                ],
                default: 'moralisApi'
            }
        ] as INodeParams[]
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [...MoralisSupportedNetworks],
                hide: {
                    'actions.api': ['uploadFolder']
                }
            }
        ] as INodeParams[]
        this.inputParameters = [
            {
                label: 'Operation',
                name: 'operation',
                type: 'asyncOptions',
                loadMethod: 'getOperations',
                hide: {
                    'actions.api': ['uploadFolder']
                }
            },
            /**
             * nativeEvmOperation
             */
            ...getBlock,
            ...getDateToBlock,
            ...getTransaction,
            ...getContractEvents,
            ...runContractFunction,
            ...getNativeBalance,
            ...getTokenBalances,
            /**
             * nftOperation
             */
            ...getNFTTransfersByBlock,
            ...getWalletNFTs,
            ...getWalletNFTTransfers,
            ...getWalletNFTCollections,
            ...getNFTsForContract,
            ...getNFTTrades,
            ...getNFTLowestPrice,
            ...getContractNFTs,
            ...reSyncMetadata,
            ...getNFTTokenIdMetadata,
            ...getNFTTokenIdTransfers,
            /**
             * defiOperation
             */
            ...getPairReserves,
            ...getPairAddress
        ]
    }

    loadMethods = {
        async getOperations(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []
            const actionData = nodeData.actions
            if (actionData === undefined) {
                return returnData
            }

            const api = actionData.api as string

            if (api === 'evmAPI') {
                return nativeEvmOperation
            } else if (api === 'nftAPI') {
                return nftOperation
            } else if (api === 'defiAPI') {
                return defiOperation
            } else if (api === 'ipfsAPI') {
                return [
                    {
                        label: 'Upload Folder',
                        name: 'uploadFolder',
                        description: 'Upload multiple files in a folder to IPFS and place them in a folder directory.'
                    }
                ]
            } else {
                return returnData
            }
        }
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        const actionData = nodeData.actions
        const networksData = nodeData.networks
        const inputParametersData = nodeData.inputParameters
        const credentials = nodeData.credentials

        if (actionData === undefined || networksData === undefined || credentials === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing')
        }

        const api = actionData.api as string
        const operation = inputParametersData.operation as string
        const chain = networksData.network as string
        const apiKey = credentials.apiKey as string

        const returnData: ICommonObject[] = []
        let responseData: any

        let url = ''
        const queryParameters: ICommonObject = {}
        if (chain) queryParameters['chain'] = chain
        let queryBody: any = {}
        let method: Method = 'GET'
        const headers: AxiosRequestHeaders = {
            'Content-Type': 'application/json',
            'X-Api-Key': apiKey
        }

        try {
            /**
             * nativeEvmOperation
             */
            if (operation === 'getBlock') {
                const block_number_or_hash = inputParametersData.block_number_or_hash as string

                url = `https://deep-index.moralis.io/api/v2/block/${block_number_or_hash}`

                const subdomain = inputParametersData.subdomain as string

                if (subdomain) queryParameters['subdomain'] = chain
            } else if (operation === 'getDateToBlock') {
                url = 'https://deep-index.moralis.io/api/v2/dateToBlock'

                const providerUrl = inputParametersData.providerUrl as string
                const date = Date.parse(inputParametersData.date as string)

                if (providerUrl) queryParameters['providerUrl'] = providerUrl
                if (date) queryParameters['date'] = date
            } else if (operation === 'getTransaction') {
                const transaction_hash = inputParametersData.transaction_hash as string

                url = `https://deep-index.moralis.io/api/v2/transaction/${transaction_hash}`

                const subdomain = inputParametersData.subdomain as string

                if (subdomain) queryParameters['subdomain'] = chain
            } else if (operation === 'getContractEvents') {
                method = 'POST'
                const address = inputParametersData.address as string

                url = `https://deep-index.moralis.io/api/v2/${address}/events`

                const topic = inputParametersData.topic as string
                const subdomain = inputParametersData.subdomain as string
                const providerUrl = inputParametersData.providerUrl as string
                const from_date = inputParametersData.from_date as string
                const to_date = inputParametersData.to_date as string
                const from_block = inputParametersData.from_block as number
                const to_block = inputParametersData.to_block as number

                if (topic) queryParameters['topic'] = topic
                if (subdomain) queryParameters['subdomain'] = chain
                if (providerUrl) queryParameters['providerUrl'] = providerUrl
                if (from_date) queryParameters['from_date'] = Date.parse(from_date)
                if (to_date) queryParameters['to_date'] = Date.parse(to_date)
                if (from_block) queryParameters['from_block'] = from_block
                if (to_block) queryParameters['to_block'] = to_block
            } else if (operation === 'runContractFunction') {
                method = 'POST'
                const address = inputParametersData.address as string

                url = `https://deep-index.moralis.io/api/v2/${address}/function`

                const function_name = inputParametersData.function_name as string
                const subdomain = inputParametersData.subdomain as string
                const providerUrl = inputParametersData.providerUrl as string
                const abi_str = inputParametersData.abi as string
                let abi = []
                if (abi_str) abi = JSON.parse(abi_str.replace(/\s/g, ''))
                const params_str = inputParametersData.params as string
                let params = []
                if (params_str) params = JSON.parse(params_str.replace(/\s/g, ''))

                if (function_name) queryParameters['function_name'] = function_name
                if (subdomain) queryParameters['subdomain'] = chain
                if (providerUrl) queryParameters['providerUrl'] = providerUrl

                if (abi_str) queryBody['abi'] = abi
                if (params_str) queryBody['params'] = params
            } else if (operation === 'getTransactions') {
                const address = inputParametersData.address as string

                url = `https://deep-index.moralis.io/api/v2/${address}`

                const subdomain = inputParametersData.subdomain as string
                const from_date = inputParametersData.from_date as string
                const to_date = inputParametersData.to_date as string
                const from_block = inputParametersData.from_block as number
                const to_block = inputParametersData.to_block as number

                if (subdomain) queryParameters['subdomain'] = chain
                if (from_date) queryParameters['from_date'] = Date.parse(from_date)
                if (to_date) queryParameters['to_date'] = Date.parse(to_date)
                if (from_block) queryParameters['from_block'] = from_block
                if (to_block) queryParameters['to_block'] = to_block
            } else if (operation === 'getNativeBalance') {
                const address = inputParametersData.address as string

                url = `https://deep-index.moralis.io/api/v2/${address}/balance`

                const providerUrl = inputParametersData.providerUrl as string
                const to_block = inputParametersData.to_block as number

                if (providerUrl) queryParameters['providerUrl'] = providerUrl
                if (to_block) queryParameters['to_block'] = to_block
            } else if (operation === 'getTokenBalances') {
                const address = inputParametersData.address as string

                url = `https://deep-index.moralis.io/api/v2/${address}/erc20`

                const subdomain = inputParametersData.subdomain as string
                const to_block = inputParametersData.to_block as number
                const token_addresses_str = inputParametersData.token_addresses as string
                let token_addresses = []
                if (token_addresses_str) token_addresses = JSON.parse(token_addresses_str.replace(/\s/g, ''))

                if (subdomain) queryParameters['subdomain'] = subdomain
                if (to_block) queryParameters['to_block'] = to_block
                if (token_addresses) queryParameters['token_addresses'] = token_addresses
            } else if (operation === 'getTokenTransfers') {
                const address = inputParametersData.address as string

                url = `https://deep-index.moralis.io/api/v2/${address}/erc20/transfers`

                const subdomain = inputParametersData.subdomain as string
                const from_date = inputParametersData.from_date as string
                const to_date = inputParametersData.to_date as string
                const from_block = inputParametersData.from_block as number
                const to_block = inputParametersData.to_block as number

                if (subdomain) queryParameters['subdomain'] = chain
                if (from_date) queryParameters['from_date'] = Date.parse(from_date)
                if (to_date) queryParameters['to_date'] = Date.parse(to_date)
                if (from_block) queryParameters['from_block'] = from_block
                if (to_block) queryParameters['to_block'] = to_block
            }

            /**
             * nftOperation
             */
            if (operation === 'getNFTTransfersByBlock') {
                const block_number_or_hash = inputParametersData.block_number_or_hash as string

                url = `https://deep-index.moralis.io/api/v2/block/${block_number_or_hash}/nft/transfers`

                const subdomain = inputParametersData.subdomain as string

                if (subdomain) queryParameters['subdomain'] = chain
            } else if (operation === 'getWalletNFTs') {
                const address = inputParametersData.address as string

                url = `https://deep-index.moralis.io/api/v2/${address}/nft`

                const format = inputParametersData.format as string
                if (format) queryParameters['format'] = format

                const token_addresses_str = inputParametersData.token_addresses as string
                let token_addresses = []
                if (token_addresses_str) {
                    token_addresses = JSON.parse(token_addresses_str.replace(/\s/g, ''))
                    queryParameters['token_addresses'] = token_addresses
                }
            } else if (operation === 'getWalletNFTTransfers') {
                const address = inputParametersData.address as string

                url = `https://deep-index.moralis.io/api/v2/${address}/nft/transfers`

                const format = inputParametersData.format as string
                const direction = inputParametersData.direction as string
                const from_block = inputParametersData.from_block as number
                const to_block = inputParametersData.to_block as number

                if (format) queryParameters['format'] = format
                if (direction) queryParameters['direction'] = direction
                if (from_block) queryParameters['from_block'] = from_block
                if (to_block) queryParameters['to_block'] = to_block
            } else if (operation === 'getWalletNFTCollections') {
                const address = inputParametersData.address as string

                url = `https://deep-index.moralis.io/api/v2/${address}/nft/collections`
            } else if (operation === 'getNFTsForContract') {
                const address = inputParametersData.address as string
                const token_address = inputParametersData.token_address as string

                url = `https://deep-index.moralis.io/api/v2/${address}/nft/${token_address}`

                const format = inputParametersData.format as string
                if (format) queryParameters['format'] = format
            } else if (operation === 'getNFTTrades') {
                const address = inputParametersData.address as string

                url = `https://deep-index.moralis.io/api/v2/nft/${address}/trades`

                const marketplace = inputParametersData.marketplace as string
                const format = inputParametersData.format as string
                const providerUrl = inputParametersData.providerUrl as string
                const from_block = inputParametersData.from_block as number
                const to_block = inputParametersData.to_block as number
                const from_date = inputParametersData.from_date as string
                const to_date = inputParametersData.to_date as string

                if (format) queryParameters['format'] = format
                if (marketplace) queryParameters['marketplace'] = marketplace
                if (providerUrl) queryParameters['providerUrl'] = providerUrl
                if (from_block) queryParameters['from_block'] = from_block
                if (to_block) queryParameters['to_block'] = to_block
                if (from_date) queryParameters['from_date'] = Date.parse(from_date)
                if (to_date) queryParameters['to_date'] = Date.parse(to_date)
            } else if (operation === 'getNFTLowestPrice') {
                const address = inputParametersData.address as string

                url = `https://deep-index.moralis.io/api/v2/nft/${address}/lowestprice`

                const marketplace = inputParametersData.marketplace as string
                const days = inputParametersData.format as number
                const providerUrl = inputParametersData.providerUrl as string

                if (days) queryParameters['days'] = days
                if (marketplace) queryParameters['marketplace'] = marketplace
                if (providerUrl) queryParameters['providerUrl'] = providerUrl
            } else if (operation === 'getNFTTransfersFromToBlock') {
                url = `https://deep-index.moralis.io/api/v2/nft/transfers`

                const format = inputParametersData.format as string
                const from_block = inputParametersData.from_block as number
                const to_block = inputParametersData.to_block as number
                const from_date = inputParametersData.from_date as string
                const to_date = inputParametersData.to_date as string

                if (format) queryParameters['format'] = format
                if (from_block) queryParameters['from_block'] = from_block
                if (to_block) queryParameters['to_block'] = to_block
                if (from_date) queryParameters['from_date'] = Date.parse(from_date)
                if (to_date) queryParameters['to_date'] = Date.parse(to_date)
            } else if (operation === 'getContractNFTs') {
                const address = inputParametersData.address as string

                url = `https://deep-index.moralis.io/api/v2/nft/${address}`

                const format = inputParametersData.format as string
                const totalRanges = inputParametersData.totalRanges as number
                const range = inputParametersData.range as number

                if (format) queryParameters['format'] = format
                if (totalRanges) queryParameters['totalRanges'] = totalRanges
                if (range) queryParameters['range'] = range
            } else if (operation === 'getNFTContractTransfers') {
                const address = inputParametersData.address as string

                url = `https://deep-index.moralis.io/api/v2/nft/${address}/transfers`

                const format = inputParametersData.format as string
                if (format) queryParameters['format'] = format
            } else if (operation === 'getNFTOwners') {
                const address = inputParametersData.address as string

                url = `https://deep-index.moralis.io/api/v2/nft/${address}/owners`

                const format = inputParametersData.format as string
                if (format) queryParameters['format'] = format
            } else if (operation === 'getNFTMetadata') {
                const address = inputParametersData.address as string

                url = `https://deep-index.moralis.io/api/v2/nft/${address}/metadata`
            } else if (operation === 'reSyncMetadata') {
                const address = inputParametersData.address as string
                const token_id = inputParametersData.token_id as string

                url = `https://deep-index.moralis.io/api/v2/nft/${address}/${token_id}/metadata/resync`

                const flag = inputParametersData.flag as string
                const mode = inputParametersData.mode as string

                if (flag) queryParameters['flag'] = flag
                if (mode) queryParameters['mode'] = mode
            } else if (operation === 'syncNFTContract') {
                method = 'PUT'
                const address = inputParametersData.address as string

                url = `https://deep-index.moralis.io/api/v2/nft/${address}/sync`
            } else if (operation === 'getNFTTokenIdMetadata') {
                const address = inputParametersData.address as string
                const token_id = inputParametersData.token_id as string

                url = `https://deep-index.moralis.io/api/v2/nft/${address}/${token_id}`

                const format = inputParametersData.format as string
                if (format) queryParameters['format'] = format
            } else if (operation === 'getNFTTokenIdOwners') {
                const address = inputParametersData.address as string
                const token_id = inputParametersData.token_id as string

                url = `https://deep-index.moralis.io/api/v2/nft/${address}/${token_id}/owners`

                const format = inputParametersData.format as string
                if (format) queryParameters['format'] = format
            } else if (operation === 'getNFTTokenIdTransfers') {
                const address = inputParametersData.address as string
                const token_id = inputParametersData.token_id as string

                url = `https://deep-index.moralis.io/api/v2/nft/${address}/${token_id}/transfers`

                const format = inputParametersData.format as string
                const order = inputParametersData.order as string

                if (format) queryParameters['format'] = format
                if (order) queryParameters['order'] = order
            }
            /**
             * defiOperation
             */
            if (operation === 'getPairReserves') {
                const pair_address = inputParametersData.pair_address as string

                url = `https://deep-index.moralis.io/api/v2/${pair_address}/reserves`

                const to_block = inputParametersData.to_block as number
                const to_date = inputParametersData.to_date as string

                if (to_block) queryParameters['to_block'] = to_block
                if (to_date) queryParameters['to_date'] = Date.parse(to_date)
            } else if (operation === 'getPairAddress') {
                const token0_address = inputParametersData.token0_address as string
                const token1_address = inputParametersData.token1_address as string

                url = `https://deep-index.moralis.io/api/v2/${token0_address}/${token1_address}/pairAddress`

                const to_block = inputParametersData.to_block as number
                const to_date = inputParametersData.to_date as string
                const exchange = inputParametersData.exchange as string

                if (to_block) queryParameters['to_block'] = to_block
                if (to_date) queryParameters['to_date'] = Date.parse(to_date)
                if (exchange) queryParameters['exchange'] = exchange
            }
            /**
             * ipfsOperation
             */
            if (api === 'uploadFolder') {
                method = 'POST'
                url = 'https://deep-index.moralis.io/api/v2/ipfs/uploadFolder'

                const bodyParams = []
                const folderContent = actionData.folderContent as string
                const base64Array = JSON.parse(folderContent.replace(/\s/g, ''))

                for (let i = 0; i < base64Array.length; i += 1) {
                    const fileBase64 = base64Array[i]
                    const splitDataURI = fileBase64.split(',')

                    const filepath = (splitDataURI.pop() || 'filepath:').split(':')[1]
                    const content = splitDataURI.pop() || ''
                    bodyParams.push({
                        path: filepath,
                        content
                    })
                }
                queryBody = bodyParams
            }

            const axiosConfig: AxiosRequestConfig = {
                method,
                url,
                headers
            }

            if (Object.keys(queryParameters).length > 0) {
                axiosConfig.params = queryParameters
                axiosConfig.paramsSerializer = (params) => serializeQueryParams(params, true)
            }

            if (Object.keys(queryBody).length > 0) {
                axiosConfig.data = queryBody
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
}

module.exports = { nodeClass: Moralis }
