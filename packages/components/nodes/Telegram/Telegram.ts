import { ICommonObject, INode, INodeData, INodeExecutionData, INodeParams, NodeType } from '../../src/Interface';
import { handleErrorMessage, returnNodeExecutionData, serializeQueryParams } from '../../src/utils';
import axios, { AxiosRequestConfig, Method } from 'axios';

class Telegram implements INode {
    label: string;
    name: string;
    type: NodeType;
    description: string;
    version: number;
    icon: string;
    incoming: number;
    outgoing: number;
    inputParameters: INodeParams[];
    credentials: INodeParams[];
    constructor() {
        this.label = 'Telegram';
        this.name = 'telegram';
        this.icon = 'telegram.svg';
        this.type = 'action';
        this.version = 1.0;
        this.description = 'Perform Telegram operations';
        this.incoming = 1;
        this.outgoing = 1;
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Telegram Bot Token',
                        name: 'telegramApi'
                    }
                ],
                placeholder: 'eg: 1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHI',
                default: ''
            }
        ] as INodeParams[];
        this.inputParameters = [
            {
                label: 'Channel ID',
                name: 'channelID',
                type: 'string',
                placeholder: 'eg: MyAwesomeChannel',
                default: '',
                description:
                    'Your channel ID. <a target="_blank" href="https://www.youtube.com/watch?v=gk_tPOY1TDM">See how to how to add bot in your channel.</a>',
                optional: true
            },
            {
                label: 'Content',
                description: 'Message contents (up to 2000 characters)',
                name: 'content',
                type: 'string',
                default: ''
            }
        ];
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        const inputParametersData = nodeData.inputParameters;
        const credentials = nodeData.credentials;

        if (inputParametersData === undefined || credentials === undefined) {
            throw new Error('Required data missing');
        }
        const botToken = credentials.botToken as string;
        const channelID = inputParametersData.channelID as string;
        const content = inputParametersData.content as string;
        const returnData: ICommonObject[] = [];
        try {
            const response = await axios.get(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=@${channelID}&text=${content}`);
            returnData.push(response.data);
        } catch (error) {
            throw handleErrorMessage(error);
        }

        return returnNodeExecutionData(returnData);
    }
}
module.exports = { nodeClass: Telegram };
