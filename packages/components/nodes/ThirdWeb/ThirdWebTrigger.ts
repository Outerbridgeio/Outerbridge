import { IDbCollection, INode, INodeData, INodeOptionsValue, INodeParams, IProviders, IWallet, NodeType } from '../../src/Interface'
import { returnNodeExecutionData } from '../../src/utils'
import EventEmitter from 'events'
import { ThirdwebSDK as ThirdwebEVMSDK } from '@thirdweb-dev/sdk'
import {
    editionDropEvents,
    editionEvents,
    marketplaceEvents,
    multiWrapEvents,
    nftCollectionEvents,
    nftDropEvents,
    packEvents,
    prebuiltType,
    signatureDropEvents,
    splitEvents,
    ThirdWebSupportedNetworks,
    ThirdWebSupportedPrebuiltContract,
    tokenDropEvents,
    tokenEvents,
    voteEvents
} from './supportedNetwork'

class ThirdWebEventTrigger extends EventEmitter implements INode {
    label: string
    name: string
    type: NodeType
    description?: string
    version: number
    icon: string
    category: string
    incoming: number
    outgoing: number
    networks?: INodeParams[]
    credentials?: INodeParams[]
    actions?: INodeParams[]
    providers: IProviders

    constructor() {
        super()
        this.label = 'ThirdWeb Event Trigger'
        this.name = 'thirdWebEventTrigger'
        this.icon = 'thirdweb.svg'
        this.type = 'trigger'
        this.category = 'Development'
        this.version = 1.0
        this.description = 'Start workflow whenever a ThirdWeb event happened'
        this.incoming = 0
        this.outgoing = 1
        this.providers = {}
        this.actions = [
            {
                label: 'Contract Address',
                name: 'contract',
                type: 'string',
                description: 'Navigate to ThirdWeb -> Code -> Getting started -> Javascript, copy the address used in the code section',
                placeholder: '0x6a8c7F715D5f044437dA5b0576eD1289eC9b7eB6'
            },
            {
                label: 'Prebuilt Contract Type',
                name: 'contractType',
                type: 'options',
                description:
                    'Navigate to ThirdWeb -> Code -> Getting started -> Javascript, select the prebuilt contract used in the code section. Ex: await sdk.getContract("0x...", "nft-drop")',
                options: [...ThirdWebSupportedPrebuiltContract]
            },
            {
                label: 'Event',
                name: 'event',
                type: 'asyncOptions',
                loadMethod: 'getEvents'
            }
        ] as INodeParams[]
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [...ThirdWebSupportedNetworks],
                default: 'mainnet'
            }
        ] as INodeParams[]
    }

    loadMethods = {
        async getEvents(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []

            const networksData = nodeData.networks
            const actionsData = nodeData.actions

            if (actionsData === undefined || networksData === undefined) {
                return returnData
            }

            const contractType = actionsData.contractType as prebuiltType

            switch (contractType) {
                case 'edition':
                    return editionEvents
                case 'edition-drop':
                    return editionDropEvents
                case 'marketplace':
                    return marketplaceEvents
                case 'multiwrap':
                    return multiWrapEvents
                case 'nft-collection':
                    return nftCollectionEvents
                case 'nft-drop':
                    return nftDropEvents
                case 'pack':
                    return packEvents
                case 'signature-drop':
                    return signatureDropEvents
                case 'split':
                    return splitEvents
                case 'token':
                    return tokenEvents
                case 'token-drop':
                    return tokenDropEvents
                case 'vote':
                    return voteEvents
                default:
                    return []
            }
        },

        async getWallets(nodeData: INodeData, dbCollection?: IDbCollection): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []

            const networksData = nodeData.networks
            if (networksData === undefined) {
                return returnData
            }

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

    async runTrigger(nodeData: INodeData): Promise<void> {
        const networksData = nodeData.networks
        const actionsData = nodeData.actions

        if (networksData === undefined || actionsData === undefined) {
            throw new Error('Required data missing')
        }

        const network = networksData.network as string
        const emitEventKey = nodeData.emitEventKey as string
        const contractAddress = actionsData.contract as string
        const eventName = actionsData.event as string

        const contract = await new ThirdwebEVMSDK(network).getContract(contractAddress)

        /** Disabling this because it got triggered multiple times
        contract.events.addEventListener(eventName, (event) => {
            console.log(new Date())
            console.log(event);
            this.emit(emitEventKey, returnNodeExecutionData(event))
        });*/

        contract.events.listenToAllEvents((event) => {
            if (eventName === event.eventName) {
                this.emit(emitEventKey, returnNodeExecutionData(event))
            }
        })

        this.providers[emitEventKey] = { provider: { network, contractAddress }, filter: eventName }
    }

    async removeTrigger(nodeData: INodeData): Promise<void> {
        const emitEventKey = nodeData.emitEventKey as string

        if (Object.prototype.hasOwnProperty.call(this.providers, emitEventKey)) {
            const { network, contractAddress } = this.providers[emitEventKey].provider
            const contract = await new ThirdwebEVMSDK(network).getContract(contractAddress)
            /** Disabling this because it got triggered multiple times
            contract.events.removeEventListener(eventName, (event: any) => {
                console.log('removeTrigger event = ', event)
            });*/
            contract.events.removeAllListeners()
            this.removeAllListeners(emitEventKey)
        }
    }
}

module.exports = { nodeClass: ThirdWebEventTrigger }
