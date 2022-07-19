
import moment from 'moment';
import path from 'path';
import fs from 'fs';
import { lib, PBKDF2, AES, enc } from 'crypto-js';
import { Request, Response } from 'express';
import { DataSource } from "typeorm"
import dotenv from 'dotenv';
import { 
	ICredentialBody, 
	ICredentialDataDecrpyted, 
	INodeDependencies, 
	INodeDirectedGraph, 
	IReactFlowEdge, 
	IReactFlowNode, 
	IVariableDict, 
	IReactFlowObject,
    IWebhookNode, 
    IComponentNodesPool,
    WebhookMethod,
} from '../Interface';
import lodash from 'lodash';
import { ICommonObject, INodeData } from 'outerbridge-components';
import { Workflow } from "../entity/Workflow";
import { Credential } from "../entity/Credential";
import { Webhook } from '../entity/Webhook';
import { DeployedWorkflowPool } from '../DeployedWorkflowPool';

dotenv.config();

export enum ShortIdConstants {
	WORKFLOW_ID_PREFIX = 'W',
	EXECUTION_ID_PREFIX = 'E',
}
  
let RANDOM_LENGTH = 8;
let USE_LOWERCASE = 'false';
const DICTIONARY_1 = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const DICTIONARY_2 = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz';
  
/**
 * Returns a Short ID
 * Format : WDDMMMYY-[0-1A-Z]*8 , ie:  B10JAN21-2CH9PX8N
 * Where W=Entity Prefix, DD=DAY, MMM=Month, YY=Year, -=Separator (hyphen character), [0-1A-Z]*8 = random part of length 8 by default.
 *
 * @param {string | Date} prefix Identifies the Entity, 'W' for Workflow, 'E' for Execution
 * @param {Date} date The Date the ShortId was created
 * @returns {string} shortId
 */
export const shortId = (prefix: 'W' | 'E', date: string | Date): string => {
	const isValidPrefix = prefix === 'W' || prefix === 'E';
	const utcCreatedAt = new Date(date);
	if (!isValidPrefix) throw new Error('Invalid short id prefix, only possible values "W" or "E".');
	const DICTIONARY = USE_LOWERCASE === 'true' ? DICTIONARY_2 : DICTIONARY_1;
	let randomPart = '';
	for (let i = 0; i < RANDOM_LENGTH; i++) {
		randomPart += getRandomCharFromDictionary(DICTIONARY);
	}
	const sanitizedDate = formatDateForShortID(utcCreatedAt);
	return `${prefix}${sanitizedDate}-${randomPart}`;
};
  
/**
 * Format a date for use in the short id DDMMMYY with no hyphens
 * @param {Date} date
 * @returns {string} the sanitized date as string ie: 10JAN21
 */
export const formatDateForShortID = (date: Date): string => {
	const localDate = moment(date);
	return localDate.format('DDMMMYY').toUpperCase();
};
  
export const getRandomCharFromDictionary = (dictionary: string) => {
	const minDec = 0;
	const maxDec = dictionary.length + 1;
	const randDec = Math.floor(Math.random() * (maxDec - minDec) + minDec);
	return dictionary.charAt(randDec);
};
  
/**
 * Returns the path of encryption key
 * @returns {string}
 */
export const getEncryptionKeyPath = (): string => {
	return path.join(__dirname, "..", "..", "encryption.key");
}
  
/**
 * Generate an encryption key
 * @returns {string}
 */
export const generateEncryptKey = (): string => {
	const salt = lib.WordArray.random(128 / 8);
	const key256Bits = PBKDF2(process.env.PASSPHRASE || 'MYPASSPHRASE', salt, {
		keySize: 256 / 32,
		iterations: 1000,
	});
	return key256Bits.toString();
}

/**
 * Returns the encryption key
 * @returns {string}
 */
export const getEncryptionKey = async(): Promise<string> => {
	try {
		return await fs.promises.readFile(getEncryptionKeyPath(), 'utf8');
	} catch (error) {
		const encryptKey = generateEncryptKey(); 
		await fs.promises.writeFile(getEncryptionKeyPath(), encryptKey);
		return encryptKey;
	}
}

/**
 * Encrypt credential data
 * @param {ICredentialDataDecrpyted} data 
 * @param {string} encryptionKey 
 * @returns {string}
 */
export const encryptCredentialData = (data: ICredentialDataDecrpyted, encryptionKey: string): string => {
	return AES.encrypt(JSON.stringify(data), encryptionKey).toString();
}

/**
 * Decrypt credential data
 * @param {string} data 
 * @param {string} encryptionKey 
 * @returns {ICredentialDataDecrpyted}
 */
export const decryptCredentialData = (data: string, encryptionKey: string): ICredentialDataDecrpyted => {
	const decryptedData = AES.decrypt(data, encryptionKey);
	try {
		return JSON.parse(decryptedData.toString(enc.Utf8));
	} catch (e) {
		console.error(e);
		throw new Error('Credentials could not be decrypted.');
	}
}

/**
 * Transform ICredentialBody from req to Credential entity
 * @param {ICredentialBody} data 
 * @returns {Credential}
 */
export const transformToCredentialEntity = async (body: ICredentialBody): Promise<Credential> => {

	const encryptKey = await getEncryptionKey();

	const credentialBody = {
        name: body.name,
        nodeCredentialName: body.nodeCredentialName,
        credentialData: encryptCredentialData(body.credentialData, encryptKey),
    }

	const newCredential = new Credential();
	Object.assign(newCredential, credentialBody);

	return newCredential;
}

/**
 * Construct directed graph and node dependencies score
 * @param {IReactFlowNode[]} reactFlowNodes 
 * @param {IReactFlowEdge[]} reactFlowEdges 
 */
export const constructGraphs = (reactFlowNodes: IReactFlowNode[], reactFlowEdges: IReactFlowEdge[]) => {
   
    const nodeDependencies = {} as INodeDependencies;
	const graph = {} as INodeDirectedGraph;

    for (let i = 0; i < reactFlowNodes.length; i+=1 ) {
        const nodeId = reactFlowNodes[i].id;
        nodeDependencies[nodeId] = 0;
        graph[nodeId] = [];
    }

    for (let i = 0; i < reactFlowEdges.length; i+=1 ) {
        const source = reactFlowEdges[i].source;
        const target = reactFlowEdges[i].target;
        
    	if (Object.prototype.hasOwnProperty.call(graph, source)) {
            graph[source].push(target);
        } else {
            graph[source] = [target];
        }   
        nodeDependencies[target] += 1;
    }

	return { graph, nodeDependencies };
}

/**
 * Get starting node and check if flow is valid
 * @param {INodeDependencies} nodeDependencies 
 * @param {IReactFlowNode[]} reactFlowNodes
 */
export const getStartingNode = (nodeDependencies: INodeDependencies, reactFlowNodes: IReactFlowNode[]) => {

    // Find starting node
    const startingNodeIds = [] as string[];
    Object.keys(nodeDependencies).forEach((nodeId) => {
        if (nodeDependencies[nodeId] === 0) {
            startingNodeIds.push(nodeId);
        }
    });
    
    // Action nodes with 0 dependencies are not valid, must connected to source
    const faultyNodeLabels = [];
    for (let i = 0; i < startingNodeIds.length; i+=1 ) {
        const node = reactFlowNodes.find((nd) => nd.id === startingNodeIds[i]);
        
        if (node && node.data && node.data.type && node.data.type !== 'trigger' && node.data.type !== 'webhook') {
            faultyNodeLabels.push(node.data.label);
        }
    }

    return { faultyNodeLabels, startingNodeIds };
}

/**
 * Function to get both graphs and starting nodes
 * @param {Response} res 
 * @param {IReactFlowNode[]} reactFlowNodes
 * @param {IReactFlowEdge[]} reactFlowEdges
 */
export const constructGraphsAndGetStartingNodes = (res: Response, reactFlowNodes: IReactFlowNode[], reactFlowEdges: IReactFlowEdge[]) => {

    const { graph, nodeDependencies } = constructGraphs(reactFlowNodes, reactFlowEdges);
    const { faultyNodeLabels, startingNodeIds } = getStartingNode(nodeDependencies, reactFlowNodes);
    if (faultyNodeLabels.length) {
        let message = `Action nodes must connected to source. Faulty nodes: `;
        for (let i = 0; i < faultyNodeLabels.length; i+=1) {
            message += `${faultyNodeLabels[i]}`;
            if (i !== faultyNodeLabels.length - 1) {
                message += ', ';
            }
        }
        res.status(500).send(message);
        return;
    }

    return { graph, startingNodeIds }
}

/**
 * Get variable value from outputResponses.output
 * @param {string} paramValue 
 * @param {IReactFlowNode[]} reactFlowNodes
 * @returns {string}
 */
export const getVariableValue = (paramValue: string, reactFlowNodes: IReactFlowNode[]): string => {
    let returnVal = paramValue;
    const variableStack = [];
    const variableDict = {} as IVariableDict;
    let startIdx = 0;
    let endIdx = returnVal.length - 1;

    while (startIdx < endIdx) {
        const substr = returnVal.substring(startIdx, startIdx+2);

        // If this is the first opening double curly bracket
        if (substr === '{{' && variableStack.length === 0) {
            variableStack.push({ substr, startIdx: startIdx+2 });
        } else if (substr === '{{' && variableStack.length > 0 && variableStack[variableStack.length-1].substr === '{{') {
            // If we have seen opening double curly bracket without closing, replace it
            variableStack.pop();
            variableStack.push({ substr, startIdx: startIdx+2 });
        }

		// Found the complete variable
        if (substr === '}}' && variableStack.length > 0 && variableStack[variableStack.length-1].substr === '{{') {
            const variableStartIdx = variableStack[variableStack.length-1].startIdx;
            const variableEndIdx = startIdx;
            const variableFullPath = returnVal.substring(variableStartIdx, variableEndIdx);
    
			// Split by first occurence of '[' to get just nodeId 
            const [variableNodeId, ...rest] = variableFullPath.split('[');
            const variablePath = 'outputResponses.output' + '[' + rest.join('[');
    
            const executedNode = reactFlowNodes.find((nd) => nd.id === variableNodeId);
            if (executedNode) {
                const variableValue = lodash.get(executedNode.data, variablePath, '');
                variableDict[`{{${variableFullPath}}}`] = variableValue;
            }
            variableStack.pop();
        }
        startIdx += 1;
    }

    for (const variablePath in variableDict) {
        const variableValue = variableDict[variablePath];

		// Replace all occurence
        returnVal = returnVal.split(variablePath).join(variableValue);
    }

    return returnVal;
}


/**
 * Loop through each inputs and resolve variable if neccessary
 * @param {INodeData} reactFlowNodeData 
 * @param {IReactFlowNode[]} reactFlowNodes
 * @returns {INodeData}
 */
export const resolveVariables = (reactFlowNodeData: INodeData, reactFlowNodes: IReactFlowNode[]): INodeData  => {
    const flowNodeData = lodash.cloneDeep(reactFlowNodeData);
    const types = ['actions', 'networks', 'inputParameters'];

    const getParamValues = (paramsObj: ICommonObject) => {
        for (const key in paramsObj) {
            const paramValue = paramsObj[key];

            if (typeof paramValue === 'string') {
                const resolvedValue = getVariableValue(paramValue, reactFlowNodes);
                paramsObj[key] = resolvedValue;
            }

            if (typeof paramValue === 'number') {
                const paramValueStr = paramValue.toString();
                const resolvedValue = getVariableValue(paramValueStr, reactFlowNodes);
                paramsObj[key] = resolvedValue;
            }

            if (Array.isArray(paramValue)) {
                for (let j = 0; j < paramValue.length; j+=1 ) {
                    getParamValues(paramValue[j] as ICommonObject);
                }
            }
        }
    }

    for (let i = 0; i < types.length; i+=1 ) {
        const paramsObj = (flowNodeData as any)[types[i]];
        getParamValues(paramsObj);
    }
    return flowNodeData;
} 

/**
 * Decrypt encrypted credentials with encryption key
 * @param {INodeData} nodeData 
 */
export const decryptCredentials = async(nodeData: INodeData) => {
    if (nodeData.credentials && nodeData.credentials.registeredCredential) {
        // @ts-ignore
        const credentialData: string = nodeData.credentials.registeredCredential?.credentialData;
        const encryptKey = await getEncryptionKey();

        // Decrpyt credentialData
        const decryptedCredentialData = decryptCredentialData(credentialData, encryptKey);
        nodeData.credentials = { ...nodeData.credentials, ...decryptedCredentialData };
    }
}

/**
 * Process webhook
 * @param {Response} res 
 * @param {Request} req
 * @param {DataSource} AppDataSource
 * @param {string} webhookEndpoint
 * @param {WebhookMethod} httpMethod
 * @param {IComponentNodesPool} componentNodes
 * @param {any} io
 */
export const processWebhook = async(
    res: Response, 
    req: Request, 
    AppDataSource: DataSource, 
    webhookEndpoint: string, 
    httpMethod: WebhookMethod,
    componentNodes: IComponentNodesPool,
    io: any,
    deployedWorkflowsPool: DeployedWorkflowPool,
) => { 
	try {
        const webhook = await AppDataSource.getMongoRepository(Webhook).findOneBy({
            webhookEndpoint,
            httpMethod
        });
    
        if (!webhook) {
            res.status(404).send(`Webhook ${req.originalUrl} not found`);
            return;
        }

        const nodeId = webhook.nodeId;
        const workflowShortId = webhook.workflowShortId;

        const workflow = await AppDataSource.getMongoRepository(Workflow).findOneBy({
            shortId: workflowShortId,
        });
    
        if (!workflow) {
            res.status(404).send(`Workflow ${workflowShortId} not found`);
            return;
        }

        const flowDataString = workflow.flowData;
        const flowData: IReactFlowObject = JSON.parse(flowDataString);
        const reactFlowNodes = flowData.nodes as IReactFlowNode[];
        const reactFlowEdges = flowData.edges as IReactFlowEdge[];
  
        const reactFlowNode = reactFlowNodes.find((nd) => nd.id === nodeId);

        if (!reactFlowNode) {
            res.status(404).send(`Node ${nodeId} not found`);
            return;
        }

        const nodeData = reactFlowNode.data;
        const nodeName = nodeData.name;

        // Check if webhook is a test-webhook
        let isTestWebhook = false;
        if (webhook.clientId) isTestWebhook= true;

        if (isTestWebhook) {
            if (Object.prototype.hasOwnProperty.call(componentNodes, nodeName)) {
                const nodeInstance = componentNodes[nodeName];
                const nodeType = nodeInstance.type;

                await decryptCredentials(nodeData);

                if (nodeType === 'webhook') {
                    const webhookNodeInstance = nodeInstance as IWebhookNode;
                    nodeData.req = req;
                    const result = await webhookNodeInstance.runWebhook!.call(webhookNodeInstance, nodeData);

                    // Emit webhook result
                    const clientId = webhook.clientId;
                    io.to(clientId).emit('testNodeResponse', result);

                    // Delete webhook from 3rd party apps and from DB
                    if (webhook && webhook.webhookId) {
                        await webhookNodeInstance.webhookMethods?.deleteWebhook(nodeData, webhook.webhookId);
                    }
                    const query = {
                        _id: webhook._id,
                    } as any;
                    await AppDataSource.getMongoRepository(Webhook).delete(query);

                    const webhookResponseCode = nodeData.inputParameters?.responseCode as number || 200;
                    const webhookResponseData = nodeData.inputParameters?.responseData as string || `Webhook ${req.originalUrl} received!`;
                    return res.status(webhookResponseCode).send(webhookResponseData);
    
                }
            } else {
                res.status(404).send(`Node ${nodeName} not found`);
                return;
            }
        } else {
            // Start workflow
            const { graph, nodeDependencies } = constructGraphs(reactFlowNodes, reactFlowEdges);
            const { faultyNodeLabels, startingNodeIds } = getStartingNode(nodeDependencies, reactFlowNodes);
            if (faultyNodeLabels.length) {
                let message = `Action nodes must connected to source. Faulty nodes: `;
                for (let i = 0; i < faultyNodeLabels.length; i+=1) {
                    message += `${faultyNodeLabels[i]}`;
                    if (i !== faultyNodeLabels.length - 1) {
                        message += ', ';
                    }
                }
                res.status(500).send(message);
                return;
            }
            
            const nodeInstance = componentNodes[nodeName];
            const webhookNode = nodeInstance as IWebhookNode;
            nodeData.req = req;
            const result = await webhookNode.runWebhook!.call(webhookNode, nodeData) || [];

            await deployedWorkflowsPool.startWorkflow(
                workflowShortId,
                reactFlowNode,
                reactFlowNode.id,
                result,
                componentNodes,
                startingNodeIds,
                graph
            );
            
            const webhookResponseCode = nodeData.inputParameters?.responseCode as number || 200;
            const webhookResponseData = nodeData.inputParameters?.responseData as string || `Webhook ${req.originalUrl} received!`;
            return res.status(webhookResponseCode).send(webhookResponseData);
    
        }

    } catch (error) {
        res.status(500).send(`Webhook error: ${error}`);
        return;
    }
}