import {
    IAttachment,
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
    returnNodeExecutionData, serializeQueryParams
} from '../../src/utils';
import { infuraHTTPAPIs, ETHNetworks, PolygonNetworks, OptimismNetworks, ArbitrumNetworks } from "../../src/ChainNetwork";
import { ethOperations, IETHOperation, polygonOperations } from "../../src/ETHOperations";
import axios, { AxiosRequestConfig, AxiosRequestHeaders, Method } from 'axios';
import FormData from "form-data";
import { 
	IPFSOperationsOptions, 
	argParams, 
    fileParams,
    catParams,
    dagParams,
    getParams,
    objectParams,
    pinParams,
} from './extendedOperation';

class Infura implements INode {
	
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

		this.label = 'Infura';
		this.name = 'infura';
		this.icon = 'infura.svg';
		this.type = 'action';
		this.version = 1.0;
		this.description = 'Perform Infura onchain operations';
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
						description: 'API for fetching standard onchain data using Infura supported calls.'
					},
					{
						label: 'IPFS API',
						name: 'ipfsAPI',
						description: 'API for interacting with IPFS, a distributed, peer-to-peer (p2p) storage network used for storing and accessing files, websites, applications, and data.'
					},
                    /*
					{
						label: 'Filecoin API',
						name: 'filecoinAPI',
						description: 'API for interacting with Filecoin, a decentralized storage network built on IPFS.'
					},
                    */
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
						label: 'Infura API Key',
						name: 'infuraApi',
					},
				],
				default: 'infuraApi',
			},
		] as INodeParams[];
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
				show: {
                    'actions.api': [
                        'chainAPI'
                    ]
                },
			},
		] as INodeParams[];
		this.inputParameters = [
			{
				label: 'Operation',
				name: 'operation',
				type: 'asyncOptions',
				loadMethod: 'getOperations',
			},
            ...fileParams,
            ...argParams,
            ...catParams,
            ...dagParams,
            ...getParams,
            ...objectParams,
            ...pinParams,
			{
				label: 'Parameters',
				name: 'parameters',
				type: 'json',
				default: '[]',
				optional: true,
				description: 'Operation parameters in array. Ex: ["param1", "param2"]',
				show: {
					'actions.api': [
						'chainAPI',
					]
				},
			},
		] as INodeParams[];
	}

	loadMethods = {
 
		async getOperations(nodeData: INodeData): Promise<INodeOptionsValue[]> {

			const returnData: INodeOptionsValue[] = [];
			const actionData = nodeData.actions;
			const networksData = nodeData.networks;
            if (actionData === undefined || networksData === undefined ) {
                return returnData;
            }

			const api = actionData.api as string;
			
			if (api === 'chainAPI') {

                const network = networksData.network as string;
			
				let totalOperations: IETHOperation[] = [];

				let filteredOperations = ethOperations.filter((op: IETHOperation) => op.providers.includes('infura'));
				if (network === 'matic' || network === 'maticmum') {
                    filteredOperations = ethOperations.filter((op: IETHOperation) => op.providers.includes('infura') && op.networks.includes(network));
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
			else if (api === 'ipfsAPI') {
                return IPFSOperationsOptions;
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

		if (api === 'chainAPI') {

            // GET network
            const network = networksData.network as string;

            // GET credentials
            const apiKey = credentials.apiKey as string;
        
            // GET operation
            const operation = inputParametersData.operation as string;

			const uri = infuraHTTPAPIs[network] + apiKey;

			let responseData: any; // tslint:disable-line: no-any
			let bodyParameters: any[] = []; // tslint:disable-line: no-any
			const returnData: ICommonObject[] = [];

			let parameters = inputParametersData.parameters as string || '';
			//Remove whitespaces
			parameters = parameters.replace(/\s/g, '');
			
			if (parameters) {
				try {
					bodyParameters = JSON.parse(parameters);
				} catch(error) {
					throw handleErrorMessage(error);
				}
			}

			try {
				let totalOperations: IETHOperation[] = [];
				if (api === 'chainAPI') totalOperations = [...polygonOperations, ...ethOperations];
		
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

        else if (api === 'ipfsAPI') {
         
            // GET credentials
            const apiKey = credentials.apiKey as string;
            const secretKey = credentials.secretKey as string;

            // GET operation
            const operation = inputParametersData.operation as string;

            let responseData: any; // tslint:disable-line: no-any
            const returnData: ICommonObject[] = [];
            let apiUrl = 'https://ipfs.infura.io:5001/api';

            let url = '';
            const queryParameters: ICommonObject = {};
            let queryBody: any = {};
            let method: Method = 'POST';
            const headers: AxiosRequestHeaders = {
                'Content-Type': 'application/json',
                'Authorization': Buffer.from(`${apiKey}:${secretKey}`).toString('base64')
            };

            if (operation === 'block_get' || operation === 'block_stat') {
				const arg = inputParametersData.arg as string;
				queryParameters['arg'] = arg;
				method = 'POST';
                let endpoint = '';
                if (operation === 'block_stat') {
                    endpoint = 'block/stat';
                } else if (operation === 'block_get') {
                    endpoint = 'block/get';
                }
				url = `${apiUrl}/v0/${endpoint}`;
            }

            else if (operation === 'add' || operation === 'block_put' || operation === 'pin_add') {

				const fileBase64 = inputParametersData.file as string;
                const splitDataURI = fileBase64.split(',');
                const bf = Buffer.from(splitDataURI[1], "base64");
                const filename = splitDataURI[2].split(':')[1];
             
                const formData = new FormData();
                formData.append("file", bf, filename);

				method = 'POST';
                let endpoint = '';
                if (operation === 'add') {
                    endpoint = 'add';
                } else if (operation === 'block_put') {
                    endpoint = 'block/put';
                } else if (operation === 'pin_add') {
                    endpoint = 'pin/add';
                    const arg = inputParametersData.arg as string;
                    queryParameters['arg'] = arg;
                }
				url = `${apiUrl}/v0/${endpoint}`;
                headers['Content-Type'] = 'multipart/form-data; boundary=' + formData.getBoundary();
                queryBody = formData;
            }

            else if (operation === 'dag_get' || operation === 'dag_resolve') {

				const arg = inputParametersData.arg as string;
                const outputCodec = inputParametersData['output-codec'] as string;

				queryParameters['arg'] = arg;
				if (outputCodec) queryParameters['output-codec'] = outputCodec;
                method = 'POST';

                let endpoint = '';
                if (operation === 'dag_get') {
                    endpoint = 'dag/get';
                } else if (operation === 'dag_resolve') {
                    endpoint = 'dag/resolve';
                } 
				url = `${apiUrl}/v0/${endpoint}`;
            }

            else if (operation === 'dag_put') {

                const storeCodec = inputParametersData['store-codec'] as string;
                const inputCodec = inputParametersData['input-codec'] as string;
                const pin = inputParametersData.pin as boolean;
                const hash = inputParametersData.hash as string;

				if (storeCodec) queryParameters['store-codec'] = storeCodec;
                if (inputCodec) queryParameters['input-codec'] = inputCodec;
				if (pin) queryParameters.pin = pin;
				if (hash) queryParameters.hash = hash;

                const fileBase64 = inputParametersData.file as string;
                const splitDataURI = fileBase64.split(',');
                const bf = Buffer.from(splitDataURI[1], "base64");
                const filename = splitDataURI[2].split(':')[1];
             
                const formData = new FormData();
                formData.append("file", bf, filename);

                method = 'POST';
                url = `${apiUrl}/v0/dag/put`;
                headers['Content-Type'] = 'multipart/form-data; boundary=' + formData.getBoundary();
                queryBody = formData;
            }

            /*
            else if (operation === 'get') {

				const arg = inputParametersData.arg as string;
                const output = inputParametersData.output as string;
                const archive = inputParametersData.archive as boolean;
                const compress = inputParametersData.compress as boolean;
                const compressionLevel = inputParametersData['compression-level'] as number;

				queryParameters['arg'] = arg;
				if (output) queryParameters['output'] = output;
                if (archive) queryParameters['archive'] = archive;
                if (compress) queryParameters['compress'] = compress;
                if (compressionLevel) queryParameters['compressionLevel'] = compressionLevel;

                method = 'POST';
				url = `${apiUrl}/v0/get`;
            }
            */

            else if (operation === 'object_data' || operation === 'object_stat' || operation === 'object_get') {

				const arg = inputParametersData.arg as string;
             
				queryParameters['arg'] = arg;
				
                method = 'POST';
                let endpoint = '';
                if (operation === 'object_data') {
                    endpoint = 'object/data';
                } else if (operation === 'object_get') {
                    endpoint = 'object/get';
                } else if (operation === 'object_stat') {
                    endpoint = 'object/stat';
                } 
				url = `${apiUrl}/v0/${endpoint}`;
            }

            else if (operation === 'object_put') {

                const inputenc = inputParametersData.inputenc as string;
                const datafieldenc = inputParametersData.datafieldenc as string;
                const pin = inputParametersData.pin as boolean;

				if (inputenc) queryParameters.inputenc = inputenc;
                if (datafieldenc) queryParameters.datafieldenc = datafieldenc;
				if (pin) queryParameters.pin = pin;

                const fileBase64 = inputParametersData.file as string;
                const splitDataURI = fileBase64.split(',');
                const bf = Buffer.from(splitDataURI[1], "base64");
                const filename = splitDataURI[2].split(':')[1];
             
                const formData = new FormData();
                formData.append("file", bf, filename);

                method = 'POST';
                url = `${apiUrl}/v0/object/put`;
                headers['Content-Type'] = 'multipart/form-data; boundary=' + formData.getBoundary();
                queryBody = formData;
            }

            else if (operation === 'pin_ls' || operation === 'pin_rm') {

				const arg = inputParametersData.arg as string;
                const type = inputParametersData.type as string;
             
				queryParameters['arg'] = arg;
                if (type) queryParameters['type'] = type;
				
                method = 'POST';
                let endpoint = '';
                if (operation === 'pin_ls') {
                    endpoint = 'pin/ls';
                } else if (operation === 'pin_rm') {
                    endpoint = 'pin/rm';
                }
				url = `${apiUrl}/v0/${endpoint}`;
            }

            try {
                const result = IPFSOperationsOptions.find(obj => {
                    return obj.name === operation
                });

                if (result === undefined) throw new Error('Invalid Operation');

                const axiosConfig: AxiosRequestConfig = {
                    method,
                    url,
                    params: queryParameters,
                    paramsSerializer: params => serializeQueryParams(params),
                    headers,
                    data: queryBody
                }

                if (operation === 'cat' || operation === 'get') {
                    const arg = inputParametersData.arg as string;
                    const ipfsURL = `https://ipfs.infura.io/ipfs/${arg}`;

                    const axiosConfig: AxiosRequestConfig = {
                        method: 'HEAD',
                        url: ipfsURL,
                    }
                    const ipfsResponse = await axios(axiosConfig);
                    const mimeType = ipfsResponse.headers['content-type'];

                    const attachment = {
                        content: ipfsURL,
                        contentType: mimeType,
                    } as IAttachment;

                    const returnData: any = {};
                    returnData.ipfsURL = ipfsURL;
                    returnData.attachments = [attachment];

                    return returnNodeExecutionData(returnData);

                } else {
                    const response = await axios(axiosConfig);
                    responseData = response.data;
                }
            }
            catch (error) {
                throw handleErrorMessage(error);
            }

            if (Array.isArray(responseData)) returnData.push(...responseData);
            else returnData.push(responseData);

            return returnNodeExecutionData(returnData);
        }

        /*
        else if (api === 'filecoinAPI') {
         
            // GET credentials
            const apiKey = credentials.apiKey as string;
            const secretKey = credentials.secretKey as string;

            // GET operation
            const operation = inputParametersData.operation as string;

            let responseData: any; // tslint:disable-line: no-any
            const returnData: ICommonObject[] = [];
            const url = `https://${apiKey}:${secretKey}@filecoin.infura.io`;
            const queryParameters: ICommonObject = {};
            const queryBody: any = { 
                "id": 0,
                "jsonrpc": "2.0",
                "method": "",
                "params": [] 
            };
            const method: Method = 'POST';
            const headers: AxiosRequestHeaders = {
                'Content-Type': 'application/json',
                'Authorization': Buffer.from(`${apiKey}:${secretKey}`).toString('base64')
            };

            if (operation === 'ChainHead') {
				queryBody["method"] = `Filecoin.${operation}`;
            }

            try {
                const result = FilecoinOperationsOptions.find(obj => {
                    return obj.name === operation
                });

                if (result === undefined) throw new Error('Invalid Operation');

                const axiosConfig: AxiosRequestConfig = {
                    method,
                    url,
                    params: queryParameters,
                    paramsSerializer: params => serializeQueryParams(params),
                    headers,
                    data: queryBody
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
        */
		
		return returnNodeExecutionData([]);
	}
}

module.exports = { nodeClass: Infura }
