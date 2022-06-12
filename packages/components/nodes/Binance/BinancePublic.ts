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

const axios = require('axios').default;

class BinancePublic implements INode {

    label: string;
    name: string;
    type: NodeType;
    description?: string;
    version: number;
	icon?: string;
    incoming: number;
	outgoing: number;
    actions?: INodeParams[];
    inputParameters?: INodeParams[];

    constructor() {

        this.label = 'Binance Public';
        this.name = 'binancePublic';
        this.type = 'action';
        this.icon = 'binance-logo.svg';
        this.description = 'Binance Public API';
        this.version = 1.0;
        this.incoming = 1;
        this.outgoing = 1;
        this.actions = [
            {
				label: 'Operation',
				name: 'operation',
				type: 'options',
				options: [
					{
						label: 'Get Order Book',
						name: 'getOrderBook',
                        parentGroup: 'Market Data'
					},
                    {
						label: 'Get User Data',
						name: 'getUserData',
                        parentGroup: 'User Data'
					},
				],
				default: 'getOrderBook',
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
				default: 'ETHBTC',
                show: {
                    'actions.operation': ['getOrderBook']
                }
			}
        ] as INodeParams[];
    }


    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {

        const actionData = nodeData.actions;
        const inputParametersData = nodeData.inputParameters;

        if (actionData === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing');
        }

        const operation = actionData.operation as string;
        const symbol = inputParametersData.pair as string;

		const returnData: ICommonObject[] = [];

        let responseData: any; // tslint:disable-line: no-any
		let endpoint = '';
		const query: ICommonObject = {};

        try {
            if (operation === 'getOrderBook') {

                endpoint = `/api/v3/depth`;
                query['symbol'] = symbol;

                responseData = await axios.get(`https://api.binance.com${endpoint}`, { params: query });
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

module.exports = { nodeClass: BinancePublic }