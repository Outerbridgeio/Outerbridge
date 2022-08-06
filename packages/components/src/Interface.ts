import { Request } from 'express';
import { CronJob } from 'cron';
import { ObjectId } from 'mongodb';

/**
 * Databases
 */
export interface IWorkflow {
	_id: ObjectId;
    shortId: string;
    name: string;
    flowData: string;
    deployed: boolean;
    updatedDate: Date;
    createdDate: Date;
}

export interface IExecution {
	_id: ObjectId;
    shortId: string;
    workflowShortId: string;
    executionData: string;
    state: ExecutionState;
    createdDate: Date;
    stoppedDate?: Date;
}

export interface ICredential {
	_id: ObjectId;
    name: string;
    nodeCredentialName: string;
    credentialData: string;
    updatedDate: Date;
    createdDate: Date;
}

export interface IWebhook {
    _id: ObjectId;
    workflowShortId: string;
    webhookEndpoint: string;
    httpMethod: WebhookMethod;
    clientId: string;
    webhookId: string;
    nodeId: string;
    updatedDate: Date;
    createdDate: Date;
}

export interface IContract {
    _id: ObjectId;
    name: string;
	abi: string;
	address: string;
	network: string;
    providerCredential: string;
	updatedDate: Date;
    createdDate: Date;
}

export interface IWallet {
    _id: ObjectId;
    name: string;
	address: string;
	network: string;
    providerCredential: string;
    walletCredential: string;
	updatedDate: Date;
    createdDate: Date;
}


/**
 * Types
 */
export type ExecutionState = 'INPROGRESS' | 'FINISHED' | 'ERROR' | 'TERMINATED' |'TIMEOUT';

export type WebhookMethod = 'GET' | 'POST';
 
export type NodeType = 'action' | 'webhook' | 'trigger';

export type NodeParamsType = 'asyncOptions' | 'options' | 'string' | 'number' | 'array' | 'boolean' | 'password' | 'json' | 'code' | 'date' | 'file';

export type DbCollectionName = 'Contract' | 'Webhook' | 'Workflow' | 'Credential' | 'Execution' | 'Wallet';

export type CommonType = string | number | boolean | undefined | null;

/**
 * Others
 */
export type IDbCollection = {
    [key in DbCollectionName]: any[];
};

export interface ICommonObject {
	[key: string]: CommonType | ICommonObject | CommonType[] | ICommonObject[];
}

export interface IAttachment {
    content: string,
    contentType: string,
    size?: number;
    filename?: string
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
    /*
     * Only used on credentialMethod option to hide registeredCredentials
     * For example: noAuth
    */
    hideRegisteredCredential?: boolean 
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
    loadFromDbCollections?: DbCollectionName[];
	optional?: boolean | INodeDisplay;
    show?: INodeDisplay;
    hide?: INodeDisplay;
    rows?: number;
    placeholder?: string;
}

export interface INodeExecutionData {
	[key: string]:  CommonType | CommonType[] | ICommonObject | ICommonObject[];
}

export interface IWebhookNodeExecutionData {
    data: INodeExecutionData;
	response?: any;
}

export interface INodeDisplay {
	[key: string]: string[] | string;
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
        [key: string]: (nodeData: INodeData, dbCollection?: IDbCollection) => Promise<INodeOptionsValue[]>;
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
    loadFromDbCollections?: DbCollectionName[]; // method to load async options
    
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
		filter?: any
	}
}
