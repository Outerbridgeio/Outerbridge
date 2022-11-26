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

// @ts-expect-error no type definition
import solc from 'solc'

function findImports(_path: string) {
    const filepath = getNodeModulesPackagePath(_path)
    const contents = fs.readFileSync(filepath).toString()
    return { contents }
}

class CreateERC20Token implements INode {
    label: string
    name: string
    type: NodeType
    description: string
    version: number
    icon: string
    category: string
    incoming: number
    outgoing: number
    actions?: INodeParams[]
    networks?: INodeParams[]
    credentials?: INodeParams[]
    inputParameters?: INodeParams[]

    constructor() {
        this.label = 'Create Token'
        this.name = 'createToken'
        this.icon = 'erc20.svg'
        this.type = 'action'
        this.category = 'Cryptocurrency'
        this.version = 1.0
        this.description = 'Create new cryptocurrency token (ERC20)'
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
                label: 'Select Wallet',
                name: 'wallet',
                type: 'asyncOptions',
                description: 'Wallet account to create ERC20 Token.',
                loadFromDbCollections: ['Wallet'],
                loadMethod: 'getWallets'
            },
            {
                label: 'Token Name',
                name: 'tokenName',
                type: 'string',
                default: '',
                placeholder: 'MyToken'
            },
            {
                label: 'Token Symbol',
                name: 'tokenSymbol',
                type: 'string',
                default: '',
                placeholder: 'MYT'
            },
            {
                label: 'Token Supply',
                name: 'tokenSupply',
                type: 'number',
                default: 1000,
                description: 'Initialy supply of the token'
            },
            {
                label: 'Solidity Version',
                name: 'solidityVersion',
                type: 'options',
                description: 'Soldity version to compile code for token creation',
                options: [
                    {
                        label: '0.8.10',
                        name: '0.8.10'
                    },
                    {
                        label: '0.8.11',
                        name: '0.8.11'
                    },
                    {
                        label: '0.8.12',
                        name: '0.8.12'
                    },
                    {
                        label: '0.8.13',
                        name: '0.8.13'
                    },
                    {
                        label: '0.8.14',
                        name: '0.8.14'
                    },
                    {
                        label: '0.8.15',
                        name: '0.8.15'
                    }
                ],
                default: '0.8.15'
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

            const tokenName = inputParametersData.tokenName as string
            const tokenSupply = inputParametersData.tokenSupply as number
            const tokenSymbol = inputParametersData.tokenSymbol as string
            const solidityVersion = inputParametersData.solidityVersion as string

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

            const contractCode = `// SPDX-License-Identifier: MIT
            pragma solidity ^${solidityVersion};
            import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
            
            contract ${tokenName.trim()} is ERC20 {
                constructor(uint256 initialSupply) ERC20("${tokenName} Token", "${tokenSymbol}"){
                    _mint(msg.sender, initialSupply);
                }
            }`

            input.sources[tokenName + '.sol'] = { content: contractCode }
            const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }))

            const contractOutput = output.contracts[tokenName + '.sol']

            const contractName = Object.keys(contractOutput)[0]

            const bytecode = contractOutput[contractName].evm.bytecode.object
            const abi = contractOutput[contractName].abi

            const factory = new ethers.ContractFactory(abi, bytecode, wallet)

            const deployedContract = await factory.deploy(ethers.BigNumber.from(`${tokenSupply}000000000000000000`))

            // The contract is NOT deployed yet; we must wait until it is mined
            await deployedContract.deployed()
            const returnItem: ICommonObject = {
                link: `${networkExplorers[network]}/address/${deployedContract.address}`,
                address: deployedContract.address,
                transactionHash: deployedContract.deployTransaction.hash
            }

            return returnNodeExecutionData(returnItem)
        } catch (e) {
            throw handleErrorMessage(e)
        }
    }
}

module.exports = { nodeClass: CreateERC20Token }
