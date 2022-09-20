
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
import { handleErrorMessage, returnNodeExecutionData } from '../../src/utils';
import EventEmitter from 'events';
import { 
	networkExplorers,
	getNetworkProvidersList,
	NETWORK,
	NETWORK_PROVIDER,
	getNetworkProvider,
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
					label: `${contract.name} (${contract.network})`,
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
				return getNetworkProvidersList(network);

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

		try {
			const contractString = actionsData.contract as string || '';
			const contractDetails: IContract = JSON.parse(contractString);
			const network = contractDetails.network as NETWORK;

			const provider = await getNetworkProvider(
				networksData.networkProvider as NETWORK_PROVIDER,
				network,
				credentials,
				networksData.jsonRPC as string,
				networksData.websocketRPC as string,
			)

			if (!provider) throw new Error('Invalid Network Provider');

			const address = contractDetails.address;
			let abi = contractDetails.abi;
			abi = JSON.parse(abi);
			const event = actionsData.event as string || '';
			const emitEventKey = nodeData.emitEventKey as string;

			const filter = {
				address,
				topics: [
					utils.id(event),
				]
			};

			provider.on(filter, async(log: any) => {
				const txHash = log.transactionHash;
				const iface = new ethers.utils.Interface(abi);
				const logs = await provider.getLogs(filter);
				const events = logs.map((log) => iface.parseLog(log));
	
				log['logs'] = events;
				log['explorerLink'] = `${networkExplorers[network]}/tx/${txHash}`;
				this.emit(emitEventKey, returnNodeExecutionData(log));
			});

			this.providers[emitEventKey] = { provider, filter };

		} catch(e) {
			throw handleErrorMessage(e);
		}
	}

	async removeTrigger(nodeData: INodeData): Promise<void> {
		const emitEventKey = nodeData.emitEventKey as string;
		
		if (Object.prototype.hasOwnProperty.call(this.providers, emitEventKey)) {
			const provider = this.providers[emitEventKey].provider;
			const filter = this.providers[emitEventKey].filter;
			provider.off(filter)
			this.removeAllListeners(emitEventKey);
		}
	}
}

module.exports = { nodeClass: ContractEventTrigger }