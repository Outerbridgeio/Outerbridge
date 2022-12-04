import { INodeOptionsValue } from '../../src'
import { NETWORK, NETWORK_LABEL } from '../../src/ChainNetwork'

export type prebuiltType =
    | 'edition'
    | 'edition-drop'
    | 'marketplace'
    | 'multiwrap'
    | 'nft-collection'
    | 'nft-drop'
    | 'pack'
    | 'signature-drop'
    | 'split'
    | 'token'
    | 'token-drop'
    | 'vote'

export const ThirdWebSupportedNetworks = [
    {
        label: NETWORK_LABEL.MAINNET,
        name: 'mainnet'
    },
    {
        label: NETWORK_LABEL.GÖRLI,
        name: 'goerli'
    },
    {
        label: NETWORK_LABEL.MATIC,
        name: 'polygon'
    },
    {
        label: NETWORK_LABEL.MATIC_MUMBAI,
        name: 'mumbai'
    },
    {
        label: NETWORK_LABEL.ARBITRUM,
        name: NETWORK.ARBITRUM
    },
    {
        label: NETWORK_LABEL.ARBITRUM_GOERLI,
        name: NETWORK.ARBITRUM_GOERLI
    },
    {
        label: NETWORK_LABEL.AVALANCHE,
        name: NETWORK.AVALANCHE
    },
    {
        label: NETWORK_LABEL.AVALANCHE_TESTNET,
        name: NETWORK.AVALANCHE_TESTNET
    },
    {
        label: NETWORK_LABEL.OPTIMISM,
        name: NETWORK.OPTIMISM
    },
    {
        label: NETWORK_LABEL.OPTIMISM_GOERLI,
        name: NETWORK.OPTIMISM_GOERLI
    },
    {
        label: NETWORK_LABEL.FANTOM,
        name: NETWORK.FANTOM
    },
    {
        label: NETWORK_LABEL.FANTOM_TESTNET,
        name: NETWORK.FANTOM_TESTNET
    },
    {
        label: NETWORK_LABEL.BSC,
        name: 'binance'
    },
    {
        label: NETWORK_LABEL.BSC_TESTNET,
        name: 'binance-testnet'
    }
    /*
    {
        label: NETWORK_LABEL.SOLANA,
        name: 'mainnet-beta'
    },
    {
        label: NETWORK_LABEL.SOLANA_DEVNET,
        name: 'devnet'
    },
    {
        label: NETWORK_LABEL.SOLANA_TESTNET,
        name: 'testnet'
    }
    */
] as INodeOptionsValue[]

export const ThirdWebSupportedPrebuiltContract = [
    {
        label: 'edition',
        name: 'edition'
    },
    {
        label: 'edition-drop',
        name: 'edition-drop'
    },
    {
        label: 'marketplace',
        name: 'marketplace'
    },
    {
        label: 'multiwrap',
        name: 'multiwrap'
    },
    {
        label: 'nft-collection',
        name: 'nft-collection'
    },
    {
        label: 'nft-drop',
        name: 'nft-drop'
    },
    {
        label: 'pack',
        name: 'pack'
    },
    {
        label: 'signature-drop',
        name: 'signature-drop'
    },
    {
        label: 'split',
        name: 'split'
    },
    {
        label: 'token',
        name: 'token'
    },
    {
        label: 'token-drop',
        name: 'token-drop'
    },
    {
        label: 'vote',
        name: 'vote'
    }
] as INodeOptionsValue[]
