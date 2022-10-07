import { ethers } from "ethers";
import {
    ICommonObject,
	INode, 
    INodeData, 
    INodeExecutionData, 
    INodeOptionsValue, 
    INodeParams, 
    NodeType,
} from '../../src/Interface';
import { handleErrorMessage, returnNodeExecutionData } from '../../src/utils';
import { 
	getNetworkProvidersList,
	NETWORK_PROVIDER,
	getNetworkProvider,
	NETWORK,
	networkProviderCredentials,
} from '../../src/ChainNetwork';
import axios, { AxiosRequestConfig, Method } from "axios";
import { chainLinkNetworks, chainLinkNetworkMapping } from "./supportedNetwork";


class ChainLink implements INode {

	label: string;
    name: string;
    type: NodeType;
    description?: string;
    version: number;
	icon?: string;
    incoming: number;
	outgoing: number;
	networks?: INodeParams[];
    credentials?: INodeParams[];
    actions?: INodeParams[];
    inputParameters?: INodeParams[];

	constructor() {
		this.label = 'ChainLink';
		this.name = 'chainLink';
		this.icon = 'chainlink.svg';
		this.type = 'action';
		this.version = 1.0;
		this.description = 'Execute ChainLink operations such as Data Feeds, Randomness, Oracles.';
		this.incoming = 1;
		this.outgoing = 1;
		this.actions = [
			{
				label: 'Operation',
				name: 'operation',
				type: 'options',
                options: [
                    {
                        label: 'Get Price Feeds',
                        name: 'getPriceFeeds',
                        description: 'Get real-world market prices of assets using ChainLink Oracle'
                    },
                    {
                        label: 'Get Proof of Reserve',
                        name: 'getProofReserve',
                        description: 'Provide the status of the reserves for several assets'
                    },
                    {
                        label: 'Get NFT Floor Pricing',
                        name: 'getNFTFloorPricing',
                        description: 'Get the lowest price of an NFT in a collection using ChainLink Oracle, ONLY available on Goerli'
                    }
                ],
				default: 'getPriceFeeds'
			},
		];
		this.networks = [
			{
				label: 'Network',
				name: 'network',
				type: 'options',
				options: [
					...chainLinkNetworks
				],
			},
			{
				label: 'Network Provider',
				name: 'networkProvider',
				type: 'asyncOptions',
				loadMethod: 'getNetworkProviders',
			},
			{
				label: 'RPC Endpoint',
				name: 'jsonRPC',
				type: 'string',
				default: '',
				show: {
					'networks.networkProvider': ['customRPC']
				}
			},
			{
				label: 'Websocket Endpoint',
				name: 'websocketRPC',
				type: 'string',
				default: '',
				show: {
					'networks.networkProvider': ['customWebsocket']
				}
			},
		] as INodeParams[];
		this.credentials = [
			...networkProviderCredentials
		] as INodeParams[];
        this.inputParameters = [
			{
				label: 'Pair',
				name: 'pair',
				type: 'asyncOptions',
				loadMethod: 'getPairAddress',
                show: {
                    'actions.operation': ['getPriceFeeds']
                }
			},
            {
				label: 'Reserve',
				name: 'reserve',
				type: 'asyncOptions',
				loadMethod: 'getReserveAddress',
                show: {
                    'actions.operation': ['getProofReserve']
                }
			},
            {
				label: 'NFT Collection',
				name: 'nftCollection',
				type: 'asyncOptions',
				loadMethod: 'getNftCollection',
                show: {
                    'actions.operation': ['getNFTFloorPricing']
                }
			},
		] as INodeParams[];
	};

	loadMethods = {

        async getNetworkProviders(nodeData: INodeData): Promise<INodeOptionsValue[]> {
			const returnData: INodeOptionsValue[] = [];

			const networksData = nodeData.networks;
            if (networksData === undefined) return returnData;

			const network = networksData.network as NETWORK;
			return getNetworkProvidersList(network);
		},

        async getPairAddress(nodeData: INodeData): Promise<INodeOptionsValue[]> {
			const networksData = nodeData.networks;
            if (networksData === undefined) return [];

			const network = networksData.network as NETWORK;

            return await getInputParametersData(network, "default");
		},

        async getNftCollection(nodeData: INodeData): Promise<INodeOptionsValue[]> {
			const networksData = nodeData.networks;
            if (networksData === undefined) return [];
            
			const network = networksData.network as NETWORK;

            return await getInputParametersData(network, "nftFloor");
		},
        
        async getReserveAddress(nodeData: INodeData): Promise<INodeOptionsValue[]> {
			const networksData = nodeData.networks;
            if (networksData === undefined) return [];
            
			const network = networksData.network as NETWORK;

            return await getInputParametersData(network, "por");
		},
	}

	async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {

		const networksData = nodeData.networks;
		const actionsData = nodeData.actions;
        const inputParametersData = nodeData.inputParameters;
		const credentials = nodeData.credentials;

        if (networksData === undefined || actionsData === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing');
        }
		
		try {
			const network = networksData.network as NETWORK;

			const provider = await getNetworkProvider(
				networksData.networkProvider as NETWORK_PROVIDER,
				network,
				credentials,
				networksData.jsonRPC as string,
				networksData.websocketRPC as string,
			)

			if (!provider) {
				throw new Error('Invalid Network Provider');
			}

            const operation = actionsData.operation as string;
          
            if (operation === 'getPriceFeeds' || operation === 'getProofReserve' || operation === 'getNFTFloorPricing') {

                const pair = inputParametersData.pair as string;
                const parsedPair = JSON.parse(pair.replace(/\s/g, ''));
                const address = parsedPair.proxy;
                
                const aggregatorV3InterfaceABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]
                const priceFeed = new ethers.Contract(address, aggregatorV3InterfaceABI, provider);

                const roundData = await priceFeed.latestRoundData();
                
                const returnItem: ICommonObject =  {
                    roundData,
                    ...parsedPair,
                    network
                };
                return returnNodeExecutionData(returnItem);
            }

            return returnNodeExecutionData([]);

		} catch(e) {
			throw handleErrorMessage(e);
		}
	}
}

const getInputParametersData = async(network: NETWORK, dataType: string) => {

    const returnData: INodeOptionsValue[] = [];

    try {
        const axiosConfig: AxiosRequestConfig = {
            method: "GET" as Method,
            url: `https://cl-docs-addresses.web.app/addresses.json`,
        };

        const response = await axios(axiosConfig);
        const responseData = response.data;

        for (const parentNetwork in responseData) {
            const availableNetworks = responseData[parentNetwork].networks;
            const selectedNetwork = availableNetworks.find((ntk: any) => (ntk.name === chainLinkNetworkMapping[network] && ntk.dataType === dataType));
            
            let availableProxies = [];
            if (selectedNetwork) {
                availableProxies = selectedNetwork.proxies;
            }

            for (const proxy of availableProxies) {
                const data = {
                    label: proxy.pair,
                    name: JSON.stringify(proxy),
                } as INodeOptionsValue;
                returnData.push(data);
            }
        }
        return returnData;

    } catch(e) {
        return returnData;
    }
}

module.exports = { nodeClass: ChainLink }
