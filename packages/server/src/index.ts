
import express, { Express, Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import localtunnel from 'localtunnel';
import { ObjectId } from 'mongodb';
import { Server, Socket } from "socket.io";
import http from "http";
import { ethers } from 'ethers';

import { AppDataSource } from "./DataSource";
import { NodesPool } from "./NodesPool";
import { Workflow } from "./entity/Workflow";
import { Execution } from "./entity/Execution";
import { Credential } from "./entity/Credential";
import { Webhook } from './entity/Webhook';
import { Contract } from './entity/Contract';
import { Wallet } from './entity/Wallet';

import { 
    IComponentCredentialsPool, 
    IComponentNodesPool, 
    IContractRequestBody, 
    ICredentialBody, 
    ICredentialDataDecrpyted, 
    ICredentialResponse, 
    IOAuth2Response, 
    IReactFlowEdge, 
    IReactFlowNode, 
    IReactFlowObject, 
    ITestNodeBody, 
    ITestWorkflowBody, 
    ITriggerNode, 
    IWalletRequestBody, 
    IWalletResponse, 
    IWebhookNode, 
    IWorkflowExecutedData, 
    IWorkflowResponse, 
    WebhookMethod
} from "./Interface";
import { 
    INodeData,
    INodeOptionsValue,
    IDbCollection,
    etherscanAPIs,
    nativeCurrency,
    NETWORK,
    INodeExecutionData,
    INode,
} from "outerbridge-components";
import { CredentialsPool } from './CredentialsPool';
import { 
    decryptCredentialData, 
    getEncryptionKey, 
    processWebhook, 
    decryptCredentials, 
    resolveVariables, 
    transformToCredentialEntity, 
    constructGraphsAndGetStartingNodes,
    encryptCredentialData,
    getOAuth2HTMLPath,
    checkOAuth2TokenRefreshed,
    constructGraphs,
    testWorkflow,
    getNodeModulesPackagePath
} from './utils';
import { DeployedWorkflowPool } from './DeployedWorkflowPool';
import { ActiveTestTriggerPool } from './ActiveTestTriggerPool';
import { ActiveTestWebhookPool } from './ActiveTestWebhookPool';
import axios, { AxiosRequestConfig, Method } from 'axios';

export class App {

    app: express.Application;
    componentNodes: IComponentNodesPool = {};
    componentCredentials: IComponentCredentialsPool = {};
    deployedWorkflowsPool: DeployedWorkflowPool;
    activeTestTriggerPool: ActiveTestTriggerPool;
    activeTestWebhookPool: ActiveTestWebhookPool;
    
    constructor() {
		this.app = express();
    }

    async initDatabase() {
        // Initialize database
        AppDataSource
        .initialize()
        .then( async() => {
            console.log("📦[server]: Data Source has been initialized!");

            // Initialize localtunnel
            if (process.env.ENABLE_TUNNEL === 'true') {
                
                const port = parseInt(process.env.PORT || '', 10) || 3000;
                const newTunnel = await localtunnel({ port });
                process.env.TUNNEL_BASE_URL = `${newTunnel.url}/`;

                console.log('🌐[server]: TUNNEL_BASE_URL = ', process.env.TUNNEL_BASE_URL);
            }

            // Initialize node instances
            const nodesPool = new NodesPool();
            await nodesPool.initialize();
            this.componentNodes = nodesPool.componentNodes;

            
            // Initialize credential instances
            const credsPool = new CredentialsPool();
            await credsPool.initialize();
            this.componentCredentials = credsPool.componentCredentials;


            // Initialize deployed worklows instances
            this.deployedWorkflowsPool = new DeployedWorkflowPool();
            await this.deployedWorkflowsPool.initialize(AppDataSource, this.componentNodes);


            // Initialize activeTestTriggerPool instance
            this.activeTestTriggerPool = new ActiveTestTriggerPool();


            // Initialize activeTestWebhookPool instance
            this.activeTestWebhookPool = new ActiveTestWebhookPool();
            
        })
        .catch((err) => {
            console.error("❌[server]: Error during Data Source initialization:", err);
        });
    }

    async config(io: Server) {
    
        // Limit is needed to allow sending/receiving base64 encoded string 
        this.app.use(express.json({limit: '50mb'}));
        this.app.use(express.urlencoded({limit: '50mb'}));

        // Allow access from ui when yarn run dev
        if (process.env.NODE_ENV !== 'production') {
            this.app.use(cors({credentials: true, origin: 'http://localhost:8080'}));
        }
        
        // ----------------------------------------
        // Workflows
        // ----------------------------------------

        // Get all workflows
        this.app.get("/api/v1/workflows", async (req: Request, res: Response) => {
            const workflows: IWorkflowResponse[] = await AppDataSource.getMongoRepository(Workflow).aggregate(
                [
                    {
                        $lookup: { 
                            from: "execution", 
                            localField: "shortId", 
                            foreignField: "workflowShortId",
                            as: "execution"
                        }
                    },
                    {
                        $addFields: {
                            executionCount: {
                                $size: "$execution"
                            }
                        }
                    }
                ]
            ).toArray();
            return res.json(workflows);
        });

        // Get specific workflow via shortId
        this.app.get("/api/v1/workflows/:shortId", async (req: Request, res: Response) => {
            const workflows: IWorkflowResponse[] = await AppDataSource.getMongoRepository(Workflow)
            .aggregate(
                [
                    {
                        $match: {
                            shortId: req.params.shortId,
                        }
                    },
                    {
                        $lookup: { 
                            from: "execution", 
                            localField: "shortId", 
                            foreignField: "workflowShortId",
                            as: "execution"
                        }
                    },
                    {
                        $addFields: {
                            executionCount: {
                                $size: "$execution"
                            }
                        }
                    }
                ]
            ).toArray();
            if (workflows.length) return res.json(workflows[0]);
            return res.status(404).send(`Workflow ${req.params.shortId} not found`);
        });

        // Create new workflow
        this.app.post("/api/v1/workflows", async (req: Request, res: Response) => {
            const body = req.body;
            const newWorkflow = new Workflow();
            Object.assign(newWorkflow, body);

            const workflow = await AppDataSource.getMongoRepository(Workflow).create(newWorkflow);
            const results = await AppDataSource.getMongoRepository(Workflow).save(workflow);
            const returnWorkflows: IWorkflowResponse[] = await AppDataSource.getMongoRepository(Workflow)
            .aggregate(
                [
                    {
                        $match: {
                            shortId: results.shortId,
                        }
                    },
                    {
                        $lookup: { 
                            from: "execution", 
                            localField: "shortId", 
                            foreignField: "workflowShortId",
                            as: "execution"
                        }
                    },
                    {
                        $addFields: {
                            executionCount: {
                                $size: "$execution"
                            }
                        }
                    }
                ]
            ).toArray();
            if (returnWorkflows.length) return res.json(returnWorkflows[0]);
            return res.status(404).send(`Workflow ${results.shortId} not found`);
        });

        // Update workflow
        this.app.put("/api/v1/workflows/:shortId", async (req: Request, res: Response) => {
            const workflow = await AppDataSource.getMongoRepository(Workflow).findOneBy({
                shortId: req.params.shortId,
            });

            if (!workflow) {
                res.status(404).send(`Workflow ${req.params.shortId} not found`);
                return;
            }

            // If workflow is deployed, remove from deployedWorkflowsPool, then add it again for new changes to be picked up 
            if (workflow.deployed && workflow.flowData) {
                try {
                    const flowDataString = workflow.flowData;
                    const flowData: IReactFlowObject = JSON.parse(flowDataString);
                    const reactFlowNodes = flowData.nodes as IReactFlowNode[];
                    const reactFlowEdges = flowData.edges as IReactFlowEdge[];
                    const workflowShortId = workflow.shortId;

                    const response = constructGraphsAndGetStartingNodes(res, reactFlowNodes, reactFlowEdges);
                    if (response === undefined) return;

                    const { graph, startingNodeIds } = response;

                    await this.deployedWorkflowsPool.remove(
                        startingNodeIds, 
                        reactFlowNodes, 
                        this.componentNodes, 
                        workflowShortId
                    );
                } catch(e) {
                    return res.status(500).send(e);
                }
            }

            const body = req.body;
            const updateWorkflow = new Workflow();
            Object.assign(updateWorkflow, body);

            AppDataSource.getMongoRepository(Workflow).merge(workflow, updateWorkflow);
            const results = await AppDataSource.getMongoRepository(Workflow).save(workflow);
            const returnWorkflows: IWorkflowResponse[] = await AppDataSource.getMongoRepository(Workflow)
            .aggregate(
                [
                    {
                        $match: {
                            shortId: results.shortId,
                        }
                    },
                    {
                        $lookup: { 
                            from: "execution", 
                            localField: "shortId", 
                            foreignField: "workflowShortId",
                            as: "execution"
                        }
                    },
                    {
                        $addFields: {
                            executionCount: {
                                $size: "$execution"
                            }
                        }
                    }
                ]
            ).toArray();
            if (returnWorkflows.length) {
                const returnWorkflow = returnWorkflows[0];
                if (returnWorkflow.deployed && returnWorkflow.flowData) {
                    try {
                        const flowData: IReactFlowObject = JSON.parse(returnWorkflow.flowData);
                        const reactFlowNodes = flowData.nodes as IReactFlowNode[];
                        const reactFlowEdges = flowData.edges as IReactFlowEdge[];
                        const workflowShortId = returnWorkflow.shortId;

                        const response = constructGraphsAndGetStartingNodes(res, reactFlowNodes, reactFlowEdges);
                        if (response === undefined) return;

                        const { graph, startingNodeIds } = response;
                        await this.deployedWorkflowsPool.add(
                            startingNodeIds, 
                            graph, 
                            reactFlowNodes, 
                            this.componentNodes, 
                            workflowShortId,
                            this.activeTestTriggerPool,
                            this.activeTestWebhookPool
                        );
                    } catch(e) {
                        return res.status(500).send(e);
                    }
                }
                return res.json(returnWorkflow);
            }
            return res.status(404).send(`Workflow ${results.shortId} not found`);
        });

        // Delete workflow via shortId
        this.app.delete("/api/v1/workflows/:shortId", async (req: Request, res: Response) => {
            const workflow = await AppDataSource.getMongoRepository(Workflow).findOneBy({
                shortId: req.params.shortId,
            });

            if (!workflow) {
                res.status(404).send(`Workflow ${req.params.shortId} not found`);
                return;
            }

            // If workflow is deployed, remove from deployedWorkflowsPool
            if (workflow.deployed && workflow.flowData) {
                try {
                    const flowDataString = workflow.flowData;
                    const flowData: IReactFlowObject = JSON.parse(flowDataString);
                    const reactFlowNodes = flowData.nodes as IReactFlowNode[];
                    const reactFlowEdges = flowData.edges as IReactFlowEdge[];
                    const workflowShortId = workflow.shortId;

                    const response = constructGraphsAndGetStartingNodes(res, reactFlowNodes, reactFlowEdges);
                    if (response === undefined) return;

                    const { graph, startingNodeIds } = response;

                    await this.deployedWorkflowsPool.remove(
                        startingNodeIds, 
                        reactFlowNodes, 
                        this.componentNodes, 
                        workflowShortId
                    );
                } catch(e) {
                    return res.status(500).send(e);
                }
            }
            const results = await AppDataSource.getMongoRepository(Workflow).delete({ shortId: req.params.shortId });
            await AppDataSource.getMongoRepository(Webhook).delete({ workflowShortId: req.params.shortId });
            await AppDataSource.getMongoRepository(Execution).delete({ workflowShortId: req.params.shortId });
            return res.json(results);
        });

        // Deploy/Halt workflow via shortId
        this.app.post("/api/v1/workflows/deploy/:shortId", async (req: Request, res: Response) => {

            const workflow = await AppDataSource.getMongoRepository(Workflow).findOneBy({
                shortId: req.params.shortId,
            });

            if (!workflow) {
                res.status(404).send(`Workflow ${req.params.shortId} not found`);
                return;
            }

            try {    
                const flowDataString = workflow.flowData;
                const flowData: IReactFlowObject = JSON.parse(flowDataString);
                const reactFlowNodes = flowData.nodes as IReactFlowNode[];
                const reactFlowEdges = flowData.edges as IReactFlowEdge[];
                const workflowShortId = req.params.shortId;
                const haltDeploy = req.body?.halt;

                const response = constructGraphsAndGetStartingNodes(res, reactFlowNodes, reactFlowEdges);
                if (response === undefined) return;
                const { graph, startingNodeIds } = response;

                if (!haltDeploy) {
                    await this.deployedWorkflowsPool.add(
                        startingNodeIds, 
                        graph, 
                        reactFlowNodes, 
                        this.componentNodes, 
                        workflowShortId,
                        this.activeTestTriggerPool,
                        this.activeTestWebhookPool
                    );
                } else {
                    await this.deployedWorkflowsPool.remove(
                        startingNodeIds, 
                        reactFlowNodes, 
                        this.componentNodes, 
                        workflowShortId
                    );
                }

                const body = { deployed: haltDeploy ? false : true };
                const updateWorkflow = new Workflow();
                Object.assign(updateWorkflow, body);
            
                AppDataSource.getMongoRepository(Workflow).merge(workflow, updateWorkflow);
                const results = await AppDataSource.getMongoRepository(Workflow).save(workflow);
                const returnWorkflows: IWorkflowResponse[] = await AppDataSource.getMongoRepository(Workflow)
                .aggregate(
                    [
                        {
                            $match: {
                                shortId: results.shortId,
                            }
                        },
                        {
                            $lookup: { 
                                from: "execution", 
                                localField: "shortId", 
                                foreignField: "workflowShortId",
                                as: "execution"
                            }
                        },
                        {
                            $addFields: {
                                executionCount: {
                                    $size: "$execution"
                                }
                            }
                        }
                    ]
                ).toArray();
                if (returnWorkflows.length) return res.json(returnWorkflows[0]);
                return res.status(404).send(`Workflow ${results.shortId} not found`);
            } catch (e) {
                res.status(500).send(`Workflow ${req.params.shortId} deploy error: ${e}`);
                return;
            }
        });

        // Test Workflow from a starting point to end
        this.app.post("/api/v1/workflows/test/:startingNodeId", async (req: Request, res: Response) => {
            const body = req.body as ITestWorkflowBody;
            const nodes = body.nodes || [];
            const edges = body.edges || [];
            const clientId = body.clientId || '';

            const { graph, nodeDependencies } = constructGraphs(nodes, edges);
            const startingNodeId = req.params.startingNodeId;

            const startNode = nodes.find((nd: IReactFlowNode) => nd.id === startingNodeId);

            if (startNode && startNode.data) {

                let nodeData = startNode.data;
                await decryptCredentials(nodeData);
                nodeData = resolveVariables(nodeData, nodes);

                if (!Object.prototype.hasOwnProperty.call(this.componentNodes, nodeData.name)) {
                    res.status(404).send(`Unable to test workflow from node: ${nodeData.name}`);
                    return;
                }

                if (nodeData.type === 'trigger') {
                    const triggerNodeInstance = this.componentNodes[nodeData.name] as ITriggerNode;
                    const emitEventKey = startingNodeId;
                    nodeData.emitEventKey = emitEventKey;

                    triggerNodeInstance.once(emitEventKey, async(result: INodeExecutionData[]) => {
                        await triggerNodeInstance.removeTrigger!.call(triggerNodeInstance, nodeData);
                        await this.activeTestTriggerPool.remove(nodeData.name, this.componentNodes);

                        const newWorkflowExecutedData = {
                            nodeId: startingNodeId,
                            nodeLabel: nodeData.label,
                            data: result,
                            status: 'FINISHED'
                        } as IWorkflowExecutedData;

                        io.to(clientId).emit('testWorkflowNodeResponse', newWorkflowExecutedData);

                        testWorkflow(
                            startingNodeId,
                            nodes,
                            edges,
                            graph,
                            this.componentNodes,
                            clientId,
                            io
                        );
                    });

                    await triggerNodeInstance.runTrigger!.call(triggerNodeInstance, nodeData);
                    this.activeTestTriggerPool.add(nodeData.name, nodeData);
                }
                else if (nodeData.type === 'webhook') {
                    const webhookNodeInstance = this.componentNodes[nodeData.name] as IWebhookNode;
                    const newBody = {
                        webhookEndpoint: nodeData.webhookEndpoint,
                        httpMethod: nodeData.inputParameters?.httpMethod as WebhookMethod || 'POST',
                    } as any;

                    if (webhookNodeInstance.webhookMethods?.createWebhook) {
                        if (!process.env.TUNNEL_BASE_URL) {
                            res.status(500).send(`Please enable tunnel by setting ENABLE_TUNNEL to true in env file`);
                            return;
                        }
                        
                        const webhookFullUrl = `${process.env.TUNNEL_BASE_URL}api/v1/webhook/${nodeData.webhookEndpoint}`;
                        const webhookId = await webhookNodeInstance.webhookMethods?.createWebhook.call(webhookNodeInstance, nodeData, webhookFullUrl);
            
                        if (webhookId !== undefined) {
                            newBody.webhookId = webhookId;
                        }
                    }

                    this.activeTestWebhookPool.add(
                        newBody.webhookEndpoint,
                        newBody.httpMethod,
                        nodes,
                        edges,
                        nodeData,
                        startingNodeId,
                        clientId,
                        true,
                        newBody?.webhookId
                    );
                }
                else if (nodeData.type === 'action') {
                    
                    const actionNodeInstance = this.componentNodes[nodeData.name] as INode;
                    let result = await actionNodeInstance.run!.call(actionNodeInstance, nodeData);
                    checkOAuth2TokenRefreshed(result, nodeData)
                    
                    const newWorkflowExecutedData = {
                        nodeId: startingNodeId,
                        nodeLabel: nodeData.label,
                        data: result,
                        status: 'FINISHED'
                    } as IWorkflowExecutedData;

                    io.to(clientId).emit('testWorkflowNodeResponse', newWorkflowExecutedData);

                    testWorkflow(
                        startingNodeId,
                        nodes,
                        edges,
                        graph,
                        this.componentNodes,
                        clientId,
                        io
                    );
                }
            }
        });

        
        // ----------------------------------------
        // Execution
        // ----------------------------------------

        // Get all executions
        this.app.get("/api/v1/executions", async (req: Request, res: Response) => {
            const executions = await AppDataSource.getMongoRepository(Execution).find();
            return res.json(executions);
        });

        // Get specific execution via shortId
        this.app.get("/api/v1/executions/:shortId", async (req: Request, res: Response) => {
            const results = await AppDataSource.getMongoRepository(Execution).findOneBy({
                shortId: req.params.shortId,
            });
            return res.json(results);
        });

        // Create new execution
        this.app.post("/api/v1/executions", async (req: Request, res: Response) => {
            const body = req.body;
            const newExecution = new Execution();
            Object.assign(newExecution, body);

            const execution = await AppDataSource.getMongoRepository(Execution).create(newExecution);
            const results = await AppDataSource.getMongoRepository(Execution).save(execution);
            return res.json(results);
        });

        // Update execution
        this.app.put("/api/v1/executions/:shortId", async (req: Request, res: Response) => {
            const execution = await AppDataSource.getMongoRepository(Execution).findOneBy({
                shortId: req.params.shortId,
            });

            if (!execution) {
                res.status(404).send(`Execution ${req.params.shortId} not found`);
                return;
            }

            const body = req.body;
            const updateExecution = new Execution();
            Object.assign(updateExecution, body);

            AppDataSource.getMongoRepository(Execution).merge(execution, updateExecution);
            const results = await AppDataSource.getMongoRepository(Execution).save(execution);
            return res.json(results);
        });

        // Delete execution via shortId
        this.app.delete("/api/v1/executions/:shortId", async (req: Request, res: Response) => {
            const results = await AppDataSource.getMongoRepository(Execution).delete({ shortId: req.params.shortId });
            return res.json(results);
        });

        
        // ----------------------------------------
        // Nodes
        // ----------------------------------------

        // Get all component nodes
        this.app.get("/api/v1/nodes", (req: Request, res: Response) => {
            const returnData = [];
            for (const nodeName in this.componentNodes) {
                // Remove certain node properties to avoid error of Converting circular structure to JSON
                const clonedNode = JSON.parse(JSON.stringify(this.componentNodes[nodeName], (key, val) => {
                    if (key !== "cronJobs" && key !== "providers") return val;
                }));
                returnData.push(clonedNode);
            }
            return res.json(returnData);
        });

        // Get specific component node via name
        this.app.get("/api/v1/nodes/:name", (req: Request, res: Response) => {
            if (Object.prototype.hasOwnProperty.call(this.componentNodes, req.params.name)) {
                // Remove certain node properties to avoid error of Converting circular structure to JSON
                const clonedNode = JSON.parse(JSON.stringify(this.componentNodes[req.params.name], (key, val) => {
                    if (key !== "cronJobs" && key !== "providers") return val;
                }));
                return res.json(clonedNode);
            } else {
                throw new Error(`Node ${req.params.name} not found`);
            }
        });

        // Returns specific component node icon via name
        this.app.get("/api/v1/node-icon/:name", (req: Request, res: Response) => {
            if (Object.prototype.hasOwnProperty.call(this.componentNodes, req.params.name)) {
                const nodeInstance = this.componentNodes[req.params.name];
                if (nodeInstance.icon === undefined) {
                    throw new Error(`Node ${req.params.name} icon not found`);
                }
            
                if (nodeInstance.icon.endsWith('.svg') || nodeInstance.icon.endsWith('.png') || nodeInstance.icon.endsWith('.jpg')) {
                    const filepath = nodeInstance.icon;
                    res.sendFile(filepath);
                } else {
                    throw new Error(`Node ${req.params.name} icon is missing icon`);
                }

            } else {
                throw new Error(`Node ${req.params.name} not found`);
            }
        });

        // Test a node
        this.app.post("/api/v1/node-test/:name", async (req: Request, res: Response) => {
            const body: ITestNodeBody = req.body;
            const { nodes, edges, nodeId, clientId } = body;

            const node = nodes.find((nd: IReactFlowNode) => nd.id === nodeId);

            if (!node) return res.status(404).send(`Test node ${nodeId} not found`);

            if (Object.prototype.hasOwnProperty.call(this.componentNodes, req.params.name)) {
                try {
                    const nodeInstance = this.componentNodes[req.params.name];
                    const nodeType = nodeInstance.type;
                    const nodeData = node.data;

                    await decryptCredentials(nodeData);

                    if (nodeType === 'action') {
                        const reactFlowNodeData: INodeData = resolveVariables(nodeData, nodes);
                        let result = await nodeInstance.run!.call(nodeInstance, reactFlowNodeData);
                    
                        checkOAuth2TokenRefreshed(result, reactFlowNodeData)
                    
                        return res.json(result);

                    } else if (nodeType === 'trigger') {
                        const triggerNodeInstance = nodeInstance as ITriggerNode;
                        const emitEventKey = nodeId;
                        nodeData.emitEventKey = emitEventKey;
                        triggerNodeInstance.once(emitEventKey, async(result: INodeExecutionData[]) => {
                            await triggerNodeInstance.removeTrigger!.call(triggerNodeInstance, nodeData);
                            await this.activeTestTriggerPool.remove(nodeData.name, this.componentNodes);
                            return res.json(result);
                        });
                        await triggerNodeInstance.runTrigger!.call(triggerNodeInstance, nodeData);
                        this.activeTestTriggerPool.add(req.params.name, nodeData);
                        
                    } else if (nodeType === 'webhook') {
                        const webhookNodeInstance = nodeInstance as IWebhookNode;
                        const newBody = {
                            webhookEndpoint: nodeData.webhookEndpoint,
                            httpMethod: nodeData.inputParameters?.httpMethod as WebhookMethod || 'POST',
                        } as any;

                        if (webhookNodeInstance.webhookMethods?.createWebhook) {
                            if (!process.env.TUNNEL_BASE_URL) {
                                res.status(500).send(`Please enable tunnel by setting ENABLE_TUNNEL to true in env file`);
                                return;
                            }
                            
                            const webhookFullUrl = `${process.env.TUNNEL_BASE_URL}api/v1/webhook/${nodeData.webhookEndpoint}`;
                            const webhookId = await webhookNodeInstance.webhookMethods?.createWebhook.call(webhookNodeInstance, nodeData, webhookFullUrl);
                
                            if (webhookId !== undefined) {
                                newBody.webhookId = webhookId;
                            }
                        }

                        this.activeTestWebhookPool.add(
                            newBody.webhookEndpoint,
                            newBody.httpMethod,
                            nodes,
                            edges,
                            nodeData,
                            nodeId,
                            clientId as string,
                            false,
                            newBody?.webhookId
                        );

                        return res.json(newBody);
                    }
                } catch (error) {
                    res.status(500).send(`Node test error: ${error}`);
                    console.error(error);
                    return;
                }

            } else {
                res.status(404).send(`Node ${req.params.name} not found`);
                return;
            }
        });

        // load async options
        this.app.post("/api/v1/node-load-method/:name", async (req: Request, res: Response) => {
            const nodeData: INodeData = req.body;

            if (Object.prototype.hasOwnProperty.call(this.componentNodes, req.params.name)) {
                try {
                    const nodeInstance = this.componentNodes[req.params.name];
                    const methodName = nodeData.loadMethod || '';
                    const loadFromDbCollections = nodeData.loadFromDbCollections || [];
                    const dbCollection = {} as IDbCollection;

                    for (let i = 0; i < loadFromDbCollections.length; i+=1) {
                        let collection: any;

                        if (loadFromDbCollections[i] === 'Contract') collection = Contract;
                        else if (loadFromDbCollections[i] === 'Workflow') collection = Workflow;
                        else if (loadFromDbCollections[i] === 'Webhook') collection = Webhook;
                        else if (loadFromDbCollections[i] === 'Execution') collection = Execution;
                        else if (loadFromDbCollections[i] === 'Credential') collection = Credential;
                        else if (loadFromDbCollections[i] === 'Wallet') collection = Wallet;
                        
                        const res = await AppDataSource.getMongoRepository(collection).find();
                        dbCollection[loadFromDbCollections[i]] = res;
                    }

                    await decryptCredentials(nodeData);

                    const returnOptions: INodeOptionsValue[] = await nodeInstance.loadMethods![methodName]!.call(
                        nodeInstance,
                        nodeData,
                        loadFromDbCollections.length ? dbCollection : undefined
                    );

                    return res.json(returnOptions);
                    
                } catch (error) {
                    return res.json([]);
                }

            } else {
                res.status(404).send(`Node ${req.params.name} not found`);
                return;
            }
        });

        
        // ----------------------------------------
        // Credential
        // ----------------------------------------

        // Create new credential
        this.app.post("/api/v1/credentials", async (req: Request, res: Response) => {
            const body: ICredentialBody = req.body;

            const newCredential = await transformToCredentialEntity(body);
            const credential = await AppDataSource.getMongoRepository(Credential).create(newCredential);
            const results = await AppDataSource.getMongoRepository(Credential).save(credential);
            return res.json(results);
        });

        // Get node credential via specific nodeCredentialName
        this.app.get("/api/v1/node-credentials/:nodeCredentialName", (req: Request, res: Response) => {
            const credentials = [];

            for (const credName in this.componentCredentials) {
                credentials.push(this.componentCredentials[credName]);
            }

            const cred = credentials.find((crd) => crd.name === req.params.nodeCredentialName);
            if (cred === undefined) {
                throw new Error(`Credential ${req.params.nodeCredentialName} not found`);
            }
            return res.json(cred);
        });

        // Get list of registered credentials via nodeCredentialName
        this.app.get("/api/v1/credentials", async (req: Request, res: Response) => {
            const credentials = await AppDataSource.getMongoRepository(Credential).find({
                // @ts-ignore
                where: {
                    nodeCredentialName: { $eq: req.query.nodeCredentialName },
                }
            });
            return res.json(credentials);
        });

        // Get registered credential via objectId
        this.app.get("/api/v1/credentials/:id", async (req: Request, res: Response) => {

            const isEncrypted = req.query.isEncrypted;

            const encryptKey = await getEncryptionKey();
        
            const credential = await AppDataSource.getMongoRepository(Credential).findOneBy({
                _id: new ObjectId(req.params.id),
            });

            if (!credential) {
                res.status(404).send(`Credential ${req.params.id} not found`);
                return;
            }

            if (isEncrypted) {
                return res.json(credential);

            } else {
                // Decrpyt credentialData
                const decryptedCredentialData = decryptCredentialData(credential.credentialData, encryptKey);
                const credentialResponse: ICredentialResponse = {
                    ...credential,
                    credentialData: decryptedCredentialData
                }
                return res.json(credentialResponse);
            }
        });

        // Update credential
        this.app.put("/api/v1/credentials/:id", async (req: Request, res: Response) => {
            const credential = await AppDataSource.getMongoRepository(Credential).findOneBy({
                _id: new ObjectId(req.params.id),
            });

            if (!credential) {
                res.status(404).send(`Credential ${req.params.id} not found`);
                return;
            }

            const encryptKey = await getEncryptionKey();
            const decryptedCredentialData = decryptCredentialData(credential.credentialData, encryptKey);

            const body: ICredentialBody = req.body;
            const { credentialData, name, nodeCredentialName } = body;
            const newBody: ICredentialBody = {
                name: name,
                nodeCredentialName: nodeCredentialName,
                credentialData: {
                    ...decryptedCredentialData,
                    ...credentialData
                }
            }
            const updateCredential = await transformToCredentialEntity(newBody);
            
            AppDataSource.getMongoRepository(Credential).merge(credential, updateCredential);
            const results = await AppDataSource.getMongoRepository(Credential).save(credential);
            return res.json(results);
        });

        // Delete credential via id
        this.app.delete("/api/v1/credentials/:id", async (req: Request, res: Response) => {
            const results = await AppDataSource.getMongoRepository(Credential).deleteOne({ _id: new ObjectId(req.params.id) });
            return res.json(results);
        });

        
        // ----------------------------------------
        // Contract
        // ----------------------------------------

        // Get all contracts
        this.app.get("/api/v1/contracts", async (req: Request, res: Response) => {
            const contracts = await AppDataSource.getMongoRepository(Contract).find();
            return res.json(contracts);
        });

        // Get specific contract via id
        this.app.get("/api/v1/contracts/:id", async (req: Request, res: Response) => {
            const results = await AppDataSource.getMongoRepository(Contract).findOneBy({
                _id: new ObjectId(req.params.id),
            });    
            return res.json(results);
        });

        // Create new contract
        this.app.post("/api/v1/contracts", async (req: Request, res: Response) => {
            try {
                const body = req.body;
                const newContract = new Contract();
                Object.assign(newContract, body);

                const contract = await AppDataSource.getMongoRepository(Contract).create(newContract);
                const results = await AppDataSource.getMongoRepository(Contract).save(contract);
                return res.json(results);

            } catch(e) {
                return res.status(500).send(e);
            }
        });

        // Update contract
        this.app.put("/api/v1/contracts/:id", async (req: Request, res: Response) => {
            const contract = await AppDataSource.getMongoRepository(Contract).findOneBy({
                _id: new ObjectId(req.params.id),
            });

            if (!contract) {
                res.status(404).send(`Contract with id: ${req.params.id} not found`);
                return;
            }

            const body = req.body;
            const updateContract = new Contract();
            Object.assign(updateContract, body);

            AppDataSource.getMongoRepository(Contract).merge(contract, updateContract);
            try {
                const results = await AppDataSource.getMongoRepository(Contract).save(contract);
                return res.json(results);
            } catch(e) {
                return res.status(500).send(e);
            }
        });

        // Delete contract via id
        this.app.delete("/api/v1/contracts/:id", async (req: Request, res: Response) => {
            const deletQuery = {
                _id: new ObjectId(req.params.id)
            } as any;
            const results = await AppDataSource.getMongoRepository(Contract).delete(deletQuery);
            return res.json(results);
        });

        // Get contract ABI
        this.app.post("/api/v1/contracts/getabi", async (req: Request, res: Response) => {
            
            const body: IContractRequestBody = req.body;

            if (body.networks === undefined || body.credentials === undefined || body.contractInfo === undefined) {
                res.status(500).send(`Missing contract details`);
                return;
            }

            if (body.credentials && body.credentials.registeredCredential) {
                // @ts-ignore
                const credentialId: string = body.credentials.registeredCredential?._id;

                const credential = await AppDataSource.getMongoRepository(Credential).findOneBy({
                    _id: new ObjectId(credentialId),
                });
                if (!credential) return res.status(404).send(`Credential with id: ${credentialId} not found`);;
                
                const encryptKey = await getEncryptionKey();
                const decryptedCredentialData = decryptCredentialData(credential.credentialData, encryptKey);

                body.credentials = decryptedCredentialData;
            }

            let url = '';
            // Get ABI
            if (body.credentials.apiKey) {
                url = `${body.networks.uri}?module=contract&action=getabi&address=${body.contractInfo.address}&apikey=${body.credentials.apiKey}`;
            } else {
                url = `${body.networks.uri}?module=contract&action=getabi&address=${body.contractInfo.address}`;
            }

            const options: AxiosRequestConfig = {
                method: "GET",
                url
            };

            try {
                const response = await axios.request(options);
                return res.json(response.data);
            } catch (e) {
                console.error(e);
                const errorObject = {
                    status: "0",
                    message: "NOTOK",
                    result: "Unable to fetch ABI, please use correct API Key for higher rate limit"
                }
                return res.json(errorObject);
            }
        });


        // ----------------------------------------
        // Wallets
        // ----------------------------------------

        // Get all wallets
        this.app.get("/api/v1/wallets", async (req: Request, res: Response) => {
            const wallets = await AppDataSource.getMongoRepository(Wallet).find();
            return res.json(wallets);
        });

        // Get specific wallet via id
        this.app.get("/api/v1/wallets/:id", async (req: Request, res: Response) => {
            try {
                const wallet = await AppDataSource.getMongoRepository(Wallet).findOneBy({
                    _id: new ObjectId(req.params.id),
                });

                if (!wallet) {
                    res.status(404).send(`Wallet ${req.params.id} not found`);
                    return;
                }

                const walletResponse: IWalletResponse = {
                    ...wallet,
                    balance: '',
                }
                
                // Decrpyt providerCredential
                const encryptKey = await getEncryptionKey();
                const providerCredential = JSON.parse(wallet.providerCredential);
                let decryptedCredentialData: ICredentialDataDecrpyted = {};

                if (providerCredential.registeredCredential) {
                    // @ts-ignore
                    const credentialId: string = providerCredential.registeredCredential?._id;

                    const credential = await AppDataSource.getMongoRepository(Credential).findOneBy({
                        _id: new ObjectId(credentialId),
                    });
                    if (!credential) return res.status(404).send(`Credential with id: ${credentialId} not found`);;
                    
                    // Decrpyt credentialData
                    decryptedCredentialData = decryptCredentialData(credential.credentialData, encryptKey);
                }

                const credentialMethod = providerCredential.credentialMethod;
                let url = '';
                const network = wallet.network as NETWORK;

                // Get Balance
                if (
                    decryptedCredentialData.apiKey && (
                    credentialMethod === 'etherscanApi' || 
                    credentialMethod === 'polygonscanApi' || 
                    credentialMethod === 'bscscanApi' || 
                    credentialMethod === 'optimisticEtherscanApi' ||
                    credentialMethod === 'arbiscanApi')
                ) {
                    url = `${etherscanAPIs[network]}?module=account&action=balance&address=${wallet.address}&tag=latest&apikey=${decryptedCredentialData.apiKey as string}`;
                
                } else {
                    url = `${etherscanAPIs[network]}?module=account&action=balance&address=${wallet.address}&tag=latest`;
                }

                const options: AxiosRequestConfig = {
                    method: "GET",
                    url
                };

                try {
                    const response = await axios.request(options);
                    if (response.data && response.data.result) {
                        walletResponse.balance = `${ethers.utils.formatEther(ethers.BigNumber.from(response.data.result))} ${nativeCurrency[wallet.network as NETWORK]}`;
                    }
                } catch (e) {
                    walletResponse.balance = 'Unable to fetch balance, please use correct API Key for higher rate limit';
                }
                return res.json(walletResponse);

            } catch (e) {
                console.error(e);
                return res.status(500).send(e);
            }
        });

        // Create new wallet
        this.app.post("/api/v1/wallets", async (req: Request, res: Response) => {
            try {
                const body: IWalletRequestBody = req.body;
                const { name, network, providerCredential, privateKey } = body;

                const encryptKey = await getEncryptionKey();

                const newBody: any = {
                    name,
                    network,
                    providerCredential
                };

                let randomWallet: ethers.Wallet;

                if (privateKey)
                    randomWallet = new ethers.Wallet(privateKey);
                else
                    randomWallet = ethers.Wallet.createRandom();
                
                newBody.address = randomWallet.address;

                const walletCredential = {
                    privateKey: randomWallet.privateKey,
                } as any;

                // Imported wallet doesn't have mnemonic and path
                if (!privateKey) {
                    walletCredential.mnemonic = randomWallet.mnemonic.phrase;
                    walletCredential.path = randomWallet.mnemonic.path
                }
                newBody.walletCredential = encryptCredentialData(walletCredential, encryptKey) as string;

                const newWallet = new Wallet();
                Object.assign(newWallet, newBody);

                const wallet = await AppDataSource.getMongoRepository(Wallet).create(newWallet);
                const results = await AppDataSource.getMongoRepository(Wallet).save(wallet);
                return res.json(results);

            } catch(e) {
                return res.status(500).send(e);
            }
        });


        // Update wallet
        this.app.put("/api/v1/wallets/:id", async (req: Request, res: Response) => {
            const wallet = await AppDataSource.getMongoRepository(Wallet).findOneBy({
                _id: new ObjectId(req.params.id),
            });

            if (!wallet) {
                res.status(404).send(`Wallet with id: ${req.params.id} not found`);
                return;
            }

            const body = req.body;
            const updateWallet = new Wallet();
            Object.assign(updateWallet, body);

            AppDataSource.getMongoRepository(Wallet).merge(wallet, updateWallet);
            try {
                const results = await AppDataSource.getMongoRepository(Wallet).save(wallet);
                return res.json(results);
            } catch(e) {
                return res.status(500).send(e);
            }
        });

        // Delete wallet via id
        this.app.delete("/api/v1/wallets/:id", async (req: Request, res: Response) => {
            const deletQuery = {
                _id: new ObjectId(req.params.id)
            } as any;
            const results = await AppDataSource.getMongoRepository(Wallet).delete(deletQuery);
            return res.json(results);
        });

        // Get wallet credentials
        this.app.get("/api/v1/wallets/credential/:id", async (req: Request, res: Response) => {
            try {
                const wallet = await AppDataSource.getMongoRepository(Wallet).findOneBy({
                    _id: new ObjectId(req.params.id),
                });

                if (!wallet) {
                    res.status(404).send(`Wallet ${req.params.id} not found`);
                    return;
                }

                // Decrpyt credentialData
                const encryptKey = await getEncryptionKey();

                const decryptedCredentialData = decryptCredentialData(wallet.walletCredential, encryptKey);

                return res.json(decryptedCredentialData);

            } catch (e) {
                console.error(e);
                return res.status(500).send(e);
            }
        });


        // ----------------------------------------
        // Active Test Pools
        // ----------------------------------------

        // Remove active test triggers
        this.app.post("/api/v1/remove-test-triggers", async (req: Request, res: Response) => {
            if (this.activeTestTriggerPool) await this.activeTestTriggerPool.removeAll(this.componentNodes);
            res.status(200).send('success');
            return;
        });

        // Remove active test webhooks
        this.app.post("/api/v1/remove-test-webhooks", async (req: Request, res: Response) => {
            if (this.activeTestWebhookPool) await this.activeTestWebhookPool.removeAll(this.componentNodes);
            res.status(200).send('success');
            return;
        });

                
        // ----------------------------------------
        // Webhook
        // ----------------------------------------

        // GET webhook requests
        this.app.get(`/api/v1/webhook/*`, express.raw(), async (req: Request, res: Response) => {
            const splitUrl = req.path.split('/api/v1/webhook/');
            const webhookEndpoint = splitUrl[splitUrl.length-1];
            await processWebhook(
                res, 
                req, 
                AppDataSource, 
                webhookEndpoint, 
                'GET',
                this.componentNodes,
                io,
                this.deployedWorkflowsPool,
                this.activeTestWebhookPool
            );
        });

        // POST webhook requests
        this.app.post(`/api/v1/webhook/*`, express.raw(), async (req: Request, res: Response) => {
            const splitUrl = req.path.split('/api/v1/webhook/');
            const webhookEndpoint = splitUrl[splitUrl.length-1];
            await processWebhook(
                res, 
                req, 
                AppDataSource, 
                webhookEndpoint, 
                'POST',
                this.componentNodes,
                io,
                this.deployedWorkflowsPool,
                this.activeTestWebhookPool,
            );
        });


        // ----------------------------------------
        // OAuth2
        // ----------------------------------------
        this.app.get("/api/v1/oauth2", async(req: Request, res: Response) => {
        
            if (!req.query.credentialId) return res.status(404).send('Credential not found');

            const credentialId = req.query.credentialId;

            const credential = await AppDataSource.getMongoRepository(Credential).findOneBy({
                _id: new ObjectId(credentialId as string),
            });

            if (!credential) return res.status(404).send(`Credential with Id ${credentialId} not found`);

            // Decrpyt credentialData
            const encryptKey = await getEncryptionKey();

            const decryptedCredentialData = decryptCredentialData(credential.credentialData, encryptKey);

            const baseURL = req.get('host');
            const authUrl = decryptedCredentialData.authUrl as string;
            const authorizationURLParameters = decryptedCredentialData.authorizationURLParameters as string;
            const clientID = decryptedCredentialData.clientID as string;
            const scope = decryptedCredentialData.scope as string;
            let scopeArray: any;
            try {
                scopeArray = scope.replace(/\s/g, '');
                scopeArray = JSON.parse(scopeArray);
            } catch (e) {
                return res.status(500).send(e);
            }
            const serializedScope = scopeArray.join(' ');
            const redirectUrl = `${req.protocol}://${baseURL}/api/v1/oauth2/callback`;

            const returnURL = `${authUrl}?${authorizationURLParameters}&client_id=${clientID}&scope=${serializedScope}&redirect_uri=${redirectUrl}&state=${credentialId}`;

            res.send(returnURL);
        });

        this.app.get("/api/v1/oauth2/callback", async(req: Request, res: Response) => {

            const code = req.query.code;
            if (!code) return res.status(500).send('Unable to retrieve authorization code from oAuth2 callback');

            const credentialId = req.query.state;
            if (!credentialId) return res.status(500).send('Unable to retrieve credentialId from oAuth2 callback');

            const credential = await AppDataSource.getMongoRepository(Credential).findOneBy({
                _id: new ObjectId(credentialId as string),
            });

            if (!credential) return res.status(404).send(`Credential with Id ${credentialId} not found`);

        
            // Decrpyt credentialData
            const encryptKey = await getEncryptionKey();
            const decryptedCredentialData = decryptCredentialData(credential.credentialData, encryptKey);

            // Get access_token and refresh_token
            const accessTokenUrl = decryptedCredentialData.accessTokenUrl as string;
            const client_id = decryptedCredentialData.clientID as string;
            const client_secret = decryptedCredentialData.clientSecret as string;
            const baseURL = req.get('host');
            const redirect_uri = `${req.protocol}://${baseURL}/api/v1/oauth2/callback`;
            
            const axiosConfig: AxiosRequestConfig = {
                method: 'POST' as Method,
                url: accessTokenUrl,
                data: {
                    grant_type: 'authorization_code',
                    code,
                    client_id,
                    client_secret,
                    redirect_uri
                },
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
            };

            const response = await axios(axiosConfig);
            const responseData: IOAuth2Response = response.data;

            const { access_token, token_type, expires_in, refresh_token } = responseData;

            const body: ICredentialBody = {
                name: credential.name,
                nodeCredentialName: credential.nodeCredentialName,
                credentialData: {
                    ...decryptedCredentialData,
                    access_token,
                    token_type,
                    expires_in,
                    refresh_token,
                }
            }

            const updateCredential = await transformToCredentialEntity(body);

            AppDataSource.getMongoRepository(Credential).merge(credential, updateCredential);
            await AppDataSource.getMongoRepository(Credential).save(credential);

            return res.sendFile(getOAuth2HTMLPath());
        });

        this.app.get("/api/v1/oauth2-redirecturl", async(req: Request, res: Response) => {
            const baseURL = req.get('host');
            res.send(`${req.protocol}://${baseURL}/api/v1/oauth2/callback`);
        });


        // ----------------------------------------
        // Serve UI static
        // ----------------------------------------

        const packagePath = getNodeModulesPackagePath("outerbridge-ui");
        const uiBuildPath = path.join(packagePath, "build");
        const uiHtmlPath = path.join(packagePath, "build", "index.html");

        this.app.use('/', express.static(uiBuildPath));

        // All other requests not handled will return React app
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.sendFile(uiHtmlPath);
        });
    }

    async stopApp() {
        try {
            const removePromises = [];
            
            // Remove deployed workflows pools
            removePromises.push(this.deployedWorkflowsPool.removeAll(this.componentNodes));
            
            // Remove test trigger pools
            removePromises.push(this.activeTestTriggerPool.removeAll(this.componentNodes));

            // Remove test webhook pools
            removePromises.push(this.activeTestWebhookPool.removeAll(this.componentNodes));

            await Promise.all(removePromises);

        } catch (e) {
            console.error(`❌[server]: Outerbridge Server shut down error: ${e}`);
        }
    }
}

let serverApp: App | undefined;

export async function start(): Promise<void> {
	serverApp = new App();

    const port = parseInt(process.env.PORT || '', 10) || 3000;
    const server = http.createServer(serverApp.app);
    const io = new Server(server, { 
        cors: {
            origin: 'http://localhost:8080'
        }
    });

    io.on("connection", (socket: Socket) => {
        console.log('👥[server]: client connected: ', socket.id);
    
        socket.on('disconnect', (reason) => {
            console.log('👤[server]: client disconnected = ', reason);
        });
    });

    await serverApp.initDatabase();
	await serverApp.config(io);

    server.listen(port, () => {
        console.log(`⚡️[server]: Outerbridge Server is listening at ${port}`);
    });
}


export function getInstance(): App | undefined {
	return serverApp;
}