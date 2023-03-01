import { ICommonObject, INode, INodeData, INodeExecutionData, INodeOptionsValue, INodeParams, NodeType } from '../../src/Interface'
import { handleErrorMessage, returnNodeExecutionData } from '../../src/utils'
import axios, { AxiosRequestConfig, Method } from 'axios'

class OpenAI implements INode {
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
        this.label = 'OpenAI'
        this.name = 'openAI'
        this.icon = 'openai.png'
        this.type = 'action'
        this.category = 'Artificial Intelligence'
        this.version = 1.0
        this.description = 'ChatGPT, image generation or text completion from prompt via OpenAI API'
        this.incoming = 1
        this.outgoing = 1
        this.actions = [
            {
                label: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        label: 'ChatGPT',
                        name: 'chatgpt'
                    },
                    {
                        label: 'Generate Image via text prompt',
                        name: 'generateImage'
                    },
                    {
                        label: 'Generate Text Completion via text prompt',
                        name: 'textCompletion'
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
                        label: 'OpenAI API Key',
                        name: 'openAIApi'
                    }
                ],
                default: 'openAIApi'
            }
        ] as INodeParams[]
        this.inputParameters = [
            {
                label: 'Model',
                name: 'model',
                type: 'asyncOptions',
                loadMethod: 'listModels',
                description: 'AI model to use.',
                default: 'text-davinci-003',
                show: {
                    'actions.operation': ['textCompletion']
                }
            },
            {
                label: 'Model',
                name: 'model',
                type: 'options',
                options: [
                    {
                        label: 'gpt-3.5-turbo',
                        name: 'gpt-3.5-turbo'
                    },
                    {
                        label: 'gpt-3.5-turbo-0301',
                        name: 'gpt-3.5-turbo-0301'
                    }
                ],
                description: 'ChatGPT model to use.',
                default: 'gpt-3.5-turbo',
                show: {
                    'actions.operation': ['chatgpt']
                }
            },
            {
                label: 'Text Prompt',
                name: 'prompt',
                type: 'string',
                default: '',
                placeholder: 'Write me a 250 words essay on fish',
                description: 'The prompt for chatpgt',
                show: {
                    'actions.operation': ['chatgpt']
                }
            },
            {
                label: 'Text Prompt',
                name: 'prompt',
                type: 'string',
                default: '',
                placeholder: 'Say this is a test',
                description: 'The prompt to generate completions for',
                show: {
                    'actions.operation': ['textCompletion']
                }
            },
            {
                label: 'Image Description',
                name: 'prompt',
                type: 'string',
                default: '',
                placeholder: 'Photograph of an astronaut riding a horse',
                description: 'Description of the image you want to generated. The maximum length is 1000 characters.',
                show: {
                    'actions.operation': ['generateImage']
                }
            },
            {
                label: 'Image Number',
                name: 'imageNumber',
                type: 'number',
                placeholder: '1',
                default: '1',
                description: 'The number of images to generate. Must be between 1 and 10.',
                optional: true,
                show: {
                    'actions.operation': ['generateImage']
                }
            },
            {
                label: 'Image Size',
                name: 'imageSize',
                type: 'options',
                description: 'The size of the generated images.',
                options: [
                    {
                        label: '256x256',
                        name: '256x256'
                    },
                    {
                        label: '512x512',
                        name: '512x512'
                    },
                    {
                        label: '1024x1024',
                        name: '1024x1024'
                    }
                ],
                optional: true,
                default: '1024x1024',
                show: {
                    'actions.operation': ['generateImage']
                }
            },
            {
                label: 'Response Format',
                name: 'response_format',
                type: 'options',
                description: 'The format in which the generated images are returned.',
                options: [
                    {
                        label: 'url',
                        name: 'url'
                    },
                    {
                        label: 'b64_json',
                        name: 'b64_json'
                    }
                ],
                default: 'url',
                optional: true,
                show: {
                    'actions.operation': ['generateImage']
                }
            }
        ] as INodeParams[]
    }

    loadMethods = {
        async listModels(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = []
            const credentials = nodeData.credentials

            if (credentials === undefined) return returnData

            try {
                const axiosConfig: AxiosRequestConfig = {
                    method: 'GET' as Method,
                    url: `https://api.openai.com/v1/models`,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        Authorization: `Bearer ${credentials!.apiKey}`
                    }
                }

                const response = await axios(axiosConfig)
                const responseData = response.data
                const models = responseData.data

                for (let i = 0; i < models.length; i += 1) {
                    const data = {
                        label: models[i].id,
                        name: models[i].id
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
        const inputParametersData = nodeData.inputParameters
        const credentials = nodeData.credentials
        const actionssData = nodeData.actions

        if (inputParametersData === undefined || actionssData === undefined) {
            throw new Error('Required data missing')
        }

        if (credentials === undefined) {
            throw new Error('Missing credential')
        }

        const returnData: ICommonObject[] = []
        const operation = actionssData.operation as string
        const model = inputParametersData.model as string
        const prompt = inputParametersData.prompt as string
        const imageNumber = inputParametersData.imageNumber as string
        const imageSize = inputParametersData.imageSize as string
        const response_format = inputParametersData.response_format as string

        let responseData: any
        let url = ''
        switch (operation) {
            case 'generateImage':
                url = 'https://api.openai.com/v1/images/generations'
                break
            case 'textCompletion':
                url = 'https://api.openai.com/v1/completions'
                break
            case 'chatgpt':
                url = 'https://api.openai.com/v1/chat/completions'
                break
        }
        const data = { prompt } as any
        if (imageNumber) data.n = parseInt(imageNumber, 10)
        if (imageSize) data.size = imageSize
        if (response_format) data.response_format = response_format
        if (model) data.model = model

        if (operation === 'chatgpt') {
            delete data.prompt
            data.temperature = 0.8
            data.top_p = 1.0
            data.presence_penalty = 1.0
            data.messages = [
                {
                    role: 'system',
                    content: `You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible. Current date: ${
                        new Date().toISOString().split('T')[0]
                    }`
                },
                { role: 'user', content: prompt }
            ]
        }

        try {
            const axiosConfig: AxiosRequestConfig = {
                method: 'POST' as Method,
                url,
                data,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: `Bearer ${credentials!.apiKey}`
                }
            }
            const response = await axios(axiosConfig)
            responseData = response.data
        } catch (error) {
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

module.exports = { nodeClass: OpenAI }
