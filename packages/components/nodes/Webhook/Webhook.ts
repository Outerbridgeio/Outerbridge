import {
    ICommonObject,
	INode, 
    INodeData, 
    INodeParams, 
    IWebhookNodeExecutionData, 
    NodeType,
} from '../../src/Interface';
import { returnWebhookNodeExecutionData } from '../../src/utils';

class Webhook implements INode {

    label: string;
    name: string;
    type: NodeType;
    description?: string;
    version: number;
	icon?: string;
    incoming: number;
	outgoing: number;
    inputParameters?: INodeParams[];

	constructor() {

		this.label = 'Webhook';
		this.icon = 'webhook.svg';
		this.name = 'webhook';
		this.type = 'webhook';
		this.version = 1.0;
		this.description = 'Start workflow when webhook is called';
		this.incoming = 0;
        this.outgoing = 1;
		this.inputParameters = [
			{
				label: 'HTTP Method',
				name: 'httpMethod',
				type: 'options',
				options: [
					{
						label: 'GET',
						name: 'GET',
					},
					{
						label: 'POST',
						name: 'POST',
					},
				],
				default: 'GET',
				description: 'The HTTP method to listen to.',
			},
			{
				label: 'Response Code',
				name: 'responseCode',
				type: 'number',
				default: 200,
				description: 'The HTTP response code to return when a HTTP request is made to this endpoint URL. Valid range: 1XX - 5XX',
			},
			{
				label: 'Response Data',
				name: 'responseData',
				type: 'string',
				default: '',
				description: 'Custom response data to return when a HTTP request is made to this endpoint URL',
				optional: true
			},
		];
	};

	async runWebhook(nodeData: INodeData): Promise<IWebhookNodeExecutionData[] | null> {

		const inputParametersData = nodeData.inputParameters;
		const req = nodeData.req;
	
        if (inputParametersData === undefined) {
            throw new Error('Required data missing');
        }

		if (req === undefined) {
            throw new Error('Missing request');
        }

		const responseData = inputParametersData.responseData as string || '';
		
		const returnData: ICommonObject[] = [];

		returnData.push({
			headers: req?.headers,
			params: req?.params,
			query: req?.query,
			body: req?.body,
			rawBody: (req as any).rawBody,
			url: req?.url
		});

		return returnWebhookNodeExecutionData(returnData, responseData);
	}
}

module.exports = { nodeClass: Webhook }