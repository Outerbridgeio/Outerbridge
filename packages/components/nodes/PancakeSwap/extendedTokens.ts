import { CHAIN_ID } from '../../src';

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
    'bsc': {
        "address": '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c_ETH',
        "symbol": "BNB",
        "name": "BNB",
        "decimals": 18,
        "chainId": CHAIN_ID.BINANCE_MAINNET,
    },
    'bsc-testnet': {
        "address": '0xae13d989dac2f0debff460ac112a837c89baa7cd_ETH',
        "symbol": "BNB",
        "name": "BNB",
        "decimals": 18,
        "chainId": CHAIN_ID.BINANCE_TESTNET,
    },
}