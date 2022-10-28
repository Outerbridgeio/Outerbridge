import { ICommonObject, INode, INodeData, INodeParams, IWebhookNodeExecutionData, NodeType } from '../../src/Interface'
import { returnWebhookNodeExecutionData, handleErrorMessage } from '../../src/utils'
import axios, { AxiosRequestConfig, Method } from 'axios'

class TypeformWebhook implements INode {
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
        this.label = 'Typeform Webhook'
        this.name = 'typeformWebhook'
        this.icon = 'typeform-webhook.svg'
        this.type = 'webhook'
        this.version = 1.0
        this.description = 'Once workflow deployed then when user submit form then webhooks triggred and send response'
        this.incoming = 0
        this.outgoing = 1
        this.actions = [
            {
                label: 'Event',
                name: 'webhook_type',
                type: 'options',
                options: [
                    {
                        label: 'Typeform Submission',
                        name: 'typeformSubmission',
                        description: 'Triggered anytime form typeform submit a response sent through typeform webhook.'
                    }
                ],
                default: 'typeformSubmission'
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
                        label: 'Typeform Access Token',
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
                description: 'The form id to retrieve all the webhooks of typeform',
                show: {
                    'actions.webhook_type': ['typeformSubmission']
                }
            },
            {
                label: 'Webhook Tag',
                name: 'tag',
                type: 'string',
                description: 'The name you want to use for your webhook',
                show: {
                    'actions.webhook_type': ['typeformSubmission']
                }
            }
        ] as INodeParams[]
    }
    webhookMethods = {
        async createWebhook(nodeData: INodeData, webhookFullUrl: string): Promise<string | undefined> {
            // check for the webhooks

            const credentials = nodeData.credentials
            const inputParametersData = nodeData.inputParameters
            const actionsData = nodeData.actions

            if (inputParametersData === undefined || actionsData === undefined) {
                throw handleErrorMessage({ message: 'Required data missing' })
            }
            if (credentials === undefined) {
                throw handleErrorMessage({ message: 'Missing credentials' })
            }
            const accesToken = credentials.accessToken as string
            const tag = inputParametersData?.tag
            const formId = inputParametersData?.formId
            let webhookExist: boolean = false
            let webhookId: string = ''

            if (!accesToken) throw handleErrorMessage({ message: 'Access token required' })
            if (!tag) throw handleErrorMessage({ message: 'Tag is required' })
            if (!formId) throw handleErrorMessage({ message: 'FormId is required' })

            const axiosConfig: AxiosRequestConfig = {
                method: 'GET' as Method,
                url: `https://api.typeform.com/forms/${formId}/webhooks/${tag}
                `,
                headers: { Authorization: `Bearer ${accesToken}` }
            }
            try {
                const res = await axios(axiosConfig)
                console.log(res,'webhook already present')
                if (Object.keys(res).length) {
                    webhookId = res?.data?.id
                    webhookExist = true
                }
            }catch(err){
                console.log(err);
            }
                if (!webhookExist) {
                    const axiosConfig: AxiosRequestConfig = {
                        method: 'PUT' as Method,
                        url: `https://api.typeform.com/forms/${formId}/webhooks/${tag}
                        `,
                        headers: { Authorization: `Bearer ${accesToken}` },
                        data: {
                            enabled: true,
                            url: webhookFullUrl
                        }
                    }
                    try {
                        const res = await axios(axiosConfig)
                        console.log(res,'after creating webhook')
                        webhookId = res?.data?.id
                    } catch (err) {
                        console.log(err);
                        return
                        // throw handleErrorMessage(err)
                    }
                }
                
            return webhookId
        },
        async deleteWebhook(nodeData: INodeData, webhookId: string): Promise<boolean> {
            // delete webhook
            console.log(webhookId,'delete webhook')
            const credentials = nodeData.credentials
            const inputParametersData = nodeData.inputParameters
            const actionsData = nodeData.actions

            if (inputParametersData === undefined || actionsData === undefined) {
                throw handleErrorMessage({ message: 'Required data missing' })
            }
            if (credentials === undefined) {
                throw handleErrorMessage({ message: 'Missing credentials' })
            }
            const accesToken = credentials.accessToken as string
            const tag = inputParametersData?.tag
            const formId = inputParametersData?.formId
            const axiosConfig: AxiosRequestConfig = {
                method: 'DELETE' as Method,
                url: `https://api.typeform.com/forms/${formId}/webhooks/${tag}
                `,
                headers: { Authorization: `Bearer ${accesToken}` }
            }
            try{
                await axios(axiosConfig);
            }catch(err){
                    return false;
            }
            return true
        }
    }

    async runWebhook(nodeData: INodeData): Promise<IWebhookNodeExecutionData[] | null> {
        const inputParametersData = nodeData.inputParameters
        const req = nodeData.req
        console.log(req,inputParametersData, 'this is from runWebhook')
        // if (inputParametersData === undefined) {
        //     throw new Error('Required data missing');
        // }
        // if (req === undefined) {
        //     throw new Error('Missing request');
        // }

        const returnData: ICommonObject[] = [{ name: 'utkarsh' }]
        // returnData.push({
        //     headers: req?.headers,
        //     params: req?.params,
        //     query: req?.query,
        //     body: req?.body,
        //     rawBody: (req as any).rawBody,
        //     url: req?.url
        // });
        return returnWebhookNodeExecutionData(returnData)
    }
}
module.exports = { nodeClass: TypeformWebhook }
