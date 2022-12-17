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
    BSCNetworks,
    chainIdLookup,
    getNetworkProvider,
    getNetworkProvidersList,
    NETWORK,
    networkExplorers,
    networkProviderCredentials,
    NETWORK_PROVIDER
} from '../../src'
import { ContractInterface, ethers } from 'ethers'
import axios, { AxiosRequestConfig, Method } from 'axios'
import { IToken } from '../Uniswap/nativeTokens'
import {
    allowanceParameters,
    approveParameters,
    balanceOfParameters,
    BEP20Functions,
    transferFromParameters,
    withdrawParameters
} from './helperFunctions'
import IBEP20 from '../../src/abis/WBNB.json'
import IWETH from '@uniswap/v2-periphery/build/IWETH.json'
import { depositParameters } from '../ERC20Function/helperFunctions'

class BEP20Function implements INode {
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
        this.label = 'BEP20 Function'
        this.name = 'BEP20Function'
        this.icon = 'bep20.png'
        this.type = 'action'
        this.category = 'Cryptocurrency'
        this.version = 1.0
        this.description = 'Execute BEP20 function such as deposit, withdraw, get balance, etc'
        this.incoming = 1
        this.outgoing = 1
        this.actions = [
            {
                label: 'Function',
                name: 'function',
                type: 'options',
                options: [...BEP20Functions]
            }
        ] as INodeParams[]
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [...BSCNetworks]
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
                label: 'BEP20 Token',
                name: 'bep20Token',
                type: 'asyncOptions',
                description: 'BEP20 Token to send/transfer',
                loadMethod: 'getTokens'
            },
            {
                label: 'Custom BEP20 Address',
                name: 'customBEP20TokenAddress',
                type: 'string',
                description: 'BEP20 Token Address',
                show: {
                    'inputParameters.bep20Token': ['customBEP20Address']
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
                    url: `https://tokens.pancakeswap.finance/pancakeswap-extended.json`
                }

                const response = await axios(axiosConfig)
                const responseData = response.data
                let tokens: IToken[] = responseData.tokens

                // Add custom token
                const data = {
                    label: `- Custom BEP20 Address -`,
                    name: `customBEP20Address`
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
            const BEP20Function = actionsData.function as string
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

            const bep20Token = inputParametersData.bep20Token as string
            const customBEP20TokenAddress = inputParametersData.customBEP20TokenAddress as string

            const contractAddress = bep20Token === 'customBEP20Address' ? customBEP20TokenAddress : bep20Token.split(';')[0]

            const contractInstance = new ethers.Contract(contractAddress, IBEP20, provider)
            const decimals =
                bep20Token === 'customBEP20Address'
                    ? parseInt(await contractInstance.decimals(), 10)
                    : parseInt(bep20Token.split(';').pop() || '0', 10)

            let returnItem = { function: BEP20Function, link: `${networkExplorers[network]}/address/${contractAddress}` } as any

            if (BEP20Function === 'allowance') {
                // allowance(address owner, address spender) → uint256
                returnItem.result = await contractInstance.allowance(owner, spender)
            } else if (BEP20Function === 'approve') {
                // approve(address spender, uint256 amount) → bool
                const { txOption, wallet } = await getWalletSigner(inputParametersData, provider)
                const functionApproveAbi = ['function approve(address spender, uint256 amount) external returns (boolean)']
                const contractInstance = new ethers.Contract(contractAddress, functionApproveAbi, wallet)
                const numberOfTokens = ethers.utils.parseUnits(amount, decimals)
                const tx = await contractInstance.approve(spender, numberOfTokens, txOption)
                const txReceipt = await tx.wait()
                returnItem = {
                    function: BEP20Function,
                    spender,
                    amount,
                    transactionHash: tx.hash,
                    transactionReceipt: txReceipt as any,
                    link: `${networkExplorers[network]}/tx/${tx.hash}`
                }
            } else if (BEP20Function === 'balanceOf') {
                // balanceOf(address account) → uint256
                returnItem.result = ethers.utils.formatEther(await contractInstance.balanceOf(account))
            } else if (BEP20Function === 'decimals') {
                // decimals() → uint8
                returnItem.result = await contractInstance.decimals()
            } else if (BEP20Function === 'name') {
                // name() → string
                returnItem.result = await contractInstance.name()
            } else if (BEP20Function === 'symbol') {
                // symbol() → string
                returnItem.result = await contractInstance.symbol()
            } else if (BEP20Function === 'totalSupply') {
                // totalSupply() → uint256
                returnItem.result = ethers.utils.formatEther(await contractInstance.totalSupply())
            } else if (BEP20Function === 'transferFrom') {
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
                    function: BEP20Function,
                    transferFrom: from,
                    transferTo: to,
                    amount,
                    transactionHash: tx.hash,
                    transactionReceipt: txReceipt as any,
                    link: `${networkExplorers[network]}/tx/${tx.hash}`
                }
            } else if (BEP20Function === 'deposit') {
                const { txOption, wallet } = await getWalletSigner(inputParametersData, provider)
                const wrapEthContract = new ethers.Contract(contractAddress, IWETH['abi'] as ContractInterface, wallet)
                const numberOfTokens = ethers.utils.parseUnits(amount, decimals)
                const tx = await wrapEthContract.deposit({ ...txOption, value: numberOfTokens })
                const txReceipt = await tx.wait()
                if (txReceipt.status === 0) throw new Error(`Failed to deposit BNB to ${contractAddress}`)
                returnItem = {
                    function: BEP20Function,
                    amount,
                    transactionHash: tx.hash,
                    transactionReceipt: txReceipt as any,
                    link: `${networkExplorers[network]}/tx/${tx.hash}`
                }
            } else if (BEP20Function === 'withdraw') {
                const { wallet } = await getWalletSigner(inputParametersData, provider)
                const wrapEthContract = new ethers.Contract(contractAddress, IWETH['abi'] as ContractInterface, wallet)
                const numberOfTokens = ethers.utils.parseUnits(amount, decimals)
                const tx = await wrapEthContract.withdraw(numberOfTokens)
                const txReceipt = await tx.wait()
                if (txReceipt.status === 0) throw new Error(`Failed to withdraw BNB from ${contractAddress}`)
                returnItem = {
                    function: BEP20Function,
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

module.exports = { nodeClass: BEP20Function }
