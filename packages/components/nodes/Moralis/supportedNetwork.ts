import { INodeOptionsValue, NETWORK_LABEL } from '../../src';

export const MoralisSupportedNetworks = [
    {
        label: NETWORK_LABEL.MAINNET,
        name: 'eth'
    },
    {
        label: NETWORK_LABEL.ROPSTEN,
        name: 'ropsten'
    },
    {
        label: NETWORK_LABEL.RINKEBY,
        name: 'rinkeby'
    },
    {
        label: NETWORK_LABEL.GÖRLI,
        name: 'goerli'
    },
    {
        label: NETWORK_LABEL.KOVAN,
        name: 'kovan'
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
        label: NETWORK_LABEL.BSC,
        name: 'bsc'
    },
    {
        label: NETWORK_LABEL.BSC_TESTNET,
        name: 'bsc testnet'
    },
    {
        label: NETWORK_LABEL.AVALANCHE,
        name: 'avalanche'
    },
    {
        label: NETWORK_LABEL.AVALANCHE_TESTNET,
        name: 'avalanche testnet'
    },
    {
        label: NETWORK_LABEL.FANTOM,
        name: 'fantom'
    },
    {
        label: NETWORK_LABEL.CRONOS,
        name: 'cronos'
    },
    {
        label: NETWORK_LABEL.CRONOS_TESTNET,
        name: 'cronos testnet'
    }
] as INodeOptionsValue[];