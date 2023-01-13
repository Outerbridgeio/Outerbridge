import { BigNumber, ethers } from 'ethers'
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
import axios from 'axios'
import {
    customNetworkProviders,
    ethNetworkProviders,
    ethTestNetworkProviders,
    getNetworkProvider,
    NETWORK,
    networkExplorers,
    networkProviderCredentials,
    NETWORK_PROVIDER,
    polygonNetworkProviders
} from '../../src'
import {
    createGetGasPrice,
    daiAddresses,
    defaultGasLimit,
    factoryAddress,
    forceCheckInterval,
    maxGasLimit,
    maxGasLimitArbitrum,
    minGainCostPercent,
    nativeTokenAddresses,
    npmAddress,
    usdcAddresses,
    usdtAddresses,
    wethAddresses
} from './constants'

import IERC20_ABI from '../../src/abis/WETH.json'
import CONTRACT_RAW from '../../src/abis/Compoundor.json'
import FACTORY_RAW from '../../src/abis/IUniswapV3Factory.json'
import POOL_RAW from '../../src/abis/IUniswapV3Pool.json'
import NPM_RAW from '../../src/abis/INonfungiblePositionManager.json'

class RevertFinance implements INode {
    label: string
    name: string
    type: NodeType
    description: string
    version: number
    icon: string
    category: string
    incoming: number
    outgoing: number
    networks?: INodeParams[]
    inputParameters?: INodeParams[]
    credentials?: INodeParams[]

    constructor() {
        this.label = 'Revert Finance'
        this.name = 'revertFinance'
        this.icon = 'revertfinance.png'
        this.type = 'action'
        this.category = 'Decentralized Finance'
        this.version = 1.0
        this.description = 'Auto compounding positions on Revert Finance'
        this.incoming = 1
        this.outgoing = 1
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [
                    {
                        label: 'Ethereum Mainnet',
                        name: 'mainnet'
                    },
                    {
                        label: 'Polygon Mainnet',
                        name: 'polygon'
                    },
                    {
                        label: 'Optimism Mainnet',
                        name: 'optimism'
                    },
                    {
                        label: 'Arbitrum Mainnet',
                        name: 'arbitrum'
                    }
                ]
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
                label: 'Liquidity Pool',
                name: 'poolType',
                type: 'options',
                options: [
                    {
                        label: 'All Positions',
                        name: 'allPositions'
                    },
                    {
                        label: 'Single Position',
                        name: 'singlePosition'
                    }
                ],
                description: 'Auto-compound all available positions on Revert Finance or a single position',
                default: 'allPositions'
            },
            {
                label: 'Liquidity Pool ID',
                name: 'nftId',
                type: 'string',
                description:
                    'For instance: https://revert.finance/#/uniswap-position/polygon/603684, 603684 is the ID. *Must be first auto-compounding activated on Revert Finance.',
                show: {
                    'inputParameters.poolType': ['singlePosition']
                }
            },
            {
                label: 'Wallet',
                name: 'wallet',
                type: 'asyncOptions',
                description: 'Wallet account to auto compound',
                loadFromDbCollections: ['Wallet'],
                loadMethod: 'getWallets'
            },
            {
                label: 'Compound Fees Anyway',
                name: 'isCompoundFeesAnyway',
                type: 'boolean',
                description: 'By default, minimum gain cost fees = 25%, if set to True, fees are compounded regardless of min gain cost',
                optional: true,
                default: false
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

            const network = networksData.network as 'polygon' | 'mainnet' | 'optimism' | 'arbitrum'

            switch (network) {
                case 'mainnet':
                    return ethNetworkProviders
                case 'polygon':
                    return polygonNetworkProviders
                case 'optimism':
                case 'arbitrum':
                    return ethTestNetworkProviders
                default:
                    return customNetworkProviders
            }
        }
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        const inputParametersData = nodeData.inputParameters
        const credentials = nodeData.credentials
        const networksData = nodeData.networks

        if (networksData === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing')
        }

        const returnData: ICommonObject[] = []
        let responseData: any

        const network = networksData.network as 'polygon' | 'mainnet' | 'optimism' | 'arbitrum'

        let formattedNetwork: NETWORK = NETWORK.MAINNET

        if (network === 'mainnet') {
            formattedNetwork = NETWORK.MAINNET
        } else if (network === 'polygon') {
            formattedNetwork = NETWORK.MATIC
        } else if (network === 'optimism') {
            formattedNetwork = NETWORK.OPTIMISM
        } else if (network === 'arbitrum') {
            formattedNetwork = NETWORK.ARBITRUM
        }

        const nativeTokenAddress = nativeTokenAddresses[network]

        // order for reward token preference
        const preferedRewardToken = [
            nativeTokenAddress,
            wethAddresses[network],
            usdcAddresses[network],
            usdtAddresses[network],
            daiAddresses[network]
        ]

        const provider = await getNetworkProvider(
            networksData.networkProvider as NETWORK_PROVIDER,
            formattedNetwork,
            credentials,
            networksData.jsonRPC as string,
            networksData.websocketRPC as string
        )

        if (!provider) throw new Error('Invalid Network Provider')

        // special gas price handling for polygon
        if (network === 'polygon') {
            console.log('createGetGasPrice = ', createGetGasPrice('rapid'))
            provider.getGasPrice = createGetGasPrice('rapid')
        }

        const contractAddress = '0x5411894842e610c4d0f6ed4c232da689400f94a1' // auto-compound contract

        const contract = new ethers.Contract(contractAddress, CONTRACT_RAW.abi, provider)
        const factory = new ethers.Contract(factoryAddress, FACTORY_RAW.abi, provider)
        const npm = new ethers.Contract(npmAddress, NPM_RAW.abi, provider)

        const poolType = inputParametersData.poolType as string
        const nftId = inputParametersData.nftId as string
        const isCompoundFeesAnyway = inputParametersData.isCompoundFeesAnyway as boolean
        const walletString = inputParametersData.wallet as string
        const walletDetails: IWallet = JSON.parse(walletString)
        const walletCredential = JSON.parse(walletDetails.walletCredential)
        const signer = new ethers.Wallet(walletCredential.privateKey as string, provider)

        const trackedPositions: any = {}
        const pricePoolCache: any = {}

        let lastTxHash: any = null
        let lastTxNonce: any = null

        const graphApiUrl = 'https://api.thegraph.com/subgraphs/name/revert-finance/compoundor-' + network

        async function getPositions() {
            const tokens = []
            let skip = 0
            const take = 1000
            let result
            do {
                result = await axios.post(graphApiUrl, {
                    query: '{ tokens(where: { account_not: null}, first: ' + take + ', skip: ' + skip + ') { id } }'
                })
                skip += take
                tokens.push(...result.data.data.tokens.map((t: { id: string }) => parseInt(t.id, 10)))
            } while (result.data.data.tokens.length == take)

            return tokens
        }

        async function updateTrackedPositions(ids: string[]) {
            const nftIds = ids.length ? ids : await getPositions()
            for (const nftId of nftIds) {
                if (!trackedPositions[nftId]) {
                    await addTrackedPosition(nftId)
                }
            }
            for (const nftId of Object.values(trackedPositions).map((x: any) => x.nftId)) {
                if (nftIds.indexOf(nftId) === -1) {
                    delete trackedPositions[nftId]
                    console.log('Remove tracked position', nftId)
                }
            }
        }

        async function addTrackedPosition(nftId: string) {
            console.log('Add tracked position', nftId)
            const position = await npm.positions(nftId)
            trackedPositions[nftId] = {
                nftId,
                token0: position.token0.toLowerCase(),
                token1: position.token1.toLowerCase(),
                fee: position.fee,
                liquidity: position.liquidity,
                tickLower: position.tickLower,
                tickUpper: position.tickUpper
            }
        }

        function updateTrackedPosition(nftId: string, gains: BigNumber, cost: BigNumber) {
            const now = new Date().getTime()
            if (trackedPositions[nftId].lastCheck) {
                const timeElapsedMs = now - trackedPositions[nftId].lastCheck
                if (gains.gt(0)) {
                    trackedPositions[nftId].gainsPerSec = gains.sub(trackedPositions[nftId].lastGains).mul(1000).div(timeElapsedMs)
                }
            }
            trackedPositions[nftId].lastCheck = now
            trackedPositions[nftId].lastGains = gains
            trackedPositions[nftId].lastCost = cost
        }

        async function getTokenETHPricesX96(position: any, cache: any) {
            const tokenPrice0X96 = cache[position.token0] || (await getTokenETHPriceX96(position.token0))
            const tokenPrice1X96 = cache[position.token1] || (await getTokenETHPriceX96(position.token1))

            cache[position.token0] = tokenPrice0X96
            cache[position.token1] = tokenPrice1X96

            if (tokenPrice0X96 && tokenPrice1X96) {
                return [tokenPrice0X96, tokenPrice1X96]
            } else if (tokenPrice0X96 || tokenPrice1X96) {
                // if only one has ETH pair - calculate other with pool price
                const poolAddress = await factory.getPool(position.token0, position.token1, position.fee)
                const poolContract = new ethers.Contract(poolAddress, POOL_RAW.abi, provider!)
                const slot0 = await poolContract.slot0()
                const priceX96 = slot0.sqrtPriceX96.pow(2).div(BigNumber.from(2).pow(192 - 96))
                return [
                    tokenPrice0X96 || tokenPrice1X96.mul(priceX96).div(BigNumber.from(2).pow(96)),
                    tokenPrice1X96 || (priceX96.gt(0) ? tokenPrice0X96.mul(BigNumber.from(2).pow(96)).div(priceX96) : BigNumber.from(0))
                ]
            } else {
                console.log("Couldn't find prices for position", position.token0, position.token1, position.fee)
                return [BigNumber.from(0), BigNumber.from(0)]
            }
        }

        async function getTokenETHPriceX96(address: string) {
            if (address.toLowerCase() == nativeTokenAddress.toLowerCase()) {
                return BigNumber.from(2).pow(96)
            }

            let price = null

            const pricePool = await findPricePoolForToken(address)
            if (pricePool.address > 0) {
                const poolContract = new ethers.Contract(pricePool.address, POOL_RAW.abi, provider!)
                const slot0 = await poolContract.slot0()
                if (slot0.sqrtPriceX96.gt(0)) {
                    price = pricePool.isToken1WETH
                        ? slot0.sqrtPriceX96.pow(2).div(BigNumber.from(2).pow(192 - 96))
                        : BigNumber.from(2)
                              .pow(192 + 96)
                              .div(slot0.sqrtPriceX96.pow(2))
                }
            }

            return price
        }

        async function findPricePoolForToken(address: string) {
            if (pricePoolCache[address]) {
                return pricePoolCache[address]
            }

            const minimalBalanceETH = BigNumber.from(10).pow(18)
            let maxBalanceETH = BigNumber.from(0)
            let pricePoolAddress = null
            let isToken1WETH = null

            const nativeToken = new ethers.Contract(nativeTokenAddress, IERC20_ABI, provider!)

            for (let fee of [100, 500, 3000, 10000]) {
                const candidatePricePoolAddress = await factory.getPool(address, nativeTokenAddress, fee)
                if (candidatePricePoolAddress > 0) {
                    const poolContract = new ethers.Contract(candidatePricePoolAddress, POOL_RAW.abi, provider!)

                    const balanceETH = await nativeToken.balanceOf(candidatePricePoolAddress)
                    if (balanceETH.gt(maxBalanceETH) && balanceETH.gte(minimalBalanceETH)) {
                        pricePoolAddress = candidatePricePoolAddress
                        maxBalanceETH = balanceETH
                        if (isToken1WETH === null) {
                            isToken1WETH = (await poolContract.token1()).toLowerCase() == nativeTokenAddress.toLowerCase()
                        }
                    }
                }
            }

            pricePoolCache[address] = { address: pricePoolAddress, isToken1WETH }

            return pricePoolCache[address]
        }

        function isReady(gains: BigNumber, cost: BigNumber) {
            if (isCompoundFeesAnyway) return true
            if (gains.mul(100).div(cost).gte(minGainCostPercent)) {
                return true
            }
        }

        function needsCheck(trackedPosition: any, gasPrice: BigNumber) {
            // if it hasnt been checked before
            if (!trackedPosition.lastCheck) {
                return true
            }

            const timeElapsedMs = new Date().getTime() - trackedPosition.lastCheck
            const estimatedGains = (trackedPosition.gainsPerSec || BigNumber.from(0)).mul(BigNumber.from(timeElapsedMs).div(1000))

            // if its ready with current gas price - check
            if (isReady(trackedPosition.lastGains.add(estimatedGains), gasPrice.mul(trackedPosition.lastCost))) {
                return true
            }
            // if it hasnt been checked for a long time - check
            if (new Date().getTime() - trackedPosition.lastCheck > forceCheckInterval) {
                return true
            }
            return false
        }

        async function calculateCostAndGains(
            nftId: string,
            rewardConversion: 0 | 2 | 1,
            withdrawReward: boolean,
            doSwap: boolean,
            gasPrice: BigNumber,
            tokenPrice0X96: any,
            tokenPrice1X96: any
        ) {
            try {
                let gasLimit = defaultGasLimit
                let reward0 = BigNumber.from(0)
                let reward1 = BigNumber.from(0)

                // only autocompound when fees available
                const fees = await npm
                    .connect(ethers.constants.AddressZero)
                    .callStatic.collect([nftId, signer.address, BigNumber.from(2).pow(128).sub(1), BigNumber.from(2).pow(128).sub(1)])
                console.log('calculateCostAndGains fees = ', fees)
                if (fees.amount0.gt(0) || fees.amount1.gt(0)) {
                    gasLimit = await contract
                        .connect(signer)
                        .estimateGas.autoCompound({ tokenId: nftId, rewardConversion, withdrawReward, doSwap })
                    console.log('calculateCostAndGains gasLimit = ', gasLimit)

                    // to high cost - skip
                    if (
                        (network !== 'arbitrum' && gasLimit.gt(maxGasLimit)) ||
                        (network === 'arbitrum' && gasLimit.gt(maxGasLimitArbitrum))
                    ) {
                        return { error: true, message: 'Gas cost exceeded' }
                    }

                    const compounds = await contract
                        .connect(signer)
                        .callStatic.autoCompound(
                            { tokenId: nftId, rewardConversion, withdrawReward, doSwap },
                            { gasLimit: gasLimit.mul(11).div(10) }
                        )
                    reward0 = compounds[0]
                    reward1 = compounds[1]
                }

                const cost = gasPrice.mul(gasLimit)

                const gain0 = reward0.mul(tokenPrice0X96).div(BigNumber.from(2).pow(96))
                const gain1 = reward1.mul(tokenPrice1X96).div(BigNumber.from(2).pow(96))

                const gains = gain0.add(gain1)

                return { gains, cost, gasLimit, doSwap }
            } catch (err) {
                return { error: true, message: err.message }
            }
        }

        async function getGasPrice(isEstimation: boolean) {
            if (network == 'optimism' && isEstimation) {
                return (await provider!.getGasPrice()).div(89) // TODO optimism estimation - for autocompound call - good enough for now
            }
            return await provider!.getGasPrice()
        }

        async function autoCompoundPositions() {
            const tokenPriceCache = {}

            try {
                let gasPrice = await getGasPrice(true)
                console.log('Current gas price', gasPrice.toString())

                for (const nftId of Object.keys(trackedPositions)) {
                    const trackedPosition = trackedPositions[nftId]

                    if (!trackedPosition) {
                        continue
                    }

                    if (!needsCheck(trackedPosition, gasPrice)) {
                        continue
                    }

                    // update gas price to latest
                    gasPrice = await getGasPrice(true)
                    const [tokenPrice0X96, tokenPrice1X96] = await getTokenETHPricesX96(trackedPosition, tokenPriceCache)

                    const indexOf0 = preferedRewardToken.indexOf(trackedPosition.token0)
                    const indexOf1 = preferedRewardToken.indexOf(trackedPosition.token1)

                    // if none prefered token found - keep original tokens - otherwise convert to first one in list
                    const rewardConversion =
                        indexOf0 === -1 && indexOf1 == -1 ? 0 : indexOf0 === -1 ? 2 : indexOf1 === -1 ? 1 : indexOf0 < indexOf1 ? 1 : 2

                    // dont withdraw reward for now
                    const withdrawReward = false

                    // try with and without swap
                    const resultA: any = await calculateCostAndGains(
                        nftId,
                        rewardConversion,
                        withdrawReward,
                        true,
                        gasPrice,
                        tokenPrice0X96,
                        tokenPrice1X96
                    )
                    const resultB: any = await calculateCostAndGains(
                        nftId,
                        rewardConversion,
                        withdrawReward,
                        false,
                        gasPrice,
                        tokenPrice0X96,
                        tokenPrice1X96
                    )

                    if (!resultA.error || !resultB.error) {
                        let result: any = null
                        if (!resultA.error && !resultB.error) {
                            result = resultA.gains.sub(resultA.cost).gt(resultB.gains.sub(resultB.cost)) ? resultA : resultB
                        } else if (!resultA.error) {
                            result = resultA
                        } else {
                            result = resultB
                        }

                        console.log('Position progress', nftId, result.gains?.mul(100).div(result.cost) + '%')

                        if (isReady(result.gains, result.cost)) {
                            const params: any = { gasLimit: result.gasLimit?.mul(11).div(10) }
                            if (network == 'mainnet') {
                                // mainnet EIP-1559 handling
                                const feeData = await provider!.getFeeData()
                                params.maxFeePerGas = feeData.maxFeePerGas
                                params.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas
                            } else if (network == 'optimism') {
                                params.gasPrice = await getGasPrice(false)
                            } else {
                                params.gasPrice = gasPrice
                            }

                            // if there is a pending tx - check if added - if not
                            if (lastTxHash) {
                                const txReceipt = await provider!.getTransactionReceipt(lastTxHash)
                                if (txReceipt && txReceipt.blockNumber) {
                                    lastTxHash = null
                                    lastTxNonce = null
                                } else {
                                    console.log('Overwrite tx with nonce', lastTxNonce)
                                    params.nonce = lastTxNonce
                                }
                            }

                            const tx = await contract
                                .connect(signer)
                                .autoCompound({ tokenId: nftId, rewardConversion, withdrawReward, doSwap: result.doSwap }, params)

                            lastTxHash = tx.hash
                            lastTxNonce = tx.nonce

                            console.log('Autocompounded position', nftId, tx.hash)
                            trackedPositions[nftId].status = 'AUTO COMPOUNDED'
                            trackedPositions[nftId].transactionHash = tx.hash
                            trackedPositions[nftId].link = `${networkExplorers[formattedNetwork]}/tx/${tx.hash}`

                            updateTrackedPosition(nftId, BigNumber.from(0), result.cost)
                        } else {
                            trackedPositions[nftId].status = 'NOT YET READY'
                            updateTrackedPosition(nftId, result.gains, result.cost)
                        }
                    } else {
                        trackedPositions[nftId].status = 'COMPOUND ERROR'
                        updateTrackedPosition(nftId, BigNumber.from(0), defaultGasLimit.mul(gasPrice))
                        console.error('Error calculating', nftId, resultA.message)
                    }
                }
            } catch (err) {
                console.error('Error during autocompound', err)
                throw new Error('Error during autocompound: ' + err)
            }
        }

        await updateTrackedPositions(poolType === 'allPositions' ? [] : [nftId])
        await autoCompoundPositions()
        responseData = trackedPositions

        if (Array.isArray(responseData)) {
            returnData.push(...responseData)
        } else {
            returnData.push(responseData)
        }

        return returnNodeExecutionData(returnData)
    }
}

module.exports = { nodeClass: RevertFinance }
