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
import { NodeVM } from 'vm2'
import { networkLookup, prebuiltType, ThirdWebSupportedNetworks, ThirdWebSupportedPrebuiltContract } from './supportedNetwork'
import {
    MarketplaceContractDeployMetadata,
    MultiwrapContractDeployMetadata,
    NFTContractDeployMetadata,
    SplitContractDeployMetadata,
    ThirdwebSDK as ThirdwebEVMSDK,
    TokenContractDeployMetadata,
    VoteContractDeployMetadata
} from '@thirdweb-dev/sdk'
import {
    marketplaceParameters,
    multiWrapParameters,
    nftDropParameters,
    splitContractParameters,
    tokenDropParameters,
    voteParameters
} from './constants'
import { networkExplorers } from '../../src/ChainNetwork'
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
        this.version = 2.0
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
                    },
                    {
                        label: 'Deploy new contract',
                        name: 'deploy'
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
                placeholder: '0x6a8c7F715D5f044437dA5b0576eD1289eC9b7eB6',
                show: {
                    'actions.operation': ['read', 'execute']
                }
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
                description: 'Custom code to run',
                show: {
                    'actions.operation': ['read', 'execute']
                }
            },
            {
                label: 'External Modules',
                name: 'external',
                type: 'json',
                placeholder: '["ethers"]',
                description: `Import installed dependencies within Outerbridge and use it within code. Ex: const ethers = require('ethers');`,
                optional: true,
                show: {
                    'actions.operation': ['read', 'execute']
                }
            },
            {
                label: 'Wallet Account',
                name: 'wallet',
                type: 'asyncOptions',
                description: 'Wallet account to execute transaction or deploy contract.',
                loadFromDbCollections: ['Wallet'],
                loadMethod: 'getWallets',
                show: {
                    'actions.operation': ['execute', 'deploy']
                }
            },
            ...nftDropParameters,
            ...marketplaceParameters,
            ...multiWrapParameters,
            ...splitContractParameters,
            ...tokenDropParameters,
            ...voteParameters
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

        const imageType = inputParametersData.imageType as string
        const name = inputParametersData.name as string
        const description = inputParametersData.description as string
        const symbol = inputParametersData.symbol as string
        const primary_sale_recipient = inputParametersData.primary_sale_recipient as string
        const fee_recipient = inputParametersData.fee_recipient as string
        const seller_fee_basis_points = inputParametersData.seller_fee_basis_points as string
        const platform_fee_recipient = inputParametersData.platform_fee_recipient as string
        const platform_fee_basis_points = inputParametersData.platform_fee_basis_points as string
        const external_link = inputParametersData.external_link as string
        const trusted_forwarders = inputParametersData.trusted_forwarders as string
        const recipients = inputParametersData.recipients as string
        const voting_token_address = inputParametersData.voting_token_address as string
        const proposal_token_threshold = inputParametersData.proposal_token_threshold as string
        const voting_delay_in_blocks = inputParametersData.voting_delay_in_blocks as string
        const voting_period_in_blocks = inputParametersData.voting_period_in_blocks as string
        const voting_quorum_fraction = inputParametersData.voting_quorum_fraction as string

        let responseData: any
        const returnData: ICommonObject[] = []

        if (operation === 'read' || operation === 'execute') {
            const contract = await getThirdWebSDK(operation, network, contractAddress, contractType, walletString)

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

            try {
                if (!code) responseData = []
                else {
                    const initCode = `const contract = $contract;\n`
                    responseData = await vm.run(`module.exports = async function() {${initCode}${code}}()`, __dirname)
                }
            } catch (e) {
                return Promise.reject(e)
            }
        } else if (operation === 'deploy') {
            const walletDetails: IWallet = JSON.parse(walletString)
            const walletCredential = JSON.parse(walletDetails.walletCredential)
            const sdk = ThirdwebEVMSDK.fromPrivateKey(walletCredential.privateKey, network)

            if (
                contractType === 'nft-drop' ||
                contractType === 'nft-collection' ||
                contractType === 'edition' ||
                contractType === 'edition-drop' ||
                contractType === 'pack' ||
                contractType === 'signature-drop'
            ) {
                const metadata: NFTContractDeployMetadata = {
                    name,
                    primary_sale_recipient
                }
                if (imageType) metadata.image = getImage(imageType, inputParametersData)
                if (symbol) metadata.symbol = symbol
                if (description) metadata.description = description
                if (fee_recipient) metadata.fee_recipient = fee_recipient
                if (seller_fee_basis_points) metadata.seller_fee_basis_points = parseInt(seller_fee_basis_points, 10)
                if (platform_fee_recipient) metadata.platform_fee_recipient = platform_fee_recipient
                if (platform_fee_basis_points) metadata.platform_fee_basis_points = parseInt(platform_fee_basis_points, 10)
                if (external_link) metadata.external_link = external_link
                if (trusted_forwarders) {
                    try {
                        metadata.trusted_forwarders = JSON.parse(trusted_forwarders)
                    } catch (error) {
                        throw handleErrorMessage(error)
                    }
                }

                let contractAddress = ''
                if (contractType === 'nft-drop') contractAddress = await sdk.deployer.deployNFTDrop(metadata)
                else if (contractType === 'nft-collection') contractAddress = await sdk.deployer.deployNFTCollection(metadata)
                else if (contractType === 'edition') contractAddress = await sdk.deployer.deployEdition(metadata)
                else if (contractType === 'edition-drop') contractAddress = await sdk.deployer.deployEditionDrop(metadata)
                else if (contractType === 'pack') contractAddress = await sdk.deployer.deployPack(metadata)
                else if (contractType === 'signature-drop') contractAddress = await sdk.deployer.deploySignatureDrop(metadata)

                const returnItem: ICommonObject = {
                    address: contractAddress,
                    explorerLink: `${networkExplorers[networkLookup[network]]}/address/${contractAddress}`
                }
                return returnNodeExecutionData(returnItem)
            } else if (contractType === 'marketplace') {
                const metadata: MarketplaceContractDeployMetadata = {
                    name
                }
                if (imageType) metadata.image = getImage(imageType, inputParametersData)
                if (description) metadata.description = description
                if (platform_fee_recipient) metadata.platform_fee_recipient = platform_fee_recipient
                if (platform_fee_basis_points) metadata.platform_fee_basis_points = parseInt(platform_fee_basis_points, 10)
                if (external_link) metadata.external_link = external_link
                if (trusted_forwarders) {
                    try {
                        metadata.trusted_forwarders = JSON.parse(trusted_forwarders)
                    } catch (error) {
                        throw handleErrorMessage(error)
                    }
                }

                const contractAddress = await sdk.deployer.deployMarketplace(metadata)
                const returnItem: ICommonObject = {
                    address: contractAddress,
                    explorerLink: `${networkExplorers[networkLookup[network]]}/address/${contractAddress}`
                }
                return returnNodeExecutionData(returnItem)
            } else if (contractType === 'multiwrap') {
                const metadata: MultiwrapContractDeployMetadata = {
                    name
                }
                if (imageType) metadata.image = getImage(imageType, inputParametersData)
                if (symbol) metadata.symbol = symbol
                if (description) metadata.description = description
                if (fee_recipient) metadata.fee_recipient = fee_recipient
                if (seller_fee_basis_points) metadata.seller_fee_basis_points = parseInt(seller_fee_basis_points, 10)
                if (external_link) metadata.external_link = external_link
                if (trusted_forwarders) {
                    try {
                        metadata.trusted_forwarders = JSON.parse(trusted_forwarders)
                    } catch (error) {
                        throw handleErrorMessage(error)
                    }
                }

                const contractAddress = await sdk.deployer.deployMultiwrap(metadata)
                const returnItem: ICommonObject = {
                    address: contractAddress,
                    explorerLink: `${networkExplorers[networkLookup[network]]}/address/${contractAddress}`
                }
                return returnNodeExecutionData(returnItem)
            } else if (contractType === 'split') {
                let listOfRecipients = []
                if (recipients) {
                    try {
                        listOfRecipients = JSON.parse(recipients.replace(/\s/g, ''))
                    } catch (error) {
                        throw handleErrorMessage(error)
                    }
                }
                const metadata: SplitContractDeployMetadata = {
                    name,
                    recipients: listOfRecipients
                }
                if (imageType) metadata.image = getImage(imageType, inputParametersData)
                if (description) metadata.description = description
                if (external_link) metadata.external_link = external_link
                if (trusted_forwarders) {
                    try {
                        metadata.trusted_forwarders = JSON.parse(trusted_forwarders)
                    } catch (error) {
                        throw handleErrorMessage(error)
                    }
                }

                const contractAddress = await sdk.deployer.deploySplit(metadata)
                const returnItem: ICommonObject = {
                    address: contractAddress,
                    explorerLink: `${networkExplorers[networkLookup[network]]}/address/${contractAddress}`
                }
                return returnNodeExecutionData(returnItem)
            } else if (contractType === 'token' || contractType === 'token-drop') {
                const metadata: TokenContractDeployMetadata = {
                    name,
                    primary_sale_recipient
                }
                if (imageType) metadata.image = getImage(imageType, inputParametersData)
                if (symbol) metadata.symbol = symbol
                if (description) metadata.description = description
                if (platform_fee_recipient) metadata.platform_fee_recipient = platform_fee_recipient
                if (platform_fee_basis_points) metadata.platform_fee_basis_points = parseInt(platform_fee_basis_points, 10)
                if (external_link) metadata.external_link = external_link
                if (trusted_forwarders) {
                    try {
                        metadata.trusted_forwarders = JSON.parse(trusted_forwarders)
                    } catch (error) {
                        throw handleErrorMessage(error)
                    }
                }

                let contractAddress = ''
                if (contractType === 'token') contractAddress = await sdk.deployer.deployToken(metadata)
                else if (contractType === 'token-drop') contractAddress = await sdk.deployer.deployTokenDrop(metadata)

                const returnItem: ICommonObject = {
                    address: contractAddress,
                    explorerLink: `${networkExplorers[networkLookup[network]]}/address/${contractAddress}`
                }
                return returnNodeExecutionData(returnItem)
            } else if (contractType === 'vote') {
                const metadata: VoteContractDeployMetadata = {
                    name,
                    voting_token_address
                }
                if (imageType) metadata.image = getImage(imageType, inputParametersData)
                if (description) metadata.description = description
                if (voting_delay_in_blocks) metadata.voting_delay_in_blocks = parseInt(voting_delay_in_blocks, 10)
                if (voting_period_in_blocks) metadata.voting_period_in_blocks = parseInt(voting_period_in_blocks, 10)
                if (voting_quorum_fraction) metadata.voting_quorum_fraction = parseInt(voting_quorum_fraction, 10)
                if (proposal_token_threshold) metadata.proposal_token_threshold = proposal_token_threshold
                if (external_link) metadata.external_link = external_link
                if (trusted_forwarders) {
                    try {
                        metadata.trusted_forwarders = JSON.parse(trusted_forwarders)
                    } catch (error) {
                        throw handleErrorMessage(error)
                    }
                }
                const contractAddress = await sdk.deployer.deployVote(metadata)
                const returnItem: ICommonObject = {
                    address: contractAddress,
                    explorerLink: `${networkExplorers[networkLookup[network]]}/address/${contractAddress}`
                }
                return returnNodeExecutionData(returnItem)
            }
        }

        if (Array.isArray(responseData)) {
            returnData.push(...responseData)
        } else {
            returnData.push(responseData)
        }

        return returnNodeExecutionData(returnData)
    }
}

const getImage = (imageType: string, inputParametersData: ICommonObject) => {
    let image
    if (imageType === 'url') {
        image = inputParametersData.imageURL as string
    } else if (imageType === 'base64') {
        const imageBase64 = inputParametersData.imageBase64 as string
        const splitDataURI = imageBase64.split(',')
        image = Buffer.from(splitDataURI.pop() || '', 'base64')
    }
    return image
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
