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
} from '../../src/utils';
import axios, { AxiosRequestConfig, AxiosRequestHeaders, Method } from 'axios';

class GraphQL implements INode {

    label: string;
    name: string;
    type: NodeType;
    description?: string;
    version: number;
	icon?: string;
    incoming: number;
	outgoing: number;
    credentials?: INodeParams[];
    inputParameters?: INodeParams[];

    constructor() {
		this.label = 'GraphQL';
		this.name = 'graphQL';
		this.icon = 'graphql.svg';
		this.type = 'action';
		this.version = 1.0;
		this.description = 'Execute GraphQL request';
		this.incoming = 1;
        this.outgoing = 1;
		this.credentials = [
            {
				label: 'Authorization',
				name: 'credentialMethod',
				type: 'options',
				options: [
					{
						label: 'Basic Auth',
						name: 'httpBasicAuth',
					},
                    {
						label: 'Bearer Token Auth',
						name: 'httpBearerTokenAuth',
					},
                    {
						label: 'No Auth',
						name: 'noAuth',
                        hideRegisteredCredential: true
					},
				],
				default: 'noAuth',
			},
			
		] as INodeParams[];
		this.inputParameters = [
			{
				label: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				placeholder: 'http://<your-url>.com/',
			},
			{
				label: 'Headers',
				name: 'headers',
				type: 'array',
                array: [
					{
						label: 'Key',
						name: 'key',
						type: 'string',
						default: '',
					},
                    {
						label: 'Value',
						name: 'value',
						type: 'string',
						default: '',
					},
                ],
                optional: true,
			},
            {
				label: 'GraphQL Body',
				name: 'body',
				type: 'json',
                placeholder: `{
  me {
    name
  }
}`,
                optional: true,
            },
            {
				label: 'Variables',
				name: 'variables',
				type: 'json',
                placeholder: '{"var1": "value1"}',
                optional: true,
			},
		]
	};


	async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {

        const inputParametersData = nodeData.inputParameters;
		const credentials = nodeData.credentials;

		if (inputParametersData === undefined || credentials === undefined) {
            throw new Error('Required data missing');
        }

        const credentialMethod = credentials.credentialMethod as string;

        const url = inputParametersData.url as string;
        const headers = inputParametersData.headers as ICommonObject[] || [];
        const body = inputParametersData.body as string;
        let variables = inputParametersData.variables as string;
       
        const returnData: ICommonObject = {};

        try {
            let queryHeaders: AxiosRequestHeaders = {};
            let data: any = {};

            for (const header of headers) {
				const key = header.key as string;
				const value = header.value as string;
				if (key) queryHeaders[key] = value;
            }

            if (body) {
                data = { query : body.replace(/\s/g, ' ') };
            }

            if (variables) {
                const variablesJSON = JSON.parse(variables.replace(/\s/g, ''));
                if (Object.keys(variablesJSON).length) {
                    data.variables = variablesJSON;
                }
            }
            
            if (credentialMethod === 'httpBearerTokenAuth') {
                queryHeaders['Authorization'] = `Bearer ${credentials!.token}`;
            }

            const axiosConfig: AxiosRequestConfig = {
                method: 'POST' as Method,
                url,
            }

			if (Object.keys(data).length) {
				axiosConfig.data = data;
			}

			if (Object.keys(queryHeaders).length) {
				axiosConfig.headers = queryHeaders;
			}

            if (credentialMethod === 'httpBasicAuth') {
                axiosConfig.auth = {
                    username: credentials!.userName as string,
                    password: credentials!.password as string
                }
            }

            const response = await axios(axiosConfig);
            returnData['data'] = response.data;	
            returnData['status'] = response.status;
            returnData['statusText'] = response.statusText;
            returnData['headers'] = response.headers;
        }
        catch (error) {
            throw handleErrorMessage(error);
        }

        return returnNodeExecutionData(returnData);

	}
}

module.exports = { nodeClass: GraphQL }
