import { INodeOptionsValue, INodeParams } from '.';

/**
 * Networks
 */
export const ETHNetworks = [ 
    {
        label: 'Mainnet',
        name: 'homestead',
        parentGroup: 'Ethereum'
    },
    {
        label: 'Rinkeby',
        name: 'rinkeby',
        parentGroup: 'Ethereum'
    },
    {
        label: 'Goerli',
        name: 'goerli',
        parentGroup: 'Ethereum'
    },
    {
        label: 'Ropsten',
        name: 'ropsten',
        parentGroup: 'Ethereum'
    },
    {
        label: 'Kovan',
        name: 'kovan',
        parentGroup: 'Ethereum'
    },
] as INodeOptionsValue[];

export const BSCNetworks = [ 
    {
        label: 'Binance Smart Chain Mainnet',
        name: 'bsc',
        parentGroup: 'Binance Smart Chain'
    },
    {
        label: 'Binance Smart Chain Testnet',
        name: 'bsc-testnet',
        parentGroup: 'Binance Smart Chain'
    },
] as INodeOptionsValue[];

export const PolygonNetworks = [ 
    {
        label: 'Polygon Mainnet',
        name: 'matic',
        parentGroup: 'Polygon'
    },
    {
        label: 'Polygon Mumbai',
        name: 'maticmum',
        parentGroup: 'Polygon'
    },
] as INodeOptionsValue[];

export const ArbitrumNetworks = [ 
    {
        label: 'Arbitrum Mainnet',
        name: 'arbitrum',
        parentGroup: 'Arbitrum'
    },
    {
        label: 'Arbitrum Rinkeby',
        name: 'arbitrum-rinkeby',
        parentGroup: 'Arbitrum'
    },
] as INodeOptionsValue[];

export const OptimismNetworks = [ 
    {
        label: 'Optimism Mainnet',
        name: 'optimism',
        parentGroup: 'Optimism'
    },
    {
        label: 'Optimism Kovan',
        name: 'optimism-kovan',
        parentGroup: 'Optimism'
    },
] as INodeOptionsValue[];


/**
 * Network Providers
 */
export const customNetworkProviders = [
    {
        label: 'Custom RPC Endpoint',
        name: 'customRPC',
        description: 'HTTP endpoint',
        parentGroup: 'Custom Nodes'
    },
    {
        label: 'Custom Websocket Endpoint',
        name: 'customWebsocket',
        description: 'WSS Endpoint',
        parentGroup: 'Custom Nodes'
    },
] as INodeOptionsValue[];

export const infuraNetworkProviders = [
    {
        label: 'Infura',
        name: 'infura',
        description: 'Infura RPC/Websocket',
        parentGroup: 'Private Nodes'
    },
] as INodeOptionsValue[];

export const alchemyNetworkProviders = [
    {
        label: 'Alchemy',
        name: 'alchemy',
        description: 'Alchemy RPC/Websocket',
        parentGroup: 'Private Nodes'
    },
] as INodeOptionsValue[];

export const ethTestNetworkProviders = [
    ...alchemyNetworkProviders,
    ...infuraNetworkProviders,
    ...customNetworkProviders,
] as INodeOptionsValue[];

export const ethNetworkProviders = [
    ...alchemyNetworkProviders,
    ...infuraNetworkProviders,
    {
        label: 'Cloudfare',
        name: 'cloudfare',
        description: 'Public Cloudfare RPC',
        parentGroup: 'Public Nodes'
    },
    ...customNetworkProviders,
] as INodeOptionsValue[];

export const polygonNetworkProviders = [
    ...alchemyNetworkProviders,
    ...infuraNetworkProviders,
    {
        label: 'Polygon',
        name: 'polygon',
        description: 'Public Polygon RPC/Websocket',
        parentGroup: 'Public Nodes'
    },
    ...customNetworkProviders,
] as INodeOptionsValue[];

export const binanceNetworkProviders = [
    {
        label: 'Binance',
        name: 'binance',
        description: 'Public Binance RPC/Websocket',
        parentGroup: 'Public Nodes'
    },
    ...customNetworkProviders,
] as INodeOptionsValue[];


/**
 * URLs
 */
export const etherscanAPIs = {
    'homestead': 'https://api.etherscan.io/api',
    'rinkeby': 'https://api-rinkeby.etherscan.io/api',
    'ropsten': 'https://api-kovan.etherscan.io/api',
    'kovan': 'https://api-kovan.etherscan.io/api',
    'goerli': 'https://api-goerli.etherscan.io/api',
    'matic': 'https://api.polygonscan.com/api',
    'maticmum': 'https://api-testnet.polygonscan.com/api',
    'optimism': 'https://api-optimistic.etherscan.io/api',
    'optimism-kovan': 'https://api-kovan-optimistic.etherscan.io/api',
    'arbitrum': 'https://api.arbiscan.io/api',
    'arbitrum-rinkeby': 'https://api-testnet.arbiscan.io/api',
    'bsc': 'https://api.bscscan.com/api',
    'bsc-testnet': 'https://api-testnet.bscscan.com/api',
} as any;  // tslint:disable-line: no-any

export const infuraHTTPAPIs = {
    'homestead': 'https://mainnet.infura.io/v3/',
    'rinkeby': 'https://rinkeby.infura.io/v3/',
    'ropsten': 'https://ropsten.infura.io/v3/',
    'kovan': 'https://kovan.infura.io/v3/',
    'goerli': 'https://goerli.infura.io/v3/',
    'matic': 'https://polygon-mainnet.infura.io/v3/',
    'maticmum': 'https://polygon-mumbai.infura.io/v3/',
    'optimism': 'https://optimism-mainnet.infura.io/v3/',
    'optimism-kovan': 'https://optimism-kovan.infura.io/v3/',
    'arbitrum': 'https://arbitrum-mainnet.infura.io/v3/',
    'arbitrum-rinkeby': 'https://arbitrum-rinkeby.infura.io/v3/',
} as any;  // tslint:disable-line: no-any

export const infuraWSSAPIs = {
    'homestead': 'wss://mainnet.infura.io/ws/v3/',
    'rinkeby': 'wss://rinkeby.infura.io/ws/v3/',
    'ropsten': 'wss://ropsten.infura.io/ws/v3/',
    'kovan': 'wss://kovan.infura.io/ws/v3/',
    'goerli': 'wss://goerli.infura.io/ws/v3/',
    'matic': 'wss://polygon-mainnet.infura.io/ws/v3/',
    'maticmum': 'wss://polygon-mumbai.infura.io/ws/v3/',
    'optimism': 'wss://optimism-mainnet.infura.io/ws/v3/',
    'optimism-kovan': 'wss://optimism-kovan.infura.io/ws/v3/',
    'arbitrum': 'wss://arbitrum-mainnet.infura.io/ws/v3/',
    'arbitrum-rinkeby': 'wss://arbitrum-rinkeby.infura.io/ws/v3/',
} as any;  // tslint:disable-line: no-any

export const alchemyHTTPAPIs = {
    'homestead': 'https://eth-mainnet.alchemyapi.io/v2/',
    'rinkeby': 'https://eth-rinkeby.alchemyapi.io/v2/',
    'ropsten': 'https://eth-ropsten.alchemyapi.io/v2/',
    'kovan': 'https://eth-kovan.alchemyapi.io/v2/',
    'goerli': 'https://eth-goerli.alchemyapi.io/v2/',
    'matic': 'https://polygon-mainnet.g.alchemy.com/v2/',
    'maticmum': 'https://polygon-mumbai.g.alchemy.com/v2/',
    'optimism': 'https://opt-mainnet.g.alchemy.com/v2/',
    'optimism-kovan': 'https://opt-kovan.g.alchemy.com/v2/',
    'arbitrum': 'https://arb-mainnet.g.alchemy.com/v2/',
    'arbitrum-rinkeby': 'https://arb-rinkeby.g.alchemy.com/v2/',
} as any;  // tslint:disable-line: no-any

export const alchemyWSSAPIs = {
    'homestead': 'wss://eth-mainnet.alchemyapi.io/v2/',
    'rinkeby': 'wss://eth-rinkeby.alchemyapi.io/v2/',
    'ropsten': 'wss://eth-ropsten.alchemyapi.io/v2/',
    'kovan': 'wss://eth-kovan.alchemyapi.io/v2/',
    'goerli': 'wss://eth-goerli.alchemyapi.io/v2/',
    'matic': 'wss://polygon-mainnet.g.alchemy.com/v2/',
    'maticmum': 'wss://polygon-mumbai.g.alchemy.com/v2/',
    'optimism': 'wss://opt-mainnet.g.alchemy.com/v2/',
    'optimism-kovan': 'wss://opt-kovan.g.alchemy.com/v2/',
    'arbitrum': 'wss://arb-mainnet.g.alchemy.com/v2/',
    'arbitrum-rinkeby': 'wss://arb-rinkeby.g.alchemy.com/v2/',
} as any;  // tslint:disable-line: no-any


export const networkExplorers = {
    'homestead': 'https://etherscan.io',
    'rinkeby': 'https://rinkeby.etherscan.io',
    'ropsten': 'https://ropsten.etherscan.io',
    'kovan': 'https://kovan.etherscan.io',
    'goerli': 'https://goerli.etherscan.io',
    'matic': 'https://polygonscan.com',
    'maticmum': 'https://mumbai.polygonscan.com',
    'optimism': 'https://optimistic.etherscan.io',
    'optimism-kovan': 'https://kovan-optimistic.etherscan.io',
    'arbitrum': 'https://arbiscan.io',
    'arbitrum-rinkeby': 'https://rinkeby-explorer.arbitrum.io',
    'bsc': 'https://bscscan.com',
    'bsc-testnet': 'https://testnet.bscscan.com',
    'localhost': '',
} as any;  // tslint:disable-line: no-any

export const openseaExplorers = {
    'homestead': 'https://opensea.io',
    'rinkeby': 'https://testnets.opensea.io',
    'ropsten': 'https://testnets.opensea.io',
    'kovan': 'https://testnets.opensea.io',
    'goerli': 'https://testnets.opensea.io',
    'matic': 'https://opensea.io/assets/matic',
    'maticmum': 'https://testnets.opensea.io/assets/mumbai',
} as any;  // tslint:disable-line: no-any

export const binanceTestnetRPC = [
    'https://data-seed-prebsc-2-s2.binance.org:8545/',
    'https://data-seed-prebsc-1-s1.binance.org:8545/',
];

export const binanceMainnetRPC = [
    'https://bsc-dataseed1.ninicoin.io/',
    'https://bsc-dataseed1.defibit.io/',
    'https://bsc-dataseed.binance.org/',
];

export const polygonMumbaiRPC = [
    'https://matic-testnet-archive-rpc.bwarelabs.com',
    'https://rpc-mumbai.maticvigil.com',
    'https://matic-mumbai.chainstacklabs.com',
    'https://rpc-mumbai.matic.today',
];

export const polygonMainnetRPC = [
    'https://rpc-mainnet.matic.network',
    'https://polygon-rpc.com/',
];

export const binanceMainnetChainID = 56;

export const binanceTestnetChainID = 97;

export const polygonMumbaiChainID = 80001;

export const polygonMainnetChainID = 137;

export const arbMainnetChainID = 42161;

export const arbRinkebyChainID = 421611;

export const optimsmMainnetChainID = 10;

export const optimsmKovanChainID = 69;

export const mainCurrency = {
    'homestead': 'ETH',
    'rinkeby': 'ETH',
    'ropsten': 'ETH',
    'kovan': 'ETH',
    'goerli': 'ETH',
    'matic': 'MATIC',
    'maticmum': 'MATIC',
    'optimism': 'ETH',
    'optimism-kovan': 'ETH',
    'arbitrum': 'ETH',
    'arbitrum-rinkeby': 'ETH',
    'bsc': 'BNB',
    'bsc-testnet': 'BNB',
} as any;  // tslint:disable-line: no-any