import { ICommonObject, INode, INodeData, INodeExecutionData, INodeParams, NodeType } from '../../src/Interface'
import { handleErrorMessage, returnNodeExecutionData } from '../../src/utils'
import axios, { AxiosRequestConfig, Method } from 'axios'

class DallE implements INode {
    label: string
    name: string
    type: NodeType
    description: string
    version: number
    icon: string
    category: string
    incoming: number
    outgoing: number
    credentials?: INodeParams[]
    inputParameters?: INodeParams[]

    constructor() {
        this.label = 'Dall-E'
        this.name = 'dallE'
        this.icon = 'dalle.png'
        this.type = 'action'
        this.category = 'Artificial Intelligence'
        this.version = 1.0
        this.description = 'Generate image via Dall-E'
        this.incoming = 1
        this.outgoing = 1
        this.credentials = [
            {
                label: 'Authorization',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Bearer Token Auth',
                        name: 'httpBearerTokenAuth',
                        description:
                            'Go to https://labs.openai.com/. Open Network Tab in Developer Tools. Type a promt and press "Generate". Look for fetch to https://labs.openai.com/api/labs/tasks. In the request header look for authorization then get the Bearer Token.'
                    }
                ],
                default: 'httpBearerTokenAuth'
            }
        ] as INodeParams[]
        this.inputParameters = [
            {
                label: 'Image Description',
                name: 'description',
                type: 'string',
                default: '',
                placeholder: 'photograph of an astronaut riding a horse',
                description: 'Description of the image you want to generated via Dall-E'
            }
        ] as INodeParams[]
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        const inputParametersData = nodeData.inputParameters
        const credentials = nodeData.credentials

        if (inputParametersData === undefined) {
            throw new Error('Required data missing')
        }

        if (credentials === undefined) {
            throw new Error('Missing credential')
        }

        const returnData: ICommonObject[] = []

        const description = inputParametersData.description as string

        let responseData: any
        const url = 'https://labs.openai.com/api/labs'

        try {
            const axiosConfig: AxiosRequestConfig = {
                method: 'POST' as Method,
                url: `${url}/tasks`,
                data: {
                    task_type: 'text2im',
                    prompt: {
                        caption: description,
                        batch_size: 4
                    }
                },
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: `Bearer ${credentials!.token}`
                }
            }

            const response = await axios(axiosConfig)
            responseData = response.data

            const promise = (taskId: string) => {
                let data: ICommonObject = {}
                return new Promise((resolve, reject) => {
                    const timeout = setInterval(async () => {
                        const axiosConfig: AxiosRequestConfig = {
                            method: 'GET' as Method,
                            url: `${url}/tasks/${taskId}`,
                            headers: {
                                'Content-Type': 'application/json; charset=utf-8',
                                Authorization: `Bearer ${credentials!.token}`
                            }
                        }
                        const response = await axios(axiosConfig)
                        data = response.data

                        if (data.status === 'succeeded') {
                            clearInterval(timeout)
                            resolve(data)
                        } else if (data.status === 'rejected') {
                            clearInterval(timeout)
                            reject(new Error(`Error generating image: ${data.status_information}`))
                        }
                    }, 2000)
                })
            }

            responseData = await promise(responseData.id || '')
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

module.exports = { nodeClass: DallE }
