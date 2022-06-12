import { Request } from 'express';
import { CronJob } from 'cron';

export type NodeType = 'action' | 'webhook' | 'trigger';

export type NodeParamsType = 'asyncOptions' | 'options' | 'string' | 'number' | 'array' | 'boolean';

export declare type CommonType = string | number | boolean | undefined | null;

export interface ICommonObject {
	[key: string]: CommonType | ICommonObject | CommonType[] | ICommonObject[];
}

export interface INodeOptionsValue {
    label: string;
    name: string;
    description?: string;
    parentGroup?: string;
    inputParameters?: string;
    exampleParameters?: string;
    outputResponse?: string;
    exampleResponse?: ICommonObject;
    show?: INodeDisplay;
    hide?: INodeDisplay;
}

export interface INodeParams {
    label: string;
	name: string;
	type: NodeParamsType;
	default?: CommonType | ICommonObject | ICommonObject[];
    description?: string;
	options?: Array<INodeOptionsValue>;
    array?: Array<INodeParams>;
    loadMethod?: string;
    loadFromDbCollection?: string;
	optional?: boolean;
    show?: INodeDisplay;
    hide?: INodeDisplay;
    rows?: number;
}

export interface INodeExecutionData {
	[key: string]: ICommonObject | ICommonObject[];
}

export interface IWebhookNodeExecutionData {
    data: INodeExecutionData;
	response?: any;
}

export interface INodeDisplay {
	[key: string]: string[];
}

export interface INodeProperties {
    label: string;
    name: string;
    type: NodeType;
    description?: string;
    version: number;
	icon?: string;
    incoming: number;
	outgoing: number;
}

export interface INode extends INodeProperties {
    actions?: INodeParams[];
    credentials?: INodeParams[];
    networks?: INodeParams[];
    inputParameters?: INodeParams[];
    loadMethods?: {
        [key: string]: (nodeData: INodeData) => Promise<INodeOptionsValue[]>;
    };
    webhookMethods?: {
		createWebhook: (nodeData: INodeData, webhookFullUrl: string) => Promise<string | undefined>;
        deleteWebhook: (nodeData: INodeData, webhookId: string) => Promise<boolean>;
	};
    run?(nodeData: INodeData): Promise<INodeExecutionData[] | null>;
    runTrigger?(nodeData: INodeData): Promise<void>;
    removeTrigger?(nodeData: INodeData): Promise<void>;
    runWebhook?(nodeData: INodeData): Promise<IWebhookNodeExecutionData[] | null>;
}

export interface INodeData extends INodeProperties {
    nodeId: string;
    workflowShortId?: string;
    emitEventKey?: string; // event emitter key for triggers
    
    actions?: ICommonObject
    credentials?: ICommonObject
    networks?: ICommonObject
    inputParameters?: ICommonObject;

    loadMethod?: string; // method to load async options
    
    req?: Request; // For webhook
    webhookEndpoint?: string; // For webhook
}

export interface INodeCredential {
    name: string;
    description?: string;
    version: number;
    credentials: INodeParams[];
}

export interface ICronJobs {
	[key: string]: CronJob[];
}

export interface IProviders {
	[key: string]: {
		provider: any,
		filter: any
	}
}
