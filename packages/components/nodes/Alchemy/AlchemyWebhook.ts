import {
    ICommonObject,
	INode, 
    INodeData, 
    INodeParams, 
    IWebhookNodeExecutionData, 
    NodeType,
} from '../../src/Interface';
import {
    returnWebhookNodeExecutionData
} from '../../src/utils';

import axios, { AxiosRequestConfig, Method } from 'axios';

class AlchemyWebhook implements INode {
	
	label: string;
    name: string;
    type: NodeType;
    description: string;
    version: number;
	icon: string;
    incoming: number;
	outgoing: number;
    actions: INodeParams[];
	networks?: INodeParams[];
	credentials?: INodeParams[];
    inputParameters?: INodeParams[];

    constructor() {

		this.label = 'Alchemy Webhook';
		this.name = 'AlchemyWebhook';
		this.icon = 'alchemy.png';
		this.type = 'webhook';
		this.version = 1.0;
		this.description = 'Start workflow whenever Alchemy webhook event happened';
		this.incoming = 0;
		this.outgoing = 1;
		this.networks = [
			{
				label: 'Network',
				name: 'network',
				type: 'options',
				options: [
					{
						label: 'Mainnet',
						name: 'ETH_MAINNET',
					},
					{
						label: 'Rinkeby',
						name: 'ETH_RINKEBY',
					},
					{
						label: 'Goerli',
						name: 'ETH_GOERLI',
					},
					{
						label: 'Ropsten',
						name: 'ETH_ROPSTEN',
					},
					{
						label: 'Kovan',
						name: 'ETH_KOVAN',
					},
					{
						label: 'Polygon Mainnet',
						name: 'MATIC_MAINNET',
					},
					{
						label: 'Polygon Mumbai',
						name: 'MATIC_MUMBAI',
					},
					{
						label: 'Arbitrum Mainnet',
						name: 'ARB_MAINNET',
					},
					{
						label: 'Arbitrum Rinkeby',
						name: 'ARB_RINKEBY',
					},
					{
						label: 'Optimism Mainnet',
						name: 'OPT_MAINNET',
					},
					{
						label: 'Optimism Kovan',
						name: 'OPT_KOVAN',
					},
				],
				default: 'ETH_MAINNET'
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
		this.inputParameters = [
			{
				label: 'App ID',
				name: 'app_id',
				type: 'string',
				default: '',
				description: 'App ID can be found within the URL of your specific app. For example, given the URL https://dashboard.alchemyapi.io/apps/xfu8frt3wf94j7h5 your App ID would be xfu8frt3wf94j7h5'
			},
			{
				label: 'Event',
				name: 'webhook_type',
				type: 'options',
				options: [
					{
						label: 'Mined Transactions',
						name: 'MINED_TRANSACTION',
						description: 'Triggered anytime a transaction sent through your API key gets successfully mined.',
					},
					{
						label: 'Dropped Transactions',
						name: 'DROPPED_TRANSACTION',
						description: `The Dropped Transactions Webhook is used to notify your app anytime a transaction send through your API key gets dropped.`,
					},
					{
						label: 'Address Activity',
						name: 'ADDRESS_ACTIVITY',
						description: `The Address Activity Webhook allows you to track all ETH, ERC20 and ERC721 transfer events for as many Ethereum addresses as you'd like.`,
					},
					{
						label: 'Gas Price',
						name: 'GAS_PRICE',
						description: `Triggered every minute when the Mainnet gas price rises above or drops below a certain threshold`,
					},
				],
				default: 'MINED_TRANSACTION',
			},
		] as INodeParams[];
	};

	webhookMethods = {
		
		async createWebhook(nodeData: INodeData, webhookFullUrl: string): Promise<string | undefined> {
			// Check if webhook exists
			const credentials = nodeData.credentials;
			const inputParametersData = nodeData.inputParameters;

			if (inputParametersData === undefined) {
				throw new Error('Required data missing');
			}

			if (credentials === undefined) {
				throw new Error('Missing credentials');
			}
	
			const authToken = credentials.authToken as string;
			const axiosConfig: AxiosRequestConfig = {
				method: 'GET' as Method,
				url: `https://dashboard.alchemyapi.io/api/team-webhooks`,
				headers: { 'X-Alchemy-Token': authToken },
			}

			try {
				let responseData = await axios(axiosConfig);
				responseData = responseData.data;
				const webhooks = responseData.data;
				const app_id = inputParametersData.app_id as string;
				const webhook_type = inputParametersData.webhook_type as string;
				let webhookExist = false;

				for (const webhook of webhooks) {
					if (webhook.app_id === app_id && webhook.webhook_type === webhook_type && webhook.webhook_url === webhookFullUrl) {
						webhookExist = true;
						break;
					}
				}

				if (!webhookExist) {
					const data: ICommonObject = {
						app_id,
						webhook_type,
						webhook_url: webhookFullUrl,
					};
					const axiosCreateConfig: AxiosRequestConfig = {
						method: 'POST' as Method,
						url: `https://dashboard.alchemyapi.io/api/create-webhook`,
						data,
						headers: { 'X-Alchemy-Token': authToken },
					}
					let createResponseData = await axios(axiosCreateConfig);
					createResponseData = createResponseData.data;
					if (createResponseData && createResponseData.data && createResponseData.data.id) {
						return createResponseData.data.id;
					}
					return;
				}
			} catch (error) {
				console.error(error);
				return;
			}
		},

		async deleteWebhook(nodeData: INodeData, webhookId: string): Promise<boolean> {

			const credentials = nodeData.credentials;

			if (credentials === undefined) {
				throw new Error('Missing credentials');
			}
	
        	const authToken = credentials.authToken as string;
			const axiosConfig: AxiosRequestConfig = {
				method: 'DELETE' as Method,
				url: `https://dashboard.alchemyapi.io/api/delete-webhook?webhook_id=${webhookId}`,
				headers: { 'X-Alchemy-Token': authToken },
			}

			try {
				let responseData = await axios(axiosConfig);
				responseData = responseData.data;
			} catch (error) {
				console.error(error);
				return false;
			}
			
			return true;
		},
	};

	async runWebhook(nodeData: INodeData): Promise<IWebhookNodeExecutionData[] | null> {

		const inputParametersData = nodeData.inputParameters;
		const req = nodeData.req;
	
        if (inputParametersData === undefined) {
            throw new Error('Required data missing');
        }

		if (req === undefined) {
            throw new Error('Missing request');
        }

		//TODO: Verify webhook via signing key

		const returnData: ICommonObject[] = [];

		returnData.push({
			headers: req?.headers,
			params: req?.params,
			query: req?.query,
			body: req?.body,
			rawBody: (req as any).rawBody,
			url: req?.url
		});

		return returnWebhookNodeExecutionData(returnData);
	}
}

module.exports = { nodeClass: AlchemyWebhook }