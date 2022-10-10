import { ICommonObject, INode, INodeData, INodeExecutionData, INodeParams, NodeType } from '../../src/Interface';
import { handleErrorMessage, refreshOAuth2Token, returnNodeExecutionData, serializeQueryParams } from '../../src/utils';
import axios, { AxiosRequestConfig, AxiosRequestHeaders, Method } from 'axios';
import { Buffer } from 'buffer';

class Xero implements INode {
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
        this.label = 'Xero';
        this.name = 'xero';
        this.icon = 'xero.svg';
        this.type = 'action';
        this.version = 1.0;
        this.description = 'Perform Xero operations';
        this.incoming = 1;
        this.outgoing = 1;

        this.actions = [
            {
                label: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        label: 'Get all invoices',
                        name: 'getAll',
                        description: 'Returns all the invoices from Xero account.'
                    },
                    {
                        label: 'Send email',
                        name: 'sendEmail',
                        description: 'Send email with invoice'
                    }
                ],
                default: 'getXeroBalance'
            }
        ] as INodeParams[];

        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Xero OAuth2',
                        name: 'xeroOAuth2Api'
                    }
                ],
                default: 'xeroOAuth2Api'
            }
        ] as INodeParams[];

        this.inputParameters = [
            {
                label: 'Invoice',
                name: 'invoiceId',
                type: 'asyncOptions',
                loadMethod: 'getAllInvoices',
                show: {
                    'actions.operation': ['create']
                }
            },
            {
                label: 'Email Address',
                name: 'emailAddress',
                type: 'string',
                description: 'Address to send invoice to.',
                show: {
                    'actions.operation': ['sendEmail']
                }
            }
        ] as INodeParams[];
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        // function to start running node
        const actionsData = nodeData.actions;
        const credentials = nodeData.credentials;
        const inputParametersData = nodeData.inputParameters;

        if (actionsData === undefined) {
            throw new Error('Required data missing!');
        }
        if (credentials === undefined) {
            throw new Error('Missing credentials!');
        }

        // Get Operation
        const operation = actionsData.operation as string;

        // Get credentials
        const clientId = credentials!.clientId as string;
        const clientSecret = credentials!.clientSecret as string;
        const token_type = credentials!.token_type as string;
        const accessTokenUrl = credentials!.accessTokenUrl as string;
        const expires_in = credentials!.expires_in as string;
        const refresh_token = credentials!.refresh_token as string;

        const returnData: ICommonObject[] = [];
        let responseData: any;

        let url = '';
        const queryParameters: ICommonObject = {};
        let queryBody: any = {};
        let method: Method = 'POST';
        const headers: AxiosRequestHeaders = {
            'Content-Type': 'application/x-www-form-urlencoded',
            authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
            grant_type: 'authorization_code'
        };

        const invoiceId = inputParametersData?.invoiceId as string;
        const emailAddress = inputParametersData?.emailAddress as string;

        let maxRetries = 5;
        let oAuth2RefreshedData: any = {};

        do {
            try {
                if (operation === 'sendEmail') {
                    console.log('Im trying to send email with an invoice');
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
                if (error.request) {
                    console.log(error.request);
                }
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
            throw new Error('Error executing Xero node. Max retries limit was reached.');
        }

        if (Array.isArray(responseData)) {
            returnData.push(...responseData);
        } else {
            returnData.push(responseData);
        }

        return returnNodeExecutionData(returnData, oAuth2RefreshedData);
    }
}

module.exports = { nodeClass: Xero };
