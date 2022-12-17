import { ICommonObject, INode, INodeData, INodeExecutionData, INodeOptionsValue, INodeParams, NodeType } from '../../src/Interface'
import { handleErrorMessage, refreshOAuth2Token, returnNodeExecutionData, serializeQueryParams } from '../../src/utils'
import axios, { AxiosRequestConfig, AxiosRequestHeaders, Method } from 'axios'

class GoogleDocs implements INode {
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

    constructor() {
        this.label = 'GoogleDocs'
        this.name = 'googleDocs'
        this.icon = 'gdocs.svg'
        this.type = 'action'
        this.category = 'Productivity'
        this.version = 1.0
        this.description = 'Execute GoogleDocs operations'
        this.incoming = 1
        this.outgoing = 1

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
                    },
                    {
                        label: 'Get All Values',
                        name: 'getAll',
                        description: 'Get all values from a document'
                    },
                    {
                        label: 'Update a Document',
                        name: 'update',
                        description: 'Update a document'
                    }
                ],
                default: 'create'
            }
        ] as INodeParams[]

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
        ] as INodeParams[]

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
            },
            {
                label: 'Document',
                name: 'documentId',
                type: 'asyncOptions',
                loadMethod: 'getAllDocsFromDrive',
                hide: {
                    'actions.operation': ['create']
                }
            },

            /**
             *  batch update
             */

            {
                label: 'Requests',
                name: 'requests',
                description:
                    "update a document. You can simply add one reequest data or add multiple request data. If request format is invalid, document won't be updated. The details about how to write a request data can be found at https://developers.google.com/docs/api/reference/rest/v1/documents/batchUpdate",
                type: 'json',
                placeholder: `[
                    {
                        "insertText": {
                          "text": "new text",
                            "location": {
                                "index": 1 
                            }
                        }
                    },
                    {
                        "insertTable": {
                            "rows": 3,
                            "columns": 4,
                            "endOfSegmentLocation":{
                            }
                        }
                    }
]`,
                show: {
                    'actions.operation': ['update']
                }
            }
        ] as INodeParams[]
    }

    loadMethods = {
        async getAllDocsFromDrive(nodeData: INodeData): Promise<INodeOptionsValue[]> {
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
                url: `https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.document'`,
                headers
            }

            let maxRetries = 5
            do {
                try {
                    const response = await axios(axiosConfig)
                    const responseData = response.data
                    for (const file of responseData.files || []) {
                        returnData.push({
                            label: file.name as string,
                            name: file.id as string
                        })
                    }
                    return returnData
                } catch (e) {
                    // Access_token expired
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
        const actionsData = nodeData.actions
        const credentials = nodeData.credentials
        const inputParametersData = nodeData.inputParameters

        if (actionsData === undefined) {
            throw new Error('Required data missing!')
        }

        if (credentials === undefined) {
            throw new Error('Missing credential!')
        }

        // Get operation
        const operation = actionsData.operation as string

        // Get credentials
        const token_type = credentials!.token_type as string
        const access_token = credentials!.access_token as string

        const returnData: ICommonObject[] = []
        let responseData: any

        let url = ''
        const queryParameters: ICommonObject = {}
        let queryBody: any = {}
        let method: Method = 'POST'
        const headers: AxiosRequestHeaders = {
            'Content-Type': 'application/json',
            Authorization: `${token_type} ${access_token}`
        }

        const documentId = inputParametersData?.documentId as string

        let maxRetries = 5
        let oAuth2RefreshedData: any = {}

        do {
            try {
                if (operation === 'create') {
                    url = 'https://docs.googleapis.com/v1/documents'
                    const documentName = inputParametersData?.documentName as string
                    if (documentName) {
                        queryBody['title'] = documentName
                    }
                } else if (operation === 'getAll') {
                    method = 'GET'
                    url = `https://docs.googleapis.com/v1/documents/${documentId}`
                } else if (operation === 'update') {
                    // batch update
                    url = `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`

                    const requestsString = inputParametersData?.requests as string
                    queryBody['requests'] = JSON.parse(requestsString)
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
                // Access_token expired
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
            throw new Error('Error executing GoogleDocs node. Max retries limit was reached.')
        }

        if (Array.isArray(responseData)) {
            returnData.push(...responseData)
        } else {
            returnData.push(responseData)
        }

        return returnNodeExecutionData(returnData, oAuth2RefreshedData)
    }
}

module.exports = { nodeClass: GoogleDocs }
