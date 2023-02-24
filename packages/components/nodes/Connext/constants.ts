import {
    arbitrumGoerliTestnetRPC,
    arbitrumMainnetRPC,
    binanceMainnetRPC,
    DOMAIN_ID,
    ethMainnetRPC,
    gnosisMainnetRPC,
    goerliTestnetRPC,
    INodeOptionsValue,
    NETWORK,
    NETWORK_LABEL,
    optimismGoerliTestnetRPC,
    optimismMainnetRPC,
    polygonMainnetRPC,
    polygonMumbaiRPC
} from '../../src'

export const testnetChains = [
    {
        label: NETWORK_LABEL.GÖRLI,
        name: NETWORK.GÖRLI,
        show: {
            'networks.network': ['testnet']
        }
    },
    {
        label: NETWORK_LABEL.OPTIMISM_GOERLI,
        name: NETWORK.OPTIMISM_GOERLI,
        show: {
            'networks.network': ['testnet']
        }
    },
    {
        label: NETWORK_LABEL.MATIC_MUMBAI,
        name: NETWORK.MATIC_MUMBAI,
        show: {
            'networks.network': ['testnet']
        }
    },
    {
        label: NETWORK_LABEL.ARBITRUM_GOERLI,
        name: NETWORK.ARBITRUM_GOERLI,
        show: {
            'networks.network': ['testnet']
        }
    }
] as INodeOptionsValue[]

export const connextTestnetDomainRPC = {
    [DOMAIN_ID.GÖRLI]: { providers: goerliTestnetRPC },
    [DOMAIN_ID.OPT_TESTNET_GOERLI]: { providers: optimismGoerliTestnetRPC },
    [DOMAIN_ID.MATIC_MUMBAI]: { providers: polygonMumbaiRPC },
    [DOMAIN_ID.ARB_TESTNET_GOERLI]: { providers: arbitrumGoerliTestnetRPC }
} as any

export const mainnetChains = [
    {
        label: NETWORK_LABEL.MAINNET,
        name: NETWORK.MAINNET,
        show: {
            'networks.network': ['mainnet']
        }
    },
    {
        label: NETWORK_LABEL.MATIC,
        name: NETWORK.MATIC,
        show: {
            'networks.network': ['mainnet']
        }
    },
    {
        label: NETWORK_LABEL.OPTIMISM,
        name: NETWORK.OPTIMISM,
        show: {
            'networks.network': ['mainnet']
        }
    },
    {
        label: NETWORK_LABEL.ARBITRUM,
        name: NETWORK.ARBITRUM,
        show: {
            'networks.network': ['mainnet']
        }
    },
    {
        label: NETWORK_LABEL.GNOSIS,
        name: NETWORK.GNOSIS,
        show: {
            'networks.network': ['mainnet']
        }
    },
    {
        label: NETWORK_LABEL.BSC,
        name: NETWORK.BSC,
        show: {
            'networks.network': ['mainnet']
        }
    }
] as INodeOptionsValue[]

export const connextMainnetDomainRPC = {
    [DOMAIN_ID.MAINNET]: { providers: ethMainnetRPC },
    [DOMAIN_ID.OPT_MAINNET]: { providers: optimismMainnetRPC },
    [DOMAIN_ID.MATIC]: { providers: polygonMainnetRPC },
    [DOMAIN_ID.ARB_MAINNET]: { providers: arbitrumMainnetRPC },
    [DOMAIN_ID.BINANCE_MAINNET]: { providers: binanceMainnetRPC },
    [DOMAIN_ID.GNOSIS]: { providers: gnosisMainnetRPC }
} as any

export const connextDomainRPC = {
    ...connextTestnetDomainRPC,
    ...connextMainnetDomainRPC
}

const GÖRLI_ETH = '0x0000000000000000000000000000000000000000'
const GÖRLI_WETH = '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6'
const GÖRLI_TEST_TOKEN = '0x7ea6ea49b0b0ae9c5db7907d139d9cd3439862a1'
const OPTIMISM_GOERLI_ETH = '0x0000000000000000000000000000000000000000'
const OPTIMISM_GOERLI_WETH = '0x74c6fd7d2bc6a8f0ebd7d78321a95471b8c2b806'
const OPTIMISM_GOERLI_TEST_TOKEN = '0x68db1c8d85c09d546097c65ec7dcbff4d6497cbf'
const MATIC_MUMBAI_WETH = '0xfd2ab41e083c75085807c4a65c0a14fdd93d55a9'
const MATIC_MUMBAI_TEST_TOKEN = '0xedb95d8037f769b72aaab41deec92903a98c9e16'
const ARBITRUM_GOERLI_ETH = '0x0000000000000000000000000000000000000000'
const ARBITRUM_GOERLI_WETH = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'
const ARBITRUM_GOERLI_TEST_TOKEN = '0xdc805eaaabd6f68904ca706c221c72f8a8a68f9f'

const MAINNET_ETH = '0x0000000000000000000000000000000000000000'
const MAINNET_WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
const MAINNET_USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
const OPTIMISM_MAINNET_ETH = '0x0000000000000000000000000000000000000000'
const OPTIMISM_MAINNET_WETH = '0x4200000000000000000000000000000000000006'
const OPTIMISM_MAINNET_USDC = '0x7F5c764cBc14f9669B88837ca1490cCa17c31607'
const ARBITRUM_MAINNET_ETH = '0x0000000000000000000000000000000000000000'
const ARBITRUM_MAINNET_WETH = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'
const ARBITRUM_MAINNET_USDC = '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8'
const MATIC_MAINNET_WETH = '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619'
const MATIC_MAINNET_USDC = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
const BINANCE_MAINNET_WETH = '0x2170ed0880ac9a755fd29b2688956bd959f933f8'
const BINANCE_MAINNET_USDC = '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d'
const GNOSIS_MAINNET_WETH = '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1'
const GNOSIS_MAINNET_USDC = '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83'

export const tokenList = [
    {
        label: 'ETH (Mainnet)',
        name: MAINNET_ETH,
        network: NETWORK.MAINNET,
        decimal: 18
    },
    {
        label: 'WETH (Mainnet)',
        name: MAINNET_WETH,
        network: NETWORK.MAINNET,
        decimal: 18
    },
    {
        label: 'USDC (Mainnet)',
        name: MAINNET_USDC,
        network: NETWORK.MAINNET,
        decimal: 6
    },
    {
        label: 'ETH (Goerli)',
        name: GÖRLI_ETH,
        network: NETWORK.GÖRLI,
        decimal: 18
    },
    {
        label: 'WETH (Goerli)',
        name: GÖRLI_WETH,
        network: NETWORK.GÖRLI,
        decimal: 18
    },
    {
        label: 'TEST (Goerli)',
        name: GÖRLI_TEST_TOKEN,
        network: NETWORK.GÖRLI,
        decimal: 18
    },
    {
        label: 'ETH (Optimism)',
        name: OPTIMISM_MAINNET_ETH,
        network: NETWORK.OPTIMISM,
        decimal: 18
    },
    {
        label: 'WETH (Optimism)',
        name: OPTIMISM_MAINNET_WETH,
        network: NETWORK.OPTIMISM,
        decimal: 18
    },
    {
        label: 'USDC (Optimism)',
        name: OPTIMISM_MAINNET_USDC,
        network: NETWORK.OPTIMISM,
        decimal: 6
    },
    {
        label: 'ETH (Optimism Goerli)',
        name: OPTIMISM_GOERLI_ETH,
        network: NETWORK.OPTIMISM_GOERLI,
        decimal: 18
    },
    {
        label: 'WETH (Optimism Goerli)',
        name: OPTIMISM_GOERLI_WETH,
        network: NETWORK.OPTIMISM_GOERLI,
        decimal: 18
    },
    {
        label: 'TEST (Optimism Goerli)',
        name: OPTIMISM_GOERLI_TEST_TOKEN,
        network: NETWORK.OPTIMISM_GOERLI,
        decimal: 18
    },
    {
        label: 'WETH (Polygon)',
        name: MATIC_MAINNET_WETH,
        network: NETWORK.MATIC,
        decimal: 18
    },
    {
        label: 'USDC (Polygon)',
        name: MATIC_MAINNET_USDC,
        network: NETWORK.MATIC,
        decimal: 6
    },
    {
        label: 'WETH (Polygon Mumbai)',
        name: MATIC_MUMBAI_WETH,
        network: NETWORK.MATIC_MUMBAI,
        decimal: 18
    },
    {
        label: 'TEST (Polygon Mumbai)',
        name: MATIC_MUMBAI_TEST_TOKEN,
        network: NETWORK.MATIC_MUMBAI,
        decimal: 6
    },
    {
        label: 'ETH (Arbitrum)',
        name: ARBITRUM_MAINNET_ETH,
        network: NETWORK.ARBITRUM,
        decimal: 18
    },
    {
        label: 'WETH (Arbitrum)',
        name: ARBITRUM_MAINNET_WETH,
        network: NETWORK.ARBITRUM,
        decimal: 18
    },
    {
        label: 'USDC (Arbitrum)',
        name: ARBITRUM_MAINNET_USDC,
        network: NETWORK.ARBITRUM,
        decimal: 6
    },
    {
        label: 'ETH (Arbitrum Goerli)',
        name: ARBITRUM_GOERLI_ETH,
        network: NETWORK.ARBITRUM_GOERLI,
        decimal: 18
    },
    {
        label: 'WETH (Arbitrum Goerli)',
        name: ARBITRUM_GOERLI_WETH,
        network: NETWORK.ARBITRUM_GOERLI,
        decimal: 18
    },
    {
        label: 'TEST (Arbitrum Goerli)',
        name: ARBITRUM_GOERLI_TEST_TOKEN,
        network: NETWORK.ARBITRUM_GOERLI,
        decimal: 18
    },
    {
        label: 'WETH (Binance)',
        name: BINANCE_MAINNET_WETH,
        network: NETWORK.BSC,
        decimal: 18
    },
    {
        label: 'USDC (Binance)',
        name: BINANCE_MAINNET_USDC,
        network: NETWORK.BSC,
        decimal: 18
    },
    {
        label: 'WETH (Gnosis)',
        name: GNOSIS_MAINNET_WETH,
        network: NETWORK.GNOSIS,
        decimal: 18
    },
    {
        label: 'USDC (Gnosis)',
        name: GNOSIS_MAINNET_USDC,
        network: NETWORK.GNOSIS,
        decimal: 6
    }
]

type ITokenMapping = {
    [key in NETWORK | string]: {
        [key: string]: string[]
    }
}

export const tokenMatches: ITokenMapping = {
    [NETWORK.GÖRLI]: {
        [GÖRLI_ETH]: [OPTIMISM_GOERLI_ETH, OPTIMISM_GOERLI_WETH, MATIC_MUMBAI_WETH, ARBITRUM_GOERLI_ETH, ARBITRUM_GOERLI_WETH],
        [GÖRLI_WETH]: [OPTIMISM_GOERLI_ETH, OPTIMISM_GOERLI_WETH, MATIC_MUMBAI_WETH, ARBITRUM_GOERLI_ETH, ARBITRUM_GOERLI_WETH],
        [GÖRLI_TEST_TOKEN]: [OPTIMISM_GOERLI_TEST_TOKEN, MATIC_MUMBAI_TEST_TOKEN, ARBITRUM_GOERLI_TEST_TOKEN]
    },
    [NETWORK.OPTIMISM_GOERLI]: {
        [OPTIMISM_GOERLI_ETH]: [GÖRLI_ETH, GÖRLI_WETH, MATIC_MUMBAI_WETH, ARBITRUM_GOERLI_ETH, ARBITRUM_GOERLI_WETH],
        [OPTIMISM_GOERLI_WETH]: [GÖRLI_ETH, GÖRLI_WETH, MATIC_MUMBAI_WETH, ARBITRUM_GOERLI_ETH, ARBITRUM_GOERLI_WETH],
        [OPTIMISM_GOERLI_TEST_TOKEN]: [GÖRLI_TEST_TOKEN, MATIC_MUMBAI_TEST_TOKEN, ARBITRUM_GOERLI_TEST_TOKEN]
    },
    [NETWORK.ARBITRUM_GOERLI]: {
        [ARBITRUM_GOERLI_ETH]: [GÖRLI_ETH, GÖRLI_WETH, MATIC_MUMBAI_WETH, OPTIMISM_GOERLI_ETH, OPTIMISM_GOERLI_WETH],
        [ARBITRUM_GOERLI_WETH]: [GÖRLI_ETH, GÖRLI_WETH, MATIC_MUMBAI_WETH, OPTIMISM_GOERLI_ETH, OPTIMISM_GOERLI_WETH],
        [ARBITRUM_GOERLI_TEST_TOKEN]: [GÖRLI_TEST_TOKEN, MATIC_MUMBAI_TEST_TOKEN, OPTIMISM_GOERLI_TEST_TOKEN]
    },
    [NETWORK.MATIC_MUMBAI]: {
        [MATIC_MUMBAI_WETH]: [GÖRLI_ETH, GÖRLI_WETH, ARBITRUM_GOERLI_ETH, ARBITRUM_GOERLI_WETH, OPTIMISM_GOERLI_ETH, OPTIMISM_GOERLI_WETH],
        [MATIC_MUMBAI_TEST_TOKEN]: [GÖRLI_TEST_TOKEN, ARBITRUM_GOERLI_TEST_TOKEN, OPTIMISM_GOERLI_TEST_TOKEN]
    },
    [NETWORK.MAINNET]: {
        [MAINNET_ETH]: [
            OPTIMISM_MAINNET_ETH,
            OPTIMISM_MAINNET_WETH,
            MATIC_MAINNET_WETH,
            ARBITRUM_MAINNET_ETH,
            ARBITRUM_MAINNET_WETH,
            BINANCE_MAINNET_WETH,
            GNOSIS_MAINNET_WETH
        ],
        [MAINNET_WETH]: [
            OPTIMISM_MAINNET_ETH,
            OPTIMISM_MAINNET_WETH,
            MATIC_MAINNET_WETH,
            ARBITRUM_MAINNET_ETH,
            ARBITRUM_MAINNET_WETH,
            BINANCE_MAINNET_WETH,
            GNOSIS_MAINNET_WETH
        ],
        [MAINNET_USDC]: [OPTIMISM_MAINNET_USDC, MATIC_MAINNET_USDC, ARBITRUM_MAINNET_USDC, BINANCE_MAINNET_USDC, GNOSIS_MAINNET_USDC]
    },
    [NETWORK.OPTIMISM]: {
        [OPTIMISM_MAINNET_ETH]: [
            MAINNET_ETH,
            MAINNET_WETH,
            MATIC_MAINNET_WETH,
            ARBITRUM_MAINNET_ETH,
            ARBITRUM_MAINNET_WETH,
            BINANCE_MAINNET_WETH,
            GNOSIS_MAINNET_WETH
        ],
        [OPTIMISM_MAINNET_WETH]: [
            MAINNET_ETH,
            MAINNET_WETH,
            MATIC_MAINNET_WETH,
            ARBITRUM_MAINNET_ETH,
            ARBITRUM_MAINNET_WETH,
            BINANCE_MAINNET_WETH,
            GNOSIS_MAINNET_WETH
        ],
        [OPTIMISM_MAINNET_USDC]: [MAINNET_USDC, MATIC_MAINNET_USDC, ARBITRUM_MAINNET_USDC, BINANCE_MAINNET_USDC, GNOSIS_MAINNET_USDC]
    },
    [NETWORK.ARBITRUM]: {
        [ARBITRUM_MAINNET_ETH]: [
            MAINNET_ETH,
            MAINNET_WETH,
            MATIC_MAINNET_WETH,
            OPTIMISM_MAINNET_ETH,
            OPTIMISM_MAINNET_WETH,
            BINANCE_MAINNET_WETH,
            GNOSIS_MAINNET_WETH
        ],
        [ARBITRUM_MAINNET_WETH]: [
            MAINNET_ETH,
            MAINNET_WETH,
            MATIC_MAINNET_WETH,
            OPTIMISM_MAINNET_ETH,
            OPTIMISM_MAINNET_WETH,
            BINANCE_MAINNET_WETH,
            GNOSIS_MAINNET_WETH
        ],
        [ARBITRUM_MAINNET_USDC]: [MAINNET_USDC, MATIC_MAINNET_USDC, OPTIMISM_MAINNET_USDC, BINANCE_MAINNET_USDC, GNOSIS_MAINNET_USDC]
    },
    [NETWORK.MATIC_MUMBAI]: {
        [MATIC_MAINNET_WETH]: [
            MAINNET_ETH,
            MAINNET_WETH,
            ARBITRUM_MAINNET_ETH,
            ARBITRUM_MAINNET_WETH,
            OPTIMISM_MAINNET_ETH,
            OPTIMISM_MAINNET_WETH,
            BINANCE_MAINNET_WETH,
            GNOSIS_MAINNET_WETH
        ],
        [MATIC_MAINNET_USDC]: [MAINNET_USDC, ARBITRUM_MAINNET_USDC, OPTIMISM_MAINNET_USDC, BINANCE_MAINNET_USDC, GNOSIS_MAINNET_USDC]
    },
    [NETWORK.BSC]: {
        [BINANCE_MAINNET_WETH]: [
            MAINNET_ETH,
            MAINNET_WETH,
            ARBITRUM_MAINNET_ETH,
            ARBITRUM_MAINNET_WETH,
            OPTIMISM_MAINNET_ETH,
            OPTIMISM_MAINNET_WETH,
            MATIC_MAINNET_WETH,
            GNOSIS_MAINNET_WETH
        ],
        [BINANCE_MAINNET_USDC]: [MAINNET_USDC, ARBITRUM_MAINNET_USDC, OPTIMISM_MAINNET_USDC, MATIC_MAINNET_USDC, GNOSIS_MAINNET_USDC]
    },
    [NETWORK.GNOSIS]: {
        [GNOSIS_MAINNET_WETH]: [
            MAINNET_ETH,
            MAINNET_WETH,
            ARBITRUM_MAINNET_ETH,
            ARBITRUM_MAINNET_WETH,
            OPTIMISM_MAINNET_ETH,
            OPTIMISM_MAINNET_WETH,
            MATIC_MAINNET_WETH,
            BINANCE_MAINNET_WETH
        ],
        [GNOSIS_MAINNET_USDC]: [MAINNET_USDC, ARBITRUM_MAINNET_USDC, OPTIMISM_MAINNET_USDC, MATIC_MAINNET_USDC, BINANCE_MAINNET_USDC]
    }
}
