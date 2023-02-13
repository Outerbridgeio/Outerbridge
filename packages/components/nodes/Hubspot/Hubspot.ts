import { ICommonObject, INode, INodeData, INodeExecutionData, INodeOptionsValue, INodeParams, NodeType } from '../../src/Interface'
import { handleErrorMessage, returnNodeExecutionData } from '../../src/utils'
import axios, { AxiosRequestConfig, Method } from 'axios'

class Hubspot implements INode {
    label: string
    name: string
    type: NodeType
    description: string
    version: number
    icon: string
    category: string
    incoming: number
    outgoing: number
    actions: INodeParams[]
    credentials?: INodeParams[]
    networks?: INodeParams[]
    inputParameters?: INodeParams[]

    constructor() {
        this.label = 'Hubspot'
        this.name = 'hubspot'
        this.icon = 'hubspot.svg'
        this.type = 'action'
        this.category = 'Communication'
        this.version = 2.0
        this.description = 'Execute Hubspot API integration'
        this.incoming = 1
        this.outgoing = 1
        this.actions = [
            {
                label: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        label: 'Create new contact',
                        name: 'addContact',
                        description: 'Create a new contact'
                    },
                    {
                        label: 'Get contact',
                        name: 'getContact',
                        description: 'Get a contact details'
                    },
                    {
                        label: 'Delete contact',
                        name: 'deleteContact',
                        description: 'Delete a contact'
                    },
                    {
                        label: 'Get list of contacts',
                        name: 'listContacts',
                        description: 'Get a list of contact details'
                    }
                ]
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
                        label: 'Hubspot Credentials',
                        name: 'hubspotCredential'
                    }
                ],
                default: 'hubspotCredential'
            }
        ] as INodeParams[]
        this.inputParameters = [
            {
                label: 'Customer Email',
                name: 'email',
                type: 'string',
                show: {
                    'actions.operation': ['addContact']
                }
            },
            {
                label: 'Customer First Name',
                name: 'firstname',
                type: 'string',
                optional: true,
                show: {
                    'actions.operation': ['addContact']
                }
            },
            {
                label: 'Customer Last Name',
                name: 'lastname',
                type: 'string',
                optional: true,
                show: {
                    'actions.operation': ['addContact']
                }
            },
            {
                label: 'Customer Company',
                name: 'company',
                type: 'string',
                optional: true,
                show: {
                    'actions.operation': ['addContact']
                }
            },
            {
                label: 'Contact',
                name: 'contactId',
                type: 'asyncOptions',
                loadMethod: 'getContacts',
                show: {
                    'actions.operation': ['getContact', 'deleteContact']
                }
            }
        ] as INodeParams[]
    }

    loadMethods = {
        async getContacts(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []
            const credentials = nodeData.credentials
            const accessToken = credentials!.accessToken as string

            if (!accessToken) return returnData

            try {
                const axiosConfig: AxiosRequestConfig = {
                    method: 'GET' as Method,
                    url: `https://api.hubapi.com/crm/v3/objects/contacts`,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
                const response = await axios(axiosConfig)
                const contacts = response.data?.results

                contacts.forEach((contact: any) => {
                    const data = {
                        label: contact.properties.email,
                        name: contact.id
                    } as INodeOptionsValue
                    returnData.push(data)
                })
                return returnData
            } catch (e) {
                return returnData
            }
        }
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        const actionData = nodeData.actions
        const credentials = nodeData.credentials
        const inputParametersData = nodeData.inputParameters

        if (actionData === undefined) {
            throw handleErrorMessage({ message: 'Required data missing' })
        }

        if (credentials === undefined) {
            throw new Error('Missing credential!')
        }

        const accessToken = credentials.accessToken as string
        const operation = actionData.operation as string

        async function makeApiCall(method: string, url: string, operation: string, body?: ICommonObject): Promise<any[]> {
            const axiosConfig: AxiosRequestConfig = {
                method: method as Method,
                url,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
            if (method === 'post' && body) axiosConfig.data = body
            let responseData: any[] = []
            try {
                const response = await axios(axiosConfig)
                if (response?.data) {
                    responseData.push(response?.data)
                }
            } catch (err) {
                if (operation === 'addContact' && err.response.data.message.includes('Contact already exists')) {
                    responseData.push(err.response.data)
                    // dont throw error
                } else throw handleErrorMessage(err)
            }
            return responseData
        }

        let returnData: ICommonObject[] = []
        let url = `https://api.hubapi.com/crm/v3/objects`
        const contactId = inputParametersData?.contactId as string

        if (operation === 'listContacts') {
            returnData = await makeApiCall('get', `${url}/contacts`, operation)
        } else if (operation === 'getContact') {
            returnData = await makeApiCall('get', `${url}/contacts/${contactId}`, operation)
        } else if (operation === 'deleteContact') {
            returnData = await makeApiCall('delete', `${url}/contacts/${contactId}`, operation)
        } else if (operation === 'addContact') {
            const email = inputParametersData?.email as string
            const firstname = inputParametersData?.firstname as string
            const lastname = inputParametersData?.lastname as string
            const company = inputParametersData?.company as string

            const body = {
                properties: {
                    email
                }
            } as any

            if (firstname) body.properties.firstname = firstname
            if (lastname) body.properties.lastname = lastname
            if (company) body.properties.company = company

            const createContactResponse = await makeApiCall('post', `${url}/contacts`, operation, body)
            if (createContactResponse[0].message && createContactResponse[0].message.includes('Contact already exists')) {
                const listContactsResponse = await makeApiCall('get', `${url}/contacts`, operation)
                const contacts = listContactsResponse[0].results || []
                const findContact = contacts.find((contact: any) => contact.properties.email === email)
                if (findContact) return returnNodeExecutionData(findContact)
            }
            returnData = createContactResponse
        }

        return returnNodeExecutionData(returnData)
    }
}
module.exports = { nodeClass: Hubspot }
