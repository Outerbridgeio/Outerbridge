import { ethers } from "ethers";
import {
	IContract,
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
	binanceMainnetRPC, 
	binanceNetworkProviders, 
	binanceTestnetRPC,
	ethNetworkProviders, 
	ethTestNetworkProviders, 
	polygonMainnetRPC, 
	polygonMumbaiRPC, 
	polygonNetworkProviders,
	networkExplorers,
	CHAIN_ID,
} from '../../src/ChainNetwork';

class ExecuteContractFunction implements INode {

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

	constructor() {
		this.label = 'Execute Contract Function';
		this.name = 'executeContractFunction';
		this.icon = 'execute-contract-function.svg';
		this.type = 'action';
		this.version = 1.0;
		this.description = 'Execute smart contract function.';
		this.incoming = 1;
		this.outgoing = 1;
		this.actions = [
			{
				label: 'Select Contract',
				name: 'contract',
				type: 'asyncOptions',
				loadFromDbCollections: ['Contract'],
				loadMethod: 'getContracts',
			},
			{
				label: 'Function',
				name: 'function',
				type: 'asyncOptions',
				loadMethod: 'getFunctions'
			},
			{
				label: 'Function Parameters',
				name: 'funcParameters',
				type: 'json',
				default: '[]',
				description: 'Function parameters in array. Ex: ["param1", "param2"]',
				optional: true
			},
			{
				label: 'Select Wallet',
				name: 'wallet',
				type: 'asyncOptions',
                description: 'Connect wallet to sign transactions for functions that require changing states on blockchain, i.e: nonpayable or payable.',
				loadFromDbCollections: ['Wallet'],
				loadMethod: 'getWallets',
				show: {
					'actions.function': '(\\(payable\\)|\\(nonpayable\\))'
				}
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
		
		async getFunctions(nodeData: INodeData): Promise<INodeOptionsValue[]> {
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
					if (item.type === 'function') {
						const funcName = `${item.name} (${item.stateMutability})`;
						const funcInputs = item.inputs;
						let inputParameters = '';
						let inputTypes = '';
						for (let i = 0; i < funcInputs.length; i++) {
							const input = funcInputs[i];
							inputTypes += `${input.type} ${input.name}`;
							if (i !== funcInputs.length-1) inputTypes += ', ';
							inputParameters += `<li><code class="inline">${input.type}</code> ${input.name}</li>`;
						}
						if (inputParameters) {
							inputParameters = '<ul>' + inputParameters + '</ul>';
						} else {
							inputParameters = '<ul>' + 'none' + '</ul>';
						}
						returnData.push({
							label: funcName,
							name: funcName,
							description: inputTypes,
							inputParameters,
						});
					}
				}
				
				return returnData;

			} catch(e) {
				return returnData;
			}
		}, 

		async getWallets(nodeData: INodeData, dbCollection?: IDbCollection): Promise<INodeOptionsValue[]> {
			const returnData: INodeOptionsValue[] = [];

			const actionsData = nodeData.actions;
            if (actionsData === undefined) {
                return returnData;
            }

			const contractString = actionsData.contract as string || '';
			if (!contractString) return returnData;

			try {
				const contractDetails = JSON.parse(contractString);

				if (!contractDetails.network) return returnData;
			
				if (dbCollection === undefined || !dbCollection || !dbCollection.Wallet) {
					return returnData;
				}

				const wallets: IWallet[] = dbCollection.Wallet;

				for (let i = 0; i < wallets.length; i+=1) {
					const wallet = wallets[i];
					if (contractDetails.network !== wallet.network) continue;
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

	async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {

		const networksData = nodeData.networks;
		const actionsData = nodeData.actions;
		const credentials = nodeData.credentials;

        if (networksData === undefined || actionsData === undefined) {
            throw new Error('Required data missing');
        }

		const networkProvider = networksData.networkProvider as string;
	
		if (credentials === undefined && (networkProvider === 'infura' || networkProvider !== 'alchemy')) {
			throw new Error('Missing credentials');
		}

		let provider: any;

		try {
			const contractString = actionsData.contract as string || '';
			const contractDetails: IContract = JSON.parse(contractString);
			const network = contractDetails.network;

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
								chainId: CHAIN_ID.BINANCE_MAINNET,
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
								chainId: CHAIN_ID.BINANCE_TESTNET,
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
								chainId: CHAIN_ID.MATIC_MAINNET,
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
								chainId: CHAIN_ID.MATIC_TESTNET,
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

			// Get contract details
			const abiString = contractDetails.abi;
			const address = contractDetails.address;
			const abi = JSON.parse(abiString);
			
			let functionName = actionsData.function as string || '';
			let inputParameters = actionsData.funcParameters as string || '';
			inputParameters = inputParameters.replace(/\s/g, '');

			let contractParameters: any[] = [];
			if (inputParameters) contractParameters = JSON.parse(inputParameters);

			let contractInstance: ethers.Contract;
			if (new RegExp('(\\(payable\\)|\\(nonpayable\\))').test(functionName)) {

				// Get wallet instance
				const walletString = actionsData.wallet as string;
				const walletDetails: IWallet = JSON.parse(walletString);
				const walletCredential = JSON.parse(walletDetails.walletCredential);
				const wallet = new ethers.Wallet(walletCredential.privateKey as string, provider);
				contractInstance = new ethers.Contract(address, abi, wallet);

				const gasPrice = await provider.getGasPrice();
				const gasLimit = 3000000;
    			const nonce = await provider.getTransactionCount(walletDetails.address);

				const txOption = {
					gasPrice,
					gasLimit,
					nonce
				};

				functionName = functionName.split(" ")[0];
				const tx = await contractInstance[functionName].apply(null, contractParameters.length ? contractParameters : null, txOption);
				
				const approveReceipt = await tx.wait();

    			if (approveReceipt.status === 0) throw new Error(`Function ${functionName} failed to send transaction`);
				const returnItem = {
					function: functionName,
					transactionHash: approveReceipt,
					link: `${networkExplorers[network]}/tx/${approveReceipt.transactionHash}`,
				};
				return returnNodeExecutionData(returnItem);

			} else {
				contractInstance = new ethers.Contract(address, abi, provider);
				functionName = functionName.split(" ")[0];
				const result = await contractInstance[functionName].apply(null, contractParameters.length ? contractParameters : null);
				const returnItem = {
					function: functionName,
					result: result,
				};
				return returnNodeExecutionData(returnItem);
			}

		} catch(e) {
			throw handleErrorMessage(e);
		}
	}
}

module.exports = { nodeClass: ExecuteContractFunction }
