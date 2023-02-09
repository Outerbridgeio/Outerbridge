import { CronJob } from 'cron'
import { ICronJobs, INode, INodeData, INodeOptionsValue, INodeParams, NodeType } from '../../src/Interface'
import { handleErrorMessage, returnNodeExecutionData } from '../../src/utils'
import EventEmitter from 'events'
import axios, { AxiosRequestConfig, AxiosRequestHeaders, Method } from 'axios'
import moment from 'moment'

class RequestFinanceTrigger extends EventEmitter implements INode {
    label: string
    name: string
    type: NodeType
    description?: string
    version: number
    icon: string
    category: string
    incoming: number
    outgoing: number
    actions?: INodeParams[]
    credentials?: INodeParams[]
    inputParameters?: INodeParams[]
    cronJobs: ICronJobs

    constructor() {
        super()
        this.label = 'Request Finance Trigger'
        this.name = 'requestFinanceTrigger'
        this.icon = 'requestFinance.svg'
        this.type = 'trigger'
        this.category = 'Accounting'
        this.version = 1.0
        this.description = 'Start workflow whenever receive new invoice or invoice status has changed'
        this.incoming = 0
        this.outgoing = 1
        this.cronJobs = {}
        this.actions = [
            {
                label: 'Invoice Status',
                name: 'invoiceStatus',
                type: 'options',
                options: [
                    {
                        label: 'New',
                        name: 'new',
                        description: 'Trigger workflow when new invoice received'
                    },
                    {
                        label: 'Accepted',
                        name: 'accepted',
                        description: 'The invoice has been approved by the buyer.'
                    },
                    {
                        label: 'Declared Paid',
                        name: 'declaredPaid',
                        description:
                            'The buyer declared the invoice as paid. The seller has to confirm before the invoice can move into the paid status. This is necessary for currencies, where the Request Network does not yet support payment detection.'
                    },
                    {
                        label: 'Paid',
                        name: 'paid',
                        description: 'Seller has confirmed and marked the invoice as paid, i.e: the buyer paid the invoice.'
                    },
                    {
                        label: 'Canceled',
                        name: 'canceled',
                        description: 'The seller canceled the invoice.'
                    },
                    {
                        label: 'Rejected',
                        name: 'rejected',
                        description: 'The buyer rejected the invoice.'
                    }
                ],
                default: '',
                description: 'Status of an invoice'
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
                label: 'Select Invoice',
                name: 'invoiceType',
                type: 'options',
                options: [
                    {
                        label: 'Retrieve from existing invoices',
                        name: 'existingInvoice'
                    },
                    {
                        label: 'Custom invoice ID',
                        name: 'customInvoice'
                    }
                ],
                hide: {
                    'actions.invoiceStatus': ['new']
                }
            },
            {
                label: 'Invoice ID',
                name: 'invoiceId',
                type: 'string',
                placeholder: '63e2c662d24445b79ada9c3d',
                hide: {
                    'actions.invoiceStatus': ['new']
                },
                show: {
                    'inputParameters.invoiceType': ['customInvoice']
                }
            },
            {
                label: 'Invoice',
                name: 'invoiceId',
                type: 'asyncOptions',
                loadMethod: 'getInvoices',
                hide: {
                    'actions.invoiceStatus': ['new']
                },
                show: {
                    'inputParameters.invoiceType': ['existingInvoice']
                }
            },
            {
                label: 'Polling Time',
                name: 'pollTime',
                type: 'options',
                description: 'How often should we keep checking the invoice status',
                options: [
                    {
                        label: 'Every 15 secs',
                        name: '15s'
                    },
                    {
                        label: 'Every 30 secs',
                        name: '30s'
                    },
                    {
                        label: 'Every 1 min',
                        name: '1min'
                    },
                    {
                        label: 'Every 5 min',
                        name: '5min'
                    },
                    {
                        label: 'Every 10 min',
                        name: '10min'
                    }
                ],
                default: '30s'
            }
        ] as INodeParams[]
    }

    loadMethods = {
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
                    url: `https://api.request.finance/invoices?variant=rnf_invoice`,
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
                        label: `#${invoice.invoiceNumber} (${moment(invoice.creationDate).format('MMMM D, YYYY')})`,
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

    async runTrigger(nodeData: INodeData): Promise<void> {
        const inputParametersData = nodeData.inputParameters
        const actionData = nodeData.actions
        const credentials = nodeData.credentials

        if (actionData === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing')
        }
        if (credentials === undefined) {
            throw new Error('Missing credentials!')
        }

        // Get API key
        const apiKey = credentials.apiKey as string

        // Get Invoice
        const invoiceId = inputParametersData.invoiceId as string
        const invoiceStatus = actionData.invoiceStatus as string

        let url = ''
        const method: Method = 'GET'
        const headers: AxiosRequestHeaders = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: apiKey
        }

        const emitEventKey = nodeData.emitEventKey as string
        const pollTime = (inputParametersData?.pollTime as string) || '30s'
        const cronTimes: string[] = []

        if (pollTime === '15s') {
            cronTimes.push(`*/15 * * * * *`)
        } else if (pollTime === '30s') {
            cronTimes.push(`*/30 * * * * *`)
        } else if (pollTime === '1min') {
            cronTimes.push(`*/1 * * * *`)
        } else if (pollTime === '5min') {
            cronTimes.push(`*/5 * * * *`)
        } else if (pollTime === '10min') {
            cronTimes.push(`*/10 * * * *`)
        }

        async function getInvoiceStatusAPI() {
            url = `https://api.request.finance/invoices/${invoiceId}`
            const axiosConfig: AxiosRequestConfig = {
                method,
                url,
                headers
            }
            return await axios(axiosConfig)
        }

        async function getReceivedInvoices() {
            url = `https://api.request.finance/invoices?filterBy=received&variant=rnf_invoice&status=open`
            const axiosConfig: AxiosRequestConfig = {
                method,
                url,
                headers
            }
            return await axios(axiosConfig)
        }

        let lastInvoicesAmount = 0

        try {
            // Get initial data
            if (invoiceStatus === 'new') {
                const response = await getReceivedInvoices()
                const invoices = response.data || []
                lastInvoicesAmount = invoices.length
            }

            // Trigger when cron job hits
            const executeTrigger = async () => {
                if (invoiceStatus === 'new') {
                    const newResponse = await getReceivedInvoices()
                    const newResponseData = newResponse.data || []
                    const newInvoicesAmount = newResponseData.length

                    if (newInvoicesAmount > lastInvoicesAmount) {
                        const differenceAmount = newInvoicesAmount - lastInvoicesAmount
                        const returnData = []
                        for (let i = 0; i < differenceAmount; i += 1) {
                            returnData.push(newResponseData[i])
                        }
                        lastInvoicesAmount = newInvoicesAmount
                        this.emit(emitEventKey, returnNodeExecutionData(returnData))
                    }
                } else {
                    const newResponse = await getInvoiceStatusAPI()
                    const newResponseData = newResponse.data

                    if (newResponseData.status === invoiceStatus) {
                        this.emit(emitEventKey, returnNodeExecutionData(newResponseData))
                    }
                }
            }

            // Start the cron-jobs
            if (Object.prototype.hasOwnProperty.call(this.cronJobs, emitEventKey)) {
                for (const cronTime of cronTimes) {
                    // Automatically start the cron job
                    this.cronJobs[emitEventKey].push(new CronJob(cronTime, executeTrigger, undefined, true))
                }
            } else {
                for (const cronTime of cronTimes) {
                    // Automatically start the cron job
                    this.cronJobs[emitEventKey] = [new CronJob(cronTime, executeTrigger, undefined, true)]
                }
            }
        } catch (e) {
            throw handleErrorMessage(e)
        }
    }

    async removeTrigger(nodeData: INodeData): Promise<void> {
        const emitEventKey = nodeData.emitEventKey as string

        if (Object.prototype.hasOwnProperty.call(this.cronJobs, emitEventKey)) {
            const cronJobs = this.cronJobs[emitEventKey]
            for (const cronJob of cronJobs) {
                cronJob.stop()
            }
            this.removeAllListeners(emitEventKey)
        }
    }
}

module.exports = { nodeClass: RequestFinanceTrigger }
