import { INodeOptionsValue } from '../../src'
import { NETWORK, NETWORK_LABEL } from '../../src/ChainNetwork'

export const QuickNodeSupportedNetworks = [
    {
        label: NETWORK_LABEL.MAINNET,
        name: NETWORK.MAINNET
    },
    {
        label: NETWORK_LABEL.GÖRLI,
        name: NETWORK.GÖRLI
    },
    {
        label: NETWORK_LABEL.MATIC,
        name: NETWORK.MATIC
    },
    {
        label: NETWORK_LABEL.MATIC_MUMBAI,
        name: NETWORK.MATIC_MUMBAI
    },
    {
        label: NETWORK_LABEL.BSC,
        name: NETWORK.BSC
    },
    {
        label: NETWORK_LABEL.BSC_TESTNET,
        name: NETWORK.BSC_TESTNET
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
        label: NETWORK_LABEL.ARBITRUM_NOVA,
        name: NETWORK.ARBITRUM_NOVA
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
        label: NETWORK_LABEL.CELO,
        name: NETWORK.CELO
    },
    {
        label: NETWORK_LABEL.GNOSIS,
        name: NETWORK.GNOSIS
    },
    {
        label: NETWORK_LABEL.SOLANA,
        name: NETWORK.SOLANA
    },
    {
        label: NETWORK_LABEL.SOLANA_DEVNET,
        name: NETWORK.SOLANA_DEVNET
    },
    {
        label: NETWORK_LABEL.SOLANA_TESTNET,
        name: NETWORK.SOLANA_TESTNET
    }
] as INodeOptionsValue[]

//REMAINING: ALGORAND, HARMONY, STACKS
