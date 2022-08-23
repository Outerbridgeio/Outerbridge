
import { ethers, utils } from "ethers";
import {
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
	ArbitrumNetworks, 
	ETHNetworks, 
	OptimismNetworks, 
	PolygonNetworks,
	networkExplorers,
	openseaExplorers,
	NETWORK,
	getNetworkProvidersList,
	getNetworkProvider,
	NETWORK_PROVIDER
} from '../../src/ChainNetwork';

class NFTMintTrigger extends EventEmitter implements INode {
	
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
		this.label = 'NFT Mint Trigger';
		this.name = 'NFTMintTrigger';
		this.icon = 'nftmint.png';
		this.type = 'trigger';
		this.version = 1.0;
		this.description = 'Start workflow whenever a NFT is minted';
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
					...OptimismNetworks
				],
				default: 'homestead',
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
		this.inputParameters = [
			{
				label: 'NFT Address',
				name: 'nftAddress',
				type: 'string',
				default: '',
				optional: true
			},
			{
				label: 'To',
				name: 'toAddress',
				type: 'string',
				default: '',
				description: 'Wallet address',
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
	}
	
	async runTrigger(nodeData: INodeData): Promise<void> {

		const networksData = nodeData.networks;
		const credentials = nodeData.credentials;
		const inputParametersData = nodeData.inputParameters;

        if (networksData === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing');
        }

		const network = networksData.network as NETWORK;
			
		const provider = await getNetworkProvider(
			networksData.networkProvider as NETWORK_PROVIDER,
			network,
			credentials,
			networksData.jsonRPC as string,
			networksData.websocketRPC as string,
		)

		if (!provider) throw new Error('Invalid Network Provider');

		const emitEventKey = nodeData.emitEventKey as string;
		const nftAddress = inputParametersData.nftAddress as string || null;
		const toAddress = inputParametersData.toAddress as string || null;

		const filter = {
			topics: [
				utils.id("Transfer(address,address,uint256)"),
				utils.hexZeroPad('0x0000000000000000000000000000000000000000', 32), // Mint always has 000 from address
				toAddress ? utils.hexZeroPad(toAddress, 32) : null,
			]
		};
		if (nftAddress) (filter as any)['address'] = nftAddress;
		
		provider.on(filter, (log: any) => {
			const txHash = log.transactionHash;
			log['explorerLink'] = `${networkExplorers[network]}/tx/${txHash}`;
			//ERC721 has 4 topics length
			if (log.topics.length === 4) {
				if (openseaExplorers[network]) {
					let tokenString = '';
					const counter = log.topics[log.topics.length - 1];
					const strippedZeroCounter = utils.hexStripZeros(counter);
					if (strippedZeroCounter !== '0x') {
						const counterBigNubmer = ethers.BigNumber.from(strippedZeroCounter);
						tokenString = counterBigNubmer.toString();
					} else {
						tokenString = '0';
					}
					log['openseaLink'] = `${openseaExplorers[network]}/assets/${log.address}/${tokenString}`;
				}
				this.emit(emitEventKey, returnNodeExecutionData(log));
			}
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

module.exports = { nodeClass: NFTMintTrigger }
