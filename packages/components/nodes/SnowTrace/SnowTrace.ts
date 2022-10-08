import axios, { AxiosRequestConfig, Method } from 'axios';
import { NETWORK } from '../../src';
import { ICommonObject, INode, INodeData, INodeExecutionData, INodeParams, NodeType } from '../../src/Interface';
import { handleErrorMessage, serializeQueryParams } from '../../src/utils';

class SnowTrace implements INode {
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
        this.label = 'SnowTrace';
        this.name = 'snowtrace';
        this.icon = 'snowtrace.svg';
        this.type = 'action';
        this.version = 1.0;
        this.description = 'Perform SnowTrace operations';
        this.incoming = 1;
        this.outgoing = 1;
        this.actions = [
            {
                label: 'API',
                name: 'api',
                type: 'options',
                options: [
                    {
                        label: 'Get AVAX Balance for a Single Address',
                        name: 'getAvaxBalance',
                        description: 'Returns the AVAX balance of a given address.'
                    },
                    {
                        label: 'Get AVAX Balance for Multiple Addresses',
                        name: 'getAvaxMultipleBalance',
                        description: 'Returns the AVAX balance of given addresses.'
                    },
                    {
                        label: 'Get a list of "Normal" Transactions By Address',
                        name: 'getNormalTransactions',
                        description: 'Returns a list of "Normal" transaction by address.'
                    },
                    {
                        label: 'Get a list of "Internal" Transactions by Address',
                        name: 'getInternalTransactions',
                        description: 'Returns a list of "Internal" transaction by address.'
                    },
                    {
                        label: 'Get "Internal Transactions" by Transaction Hash',
                        name: 'getInternalTransactionsByHash',
                        description: 'Returns "Internal Transactions" by hash.'
                    },
                    {
                        label: 'Get "Internal Transactions" by Block Range',
                        name: 'getInternalTransactionsByBlockRange',
                        description: 'Returns "Internal Transactions" transaction by block range.'
                    },
                    {
                        label: 'Get a list of "ERC20 - Token Transfer Events" by Address',
                        name: 'getErc20TokenTransferEvents',
                        description: 'Returns a list of "ERC20 - Token Transfer Events" by address.'
                    },
                    {
                        label: 'Get a list of "ERC721 - Token Transfer Events" by Address',
                        name: 'getErc721TokenTransferEvents',
                        description: 'Returns a list of "ERC721 - Token Transfer Events" by address.'
                    },
                    {
                        label: 'Get list of Blocks Validated by Address',
                        name: 'getBlocksValidated',
                        description: 'Returns a list of blocks validated by address.'
                    },
                    {
                        label: 'Get Contract ABI for Verified Contract Source Codes',
                        name: 'getContractABI',
                        description: 'Returns the contract ABI for verified contract source codes.'
                    }
                ],
                default: 'getAvaxBalance'
            }
        ] as INodeParams[];
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [
                    {
                        label: 'Ethereum Mainnet',
                        name: NETWORK.AVALANCHE
                    },
                    {
                        label: 'Ethereum Mainnet',
                        name: NETWORK.AVALANCHE_TESTNET
                    }
                ],
                default: NETWORK.AVALANCHE
            }
        ] as INodeParams[];
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'SnowTrace API Key',
                        name: 'snowtraceApi'
                    }
                ],
                default: 'snowtraceApi'
            }
        ] as INodeParams[];
        this.inputParameters = [
            {
                label: 'Address',
                name: 'address',
                type: 'string',
                description: 'The address to check for balance'
            },
            {
                label: 'Addresses',
                name: 'addresses',
                type: 'json',
                description: 'The addresses to check for balance'
            },
            {
                label: 'Transaction Hash',
                name: 'hash',
                type: 'string',
                description: 'The hash of the transaction'
            },
            {
                label: 'Blocks Range',
                name: 'blocksRange',
                type: 'json',
                description: 'The range of blocks to check for internal transactions'
            }
        ] as INodeParams[];
    }

    async fetch(url: string, queryParameters: any) {
        try {
            const axiosConfig: AxiosRequestConfig = {
                method: 'GET' as Method,
                url,
                params: queryParameters,
                paramsSerializer: (params) => serializeQueryParams(params),
                headers: { 'Content-Type': 'application/json' }
            };
            const response = await axios(axiosConfig);
            return response.data?.result;
        } catch (error) {
            throw handleErrorMessage(error);
        }
    }

    getQueryParamters(api: string, value: any) {
        switch (api) {
            case 'getAvaxBalance':
                return {
                    module: 'account',
                    action: 'balance',
                    tag: 'latest',
                    address: value
                };
            case 'getAvaxMultipleBalance':
                return {
                    module: 'account',
                    action: 'balancemulti',
                    tag: 'latest',
                    address: value
                };
            case 'getNormalTransactions':
                return {
                    module: 'account',
                    action: 'txlist',
                    address: value
                };
            case 'getInternalTransactions':
                return {
                    module: 'account',
                    action: 'txlistinternal',
                    address: value
                };
            case 'getInternalTransactionsByHash':
                return {
                    module: 'account',
                    action: 'txlistinternal',
                    txhash: value
                };
            case 'getInternalTransactionsByBlockRange':
                return {
                    module: 'account',
                    action: 'txlistinternal',
                    startblock: value[0],
                    endblock: value[1]
                };
            case 'getErc20TokenTransferEvents':
                return {
                    module: 'account',
                    action: 'tokentx',
                    address: value
                };
            case 'getErc721TokenTransferEvents':
                return {
                    module: 'account',
                    action: 'tokennfttx',
                    address: value
                };

            case 'getBlocksValidated':
                return {
                    module: 'account',
                    action: 'getminedblocks',
                    address: value
                };
            case 'getContractABI':
                return {
                    module: 'contract',
                    action: 'getabi',
                    address: value
                };
            default:
                return {};
        }
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        const actionData = nodeData.actions;
        const networksData = nodeData.networks;
        const inputParametersData = nodeData.inputParameters;
        const credentials = nodeData.credentials;
        if (actionData === undefined || inputParametersData === undefined || credentials === undefined || networksData === undefined) {
            throw new Error('Required data missing');
        }

        const api = actionData.api as string;

        const network = networksData.network as NETWORK;

        const apiKey = credentials.apiKey as string;

        const address = inputParametersData.address as string;
        const addresses = inputParametersData.addresses as string[];
        const hash = inputParametersData.hash as string;
        const blocksRange = inputParametersData.blocksRange as string[];

        const url =
            network === NETWORK.AVALANCHE
                ? 'https://api.snowtrace.io/api'
                : network === NETWORK.AVALANCHE_TESTNET
                ? 'https://api-testnet.snowtrace.io/api'
                : '';

        let responseData: any;
        const returnData: ICommonObject[] = [];

        console.log(address);
        console.log(addresses);

        // switch (api) {
        //     case 'getAvaxBalance': {
        //         const queryParameters = { ...this.getQueryParamters(api, address), apiKey };
        //         break;
        //     }
        //     case 'getAvaxMultipleBalance': {
        //         const queryParameters = {};
        //     }
        // }

        if (Array.isArray(responseData)) returnData.push(...responseData);
        else returnData.push(responseData);
        return responseData;
    }
}

module.exports = { nodeClass: SnowTrace };
