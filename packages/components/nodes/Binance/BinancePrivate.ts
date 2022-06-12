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
    returnNodeExecutionData
} from '../../src/utils';

import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { createHmac } from 'crypto';

class BinancePrivate implements INode {
	 	
	label: string;
    name: string;
    type: NodeType;
    description?: string;
    version: number;
	icon?: string;
    incoming: number;
	outgoing: number;
    actions?: INodeParams[];
    credentials?: INodeParams[];
    inputParameters?: INodeParams[];

	constructor() {

		this.label = 'Binance Private';
		this.name = 'binancePrivate';
		this.icon = 'binance-logo.svg';
		this.type = 'action';
		this.version = 1.0;
		this.description = 'Binance Private API';
		this.incoming = 1;
        this.outgoing = 1;
		this.actions = [
            {
				label: 'Operation',
				name: 'operation',
				type: 'options',
				options: [
					{
						label: 'Get all orders',
						name: 'getAllOrders',
                        parentGroup: 'accounts'
					},
					{
						label: 'Get account information',
						name: 'getAccountInformation',
                        parentGroup: 'accounts'
					},
					{
						label: 'Get market data',
						name: 'getMarketData',
                        parentGroup: 'market'
					},
				],
				default: 'getAllOrders',
			},
        ] as INodeParams[];
		this.credentials = [
			{
				label: 'Credential Method',
				name: 'credentialMethod',
				type: 'options',
				options: [
					{
						label: 'Binance API Key',
						name: 'binanceApi',
					},
				],
				default: 'binanceApi',
			},
		] as INodeParams[];
		this.inputParameters = [
			{
				label: 'Pair',
				name: 'pair',
				type: 'options',
				options: [
					{
						label: 'ETH BTC',
						name: 'ETHBTC',
					},
					{
						label: 'ETH USDT',
						name: 'ETHUSDT',
					},
				],
				show: {
                    'actions.operation': ['getAllOrders', 'getAccountInformation']
                }
			},
		];
	}

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {

        const actionData = nodeData.actions;
        const inputParametersData = nodeData.inputParameters;
		const credentials = nodeData.credentials;

        if (actionData === undefined || inputParametersData === undefined || credentials === undefined) {
            throw new Error('Required data missing');
        }

        const operation = actionData.operation as string;
		const apiKey = credentials.apiKey as string;
        const secretKey = credentials.secretKey as string;

		const returnData: ICommonObject[] = [];

        let responseData: any; // tslint:disable-line: no-any
		const headers: ICommonObject = {};

        try {
            if (operation === 'getAllOrders') {

				const symbol = inputParametersData.pair as string;

				const timestamp = Date.now();
				const endpointquery = `symbol=${symbol}&recvWindow=5000&timestamp=${timestamp}`;
				let uri = `https://api.binance.com/api/v3/allOrders?${endpointquery}`;
				headers['X-MBX-APIKEY'] = apiKey;
				const signature = createHmac('sha256', secretKey).update(endpointquery).digest("hex");
				uri += `&signature=${signature}`;

				const axiosConfig: AxiosRequestConfig = {
					method: 'GET',
					url: uri,
					headers: headers as AxiosRequestHeaders
				}

                responseData = await axios(axiosConfig);
                responseData = responseData.data;
            }

			else if (operation === 'getAccountInformation') {

				const timestamp = Date.now();
				const endpointquery = `recvWindow=5000&timestamp=${timestamp}`;
				let uri = `https://api.binance.com/api/v3/account?${endpointquery}`;
				headers['X-MBX-APIKEY'] = apiKey;
				const signature = createHmac('sha256', secretKey).update(endpointquery).digest("hex");
				uri += `&signature=${signature}`;

				const axiosConfig: AxiosRequestConfig = {
					method: 'GET',
					url: uri,
					headers: headers as AxiosRequestHeaders
				}

                responseData = await axios(axiosConfig);
                responseData = responseData.data;
            }
        }
        catch (error) {
            throw error;
        }

        if (Array.isArray(responseData)) {
            returnData.push(...responseData);
        } else {
            returnData.push(responseData);
        }

        return returnNodeExecutionData(returnData);
	}
}

module.exports = { nodeClass: BinancePrivate }
