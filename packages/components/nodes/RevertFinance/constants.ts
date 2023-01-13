import axios from 'axios'
import { BigNumber } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'

export const checkInterval = 30000 // quick check each 30 secs
export const forceCheckInterval = 60000 * 60 // update each 60 mins
export const minGainCostPercent = BigNumber.from('125') // keep 25% after fees
export const defaultGasLimit = BigNumber.from(500000)
export const maxGasLimit = BigNumber.from(1000000)
export const maxGasLimitArbitrum = BigNumber.from(2000000)
export const updatePositionsInterval = 60000 // each minute load position list from the graph

export const factoryAddress = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
export const npmAddress = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88'

export const nativeTokenAddresses = {
    mainnet: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    polygon: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    optimism: '0x4200000000000000000000000000000000000006',
    arbitrum: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1'
}
export const wethAddresses = {
    mainnet: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    polygon: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    optimism: '0x4200000000000000000000000000000000000006',
    arbitrum: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1'
}
export const usdcAddresses = {
    mainnet: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    polygon: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    optimism: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
    arbitrum: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8'
}
export const usdtAddresses = {
    mainnet: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    polygon: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    optimism: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
    arbitrum: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9'
}
export const daiAddresses = {
    mainnet: '0x6b175474e89094c44da98b954eedeac495271d0f',
    polygon: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
    optimism: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
    arbitrum: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1'
}

const SETTINGS = {
    rapid: 'rapidgaspricegwei',
    min: 'mingaspricegwei',
    standard: 'standardgaspricegwei',
    fast: 'fastgaspricegwei'
} as any

const cache: any = {}

export const createGetGasPrice =
    (setting = 'rapid') =>
    async () => {
        if (!SETTINGS[setting]) throw Error('setting ' + setting + ' invalid, use one of ' + Object.keys(SETTINGS).join(', '))
        let error = false
        let result = cache[setting]
        try {
            const {
                data: { result },
                status
            } = await axios.get('https://gpoly.blockscan.com/gasapi.ashx?apikey=key&method=pendingpooltxgweidata')
            if (status !== 200) error = true
            else cache[setting] = result[SETTINGS[setting]]
        } catch (e) {
            error = true
        }
        if (!cache[setting]) throw Error('Unable to get polygon gasPrice')
        return parseUnits(String(cache[setting]), 9)
    }
