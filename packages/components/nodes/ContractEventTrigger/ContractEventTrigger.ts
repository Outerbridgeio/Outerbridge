
import { ethers, utils } from "ethers";
import {
	IContract,
	IDbCollection,
	INode, 
    INodeData, 
    INodeOptionsValue, 
    INodeParams, 
    IProviders, 
    NodeType,
} from '../../src/Interface';
import { returnNodeExecutionData } from '../../src/utils';
import EventEmitter from 'events';
import { 
	binanceMainnetChainID, 
	binanceMainnetRPC, 
	binanceNetworkProviders, 
	binanceTestnetChainID, 
	binanceTestnetRPC,
	ethNetworkProviders, 
	ethTestNetworkProviders, 
	polygonMainnetChainID, 
	polygonMainnetRPC, 
	polygonMumbaiChainID, 
	polygonMumbaiRPC, 
	polygonNetworkProviders,
	networkExplorers,
} from '../../src/ChainNetwork';

class ContractEventTrigger extends EventEmitter implements INode {

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
	providers: IProviders;

	constructor() {
		super();
		this.label = 'Contract Event Trigger';
		this.name = 'ContractEventTrigger';
		this.icon = 'contract-event-trigger.svg';
		this.type = 'trigger';
		this.version = 1.0;
		this.description = 'Start workflow whenever the specified contract event happened';
		this.incoming = 0;
		this.outgoing = 1;
		this.providers = {};
		this.actions = [
			{
				label: 'Select Contract',
				name: 'contract',
				type: 'asyncOptions',
				loadFromDbCollections: ['Contract'],
				loadMethod: 'getContracts',
			},
			{
				label: 'Event',
				name: 'event',
				type: 'asyncOptions',
				loadMethod: 'getEvents',
			},
		] as INodeParams[];
		this.networks = [
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
			{
				label: 'Credential Method',
				name: 'credentialMethod',
				type: 'options',
				options: [
					{
						label: 'Alchemy API Key',
						name: 'alchemyApi',
						show: {
							'networks.networkProvider': ['alchemy']
						}
					},
					{
						label: 'Infura API Key',
						name: 'infuraApi',
						show: {
							'networks.networkProvider': ['infura']
						}
					},
				],
				default: '',
				show: {
					'networks.networkProvider': ['infura', 'alchemy']
				}
			},
		] as INodeParams[];
	};

	loadMethods = {

		async getContracts(nodeData: INodeData, dbCollection?: IDbCollection): Promise<INodeOptionsValue[]> {
			const returnData: INodeOptionsValue[] = [];

            if (dbCollection === undefined || !dbCollection || !dbCollection.Contract) {
                return returnData;
            }

			const contracts: IContract[] = dbCollection.Contract;

			for (let i = 0; i < contracts.length; i+=1) {
				const contract = contracts[i];
				const data = {
					label: contract.name,
					name: JSON.stringify(contract),
					description: contract.address
				} as INodeOptionsValue;
				returnData.push(data);
			}

			return returnData;
		},

		async getEvents(nodeData: INodeData): Promise<INodeOptionsValue[]> {
			const returnData: INodeOptionsValue[] = [];

			const actionsData = nodeData.actions;
            if (actionsData === undefined) {
                return returnData;
            }

			const contractString = actionsData.contract as string || '';
			if (!contractString) return returnData;

			try {
				const contractDetails = JSON.parse(contractString);

				if (!contractDetails.abi || !contractDetails.address) return returnData;

				const abiString = contractDetails.abi;
			
				const abi = JSON.parse(abiString);
				
				for (const item of abi) {
					if (!item.name) continue;
					if (item.type === 'event') {
						const eventName = item.name;
						const eventInputs = item.inputs;
						let inputTypes = '';
						let value = '';
						for (let i = 0; i < eventInputs.length; i++) {
							const input = eventInputs[i];
							value += input.type
							inputTypes += `${input.type} ${input.name}`;
							if (i !== eventInputs.length-1) {
								inputTypes += ', ';
								value += ',';
							}
						}
						returnData.push({
							label: eventName,
							name: `${eventName}(${value})`,
							description: inputTypes
						});
					}
				}
				return returnData;
			} catch(e) {
				return returnData;
			}
		},

		async getNetworkProviders(nodeData: INodeData): Promise<INodeOptionsValue[]> {
			const returnData: INodeOptionsValue[] = [];

			const actionData = nodeData.actions;
            if (actionData === undefined) {
                return returnData;
            }

			const contractString = actionData.contract as string || '';
			if (!contractString) return returnData;

			try {
				const contractDetails = JSON.parse(contractString);

				if (!contractDetails.network) return returnData;

				const network = contractDetails.network;
		
				if (network === 'homestead') {
					return ethNetworkProviders;
				} else if (network === 'rinkeby' || network === 'kovan' || network === 'goerli' || network === 'ropsten') {
					return ethTestNetworkProviders;
				} else if (network === 'matic' || network === 'maticmum') {
					return polygonNetworkProviders;
				} else if (network === 'optimism' || network === 'optimism-kovan') {
					return ethTestNetworkProviders;
				} else if (network === 'arbitrum' || network === 'arbitrum-rinkeby') {
					return ethTestNetworkProviders;
				} else if (network === 'bsc' || network === 'bsc-testnet') {
					return binanceNetworkProviders;
				} else {
					return returnData;
				}
			} catch(e) {
				return returnData;
			}
		},
	}

	async runTrigger(nodeData: INodeData): Promise<void> {

		const networksData = nodeData.networks;
		const actionsData = nodeData.actions;
		const credentials = nodeData.credentials;

        if (networksData === undefined || actionsData === undefined) {
            throw new Error('Required data missing');
        }

		const networkProvider = networksData.networkProvider as string;
	
		if (credentials === undefined && networkProvider !== 'customRPC'
		 && networkProvider !== 'customWebsocket' && networkProvider !== 'cloudfare') {
			throw new Error('Missing credentials');
		}

		try {
			const contractString = actionsData.contract as string || '';
			const contractDetails: IContract = JSON.parse(contractString);
			const network = contractDetails.network;

			let provider: any;

			if (networkProvider === 'alchemy') {
				provider = new ethers.providers.AlchemyProvider(network, credentials!.apiKey);

			} else if (networkProvider === 'infura') {
				provider = new ethers.providers.InfuraProvider(network, {
					apiKey: credentials!.apiKey,
					secretKey: credentials!.secretKey
				});

			} else if (networkProvider === 'cloudfare') {
				provider = new ethers.providers.CloudflareProvider();

			} else if (networkProvider === 'binance') {
				if (network === 'bsc') {
					const prvs = [];
					for (let i = 0; i < binanceMainnetRPC.length; i++) {
						const node = binanceMainnetRPC[i];
						const prv = new ethers.providers.StaticJsonRpcProvider(
							{ url: node, timeout: 1000 },
							{
								name: 'binance',
								chainId: binanceMainnetChainID,
							},
						);
						await prv.ready;
						prvs.push({
							provider: prv,
							stallTimeout: 1000,
						});
					}
					provider = new ethers.providers.FallbackProvider(prvs);

				} else if (network === 'bsc-testnet') {
					const prvs = [];
					for (let i = 0; i < binanceTestnetRPC.length; i++) {
						const node = binanceTestnetRPC[i];
						const prv = new ethers.providers.StaticJsonRpcProvider(
							{ url: node, timeout: 1000 },
							{
								name: 'binance',
								chainId: binanceTestnetChainID,
							},
						);
						await prv.ready;
						prvs.push({
							provider: prv,
							stallTimeout: 1000,
						});
					}
					provider = new ethers.providers.FallbackProvider(prvs);
				}
			} else if (networkProvider === 'polygon') {
				if (network === 'matic') {
					const prvs = [];
					for (let i = 0; i < polygonMainnetRPC.length; i++) {
						const node = polygonMainnetRPC[i];
						const prv = new ethers.providers.StaticJsonRpcProvider(
							{ url: node, timeout: 1000 },
							{
								name: 'polygon',
								chainId: polygonMainnetChainID,
							},
						);
						await prv.ready;
						prvs.push({
							provider: prv,
							stallTimeout: 1000,
						});
					}
					provider = new ethers.providers.FallbackProvider(prvs);

				} else if (network === 'maticmum') {
					const prvs = [];
					for (let i = 0; i < polygonMumbaiRPC.length; i++) {
						const node = polygonMumbaiRPC[i];
						const prv = new ethers.providers.StaticJsonRpcProvider(
							{ url: node, timeout: 1000 },
							{
								name: 'polygon',
								chainId: polygonMumbaiChainID,
							},
						);
						await prv.ready;
						prvs.push({
							provider: prv,
							stallTimeout: 1000,
						});
					}
					provider = new ethers.providers.FallbackProvider(prvs);
				}
			} else if (networkProvider === 'customRPC') {
				provider = new ethers.providers.JsonRpcProvider(networksData.jsonRPC as string);

			} else if (networkProvider === 'customWebsocket') {
				provider = new ethers.providers.WebSocketProvider(networksData.websocketRPC as string);

			}
		
			const abiString = contractDetails.abi;
			const address = contractDetails.address;
			const abi = JSON.parse(abiString);
			
			const event = actionsData.event as string || '';
			const contract = new ethers.Contract(address, abi, provider);
			
			const emitEventKey = nodeData.emitEventKey || '';

			const filter = {
				address,
				topics: [
					utils.id(event),
				]
			};

			provider.on(filter, (log: any) => {
				const txHash = log.transactionHash;
				log['explorerLink'] = `${networkExplorers[network]}/tx/${txHash}`;
				this.emit(emitEventKey, returnNodeExecutionData(log));
			});

			this.providers[emitEventKey] = { provider, filter };

		} catch(e) {
			throw new Error(e);
		}
	}

	async removeTrigger(nodeData: INodeData): Promise<void> {
		const emitEventKey = nodeData.emitEventKey || '';
		
		if (Object.prototype.hasOwnProperty.call(this.providers, emitEventKey)) {
			const provider = this.providers[emitEventKey].provider;
			const filter = this.providers[emitEventKey].filter;
			provider.off(filter)
			this.removeAllListeners(emitEventKey);
		}
	}
}

module.exports = { nodeClass: ContractEventTrigger }