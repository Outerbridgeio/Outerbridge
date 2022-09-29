import {
    ICommonObject,
	INode, 
    INodeData, 
    INodeExecutionData, 
    INodeOptionsValue, 
    INodeParams, 
    NodeType,
} from '../../src/Interface';
import {
	handleErrorMessage,
    returnNodeExecutionData,
	serializeQueryParams
} from '../../src/utils';
import { alchemyHTTPAPIs, ETHNetworks, PolygonNetworks, OptimismNetworks, ArbitrumNetworks, NETWORK } from "../../src/ChainNetwork";
import { ethOperations, IETHOperation, polygonOperations } from "../../src/ETHOperations";
import { 
	getNFTMetadataProperties, 
	getNFTsForCollectionProperties, 
	getNFTsProperties, 
	NFTOperationsOptions, 
	tokenAPIOperations, 
	transactionReceiptsOperations 
} from './extendedOperation';
import axios, { AxiosRequestConfig, Method } from 'axios';

class Alchemy implements INode {
	
	label: string;
    name: string;
    type: NodeType;
    description: string;
    version: number;
	icon: string;
    incoming: number;
	outgoing: number;
    actions: INodeParams[];
	credentials?: INodeParams[];
	networks?: INodeParams[];
    inputParameters?: INodeParams[];

    constructor() {

		this.label = 'Alchemy';
		this.name = 'alchemy';
		this.icon = 'alchemy.svg';
		this.type = 'action';
		this.version = 1.0;
		this.description = 'Perform Alchemy onchain operations';
		this.incoming = 1;
        this.outgoing = 1;
		this.actions = [
            {
				label: 'API',
				name: 'api',
				type: 'options',
				options: [
					{
						label: 'Chain API',
						name: 'chainAPI',
						description: 'API for fetching standard onchain data using Alchemy supported calls'
					},
					{
						label: 'NFT API',
						name: 'nftAPI',
						description: 'API for fetching NFT data, including ownership, metadata attributes, and more.'
					},
					{
						label: 'Transaction Receipts API',
						name: 'txReceiptsAPI',
						description: 'API that gets all transaction receipts for a given block by number or block hash.'
					},
					{
						label: 'Token API',
						name: 'tokenAPI',
						description: 'The Token API allows you to easily get token information, minimizing the number of necessary requests.'
					},
				],
				default: 'chainAPI'
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
					},
				],
				default: 'alchemyApi',
			},
		] as INodeParams[];
		this.networks = [
			{
				label: 'Network',
				name: 'network',
				type: 'asyncOptions',
				loadMethod: 'getSupportedNetworks',
			},
		] as INodeParams[];
		this.inputParameters = [
			{
				label: 'Operation',
				name: 'operation',
				type: 'asyncOptions',
				loadMethod: 'getOperations',
			},
			...getNFTsProperties,
			...getNFTMetadataProperties,
			...getNFTsForCollectionProperties,
			{
				label: 'Parameters',
				name: 'parameters',
				type: 'json',
				placeholder: '["param1", "param2"]',
				optional: true,
				description: 'Operation parameters in array. Ex: ["param1", "param2"]',
				show: {
					'actions.api': [
						'chainAPI',
						'txReceiptsAPI',
						'tokenAPI'
					]
				},
			},
		] as INodeParams[];
	}

	loadMethods = {
        async getSupportedNetworks(nodeData: INodeData): Promise<INodeOptionsValue[]> {

			const returnData: INodeOptionsValue[] = [];
			const actionData = nodeData.actions;
            if (actionData === undefined) {
                return returnData;
            }

			const api = actionData.api as string;

			if (api === 'chainAPI') {
				return [...ETHNetworks, ...PolygonNetworks, ...ArbitrumNetworks, ...OptimismNetworks];;
			} else if (api === 'nftAPI') {
				return [...ETHNetworks, ...PolygonNetworks];
			} else if (api === 'txReceiptsAPI') {
				return [...ETHNetworks, ...PolygonNetworks, ...ArbitrumNetworks];
			} else if (api === 'tokenAPI') {
				return [ 
					{
						label: 'Mainnet',
						name: 'homestead',
						parentGroup: 'Ethereum'
					},
					...PolygonNetworks,
					...ArbitrumNetworks,
					...OptimismNetworks,
				] as INodeOptionsValue[];
			} else {
				return returnData;
			}
		},

		async getOperations(nodeData: INodeData): Promise<INodeOptionsValue[]> {

			const returnData: INodeOptionsValue[] = [];
			const actionData = nodeData.actions;
			const networksData = nodeData.networks;
            if (actionData === undefined || networksData === undefined ) {
                return returnData;
            }

			const api = actionData.api as string;
			const network = networksData.network as NETWORK;
			
			if (api === 'chainAPI') {

				let totalOperations: IETHOperation[] = [];

				const filteredOperations = ethOperations.filter((op: IETHOperation) => op.networks.includes(network) && op.providers.includes('alchemy'));
				if (network === NETWORK.MATIC || network === NETWORK.MATIC_MUMBAI) {
					totalOperations = [...polygonOperations, ...filteredOperations];
				} else {
					totalOperations = filteredOperations;
				}
				for (const op of totalOperations) {
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
			} 
			else if (api === 'nftAPI') {
				return NFTOperationsOptions;
			} 
			else if (api === 'txReceiptsAPI') {
				for (const op of transactionReceiptsOperations) {
					returnData.push({
						label: op.name,
						name: op.value,
						description: op.description,
						inputParameters: op.inputParameters,
						exampleParameters: op.exampleParameters,
						exampleResponse: op.exampleResponse,
					});
				}
				return returnData;
			} 
			else if (api === 'tokenAPI') {
				for (const op of tokenAPIOperations) {
					returnData.push({
						label: op.name,
						name: op.value,
						description: op.description,
						inputParameters: op.inputParameters,
						exampleParameters: op.exampleParameters,
						exampleResponse: op.exampleResponse,
					});
				}
				return returnData;
			}
			else {
				return returnData;
			}
		},
	}
	
	async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {

		const actionData = nodeData.actions;
		const networksData = nodeData.networks;
        const inputParametersData = nodeData.inputParameters;
		const credentials = nodeData.credentials;

		if (actionData === undefined || inputParametersData === undefined || credentials === undefined || networksData === undefined) {
            throw new Error('Required data missing');
        }

		// GET api
		const api = actionData.api as string;
		
		// GET network
		const network = networksData.network as NETWORK;

		// GET credentials
		const apiKey = credentials.apiKey as string;
    
		// GET operation
		const operation = inputParametersData.operation as string;

		if (api === 'chainAPI' || api === 'txReceiptsAPI' || api === 'tokenAPI') {

			const uri = alchemyHTTPAPIs[network] + apiKey;

			let responseData: any; // tslint:disable-line: no-any
			let bodyParameters: any[] = []; // tslint:disable-line: no-any
			const returnData: ICommonObject[] = [];

			const parameters = inputParametersData.parameters as string;
			if (parameters) {
				try {
					bodyParameters = JSON.parse(parameters.replace(/\s/g, ''));
				} catch(error) {
					throw handleErrorMessage(error);
				}
			}

			try {
				let totalOperations: IETHOperation[] = [];
				if (api === 'chainAPI') totalOperations = [...polygonOperations, ...ethOperations];
				if (api === 'txReceiptsAPI') totalOperations = transactionReceiptsOperations;
				if (api === 'tokenAPI') totalOperations = tokenAPIOperations;
				
				const result = totalOperations.find(obj => {
					return obj.name === operation
				});

				if (result === undefined) throw new Error('Invalid Operation');

				const requestBody = result.body;
				requestBody.params = bodyParameters;

				const axiosConfig: AxiosRequestConfig = {
					method: result.method as Method,
					url: uri,
					data: requestBody,
					headers: {
						'Content-Type': 'application/json',
					},
				}
				const response = await axios(axiosConfig);
				responseData = response.data;
			}
			catch (error) {
				throw handleErrorMessage(error);
			}

			if (Array.isArray(responseData)) returnData.push(...responseData);
			else returnData.push(responseData);
	
			return returnNodeExecutionData(returnData);
		}

		//NFT API
		else if (api === 'nftAPI') {
		
			let uri = `${alchemyHTTPAPIs[network]}${apiKey}/${operation}/`;

			let responseData: any; // tslint:disable-line: no-any
			let queryParameters: ICommonObject = {};
			const returnData: ICommonObject[] = [];

			if (operation === 'getNFTs') {

				const owner = inputParametersData.owner as string;
				const pageKey = inputParametersData.pageKey as string;
				const withMetadata = inputParametersData.withMetadata as boolean;
			
				queryParameters['owner'] = owner;
				queryParameters['withMetadata'] = withMetadata;
				if (pageKey) queryParameters['pageKey'] = pageKey;
			}
			else if (operation === 'getNFTMetadata') {

				const contractAddress = inputParametersData.contractAddress as string;
				const tokenId = inputParametersData.tokenId as string;
				const tokenType = inputParametersData.tokenType as string;
				
				queryParameters['contractAddress'] = contractAddress;
				queryParameters['tokenId'] = tokenId;
				if (tokenType) queryParameters['tokenType'] = tokenType;
			}
			else if (operation === 'getNFTsForCollection') {

				const contractAddress = inputParametersData.contractAddress as string;
				const startToken = inputParametersData.startToken as string;
				const withMetadata = inputParametersData.withMetadata as boolean;
				const limit = inputParametersData.limit as number;
				
				queryParameters['contractAddress'] = contractAddress;
				queryParameters['startToken'] = startToken;
				queryParameters['withMetadata'] = withMetadata;
				queryParameters['limit'] = limit;
			}
			
			try {
				const axiosConfig: AxiosRequestConfig = {
					method : 'GET',
					url: uri,
					params: queryParameters,
					paramsSerializer: params => serializeQueryParams(params),
					headers: {
						'Content-Type': 'application/json',
					},
				}

				const response = await axios(axiosConfig);
				responseData = response.data;
			}
			catch (error) {
				throw handleErrorMessage(error);
			}

			if (Array.isArray(responseData)) returnData.push(...responseData);
			else returnData.push(responseData);
	
			return returnNodeExecutionData(returnData);
		}
		return returnNodeExecutionData([]);
	}
}

module.exports = { nodeClass: Alchemy }
