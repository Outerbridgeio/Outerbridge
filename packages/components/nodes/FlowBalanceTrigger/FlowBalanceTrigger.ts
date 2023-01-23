import { CronJob } from 'cron'
import { BigNumber, BigNumberish } from 'ethers'
import { ICronJobs, INode, INodeData, INodeOptionsValue, INodeParams, NodeType } from '../../src/Interface'
import { returnNodeExecutionData } from '../../src/utils'
import EventEmitter from 'events'
import axios from 'axios'
import { FLOWNetworks, getNetworkProvidersList, NETWORK, networkExplorers } from '../../src/ChainNetwork'
import { formatUnits, parseUnits } from 'ethers/lib/utils'

class FlowBalanceTrigger extends EventEmitter implements INode {
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
        this.label = 'Flow Balance Trigger'
        this.name = 'FlowBalanceTrigger'
        this.icon = 'flow.png'
        this.type = 'trigger'
        this.category = 'Cryptocurrency'
        this.version = 1.0
        this.description = 'Start workflow whenever FLOW balance in wallet changes'
        this.incoming = 0
        this.outgoing = 1
        this.cronJobs = {}
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [...FLOWNetworks],
                default: 'homestead'
            }
        ] as INodeParams[]
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

    loadMethods = {
        async getNetworkProviders(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []

            const networksData = nodeData.networks
            if (networksData === undefined) return returnData

            const network = networksData.network as NETWORK
            return getNetworkProvidersList(network)
        }
    }

    async runTrigger(nodeData: INodeData): Promise<void> {
        const networksData = nodeData.networks
        const inputParametersData = nodeData.inputParameters

        if (networksData === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing')
        }

        const network = networksData.network as NETWORK
        const baseUrl =
            network === NETWORK.FLOW_TESTNET
                ? `https://rest-testnet.onflow.org/v1/accounts/`
                : `https://rest-mainnet.onflow.org/v1/accounts/`

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

        const responseFlow: any = await axios.get(`${baseUrl}${address}`)
        let lastBalance: BigNumber = BigNumber.from(responseFlow.data.balance)

        const executeTrigger = async () => {
            const responseFlow: any = await axios.get(`${baseUrl}${address}`)
            const newBalance: BigNumber = BigNumber.from(responseFlow.data.balance)

            if (!newBalance.eq(lastBalance)) {
                if (triggerCondition === 'increase' && newBalance.gt(lastBalance)) {
                    const balanceInFlow = this.formatFlow(BigNumber.from(newBalance.toString()))
                    const diffInFlow = newBalance.sub(lastBalance)
                    const returnItem = {
                        newBalance: `${balanceInFlow} FLOW`,
                        lastBalance: `${this.formatFlow(BigNumber.from(lastBalance.toString()))} FLOW`,
                        difference: `${this.formatFlow(BigNumber.from(diffInFlow.toString()))} FLOW`,
                        explorerLink: `${networkExplorers[network]}/address/${address}`,
                        triggerCondition: 'FLOW balance increase'
                    }
                    lastBalance = newBalance
                    this.emit(emitEventKey, returnNodeExecutionData(returnItem))
                } else if (triggerCondition === 'decrease' && newBalance.lt(lastBalance)) {
                    const balanceInFlow = this.formatFlow(BigNumber.from(newBalance.toString()))
                    const diffInFlow = lastBalance.sub(newBalance)
                    const returnItem = {
                        newBalance: `${balanceInFlow} FLOW`,
                        lastBalance: `${this.formatFlow(BigNumber.from(lastBalance.toString()))} FLOW`,
                        difference: `${this.formatFlow(BigNumber.from(diffInFlow.toString()))} FLOW`,
                        explorerLink: `${networkExplorers[network]}/address/${address}`,
                        triggerCondition: 'FLOW balance decrease'
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

    formatFlow(balance: BigNumberish): string {
        return formatUnits(balance, 8)
    }

    parseFlow(flow: string): BigNumber {
        return parseUnits(flow, 8)
    }
}

module.exports = { nodeClass: FlowBalanceTrigger }
