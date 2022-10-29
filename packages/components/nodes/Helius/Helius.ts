import { ICommonObject, INode, INodeData, INodeExecutionData, INodeParams, NodeType } from '../../src/Interface'
import { handleErrorMessage, returnNodeExecutionData } from '../../src/utils'
import axios, { AxiosRequestConfig, Method } from 'axios'

class Helius implements INode {
    // properties
    label: string
    name: string
    type: NodeType
    description: string
    version: number
    icon: string
    incoming: number
    outgoing: number

    // parameters
    actions: INodeParams[]
    credentials?: INodeParams[]
    networks?: INodeParams[]
    inputParameters?: INodeParams[]

    constructor() {
        // properties
        this.label = 'Helius'
        this.name = 'helius'
        this.icon = 'helius.png'
        this.type = 'action'
        this.version = 1.0
        this.description = 'Perform Helius operations'
        this.incoming = 1
        this.outgoing = 1

        // parameter
        this.actions = [
            {
                label: 'API',
                name: 'api',
                type: 'options',
                options: [
                    {
                        label: 'Get NFT events',
                        name: 'nft-events',
                        description: 'Returns all NFT events given an address.'
                    },
                    {
                        label: 'Get NFT Portfolio',
                        name: 'nfts',
                        description: 'Returns all the NFTs that the given address currently holds.'
                    },
                    {
                        label: 'Name Lookup',
                        name: 'names',
                        description: 'Does a reverse lookup with the given address for Solana Naming Service domains.'
                    },
                    {
                        label: 'Get Token Balances',
                        name: 'balances',
                        description: 'Returns the native Solana balance (in lamports) and all token balances for a given address.'
                    }
                ],
                default: 'balances'
            }
        ] as INodeParams[]
        this.credentials = [
            // credentialMethod is mandatory field
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Helius API Key',
                        name: 'heliusApi'
                    }
                ],
                default: 'heliusApi'
            }
        ] as INodeParams[]
        this.inputParameters = [
            {
                label: 'Address',
                name: 'address',
                type: 'string',
                optional: false
            }
        ] as INodeParams[]
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        const { actions, inputParameters, credentials } = nodeData

        if (actions === undefined || inputParameters === undefined || credentials === undefined) {
            throw new Error('Required data missing')
        }

        const api = actions.api as string
        const apiKey = credentials.apiKey as string

        const address = inputParameters.address as string

        const apiURL = 'https://api.helius.xyz/v0/addresses'
        const resource = `${api}`
        const options = `api-key=${apiKey}`

        const url = `${apiURL}/${address}/${resource}?${options}`

        const returnData: ICommonObject[] = []
        let responseData: any

        try {
            const axiosConfig: AxiosRequestConfig = {
                method: 'GET' as Method,
                url,
                headers: { 'Content-Type': 'application/json' }
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
module.exports = { nodeClass: Helius }
