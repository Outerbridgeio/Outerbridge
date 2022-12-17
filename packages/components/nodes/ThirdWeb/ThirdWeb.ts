import {
    ICommonObject,
    IDbCollection,
    INode,
    INodeData,
    INodeExecutionData,
    INodeOptionsValue,
    INodeParams,
    IWallet,
    NodeType
} from '../../src/Interface'
import { returnNodeExecutionData } from '../../src/utils'
import { NodeVM } from 'vm2'
import { prebuiltType, ThirdWebSupportedNetworks, ThirdWebSupportedPrebuiltContract } from './supportedNetwork'
import { ThirdwebSDK as ThirdwebEVMSDK } from '@thirdweb-dev/sdk'
//import { ThirdwebSDK as ThirdwebSolanaSDK } from '@thirdweb-dev/sdk/solana'

class ThirdWeb implements INode {
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
    inputParameters?: INodeParams[]

    constructor() {
        this.label = 'ThirdWeb'
        this.name = 'thirdWeb'
        this.icon = 'thirdweb.svg'
        this.type = 'action'
        this.category = 'Development'
        this.version = 1.0
        this.description = 'Execute ThirdWeb SDK code snippet'
        this.incoming = 1
        this.outgoing = 1
        this.actions = [
            {
                label: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        label: 'Read data from contracts',
                        name: 'read'
                    },
                    {
                        label: 'Execute transactions on contracts',
                        name: 'execute'
                    }
                ],
                default: 'read'
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
        this.inputParameters = [
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
                label: 'Code',
                name: 'code',
                type: 'code',
                placeholder: `const ethers = require('ethers');\n\n//Get NFT Balance\nconst walletAddress = "0xE597E574889537A3A9120d1B5793cdFAEf6B6c10";\nconst balance = await contract.balanceOf(walletAddress);\nreturn ethers.utils.formatEther(balance);`,
                description: 'Custom code to run'
            },
            {
                label: 'External Modules',
                name: 'external',
                type: 'json',
                placeholder: '["ethers"]',
                description: `Import installed dependencies within Outerbridge and use it within code. Ex: const ethers = require('ethers');`,
                optional: true
            },
            {
                label: 'Select Wallet',
                name: 'wallet',
                type: 'asyncOptions',
                description: 'Wallet account to execute transaction.',
                loadFromDbCollections: ['Wallet'],
                loadMethod: 'getWallets',
                show: {
                    'actions.operation': ['execute']
                }
            }
        ] as INodeParams[]
    }

    loadMethods = {
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

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        const inputParametersData = nodeData.inputParameters
        const actionsData = nodeData.actions
        const networksData = nodeData.networks

        if (inputParametersData === undefined || actionsData === undefined || networksData === undefined) {
            throw new Error('Required data missing')
        }

        const operation = actionsData.operation as string
        const contractAddress = inputParametersData.contract as string
        const contractType = inputParametersData.contractType as prebuiltType
        const network = networksData.network as string
        const walletString = inputParametersData.wallet as string

        const contract = await getThirdWebSDK(operation, network, contractAddress, contractType, walletString)

        const returnData: ICommonObject[] = []

        // Global object
        const sandbox = {
            $nodeData: nodeData,
            $contract: contract
        }

        const options = {
            console: 'inherit',
            sandbox,
            require: {
                external: false as boolean | { modules: string[] },
                builtin: ['*']
            }
        } as any

        const code = inputParametersData.code as string
        const external = inputParametersData.external as string
        if (external) {
            const deps = JSON.parse(external)
            if (deps && deps.length) {
                options.require.external = {
                    modules: deps
                }
            }
        }

        const vm = new NodeVM(options)

        let responseData: any

        try {
            if (!code) responseData = []
            else {
                const initCode = `const contract = $contract;\n`
                responseData = await vm.run(`module.exports = async function() {${initCode}${code}}()`, __dirname)
            }
        } catch (e) {
            return Promise.reject(e)
        }

        if (Array.isArray(responseData)) {
            returnData.push(...responseData)
        } else {
            returnData.push(responseData)
        }

        return returnNodeExecutionData(returnData)
    }
}

const getThirdWebSDK = async (
    operation: string,
    network: string,
    contractAddress: string,
    contractType: prebuiltType,
    walletString: string
) => {
    if (operation === 'read') {
        //return await ThirdwebSolanaSDK.fromNetwork(network).getProgram(contractAddress, contractType as any)
        return await new ThirdwebEVMSDK(network).getContract(contractAddress, contractType)
    } else {
        const walletDetails: IWallet = JSON.parse(walletString)
        const walletCredential = JSON.parse(walletDetails.walletCredential)
        //return await ThirdwebSolanaSDK.fromPrivateKey(walletCredential.privateKey, network).getProgram(contractAddress, contractType as any)
        return await ThirdwebEVMSDK.fromPrivateKey(walletCredential.privateKey, network).getContract(contractAddress, contractType)
    }
}

module.exports = { nodeClass: ThirdWeb }
