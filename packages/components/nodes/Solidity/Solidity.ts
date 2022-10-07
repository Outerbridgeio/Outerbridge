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
import { getNodeModulesPackagePath, handleErrorMessage, returnNodeExecutionData } from '../../src/utils'
import { ethers } from 'ethers'
import * as fs from 'fs'
import {
    ArbitrumNetworks,
    BSCNetworks,
    ETHNetworks,
    getNetworkProvider,
    getNetworkProvidersList,
    NETWORK,
    networkExplorers,
    networkProviderCredentials,
    NETWORK_PROVIDER,
    OptimismNetworks,
    PolygonNetworks
} from '../../src/ChainNetwork'

const solc = require('solc')

class Solidity implements INode {
    label: string
    name: string
    type: NodeType
    description: string
    version: number
    icon: string
    incoming: number
    outgoing: number
    actions?: INodeParams[]
    networks?: INodeParams[]
    credentials?: INodeParams[]
    inputParameters?: INodeParams[]

    constructor() {
        this.label = 'Solidity'
        this.name = 'solidity'
        this.icon = 'solidity.svg'
        this.type = 'action'
        this.version = 1.0
        this.description = 'Compile and Deploy Solidity Code'
        this.incoming = 1
        this.outgoing = 1
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [...ETHNetworks, ...PolygonNetworks, ...ArbitrumNetworks, ...OptimismNetworks, ...BSCNetworks],
                default: 'goerli'
            },
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
        this.inputParameters = [
            {
                label: 'Solidity Code',
                name: 'code',
                type: 'code',
                placeholder: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MTK") {}
}`,
                description: 'Custom Solidity code to compile and deploy'
            },
            {
                label: 'Contract Name',
                name: 'contractName',
                description: 'Contract Name to deploy the Solidity Code',
                type: 'string',
                default: '',
                placeholder: 'MyContract'
            },
            {
                label: 'Select Wallet',
                name: 'wallet',
                type: 'asyncOptions',
                description: 'Wallet account to deploy Solidity code',
                loadFromDbCollections: ['Wallet'],
                loadMethod: 'getWallets'
            },
            {
                label: 'Constructor Parameters',
                name: 'parameters',
                type: 'json',
                placeholder: '[ "param1", "param2" ]',
                description: 'Input parameters for constructor',
                optional: true
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
        },

        async getNetworkProviders(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []

            const networksData = nodeData.networks
            if (networksData === undefined) return returnData

            const network = networksData.network as NETWORK
            return getNetworkProvidersList(network)
        }
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        const networksData = nodeData.networks
        const credentials = nodeData.credentials
        const inputParametersData = nodeData.inputParameters

        if (networksData === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing')
        }

        try {
            const walletString = inputParametersData.wallet as string
            const walletDetails: IWallet = JSON.parse(walletString)
            const network = networksData.network as NETWORK

            const provider = await getNetworkProvider(
                networksData.networkProvider as NETWORK_PROVIDER,
                network,
                credentials,
                networksData.jsonRPC as string,
                networksData.websocketRPC as string
            )

            if (!provider) throw new Error('Invalid Network Provider')

            // Get wallet instance
            const walletCredential = JSON.parse(walletDetails.walletCredential)
            const wallet = new ethers.Wallet(walletCredential.privateKey as string, provider)

            // Get input parameters
            const code = inputParametersData.code as string
            const solidityContractName = inputParametersData.contractName as string
            const parameters = inputParametersData.parameters as string

            const input = {
                language: 'Solidity',
                sources: {},
                settings: {
                    outputSelection: {
                        '*': {
                            '*': ['*']
                        }
                    }
                }
            } as any

            function findImports(_path: any) {
                const filepath = getNodeModulesPackagePath(_path)
                const contents = fs.readFileSync(filepath).toString()
                return { contents }
            }

            input.sources[solidityContractName + '.sol'] = { content: code }
            const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }))

            const contractOutput = output.contracts[solidityContractName + '.sol']

            let contractName = Object.keys(contractOutput)[0]

            const bytecode = contractOutput[contractName].evm.bytecode.object
            const abi = contractOutput[contractName].abi

            const factory = new ethers.ContractFactory(abi, bytecode, wallet)

            let contractParameters: any[] = []

            if (parameters) {
                contractParameters = JSON.parse(parameters)
            }

            let deployedContract: ethers.Contract

            if (contractParameters.length > 0) deployedContract = await factory.deploy.apply(factory, contractParameters)
            else deployedContract = await factory.deploy()

            // The contract is NOT deployed yet; we must wait until it is mined
            await deployedContract.deployed()
            const returnItem: ICommonObject = {
                explorerLink: `${networkExplorers[network]}/address/${deployedContract.address}`,
                address: deployedContract.address,
                transactionHash: deployedContract.deployTransaction.hash
            }

            return returnNodeExecutionData(returnItem)
        } catch (e) {
            throw handleErrorMessage(e)
        }
    }
}

module.exports = { nodeClass: Solidity }
