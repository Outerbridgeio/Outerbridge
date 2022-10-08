import {
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
	ArbitrumNetworks,
	AvalancheNetworks,
	ETHNetworks,
	infuraWSSAPIs,
	NETWORK,
	OptimismNetworks,
	PolygonNetworks,
} from '../../src/ChainNetwork';
import { subscribeOperations, unsubscribeOperations } from "./subscribeOperation";
import { IETHOperation } from "../../src/ETHOperations";
import WebSocket from 'ws';

class InfuraTrigger extends EventEmitter implements INode {
	
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
    inputParameters?: INodeParams[];
	providers: IProviders;

	constructor() {
		super();
		this.label = 'Infura Trigger';
		this.name = 'infuraTrigger';
		this.icon = 'infura.svg';
		this.type = 'trigger';
		this.version = 1.0;
		this.description = 'Start workflow whenever subscribed event happened';
		this.incoming = 0;
		this.outgoing = 1;
		this.providers = {};
		this.networks = [
			{
				label: 'Network',
				name: 'network',
				type: 'options',
                options: [
					...ETHNetworks,
                    ...PolygonNetworks,
                    ...ArbitrumNetworks,
                    ...OptimismNetworks,
					...AvalancheNetworks
                ],
			},
		] as INodeParams[];
		this.credentials = [
			{
				label: 'Credential Method',
				name: 'credentialMethod',
				type: 'options',
				options: [
					{
						label: 'Infura API Key',
						name: 'infuraApi',
					},
				],
				default: 'infuraApi',
			},
		] as INodeParams[];
		this.inputParameters = [
			{
				label: 'Subscribe Operation',
				name: 'subscribeOperation',
				type: 'asyncOptions',
				loadMethod: 'getSubscribeOperations',
			},
			{
				label: 'Parameters',
				name: 'parameters',
				type: 'json',
				placeholder: `[
  "param1",
  "param2"
]`,
				optional: true,
				description: 'Operation parameters in array. Ex: ["param1", "param2"]',
			},
			{
				label: 'Unsubscribe Operation',
				name: 'unsubscribeOperation',
				type: 'asyncOptions',
				loadMethod: 'getUnsubscribeOperations',
			},
		] as INodeParams[];
	};

	loadMethods = {

		async getSubscribeOperations(nodeData: INodeData): Promise<INodeOptionsValue[]> {

			const returnData: INodeOptionsValue[] = [];
			const networksData = nodeData.networks;

            if (networksData === undefined) {
                return returnData;
            }

			const network = networksData.network as NETWORK;

			let totalOperations = subscribeOperations;
			const filteredOperations = totalOperations.filter((op: IETHOperation) => Object.prototype.hasOwnProperty.call(op.providerNetworks, 'infura') && op.providerNetworks['infura'].includes(network));

			for (const op of filteredOperations) {
				returnData.push({
					label: op.name,
					name: op.value,
					parentGroup: op.parentGroup,
					description: op.description,
					inputParameters: op.inputParameters,
					exampleParameters: op.exampleParameters,
					exampleResponse: op.exampleResponse,
				});
			}
			return returnData;
		},

		async getUnsubscribeOperations(nodeData: INodeData): Promise<INodeOptionsValue[]> {

			const returnData: INodeOptionsValue[] = [];
			const networksData = nodeData.networks;

            if (networksData === undefined) {
                return returnData;
            }

			const network = networksData.network as NETWORK;

			let totalOperations = unsubscribeOperations;
			const filteredOperations = totalOperations.filter((op: IETHOperation) => Object.prototype.hasOwnProperty.call(op.providerNetworks, 'infura') && op.providerNetworks['infura'].includes(network));

			for (const op of filteredOperations) {
				returnData.push({
					label: op.name,
					name: op.value,
					parentGroup: op.parentGroup,
					description: op.description,
					inputParameters: op.inputParameters,
					exampleParameters: op.exampleParameters,
					exampleResponse: op.exampleResponse,
				});
			}
			return returnData;
		},
	}
	
	async runTrigger(nodeData: INodeData): Promise<void> {

		const networksData = nodeData.networks;
		const credentials = nodeData.credentials;
		const inputParametersData = nodeData.inputParameters;

        if (networksData === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing');
        }

		if (credentials === undefined) {
			throw new Error('Missing credentials');
		};

		// GET network
		const network = networksData.network as NETWORK;

		// GET credentials
		const apiKey = credentials.apiKey as string;
		const wssProvider = `${infuraWSSAPIs[network]}${apiKey}`;

		// GET subscribeOperation
		const subscribeOperation = inputParametersData.subscribeOperation as string;
		
		// GET parameters
		let bodyParameters: any;
		const parameters = inputParametersData.parameters as string;
		if (parameters) {
			try {
				bodyParameters = JSON.parse(parameters.replace(/\s/g, ''));
			} catch(error) {
				throw handleErrorMessage(error);
			}
		}

		const context = this;
		const emitEventKey = nodeData.emitEventKey as string;
		
		const result = subscribeOperations.find(obj => {
			return obj.value === subscribeOperation
		});

		if (result === undefined) throw new Error('Invalid Operation');

		const requestBody = result.body;
		requestBody.params = bodyParameters;

		const ws = new WebSocket(wssProvider);

		ws.on('open', function open() {
			ws.send(JSON.stringify(requestBody));
		});
		
		let subscriptionID = '';
		ws.on('message', function message(data) {
			
			const messageData = JSON.parse(data as any);
			
			if (messageData.method) {
				context.emit(emitEventKey, returnNodeExecutionData(messageData));

			} else {
				subscriptionID = messageData.result;
				context.providers[emitEventKey] = { provider: ws, filter: subscriptionID };
			}
		});
	}

	async removeTrigger(nodeData: INodeData): Promise<void> {
		const emitEventKey = nodeData.emitEventKey as string;
		const inputParametersData = nodeData.inputParameters;

        if (inputParametersData === undefined) {
            throw new Error('Required data missing');
        }

		if (Object.prototype.hasOwnProperty.call(this.providers, emitEventKey)) {
			const provider: WebSocket = this.providers[emitEventKey].provider;
			const subscriptionID = this.providers[emitEventKey].filter;

			const result = unsubscribeOperations.find(obj => {
				return obj.value === inputParametersData.unsubscribeOperation as string;
			});

			if (result === undefined) throw new Error('Invalid Operation');

			const requestBody = result.body;
			requestBody.params = [subscriptionID];
			
			provider.send(JSON.stringify(requestBody));
			provider.close(1000);
			this.removeAllListeners(emitEventKey);
		}
	}
}

module.exports = { nodeClass: InfuraTrigger }