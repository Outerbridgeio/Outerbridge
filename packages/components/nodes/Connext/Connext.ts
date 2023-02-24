import { create, SdkUtils, SdkConfig } from '@connext/sdk'
import { BigNumber, ContractInterface, ethers } from 'ethers'
import {
    ICommonObject,
    IDbCollection,
    INode,
    INodeData,
    INodeExecutionData,
    INodeOptionsValue,
    INodeParams,
    IWallet,
    NodeType
} from '../../src/Interface'
import { handleErrorMessage, notEmptyRegex, returnNodeExecutionData } from '../../src/utils'
import { domainIdLookup, DOMAIN_ID, NETWORK, WETHAddressLookup } from '../../src/ChainNetwork'
import {
    connextDomainRPC,
    connextMainnetDomainRPC,
    connextTestnetDomainRPC,
    mainnetChains,
    testnetChains,
    tokenList,
    tokenMatches
} from './constants'
import IWETH from '@uniswap/v2-periphery/build/IWETH.json'

class Connext implements INode {
    label: string
    name: string
    type: NodeType
    description: string
    version: number
    icon: string
    category: string
    incoming: number
    outgoing: number
    actions?: INodeParams[]
    networks?: INodeParams[]
    inputParameters?: INodeParams[]

    constructor() {
        this.label = 'Connext'
        this.name = 'connext'
        this.icon = 'connext.png'
        this.type = 'action'
        this.category = 'Cross Chain Bridges'
        this.version = 1.0
        this.description = 'Cross chain bridge transfer using Connext SDK'
        this.incoming = 1
        this.outgoing = 1
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                description: 'Mainnet or Testnet to bridge tokens',
                options: [
                    {
                        label: 'Mainnet',
                        name: 'mainnet',
                        description: 'https://bridge.connext.network/'
                    },
                    {
                        label: 'Testnet',
                        name: 'testnet',
                        description: 'https://testnet.bridge.connext.network/'
                    }
                ]
            }
        ] as INodeParams[]
        this.inputParameters = [
            {
                label: 'From Network',
                name: 'fromNetwork',
                type: 'asyncOptions',
                description: 'Blockchain network you want to transfer FROM.',
                loadMethod: 'getFromNetwork'
            },
            {
                label: 'To Network',
                name: 'toNetwork',
                type: 'asyncOptions',
                description: 'Blockchain network you want to transfer TO.',
                loadMethod: 'getToNetwork'
            },
            {
                label: 'From Token',
                name: 'fromToken',
                type: 'asyncOptions',
                description: 'Token you want to transfer FROM.',
                loadMethod: 'getTokensFromNetwork'
            },
            {
                label: 'To Token',
                name: 'toToken',
                type: 'asyncOptions',
                description: 'Token you want to transfer TO.',
                loadMethod: 'getTokensToNetwork',
                show: {
                    'inputParameters.fromToken': notEmptyRegex
                }
            },
            {
                label: 'Amount To Transfer',
                name: 'amountToBridge',
                type: 'number'
            },
            {
                label: 'Select Wallet',
                name: 'wallet',
                type: 'asyncOptions',
                description: 'Wallet account to transfer tokens.',
                loadFromDbCollections: ['Wallet'],
                loadMethod: 'getWallets'
            },
            {
                label: 'Slippage',
                name: 'slippage',
                description: 'Maximum amount of slippage you are willing to accept (e.g. 30 = 0.3%)',
                type: 'number',
                placeholder: '30',
                optional: true
            },
            {
                label: 'Gas Limit',
                name: 'gasLimit',
                type: 'number',
                optional: true,
                placeholder: '20000000',
                description: 'Maximum price you are willing to pay when sending a transaction'
            }
        ] as INodeParams[]
    }

    loadMethods = {
        async getFromNetwork(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []
            const networksData = nodeData.networks
            const inputParametersData = nodeData.inputParameters
            if (inputParametersData === undefined || networksData === undefined) return returnData

            const toNetwork = inputParametersData.toNetwork as NETWORK
            const network = networksData.network as string

            if (network === 'testnet') {
                return testnetChains.filter((chain) => chain.name !== toNetwork)
            } else if (network === 'mainnet') {
                return mainnetChains.filter((chain) => chain.name !== toNetwork)
            }

            return returnData
        },

        async getToNetwork(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []
            const networksData = nodeData.networks
            const inputParametersData = nodeData.inputParameters
            if (inputParametersData === undefined || networksData === undefined) return returnData

            const fromNetwork = inputParametersData.fromNetwork as NETWORK
            const network = networksData.network as string

            if (network === 'testnet') {
                return testnetChains.filter((chain) => chain.name !== fromNetwork)
            } else if (network === 'mainnet') {
                return mainnetChains.filter((chain) => chain.name !== fromNetwork)
            }

            return returnData
        },

        async getTokensFromNetwork(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []

            const inputParametersData = nodeData.inputParameters
            if (inputParametersData === undefined) return returnData

            const fromNetwork = inputParametersData.fromNetwork as NETWORK

            const validTokenAddress = Object.keys(tokenMatches[fromNetwork])

            const availableTokens: Set<string> = new Set()
            for (const tokenAddress of validTokenAddress) {
                const tokenOption = tokenList.find((tkn) => tkn.name === tokenAddress)
                if (!tokenOption) continue
                const token = JSON.stringify({ label: tokenOption.label, name: tokenOption.name })
                availableTokens.add(token)
            }

            availableTokens.forEach((tkn) => {
                returnData.push(JSON.parse(tkn))
            })

            return returnData
        },

        async getTokensToNetwork(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []

            const inputParametersData = nodeData.inputParameters
            if (inputParametersData === undefined) return returnData

            const fromNetwork = inputParametersData.fromNetwork as NETWORK
            const toNetwork = inputParametersData.toNetwork as NETWORK
            const fromToken = inputParametersData.fromToken as string

            const validTokenAddress = tokenMatches[fromNetwork][fromToken]

            const availableTokens: Set<string> = new Set()
            for (const tokenAddress of validTokenAddress) {
                const tokenOption = tokenList.find((tkn) => tkn.name === tokenAddress && tkn.network === toNetwork)
                if (!tokenOption) continue
                const token = JSON.stringify({ label: tokenOption.label, name: tokenOption.name })
                availableTokens.add(token)
            }

            availableTokens.forEach((tkn) => {
                returnData.push(JSON.parse(tkn))
            })

            return returnData
        },

        async getWallets(nodeData: INodeData, dbCollection?: IDbCollection): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []

            try {
                if (dbCollection === undefined || !dbCollection || !dbCollection.Wallet) {
                    return returnData
                }

                const wallets: IWallet[] = dbCollection.Wallet

                for (let i = 0; i < wallets.length; i += 1) {
                    const wallet = wallets[i]
                    const data = {
                        label: `${wallet.name} (${wallet.network})`,
                        name: JSON.stringify(wallet),
                        description: wallet.address
                    } as INodeOptionsValue
                    returnData.push(data)
                }

                return returnData
            } catch (e) {
                return returnData
            }
        }
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        //return returnNodeExecutionData({})

        const networksData = nodeData.networks
        const inputParametersData = nodeData.inputParameters

        if (networksData === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing')
        }

        const network = networksData.network as 'testnet' | 'mainnet'
        let responseData: any
        const returnData: ICommonObject[] = []

        try {
            // Get FROM and TO networks and provider urls
            const fromNetwork = inputParametersData.fromNetwork as NETWORK
            const toNetwork = inputParametersData.toNetwork as NETWORK

            // Get tokens
            const fromToken = inputParametersData.fromToken as string
            const toToken = inputParametersData.toToken as string

            // Get wallet instance
            const walletString = inputParametersData.wallet as string
            const walletDetails: IWallet = JSON.parse(walletString)
            const walletCredential = JSON.parse(walletDetails.walletCredential)

            const domainID = domainIdLookup[fromNetwork] as DOMAIN_ID

            const provider = new ethers.providers.JsonRpcProvider(connextDomainRPC[domainID].providers[0])
            const wallet = new ethers.Wallet(walletCredential.privateKey as string, provider)
            const signerAddress = await wallet.getAddress()

            const sdkConfig: SdkConfig = {
                signerAddress,
                network,
                chains: network === 'mainnet' ? connextMainnetDomainRPC : connextTestnetDomainRPC
            }

            const amountToBridge = inputParametersData.amountToBridge as string
            const slippage = (inputParametersData.slippage as string) || '10000'
            const gasLimit = inputParametersData.gasLimit as string

            // NXTP Config
            const { sdkBase } = await create(sdkConfig)
            const sdkUtils = await SdkUtils.create(sdkConfig)

            const originDomain = domainIdLookup[fromNetwork].toString()
            const destinationDomain = domainIdLookup[toNetwork].toString()
            let originAsset = fromToken

            // Swap to WETH if native ETH because Connext doens't allow native token
            if (originAsset === '0x0000000000000000000000000000000000000000') {
                const WETHAddress = WETHAddressLookup[fromNetwork] as string
                const wrapEthContract = new ethers.Contract(WETHAddress, IWETH['abi'] as ContractInterface, wallet)
                const tx = await wrapEthContract.deposit({ value: ethers.utils.parseUnits(amountToBridge, 18) })
                const approveReceipt = await tx.wait()
                if (approveReceipt.status === 0) throw new Error(`Failed to swap ETH to WETH`)
                originAsset = WETHAddress
            }

            const selectedToken = tokenList.find((tkn) => tkn.name === originAsset && tkn.network === fromNetwork)
            const amount = ethers.utils.parseUnits(amountToBridge, selectedToken?.decimal || 18).toString()

            // Estimate the relayer fee
            const relayerFee = (
                await sdkBase.estimateRelayerFee({
                    originDomain,
                    destinationDomain
                })
            ).toString()

            // Prepare the xcall params
            const xcallParams = {
                origin: originDomain, // send
                destination: destinationDomain, // to
                to: signerAddress, // the address that should receive the funds on destination
                asset: originAsset, // address of the token contract
                delegate: signerAddress, // address allowed to execute transaction on destination side in addition to relayers
                amount: amount, // amount of tokens to transfer
                slippage: slippage, // the maximum amount of slippage the user will accept in BPS (e.g. 30 = 0.3%)
                callData: '0x', // empty calldata for a simple transfer (byte-encoded)
                relayerFee: relayerFee // fee paid to relayers
            }

            // Approve the asset transfer if the current allowance is lower than the amount.
            // Necessary because funds will first be sent to the Connext contract in xcall.
            const approveTxReq = await sdkBase.approveIfNeeded(originDomain, originAsset, amount)

            if (approveTxReq) {
                const approveTxReceipt = await wallet.sendTransaction(approveTxReq)
                await approveTxReceipt.wait()
            }

            // Send the xcall
            const xcallTxReq = await sdkBase.xcall(xcallParams)
            if (gasLimit) xcallTxReq.gasLimit = BigNumber.from(gasLimit)

            const xcallTxReceipt = await wallet.sendTransaction(xcallTxReq)
            const xcallTxResult = await xcallTxReceipt.wait()

            const transactionHash = xcallTxResult.transactionHash

            const baseurl = network === 'mainnet' ? 'https://connextscan.io' : 'https://testnet.connextscan.io'

            const promise = () => {
                return new Promise((resolve, reject) => {
                    let count = 3600 // 2 hours
                    const timeout = setInterval(async () => {
                        const trackTransfer = await sdkUtils.getTransfers({ transactionHash, userAddress: signerAddress })
                        if (count < 0) {
                            clearInterval(timeout)
                            reject(new Error(`Timeout. Link: ${baseurl}/tx/${trackTransfer[0].transfer_id}`))
                        }
                        if (trackTransfer.length && trackTransfer[0].error_status !== null) {
                            clearInterval(timeout)
                            reject(
                                new Error(
                                    `Error bridging tokens: ${trackTransfer[0].error_status}. Link: ${baseurl}/tx/${trackTransfer[0].transfer_id}`
                                )
                            )
                        }
                        if (trackTransfer.length && trackTransfer[0].status === 'Executed' && trackTransfer[0].error_status === null) {
                            trackTransfer[0].link = `${baseurl}/tx/${trackTransfer[0].transfer_id}`

                            // Swap to ETH
                            if (toToken === '0x0000000000000000000000000000000000000000') {
                                const WETHAddress = WETHAddressLookup[toNetwork] as string
                                const wrapEthContract = new ethers.Contract(WETHAddress, IWETH['abi'] as ContractInterface, wallet)
                                const tx = await wrapEthContract.withdraw(
                                    ethers.utils.parseUnits(trackTransfer[0].destination_transacting_amount, 18)
                                )
                                const approveReceipt = await tx.wait()
                                if (approveReceipt.status === 0) throw new Error(`Failed to swap WETH to ETH`)
                            }

                            clearInterval(timeout)
                            resolve(trackTransfer[0])
                        }
                        count -= 1
                    }, 2000)
                })
            }
            responseData = await promise()
        } catch (e) {
            throw handleErrorMessage(e)
        }

        if (Array.isArray(responseData)) {
            returnData.push(...responseData)
        } else {
            returnData.push(responseData)
        }

        return returnNodeExecutionData(returnData)
    }
}

module.exports = { nodeClass: Connext }
