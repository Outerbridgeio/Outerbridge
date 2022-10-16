import { ICommonObject, INode, INodeData, INodeExecutionData, INodeOptionsValue, INodeParams, NodeType } from '../../src/Interface'
import { handleErrorMessage, refreshOAuth2Token, returnNodeExecutionData, serializeQueryParams } from '../../src/utils'
import axios, { AxiosRequestConfig, AxiosRequestHeaders, Method } from 'axios'

class Xero implements INode {
    label: string
    name: string
    type: NodeType
    description: string
    version: number
    icon: string
    incoming: number
    outgoing: number

    actions: INodeParams[]
    credentials?: INodeParams[]
    networks?: INodeParams[]
    inputParameters?: INodeParams[]

    constructor() {
        this.label = 'Xero'
        this.name = 'xero'
        this.icon = 'xero.svg'
        this.type = 'action'
        this.version = 1.0
        this.description = 'Perform Xero operations'
        this.incoming = 1
        this.outgoing = 1

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
                        label: 'Get single invoice',
                        name: 'getSingleInvoice',
                        description: 'Returns single invoice from Xero account.'
                    },
                    {
                        label: 'Create Invoice',
                        name: 'createInvoice',
                        description: 'Creates a new draft invoice.'
                    },
                    {
                        label: 'Send email',
                        name: 'sendToEmail',
                        description: 'Send email with invoice to primary email.'
                    }
                ],
                default: 'getXeroBalance'
            }
        ] as INodeParams[]

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
        ] as INodeParams[]

        this.inputParameters = [
            {
                label: 'Tenant',
                name: 'tenant',
                type: 'asyncOptions',
                loadMethod: 'getTenants'
            },
            {
                label: 'Invoice',
                name: 'invoice',
                type: 'asyncOptions',
                loadMethod: 'getInvoices',
                show: {
                    'actions.operation': ['getSingleInvoice', 'sendToEmail']
                }
            },
            // Get existing contacts
            {
                label: 'Who do you want to bill?',
                name: 'contactName',
                type: 'asyncOptions',
                loadMethod: 'getContacts',
                show: {
                    'actions.operation': ['createInvoice']
                }
            },
            {
                label: 'Type of invoice',
                name: 'invoiceType',
                type: 'options',
                description: 'Which type of invoice? (ACCPAY or ACCREC)',
                options: [
                    { label: 'ACCPAY - Accounts Payable', name: 'ACCPAY' },
                    { label: 'ACCREC - Accounts Receivable', name: 'ACCREC' }
                ],
                show: {
                    'actions.operation': ['createInvoice']
                }
            },
            {
                label: 'Description',
                name: 'lineItem',
                type: 'string',
                description: 'Service or product to be billed.',
                placeholder: 'What service / product is to be billed?',
                show: {
                    'actions.operation': ['createInvoice']
                }
            },
            {
                label: 'Cost',
                name: 'unitAmount',
                type: 'number',
                description: 'Cost of product / service',
                show: {
                    'actions.operation': ['createInvoice']
                }
            },
            {
                label: 'Quantity',
                name: 'unitQuantity',
                type: 'number',
                description: 'Quantity of product / service',
                show: {
                    'actions.operation': ['createInvoice']
                }
            }
        ] as INodeParams[]
    }

    loadMethods = {
        async getTenants(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []

            const credentials = nodeData.credentials

            if (credentials === undefined) {
                return returnData
            }

            // Get credentials
            const token_type = credentials!.token_type as string
            const access_token = credentials!.access_token as string
            const headers: AxiosRequestHeaders = {
                'Content-Type': 'application/json',
                Authorization: `${token_type} ${access_token}`
            }

            const axiosConfig: AxiosRequestConfig = {
                method: 'GET',
                url: `https://api.xero.com/connections`,
                headers
            }
            let maxRetries = 5
            do {
                try {
                    const response = await axios(axiosConfig)
                    const responseData = response.data
                    for (const tenant of responseData || []) {
                        returnData.push({
                            label: tenant.tenantName as string,
                            name: tenant.tenantId as string
                        })
                    }
                    return returnData
                } catch (e) {
                    if (e.response && e.response.status === 401) {
                        const { access_token } = await refreshOAuth2Token(credentials)
                        headers['Authorization'] = `${token_type} ${access_token}`
                        continue
                    }
                    return returnData
                }
            } while (--maxRetries)
            return returnData
        },

        async getInvoices(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []

            const credentials = nodeData.credentials
            const inputParameters = nodeData.inputParameters

            if (credentials === undefined || inputParameters === undefined) {
                return returnData
            }

            // Get credentials
            const tenantId = inputParameters.tenant as string
            const token_type = credentials!.token_type as string
            const access_token = credentials!.access_token as string

            const headers: AxiosRequestHeaders = {
                Accept: 'application/json',
                Authorization: `${token_type} ${access_token}`,
                'Xero-tenant-id': tenantId
            }

            if (tenantId === undefined || token_type === undefined || access_token === undefined) {
                return returnData
            }

            const axiosConfig: AxiosRequestConfig = {
                method: 'GET',
                url: `https://api.xero.com/api.xro/2.0/Invoices`,
                headers
            }
            let maxRetries = 5
            do {
                try {
                    const response = await axios(axiosConfig)

                    const responseData = response.data

                    for (const invoice of responseData.Invoices || []) {
                        returnData.push({
                            label: `${invoice.Contact.Name as string} - ${invoice.InvoiceNumber as string} `,
                            name: invoice.InvoiceID as string
                        })
                    }

                    return returnData
                } catch (e) {
                    if (e.response && e.response.status === 401) {
                        const { access_token } = await refreshOAuth2Token(credentials)
                        headers['Authorization'] = `${token_type} ${access_token}`
                        continue
                    }
                    return returnData
                }
            } while (--maxRetries)
            return returnData
        },

        async getContacts(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []

            const credentials = nodeData.credentials
            const inputParameters = nodeData.inputParameters

            if (credentials === undefined || inputParameters === undefined) {
                return returnData
            }

            const tenantId = inputParameters.tenant as string
            const token_type = credentials!.token_type as string
            const access_token = credentials!.access_token as string

            const headers: AxiosRequestHeaders = {
                Accept: 'application/json',
                Authorization: `${token_type} ${access_token}`,
                'Xero-tenant-id': tenantId
            }

            if (tenantId === undefined || token_type === undefined || access_token === undefined) {
                return returnData
            }

            const axiosConfig: AxiosRequestConfig = {
                method: 'GET',
                url: `https://api.xero.com/api.xro/2.0/contacts`,
                headers
            }

            let maxRetries = 5
            do {
                try {
                    const response = await axios(axiosConfig)
                    const responseData = response.data

                    for (const contact of responseData.Contacts || []) {
                        returnData.push({
                            label: `${contact.Name as string}`,
                            name: `${contact.ContactID as string}`
                        })
                    }
                    return returnData
                } catch (e) {
                    if (e.response && e.response.status === 401) {
                        const { access_token } = await refreshOAuth2Token(credentials)
                        headers['Authorization'] = `${token_type} ${access_token}`
                        continue
                    }
                    return returnData
                }
            } while (--maxRetries)
            return returnData
        }
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        // function to start running node
        const actionsData = nodeData.actions
        const credentials = nodeData.credentials
        const inputParametersData = nodeData.inputParameters

        if (actionsData === undefined) {
            throw new Error('Required data missing!')
        }
        if (credentials === undefined) {
            throw new Error('Missing credentials!')
        }

        // Get Operation
        const operation = actionsData.operation as string

        // Get credentials https://developer.xero.com/documentation/guides/oauth2/auth-flow/#4-receive-your-tokens
        const token_type = credentials!.token_type as string
        const access_token = credentials!.access_token as string

        const returnData: ICommonObject[] = []

        let responseData: any

        let url = ''
        const queryParameters: ICommonObject = {}

        const invoiceId = inputParametersData?.invoice as string
        const tenantId = inputParametersData?.tenant as string

        const invoiceType = inputParametersData?.invoiceType as string
        const contactId = inputParametersData?.contactName as string
        const lineItem = inputParametersData?.lineItem as string
        const unitAmount = inputParametersData?.unitAmount as string
        const unitQuantity = inputParametersData?.unitQuantity as string
        const lineItems = {
            Description: lineItem,
            UnitAmount: unitAmount,
            Quantity: unitQuantity
        }
        const Contact = {
            ContactID: contactId
        }

        let queryBody: any = {}
        let method: Method = 'POST'

        const headers: AxiosRequestHeaders = {
            Accept: 'application/json',
            authorization: `${token_type} ${access_token}`,
            'Xero-tenant-id': tenantId
        }

        let maxRetries = 5
        let oAuth2RefreshedData: any = {}

        do {
            try {
                if (operation === 'getAllInvoices') {
                    method = 'GET'
                    url = `https://api.xero.com/api.xro/2.0/Invoices`
                } else if (operation === 'getSingleInvoice') {
                    method = 'GET'
                    url = `https://api.xero.com/api.xro/2.0/Invoices/${invoiceId}`
                } else if (operation === 'sendToEmail') {
                    // Will fail in the 'Test Node' because the test creates a req.body
                    // The Endpoint requires and empty body to return successfully.
                    method = 'POST'
                    url = `https://api.xero.com/api.xro/2.0/Invoices/${invoiceId}/Email`
                } else if (operation === 'createInvoice') {
                    method = 'POST'
                    url = `https://api.xero.com/api.xro/2.0/Invoices`
                    queryBody = {
                        Type: invoiceType,
                        LineItems: [lineItems],
                        Contact: Contact
                    }
                }

                const axiosConfig: AxiosRequestConfig = {
                    method,
                    url,
                    headers
                }

                if (Object.keys(queryParameters).length > 0) {
                    axiosConfig.params = queryParameters
                    axiosConfig.paramsSerializer = (params) => serializeQueryParams(params)
                }

                if (Object.keys(queryBody).length > 0) {
                    axiosConfig.data = queryBody
                }

                const response = await axios(axiosConfig)
                responseData = response.data
                break
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    const { access_token, expires_in } = await refreshOAuth2Token(credentials)
                    headers['Authorization'] = `${token_type} ${access_token}`
                    oAuth2RefreshedData = { access_token, expires_in }
                    continue
                }
                throw handleErrorMessage(error)
            }
        } while (--maxRetries)

        if (maxRetries <= 0) {
            throw new Error('Error executing Xero node. Max retries limit was reached.')
        }

        if (Array.isArray(responseData)) {
            returnData.push(...responseData)
        } else {
            returnData.push(responseData)
        }

        return returnNodeExecutionData(returnData, oAuth2RefreshedData)
    }
}

module.exports = { nodeClass: Xero }
