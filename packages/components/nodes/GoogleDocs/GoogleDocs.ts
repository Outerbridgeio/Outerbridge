import { ICommonObject, INode, INodeData, INodeExecutionData, INodeOptionsValue, INodeParams, NodeType } from '../../src/Interface';
import { handleErrorMessage, refreshOAuth2Token, returnNodeExecutionData, serializeQueryParams } from '../../src/utils';
import axios, { AxiosRequestConfig, AxiosRequestHeaders, Method } from 'axios';

class GoogleDocs implements INode {
    label: string;
    name: string;
    type: NodeType;
    description?: string;
    version: number;
    icon: string;
    incoming: number;
    outgoing: number;
    actions?: INodeParams[];
    credentials?: INodeParams[];
    inputParameters?: INodeParams[];

    constructor() {
        this.label = 'GoogleDocs';
        this.name = 'googleDocs';
        this.icon = 'gdocs.svg';
        this.type = 'action';
        this.version = 1.0;
        this.description = 'Execute GoogleDocs operations';
        this.incoming = 1;
        this.outgoing = 1;

        this.actions = [
            {
                label: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        label: 'Create New Document',
                        name: 'create',
                        description: 'Create a new document'
                    }
                ],
                default: 'create'
            }
        ] as INodeParams[];

        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Google Docs OAuth2',
                        name: 'googleDocsOAuth2Api'
                    }
                ],
                default: 'googleDocsOAuth2Api'
            }
        ] as INodeParams[];

        this.inputParameters = [
            {
                label: 'Document Name',
                name: 'documentName',
                type: 'string',
                optional: true,
                description: 'Name of the document to create. Default to Untitled document.',
                show: {
                    'actions.operation': ['create']
                }
            }
        ] as INodeParams[];
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        const actionsData = nodeData.actions;
        const credentials = nodeData.credentials;
        const inputParametersData = nodeData.inputParameters;

        if (actionsData === undefined) {
            throw new Error('Required data missing!');
        }

        if (credentials === undefined) {
            throw new Error('Missing credential!');
        }

        // Get operation
        const operation = actionsData.operation as string;

        // Get credentials
        const token_type = credentials!.token_type as string;
        const access_token = credentials!.access_token as string;

        const returnData: ICommonObject[] = [];
        let responseData: any;

        let url = '';
        const queryParameters: ICommonObject = {};
        let queryBody: any = {};
        let method: Method = 'POST';
        const headers: AxiosRequestHeaders = {
            'Content-Type': 'application/json',
            Authorization: `${token_type} ${access_token}`
        };

        let maxRetries = 5;
        let oAuth2RefreshedData: any = {};

        do {
            try {
                if (operation === 'create') {
                    url = 'https://docs.googleapis.com/v1/documents';
                    const documentName = inputParametersData?.documentName as string;
                    if (documentName) {
                        queryBody['title'] = documentName;
                    }
                }

                const axiosConfig: AxiosRequestConfig = {
                    method,
                    url,
                    headers
                };

                if (Object.keys(queryParameters).length > 0) {
                    axiosConfig.params = queryParameters;
                    axiosConfig.paramsSerializer = (params) => serializeQueryParams(params);
                }

                if (Object.keys(queryBody).length > 0) {
                    axiosConfig.data = queryBody;
                }

                const response = await axios(axiosConfig);
                responseData = response.data;
                break;
            } catch (error) {
                // Access_token expired
                if (error.response && error.response.status === 401) {
                    const { access_token, expires_in } = await refreshOAuth2Token(credentials);
                    headers['Authorization'] = `${token_type} ${access_token}`;
                    oAuth2RefreshedData = { access_token, expires_in };
                    continue;
                }
                throw handleErrorMessage(error);
            }
        } while (--maxRetries);

        if (maxRetries <= 0) {
            throw new Error('Error executing GoogleDocs node. Max retries limit was reached.');
        }

        if (Array.isArray(responseData)) {
            returnData.push(...responseData);
        } else {
            returnData.push(responseData);
        }

        return returnNodeExecutionData(returnData, oAuth2RefreshedData);
    }
}

module.exports = { nodeClass: GoogleDocs };
