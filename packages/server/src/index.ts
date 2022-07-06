
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import localtunnel from 'localtunnel';
import { ObjectId } from 'mongodb';
import { Server, Socket } from "socket.io";
import http from "http";

dotenv.config();

import { AppDataSource } from "./DataSource";
import { NodesPool } from "./NodesPool";
import { Workflow } from "./entity/Workflow";
import { Execution } from "./entity/Execution";
import { Credential } from "./entity/Credential";
import { Webhook } from './entity/Webhook';
import { Contract } from './entity/Contract';

import { 
    IComponentCredentialsPool, 
    IComponentNodesPool, 
    IContractRequestBody, 
    ICredentialBody, 
    ICredentialResponse, 
    IReactFlowEdge, 
    IReactFlowNode, 
    IReactFlowObject, 
    ITestNodeBody, 
    ITriggerNode, 
    IWebhook, 
    IWebhookNode, 
    IWorkflowResponse, 
    WebhookMethod
} from "./Interface";
import { INodeData, INodeOptionsValue, IDbCollection } from "outerbridge-components";
import { CredentialsPool } from './CredentialsPool';
import { 
    decryptCredentialData, 
    getEncryptionKey, 
    processWebhook, 
    decryptCredentials, 
    resolveVariables, 
    transformToCredentialEntity, 
    constructGraphsAndGetStartingNodes
} from './utils';
import { DeployedWorkflowPool } from './DeployedWorkflowPool';
import axios, { AxiosRequestConfig } from 'axios';

process.on('SIGINT', () => {
    console.log('exiting');
    process.exit(); 
});

process.on('exit', () => {
    console.log('exiting');
    process.exit(); 
});

// Prevent throw new Error from crashing the app
// TODO: Get rid of this and send proper error message to ui
process.on('uncaughtException', (err) => {
    console.error('uncaughtException: ', err);
});
 
let componentNodes: IComponentNodesPool = {};
let componentCredentials: IComponentCredentialsPool = {};
let deployedWorkflowsPool: DeployedWorkflowPool;

// Initialize database
AppDataSource
    .initialize()
    .then( async() => {
        console.log("Data Source has been initialized!");

        // Initialize node instances
        const nodesPool = new NodesPool();
        await nodesPool.initialize();
        componentNodes = nodesPool.componentNodes;

        
        // Initialize credential instances
        const credsPool = new CredentialsPool();
        await credsPool.initialize();
        componentCredentials = credsPool.componentCredentials;


        // Initialize deployed worklows instances
        deployedWorkflowsPool = new DeployedWorkflowPool();
        await deployedWorkflowsPool.initialize(AppDataSource, componentNodes);


        // Initialize localtunnel
        if (process.env.ENABLE_TUNNEL) {
            
            const port = parseInt(process.env.PORT || '', 10) || 3000;
            const newTunnel = await localtunnel({ port });
            process.env.TUNNEL_BASE_URL = `${newTunnel.url}/`;

            console.log('process.env.TUNNEL_BASE_URL = ', process.env.TUNNEL_BASE_URL);
        }

    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });


// Initialize express
const app: Express = express();
const port = process.env.PORT;
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

if (process.env['NODE_ENV'] !== 'production') {
    app.use(cors({credentials: true, origin: 'http://localhost:8080'}));
}

const server = http.createServer(app);
const io = new Server(server, { 
    cors: {
        origin: 'http://localhost:8080'
    }
});
  
io.on("connection", (socket: Socket) => {
    console.log('client connected: ', socket.id);

    socket.on('disconnect', (reason) => {
        console.log('client disconnected = ', reason);
    });
});

// ----------------------------------------
// Workflows
// ----------------------------------------

// Get all workflows
app.get("/api/v1/workflows", async (req: Request, res: Response) => {
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
app.get("/api/v1/workflows/:shortId", async (req: Request, res: Response) => {
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
app.post("/api/v1/workflows", async (req: Request, res: Response) => {
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
app.put("/api/v1/workflows/:shortId", async (req: Request, res: Response) => {
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

            await deployedWorkflowsPool.remove(
                startingNodeIds, 
                reactFlowNodes, 
                componentNodes, 
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
                await deployedWorkflowsPool.add(
                    startingNodeIds, 
                    graph, 
                    reactFlowNodes, 
                    componentNodes, 
                    workflowShortId
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
app.delete("/api/v1/workflows/:shortId", async (req: Request, res: Response) => {
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

            await deployedWorkflowsPool.remove(
                startingNodeIds, 
                reactFlowNodes, 
                componentNodes, 
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
app.post("/api/v1/workflows/deploy/:shortId", async (req: Request, res: Response) => {

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
            await deployedWorkflowsPool.add(
                startingNodeIds, 
                graph, 
                reactFlowNodes, 
                componentNodes, 
                workflowShortId
            );
        } else {
            await deployedWorkflowsPool.remove(
                startingNodeIds, 
                reactFlowNodes, 
                componentNodes, 
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



// ----------------------------------------
// Execution
// ----------------------------------------

// Get all executions
app.get("/api/v1/executions", async (req: Request, res: Response) => {
    const executions = await AppDataSource.getMongoRepository(Execution).find();
    return res.json(executions);
});

// Get specific execution via shortId
app.get("/api/v1/executions/:shortId", async (req: Request, res: Response) => {
    const results = await AppDataSource.getMongoRepository(Execution).findOneBy({
        shortId: req.params.shortId,
    });
    return res.json(results);
});

// Create new execution
app.post("/api/v1/executions", async (req: Request, res: Response) => {
    const body = req.body;
	const newExecution = new Execution();
	Object.assign(newExecution, body);

    const execution = await AppDataSource.getMongoRepository(Execution).create(newExecution);
    const results = await AppDataSource.getMongoRepository(Execution).save(execution);
    return res.json(results);
});

// Update execution
app.put("/api/v1/executions/:shortId", async (req: Request, res: Response) => {
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
app.delete("/api/v1/executions/:shortId", async (req: Request, res: Response) => {
    const results = await AppDataSource.getMongoRepository(Execution).delete({ shortId: req.params.shortId });
    return res.json(results);
});



// ----------------------------------------
// Nodes
// ----------------------------------------

// Get all component nodes
app.get("/api/v1/nodes", (req: Request, res: Response) => {
    const returnData = [];
    for (const nodeName in componentNodes) {
        // Remove certain node properties to avoid error of Converting circular structure to JSON
        const clonedNode = JSON.parse(JSON.stringify(componentNodes[nodeName], (key, val) => {
            if (key !== "cronJobs" && key !== "providers") return val;
        }));
        returnData.push(clonedNode);
    }
    return res.json(returnData);
});

// Get specific component node via name
app.get("/api/v1/nodes/:name", (req: Request, res: Response) => {
    if (Object.prototype.hasOwnProperty.call(componentNodes, req.params.name)) {
        // Remove certain node properties to avoid error of Converting circular structure to JSON
        const clonedNode = JSON.parse(JSON.stringify(componentNodes[req.params.name], (key, val) => {
            if (key !== "cronJobs" && key !== "providers") return val;
        }));
        return res.json(clonedNode);
    } else {
        throw new Error(`Node ${req.params.name} not found`);
    }
});

// Returns specific component node icon via name
app.get("/api/v1/node-icon/:name", (req: Request, res: Response) => {
    if (Object.prototype.hasOwnProperty.call(componentNodes, req.params.name)) {
        const nodeInstance = componentNodes[req.params.name];
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
app.post("/api/v1/node-test/:name", async (req: Request, res: Response) => {
    const body: ITestNodeBody = req.body;
    const nodeData = body.nodeData;
    const nodes = body.nodes;
  
    if (Object.prototype.hasOwnProperty.call(componentNodes, req.params.name)) {
        try {
            const nodeInstance = componentNodes[req.params.name];
            const nodeType = nodeInstance.type;

            await decryptCredentials(nodeData);

            if (nodeType === 'action') {
                const reactFlowNodeData: INodeData = resolveVariables(nodeData, nodes);
                const result = await nodeInstance.run!.call(nodeInstance, reactFlowNodeData);
                return res.json(result);

            } else if (nodeType === 'trigger') {
                const triggerNodeInstance = nodeInstance as ITriggerNode;
                const emitEventKey = nodeData.nodeId;
                nodeData.emitEventKey = emitEventKey;
                triggerNodeInstance.once(emitEventKey, async(result: any) => {
                    await triggerNodeInstance.removeTrigger!.call(triggerNodeInstance, nodeData);
                    return res.json(result);
                });
                await triggerNodeInstance.runTrigger!.call(triggerNodeInstance, nodeData);
                
            } else if (nodeType === 'webhook') {
                const webhookNodeInstance = nodeInstance as IWebhookNode;
                const clientId = body.clientId;
                const newBody = {
                    nodeId: nodeData.nodeId,
                    webhookEndpoint: nodeData.webhookEndpoint,
                    httpMethod: nodeData.inputParameters?.httpMethod as WebhookMethod || 'POST',
                    clientId,
                    workflowShortId: nodeData.workflowShortId,
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

                const newWebhook = new Webhook();
                Object.assign(newWebhook, newBody);

                const webhook = await AppDataSource.getMongoRepository(Webhook).create(newWebhook);
                const result = await AppDataSource.getMongoRepository(Webhook).save(webhook);
                return res.json(result);
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
app.post("/api/v1/node-load-method/:name", async (req: Request, res: Response) => {
    const body: INodeData = req.body;

    if (Object.prototype.hasOwnProperty.call(componentNodes, req.params.name)) {
        try {
            const nodeInstance = componentNodes[req.params.name];
            const methodName = body.loadMethod || '';
            const loadFromDbCollections = body.loadFromDbCollections || [];
            const dbCollection = {} as IDbCollection;

            for (let i = 0; i < loadFromDbCollections.length; i+=1) {
                let collection: any;

                if (loadFromDbCollections[i] === 'Contract') collection = Contract;
                else if (loadFromDbCollections[i] === 'Workflow') collection = Workflow;
                else if (loadFromDbCollections[i] === 'Webhook') collection = Webhook;
                else if (loadFromDbCollections[i] === 'Execution') collection = Execution;
                else if (loadFromDbCollections[i] === 'Credential') collection = Credential;
                
                const res = await AppDataSource.getMongoRepository(collection).find();
                dbCollection[loadFromDbCollections[i]] = res;
            }

            const returnOptions: INodeOptionsValue[] = await nodeInstance.loadMethods![methodName]!.call(nodeInstance, body, loadFromDbCollections.length ? dbCollection : undefined);
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
app.post("/api/v1/credentials", async (req: Request, res: Response) => {
    const body: ICredentialBody = req.body;

    const newCredential = await transformToCredentialEntity(body);
    const credential = await AppDataSource.getMongoRepository(Credential).create(newCredential);
    const results = await AppDataSource.getMongoRepository(Credential).save(credential);
    return res.json(results);
});

// Get node credential via specific nodeCredentialName
app.get("/api/v1/node-credentials/:nodeCredentialName", (req: Request, res: Response) => {
    const credentials = [];

    for (const credName in componentCredentials) {
        credentials.push(componentCredentials[credName]);
    }

    const cred = credentials.find((crd) => crd.name === req.params.nodeCredentialName);
    if (cred === undefined) {
        throw new Error(`Credential ${req.params.nodeCredentialName} not found`);
    }
    return res.json(cred);
});

// Get list of registered credentials via nodeCredentialName
app.get("/api/v1/credentials", async (req: Request, res: Response) => {
    const credentials = await AppDataSource.getMongoRepository(Credential).find({
        // @ts-ignore
        where: {
            nodeCredentialName: { $eq: req.query.nodeCredentialName },
        }
    });
    return res.json(credentials);
});

// Get registered credential via objectId
app.get("/api/v1/credentials/:id", async (req: Request, res: Response) => {

    const encryptKey = await getEncryptionKey();
   
    const credential = await AppDataSource.getMongoRepository(Credential).findOneBy({
        _id: new ObjectId(req.params.id),
    });

    if (!credential) {
        res.status(404).send(`Credential ${req.params.id} not found`);
        return;
    }

    // Decrpyt credentialData
    const decryptedCredentialData = decryptCredentialData(credential.credentialData, encryptKey);
    const credentialResponse: ICredentialResponse = {
        ...credential,
        credentialData: decryptedCredentialData
    }
    return res.json(credentialResponse);
});

// Update credential
app.put("/api/v1/credentials/:id", async (req: Request, res: Response) => {
    const credential = await AppDataSource.getMongoRepository(Credential).findOneBy({
        _id: new ObjectId(req.params.id),
    });

    if (!credential) {
        res.status(404).send(`Credential ${req.params.id} not found`);
        return;
    }

    const body: ICredentialBody = req.body;
    const updateCredential = await transformToCredentialEntity(body);
	
    AppDataSource.getMongoRepository(Credential).merge(credential, updateCredential);
    const results = await AppDataSource.getMongoRepository(Credential).save(credential);
    return res.json(results);
});

// Delete credential via id
app.delete("/api/v1/credentials/:id", async (req: Request, res: Response) => {
    const results = await AppDataSource.getMongoRepository(Credential).deleteOne({ _id: new ObjectId(req.params.id) });
    return res.json(results);
});



// ----------------------------------------
// Contract
// ----------------------------------------

// Get all contracts
app.get("/api/v1/contracts", async (req: Request, res: Response) => {
    const contracts = await AppDataSource.getMongoRepository(Contract).find();
    return res.json(contracts);
});

// Get specific contract via id
app.get("/api/v1/contracts/:id", async (req: Request, res: Response) => {
    const results = await AppDataSource.getMongoRepository(Contract).findOneBy({
        _id: new ObjectId(req.params.id),
    });    
    return res.json(results);
});

// Create new contract
app.post("/api/v1/contracts", async (req: Request, res: Response) => {
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
app.put("/api/v1/contracts/:id", async (req: Request, res: Response) => {
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
app.delete("/api/v1/contracts/:id", async (req: Request, res: Response) => {
    const deletQuery = {
        _id: new ObjectId(req.params.id)
    } as any;
    const results = await AppDataSource.getMongoRepository(Contract).delete(deletQuery);
    return res.json(results);
});

// Get contract ABI
app.post("/api/v1/contracts/getabi", async (req: Request, res: Response) => {
    
    const body: IContractRequestBody = req.body;

    if (body.networks === undefined || body.credentials === undefined || body.contractInfo === undefined) {
        res.status(500).send(`Missing contract details`);
        return;
    }

    if (body.credentials && body.credentials.registeredCredential) {
        // @ts-ignore
        const credentialData: string = body.credentials.registeredCredential?.credentialData;
        const encryptKey = await getEncryptionKey();

        // Decrpyt credentialData
        const decryptedCredentialData = decryptCredentialData(credentialData, encryptKey);
        body.credentials = decryptedCredentialData;
    }

    const options: AxiosRequestConfig = {
        method: "GET",
        url: `${body.networks.uri}?module=contract&action=getabi&address=${body.contractInfo.address}&apikey=${body.credentials.apiKey}`,
    };

    try {
        const response = await axios.request(options);
        return res.json(response.data);
    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});




// ----------------------------------------
// Webhook
// ----------------------------------------

// GET webhook requests
app.get(`/api/v1/webhook/*`, express.raw(), async (req: Request, res: Response) => {
    const splitUrl = req.path.split('/api/v1/webhook/');
    const webhookEndpoint = splitUrl[splitUrl.length-1];
    await processWebhook(
        res, 
        req, 
        AppDataSource, 
        webhookEndpoint, 
        'GET',
        componentNodes,
        io,
        deployedWorkflowsPool
    );
});

// POST webhook requests
app.post(`/api/v1/webhook/*`, express.raw(), async (req: Request, res: Response) => {
    const splitUrl = req.path.split('/api/v1/webhook/');
    const webhookEndpoint = splitUrl[splitUrl.length-1];
    await processWebhook(
        res, 
        req, 
        AppDataSource, 
        webhookEndpoint, 
        'POST',
        componentNodes,
        io,
        deployedWorkflowsPool
    );
});

// Remove all test-webhooks from a specific workflow
app.delete(`/api/v1/remove-webhook/:workflowShortId`, async (req: Request, res: Response) => {
    const testWebhooks: IWebhook[] = await AppDataSource.getMongoRepository(Webhook)
    .aggregate(
        [
            {
                $match: {
                    workflowShortId: req.params.workflowShortId
                }
            },
        ]
    ).toArray();

    for (let i = 0; i < testWebhooks.length; i+=1) {
        const webhook = testWebhooks[i];
        if (webhook.clientId) {
            await AppDataSource.getMongoRepository(Webhook).delete({ 
                webhookEndpoint: webhook.webhookEndpoint,
                httpMethod: webhook.httpMethod, 
                clientId: webhook.clientId
            });
        }
    }
    return res.status(204).send('Test webhooks deleted');
});


// ----------------------------------------
// Serve UI static
// ----------------------------------------

app.use('/', express.static(path.join(__dirname, "..", "..", "ui", "build")));
app.use('/', express.static(path.join(__dirname, "..", "..", "ui", "public")));

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.sendFile(path.join(__dirname, "..", "..", "ui", "build", "index.html"));
});
  
server.listen(port, () => {
    console.log(`⚡️[server]: Outerbridge Server is listening at ${port}`);
});
