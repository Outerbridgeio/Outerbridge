import { ethers, utils } from 'ethers'
import { ICommonObject, INode, INodeData, INodeParams, IProviders, NodeType } from '../../src/Interface'
import { returnNodeExecutionData } from '../../src/utils'
import EventEmitter from 'events'
import {
    networkExplorers,
    BSCNetworks,
    binanceNetworkProviders,
    NETWORK_PROVIDER,
    NETWORK,
    getNetworkProvider,
    tokenAbi,
    networkProviderCredentials
} from '../../src/ChainNetwork'

class BEP20TransferTrigger extends EventEmitter implements INode {
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
    inputParameters?: INodeParams[]
    providers: IProviders

    constructor() {
        super()
        this.label = 'BEP20 Transfer Trigger'
        this.name = 'BEP20TransferTrigger'
        this.icon = 'bnb.svg'
        this.type = 'trigger'
        this.category = 'Cryptocurrency'
        this.version = 1.0
        this.description = 'Triggers whenever a BEP20 transfer event happened'
        this.incoming = 0
        this.outgoing = 1
        this.providers = {}
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [...BSCNetworks],
                default: 'bsc'
            },
            {
                label: 'Network Provider',
                name: 'networkProvider',
                type: 'options',
                options: [...binanceNetworkProviders],
                default: 'binance'
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
                label: 'BEP20 Address',
                name: 'bep20Address',
                type: 'string',
                default: '',
                optional: true
            },
            {
                label: 'Direction',
                name: 'direction',
                type: 'options',
                options: [
                    {
                        label: 'From',
                        name: 'from',
                        description: 'Transfer from wallet address'
                    },
                    {
                        label: 'To',
                        name: 'to',
                        description: 'Transfer to wallet address'
                    },
                    {
                        label: 'Both From and To',
                        name: 'fromTo',
                        description: 'Transfer from a wallet address to another wallet address'
                    }
                ],
                default: ''
            },
            {
                label: 'From Wallet Address',
                name: 'fromAddress',
                type: 'string',
                default: '',
                show: {
                    'inputParameters.direction': ['from', 'fromTo']
                }
            },
            {
                label: 'To Wallet Address',
                name: 'toAddress',
                type: 'string',
                default: '',
                show: {
                    'inputParameters.direction': ['to', 'fromTo']
                }
            }
        ] as INodeParams[]
    }

    async runTrigger(nodeData: INodeData): Promise<void> {
        const networksData = nodeData.networks
        const inputParametersData = nodeData.inputParameters
        const credentials = nodeData.credentials

        if (networksData === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing')
        }

        const network = networksData.network as NETWORK

        const provider = await getNetworkProvider(
            networksData.networkProvider as NETWORK_PROVIDER,
            network,
            credentials,
            networksData.jsonRPC as string,
            networksData.websocketRPC as string
        )

        if (!provider) throw new Error('Invalid Network Provider')

        const emitEventKey = nodeData.emitEventKey as string
        const bep20Address = (inputParametersData.bep20Address as string) || null
        const fromAddress = (inputParametersData.fromAddress as string) || null
        const toAddress = (inputParametersData.toAddress as string) || null

        const filter = {
            topics: [
                utils.id('Transfer(address,address,uint256)'),
                fromAddress ? utils.hexZeroPad(fromAddress, 32) : null,
                toAddress ? utils.hexZeroPad(toAddress, 32) : null
            ]
        } as any
        if (bep20Address) filter['address'] = bep20Address

        provider.on(filter, async (log: any) => {
            const txHash = log.transactionHash
            const contractInstance = new ethers.Contract(log.address, tokenAbi, provider)

            /* events are empty at the moment
			const iface = new ethers.utils.Interface(eventTransferAbi);
			const logs = await provider.getLogs(filter);
			const events = logs.map((log) => iface.parseLog(log));

			const fromWallet = events.length ? events[0].args[0] : '';
			const toWallet = events.length ? events[0].args[1] : '';
			const value: BigNumber = events.length ? events[0].args[2] : '';
			*/

            //BEP20 has 3 topics length
            if (log.topics.length === 3) {
                const returnItem = {} as ICommonObject

                const name = await contractInstance.name()
                const symbol = await contractInstance.symbol()
                //const decimals = await contractInstance.decimals();
                //const amount = utils.formatUnits(value.toString(), decimals);

                returnItem['Token Name'] = name
                returnItem['Token Symbol'] = symbol
                returnItem['Token Address'] = log.address
                if (fromAddress) returnItem['From Wallet'] = fromAddress
                if (toAddress) returnItem['To Wallet'] = toAddress
                //returnItem['Amount Transfered'] = parseFloat(amount);
                returnItem['txHash'] = txHash
                returnItem['explorerLink'] = `${networkExplorers[network]}/tx/${txHash}`

                this.emit(emitEventKey, returnNodeExecutionData(returnItem))
            }
        })

        this.providers[emitEventKey] = { provider, filter }
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

module.exports = { nodeClass: BEP20TransferTrigger }
