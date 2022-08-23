import { create, NxtpSdkConfig } from "@connext/nxtp-sdk";
import { BigNumber, ethers } from "ethers";
import {
	IDbCollection,
	INode, 
    INodeData, 
    INodeExecutionData,
    INodeOptionsValue,
    INodeParams, 
    IWallet, 
    NodeType,
} from '../../src/Interface';
import {
	handleErrorMessage,
    returnNodeExecutionData
} from '../../src/utils';
import axios, { AxiosRequestConfig, Method } from 'axios';
import { 
    domainIdLookup, 
    NETWORK 
} from "../../src/ChainNetwork";
import { testNetworks } from "./extendedNetworks";
import { getNetworkProviderForConnext, getPublicRPC, getTokensNetwork } from "./utils";

class Connext implements INode {
	
	label: string;
    name: string;
    type: NodeType;
    description: string;
    version: number;
	icon: string;
    incoming: number;
	outgoing: number;
    actions?: INodeParams[];
    networks?: INodeParams[];
    inputParameters?: INodeParams[];

    constructor() {

		this.label = 'Connext';
		this.name = 'connext';
		this.icon = 'connext.png';
		this.type = 'action';
		this.version = 1.0;
		this.description = 'Cross bridge transfer using Connext SDK';
		this.incoming = 1;
		this.outgoing = 1;
        this.actions = [
			{
				label: 'Operation',
				name: 'operation',
				type: 'options',
				options: [
                    {
						label: 'Bridge Tokens',
						name: 'bridgeTokens',
					},
					{
						label: 'Custom Query',
						name: 'customQuery',
						description: 'Custom subgraph query to retrieve more information. https://docs.connext.network/developers/subgraph/SubgraphData'
					},
                ],
                default: 'bridgeTokens'
			},
		] as INodeParams[];
        this.networks = [
			/******************************* FROM ***********************************/
            {
				label: 'From Network',
				name: 'fromNetwork',
				type: 'options',
                description: 'Blockchain network you want to bridge FROM.',
                options: [
                    ...testNetworks
                ],
				show: {
					'actions.operation': ['bridgeTokens'],
				}
			},
            {
				label: 'RPC Endpoint',
				name: 'fromJsonRPC',
				type: 'string',
				default: '',
				show: {
					'networks.fromNetwork': [NETWORK.RINKEBY, NETWORK.GÖRLI],
					'actions.operation': ['bridgeTokens']
				}
			},
            /******************************* TO ***********************************/
            {
				label: 'To Network',
				name: 'toNetwork',
				type: 'options',
                description: 'Blockchain network you want to bridge TO.',
				options: [
                    ...testNetworks
                ],
				show: {
					'actions.operation': ['bridgeTokens'],
				}
			},
            {
				label: 'RPC Endpoint',
				name: 'toJsonRPC',
				type: 'string',
				default: '',
				show: {
					'networks.toNetwork': [NETWORK.RINKEBY, NETWORK.GÖRLI],
					'actions.operation': ['bridgeTokens']
				}
			},
		] as INodeParams[];
        this.inputParameters = [
			{
				label: 'From Token',
				name: 'fromToken',
				type: 'asyncOptions',
                description: 'Token you want to bridge FROM.',
				loadMethod: 'getTokensFromNetwork',
				show: {
					'actions.operation': ['bridgeTokens'],
				}
			},
			{
				label: 'To Token',
				name: 'toToken',
				type: 'asyncOptions',
                description: 'Token you want to bridge TO.',
				loadMethod: 'getTokensToNetwork',
				show: {
					'actions.operation': ['bridgeTokens'],
				}
			},
			{
				label: 'Amount To Bridge',
				name: 'amountToBridge',
				type: 'number',
				show: {
					'actions.operation': ['bridgeTokens'],
				}
			},
			{
				label: 'Select Wallet',
				name: 'wallet',
				type: 'asyncOptions',
                description: 'Wallet account to bridge tokens.',
				loadFromDbCollections: ['Wallet'],
				loadMethod: 'getWallets',
				show: {
					'actions.operation': ['bridgeTokens'],
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
        ] as INodeParams[];
	};

    loadMethods = {

		async getTokensFromNetwork(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = [];

			const networksData = nodeData.networks;
            if (networksData === undefined) return returnData;

            const fromNetwork = networksData.fromNetwork as NETWORK;
			return getTokensNetwork(returnData, fromNetwork);
		},

        async getTokensToNetwork(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = [];

			const networksData = nodeData.networks;
            if (networksData === undefined) return returnData;

            const toNetwork = networksData.toNetwork as NETWORK;
			return getTokensNetwork(returnData, toNetwork);
		},

		async getWallets(nodeData: INodeData, dbCollection?: IDbCollection): Promise<INodeOptionsValue[]> {
			const returnData: INodeOptionsValue[] = [];

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
	}

	async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {

		const networksData = nodeData.networks;
		const actionsData = nodeData.actions;
        const inputParametersData = nodeData.inputParameters;

        if (networksData === undefined || actionsData === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing');
        }
      
		try {

			// Get operation
            const operation = actionsData.operation as string;

			if (operation === 'bridgeTokens') {

				// Get FROM and TO networks and provider urls
				const fromNetwork = networksData.fromNetwork as NETWORK;
			
				let fromJsonRPC = networksData.fromJsonRPC as string;
				fromJsonRPC = getPublicRPC(fromNetwork, fromJsonRPC);
				
				const toNetwork = networksData.toNetwork as NETWORK;
				
				let toJsonRPC = networksData.toJsonRPC as string;
				toJsonRPC = getPublicRPC(toNetwork, toJsonRPC);
			
				// Get fromTokenAddress
				const fromToken = inputParametersData.fromToken as string;
				const [fromTokenContractAddress, fromTokenSymbol, fromTokenName] = fromToken.split(';');
		
				// Get toTokenAddress
				const toToken = inputParametersData.toToken as string;
				const [toTokenContractAddress, toTokenSymbol, toTokenName] = toToken.split(';');
			
				const provider = await getNetworkProviderForConnext(fromNetwork, fromJsonRPC);
				
				if (!provider) throw new Error('Invalid Network Provider');

				// Get wallet instance
				const walletString = inputParametersData.wallet as string;
				const walletDetails: IWallet = JSON.parse(walletString);
				const walletCredential = JSON.parse(walletDetails.walletCredential);
				const wallet = new ethers.Wallet(walletCredential.privateKey as string, provider);
				const signerAddress = await wallet.getAddress();

				// Get amount
				const amountToBridge = inputParametersData.amountToBridge as string;

                // NXTP Config
                const nxtpConfig: NxtpSdkConfig = {
                    logLevel: "info",
                    signerAddress,
                    chains: {
                        [domainIdLookup[fromNetwork]]: {
                            providers: [fromJsonRPC],
                            assets: [
                                {
                                    name: fromTokenName,
                                    address: fromTokenContractAddress,
                                    symbol: fromTokenSymbol,
                                },
                            ],
                        },
                        [domainIdLookup[toNetwork]]: {
                            providers: [toJsonRPC],
                            assets: [
                                {
                                    name: toTokenName,
                                    address: toTokenContractAddress,
                                    symbol: toTokenSymbol,
                                },
                            ],
                        },
                    },
					network: 'testnet',
					environment: 'production'
                };

                const {nxtpSdkBase} = await create(nxtpConfig);

                //Construct the xCallArgs
                const callParams = {
                    to: wallet.address, // the address that should receive the funds
                    callData: "0x", // empty calldata for a simple transfer
                    originDomain: domainIdLookup[fromNetwork].toString(), // send from Rinkeby
                    destinationDomain: domainIdLookup[toNetwork].toString(), // to Goerli
                    agent: wallet.address, // address allowed to execute in addition to relayers  
                    recovery: wallet.address, // fallback address to send funds to if execution fails on destination side
                    forceSlow: false, // option that allows users to take the Nomad slow path (~30 mins) instead of paying routers a 0.05% fee on their transaction
                    receiveLocal: false, // option for users to receive the local Nomad-flavored asset instead of the adopted asset on the destination side
                    callback: ethers.constants.AddressZero, // zero address because we don't expect a callback for a simple transfer 
                    callbackFee: "0", // relayers on testnet don't take a fee
                    relayerFee: "0", // relayers on testnet don't take a fee
                    slippageTol: "9995" // max basis points allowed due to slippage (9995 to tolerate .05% slippage)
                };

                const amountInBigNumber: BigNumber = ethers.utils.parseUnits(amountToBridge, 18);
                const xCallArgs = {
                    params: callParams,
                    transactingAssetId: fromTokenContractAddress, // the Rinkeby Test Token
                    amount: ethers.utils.formatEther(BigNumber.from(amountInBigNumber.toString())) // amount to bridge
                };
				
                // Approve the asset transfer
                const approveTxReq = await nxtpSdkBase.approveIfNeeded(
                    xCallArgs.params.originDomain,
                    xCallArgs.transactingAssetId,
                    xCallArgs.amount
                );

                if (approveTxReq) {
                    const approveTxReceipt = await wallet.sendTransaction(approveTxReq);
                    await approveTxReceipt.wait();
                }

                // Send
                const xcallTxReq = await nxtpSdkBase.xcall(xCallArgs);
                xcallTxReq.gasLimit = ethers.BigNumber.from("30000000"); 
                const xcallTxReceipt = await wallet.sendTransaction(xcallTxReq);
                await xcallTxReceipt.wait();

                const returnItem = {
                    operation,
                    transactionHash: xcallTxReceipt.hash,
                    transactionReceipt: xcallTxReceipt as any,
                };
                return returnNodeExecutionData(returnItem);
            }
			return returnNodeExecutionData([]);

		} catch(e) {
			throw handleErrorMessage(e);
		}
	}
}

module.exports = { nodeClass: Connext }
