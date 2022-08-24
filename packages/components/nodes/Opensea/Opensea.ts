import {
    ICommonObject,
	INode, 
    INodeData, 
    INodeExecutionData,
    INodeParams, 
    NodeType,
} from '../../src/Interface';
import {
	handleErrorMessage,
    returnNodeExecutionData,
    serializeQueryParams
} from '../../src/utils';
import axios, { AxiosRequestConfig, AxiosRequestHeaders, Method } from 'axios';
import { retrieveAssets, retrieveCollections, retrieveEvents } from './extendedParameters';

class OpenSea implements INode {
	
	label: string;
    name: string;
    type: NodeType;
    description: string;
    version: number;
	icon: string;
    incoming: number;
	outgoing: number;
    actions?: INodeParams[];
    inputParameters?: INodeParams[];

    constructor() {

		this.label = 'OpenSea';
		this.name = 'opensea';
		this.icon = 'opensea.svg';
		this.type = 'action';
		this.version = 1.0;
		this.description = 'Query OpenSea information';
		this.incoming = 1;
		this.outgoing = 1;
        this.actions = [
			{
				label: 'Environment',
				name: 'environment',
				type: 'options',
				description: 'Environment to execute API: Test or Main',
				options: [
					{
						label: 'TEST',
						name: 'https://testnets-api.opensea.io/api/v1',
						description: 'Testnet: https://testnets.opensea.io/'
					},
					{
						label: 'MAIN',
						name: 'https://api.opensea.io/api/v1',
						description: 'Mainnet: https://opensea.io/'
					},
				],
				default: 'https://testnets-api.opensea.io/api/v1',
			},
            {
				label: 'Operation',
				name: 'operation',
				type: 'options',
				options: [
					{
						label: 'Retrieve Assets',
						name: 'retrieveAssets',
						description: 'Returns a set of NFTs.'
					},
                    {
						label: 'Retrieve Events',
						name: 'retrieveEvents',
						description: 'Returns a list of Events.'
					},
                    {
						label: 'Retrieve Collections',
						name: 'retrieveCollections',
						description: 'Returns a list of collections supported and vetted by OpenSea.'
					},
				],
				default: '',
			},
            {
				label: 'Event Type',
				name: 'event_type',
				type: 'options',
				options: [
					{
						label: 'New Auctions',
						name: 'created',
					},
                    {
						label: 'New Sales',
						name: 'successful',
					},
                    {
						label: 'New Transfer',
						name: 'transfer',
					},
                    {
						label: 'New Approve',
						name: 'approve',
					},
                    {
						label: 'New Bid Entered',
						name: 'bid_entered',
					},
                    {
						label: 'Bid Withdrawn',
						name: 'bid_withdrawn',
					},
                    {
						label: 'All Events',
						name: 'all',
					},
				],
				default: '',
                description: 'The event type to filter',
                show: {
                    'actions.operation': ['retrieveEvents']
                }
			},
            {
				label: 'Auction Type',
				name: 'auction_type',
				type: 'options',
				options: [
					{
						label: 'English Auctions',
						name: 'english',
					},
                    {
						label: 'Dutch Auctions',
						name: 'dutch',
                        description: 'Fixed-price and declining-price sell orders'
					},
                    {
						label: 'CryptoPunks Auctions',
						name: 'min-price',
					},
				],
				default: '',
                optional: true,
                description: 'Filter by an auction type',
                show: {
                    'actions.operation': ['retrieveEvents'],
                    'actions.event_type': ['created']
                }
			},
        ] as INodeParams[];
		this.inputParameters = [
			...retrieveAssets,
            ...retrieveEvents,
            ...retrieveCollections
		] as INodeParams[];
	};

	async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {

		const inputParametersData = nodeData.inputParameters;
        const actionData = nodeData.actions;

		if (actionData === undefined) {
            throw new Error('Required data missing');
        }
        
        const operation = actionData.operation as string;
        const baseURL = actionData.environment as string;
      
		const returnData: ICommonObject[] = [];
        let responseData: any;
		
        let url = '';
        const queryParameters: ICommonObject = {};
        let method: Method = 'GET';
		const headers: AxiosRequestHeaders = {
			'Content-Type': 'application/json',
		};

        try {

            if (operation === 'retrieveAssets') {
                url = `${baseURL}/assets`;
                
                const owner = inputParametersData?.owner as string;
                if (owner) queryParameters['owner'] = owner;

                const token_ids_string = inputParametersData?.token_ids as string;
                if (token_ids_string) {
                    const token_ids = JSON.parse(token_ids_string.replace(/\s/g, ''));
                    if (token_ids.length) queryParameters['token_ids'] = token_ids;
                }

                const asset_contract_address = inputParametersData?.asset_contract_address as string;
                if (asset_contract_address) queryParameters['asset_contract_address'] = asset_contract_address;

                const asset_contract_addresses_string = inputParametersData?.asset_contract_addresses as string;
                if (asset_contract_addresses_string) {
                    const asset_contract_addresses = JSON.parse(asset_contract_addresses_string.replace(/\s/g, ''));
                    if (asset_contract_addresses.length) queryParameters['asset_contract_addresses'] = asset_contract_addresses;
                }

                const order_by = inputParametersData?.order_by as string;
                if (order_by) queryParameters['order_by'] = order_by;

                const order_direction = inputParametersData?.order_direction as string;
                if (order_direction) queryParameters['order_direction'] = order_direction;

                const offset = inputParametersData?.offset as number;
                if (offset) queryParameters['offset'] = offset;

                const limit = inputParametersData?.limit as number;
                if (limit) queryParameters['limit'] = limit;

                const collection = inputParametersData?.collection as string;
                if (collection) queryParameters['collection'] = collection;

                const include_orders = inputParametersData?.include_orders as boolean;
                if (include_orders) queryParameters['include_orders'] = include_orders;
            }
            else if (operation === 'retrieveEvents') {
                url = `${baseURL}/events`;
                
                const event_type = actionData.event_type as string;
                if (event_type && event_type !== 'all') queryParameters['event_type'] = event_type;

                const auction_type = actionData.auction_type as string;
                if (auction_type) queryParameters['auction_type'] = auction_type;
                
                const asset_contract_address = inputParametersData?.asset_contract_address as string;
                if (asset_contract_address) queryParameters['asset_contract_address'] = asset_contract_address;

                const collection_slug = inputParametersData?.collection_slug as string;
                if (collection_slug) queryParameters['collection_slug'] = collection_slug;
                
                const token_id = inputParametersData?.token_id as number;
                if (token_id) queryParameters['token_id'] = token_id;

                const account_address = inputParametersData?.account_address as string;
                if (account_address) queryParameters['account_address'] = account_address;

                const only_opensea = inputParametersData?.only_opensea as boolean;
                if (only_opensea) queryParameters['only_opensea'] = only_opensea;

                const offset = inputParametersData?.offset as number;
                if (offset) queryParameters['offset'] = offset;

                const limit = inputParametersData?.limit as number;
                if (limit) queryParameters['limit'] = limit;

                const occurred_before = Date.parse(inputParametersData?.occurred_before as string);
                if (occurred_before) queryParameters['occurred_before'] = occurred_before;

                const occurred_after = Date.parse(inputParametersData?.occurred_after as string);
                if (occurred_after) queryParameters['occurred_after'] = occurred_after;
            }
            else if (operation === 'retrieveEvents') {
                url = `${baseURL}/collections`;

                const asset_owner = inputParametersData?.asset_owner as string;
                if (asset_owner) queryParameters['asset_owner'] = asset_owner;

                const offset = inputParametersData?.offset as number;
                if (offset) queryParameters['offset'] = offset;

                const limit = inputParametersData?.limit as number;
                if (limit) queryParameters['limit'] = limit;
            }

            const axiosConfig: AxiosRequestConfig = {
                method,
                url,
                headers
            };

            if (Object.keys(queryParameters).length > 0) {
                axiosConfig.params = queryParameters;
                axiosConfig.paramsSerializer = params => serializeQueryParams(params, true);
            }

            const response = await axios(axiosConfig);

            responseData = response.data;
    
        } catch (error) {
            throw handleErrorMessage(error);
        }
		
		if (Array.isArray(responseData)) {
            returnData.push(...responseData);
        } else {
            returnData.push(responseData);
        }

        return returnNodeExecutionData(returnData);
	}
}

module.exports = { nodeClass: OpenSea }