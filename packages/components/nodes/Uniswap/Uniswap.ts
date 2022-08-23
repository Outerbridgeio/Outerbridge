import { ContractInterface, ethers } from "ethers";
import {
	ICommonObject,
	IDbCollection,
	INode, 
    INodeData, 
    INodeExecutionData, 
    INodeOptionsValue, 
    INodeParams, 
    IWallet, 
    NodeType,
} from '../../src/Interface';
import { handleErrorMessage, returnNodeExecutionData } from '../../src/utils';
import { 
	networkExplorers,
    ETHNetworks,
	chainIdLookup,
	nativeCurrency,
	getNetworkProvidersList,
	NETWORK,
	getNetworkProvider,
	NETWORK_PROVIDER,
} from '../../src/ChainNetwork';
import IWETH from '@uniswap/v2-periphery/build/IWETH.json';
import axios, { AxiosRequestConfig, Method } from "axios";
import { UniswapPair, UniswapPairSettings } from 'simple-uniswap-sdk';
import { IToken, nativeTokens } from "./nativeTokens";

class Uniswap implements INode {

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
		this.label = 'Uniswap';
		this.name = 'uniswap';
		this.icon = 'uniswap.png';
		this.type = 'action';
		this.version = 1.0;
		this.description = 'Execute Uniswap operations';
		this.incoming = 1;
		this.outgoing = 1;
		this.actions = [
			{
				label: 'Operation',
				name: 'operation',
				type: 'options',
				options: [
                    {
						label: 'Swap Tokens',
						name: 'swapTokens',
						description: 'Supports uniswap v2 and v3 prices together and returns the best price for swapping.'
					},
					{
						label: 'Get Pairs',
						name: 'getPairs',
						description: 'Get most liquid pairs'
					},
					{
						label: 'Custom Query',
						name: 'customQuery',
						description: 'Custom subgraph query to retrieve more information. https://docs.uniswap.org/protocol/V2/reference/API/queries'
					},
                ],
                default: 'swapTokens'
			},
		] as INodeParams[];
		this.networks = [
			{
				label: 'Network',
				name: 'network',
				type: 'options',
				options: [
					{
						label: 'Mainnet',
						name: 'homestead',
						parentGroup: 'Ethereum'
					},
				],
				default: 'homestead',
				show: {
					'actions.operation': ['getPairs', 'customQuery']
				}
			},
            {
				label: 'Network',
				name: 'network',
				type: 'options',
				options: [
					...ETHNetworks,
				],
				default: 'homestead',
				show: {
					'actions.operation': ['swapTokens']
				}
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
					'networks.networkProvider': ['customRPC'],
					'actions.operation': ['swapTokens']
				}
			},
			{
				label: 'Websocket Endpoint',
				name: 'websocketRPC',
				type: 'string',
				default: '',
				show: {
					'networks.networkProvider': ['customWebsocket'],
					'actions.operation': ['swapTokens']
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
					'networks.networkProvider': ['infura', 'alchemy'],
					'actions.operation': ['swapTokens']
				}
			},
		] as INodeParams[];
        this.inputParameters = [
			{
				label: 'From Token',
				name: 'fromToken',
				type: 'asyncOptions',
                description: 'Contract address of the token you want to convert FROM.',
				loadMethod: 'getTokens',
				show: {
					'actions.operation': ['swapTokens']
				}
			},
			{
				label: 'To Token',
				name: 'toToken',
				type: 'asyncOptions',
                description: 'Contract address of the token you want to convert TO.',
				loadMethod: 'getTokens',
				show: {
					'actions.operation': ['swapTokens']
				}
			},
			{
				label: 'Amount To Swap',
				name: 'amountToSwap',
				type: 'number',
				show: {
					'actions.operation': ['swapTokens'],
				}
			},
			{
				label: 'Select Wallet',
				name: 'wallet',
				type: 'asyncOptions',
                description: 'Wallet account to swap tokens.',
				loadFromDbCollections: ['Wallet'],
				loadMethod: 'getWallets',
				show: {
					'actions.operation': ['swapTokens'],
				}
			},
			{
				label: 'Query',
				name: 'query',
				type: 'string',
				rows: 10,
				show: {
					'actions.operation': ['customQuery'],
				}
			},
			{
				label: 'Slippage Tolerance (%)',
				name: 'slippage',
				type: 'number',
				default: 0.5,
				optional: true,
                description: 'How large of a price movement to tolerate before trade will fail to execute. Default to 0.5%.',
				show: {
					'actions.operation': ['swapTokens']
				}
			},
			{
				label: 'Tx Deadline (mins)',
				name: 'deadlineMinutes',
				type: 'number',
				default: 20,
				optional: true,
                description: 'Minutes after which the transaction will fail. Default to 20 mins.',
				show: {
					'actions.operation': ['swapTokens']
				}
			},
			{
				label: 'Disable Multihops',
				name: 'disableMultihops',
				type: 'boolean',
				default: false,
				optional: true,
                description: 'Restricts swaps to direct pairs only. Default to false.',
				show: {
					'actions.operation': ['swapTokens']
				}
			},
		] as INodeParams[];
	};

	loadMethods = {

		async getTokens(nodeData: INodeData): Promise<INodeOptionsValue[]> {
			const returnData: INodeOptionsValue[] = [];

			const networksData = nodeData.networks;
            if (networksData === undefined) return returnData;

			const network = networksData.network as NETWORK;

			try {
				const axiosConfig: AxiosRequestConfig = {
					method: "GET" as Method,
					url: `https://tokens.uniswap.org`,
				};
	
				const response = await axios(axiosConfig);
				const responseData = response.data;
				let tokens: IToken[] = responseData.tokens;
				const nativeToken: IToken = nativeTokens[network];

				// Add native token
				const data = {
					label: `${nativeToken.name} (${nativeToken.symbol})`,
					name: `${nativeToken.address};${nativeToken.symbol};${nativeToken.name}`,
				} as INodeOptionsValue;
				returnData.push(data);

				// Add other tokens
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

			} catch(e) {
				return returnData;
			}
		},

		async getWallets(nodeData: INodeData, dbCollection?: IDbCollection): Promise<INodeOptionsValue[]> {
			const returnData: INodeOptionsValue[] = [];

			const networksData = nodeData.networks;
            if (networksData === undefined) {
                return returnData;
            }

			try {
				if (dbCollection === undefined || !dbCollection || !dbCollection.Wallet) {
					return returnData;
				}

				const wallets: IWallet[] = dbCollection.Wallet;

				for (let i = 0; i < wallets.length; i+=1) {
					const wallet = wallets[i];
					const data = {
						label: `${wallet.name} (${wallet.network})`,
						name: JSON.stringify(wallet),
						description: wallet.address
					} as INodeOptionsValue;
					returnData.push(data);
				}

				return returnData;

			} catch(e) {
				return returnData;
			}
		},

		async getNetworkProviders(nodeData: INodeData): Promise<INodeOptionsValue[]> {
			const returnData: INodeOptionsValue[] = [];

			const networksData = nodeData.networks;
            if (networksData === undefined) return returnData;

			const network = networksData.network as NETWORK;
			return getNetworkProvidersList(network);
		},
	}

	async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {

		const networksData = nodeData.networks;
		const actionsData = nodeData.actions;
		const credentials = nodeData.credentials;
        const inputParametersData = nodeData.inputParameters;

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

			if (!provider) throw new Error('Invalid Network Provider');

			// Get operation
            const operation = actionsData.operation as string;

			if (operation === 'swapTokens') {

				// Get fromTokenAddress
				const fromToken = inputParametersData.fromToken as string;
				const [fromTokenContractAddress, fromTokenSymbol, fromTokenName] = fromToken.split(';');
		
				// Get toTokenAddress
				const toToken = inputParametersData.toToken as string;
				const [toTokenContractAddress, toTokenSymbol, toTokenName] = toToken.split(';');

				// Get wallet instance
				const walletString = inputParametersData.wallet as string;
				const walletDetails: IWallet = JSON.parse(walletString);
				const walletCredential = JSON.parse(walletDetails.walletCredential);
				const wallet = new ethers.Wallet(walletCredential.privateKey as string, provider);

				// Get amount
				const amountToSwap = inputParametersData.amountToSwap as string;

				if (fromTokenContractAddress.includes(`_${nativeCurrency[network]}`) && toTokenSymbol === 'WETH') {
					const wrapEthContract = new ethers.Contract(
						toTokenContractAddress,
						IWETH['abi'] as ContractInterface,
						wallet
					);
		
					const tx = await wrapEthContract.deposit({value: ethers.utils.parseUnits(amountToSwap, 18)});
		
					const approveReceipt = await tx.wait();
		
					if (approveReceipt.status === 0) throw new Error(`Failed to swap ETH to WETH`);
					
					const returnItem = {
						transactionHash: approveReceipt,
						link: `${networkExplorers[network]}/tx/${approveReceipt.transactionHash}`,
					};
					return returnNodeExecutionData(returnItem);
		
				} else if (toTokenContractAddress.includes(`_${nativeCurrency[network]}`) && fromTokenSymbol === 'WETH') {
					const wrapEthContract = new ethers.Contract(
						fromTokenContractAddress,
						IWETH['abi'] as ContractInterface,
						wallet
					);
		
					const tx = await wrapEthContract.withdraw(ethers.utils.parseUnits(amountToSwap, 18));
		
					const approveReceipt = await tx.wait();
		
					if (approveReceipt.status === 0) throw new Error(`Failed to swap WETH to ETH`);
					
					const returnItem = {
						transactionHash: approveReceipt,
						link: `${networkExplorers[network]}/tx/${approveReceipt.transactionHash}`,
					};
					return returnNodeExecutionData(returnItem);

				} else {
					
					const slippage = inputParametersData.slippage as string;
					const deadlineMinutes = inputParametersData.deadlineMinutes as number;
					const disableMultihops = inputParametersData.disableMultihops as boolean;
					
					const uniswapPair = new UniswapPair({
						fromTokenContractAddress,
						toTokenContractAddress,
						ethereumAddress: wallet.address,
						ethereumProvider: provider,
						chainId: chainIdLookup[network] as number,
						settings: new UniswapPairSettings({
							slippage: (parseFloat(slippage) / 100.0) || 0.0005,
							deadlineMinutes: deadlineMinutes || 20,
							disableMultihops: disableMultihops || false,
						}),
					});

					const uniswapPairFactory = await uniswapPair.createFactory();

					const trade = await uniswapPairFactory.trade(amountToSwap);

					if (!trade.fromBalance.hasEnough) {
						throw new Error('You do not have enough from balance to execute this swap');
					}
					
					// Why we need two transactions: https://github.com/joshstevens19/simple-uniswap-sdk#ethers-example
					if (trade.approvalTransaction) {
						const approved = await wallet.sendTransaction(trade.approvalTransaction);
						await approved.wait();
					}

					const tradeTransaction = await wallet.sendTransaction(trade.transaction);
					const tradeReceipt = await tradeTransaction.wait();

					trade.destroy();

					const returnItem = {
						operation,
						transactionHash: tradeTransaction.hash,
						transactionReceipt: tradeReceipt as any,
						link: `${networkExplorers[network]}/tx/${tradeTransaction.hash}`,
					};
					return returnNodeExecutionData(returnItem);
				}

			} else if (operation === 'getPairs' || operation === 'customQuery') {

				let query = '';
				if (operation === 'customQuery') query = inputParametersData.query as string;
				else {
					query = `{
						pairs(
							first: 100 
							orderBy: reserveUSD
							orderDirection: desc
						) { 
							id 
							token0 { 
								id 
								symbol 
								name 
							} 
							token1 { 
								id 
								symbol 
								name 
							}
							reserveUSD
							volumeUSD
						}
					}`;
				}
				query = query.replace(/\s/g, ' ');

				const axiosConfig: AxiosRequestConfig = {
					method: "POST" as Method,
					url: `https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2`,
					data: { query }
				};

				const response = await axios(axiosConfig);
				const responseData = response.data;
				const returnData: ICommonObject[] = [];

				if (Array.isArray(responseData)) returnData.push(...responseData);
				else returnData.push(responseData);
			
				return returnNodeExecutionData(returnData);
			}

			return returnNodeExecutionData([]);

		} catch(e) {
			throw handleErrorMessage(e);
		}
	}
}

module.exports = { nodeClass: Uniswap }
