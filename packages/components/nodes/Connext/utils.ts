import { ethers } from "ethers";
import { binanceMainnetRPC, binanceTestnetRPC, chainIdLookup, getBscMainnetProvider, getBscTestnetProvider, getPolygonMainnetProvider, getPolygonTestnetProvider, INodeOptionsValue, NETWORK, polygonMainnetRPC, polygonMumbaiRPC } from "../../src";
import { testnetTokens } from "./extendedTokens";

export function getTokensNetwork(returnData: INodeOptionsValue[], network: NETWORK): INodeOptionsValue[] {
    let tokens = testnetTokens;
    tokens = tokens.filter((tkn) => tkn.chainId === chainIdLookup[network]);
    for (let i = 0; i < tokens.length; i+=1) {
        const token = tokens[i];
        const data = {
            label: `${token.name} (${token.symbol})`,
            name: `${token.address};${token.symbol};${token.name}`,
        } as INodeOptionsValue;
        returnData.push(data);
    }
    return returnData;
}

export async function getNetworkProviderForConnext(network: NETWORK, jsonRPC?: string) {
    switch (network) {
        case NETWORK.MAINNET:
        case NETWORK.RINKEBY:
        case NETWORK.GÖRLI:
        case NETWORK.KOVAN:
        case NETWORK.ROPSTEN:
        case NETWORK.ARBITRUM:
        case NETWORK.ARBITRUM_RINKEBY:
        case NETWORK.OPTIMISM:
        case NETWORK.OPTIMISM_KOVAN:
            return new ethers.providers.JsonRpcProvider(jsonRPC);
        case NETWORK.MATIC:
        case NETWORK.MATIC_MUMBAI:
            if (network === NETWORK.MATIC) return await getPolygonMainnetProvider();
			else if (network === NETWORK.MATIC_MUMBAI) return await getPolygonTestnetProvider();
            else return null;
        case NETWORK.BSC:
        case NETWORK.BSC_TESTNET:
            if (network === NETWORK.BSC) return await getBscMainnetProvider();
            else if (network === NETWORK.BSC_TESTNET) return await getBscTestnetProvider();
            else return null;
        default:
            return null;
    }
}

export function getPublicRPC(network: NETWORK, jsonRPC: string | undefined): string {
    switch (network) {
        case NETWORK.MAINNET:
        case NETWORK.RINKEBY:
        case NETWORK.GÖRLI:
        case NETWORK.KOVAN:
        case NETWORK.ROPSTEN:
        case NETWORK.ARBITRUM:
        case NETWORK.ARBITRUM_RINKEBY:
        case NETWORK.OPTIMISM:
        case NETWORK.OPTIMISM_KOVAN:
            return jsonRPC || '';
        case NETWORK.MATIC:
        case NETWORK.MATIC_MUMBAI:
            if (network === NETWORK.MATIC) return polygonMainnetRPC[0];
			else if (network === NETWORK.MATIC_MUMBAI) return polygonMumbaiRPC[0];
            else return '';
        case NETWORK.BSC:
        case NETWORK.BSC_TESTNET:
            if (network === NETWORK.BSC) return binanceMainnetRPC[0];
            else if (network === NETWORK.BSC_TESTNET) return binanceTestnetRPC[0];
            else return '';
        default:
            return jsonRPC || '';
    }
}