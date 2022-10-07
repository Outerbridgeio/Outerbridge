import { ICommonObject, INode, INodeData, INodeExecutionData, INodeParams, NodeType } from '../../src/Interface'
import { returnNodeExecutionData } from '../../src/utils'
import { createTransport } from 'nodemailer'
import SMTPTransport = require('nodemailer/lib/smtp-transport')

class EmailSend implements INode {
    label: string
    name: string
    type: NodeType
    description?: string
    version: number
    icon?: string
    incoming: number
    outgoing: number
    credentials?: INodeParams[]
    inputParameters?: INodeParams[]

    constructor() {
        this.label = 'Send Email'
        this.name = 'emailSend'
        this.icon = 'emailsend.svg'
        this.type = 'action'
        this.version = 1.0
        this.description = 'Send email to single or multiple receipients'
        this.incoming = 1
        this.outgoing = 1
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Email Send Smtp',
                        name: 'emailSendSmtp'
                    }
                ],
                default: 'emailSendSmtp'
            }
        ] as INodeParams[]
        this.inputParameters = [
            {
                label: 'From Email',
                name: 'fromEmail',
                type: 'string',
                default: '',
                description: 'Email address of the sender.'
            },
            {
                label: 'To Email',
                name: 'toEmail',
                type: 'string',
                default: '',
                description: 'Email address of the recipient. Multiple emails can be comma-separated.',
                optional: true
            },
            {
                label: 'CC Email',
                name: 'ccEmail',
                type: 'string',
                default: '',
                description: 'Email address of CC recipient. Multiple emails can be comma-separated.',
                optional: true
            },
            {
                label: 'Subject',
                name: 'subject',
                type: 'string',
                default: '',
                description: 'Subject line of the email.'
            },
            {
                label: 'Body - Plain Text',
                name: 'text',
                type: 'string',
                rows: 5,
                default: '',
                description: 'Plain text message of email.',
                optional: true
            },
            {
                label: 'Body - HTML',
                name: 'html',
                type: 'string',
                rows: 5,
                default: '',
                description: 'HTML text message of email.',
                optional: true
            },
            {
                label: 'Ignore SSL',
                name: 'ignoreSSL',
                type: 'boolean',
                default: false,
                description: 'Send email regardless of SSL validation.',
                optional: true
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
            throw new Error('Missing credentials')
        }

        const fromEmail = inputParametersData.fromEmail as string
        const toEmail = inputParametersData.toEmail as string
        const ccEmail = inputParametersData.ccEmail as string
        const subject = inputParametersData.subject as string
        const text = inputParametersData.text as string
        const html = inputParametersData.html as string
        const ignoreSSL = inputParametersData.ignoreSSL as boolean

        const connectionOptions: SMTPTransport.Options = {
            host: credentials.host as string,
            port: credentials.port as number,
            secure: credentials.secure as boolean
        }

        if (credentials.user || credentials.password) {
            connectionOptions.auth = {
                user: credentials.user as string,
                pass: credentials.password as string
            }
        }

        if (ignoreSSL) {
            connectionOptions.tls = {
                rejectUnauthorized: false
            }
        }

        const transporter = createTransport(connectionOptions)

        const mailOptions = {
            from: fromEmail,
            to: toEmail,
            cc: ccEmail,
            subject,
            text,
            html
        }

        const info = await transporter.sendMail(mailOptions)

        const returnData: ICommonObject[] = []

        if (Array.isArray(info)) {
            returnData.push(...info)
        } else {
            returnData.push(info as unknown as ICommonObject)
        }

        return returnNodeExecutionData(returnData)
    }
}

module.exports = { nodeClass: EmailSend }
