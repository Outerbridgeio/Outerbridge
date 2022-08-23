import { CHAIN_ID } from '../../src';

export interface IConnextToken {
    address: string;
    symbol: string;
    name: string;
    decimals: number
    chainId: CHAIN_ID 
}

export const testnetTokens: IConnextToken[] = [
    {
        "address": '0x3FFc03F05D1869f493c7dbf913E636C6280e0ff9',
        "symbol": "TEST",
        "name": "Test Token",
        "decimals": 18,
        "chainId": CHAIN_ID.RINKEBY,
    },
    {
        "address": '0xF25927315D101aC04C631878570152658defa7Db',
        "symbol": "TWETH",
        "name": "Test Wrapped Ether",
        "decimals": 18,
        "chainId": CHAIN_ID.RINKEBY,
    },
    {
        "address": '0xc778417E063141139Fce010982780140Aa0cD5Ab',
        "symbol": "WETH",
        "name": "Wrapped Ether",
        "decimals": 18,
        "chainId": CHAIN_ID.RINKEBY,
    },
    {
        "address": '0x26FE8a8f86511d678d031a022E48FfF41c6a3e3b',
        "symbol": "TEST",
        "name": "Test Token",
        "decimals": 18,
        "chainId": CHAIN_ID.GÖRLI,
    },
    {
        "address": '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        "symbol": "WETH",
        "name": "Wrapped Ether",
        "decimals": 18,
        "chainId": CHAIN_ID.GÖRLI,
    },
    {
        "address": '0x21c5a4dAeAf9625c781Aa996E9229eA95EE4Ff77',
        "symbol": "TEST",
        "name": "Test Token",
        "decimals": 18,
        "chainId": CHAIN_ID.MATIC_MUMBAI,
    },
    {
        "address": '0x4E2FCcA06dA37869047d84b82364d1831E5aa7E1',
        "symbol": "TWETH",
        "name": "Test Wrapped Ether",
        "decimals": 18,
        "chainId": CHAIN_ID.MATIC_MUMBAI,
    },
    {
        "address": '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
        "symbol": "WETH",
        "name": "Wrapped Ether",
        "decimals": 18,
        "chainId": CHAIN_ID.MATIC_MUMBAI,
    },
]