import { ICommonObject, INode, INodeData, INodeOptionsValue, INodeParams, IProviders, NodeType } from '../../src/Interface'
import { handleErrorMessage, returnNodeExecutionData } from '../../src/utils'
import EventEmitter from 'events'
import {
    ArbitrumNetworks,
    ETHNetworks,
    OptimismNetworks,
    PolygonNetworks,
    getNetworkProvidersList,
    NETWORK,
    getNetworkProvider,
    NETWORK_PROVIDER,
    networkProviderCredentials,
    BSCNetworks,
    AvalancheNetworks,
    SolanaNetworks,
    FantomNetworks,
    GnosisNetworks,
    HecoNetworks,
    HarmonyNetworks,
    MoonRiverNetworks,
    MoonBeamNetworks,
    MetisNetworks,
    KlatynNetworks
} from '../../src/ChainNetwork'
import { ethers } from 'ethers'

class BlockchainEvent extends EventEmitter implements INode {
    label: string
    name: string
    type: NodeType
    description?: string
    version: number
    icon: string
    category: string
    incoming: number
    outgoing: number
    actions?: INodeParams[]
    networks?: INodeParams[]
    credentials?: INodeParams[]
    providers: IProviders

    constructor() {
        super()
        this.label = 'Blockchain Event Trigger'
        this.name = 'blockchainEventTrigger'
        this.icon = 'blockchainevent.svg'
        this.type = 'trigger'
        this.category = 'Blockchain Events'
        this.version = 1.0
        this.description = 'Start workflow whenever a specified event happened on chain'
        this.incoming = 0
        this.outgoing = 1
        this.providers = {}
        this.actions = [
            {
                label: 'Event Name',
                name: 'event',
                type: 'options',
                options: [
                    {
                        label: 'New Block',
                        name: 'block',
                        description: 'Emitted when a new block is mined'
                    },
                    {
                        label: 'Error',
                        name: 'error',
                        description: 'emitted on any error'
                    },
                    {
                        label: 'New Transaction',
                        name: 'pending',
                        description:
                            'Emitted when a new transaction enters the memory pool. Only certain providers offer this event and may require running your own node for reliable results'
                    },
                    {
                        label: 'Transaction Hash',
                        name: 'txHash',
                        description: 'Emitted when the transaction has been mined'
                    }
                ],
                default: 'block'
            },
            {
                label: 'Transaction Hash',
                name: 'txHash',
                type: 'string',
                default: '',
                show: {
                    'actions.event': ['txHash']
                }
            }
        ]
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [
                    ...ETHNetworks,
                    ...PolygonNetworks,
                    ...ArbitrumNetworks,
                    ...OptimismNetworks,
                    ...BSCNetworks,
                    ...AvalancheNetworks,
                    ...SolanaNetworks,
                    ...FantomNetworks,
                    ...GnosisNetworks,
                    ...HecoNetworks,
                    ...HarmonyNetworks,
                    ...MoonRiverNetworks,
                    ...MoonBeamNetworks,
                    ...MetisNetworks,
                    ...KlatynNetworks
                ],
                default: 'homestead'
            },
            {
                label: 'Network Provider',
                name: 'networkProvider',
                type: 'asyncOptions',
                loadMethod: 'getNetworkProviders'
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
    }

    loadMethods = {
        async getNetworkProviders(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []

            const networksData = nodeData.networks
            const actionsData = nodeData.actions
            if (networksData === undefined || actionsData === undefined) return returnData

            const network = networksData.network as NETWORK

            if (actionsData.event === 'pending') {
                return [
                    {
                        label: 'Custom Websocket Endpoint',
                        name: NETWORK_PROVIDER.CUSTOMWSS,
                        description: 'WSS Endpoint',
                        parentGroup: 'Custom Nodes'
                    }
                ]
            }
            return getNetworkProvidersList(network)
        }
    }

    async runTrigger(nodeData: INodeData): Promise<void> {
        const networksData = nodeData.networks
        const credentials = nodeData.credentials
        const actionsData = nodeData.actions

        if (networksData === undefined || actionsData === undefined) {
            throw new Error('Required data missing')
        }

        const network = networksData.network as NETWORK

        const provider = await getNetworkProvider(
            networksData.networkProvider as NETWORK_PROVIDER,
            network,
            credentials,
            networksData.jsonRPC as string,
            networksData.websocketRPC as string,
            true
        )

        if (!provider) throw new Error('Invalid Network Provider')

        const emitEventKey = nodeData.emitEventKey as string
        let event = actionsData.event as string

        if (event === 'txHash') event = actionsData.txHash as string

        try {
            provider.on(event, async (result: any) => {
                const returnData = await getOutputResponse(event, result, provider)
                this.emit(emitEventKey, returnNodeExecutionData(returnData))
            })
        } catch (error) {
            throw handleErrorMessage(error)
        }

        this.providers[emitEventKey] = { provider, filter: event }
    }

    async removeTrigger(nodeData: INodeData): Promise<void> {
        const emitEventKey = nodeData.emitEventKey as string

        if (Object.prototype.hasOwnProperty.call(this.providers, emitEventKey)) {
            const provider = this.providers[emitEventKey].provider
            const filter = this.providers[emitEventKey].filter
            provider.off(filter)
            this.removeAllListeners(emitEventKey)
        }
    }
}

const getOutputResponse = async (
    event: string,
    result: any,
    provider: ethers.providers.JsonRpcProvider | ethers.providers.FallbackProvider | ethers.providers.WebSocketProvider
) => {
    let returnItem = {} as ICommonObject

    switch (event) {
        case 'block':
            returnItem = { blockNumber: result }
            break
        case 'error':
            returnItem = { error: result }
            break
        case 'pending':
            returnItem = {
                pendingTransactionHash: result,
                pendingTransaction: ((await provider.getTransaction(result)) as any) || {}
            }
            break
        case 'txHash':
            returnItem = { transaction: result }
            break
    }

    return returnItem
}

module.exports = { nodeClass: BlockchainEvent }
