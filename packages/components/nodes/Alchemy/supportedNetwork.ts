import { INodeOptionsValue } from '../../src'
import { NETWORK, NETWORK_LABEL } from '../../src/ChainNetwork'

export const AlchemySupportedNetworks = [
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
        label: NETWORK_LABEL.ARBITRUM,
        name: NETWORK.ARBITRUM
    },
    {
        label: NETWORK_LABEL.ARBITRUM_GOERLI,
        name: NETWORK.ARBITRUM_GOERLI
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
        label: NETWORK_LABEL.SOLANA,
        name: NETWORK.SOLANA
    },
    {
        label: NETWORK_LABEL.SOLANA_DEVNET,
        name: NETWORK.SOLANA_DEVNET
    }
] as INodeOptionsValue[]
