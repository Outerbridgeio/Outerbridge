import { IDbCollection, INode, INodeData, INodeExecutionData, INodeOptionsValue, INodeParams, IWallet, NodeType } from '../../src/Interface'
import { handleErrorMessage, returnNodeExecutionData } from '../../src/utils'
import {
    BSCNetworks,
    getNetworkProvider,
    getNetworkProvidersList,
    NETWORK,
    networkExplorers,
    networkProviderCredentials,
    NETWORK_PROVIDER
} from '../../src'
import { ethers } from 'ethers'

class BNBTransfer implements INode {
    label: string
    name: string
    type: NodeType
    description: string
    version: number
    icon: string
    category: string
    incoming: number
    outgoing: number
    networks?: INodeParams[]
    credentials?: INodeParams[]
    inputParameters?: INodeParams[]

    constructor() {
        this.label = 'BNB Transfer'
        this.name = 'BNBTransfer'
        this.icon = 'bnb.svg'
        this.type = 'action'
        this.category = 'Cryptocurrency'
        this.version = 1.0
        this.description = 'Send/Transfer BNB to an address'
        this.incoming = 1
        this.outgoing = 1
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [...BSCNetworks]
            },
            {
                label: 'Network Provider',
                name: 'networkProvider',
                type: 'asyncOptions',
                loadMethod: 'getNetworkProviders'
            },
            {
                label: 'RPC Endpoint',
                name: 'jsonRPC',
                type: 'string',
                default: '',
                show: {
                    'networks.networkProvider': ['customRPC']
                }
            },
            {
                label: 'Websocket Endpoint',
                name: 'websocketRPC',
                type: 'string',
                default: '',
                show: {
                    'networks.networkProvider': ['customWebsocket']
                }
            }
        ] as INodeParams[]
        this.credentials = [...networkProviderCredentials] as INodeParams[]
        this.inputParameters = [
            {
                label: 'Wallet To Transfer',
                name: 'wallet',
                type: 'asyncOptions',
                description: 'Wallet account to send/transfer BNB',
                loadFromDbCollections: ['Wallet'],
                loadMethod: 'getWallets'
            },
            {
                label: 'Address To Receive',
                name: 'address',
                type: 'string',
                default: '',
                description: 'Address to receive BNB'
            },
            {
                label: 'Amount',
                name: 'amount',
                type: 'number',
                description: 'Amount of BNB to transfer'
            },
            {
                label: 'Gas Limit',
                name: 'gasLimit',
                type: 'number',
                optional: true,
                placeholder: '100000',
                description: 'Maximum price you are willing to pay when sending a transaction'
            },
            {
                label: 'Max Fee per Gas',
                name: 'maxFeePerGas',
                type: 'number',
                optional: true,
                placeholder: '200',
                description:
                    'The maximum price (in wei) per unit of gas for transaction. See <a target="_blank" href="https://docs.alchemy.com/docs/maxpriorityfeepergas-vs-maxfeepergas">more</a>'
            },
            {
                label: 'Max Priority Fee per Gas',
                name: 'maxPriorityFeePerGas',
                type: 'number',
                optional: true,
                placeholder: '5',
                description:
                    'The priority fee price (in wei) per unit of gas for transaction. See <a target="_blank" href="https://docs.alchemy.com/docs/maxpriorityfeepergas-vs-maxfeepergas">more</a>'
            }
        ] as INodeParams[]
    }

    loadMethods = {
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
        },

        async getNetworkProviders(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []

            const networksData = nodeData.networks
            if (networksData === undefined) return returnData

            const network = networksData.network as NETWORK
            return getNetworkProvidersList(network)
        }
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        const networksData = nodeData.networks
        const credentials = nodeData.credentials
        const inputParametersData = nodeData.inputParameters

        if (networksData === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing')
        }

        try {
            const walletString = inputParametersData.wallet as string
            const walletDetails: IWallet = JSON.parse(walletString)
            const network = networksData.network as NETWORK

            const provider = await getNetworkProvider(
                networksData.networkProvider as NETWORK_PROVIDER,
                network,
                credentials,
                networksData.jsonRPC as string,
                networksData.websocketRPC as string
            )

            if (!provider) throw new Error('Invalid Network Provider')

            // Get wallet instance
            const walletCredential = JSON.parse(walletDetails.walletCredential)
            const wallet = new ethers.Wallet(walletCredential.privateKey as string, provider)
            const address = inputParametersData.address as string
            const amount = inputParametersData.amount as string
            const gasLimit = inputParametersData.gasLimit as number
            const maxFeePerGas = inputParametersData.maxFeePerGas as number
            const maxPriorityFeePerGas = inputParametersData.maxPriorityFeePerGas as number

            // Send token
            const nonce = await provider.getTransactionCount(walletDetails.address)
            const txOption = {
                nonce
            } as any

            if (gasLimit) txOption.gasLimit = gasLimit
            if (maxFeePerGas) txOption.maxFeePerGas = maxFeePerGas
            if (maxPriorityFeePerGas) txOption.maxPriorityFeePerGas = maxPriorityFeePerGas

            const tx = await wallet.sendTransaction({
                to: address,
                value: ethers.utils.parseEther(amount),
                ...txOption
            })

            const txReceipt = await tx.wait()

            const returnItem = {
                transferFrom: wallet.address,
                transferTo: address,
                amount,
                transactionHash: tx.hash,
                transactionReceipt: txReceipt as any,
                link: `${networkExplorers[network]}/tx/${tx.hash}`
            }
            return returnNodeExecutionData(returnItem)
        } catch (error) {
            throw handleErrorMessage(error)
        }
    }
}

module.exports = { nodeClass: BNBTransfer }
