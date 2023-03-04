import { INode, INodeData, INodeOptionsValue, INodeParams, IProviders, NodeType } from '../../src/Interface'
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

        let eventData = ''
        const provider = contract.events
        const filter = {
            network,
            eventName,
            contractAddress
        }

        /********** WORKAROUND FOR THIRDWEB REMOVEEVENTLISTENER BUG *********
         ** If this emitEventKey hasn't been called before OR emitEventKey has been called but not this filter
         ** This prevents from adding multiple event listener
         **/
        if (
            !Object.prototype.hasOwnProperty.call(this.providers, emitEventKey) ||
            !Object.prototype.hasOwnProperty.call(this.providers[emitEventKey].filter, JSON.stringify(filter))
        ) {
            provider.addEventListener(eventName, (event) => {
                if (eventData !== JSON.stringify(event)) {
                    eventData = JSON.stringify(event)

                    if (JSON.stringify(this.providers[emitEventKey].filter.currentFilter) === JSON.stringify(filter)) {
                        this.emit(emitEventKey, returnNodeExecutionData(event))
                    }
                }
            })
        }

        /** Example of providers
        this.providers = {
            'W03MAR23-LPQ88HJB_thirdWebEventTrigger_0': {
                provider: ContractEvents { contractWrapper: [ContractWrapper] },
                filter: {
                    '{"network":"mumbai","eventName":"TokensMinted","contractAddress":"0x..."}': {
                        network: 'mumbai',
                        eventName: 'TokensMinted',
                        contractAddress: '0x...'
                    },
                    '{"network":"mumbai","eventName":"PlatformFeeInfoUpdated","contractAddress":"0x.."}': {
                        network: 'mumbai',
                        eventName: 'PlatformFeeInfoUpdated',
                        contractAddress: '0x...'
                    },
                    currentFilter: {
                        network: 'mumbai',
                        eventName: 'PlatformFeeInfoUpdated',
                        contractAddress: '0x...'
                    },
                }
            }
        }
        */

        if (Object.prototype.hasOwnProperty.call(this.providers, emitEventKey)) {
            const newFilter = {
                ...this.providers[emitEventKey].filter,
                [JSON.stringify(filter)]: filter,
                currentFilter: filter
            }
            this.providers[emitEventKey] = { provider, filter: newFilter }
        } else {
            const newFilter = {
                [JSON.stringify(filter)]: filter,
                currentFilter: filter
            }
            this.providers[emitEventKey] = { provider, filter: newFilter }
        }
    }

    async removeTrigger(nodeData: INodeData): Promise<void> {
        const emitEventKey = nodeData.emitEventKey as string

        if (Object.prototype.hasOwnProperty.call(this.providers, emitEventKey)) {
            /** Disabling this because thirdweb removeEventListener bug, it doesnt remove listener
            const provider = this.providers[emitEventKey].provider
            provider.removeEventListener(eventName, (event: any) => {
                console.log(event)
            }) 
            **/
            this.removeAllListeners(emitEventKey)
        }
    }
}

module.exports = { nodeClass: ThirdWebEventTrigger }
