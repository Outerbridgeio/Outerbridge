import { ICommonObject, INode, INodeData, INodeExecutionData, INodeParams, NodeType } from '../../src/Interface'
import { handleErrorMessage, returnNodeExecutionData } from '../../src/utils'
import axios, { AxiosRequestConfig, Method } from 'axios'

class Helio implements INode {
    // properties
    label: string
    name: string
    type: NodeType
    description: string
    version: number
    icon: string
    category: string
    incoming: number
    outgoing: number

    // parameters
    actions: INodeParams[]
    credentials?: INodeParams[]
    networks?: INodeParams[]
    inputParameters?: INodeParams[]

    constructor() {
        // properties
        this.label = 'Helio'
        this.name = 'helio'
        this.icon = 'helio.png'
        this.type = 'action'
        this.category = 'Payment'
        this.version = 1.0
        this.description = 'Execute Helio API integration'
        this.incoming = 1
        this.outgoing = 1

        // parameter
        this.actions = [
            {
                label: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        label: 'Get All Transactions',
                        name: 'listTransactions'
                    }
                ],
                default: 'listTransactions'
            }
        ] as INodeParams[]

        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                description: 'Network to execute API: Test or Prod',
                options: [
                    {
                        label: 'TEST',
                        name: 'test',
                        description: 'Test network: https://dev.hel.io/'
                    },
                    {
                        label: 'PROD',
                        name: 'prod',
                        description: 'Prod network: https://hel.io/'
                    }
                ],
                default: 'test'
            }
        ] as INodeParams[]

        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Helio API Key',
                        name: 'helioApi'
                    }
                ],
                default: 'helioApi'
            }
        ] as INodeParams[]
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        const { actions, networks, credentials } = nodeData

        if (actions === undefined || networks === undefined) {
            throw new Error('Required data missing')
        }

        if (credentials === undefined) {
            throw new Error('Missing credentials')
        }

        const network = networks.network as string
        const operation = actions.operation as string
        const apiKey = credentials.apiKey as string
        const secretKey = credentials.secretKey as string
        const baseUrl = network === 'test' ? 'https://dev.api.hel.io/v1' : 'https://api.hel.io/v1'

        const returnData: ICommonObject[] = []
        let responseData: any
        let method: Method = 'GET'
        let url = ''

        if (operation === 'listTransactions') {
            url = `${baseUrl}/export/payments?apiKey=${apiKey}`
        }

        try {
            const axiosConfig: AxiosRequestConfig = {
                method,
                url,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secretKey}` }
            }
            const response = await axios(axiosConfig)
            responseData = response.data
        } catch (error) {
            throw handleErrorMessage(error)
        }

        if (Array.isArray(responseData)) {
            returnData.push(...responseData)
        } else {
            returnData.push(responseData)
        }

        return returnNodeExecutionData(returnData)
    }
}
module.exports = { nodeClass: Helio }
