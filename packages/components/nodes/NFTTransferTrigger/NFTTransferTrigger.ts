
import { ethers, utils } from "ethers";
import {
	ICommonObject,
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
	getNetworkProvidersList,
	NETWORK,
	getNetworkProvider,
	NETWORK_PROVIDER,
	eventTransferAbi,
	erc1155SingleTransferAbi,
	erc1155BatchTransferAbi,
	networkProviderCredentials
} from '../../src/ChainNetwork';

class NFTTransferTrigger extends EventEmitter implements INode {
	
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
		this.label = 'NFT Transfer Trigger';
		this.name = 'NFTTransferTrigger';
		this.icon = 'nfttransfer.png';
		this.type = 'trigger';
		this.version = 1.0;
		this.description = 'Start workflow whenever a NFT transfer event happened';
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
			...networkProviderCredentials
		] as INodeParams[];
		this.inputParameters = [
			{
				label: 'Token Standard',
				name: 'tokenStandard',
				type: 'options',
				options: [
					{
						label: 'ERC-721',
						name: 'ERC721',
					},
					{
						label: 'ERC-1155',
						name: 'ERC1155',
					}
				],
				default: 'ERC721',
			},
			{
				label: 'Transfer Method',
				name: 'tokenMethod',
				type: 'options',
				options: [
					{
						label: 'Single',
						name: 'single',
					},
					{
						label: 'Batch',
						name: 'batch',
					}
				],
				default: 'single',
				show: {
					'inputParameters.tokenStandard': [
						'ERC1155'
					]
				}
			},
			{
				label: 'NFT Address',
				name: 'nftAddress',
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
					{
						label: 'Both From and To',
						name: 'fromTo',
						description: 'Transfer from a wallet address to another wallet address'
					},
				],
				default: '',
			},
			{
				label: 'From Wallet Address',
				name: 'fromAddress',
				type: 'string',
				default: '',
				show: {
					'inputParameters.direction': ['from', 'fromTo']
				}
			},
			{
				label: 'To Wallet Address',
				name: 'toAddress',
				type: 'string',
				default: '',
				show: {
					'inputParameters.direction': ['to', 'fromTo']
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
		const nftAddress = inputParametersData.nftAddress as string;
		const fromAddress = inputParametersData.fromAddress as string;
		const toAddress = inputParametersData.toAddress as string;
		const tokenStandard = inputParametersData.tokenStandard as string;
		const tokenMethod = inputParametersData.tokenMethod as string;

		let ifaceABI = eventTransferAbi;
		let topicId = utils.id('Transfer(address,address,uint256)');
		if (tokenStandard === 'ERC1155' && tokenMethod === 'single') {
			topicId = utils.id("TransferSingle(address,address,address,uint256,uint256)");
			ifaceABI = erc1155SingleTransferAbi;
		}
		if (tokenStandard === 'ERC1155' && tokenMethod === 'batch') {
			topicId = utils.id("TransferBatch(address,address,address,uint256[],uint256[])");
			ifaceABI = erc1155BatchTransferAbi;
		}

		const filter = {
			topics: [
				topicId,
				fromAddress ? utils.hexZeroPad(fromAddress, 32) : null,
				toAddress ? utils.hexZeroPad(toAddress, 32) : null,
			]
		};
		if (nftAddress) (filter as any)['address'] = nftAddress;

		provider.on(filter, async(log: any) => {

			const txHash = log.transactionHash;
			const iface = new ethers.utils.Interface(ifaceABI);
			const logs = await provider.getLogs(filter);
			const events = logs.map((log) => iface.parseLog(log));
	
			const fromWallet = events.length ? events[0].args[tokenStandard === 'ERC1155' ? 1 : 0] : '';
			const toWallet = events.length ? events[0].args[tokenStandard === 'ERC1155' ? 2 : 1] : '';

			//ERC721 or ERC1155 has 4 topics length
			if (log.topics.length === 4) {
				const returnItem = {} as ICommonObject;
				returnItem['From Wallet'] = fromWallet;
				returnItem['To Wallet'] = toWallet;
				returnItem['NFT Token Address'] = log.address;

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
					returnItem['NFT Token Id'] = tokenString;
					returnItem['txHash'] = txHash;
					returnItem['explorerLink'] = `${networkExplorers[network]}/tx/${txHash}`;
					returnItem['openseaLink'] = `${openseaExplorers[network]}/assets/${log.address}/${tokenString}`;
				}
			
				this.emit(emitEventKey, returnNodeExecutionData(returnItem));
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

module.exports = { nodeClass: NFTTransferTrigger }