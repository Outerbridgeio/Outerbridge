import { CronJob } from 'cron'
import { ethers } from 'ethers'
import { IContract, ICronJobs, IDbCollection, INode, INodeData, INodeOptionsValue, INodeParams, NodeType } from '../../src/Interface'
import { handleErrorMessage, returnNodeExecutionData } from '../../src/utils'
import EventEmitter from 'events'
import { getNetworkProvidersList, NETWORK, NETWORK_PROVIDER, getNetworkProvider, networkProviderCredentials } from '../../src/ChainNetwork'

class ContractFunctionTrigger extends EventEmitter implements INode {
    label: string
    name: string
    type: NodeType
    description?: string
    version: number
    icon?: string
    incoming: number
    outgoing: number
    networks?: INodeParams[]
    credentials?: INodeParams[]
    actions?: INodeParams[]
    cronJobs: ICronJobs

    constructor() {
        super()
        this.label = 'Contract Function Trigger'
        this.name = 'ContractFunctionTrigger'
        this.icon = 'contract-function-trigger.svg'
        this.type = 'trigger'
        this.version = 1.0
        this.description = 'Triggers whenever the specified view function return value changes'
        this.incoming = 0
        this.outgoing = 1
        this.cronJobs = {}
        this.actions = [
            {
                label: 'Select Contract',
                name: 'contract',
                type: 'asyncOptions',
                loadFromDbCollections: ['Contract'],
                loadMethod: 'getContracts'
            },
            {
                label: 'View Function',
                name: 'function',
                type: 'asyncOptions',
                loadMethod: 'getViewFunctions'
            },
            {
                label: 'Function Parameters',
                name: 'funcParameters',
                type: 'json',
                placeholder: '["param1", "param2"]',
                description: 'Function parameters in array. Ex: ["param1", "param2"]',
                optional: true
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
        this.networks = [
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
    }

    loadMethods = {
        async getContracts(nodeData: INodeData, dbCollection?: IDbCollection): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []

            if (dbCollection === undefined || !dbCollection || !dbCollection.Contract) {
                return returnData
            }

            const contracts: IContract[] = dbCollection.Contract

            for (let i = 0; i < contracts.length; i += 1) {
                const contract = contracts[i]
                const data = {
                    label: `${contract.name} (${contract.network})`,
                    name: JSON.stringify(contract),
                    description: contract.address
                } as INodeOptionsValue
                returnData.push(data)
            }

            return returnData
        },

        async getViewFunctions(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []

            const actionsData = nodeData.actions
            if (actionsData === undefined) {
                return returnData
            }

            const contractString = (actionsData.contract as string) || ''
            if (!contractString) return returnData

            try {
                const contractDetails = JSON.parse(contractString)

                if (!contractDetails.abi || !contractDetails.address) return returnData

                const abiString = contractDetails.abi

                const abi = JSON.parse(abiString)

                for (const item of abi) {
                    if (!item.name) continue
                    if (item.type === 'function' && item.stateMutability === 'view') {
                        const funcName = item.name
                        const funcInputs = item.inputs
                        let inputParameters = ''
                        let inputTypes = ''
                        for (let i = 0; i < funcInputs.length; i++) {
                            const input = funcInputs[i]
                            inputTypes += `${input.type} ${input.name}`
                            if (i !== funcInputs.length - 1) inputTypes += ', '
                            inputParameters += `<li><code class="inline">${input.type}</code> ${input.name}</li>`
                        }
                        if (inputParameters) {
                            inputParameters = '<ul>' + inputParameters + '</ul>'
                        } else {
                            inputParameters = '<ul>' + 'none' + '</ul>'
                        }
                        returnData.push({
                            label: funcName,
                            name: funcName,
                            description: inputTypes,
                            inputParameters
                        })
                    }
                }

                return returnData
            } catch (e) {
                return returnData
            }
        },

        async getNetworkProviders(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []

            const actionData = nodeData.actions
            if (actionData === undefined) {
                return returnData
            }

            const contractString = (actionData.contract as string) || ''
            if (!contractString) return returnData

            try {
                const contractDetails = JSON.parse(contractString)

                if (!contractDetails.network) return returnData

                const network = contractDetails.network
                return getNetworkProvidersList(network)
            } catch (e) {
                return returnData
            }
        }
    }

    async runTrigger(nodeData: INodeData): Promise<void> {
        const networksData = nodeData.networks
        const actionsData = nodeData.actions
        const credentials = nodeData.credentials

        if (networksData === undefined || actionsData === undefined) {
            throw new Error('Required data missing')
        }

        try {
            const contractString = (actionsData.contract as string) || ''
            const contractDetails: IContract = JSON.parse(contractString)
            const network = contractDetails.network as NETWORK

            const provider = await getNetworkProvider(
                networksData.networkProvider as NETWORK_PROVIDER,
                network,
                credentials,
                networksData.jsonRPC as string,
                networksData.websocketRPC as string
            )

            if (!provider) throw new Error('Invalid Network Provider')

            const abiString = contractDetails.abi
            const address = contractDetails.address
            const abi = JSON.parse(abiString)

            const emitEventKey = nodeData.emitEventKey as string
            const functionName = (actionsData.function as string) || ''

            let contractParameters: any[] = []

            const funcParameters = actionsData.funcParameters as string
            if (funcParameters) {
                try {
                    contractParameters = JSON.parse(funcParameters.replace(/\s/g, ''))
                } catch (error) {
                    throw handleErrorMessage(error)
                }
            }

            const contract = new ethers.Contract(address, abi, provider)

            const pollTime = (actionsData.pollTime as string) || '30s'

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

            const lastResult = await contract[functionName].apply(null, contractParameters.length > 1 ? contractParameters : null)

            const executeTrigger = async () => {
                const newResult = await contract[functionName].apply(null, contractParameters.length > 1 ? contractParameters : null)

                if (JSON.stringify(newResult) !== JSON.stringify(lastResult)) {
                    const returnItem = {
                        function: functionName,
                        oldValue: lastResult,
                        newValue: newResult
                    }
                    this.emit(emitEventKey, returnNodeExecutionData(returnItem))
                }
            }

            /// Start the cron-jobs
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
        } catch (e) {
            throw handleErrorMessage(e)
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

module.exports = { nodeClass: ContractFunctionTrigger }
