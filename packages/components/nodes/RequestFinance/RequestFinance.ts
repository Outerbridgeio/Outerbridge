import { ICommonObject, INode, INodeData, INodeExecutionData, INodeOptionsValue, INodeParams, NodeType } from '../../src/Interface'
import { handleErrorMessage, returnNodeExecutionData } from '../../src/utils'
import axios, { AxiosRequestConfig, Method } from 'axios'
import moment from 'moment'
import { invoiceParameters, salaryParameters } from './constants'

interface IInvoiceItems {
    name: string
    unitPrice: number
    quantity: number
    taxType?: string
    taxAmount?: number
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
        this.label = 'Request Finance'
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
                label: 'Invoice',
                name: 'invoiceId',
                type: 'asyncOptions',
                loadMethod: 'getInvoices',
                show: {
                    'actions.operation': ['getSingleInvoice']
                }
            },
            ...salaryParameters,
            ...invoiceParameters
        ] as INodeParams[]
    }

    loadMethods = {
        async getInvoiceCurrency(): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []

            try {
                const axiosConfig: AxiosRequestConfig = {
                    method: 'GET' as Method,
                    url: `https://api.request.finance/currency/list/invoicing`
                }

                const response = await axios(axiosConfig)
                const tokens = response.data
                const tokenSet: Set<string> = new Set()

                for (let i = 0; i < tokens.length; i += 1) {
                    const token = tokens[i]
                    if (!token.symbol.includes('-')) tokenSet.add(`${token.symbol} | ${token.decimals}`)
                }

                tokenSet.forEach((tkn) => {
                    const data = {
                        label: tkn.split('|')[0].trim(),
                        name: tkn
                    } as INodeOptionsValue
                    returnData.push(data)
                })
                return returnData
            } catch (e) {
                return returnData
            }
        },

        async getPaymentCurrency(): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []

            try {
                const axiosConfig: AxiosRequestConfig = {
                    method: 'GET' as Method,
                    url: `https://api.request.finance/currency/list/invoicing`
                }

                const response = await axios(axiosConfig)
                const tokens = response.data
                const tokenSet: Set<string> = new Set()

                for (let i = 0; i < tokens.length; i += 1) {
                    const token = tokens[i]
                    if (token.id.includes('-')) tokenSet.add(`${token.id} | ${token.decimals}`)
                }

                tokenSet.forEach((tkn) => {
                    const data = {
                        label: tkn.split('|')[0].trim(),
                        name: tkn
                    } as INodeOptionsValue
                    returnData.push(data)
                })
                return returnData
            } catch (e) {
                return returnData
            }
        },

        async getCountry(): Promise<INodeOptionsValue[]> {
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
        },

        async getClients(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []
            const credentials = nodeData.credentials

            if (credentials === undefined) {
                return returnData
            }

            const apiKey = credentials!.apiKey as string

            try {
                const axiosConfig: AxiosRequestConfig = {
                    method: 'GET' as Method,
                    url: `https://api.request.finance/clients?type=customer`,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: apiKey
                    }
                }

                const response = await axios(axiosConfig)
                const clients = response.data

                for (let i = 0; i < clients.length; i += 1) {
                    const client = clients[i]
                    const data = {
                        label: client.email,
                        name: JSON.stringify(client)
                    } as INodeOptionsValue
                    returnData.push(data)
                }
                return returnData
            } catch (e) {
                return returnData
            }
        },

        async getEmployees(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []
            const credentials = nodeData.credentials

            if (credentials === undefined) {
                return returnData
            }

            const apiKey = credentials!.apiKey as string

            try {
                const axiosConfig: AxiosRequestConfig = {
                    method: 'GET' as Method,
                    url: `https://api.request.finance/clients?type=employee`,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: apiKey
                    }
                }

                const response = await axios(axiosConfig)
                const employees = response.data

                for (let i = 0; i < employees.length; i += 1) {
                    const employee = employees[i]
                    const data = {
                        label: employee.email,
                        name: JSON.stringify(employee)
                    } as INodeOptionsValue
                    returnData.push(data)
                }
                return returnData
            } catch (e) {
                return returnData
            }
        },

        async getInvoices(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []
            const credentials = nodeData.credentials

            if (credentials === undefined) {
                return returnData
            }

            const apiKey = credentials!.apiKey as string

            try {
                const axiosConfig: AxiosRequestConfig = {
                    method: 'GET' as Method,
                    url: `https://api.request.finance/invoices?filterBy=sent&variant=rnf_invoice`,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: apiKey
                    }
                }

                const response = await axios(axiosConfig)
                const invoices = response.data

                for (let i = 0; i < invoices.length; i += 1) {
                    const invoice = invoices[i]
                    const data = {
                        label: `${invoice.invoiceNumber} (${moment(invoice.creationDate).format('MMMM D, YYYY')})`,
                        name: invoice.id
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

        // Get Input Params
        const invoiceItems = inputParametersData.invoiceItems as unknown as IInvoiceItems[]
        const invoiceCurrencyValue = inputParametersData.invoiceCurrency as string
        const invoiceCurrency = invoiceCurrencyValue ? invoiceCurrencyValue.split('|')[0].trim() : ''
        const invoiceCurrencyDecimals = invoiceCurrencyValue ? invoiceCurrencyValue.split('|')[1].trim() : ''
        const paymentAddress = inputParametersData.paymentAddress as string
        const paymentCurrencyValue = inputParametersData.paymentCurrency as string
        const paymentCurrency = paymentCurrencyValue ? paymentCurrencyValue.split('|')[0].trim() : ''
        const paymentDueDate = inputParametersData.paymentDueDate as string
        const clientType = inputParametersData.clientType as string
        const existingClient = inputParametersData.existingClient as string
        const buyerInfoEmail = inputParametersData.buyerInfoEmail as string
        const buyerInfoBusinessName = inputParametersData.buyerInfoBusinessName as string
        const buyerInfoFirstName = inputParametersData.buyerInfoFirstName as string
        const buyerInfoLastName = inputParametersData.buyerInfoLastName as string
        const buyerInfoStreetAddress = inputParametersData.buyerInfoStreetAddress as string
        const buyerInfoExtendedAddress = inputParametersData.buyerInfoExtendedAddress as string
        const buyerInfoPostalCode = inputParametersData.buyerInfoPostalCode as string
        const buyerInfoRegion = inputParametersData.buyerInfoRegion as string
        const buyerInfoCountry = inputParametersData.buyerInfoCountry as string
        const buyerInfoTaxRegistration = inputParametersData.buyerInfoTaxRegistration as string
        const invoiceId = inputParametersData.invoiceId as string

        const salaryCurrencyValue = inputParametersData.salaryCurrency as string
        const salaryCurrency = salaryCurrencyValue ? salaryCurrencyValue.split('|')[0].trim() : ''
        const salaryCurrencyDecimals = salaryCurrencyValue ? salaryCurrencyValue.split('|')[1].trim() : ''
        const salaryAmount = inputParametersData.salaryAmount as string
        const salaryPaymentCurrencyValue = inputParametersData.salaryPaymentCurrency as string
        const salaryPaymentCurrency = salaryPaymentCurrencyValue ? salaryPaymentCurrencyValue.split('|')[0].trim() : ''
        const employeeType = inputParametersData.employeeType as string
        const existingEmployee = inputParametersData.existingEmployee as string
        const employeeEmail = inputParametersData.employeeEmail as string
        const employeePaymentAddress = inputParametersData.employeePaymentAddress as string
        const employeeFirstName = inputParametersData.employeeFirstName as string
        const employeeLastName = inputParametersData.employeeLastName as string
        const companyEmail = inputParametersData.companyEmail as string
        const companyBusinessName = inputParametersData.companyBusinessName as string
        const companyFirstName = inputParametersData.companyFirstName as string
        const companyLastName = inputParametersData.companyLastName as string
        const companyStreetAddress = inputParametersData.companyStreetAddress as string
        const companyExtendedAddress = inputParametersData.companyExtendedAddress as string
        const companyPostalCode = inputParametersData.companyPostalCode as string
        const companyRegion = inputParametersData.companyRegion as string
        const companyCountry = inputParametersData.companyCountry as string

        const returnData: ICommonObject[] = []
        let responseData: any

        let url = ''
        let method: Method = 'GET'
        let body: ICommonObject = {}

        if (operation === 'createInvoice') {
            url = 'https://api.request.finance/invoices'
            method = 'POST'

            const invoicesSent = await getNumberOfInvoiceSent(apiKey)
            body.invoiceNumber = (invoicesSent + 1).toString()

            //invoiceItems
            const invoiceItemsArray: any[] = []
            for (let j = 0; j < invoiceItems.length; j += 1) {
                const invoiceItem: ICommonObject = {
                    currency: invoiceCurrency,
                    name: invoiceItems[j].name,
                    quantity: Number(invoiceItems[j].quantity),
                    unitPrice: formatUnitPrice(invoiceItems[j].unitPrice, Number(invoiceCurrencyDecimals))
                }

                if (invoiceItems[j].taxType && invoiceItems[j].taxAmount) {
                    invoiceItem.tax = {
                        type: invoiceItems[j].taxType,
                        amount: invoiceItems[j].taxAmount
                    }
                }
                invoiceItemsArray.push(invoiceItem)
            }
            body.invoiceItems = invoiceItemsArray

            //payment
            if (paymentDueDate) {
                const dueDate = { dueDate: paymentDueDate }
                body.paymentTerms = dueDate
            }
            body.paymentAddress = paymentAddress
            body.paymentCurrency = paymentCurrency

            //buyer
            const buyerInfo: ICommonObject = {}
            if (clientType === 'existing') {
                const client = JSON.parse(existingClient)
                buyerInfo.email = client.email
                if (client.firstName) buyerInfo.firstName = client.firstName
                if (client.lastName) buyerInfo.lastName = client.lastName
                if (client.businessName) buyerInfo.businessName = client.businessName
                if (client.taxRegistration) buyerInfo.taxRegistration = client.taxRegistration

                const buyerAddress = {
                    streetAddress: client.address.streetAddress,
                    extendedAddress: client.address.extendedAddress,
                    postalCode: client.address.postalCode,
                    region: client.address.region,
                    city: client.address.city,
                    country: client.address.country
                }
                buyerInfo.address = buyerAddress
            } else {
                buyerInfo.email = buyerInfoEmail
                if (buyerInfoFirstName) buyerInfo.firstName = buyerInfoFirstName
                if (buyerInfoLastName) buyerInfo.lastName = buyerInfoLastName
                if (buyerInfoBusinessName) buyerInfo.businessName = buyerInfoBusinessName
                if (buyerInfoTaxRegistration) buyerInfo.taxRegistration = buyerInfoTaxRegistration

                const buyerAddress = {
                    streetAddress: buyerInfoStreetAddress || '',
                    extendedAddress: buyerInfoExtendedAddress || '',
                    postalCode: buyerInfoPostalCode || '',
                    region: buyerInfoRegion || '',
                    city: buyerInfoRegion || '',
                    country: buyerInfoCountry || ''
                }
                buyerInfo.address = buyerAddress
            }
            body.buyerInfo = buyerInfo
        }

        if (operation === 'getSingleInvoice') {
            url = `https://api.request.finance/invoices/${invoiceId}`
            method = 'GET'
        }

        if (operation === 'createSalaryPayment') {
            url = 'https://api.request.finance/invoices'
            method = 'POST'
            body.meta = {
                format: 'rnf_salary',
                version: '0.0.3'
            }

            const salarySent = await getNumberOfSalarySent(apiKey)
            body.invoiceNumber = (salarySent + 1).toString()

            //invoiceItems
            const invoiceItem: ICommonObject = {
                currency: salaryCurrency,
                name: 'Salary',
                quantity: 1,
                unitPrice: formatUnitPrice(salaryAmount, Number(salaryCurrencyDecimals))
            }
            body.invoiceItems = [invoiceItem]

            //payment
            const dueDate = { dueDate: moment().endOf('day').toString() }
            body.paymentTerms = dueDate
            body.paymentCurrency = salaryPaymentCurrency

            //seller
            const sellerInfo: ICommonObject = {}
            if (employeeType === 'existing') {
                const employee = JSON.parse(existingEmployee)
                sellerInfo.email = employee.email
                body.paymentAddress = employee.salaryPaymentAddress
                if (employee.firstName) sellerInfo.firstName = employee.firstName
                if (employee.lastName) sellerInfo.lastName = employee.lastName
            } else {
                sellerInfo.email = employeeEmail
                body.paymentAddress = employeePaymentAddress
                if (employeeFirstName) sellerInfo.firstName = employeeFirstName
                if (employeeLastName) sellerInfo.lastName = employeeLastName
            }
            body.sellerInfo = sellerInfo

            //buyer
            const buyerInfo: ICommonObject = {}
            buyerInfo.email = companyEmail
            if (companyFirstName) buyerInfo.firstName = companyFirstName
            if (companyLastName) buyerInfo.lastName = companyLastName
            if (companyBusinessName) buyerInfo.businessName = companyBusinessName

            const buyerAddress = {
                streetAddress: companyStreetAddress || '',
                extendedAddress: companyExtendedAddress || '',
                postalCode: companyPostalCode || '',
                region: companyRegion || '',
                city: companyRegion || '',
                country: companyCountry || ''
            }
            buyerInfo.address = buyerAddress
            body.buyerInfo = buyerInfo
        }

        try {
            const axiosConfig: AxiosRequestConfig = {
                method,
                url,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: apiKey
                }
            }
            if (Object.keys(body).length) axiosConfig.data = body
            const response = await axios(axiosConfig)
            responseData = response.data

            // Convert to on-chain request
            if (operation === 'createInvoice' || operation === 'createSalaryPayment') {
                const invoiceId = responseData.id
                const axiosConfig2: AxiosRequestConfig = {
                    method,
                    url: `https://api.request.finance/invoices/${invoiceId}`,
                    data: body,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: apiKey
                    }
                }
                await axios(axiosConfig2)
            }
        } catch (error) {
            console.error(error.response.data.errors)
            throw handleErrorMessage(error)
        }

        if (Array.isArray(responseData)) {
            returnData.push(...responseData)
        } else {
            returnData.push(responseData)
        }

        return returnNodeExecutionData(returnData)
    }
}

const getNumberOfInvoiceSent = async (apiKey: string) => {
    const axiosConfig: AxiosRequestConfig = {
        method: 'GET',
        url: 'https://api.request.finance/invoices?filterBy=sent&variant=rnf_invoice',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: apiKey
        }
    }
    const response = await axios(axiosConfig)
    return response.data.length || 0
}

const getNumberOfSalarySent = async (apiKey: string) => {
    const axiosConfig: AxiosRequestConfig = {
        method: 'GET',
        url: 'https://api.request.finance/invoices?variant=rnf_salary',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: apiKey
        }
    }
    const response = await axios(axiosConfig)
    return response.data.length || 0
}

const addTrailingZeros = (num: number, totalLength: number) => {
    return Number(String(num).padEnd(totalLength + 1, '0'))
}

const formatUnitPrice = (x: number | string, decimals: number) => {
    return (Number(x) * addTrailingZeros(1, decimals)).toFixed(0)
}

module.exports = { nodeClass: RequestFinance }
