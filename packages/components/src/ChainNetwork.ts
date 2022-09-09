import { ICommonObject, INetworkMapping, INodeOptionsValue } from '.';
import { ethers } from "ethers";

/**
 * ENUMS
 */
export enum NETWORK {
    MAINNET = 'homestead',
    RINKEBY = 'rinkeby',
    GÖRLI = 'goerli',
    ROPSTEN = 'ropsten',
    KOVAN = 'kovan',
    MATIC_MUMBAI = 'maticmum',
    MATIC = 'matic',
    OPTIMISM = 'optimism',
    OPTIMISM_KOVAN = 'optimism-kovan',
    ARBITRUM = 'arbitrum',
    ARBITRUM_RINKEBY = 'arbitrum-rinkeby',
    BSC = 'bsc',
    BSC_TESTNET = 'bsc-testnet',
    AVALANCHE = 'avalanche',
    AVALANCHE_TESTNET = 'avalanche-testnet',
    FANTOM = 'fantom',
    CRONOS = 'cronos',
    CRONOS_TESTNET = 'cronos-testnet'
}

export enum NETWORK_LABEL {
    MAINNET = 'Mainnet',
    RINKEBY = 'Rinkeby',
    GÖRLI = 'Goerli',
    ROPSTEN = 'Ropsten',
    KOVAN = 'Kovan',
    MATIC_MUMBAI = 'Polygon Mumbai',
    MATIC = 'Polygon Mainnet',
    OPTIMISM = 'Optimism Mainnet',
    OPTIMISM_KOVAN = 'Optimism Kovan',
    ARBITRUM = 'Arbitrum Mainnet',
    ARBITRUM_RINKEBY = 'Arbitrum Rinkeby',
    BSC = 'Binance Smart Chain Mainnet',
    BSC_TESTNET = 'Binance Smart Chain Testnet',
    AVALANCHE = 'Avalanche Mainnet',
    AVALANCHE_TESTNET = 'Avalanche Testnet',
    FANTOM = 'Fantom',
    CRONOS = 'Cronos',
    CRONOS_TESTNET = 'Cronos Testnet'
}

export enum NETWORK_PROVIDER {
    INFURA = 'infura',
    ALCHEMY = 'alchemy',
    CLOUDFARE = 'cloudfare',
    CUSTOMRPC = 'customRPC',
    CUSTOMWSS = 'customWebsocket',
    BINANCE = 'binance',
    POLYGON = 'polygon'
}

export enum CHAIN_ID {
    MAINNET = 1,
    ROPSTEN = 3,
    RINKEBY = 4,
    GÖRLI = 5,
    KOVAN = 42,
    BINANCE_MAINNET = 56,
    BINANCE_TESTNET = 97,
    MATIC = 137,
    MATIC_MUMBAI = 80001,
    ARB_MAINNET = 42161,
    ARB_TESTNET = 421611,
    OPT_MAINNET = 10,
    OPT_TESTNET = 69
}

export enum DOMAIN_ID {
    MAINNET = 6648936,
    RINKEBY = 1111,
    GÖRLI = 3331,
    MATIC_MUMBAI = 9991,
}

/**
 * Networks
 */
export const ETHNetworks = [ 
    {
        label: NETWORK_LABEL.MAINNET,
        name: NETWORK.MAINNET,
        parentGroup: 'Ethereum'
    },
    {
        label: NETWORK_LABEL.RINKEBY,
        name: NETWORK.RINKEBY,
        parentGroup: 'Ethereum'
    },
    {
        label: NETWORK_LABEL.GÖRLI,
        name: NETWORK.GÖRLI,
        parentGroup: 'Ethereum'
    },
    {
        label: NETWORK_LABEL.ROPSTEN,
        name: NETWORK.ROPSTEN,
        parentGroup: 'Ethereum'
    },
    {
        label: NETWORK_LABEL.KOVAN,
        name: NETWORK.KOVAN,
        parentGroup: 'Ethereum'
    },
] as INodeOptionsValue[];

export const BSCNetworks = [ 
    {
        label: NETWORK_LABEL.BSC,
        name: NETWORK.BSC,
        parentGroup: 'Binance Smart Chain'
    },
    {
        label: NETWORK_LABEL.BSC_TESTNET,
        name: NETWORK.BSC_TESTNET,
        parentGroup: 'Binance Smart Chain'
    },
] as INodeOptionsValue[];

export const PolygonNetworks = [ 
    {
        label: NETWORK_LABEL.MATIC,
        name: NETWORK.MATIC,
        parentGroup: 'Polygon'
    },
    {
        label: NETWORK_LABEL.MATIC_MUMBAI,
        name: NETWORK.MATIC_MUMBAI,
        parentGroup: 'Polygon'
    },
] as INodeOptionsValue[];

export const ArbitrumNetworks = [ 
    {
        label: NETWORK_LABEL.ARBITRUM,
        name: NETWORK.ARBITRUM,
        parentGroup: 'Arbitrum'
    },
    {
        label: NETWORK_LABEL.ARBITRUM_RINKEBY,
        name: NETWORK.ARBITRUM_RINKEBY,
        parentGroup: 'Arbitrum'
    },
] as INodeOptionsValue[];

export const OptimismNetworks = [ 
    {
        label: NETWORK_LABEL.OPTIMISM,
        name: NETWORK.OPTIMISM,
        parentGroup: 'Optimism'
    },
    {
        label: NETWORK_LABEL.OPTIMISM_KOVAN,
        name: NETWORK.OPTIMISM_KOVAN,
        parentGroup: 'Optimism'
    },
] as INodeOptionsValue[];


/**
 * Network Providers
 */
export const customNetworkProviders = [
    {
        label: 'Custom RPC Endpoint',
        name: NETWORK_PROVIDER.CUSTOMRPC,
        description: 'HTTP endpoint',
        parentGroup: 'Custom Nodes'
    },
    {
        label: 'Custom Websocket Endpoint',
        name: NETWORK_PROVIDER.CUSTOMWSS,
        description: 'WSS Endpoint',
        parentGroup: 'Custom Nodes'
    },
] as INodeOptionsValue[];

export const infuraNetworkProviders = [
    {
        label: 'Infura',
        name: NETWORK_PROVIDER.INFURA,
        description: 'Infura RPC/Websocket',
        parentGroup: 'Private Nodes'
    },
] as INodeOptionsValue[];

export const alchemyNetworkProviders = [
    {
        label: 'Alchemy',
        name: NETWORK_PROVIDER.ALCHEMY,
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
        name: NETWORK_PROVIDER.CLOUDFARE,
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
        name: NETWORK_PROVIDER.POLYGON,
        description: 'Public Polygon RPC/Websocket',
        parentGroup: 'Public Nodes'
    },
    ...customNetworkProviders,
] as INodeOptionsValue[];

export const binanceNetworkProviders = [
    {
        label: 'Binance',
        name: NETWORK_PROVIDER.BINANCE,
        description: 'Public Binance RPC/Websocket',
        parentGroup: 'Public Nodes'
    },
    ...customNetworkProviders,
] as INodeOptionsValue[];

export function getCustomRPCProvider(jsonRPC: string) {
    return new ethers.providers.JsonRpcProvider(jsonRPC);
}

export function getCustomWebsocketProvider(websocketRPC: string) {
    return new ethers.providers.WebSocketProvider(websocketRPC);
}

export async function getBscMainnetProvider() {
    const prvs = [];
    for (let i = 0; i < binanceMainnetRPC.length; i++) {
        const node = binanceMainnetRPC[i];
        const prv = new ethers.providers.StaticJsonRpcProvider(
            { url: node, timeout: 1000 },
            { name: 'binance', chainId: CHAIN_ID.BINANCE_MAINNET },
        );
        await prv.ready;
        prvs.push({
            provider: prv,
            stallTimeout: 1000,
        });
    }
    return new ethers.providers.FallbackProvider(prvs);
}

export async function getBscTestnetProvider() {
    const prvs = [];
    for (let i = 0; i < binanceTestnetRPC.length; i++) {
        const node = binanceTestnetRPC[i];
        const prv = new ethers.providers.StaticJsonRpcProvider(
            { url: node, timeout: 1000 },
            { name: 'binance', chainId: CHAIN_ID.BINANCE_TESTNET },
        );
        await prv.ready;
        prvs.push({
            provider: prv,
            stallTimeout: 1000,
        });
    }
    return new ethers.providers.FallbackProvider(prvs);
}

export async function getPolygonMainnetProvider() {
    const prvs = [];
    for (let i = 0; i < polygonMainnetRPC.length; i++) {
        const node = polygonMainnetRPC[i];
        const prv = new ethers.providers.StaticJsonRpcProvider(
            { url: node, timeout: 1000 },
            {
                name: 'polygon',
                chainId: CHAIN_ID.MATIC,
            },
        );
        await prv.ready;
        prvs.push({
            provider: prv,
            stallTimeout: 1000,
        });
    }
    return new ethers.providers.FallbackProvider(prvs);
}

export async function getPolygonTestnetProvider() {
    const prvs = [];
    for (let i = 0; i < polygonMumbaiRPC.length; i++) {
        const node = polygonMumbaiRPC[i];
        const prv = new ethers.providers.StaticJsonRpcProvider(
            { url: node, timeout: 1000 },
            {
                name: 'polygon',
                chainId: CHAIN_ID.MATIC_MUMBAI,
            },
        );
        await prv.ready;
        prvs.push({
            provider: prv,
            stallTimeout: 1000,
        });
    }
    return new ethers.providers.FallbackProvider(prvs);
}

export async function getNetworkProvider(
    networkProvider: NETWORK_PROVIDER,
    network: NETWORK,
    credentials: ICommonObject | undefined,
    jsonRPC?: string,
    websocketRPC?: string,
) {
    if (
        credentials === undefined && 
        (networkProvider === NETWORK_PROVIDER.INFURA || networkProvider === NETWORK_PROVIDER.ALCHEMY)
    ) {
        throw new Error('Missing credentials');
    };
    
	switch (networkProvider) {
        case NETWORK_PROVIDER.ALCHEMY:
            return new ethers.providers.AlchemyProvider(network, credentials!.apiKey);
        case NETWORK_PROVIDER.INFURA:
            return new ethers.providers.InfuraProvider(network, {
                apiKey: credentials!.apiKey,
                secretKey: credentials!.secretKey
            });
        case NETWORK_PROVIDER.CLOUDFARE:
            return new ethers.providers.CloudflareProvider();
        case NETWORK_PROVIDER.BINANCE:
            if (network === NETWORK.BSC) return await getBscMainnetProvider();
			else if (network === NETWORK.BSC_TESTNET) return await getBscTestnetProvider();
            else return null;
        case NETWORK_PROVIDER.POLYGON:
            if (network === NETWORK.MATIC) return await getPolygonMainnetProvider();
			else if (network === NETWORK.MATIC_MUMBAI) return await getPolygonTestnetProvider();
            else return null;
        case NETWORK_PROVIDER.CUSTOMRPC:
            return jsonRPC ? getCustomRPCProvider(jsonRPC) : null;
        case NETWORK_PROVIDER.CUSTOMWSS:
            return websocketRPC ? getCustomWebsocketProvider(websocketRPC) : null;
        default:
            return null;
    }
}

export function getNetworkProvidersList(network: NETWORK): INodeOptionsValue[] {
    switch (network) {
        case NETWORK.MAINNET:
            return ethNetworkProviders;
        case NETWORK.RINKEBY:
        case NETWORK.GÖRLI:
        case NETWORK.KOVAN:
        case NETWORK.ROPSTEN:
            return ethTestNetworkProviders;
        case NETWORK.MATIC:
        case NETWORK.MATIC_MUMBAI:
            return polygonNetworkProviders;
        case NETWORK.OPTIMISM:
        case NETWORK.OPTIMISM_KOVAN:
            return ethTestNetworkProviders;
        case NETWORK.ARBITRUM:
        case NETWORK.ARBITRUM_RINKEBY:
            return ethTestNetworkProviders;
        case NETWORK.BSC:
        case NETWORK.BSC_TESTNET:
            return binanceNetworkProviders;
        default:
            return [];
    }
}

/**
 * URLs
 */
export const etherscanAPIs = {
    [NETWORK.MAINNET]: 'https://api.etherscan.io/api',
    [NETWORK.RINKEBY]: 'https://api-rinkeby.etherscan.io/api',
    [NETWORK.ROPSTEN]: 'https://api-kovan.etherscan.io/api',
    [NETWORK.KOVAN]: 'https://api-kovan.etherscan.io/api',
    [NETWORK.GÖRLI]: 'https://api-goerli.etherscan.io/api',
    [NETWORK.MATIC]: 'https://api.polygonscan.com/api',
    [NETWORK.MATIC_MUMBAI]: 'https://api-testnet.polygonscan.com/api',
    [NETWORK.OPTIMISM]: 'https://api-optimistic.etherscan.io/api',
    [NETWORK.OPTIMISM_KOVAN]: 'https://api-kovan-optimistic.etherscan.io/api',
    [NETWORK.ARBITRUM]: 'https://api.arbiscan.io/api',
    [NETWORK.ARBITRUM_RINKEBY]: 'https://api-testnet.arbiscan.io/api',
    [NETWORK.BSC]: 'https://api.bscscan.com/api',
    [NETWORK.BSC_TESTNET]: 'https://api-testnet.bscscan.com/api',
} as INetworkMapping;

export const infuraHTTPAPIs = {
    [NETWORK.MAINNET]: 'https://mainnet.infura.io/v3/',
    [NETWORK.RINKEBY]: 'https://rinkeby.infura.io/v3/',
    [NETWORK.ROPSTEN]: 'https://ropsten.infura.io/v3/',
    [NETWORK.KOVAN]: 'https://kovan.infura.io/v3/',
    [NETWORK.GÖRLI]: 'https://goerli.infura.io/v3/',
    [NETWORK.MATIC]: 'https://polygon-mainnet.infura.io/v3/',
    [NETWORK.MATIC_MUMBAI]: 'https://polygon-mumbai.infura.io/v3/',
    [NETWORK.OPTIMISM]: 'https://optimism-mainnet.infura.io/v3/',
    [NETWORK.OPTIMISM_KOVAN]: 'https://optimism-kovan.infura.io/v3/',
    [NETWORK.ARBITRUM]: 'https://arbitrum-mainnet.infura.io/v3/',
    [NETWORK.ARBITRUM_RINKEBY]: 'https://arbitrum-rinkeby.infura.io/v3/',
} as INetworkMapping;

export const infuraWSSAPIs = {
    [NETWORK.MAINNET]: 'wss://mainnet.infura.io/ws/v3/',
    [NETWORK.RINKEBY]: 'wss://rinkeby.infura.io/ws/v3/',
    [NETWORK.ROPSTEN]: 'wss://ropsten.infura.io/ws/v3/',
    [NETWORK.KOVAN]: 'wss://kovan.infura.io/ws/v3/',
    [NETWORK.GÖRLI]: 'wss://goerli.infura.io/ws/v3/',
    [NETWORK.MATIC]: 'wss://polygon-mainnet.infura.io/ws/v3/',
    [NETWORK.MATIC_MUMBAI]: 'wss://polygon-mumbai.infura.io/ws/v3/',
    [NETWORK.OPTIMISM]: 'wss://optimism-mainnet.infura.io/ws/v3/',
    [NETWORK.OPTIMISM_KOVAN]: 'wss://optimism-kovan.infura.io/ws/v3/',
    [NETWORK.ARBITRUM]: 'wss://arbitrum-mainnet.infura.io/ws/v3/',
    [NETWORK.ARBITRUM_RINKEBY]: 'wss://arbitrum-rinkeby.infura.io/ws/v3/',
} as INetworkMapping;

export const alchemyHTTPAPIs = {
    [NETWORK.MAINNET]: 'https://eth-mainnet.alchemyapi.io/v2/',
    [NETWORK.RINKEBY]: 'https://eth-rinkeby.alchemyapi.io/v2/',
    [NETWORK.ROPSTEN]: 'https://eth-ropsten.alchemyapi.io/v2/',
    [NETWORK.KOVAN]: 'https://eth-kovan.alchemyapi.io/v2/',
    [NETWORK.GÖRLI]: 'https://eth-goerli.alchemyapi.io/v2/',
    [NETWORK.MATIC]: 'https://polygon-mainnet.g.alchemy.com/v2/',
    [NETWORK.MATIC_MUMBAI]: 'https://polygon-mumbai.g.alchemy.com/v2/',
    [NETWORK.OPTIMISM]: 'https://opt-mainnet.g.alchemy.com/v2/',
    [NETWORK.OPTIMISM_KOVAN]: 'https://opt-kovan.g.alchemy.com/v2/',
    [NETWORK.ARBITRUM]: 'https://arb-mainnet.g.alchemy.com/v2/',
    [NETWORK.ARBITRUM_RINKEBY]: 'https://arb-rinkeby.g.alchemy.com/v2/',
} as INetworkMapping;

export const alchemyWSSAPIs = {
    [NETWORK.MAINNET]: 'wss://eth-mainnet.alchemyapi.io/v2/',
    [NETWORK.RINKEBY]: 'wss://eth-rinkeby.alchemyapi.io/v2/',
    [NETWORK.ROPSTEN]: 'wss://eth-ropsten.alchemyapi.io/v2/',
    [NETWORK.KOVAN]: 'wss://eth-kovan.alchemyapi.io/v2/',
    [NETWORK.GÖRLI]: 'wss://eth-goerli.alchemyapi.io/v2/',
    [NETWORK.MATIC]: 'wss://polygon-mainnet.g.alchemy.com/v2/',
    [NETWORK.MATIC_MUMBAI]: 'wss://polygon-mumbai.g.alchemy.com/v2/',
    [NETWORK.OPTIMISM]: 'wss://opt-mainnet.g.alchemy.com/v2/',
    [NETWORK.OPTIMISM_KOVAN]: 'wss://opt-kovan.g.alchemy.com/v2/',
    [NETWORK.ARBITRUM]: 'wss://arb-mainnet.g.alchemy.com/v2/',
    [NETWORK.ARBITRUM_RINKEBY]: 'wss://arb-rinkeby.g.alchemy.com/v2/',
} as INetworkMapping;

export const networkExplorers = {
    [NETWORK.MAINNET]: 'https://etherscan.io',
    [NETWORK.RINKEBY]: 'https://rinkeby.etherscan.io',
    [NETWORK.ROPSTEN]: 'https://ropsten.etherscan.io',
    [NETWORK.KOVAN]: 'https://kovan.etherscan.io',
    [NETWORK.GÖRLI]: 'https://goerli.etherscan.io',
    [NETWORK.MATIC]: 'https://polygonscan.com',
    [NETWORK.MATIC_MUMBAI]: 'https://mumbai.polygonscan.com',
    [NETWORK.OPTIMISM]: 'https://optimistic.etherscan.io',
    [NETWORK.OPTIMISM_KOVAN]: 'https://kovan-optimistic.etherscan.io',
    [NETWORK.ARBITRUM]: 'https://arbiscan.io',
    [NETWORK.ARBITRUM_RINKEBY]: 'https://rinkeby-explorer.arbitrum.io',
    [NETWORK.BSC]: 'https://bscscan.com',
    [NETWORK.BSC_TESTNET]: 'https://testnet.bscscan.com',
} as INetworkMapping;

export const openseaExplorers = {
    [NETWORK.MAINNET]: 'https://opensea.io',
    [NETWORK.RINKEBY]: 'https://testnets.opensea.io',
    [NETWORK.ROPSTEN]: 'https://testnets.opensea.io',
    [NETWORK.KOVAN]: 'https://testnets.opensea.io',
    [NETWORK.GÖRLI]: 'https://testnets.opensea.io',
    [NETWORK.MATIC]: 'https://opensea.io/assets/matic',
    [NETWORK.MATIC_MUMBAI]: 'https://testnets.opensea.io/assets/mumbai',
} as INetworkMapping;

export const binanceTestnetRPC = [
    'https://data-seed-prebsc-2-s2.binance.org:8545',
    'https://data-seed-prebsc-1-s1.binance.org:8545',
] as string[];

export const binanceMainnetRPC = [
    'https://bsc-dataseed1.ninicoin.io',
    'https://bsc-dataseed1.defibit.io',
    'https://bsc-dataseed.binance.org',
    'https://bsc.nodereal.io'
] as string[];

export const polygonMumbaiRPC = [
    'https://matic-testnet-archive-rpc.bwarelabs.com',
    'https://rpc-mumbai.maticvigil.com',
    'https://matic-mumbai.chainstacklabs.com',
    'https://rpc-mumbai.matic.today',
] as string[];

export const polygonMainnetRPC = [
    'https://rpc-mainnet.matic.network',
    'https://polygon-rpc.com',
] as string[];

export const chainIdLookup = {
    [NETWORK.MAINNET]: CHAIN_ID.MAINNET,
    [NETWORK.RINKEBY]: CHAIN_ID.RINKEBY,
    [NETWORK.ROPSTEN]: CHAIN_ID.ROPSTEN,
    [NETWORK.KOVAN]: CHAIN_ID.KOVAN,
    [NETWORK.GÖRLI]: CHAIN_ID.GÖRLI,
    [NETWORK.MATIC]: CHAIN_ID.MATIC,
    [NETWORK.MATIC_MUMBAI]: CHAIN_ID.MATIC_MUMBAI,
    [NETWORK.OPTIMISM]: CHAIN_ID.OPT_MAINNET,
    [NETWORK.OPTIMISM_KOVAN]: CHAIN_ID.OPT_TESTNET,
    [NETWORK.ARBITRUM]: CHAIN_ID.ARB_MAINNET,
    [NETWORK.ARBITRUM_RINKEBY]: CHAIN_ID.ARB_TESTNET,
    [NETWORK.BSC]: CHAIN_ID.BINANCE_MAINNET,
    [NETWORK.BSC_TESTNET]: CHAIN_ID.BINANCE_TESTNET,
} as INetworkMapping;

export const domainIdLookup = {
    [NETWORK.MAINNET]: DOMAIN_ID.MAINNET,
    [NETWORK.RINKEBY]: DOMAIN_ID.RINKEBY,
    [NETWORK.GÖRLI]: DOMAIN_ID.GÖRLI,
    [NETWORK.MATIC_MUMBAI]: DOMAIN_ID.MATIC_MUMBAI,
} as INetworkMapping;

export const nativeCurrency = {
    [NETWORK.MAINNET]: 'ETH',
    [NETWORK.RINKEBY]: 'ETH',
    [NETWORK.ROPSTEN]: 'ETH',
    [NETWORK.KOVAN]: 'ETH',
    [NETWORK.GÖRLI]: 'ETH',
    [NETWORK.MATIC]: 'MATIC',
    [NETWORK.MATIC_MUMBAI]: 'MATIC',
    [NETWORK.OPTIMISM]: 'ETH',
    [NETWORK.OPTIMISM_KOVAN]: 'ETH',
    [NETWORK.ARBITRUM]: 'ETH',
    [NETWORK.ARBITRUM_RINKEBY]: 'ETH',
    [NETWORK.BSC]: 'BNB',
    [NETWORK.BSC_TESTNET]: 'BNB',
} as INetworkMapping;