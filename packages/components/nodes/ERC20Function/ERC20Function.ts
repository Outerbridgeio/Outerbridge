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
import { handleErrorMessage, returnNodeExecutionData } from '../../src/utils'
import {
    ArbitrumNetworks,
    chainIdLookup,
    ETHNetworks,
    getNetworkProvider,
    getNetworkProvidersList,
    NETWORK,
    networkExplorers,
    networkProviderCredentials,
    NETWORK_PROVIDER,
    OptimismNetworks,
    PolygonNetworks
} from '../../src'
import { ContractInterface, ethers } from 'ethers'
import axios, { AxiosRequestConfig, Method } from 'axios'
import { IToken } from '../Uniswap/nativeTokens'
import {
    allowanceParameters,
    approveParameters,
    balanceOfParameters,
    depositParameters,
    ERC20Functions,
    transferFromParameters,
    withdrawParameters
} from './helperFunctions'
import IERC20 from '../../src/abis/WETH.json'
import IWETH from '@uniswap/v2-periphery/build/IWETH.json'

class ERC20Function implements INode {
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
        this.label = 'ERC20 Function'
        this.name = 'ERC20Function'
        this.icon = 'erc20.svg'
        this.type = 'action'
        this.category = 'Cryptocurrency'
        this.version = 1.0
        this.description = 'Execute ERC20 function such as deposit, withdraw, get balance, etc'
        this.incoming = 1
        this.outgoing = 1
        this.actions = [
            {
                label: 'Function',
                name: 'function',
                type: 'options',
                options: [...ERC20Functions]
            }
        ] as INodeParams[]
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [...ETHNetworks, ...PolygonNetworks, ...OptimismNetworks, ...ArbitrumNetworks]
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
                label: 'ERC20 Token',
                name: 'erc20Token',
                type: 'asyncOptions',
                description: 'ERC20 Token to send/transfer',
                loadMethod: 'getTokens'
            },
            {
                label: 'Custom ERC20 Address',
                name: 'customERC20TokenAddress',
                type: 'string',
                description: 'ERC20 Token Address',
                show: {
                    'inputParameters.erc20Token': ['customERC20Address']
                }
            },
            ...approveParameters,
            ...allowanceParameters,
            ...balanceOfParameters,
            ...transferFromParameters,
            ...depositParameters,
            ...withdrawParameters,
            {
                label: 'Gas Limit',
                name: 'gasLimit',
                type: 'number',
                optional: true,
                placeholder: '100000',
                description: 'Maximum price you are willing to pay when sending a transaction',
                show: {
                    'actions.function': ['approve', 'transferFrom', 'deposit']
                }
            },
            {
                label: 'Max Fee per Gas',
                name: 'maxFeePerGas',
                type: 'number',
                optional: true,
                placeholder: '200',
                description:
                    'The maximum price (in wei) per unit of gas for transaction. See <a target="_blank" href="https://docs.alchemy.com/docs/maxpriorityfeepergas-vs-maxfeepergas">more</a>',
                show: {
                    'actions.function': ['approve', 'transferFrom', 'deposit']
                }
            },
            {
                label: 'Max Priority Fee per Gas',
                name: 'maxPriorityFeePerGas',
                type: 'number',
                optional: true,
                placeholder: '5',
                description:
                    'The priority fee price (in wei) per unit of gas for transaction. See <a target="_blank" href="https://docs.alchemy.com/docs/maxpriorityfeepergas-vs-maxfeepergas">more</a>',
                show: {
                    'actions.function': ['approve', 'transferFrom', 'deposit']
                }
            }
        ] as INodeParams[]
    }

    loadMethods = {
        async getWallets(nodeData: INodeData, dbCollection?: IDbCollection): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []

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
        },

        async getTokens(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []

            const networksData = nodeData.networks
            if (networksData === undefined) return returnData

            const network = networksData.network as NETWORK

            try {
                const axiosConfig: AxiosRequestConfig = {
                    method: 'GET' as Method,
                    url: `https://tokens.uniswap.org`
                }

                const response = await axios(axiosConfig)
                const responseData = response.data
                let tokens: IToken[] = responseData.tokens

                // Add custom token
                const data = {
                    label: `- Custom ERC20 Address -`,
                    name: `customERC20Address`
                } as INodeOptionsValue
                returnData.push(data)

                // Add other tokens
                tokens = tokens.filter((tkn) => tkn.chainId === chainIdLookup[network])
                for (let i = 0; i < tokens.length; i += 1) {
                    const token = tokens[i]
                    const data = {
                        label: `${token.name} (${token.symbol})`,
                        name: `${token.address};${token.decimals}`
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
        const networksData = nodeData.networks
        const credentials = nodeData.credentials
        const actionsData = nodeData.actions
        const inputParametersData = nodeData.inputParameters

        if (networksData === undefined || inputParametersData === undefined || actionsData === undefined) {
            throw new Error('Required data missing')
        }

        try {
            const erc20Function = actionsData.function as string
            const network = networksData.network as NETWORK

            const provider = await getNetworkProvider(
                networksData.networkProvider as NETWORK_PROVIDER,
                network,
                credentials,
                networksData.jsonRPC as string,
                networksData.websocketRPC as string
            )

            if (!provider) throw new Error('Invalid Network Provider')

            const owner = inputParametersData.owner as string
            const spender = inputParametersData.spender as string
            const amount = inputParametersData.amount as string
            const account = inputParametersData.account as string
            const from = inputParametersData.from as string
            const to = inputParametersData.to as string

            const erc20Token = inputParametersData.erc20Token as string
            const customERC20TokenAddress = inputParametersData.customERC20TokenAddress as string

            const contractAddress = erc20Token === 'customERC20Address' ? customERC20TokenAddress : erc20Token.split(';')[0]

            const contractInstance = new ethers.Contract(contractAddress, IERC20, provider)
            const decimals =
                erc20Token === 'customERC20Address'
                    ? parseInt(await contractInstance.decimals(), 10)
                    : parseInt(erc20Token.split(';').pop() || '0', 10)

            let returnItem = { function: erc20Function, link: `${networkExplorers[network]}/address/${contractAddress}` } as any

            if (erc20Function === 'allowance') {
                // allowance(address owner, address spender) → uint256
                returnItem.result = await contractInstance.allowance(owner, spender)
            } else if (erc20Function === 'approve') {
                // approve(address spender, uint256 amount) → bool
                const { txOption, wallet } = await getWalletSigner(inputParametersData, provider)
                const functionApproveAbi = ['function approve(address spender, uint256 amount) external returns (boolean)']
                const contractInstance = new ethers.Contract(contractAddress, functionApproveAbi, wallet)
                const numberOfTokens = ethers.utils.parseUnits(amount, decimals)
                const tx = await contractInstance.approve(spender, numberOfTokens, txOption)
                const txReceipt = await tx.wait()
                returnItem = {
                    function: erc20Function,
                    spender,
                    amount,
                    transactionHash: tx.hash,
                    transactionReceipt: txReceipt as any,
                    link: `${networkExplorers[network]}/tx/${tx.hash}`
                }
            } else if (erc20Function === 'balanceOf') {
                // balanceOf(address account) → uint256
                returnItem.result = ethers.utils.formatEther(await contractInstance.balanceOf(account))
            } else if (erc20Function === 'decimals') {
                // decimals() → uint8
                returnItem.result = await contractInstance.decimals()
            } else if (erc20Function === 'name') {
                // name() → string
                returnItem.result = await contractInstance.name()
            } else if (erc20Function === 'symbol') {
                // symbol() → string
                returnItem.result = await contractInstance.symbol()
            } else if (erc20Function === 'totalSupply') {
                // totalSupply() → uint256
                returnItem.result = ethers.utils.formatEther(await contractInstance.totalSupply())
            } else if (erc20Function === 'transferFrom') {
                // transferFrom(address sender, address recipient, uint256 amount) → bool
                const { txOption, wallet } = await getWalletSigner(inputParametersData, provider)
                const functionTransferFromAbi = [
                    'function transferFrom(address sender, address recipient, uint256 amount) external returns (boolean)'
                ]
                const contractInstance = new ethers.Contract(contractAddress, functionTransferFromAbi, wallet)
                const numberOfTokens = ethers.utils.parseUnits(amount, decimals)
                const tx = await contractInstance.transferFrom(from, to, numberOfTokens, txOption)
                const txReceipt = await tx.wait()
                returnItem = {
                    function: erc20Function,
                    transferFrom: from,
                    transferTo: to,
                    amount,
                    transactionHash: tx.hash,
                    transactionReceipt: txReceipt as any,
                    link: `${networkExplorers[network]}/tx/${tx.hash}`
                }
            } else if (erc20Function === 'deposit') {
                const { txOption, wallet } = await getWalletSigner(inputParametersData, provider)
                const wrapEthContract = new ethers.Contract(contractAddress, IWETH['abi'] as ContractInterface, wallet)
                const numberOfTokens = ethers.utils.parseUnits(amount, decimals)
                const tx = await wrapEthContract.deposit({ ...txOption, value: numberOfTokens })
                const txReceipt = await tx.wait()
                if (txReceipt.status === 0) throw new Error(`Failed to deposit ETH to ${contractAddress}`)
                returnItem = {
                    function: erc20Function,
                    amount,
                    transactionHash: tx.hash,
                    transactionReceipt: txReceipt as any,
                    link: `${networkExplorers[network]}/tx/${tx.hash}`
                }
            } else if (erc20Function === 'withdraw') {
                const { wallet } = await getWalletSigner(inputParametersData, provider)
                const wrapEthContract = new ethers.Contract(contractAddress, IWETH['abi'] as ContractInterface, wallet)
                const numberOfTokens = ethers.utils.parseUnits(amount, decimals)
                const tx = await wrapEthContract.withdraw(numberOfTokens)
                const txReceipt = await tx.wait()
                if (txReceipt.status === 0) throw new Error(`Failed to withdraw ETH from ${contractAddress}`)
                returnItem = {
                    function: erc20Function,
                    amount,
                    transactionHash: tx.hash,
                    transactionReceipt: txReceipt as any,
                    link: `${networkExplorers[network]}/tx/${tx.hash}`
                }
            }
            return returnNodeExecutionData(returnItem)
        } catch (error) {
            throw handleErrorMessage(error)
        }
    }
}

const getWalletSigner = async (
    inputParametersData: ICommonObject,
    provider: ethers.providers.JsonRpcProvider | ethers.providers.FallbackProvider
) => {
    const walletString = inputParametersData.wallet as string
    const walletDetails: IWallet = JSON.parse(walletString)
    const walletCredential = JSON.parse(walletDetails.walletCredential)
    const gasLimit = inputParametersData.gasLimit as number
    const maxFeePerGas = inputParametersData.maxFeePerGas as number
    const maxPriorityFeePerGas = inputParametersData.maxPriorityFeePerGas as number

    const wallet = new ethers.Wallet(walletCredential.privateKey as string, provider)

    const txOption = {} as any
    txOption.nonce = await provider.getTransactionCount(walletDetails.address)
    if (gasLimit) txOption.gasLimit = gasLimit
    if (maxFeePerGas) txOption.maxFeePerGas = maxFeePerGas
    if (maxPriorityFeePerGas) txOption.maxPriorityFeePerGas = maxPriorityFeePerGas

    return { txOption, wallet }
}

module.exports = { nodeClass: ERC20Function }
