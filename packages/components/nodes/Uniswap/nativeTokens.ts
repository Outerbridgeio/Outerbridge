import { ETH, ChainId } from 'simple-uniswap-sdk';

export interface INativeTokens {
    [key: string]: IToken;
}

export interface IToken {
    address: string;
    symbol: string;
    name: string;
    decimals: number
    chainId: number 
}

export const nativeTokens: INativeTokens = {
    homestead: {
        "address": ETH.MAINNET().contractAddress,
        "symbol": "ETH",
        "name": "ETH",
        "decimals": 18,
        "chainId": ChainId.MAINNET,
    },
    goerli: {
        "address": ETH.GORLI().contractAddress,
        "symbol": "ETH",
        "name": "ETH",
        "decimals": 18,
        "chainId": ChainId.GÖRLI,
    },
    rinkeby: {
        "address": ETH.RINKEBY().contractAddress,
        "symbol": "ETH",
        "name": "ETH",
        "decimals": 18,
        "chainId": ChainId.RINKEBY,
    },
    ropsten: {
        "address": ETH.ROPSTEN().contractAddress,
        "symbol": "ETH",
        "name": "ETH",
        "decimals": 18,
        "chainId": ChainId.ROPSTEN,
    },
    kovan: {
        "address": ETH.KOVAN().contractAddress,
        "symbol": "ETH",
        "name": "ETH",
        "decimals": 18,
        "chainId": ChainId.KOVAN,
    },
}