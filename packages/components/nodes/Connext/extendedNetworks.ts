import { INodeOptionsValue, NETWORK_LABEL, NETWORK } from '../../src';

export const testNetworks: INodeOptionsValue[] = [
    {
        label: NETWORK_LABEL.RINKEBY,
        name: NETWORK.RINKEBY
    },
    {
        label: NETWORK_LABEL.GÖRLI,
        name: NETWORK.GÖRLI
    },
    {
        label: NETWORK_LABEL.MATIC_MUMBAI,
        name: NETWORK.MATIC_MUMBAI
    },
]