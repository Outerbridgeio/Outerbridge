import { ICommonObject, INode, INodeData, INodeExecutionData, INodeOptionsValue, INodeParams, NodeType } from '../../src/Interface'
import { handleErrorMessage, returnNodeExecutionData } from '../../src/utils'
import axios, { AxiosRequestConfig, Method } from 'axios'
import FormData from 'form-data'

class HuggingFace implements INode {
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
        this.label = 'Hugging Face'
        this.name = 'huggingFace'
        this.icon = 'huggingface.png'
        this.type = 'action'
        this.category = 'Artificial Intelligence'
        this.version = 1.0
        this.description = 'Execute HuggingFace Inference API'
        this.incoming = 1
        this.outgoing = 1
        this.actions = [
            {
                label: 'Category',
                name: 'category',
                type: 'options',
                options: [
                    {
                        label: 'Image Classification',
                        name: 'image-classification'
                    },
                    {
                        label: 'Feature Extraction',
                        name: 'feature-extraction'
                    },
                    {
                        label: 'Object Detection',
                        name: 'object-detection'
                    },
                    {
                        label: 'Text Classification',
                        name: 'text-classification'
                    }
                ]
            },
            {
                label: 'Model',
                name: 'model',
                type: 'asyncOptions',
                loadMethod: 'listModels'
            },
            {
                label: 'Image File',
                name: 'imageFile',
                type: 'file',
                show: {
                    'actions.category': ['image-classification', 'object-detection']
                }
            },
            {
                label: 'Input Text',
                name: 'inputText',
                type: 'string',
                rows: 5,
                show: {
                    'actions.category': ['feature-extraction', 'text-classification']
                }
            },
            {
                label: 'Inference Endpoint',
                name: 'inferenceURL',
                type: 'string',
                optional: true,
                description: 'If this is not specify, the default free URL with limited usage will be used'
            }
        ] as INodeParams[]
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'HuggingFace Access Token',
                        name: 'huggingFaceAccessToken'
                    }
                ],
                default: 'huggingFaceAccessToken'
            }
        ] as INodeParams[]
    }

    loadMethods = {
        async listModels(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []
            const actionsData = nodeData.actions
            if (actionsData === undefined) return returnData
            const category = actionsData.category as string
            try {
                const axiosConfig: AxiosRequestConfig = {
                    method: 'GET' as Method,
                    url: `https://huggingface.co/api/models?filter=${category}&sort=downloads&direction=-1&limit=30`,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                }

                const response = await axios(axiosConfig)
                const models = response.data

                for (let i = 0; i < models.length; i += 1) {
                    const splitedModel = models[i].id.split('/')
                    const modelName = splitedModel.length > 1 ? splitedModel[1] : splitedModel[0]
                    const modelAuthor = splitedModel.length > 1 ? splitedModel[0] : 'HuggingFace'

                    const data = {
                        label: modelName,
                        name: models[i].id,
                        description: `${modelAuthor} (${models[i].downloads} downloads)`
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
        const credentials = nodeData.credentials
        const actionsData = nodeData.actions

        if (actionsData === undefined) {
            throw new Error('Required data missing')
        }

        if (credentials === undefined) {
            throw new Error('Missing credential')
        }

        let responseData: any

        const returnData: ICommonObject[] = []
        const model = actionsData.model as string
        const imageFile = actionsData.imageFile as string
        const inputText = actionsData.inputText as string
        const inferenceURL = actionsData.inferenceURL as string

        const url = inferenceURL || `https://api-inference.huggingface.co/models/${model}`

        if (inputText) {
            const data = { inputs: inputText } as any
            try {
                const axiosConfig: AxiosRequestConfig = {
                    method: 'POST' as Method,
                    url,
                    data,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        Authorization: `Bearer ${credentials!.accessToken}`
                    }
                }
                const response = await axios(axiosConfig)
                responseData = response.data
            } catch (error) {
                throw handleErrorMessage(error)
            }
        } else if (imageFile) {
            const splitDataURI = imageFile.split(',')

            const filename = (splitDataURI.pop() || 'filename:').split(':')[1]
            const bf = Buffer.from(splitDataURI.pop() || '', 'base64')

            const formData = new FormData()
            formData.append('file', bf, filename)

            try {
                const axiosConfig: AxiosRequestConfig = {
                    method: 'POST' as Method,
                    url,
                    data: bf,
                    headers: {
                        Authorization: `Bearer ${credentials!.accessToken}`
                    }
                }
                const response = await axios(axiosConfig)
                responseData = response.data
            } catch (error) {
                throw handleErrorMessage(error)
            }
        }

        if (Array.isArray(responseData)) {
            returnData.push(...responseData)
        } else {
            returnData.push(responseData)
        }

        return returnNodeExecutionData(returnData)
    }
}

module.exports = { nodeClass: HuggingFace }
