import { ObjectId } from 'mongodb'
import {
    ICommonObject,
    INode as INodeComponent,
    INodeCredential,
    INodeData,
    INodeExecutionData,
    IWebhookNodeExecutionData
} from 'outerbridge-components'
import EventEmitter from 'events'

/**
 * Databases
 */
export interface IWorkflow {
    _id: ObjectId
    shortId: string
    name: string
    flowData: string
    deployed: boolean
    updatedDate: Date
    createdDate: Date
}

export interface IExecution {
    _id: ObjectId
    shortId: string
    workflowShortId: string
    executionData: string
    state: ExecutionState
    createdDate: Date
    stoppedDate?: Date
}

export interface ICredential {
    _id: ObjectId
    name: string
    nodeCredentialName: string
    credentialData: string
    updatedDate: Date
    createdDate: Date
}

export interface IWebhook {
    _id: ObjectId
    workflowShortId: string
    webhookEndpoint: string
    httpMethod: WebhookMethod
    webhookId: string
    nodeId: string
    updatedDate: Date
    createdDate: Date
}

export interface IContract {
    _id: ObjectId
    name: string
    abi: string
    address: string
    network: string
    providerCredential: string
    updatedDate: Date
    createdDate: Date
}

export interface IWallet {
    _id: ObjectId
    name: string
    address: string
    network: string
    providerCredential: string
    walletCredential: string
    updatedDate: Date
    createdDate: Date
}

/**
 * Types
 */
export type ExecutionState = 'INPROGRESS' | 'FINISHED' | 'ERROR' | 'TERMINATED' | 'TIMEOUT'

export type WebhookMethod = 'GET' | 'POST'

/**
 * Others
 */
export interface IWorkflowResponse extends IWorkflow {
    execution: IExecution
    executionCount: number
}

export interface INode extends INodeComponent {
    filePath: string
}

export interface ITriggerNode extends EventEmitter, INodeComponent {
    filePath: string
}

export interface IWebhookNode extends INodeComponent {
    filePath: string
}

export interface IComponentNodesPool {
    [key: string]: INode | ITriggerNode
}

export interface IActiveTestTriggerPool {
    [key: string]: INodeData
}

export interface IActiveTestWebhookPool {
    [key: string]: {
        nodes: IReactFlowNode[]
        edges: IReactFlowEdge[]
        nodeData: INodeData
        webhookNodeId: string
        clientId: string
        isTestWorkflow: boolean
        webhookId?: string
    }
}

export interface ICredentialBody {
    name: string
    nodeCredentialName: string
    credentialData: ICredentialDataDecrypted
}

export interface ICredentialResponse {
    _id: ObjectId
    name: string
    credentialData: ICredentialDataDecrypted
    nodeCredentialName: string
    updatedDate: Date
    createdDate: Date
}

export type ICredentialDataDecrypted = ICommonObject

export interface IComponentCredentialsPool {
    [key: string]: INodeCredential
}

export interface IWalletResponse extends IWallet {
    balance: string
}

export interface IVariableDict {
    [key: string]: string
}

export interface INodeDependencies {
    [key: string]: number
}

export interface INodeDirectedGraph {
    [key: string]: string[]
}

export interface IWorkflowExecutedData {
    nodeLabel: string
    nodeId: string
    data: INodeExecutionData[] | IWebhookNodeExecutionData[]
    status?: ExecutionState
}

export interface ITestNodeBody {
    nodeId: string
    nodes: IReactFlowNode[]
    edges: IReactFlowEdge[]
    clientId?: string
}

export interface IDeployedWorkflowsPool {
    [key: string]: {
        emitEventKey?: string
        abortController?: AbortController
        workflowExecutedData?: IWorkflowExecutedData[]
    }
}

export interface IChildProcessMessage {
    key: string
    value?: any
}

export interface IReactFlowNode {
    id: string
    position: {
        x: number
        y: number
    }
    type: string
    data: INodeData
    positionAbsolute: {
        x: number
        y: number
    }
    z: number
    handleBounds: {
        source: any
        target: any
    }
    width: number
    height: number
    selected: boolean
    dragging: boolean
}

export interface IReactFlowEdge {
    source: string
    sourceHandle: string
    target: string
    targetHandle: string
    type: string
    id: string
    data: {
        label: string
    }
}

export interface IReactFlowObject {
    nodes: IReactFlowNode[]
    edges: IReactFlowEdge[]
    viewport: {
        x: number
        y: number
        zoom: number
    }
}

export interface IRunWorkflowMessageValue {
    startingNodeIds: string[]
    componentNodes: IComponentNodesPool
    reactFlowNodes: IReactFlowNode[]
    reactFlowEdges: IReactFlowEdge[]
    graph: INodeDirectedGraph
    workflowExecutedData: IWorkflowExecutedData[]
}

export interface IContractRequestBody {
    credentials: ICommonObject
    networks: ICommonObject
    contractInfo: ICommonObject
}

export interface IWalletRequestBody {
    name: string
    network: string
    providerCredential?: string
    privateKey?: string
}

export interface IOAuth2Response {
    access_token: string
    token_type: string
    expires_in: number
    refresh_token: string
}

export interface IExploredNode {
    [key: string]: {
        remainingLoop: number
        lastSeenDepth: number
    }
}

export interface INodeQueue {
    nodeId: string
    depth: number
}

export type ITestWorkflowBody = ITestNodeBody
