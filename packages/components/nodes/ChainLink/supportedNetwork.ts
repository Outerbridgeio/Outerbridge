import { INodeOptionsValue } from "../../src";
import { NETWORK, NETWORK_LABEL } from "../../src/ChainNetwork";

export const chainLinkNetworkMapping = {
    [NETWORK.MAINNET]: 'Ethereum Mainnet',
    [NETWORK.GÖRLI]: 'Goerli Testnet',
    [NETWORK.ARBITRUM]: 'Arbitrum Mainnet',
    [NETWORK.ARBITRUM_GOERLI]: 'Arbitrum Goerli',
    [NETWORK.OPTIMISM]: 'Optimism Mainnet',
    [NETWORK.OPTIMISM_GOERLI]: 'Optimism Goerli',
    [NETWORK.MATIC]: 'Polygon Mainnet',
    [NETWORK.MATIC_MUMBAI]: 'Mumbai Testnet',
    [NETWORK.BSC]: 'BNB Chain Mainnet',
    [NETWORK.BSC_TESTNET]: 'BNB Chain Mainnet',
    [NETWORK.GNOSIS]: 'Gnosis Chain Mainnet',
    [NETWORK.HECO]: 'HECO Mainnet',
    [NETWORK.FANTOM]: 'Fantom Mainnet',
    [NETWORK.FANTOM_TESTNET]: 'Fantom Testnet',
    [NETWORK.AVALANCHE]: 'Avalanche Mainnet',
    [NETWORK.AVALANCHE_TESTNET]: 'Avalanche Testnet',
    [NETWORK.SOLANA]: 'Solana Mainnet',
    [NETWORK.SOLANA_DEVNET]: 'Solana Devnet',
    [NETWORK.HARMONY]: 'Harmony Mainnet',
    [NETWORK.MOONRIVER]: 'Moonriver Mainnet',
    [NETWORK.MOONBEAM]: 'Moonbeam Mainnet',
    [NETWORK.METIS]: 'Metis Mainnet',
    [NETWORK.KLATYN_TESTNET]: 'Klaytn Baobab testnet',
} as any;

export const chainLinkNetworks = [
    {
        label: NETWORK_LABEL.MAINNET,
        name: NETWORK.MAINNET,
        parentGroup: 'Ethereum',
        hide: {
            'actions.operation': ['getNFTFloorPricing']
        }
    },
    {
        label: NETWORK_LABEL.GÖRLI,
        name: NETWORK.GÖRLI,
        parentGroup: 'Ethereum',
        hide: {
            'actions.operation': ['getProofReserve']
        }
    },
    {
        label: NETWORK_LABEL.MATIC,
        name: NETWORK.MATIC,
        parentGroup: 'Polygon',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: NETWORK_LABEL.MATIC_MUMBAI,
        name: NETWORK.MATIC_MUMBAI,
        parentGroup: 'Polygon',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: NETWORK_LABEL.ARBITRUM,
        name: NETWORK.ARBITRUM,
        parentGroup: 'Arbitrum',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: NETWORK_LABEL.ARBITRUM_GOERLI,
        name: NETWORK.ARBITRUM_GOERLI,
        parentGroup: 'Arbitrum',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: NETWORK_LABEL.AVALANCHE,
        name: NETWORK.AVALANCHE,
        parentGroup: 'Avalanche',
        hide: {
            'actions.operation': ['getNFTFloorPricing']
        }
    },
    {
        label: NETWORK_LABEL.AVALANCHE_TESTNET,
        name: NETWORK.AVALANCHE_TESTNET,
        parentGroup: 'Avalanche',
        hide: {
            'actions.operation': ['getNFTFloorPricing']
        }
    },
    {
        label: NETWORK_LABEL.OPTIMISM,
        name: NETWORK.OPTIMISM,
        parentGroup: 'Optimism',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: NETWORK_LABEL.OPTIMISM_GOERLI,
        name: NETWORK.OPTIMISM_GOERLI,
        parentGroup: 'Optimism',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: NETWORK_LABEL.BSC,
        name: NETWORK.BSC,
        parentGroup: 'Binance Smart Chain',
        hide: {
            'actions.operation': ['getNFTFloorPricing']
        }
    },
    {
        label: NETWORK_LABEL.BSC_TESTNET,
        name: NETWORK.BSC_TESTNET,
        parentGroup: 'Binance Smart Chain',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: NETWORK_LABEL.GNOSIS,
        name: NETWORK.GNOSIS,
        parentGroup: 'Gnosis',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: NETWORK_LABEL.HECO,
        name: NETWORK.HECO,
        parentGroup: 'Heco',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: NETWORK_LABEL.FANTOM,
        name: NETWORK.FANTOM,
        parentGroup: 'Fantom',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: NETWORK_LABEL.FANTOM_TESTNET,
        name: NETWORK.FANTOM_TESTNET,
        parentGroup: 'Fantom',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: NETWORK_LABEL.SOLANA,
        name: NETWORK.SOLANA,
        parentGroup: 'Solana',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: NETWORK_LABEL.SOLANA_DEVNET,
        name: NETWORK.SOLANA_DEVNET,
        parentGroup: 'Solana',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: NETWORK_LABEL.HARMONY,
        name: NETWORK.HARMONY,
        parentGroup: 'Harmony',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: NETWORK_LABEL.MOONRIVER,
        name: NETWORK.MOONRIVER,
        parentGroup: 'Moonriver',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: NETWORK_LABEL.MOONBEAM,
        name: NETWORK.MOONBEAM,
        parentGroup: 'Moonbeam',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: NETWORK_LABEL.METIS,
        name: NETWORK.METIS,
        parentGroup: 'Metis',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
    {
        label: NETWORK_LABEL.KLATYN_TESTNET,
        name: NETWORK.KLATYN_TESTNET,
        parentGroup: 'Klaytn Baobab testnet',
        hide: {
            'actions.operation': ['getProofReserve', 'getNFTFloorPricing']
        }
    },
] as INodeOptionsValue[];