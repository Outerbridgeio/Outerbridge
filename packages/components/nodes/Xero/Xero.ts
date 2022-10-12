import { ICommonObject, INode, INodeData, INodeExecutionData, INodeOptionsValue, INodeParams, NodeType } from '../../src/Interface';
import { handleErrorMessage, refreshOAuth2Token, returnNodeExecutionData, serializeQueryParams } from '../../src/utils';
import axios, { AxiosRequestConfig, AxiosRequestHeaders, Method } from 'axios';

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
                        name: 'getAllInvoices',
                        description: 'Returns all the invoices from Xero account.'
                    },
                    {
                        label: 'Get single invoices',
                        name: 'getSingleInvoice',
                        description: 'Returns single invoices from Xero account.'
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
                label: 'Tenant',
                name: 'tenant',
                type: 'asyncOptions',
                loadMethod: 'getTenants',
            },
            {
                label: 'Invoice',
                name: 'invoiceId',
                type: 'asyncOptions',
                loadMethod: 'getAllInvoices',
                show: {
                    'actions.operation': ['getSingleInvoice']
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

    loadMethods = {

        async getTenants(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = [];

            const credentials = nodeData.credentials;

            if (credentials === undefined) {
                return returnData;
            }

            // Get credentials
            const token_type = credentials!.token_type as string;
            const access_token = credentials!.access_token as string;
            const headers: AxiosRequestHeaders = {
                'Content-Type': 'application/json',
                'Authorization': `${token_type} ${access_token}`,
            };

            const axiosConfig: AxiosRequestConfig = {
                method: 'GET',
                url: `https://api.xero.com/connections`,
                headers
            }

            let maxRetries = 5;
            do {
                try {
                    const response = await axios(axiosConfig);
                    const responseData = response.data;
                    for (const tenant of (responseData || [])) {
                        returnData.push({
                            label: tenant.tenantName as string,
                            name: tenant.tenantId as string,
                        });
                    }
                    return returnData;
                } catch(e) {
                    // Access_token expired
                    if (e.response && e.response.status === 401) {
                        const { access_token } = await refreshOAuth2Token(credentials);
                        headers['Authorization'] = `${token_type} ${access_token}`;
                        continue;                    
                    }
                    return returnData;
                }
            } while (--maxRetries);

            return returnData;
        },
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

        // Get credentials https://developer.xero.com/documentation/guides/oauth2/auth-flow/#4-receive-your-tokens
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
            'Authorization': `${token_type} ${access_token}`,
		};

        const invoiceId = inputParametersData?.invoiceId as string;
        const emailAddress = inputParametersData?.emailAddress as string;
        const tenantId = inputParametersData?.tenant as string;

        let maxRetries = 5;
        let oAuth2RefreshedData: any = {};

        do {
            try {
                if (operation === 'getAllInvoices') {
                    url = 'https://api.xero.com/api.xro/2.0/Invoices';
                    method = 'GET';
                    headers['Xero-tenant-id'] = tenantId;
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