import { ICommonObject, INode, INodeData, INodeExecutionData, INodeOptionsValue, INodeParams, NodeType } from '../../src/Interface'
import { returnNodeExecutionData } from '../../src/utils'
import axios, { AxiosRequestConfig, Method } from 'axios'

interface IInvoiceItems {
    name: string
    unitPrice: number
    quantity: number
    taxType?: string
    taxAmount?: number
}

interface ICurrency {
    id: string
    hash: string
    address: string
    network: string
    decimals: number
    symbol: string
    type: string
}

class RequestFinance implements INode {
    label: string
    name: string
    type: NodeType
    description: string
    version: number
    icon: string
    category: string
    incoming: number
    outgoing: number
    actions?: INodeParams[]
    credentials?: INodeParams[]
    inputParameters?: INodeParams[]

    constructor() {
        this.label = 'RequestFinance'
        this.name = 'requestFinance'
        this.icon = 'requestFinance.svg'
        this.type = 'action'
        this.category = 'Accounting'
        this.version = 1.0
        this.description = 'Issue invoices and accept payments in cryptocurrency using RequestFinance API'
        this.incoming = 1
        this.outgoing = 1
        this.actions = [
            {
                label: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        label: 'Get Invoice',
                        name: 'getSingleInvoice',
                        description: 'Returns single invoice from RequestFinance account.'
                    },
                    {
                        label: 'Create Invoice',
                        name: 'createInvoice',
                        description: 'Creates a new payable invoice.'
                    },
                    {
                        label: 'Create Salary Payment',
                        name: 'createSalaryPayment',
                        description: 'Creates a new payable salary payment.'
                    }
                ]
            }
        ] as INodeParams[]

        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'RequestFinance API Key',
                        name: 'requestFinanceApi'
                    }
                ],
                default: 'requestFinanceApi'
            }
        ] as INodeParams[]

        this.inputParameters = [
            {
                label: 'Invoice Currency',
                name: 'invoiceCurrency',
                description:
                    'Currency in which the invoice is denominated. For example, invoices can be denominated in USD, but buyers can pay in crypto.',
                type: 'asyncOptions',
                loadMethod: 'getInvoiceCurrency'
            },
            {
                label: 'Invoice Items',
                name: 'invoiceItems',
                type: 'array',
                array: [
                    {
                        label: 'Name',
                        name: 'name',
                        type: 'string',
                        description: 'Name of the product/service for which the invoice is created.',
                        default: ''
                    },
                    {
                        label: 'Unit Price',
                        name: 'unitPrice',
                        description: 'Price of the product/service, excl. taxes.',
                        type: 'number'
                    },
                    {
                        label: 'Quantity',
                        name: 'quantity',
                        description: 'Quantity of the product/service that was provided.',
                        type: 'number'
                    },
                    {
                        label: 'Tax Type',
                        name: 'taxType',
                        description:
                            'Currency code in which the invoice is denominated. For example, invoices can be denominated in USD, but buyers can pay in crypto.',
                        type: 'options',
                        options: [
                            {
                                label: 'Fixed',
                                name: 'fixed'
                            },
                            {
                                label: 'Percentage',
                                name: 'percentage'
                            }
                        ],
                        optional: true
                    },
                    {
                        label: 'Tax Amount',
                        name: 'taxAmount',
                        description: 'Amount of the tax.',
                        type: 'number',
                        show: {
                            'inputParameters.invoiceItems[$index].taxType': ['fixed', 'percentage']
                        }
                    }
                ]
            },
            {
                label: 'Payment Address',
                name: 'paymentAddress',
                type: 'string',
                description: 'Address which will receive the payment.',
                default: '',
                placeholder: '0xE597E474889537A3A9120d1B5793cdFAEf6B6c10'
            },
            {
                label: 'Payment Currency',
                name: 'paymentCurrency',
                description: 'Currency in which the invoice can be paid.',
                type: 'asyncOptions',
                loadMethod: 'getPaymentCurrency'
            },
            {
                label: 'Payment Due Date',
                name: 'paymentCurrency',
                description: 'Due date of the invoice. Last date the buyer can pay.',
                type: 'date',
                optional: true
            },
            {
                label: 'Client Type',
                name: 'clientType',
                type: 'options',
                options: [
                    {
                        label: 'Existing',
                        name: 'existing'
                    },
                    {
                        label: 'New',
                        name: 'new'
                    }
                ]
            },
            {
                label: 'Client Email',
                name: 'buyerInfoemail',
                type: 'string',
                description: 'Email of the buyer/customer/client',
                default: '',
                show: {
                    'inputParameters.clientType': ['new']
                }
            },
            {
                label: 'Client Business Name',
                name: 'buyerInfobusinessName',
                type: 'string',
                description: 'Business name of the buyer/customer/client',
                default: '',
                optional: true,
                show: {
                    'inputParameters.clientType': ['new']
                }
            },
            {
                label: 'Client First Name',
                name: 'buyerInfofirstName',
                type: 'string',
                default: '',
                optional: true,
                show: {
                    'inputParameters.clientType': ['new']
                }
            },
            {
                label: 'Client Last Name',
                name: 'buyerInfolastName',
                type: 'string',
                default: '',
                optional: true,
                show: {
                    'inputParameters.clientType': ['new']
                }
            },
            {
                label: 'Client Street Address',
                name: 'buyerInfostreetAddress',
                type: 'string',
                description: 'Street, house, apartment of the buyer.',
                default: '',
                optional: true,
                show: {
                    'inputParameters.clientType': ['new']
                }
            },
            {
                label: 'Client Postal Code',
                name: 'buyerInfopostalCode',
                type: 'string',
                description: 'Post code of the buyer.',
                default: '',
                optional: true,
                show: {
                    'inputParameters.clientType': ['new']
                }
            },
            {
                label: 'Client State',
                name: 'buyerInforegion',
                type: 'string',
                description: 'Region of the buyer (e.g. “California”).',
                default: '',
                optional: true,
                show: {
                    'inputParameters.clientType': ['new']
                }
            },
            {
                label: 'Client Country',
                name: 'buyerInfocountry',
                description: 'Country of the buyer (e.g. US).',
                type: 'asyncOptions',
                loadMethod: 'getCountry',
                optional: true,
                show: {
                    'inputParameters.clientType': ['new']
                }
            }
        ] as INodeParams[]
    }

    loadMethods = {
        async getInvoiceCurrency(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []

            try {
                const axiosConfig: AxiosRequestConfig = {
                    method: 'GET' as Method,
                    url: `https://api.request.finance/currency/list/invoicing`
                }

                const response = await axios(axiosConfig)
                const tokens = response.data
                const symbols: Set<string> = new Set()

                for (let i = 0; i < tokens.length; i += 1) {
                    const token = tokens[i]
                    if (!token.symbol.includes('-')) symbols.add(token.symbol)
                }

                symbols.forEach((sym) => {
                    const data = {
                        label: sym,
                        name: sym
                    } as INodeOptionsValue
                    returnData.push(data)
                })
                return returnData
            } catch (e) {
                return returnData
            }
        },

        async getPaymentCurrency(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []

            try {
                const axiosConfig: AxiosRequestConfig = {
                    method: 'GET' as Method,
                    url: `https://api.request.finance/currency/list/invoicing`
                }

                const response = await axios(axiosConfig)
                const tokens = response.data
                const symbols: Set<string> = new Set()

                for (let i = 0; i < tokens.length; i += 1) {
                    const token = tokens[i]
                    if (token.id.includes('-')) symbols.add(token.id)
                }

                symbols.forEach((sym) => {
                    const data = {
                        label: sym,
                        name: sym
                    } as INodeOptionsValue
                    returnData.push(data)
                })
                return returnData
            } catch (e) {
                return returnData
            }
        },

        async getCountry(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []

            try {
                const axiosConfig: AxiosRequestConfig = {
                    method: 'GET' as Method,
                    url: `https://restcountries.com/v2/all`
                }

                const response = await axios(axiosConfig)
                const countries = response.data

                for (let i = 0; i < countries.length; i += 1) {
                    const country = countries[i]
                    const data = {
                        label: country.name,
                        name: country.alpha2Code
                    } as INodeOptionsValue
                    returnData.push(data)
                }
                return returnData
            } catch (e) {
                return returnData
            }
        }
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        const actionsData = nodeData.actions
        const credentials = nodeData.credentials
        const inputParametersData = nodeData.inputParameters

        if (actionsData === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing!')
        }
        if (credentials === undefined) {
            throw new Error('Missing credentials!')
        }

        // Get Operation
        const operation = actionsData.operation as string

        // Get API key
        const apiKey = credentials.apiKey as string

        // Get invoice items
        const invoiceItems = inputParametersData.invoiceItems as unknown as IInvoiceItems[]
        const invoiceCurrency = inputParametersData.invoiceCurrency as string

        const returnData: ICommonObject[] = []

        let responseData: any

        /*try {
            const axiosConfig: AxiosRequestConfig = {
                method: 'POST' as Method,
                url: `${webhookUrl}?wait=true`,
                data: body,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }
            const response = await axios(axiosConfig)
            responseData = response.data
        } catch (error) {
            throw handleErrorMessage(error)
        }*/

        if (Array.isArray(responseData)) {
            returnData.push(...responseData)
        } else {
            returnData.push(responseData)
        }

        return returnNodeExecutionData(returnData)
    }
}

module.exports = { nodeClass: RequestFinance }
