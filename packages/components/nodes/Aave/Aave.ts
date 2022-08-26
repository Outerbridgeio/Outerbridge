import {
    UiPoolDataProvider,
    UiIncentiveDataProvider,
    ChainId,
    Pool,
    EthereumTransactionTypeExtended
} from '@aave/contract-helpers';
import { BigNumber, ethers } from 'ethers';
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
import {
	handleErrorMessage,
    returnNodeExecutionData
} from '../../src/utils';
import axios, { AxiosRequestConfig, Method } from 'axios';
import { ArbitrumNetworks, ETHNetworks, getNetworkProvider, getNetworkProvidersList, NETWORK, NETWORK_PROVIDER, OptimismNetworks, PolygonNetworks } from '../../src/ChainNetwork';

class Aave implements INode {
	
	label: string;
    name: string;
    type: NodeType;
    description: string;
    version: number;
	icon: string;
    incoming: number;
	outgoing: number;
    credentials?: INodeParams[];
    networks?: INodeParams[];
    inputParameters?: INodeParams[];

    constructor() {
		this.label = 'Aave';
		this.name = 'aave';
		this.icon = 'aave.svg';
		this.type = 'action';
		this.version = 1.0;
		this.description = 'Execute Aave operation';
		this.incoming = 1;
		this.outgoing = 1;
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
				label: 'Select Wallet',
				name: 'wallet',
				type: 'asyncOptions',
                description: 'Connect wallet to perform Aave operations',
				loadFromDbCollections: ['Wallet'],
				loadMethod: 'getWallets'
            },
            {
				label: 'Amount To Supply',
				name: 'amountToSupply',
				type: 'number',
			},
		] as INodeParams[];
	};

    loadMethods = {

		async getWallets(nodeData: INodeData, dbCollection?: IDbCollection): Promise<INodeOptionsValue[]> {
			const returnData: INodeOptionsValue[] = [];

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

        const pool = new Pool(provider, {
            POOL: '0x368EedF3f56ad10b9bC57eed4Dac65B26Bb667f6',
            WETH_GATEWAY: '0xd5B55D3Ed89FDa19124ceB5baB620328287b915d'
        });
        
        console.log('pool = ', pool)

        /*
        const poolDataProviderContract = new UiPoolDataProvider({
            uiPoolDataProviderAddress: '0x851F44e30C469b9E4Bf9591309611c28eAb85fAb',
            provider,
            chainId: ChainId.goerli,
        });

        console.log('poolDataProviderContract = ', poolDataProviderContract)

        const reserves = await poolDataProviderContract.getReservesHumanized({
            lendingPoolAddressProvider: '0xc4dCB5126a3AfEd129BC3668Ea19285A9f56D15D',
        });

        console.log('reserves = ', reserves)
        
        const reservesArray = reserves.reservesData;
        const baseCurrencyData = reserves.baseCurrencyData;

        console.log('reservesArray = ', reservesArray)
        */
       
        // Get wallet instance
        const walletString = inputParametersData.wallet as string;
        const walletDetails: IWallet = JSON.parse(walletString);
        const walletCredential = JSON.parse(walletDetails.walletCredential);
        const wallet = new ethers.Wallet(walletCredential.privateKey as string, provider);

        //let amount = BigNumber.from(inputParametersData.amountToSupply as string);
        //const amountToSupply = ethers.utils.formatEther(BigNumber.from(amount.toString()));

        const toBeSupply = {
            user: wallet.address,
            reserve: '0xc2c527c0cacf457746bd31b2a698fe89de2b6d49',
            amount: '1000000000000000000',
        };
        console.log('toBeSupply = ', toBeSupply)

        const txs: EthereumTransactionTypeExtended[] = await pool.supply(toBeSupply);
        console.log('txs = ', txs)

        const resultsTx = [];

        for (const tx of txs) {
            const extendedTxData = await tx.tx();
            console.log('extendedTxData = ', extendedTxData)
            const { from, ...txData } = extendedTxData;
            const txResponse = await wallet.sendTransaction({
                ...txData,
                value: txData.value ? BigNumber.from(txData.value) : undefined,
            });
            const receipt = await txResponse.wait();
            console.log('txResponse = ', txResponse)
            resultsTx.push(receipt as any);
        }
	
        const returnItem = {
            resultsTx,
        };
        return returnNodeExecutionData(returnItem);
	}
}

module.exports = { nodeClass: Aave }