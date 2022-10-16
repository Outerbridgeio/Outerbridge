import { ICommonObject, INode, INodeData, INodeExecutionData, INodeParams, NodeType } from '../../src/Interface'
import { handleErrorMessage, returnNodeExecutionData, serializeQueryParams } from '../../src/utils'
import axios, { AxiosRequestConfig, Method } from 'axios'

class Typeform implements INode {
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
    inputParameters?: INodeParams[]

    constructor() {
        this.label = 'Typeform'
        this.name = 'typeform'
        this.icon = 'typeform-icon.svg'
        this.type = 'action'
        this.version = 1.0
        this.description = 'Perform Typeform operations'
        this.incoming = 1
        this.outgoing = 1

        this.actions = [
            {
                label: 'API',
                name: 'api',
                type: 'options',
                options: [
                    {
                        label: 'Get all forms',
                        name: 'getAllForms',
                        description: 'Returns all the forms associated with your account'
                    },
                    {
                        label: 'Get Typeform Responses',
                        name: 'getTypeformResponses',
                        description: 'Returns the submissions for your typeforms in JSON format'
                    },
                    {
                        label: 'Create Typeform ',
                        name: 'createTypeform',
                        description: 'Creates a typeform for you'
                    }
                ],
                default: 'getAllForms'
            }
        ] as INodeParams[]

        this.credentials = [
            // credentialMethod is mandatory field
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Typeform API Key',
                        name: 'typeformApi'
                    }
                ],
                default: 'typeformApi'
            }
        ] as INodeParams[]
        this.inputParameters = [
            {
                label: 'Form Id',
                name: 'formId',
                type: 'string',
                description: 'The form id to retrieve all the responses to your typeform',
                show: {
                    'actions.api': ['getTypeformResponses']
                }
            },
            {
                label: 'Request Body',
                name: 'requestBody',
                type: 'json',
                description: 'The json object to create or update your typeform',
                show: {
                    'actions.api': ['createTypeform']
                }
            }
        ] as INodeParams[]
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        // function to start running the node
        const actionData = nodeData.actions
        const inputParametersData = nodeData.inputParameters
        const credentials = nodeData.credentials

        if (actionData === undefined || inputParametersData === undefined || credentials === undefined) {
            throw new Error('Required data missing')
        }
        // GET api
        const api = actionData.api as string
        // GET credentials
        const apiKey = credentials.apiKey as string
        // GET formId
        const formId = inputParametersData.formId as string
        let requestBody = inputParametersData.requestBody as string
        requestBody = requestBody ? requestBody.replace(/\s/g, '') : requestBody
        const returnData: ICommonObject[] = []
        let responseData: any
        if (api === 'getAllForms') {
            try {
                const queryParameters = {}

                let url = `https://api.typeform.com/forms`

                const axiosConfig: AxiosRequestConfig = {
                    method: 'GET' as Method,
                    url,
                    params: queryParameters,
                    paramsSerializer: (params) => serializeQueryParams(params),
                    headers: { 'Content-Type': 'application/json', authorization: `bearer ${apiKey}` }
                }
                const response = await axios(axiosConfig)
                responseData = response.data
            } catch (error) {
                throw handleErrorMessage(error)
            }
            if (Array.isArray(responseData)) returnData.push(...responseData)
            else returnData.push(responseData)
            return returnNodeExecutionData(returnData)
        } else if (api === 'getTypeformResponses') {
            try {
                const queryParameters = {}

                let url = `https://api.typeform.com/forms/${formId}/responses`

                const axiosConfig: AxiosRequestConfig = {
                    method: 'GET' as Method,
                    url,
                    params: queryParameters,
                    paramsSerializer: (params) => serializeQueryParams(params),
                    headers: { 'Content-Type': 'application/json', authorization: `bearer ${apiKey}` }
                }
                const response = await axios(axiosConfig)
                responseData = response.data
            } catch (error) {
                throw handleErrorMessage(error)
            }
            if (Array.isArray(responseData)) returnData.push(...responseData)
            else returnData.push(responseData)
            return returnNodeExecutionData(returnData)
        } else if (api === 'createTypeform') {
            try {
                const body = JSON.parse(requestBody)
                let url = `https://api.typeform.com/forms`

                const axiosConfig: AxiosRequestConfig = {
                    method: 'POST' as Method,
                    url,
                    data: Object.assign({}, body),
                    headers: { 'Content-Type': 'application/json; charset=utf-8', authorization: `bearer ${apiKey}` }
                }
                const response = await axios(axiosConfig)
                responseData = response.data
            } catch (error) {
                throw handleErrorMessage(error)
            }
            if (Array.isArray(responseData)) returnData.push(...responseData)
            else returnData.push(responseData)
            return returnNodeExecutionData(returnData)
        }
        return returnNodeExecutionData(returnData)
    }
}
module.exports = { nodeClass: Typeform }
