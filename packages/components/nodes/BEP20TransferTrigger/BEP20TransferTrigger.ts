import { ethers, utils } from "ethers";
import {
	INode, 
    INodeData, 
    INodeParams, 
    IProviders, 
    NodeType,
} from '../../src/Interface';
import { returnNodeExecutionData } from '../../src/utils';
import EventEmitter from 'events';
import { 
	networkExplorers,
	BSCNetworks,
	binanceMainnetRPC,
	binanceTestnetRPC,
	binanceNetworkProviders
} from '../../src/ChainNetwork';

class BEP20TransferTrigger extends EventEmitter implements INode {
	
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
		this.label = 'BEP20 Transfer Trigger';
		this.name = 'BEP20TransferTrigger';
		this.icon = 'bnb.svg';
		this.type = 'trigger';
		this.version = 1.0;
		this.description = 'Triggers whenever a BEP20 transfer event happened';
		this.incoming = 0;
		this.outgoing = 1;
		this.providers = {};
		this.networks = [
			{
				label: 'Network',
				name: 'network',
				type: 'options',
				options: [
					...BSCNetworks,
				],
				default: 'bsc',
			},
			{
				label: 'Network Provider',
				name: 'networkProvider',
				type: 'options',
				options: [
					...binanceNetworkProviders
				],
				default: 'binance',
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
		this.inputParameters = [
			{
				label: 'BEP20 Address',
				name: 'bep20Address',
				type: 'string',
				default: '',
				optional: true
			},
			{
				label: 'Direction',
				name: 'direction',
				type: 'options',
				options: [
					{
						label: 'From',
						name: 'from',
						description: 'Transfer from wallet address'
					},
					{
						label: 'To',
						name: 'to',
						description: 'Transfer to wallet address'
					},
				],
				default: '',
			},
			{
				label: 'From',
				name: 'fromAddress',
				type: 'string',
				default: '',
				description: 'Wallet address',
				show: {
					'inputParameters.direction': ['from']
				}
			},
			{
				label: 'To',
				name: 'toAddress',
				type: 'string',
				default: '',
				description: 'Wallet address',
				show: {
					'inputParameters.direction': ['to']
				}
			},
		] as INodeParams[];
	};

	async runTrigger(nodeData: INodeData): Promise<void> {

		const networksData = nodeData.networks;
		const inputParametersData = nodeData.inputParameters;

        if (networksData === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing');
        }

		const networkProvider = networksData.networkProvider as string;
		const network = networksData.network as string;

		let provider: any;

		if (networkProvider === 'binance') {

			if (network === 'bsc') {
				const prvs = [];
				for (let i = 0; i < binanceMainnetRPC.length; i++) {
					const node = binanceMainnetRPC[i];
					const prv = new ethers.providers.StaticJsonRpcProvider(
						{ url: node, timeout: 1000 },
						{
							name: 'binance',
							chainId: 56,
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
							chainId: 97,
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

		const emitEventKey = nodeData.emitEventKey as string;
		const bep20Address = inputParametersData.bep20Address as string || null;
		const fromAddress = inputParametersData.fromAddress as string || null;
		const toAddress = inputParametersData.toAddress as string || null;

		const filter = {
			topics: [
				utils.id("Transfer(address,address,uint256)"),
				fromAddress ? utils.hexZeroPad(fromAddress, 32) : null,
				toAddress ? utils.hexZeroPad(toAddress, 32) : null,
			]
		};
		if (bep20Address) (filter as any)['address'] = bep20Address;
		
		provider.on(filter, (log: any) => {
			const txHash = log.transactionHash;
			log['explorerLink'] = `${networkExplorers[network]}/tx/${txHash}`;
			//BEP20 has 3 topics length
			if (log.topics.length === 3) this.emit(emitEventKey, returnNodeExecutionData(log));
		});

		this.providers[emitEventKey] = { provider, filter };
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

module.exports = { nodeClass: BEP20TransferTrigger }

