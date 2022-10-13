import { ICommonObject, INode, INodeData, INodeExecutionData, INodeParams, NodeType } from '../../src/Interface';
import { handleErrorMessage, returnNodeExecutionData, serializeQueryParams } from '../../src/utils';
import axios, { AxiosRequestConfig, Method } from 'axios';
import { OPERATION, SORT_BY, SORT_DIRECTION } from './constants';

class Solscan implements INode {
    // properties
    label: string;
    name: string;
    type: NodeType;
    description?: string;
    version: number;
    icon: string;
    incoming: number;
    outgoing: number;

    // parameter
    actions: INodeParams[];
    credentials?: INodeParams[];
    networks?: INodeParams[];
    inputParameters?: INodeParams[];

    constructor() {
        // properties
        this.label = 'Solscan';
        this.name = 'solscan';
        this.icon = 'solscan.png';
        this.type = 'action';
        this.version = 1.0;
        this.description = 'Solscan Public API';
        this.incoming = 1;
        this.outgoing = 1;

        // parameter
        this.actions = [
            {
                label: 'API',
                name: 'api',
                type: 'options',
                description: 'Choose the API to execute',
                options: [
                    // Account
                    {
                        label: 'Get token balances',
                        name: OPERATION.GET_TOKEN_BALANCES,
                        description: 'Get tokens balances of the given address'
                    },
                    {
                        label: 'Get transactions',
                        name: OPERATION.GET_TRANSACTIONS,
                        description: 'Get list of transactions of the given account. MaxLimit 50 records per request'
                    },
                    {
                        label: 'Get staking accounts',
                        name: OPERATION.GET_STAKING_ACCOUNTS,
                        description: 'Get staking accounts of the given account'
                    },
                    {
                        label: 'Get token transfers',
                        name: OPERATION.GET_TOKEN_TRANSFERS,
                        description: 'Get list of transactions make tokenBalance changes. MaxLimit 50 records per request'
                    },
                    {
                        label: 'Get Solana transfers',
                        name: OPERATION.GET_SOL_TRANSFERS,
                        description: 'Get list of SOL transfers. MaxLimit 50 records per request'
                    },
                    {
                        label: 'Get account info',
                        name: OPERATION.GET_ACCOUNT_INFO,
                        description: 'Get overall account information, including program account, NFT metadata information'
                    },

                    // Transaction
                    {
                        label: 'Get last transactions',
                        name: OPERATION.GET_LAST_TRANSACTIONS,
                        description: 'Get last [limit] transactions'
                    },
                    {
                        label: 'Get transaction info',
                        name: OPERATION.GET_TRANSACTION_INFO,
                        description: 'Detail information of given transaction signature'
                    },

                    // Token
                    {
                        label: 'Get token holder',
                        name: OPERATION.GET_TOKEN_HOLDER,
                        description: 'Get token holders list'
                    },
                    {
                        label: 'Get token info',
                        name: OPERATION.GET_TOKEN_INFO,
                        description: 'Get metadata of given token'
                    },
                    {
                        label: 'Get token list',
                        name: OPERATION.GET_TOKENS,
                        description: 'Get list of tokens. MaxLimit 50 records per request'
                    },

                    // Market
                    {
                        label: 'Get token market info',
                        name: OPERATION.GET_TOKEN_MARKET_INFO,
                        description: 'Get market information of the given token'
                    },

                    // Chain info
                    {
                        label: 'Get chain info',
                        name: OPERATION.GET_CHAIN_INFO,
                        description: 'Blockchain overall information'
                    }
                ],
                default: OPERATION.GET_TOKEN_BALANCES
            }
        ] as INodeParams[];

        this.inputParameters = [
            {
                label: 'Solana Address',
                name: 'address',
                type: 'string',
                description: 'The Solana address',
                show: {
                    'actions.api': [
                        OPERATION.GET_TOKEN_BALANCES,
                        OPERATION.GET_TRANSACTIONS,
                        OPERATION.GET_STAKING_ACCOUNTS,
                        OPERATION.GET_TOKEN_TRANSFERS,
                        OPERATION.GET_SOL_TRANSFERS,
                        OPERATION.GET_ACCOUNT_INFO
                    ]
                }
            },
            {
                label: 'Limit',
                name: 'limit',
                type: 'number',
                default: 10,
                optional: true,
                show: {
                    'actions.api': [OPERATION.GET_TOKEN_HOLDER, OPERATION.GET_LAST_TRANSACTIONS]
                }
            },
            {
                label: 'Offset',
                name: 'offset',
                type: 'number',
                default: 0,
                optional: true,
                show: {
                    'actions.api': [OPERATION.GET_TOKEN_HOLDER, OPERATION.GET_TOKENS]
                }
            },
            {
                label: 'Transaction Signature',
                name: 'signature',
                type: 'string',
                show: {
                    'actions.api': [OPERATION.GET_TRANSACTION_INFO]
                }
            },
            {
                label: 'Token Address',
                name: 'tokenAddress',
                type: 'string',
                show: {
                    'actions.api': [OPERATION.GET_TOKEN_HOLDER, OPERATION.GET_TOKEN_INFO, OPERATION.GET_TOKEN_MARKET_INFO]
                }
            },
            {
                label: 'Sort By',
                name: 'sortBy',
                type: 'options',
                optional: true,
                options: SORT_BY,
                show: {
                    'actions.api': [OPERATION.GET_TOKENS]
                }
            },
            {
                label: 'Sort Direction',
                name: 'direction',
                optional: true,
                type: 'options',
                options: SORT_DIRECTION,
                show: {
                    'actions.api': [OPERATION.GET_TOKENS]
                }
            }
        ] as INodeParams[];
    }

    getEndpoint(operation: string, options?: { address?: string; signature?: string; tokenAddress?: string }): string {
        const baseUrl = 'https://public-api.solscan.io';
        switch (operation) {
            case OPERATION.GET_TOKEN_BALANCES:
                return `${baseUrl}/account/tokens`;

            case OPERATION.GET_TRANSACTIONS:
                return `${baseUrl}/account/transactions`;

            case OPERATION.GET_STAKING_ACCOUNTS:
                return `${baseUrl}/account/stakeAccounts`;

            case OPERATION.GET_TOKEN_TRANSFERS:
                return `${baseUrl}/account/splTransfers`;

            case OPERATION.GET_SOL_TRANSFERS:
                return `${baseUrl}/account/solTransfers`;

            case OPERATION.GET_ACCOUNT_INFO:
                return `${baseUrl}/account/${options?.address}`;

            case OPERATION.GET_LAST_TRANSACTIONS:
                return `${baseUrl}/transaction/last`;

            case OPERATION.GET_TRANSACTION_INFO:
                return `${baseUrl}/transaction/${options?.signature}`;

            case OPERATION.GET_TOKEN_HOLDER:
                return `${baseUrl}/token/holders`;

            case OPERATION.GET_TOKEN_INFO:
                return `${baseUrl}/token/meta`;

            case OPERATION.GET_TOKENS:
                return `${baseUrl}/token/list`;

            case OPERATION.GET_TOKEN_MARKET_INFO:
                return `${baseUrl}/market/token/${options?.tokenAddress}`;

            case OPERATION.GET_CHAIN_INFO:
                return `${baseUrl}/chaininfo`;
            default:
                return baseUrl;
        }
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        const actionData = nodeData.actions;
        const inputParametersData = nodeData.inputParameters;

        if (actionData === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing');
        }

        const api = actionData.api as string;

        const address = inputParametersData.address as string;
        const limit = inputParametersData.limit as number;
        const offset = inputParametersData.offset as number;
        const signature = inputParametersData.signature as string;
        const tokenAddress = inputParametersData.tokenAddress as string;
        const sortBy = inputParametersData.sortBy as string;
        const direction = inputParametersData.direction as string;

        const url = this.getEndpoint(api, { address, signature, tokenAddress });

        const queryParameters = {
            account: address,
            tokenAddress,
            limit,
            offset,
            sortBy,
            direction
        };

        const returnData: ICommonObject[] = [];
        let responseData: any;
        try {
            const axiosConfig: AxiosRequestConfig = {
                method: 'GET' as Method,
                url,
                params: queryParameters,
                paramsSerializer: (params) => serializeQueryParams(params),
                headers: { 'Content-Type': 'application/json' }
            };
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

module.exports = { nodeClass: Solscan };
