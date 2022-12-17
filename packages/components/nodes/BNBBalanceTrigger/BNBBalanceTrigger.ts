import { CronJob } from 'cron'
import { BigNumber, utils } from 'ethers'
import { ICronJobs, INode, INodeData, INodeParams, NodeType } from '../../src/Interface'
import { returnNodeExecutionData } from '../../src/utils'
import EventEmitter from 'events'
import {
    binanceNetworkProviders,
    BSCNetworks,
    getNetworkProvider,
    NETWORK,
    networkExplorers,
    networkProviderCredentials,
    NETWORK_PROVIDER
} from '../../src/ChainNetwork'

class BNBBalanceTrigger extends EventEmitter implements INode {
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
    cronJobs: ICronJobs

    constructor() {
        super()
        this.label = 'BNB Balance Trigger'
        this.name = 'BNBBalanceTrigger'
        this.icon = 'bnb.svg'
        this.type = 'trigger'
        this.category = 'Cryptocurrency'
        this.version = 1.0
        this.description = 'Triggers whenever BNB balance in wallet changes'
        this.incoming = 0
        this.outgoing = 1
        this.cronJobs = {}
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
                label: 'Wallet Address',
                name: 'address',
                type: 'string',
                default: ''
            },
            {
                label: 'Trigger Condition',
                name: 'triggerCondition',
                type: 'options',
                options: [
                    {
                        label: 'When balance increased',
                        name: 'increase'
                    },
                    {
                        label: 'When balance decreased',
                        name: 'decrease'
                    }
                ],
                default: 'increase'
            },
            {
                label: 'Polling Time',
                name: 'pollTime',
                type: 'options',
                options: [
                    {
                        label: 'Every 15 secs',
                        name: '15s'
                    },
                    {
                        label: 'Every 30 secs',
                        name: '30s'
                    },
                    {
                        label: 'Every 1 min',
                        name: '1min'
                    },
                    {
                        label: 'Every 5 min',
                        name: '5min'
                    },
                    {
                        label: 'Every 10 min',
                        name: '10min'
                    }
                ],
                default: '30s'
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
        const address = (inputParametersData.address as string) || ''
        const pollTime = (inputParametersData.pollTime as string) || '30s'
        const triggerCondition = (inputParametersData.triggerCondition as string) || 'increase'

        const cronTimes: string[] = []

        if (pollTime === '15s') {
            cronTimes.push(`*/15 * * * * *`)
        } else if (pollTime === '30s') {
            cronTimes.push(`*/30 * * * * *`)
        } else if (pollTime === '1min') {
            cronTimes.push(`*/1 * * * *`)
        } else if (pollTime === '5min') {
            cronTimes.push(`*/5 * * * *`)
        } else if (pollTime === '10min') {
            cronTimes.push(`*/10 * * * *`)
        }

        let lastBalance: BigNumber = await provider.getBalance(address)

        const executeTrigger = async () => {
            const newBalance: BigNumber = await provider.getBalance(address)

            if (!newBalance.eq(lastBalance)) {
                if (triggerCondition === 'increase' && newBalance.gt(lastBalance)) {
                    const balanceInBNB = utils.formatEther(BigNumber.from(newBalance.toString()))
                    const diffInBNB = newBalance.sub(lastBalance)
                    const returnItem = {
                        newBalance: `${balanceInBNB} BNB`,
                        lastBalance: `${utils.formatEther(BigNumber.from(lastBalance.toString()))} BNB`,
                        difference: `${utils.formatEther(BigNumber.from(diffInBNB.toString()))} BNB`,
                        explorerLink: `${networkExplorers[network]}/address/${address}`,
                        triggerCondition: 'BNB balance increase'
                    }
                    lastBalance = newBalance
                    this.emit(emitEventKey, returnNodeExecutionData(returnItem))
                } else if (triggerCondition === 'decrease' && newBalance.lt(lastBalance)) {
                    const balanceInBNB = utils.formatEther(BigNumber.from(newBalance.toString()))
                    const diffInBNB = lastBalance.sub(newBalance)
                    const returnItem = {
                        newBalance: `${balanceInBNB} BNB`,
                        lastBalance: `${utils.formatEther(BigNumber.from(lastBalance.toString()))} BNB`,
                        difference: `${utils.formatEther(BigNumber.from(diffInBNB.toString()))} BNB`,
                        explorerLink: `${networkExplorers[network]}/address/${address}`,
                        triggerCondition: 'BNB balance decrease'
                    }
                    lastBalance = newBalance
                    this.emit(emitEventKey, returnNodeExecutionData(returnItem))
                } else {
                    lastBalance = newBalance
                }
            }
        }

        // Start the cron-jobs
        if (Object.prototype.hasOwnProperty.call(this.cronJobs, emitEventKey)) {
            for (const cronTime of cronTimes) {
                // Automatically start the cron job
                this.cronJobs[emitEventKey].push(new CronJob(cronTime, executeTrigger, undefined, true))
            }
        } else {
            for (const cronTime of cronTimes) {
                // Automatically start the cron job
                this.cronJobs[emitEventKey] = [new CronJob(cronTime, executeTrigger, undefined, true)]
            }
        }
    }

    async removeTrigger(nodeData: INodeData): Promise<void> {
        const emitEventKey = nodeData.emitEventKey as string

        if (Object.prototype.hasOwnProperty.call(this.cronJobs, emitEventKey)) {
            const cronJobs = this.cronJobs[emitEventKey]
            for (const cronJob of cronJobs) {
                cronJob.stop()
            }
            this.removeAllListeners(emitEventKey)
        }
    }
}

module.exports = { nodeClass: BNBBalanceTrigger }
