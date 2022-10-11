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
import { 
	networkExplorers,
    ETHNetworks,
	chainIdLookup,
	nativeCurrency,
	getNetworkProvidersList,
	NETWORK,
	getNetworkProvider,
	NETWORK_PROVIDER,
	NETWORK_LABEL,
} from '../../src/ChainNetwork';
import axios, { AxiosRequestConfig, Method } from 'axios';
class Etherscan implements INode {
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
        this.label = 'Etherscan';
        this.name = 'etherscan';
        this.icon = 'etherscan.svg';
        this.type = 'action';
        this.version = 1.0;
        this.description = 'Perform Etherscan operations';
        this.incoming = 1;
        this.outgoing = 1;
        this.actions = [
            {
                label: 'API',
                name: 'api',
                type: 'options',
                options: [
                    {
                        label: 'Get Ether Balance for a Single Address',
                        name: 'getEtherBalance',
                        description: 'Returns the Ether balance of a given address.'
                    },
                    {
                        label: 'Get Ether Balance for Multiple Addresses(separated by a comma)',
                        name: 'getEtherBalanceMulti',
                        description: 'Returns the Ether balance of the addresses(each address separated by a comma) entered.'
                    },
                    {
                        label: 'Get Contract ABI for Verified Contract Source Codes',
                        name: 'getContractABI',
                        description: 'Returns the Contract Application Binary Interface ( ABI ) of a verified smart contract.'
                    },
                ],
                
                default: 'getEtherBalance'
            },
        ] as INodeParams[];
        this.networks = [
            {
                label: 'Network',
                name: 'network',
                type: 'options',
                options: [
                    {
                        label: NETWORK_LABEL.MAINNET,
						name: NETWORK.MAINNET,
                    },
                    {
                        label: NETWORK_LABEL.GÖRLI,
                        name: NETWORK.GÖRLI,
                    },
                ],
                default: 'homestead',
            },
        ] as INodeParams[];
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Etherscan API Key',
                        name: 'etherscanApi',
                    },
                ],
                default: 'etherscanApi',
            },
        ] as INodeParams[];
        this.inputParameters = [
            {
                label: 'Address',
                name: 'address',
                type: 'string',
                description: 'The address to check for balance'
            },
        ] as INodeParams[];
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
    
        // GET address
        const address = inputParametersData.address as string;
        const returnData: ICommonObject[] = [];
        let responseData: any;
        if (api === 'getEtherBalance') {
            try {
                const queryParameters = {
                    module: 'account',
                    action: 'balance',
                    address,
                    tag: 'latest',
                    apikey: apiKey,
                }
                let url = '';
                // Change url depending on network. See https://docs.etherscan.io/getting-started/endpoint-urls
                if (network === NETWORK.MAINNET) {
                    url = 'https://api.etherscan.io/api';
                }
                else if(network === NETWORK.GÖRLI){
                    url = 'https://api-goerli.etherscan.io/api';
                }
                const axiosConfig: AxiosRequestConfig = {
                    method: 'GET' as Method,
                    url,
                    params: queryParameters,
                    paramsSerializer: params => serializeQueryParams(params),
                    headers: { 'Content-Type': 'application/json' }
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
        }else if(api==='getEtherBalanceMulti'){
            try {
                const queryParameters = {
                    module: 'account',
                    action: 'balancemulti',
                    address,
                    tag: 'latest',
                    apikey: apiKey,
                }
                let url = '';
                // Change url depending on network. See https://docs.etherscan.io/getting-started/endpoint-urls
                if (network === NETWORK.MAINNET) {
                    url = 'https://api.etherscan.io/api';
                }
                else if(network === NETWORK.GÖRLI){
                    url = 'https://api-goerli.etherscan.io/api';
                }
                const axiosConfig: AxiosRequestConfig = {
                    method: 'GET' as Method,
                    url,
                    params: queryParameters,
                    paramsSerializer: params => serializeQueryParams(params),
                    headers: { 'Content-Type': 'application/json' }
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
        }else if(api==='getContractABI'){
            try {
                const queryParameters = {
                    module: 'contract',
                    action: 'getabi',
                    address,
                    apikey: apiKey,
                }
                let url = '';
                // Change url depending on network. See https://docs.etherscan.io/getting-started/endpoint-urls
                if (network === NETWORK.MAINNET) {
                    url = 'https://api.etherscan.io/api';
                }
                else if(network === NETWORK.GÖRLI){
                    url = 'https://api-goerli.etherscan.io/api';
                }
                const axiosConfig: AxiosRequestConfig = {
                    method: 'GET' as Method,
                    url,
                    params: queryParameters,
                    paramsSerializer: params => serializeQueryParams(params),
                    headers: { 'Content-Type': 'application/json' }
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
        return returnNodeExecutionData(returnData);
    }
}
module.exports = { nodeClass: Etherscan }