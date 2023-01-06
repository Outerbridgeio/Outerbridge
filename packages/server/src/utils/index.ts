import moment from 'moment'
import path from 'path'
import fs from 'fs'
import { lib, PBKDF2, AES, enc } from 'crypto-js'
import { Request, Response } from 'express'
import { DataSource } from 'typeorm'
import {
    ICredentialBody,
    ICredentialDataDecrypted,
    INodeDependencies,
    INodeDirectedGraph,
    IReactFlowEdge,
    IReactFlowNode,
    IVariableDict,
    IReactFlowObject,
    IWebhookNode,
    IComponentNodesPool,
    WebhookMethod,
    INodeQueue,
    IExploredNode,
    IWorkflowExecutedData
} from '../Interface'
import lodash from 'lodash'
import { ICommonObject, INodeData, INodeExecutionData, IWallet, OAUTH2_REFRESHED, IOAuth2RefreshResponse } from 'outerbridge-components'
import { Workflow } from '../entity/Workflow'
import { Credential } from '../entity/Credential'
import { Webhook } from '../entity/Webhook'
import { DeployedWorkflowPool } from '../DeployedWorkflowPool'
import { ObjectId } from 'mongodb'
import { ActiveTestWebhookPool } from '../ActiveTestWebhookPool'
import { getDataSource } from '../DataSource'

export enum ShortIdConstants {
    WORKFLOW_ID_PREFIX = 'W',
    EXECUTION_ID_PREFIX = 'E'
}

const RANDOM_LENGTH = 8
const DICTIONARY_1 = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
const DICTIONARY_3 = 'abcdefghijklmnopqrstuvwxyz0123456789'

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
    const isValidPrefix = prefix === 'W' || prefix === 'E'
    const utcCreatedAt = new Date(date)
    if (!isValidPrefix) throw new Error('Invalid short id prefix, only possible values "W" or "E".')
    const DICTIONARY = DICTIONARY_1
    let randomPart = ''
    for (let i = 0; i < RANDOM_LENGTH; i++) {
        randomPart += getRandomCharFromDictionary(DICTIONARY)
    }
    const sanitizedDate = formatDateForShortID(utcCreatedAt)
    return `${prefix}${sanitizedDate}-${randomPart}`
}

/**
 * Format a date for use in the short id DDMMMYY with no hyphens
 * @param {Date} date
 * @returns {string} the sanitized date as string ie: 10JAN21
 */
export const formatDateForShortID = (date: Date): string => {
    const localDate = moment(date)
    return localDate.format('DDMMMYY').toUpperCase()
}

export const getRandomCharFromDictionary = (dictionary: string) => {
    const minDec = 0
    const maxDec = dictionary.length + 1
    const randDec = Math.floor(Math.random() * (maxDec - minDec) + minDec)
    return dictionary.charAt(randDec)
}

export const getRandomSubdomain = () => {
    let randomPart = ''
    for (let i = 0; i < 24; i++) {
        randomPart += getRandomCharFromDictionary(DICTIONARY_3)
    }
    return randomPart
}

/**
 * Returns the path of node modules package
 * @param {string} packageName
 * @returns {string}
 */
export const getNodeModulesPackagePath = (packageName: string): string => {
    const checkPaths = [
        path.join(__dirname, '..', 'node_modules', packageName),
        path.join(__dirname, '..', '..', 'node_modules', packageName),
        path.join(__dirname, '..', '..', '..', 'node_modules', packageName),
        path.join(__dirname, '..', '..', '..', '..', 'node_modules', packageName),
        path.join(__dirname, '..', '..', '..', '..', '..', 'node_modules', packageName)
    ]
    for (const checkPath of checkPaths) {
        if (fs.existsSync(checkPath)) {
            return checkPath
        }
    }
    return ''
}

/**
 * Returns the path of encryption key
 * @returns {string}
 */
export const getEncryptionKeyPath = (): string => {
    return path.join(__dirname, '..', '..', 'encryption.key')
}

/**
 * Generate an encryption key
 * @returns {string}
 */
export const generateEncryptKey = (): string => {
    const salt = lib.WordArray.random(128 / 8)
    const key256Bits = PBKDF2(process.env.PASSPHRASE || 'MYPASSPHRASE', salt, {
        keySize: 256 / 32,
        iterations: 1000
    })
    return key256Bits.toString()
}

/**
 * Returns the encryption key
 * @returns {string}
 */
export const getEncryptionKey = async (): Promise<string> => {
    try {
        return await fs.promises.readFile(getEncryptionKeyPath(), 'utf8')
    } catch (error) {
        const encryptKey = generateEncryptKey()
        await fs.promises.writeFile(getEncryptionKeyPath(), encryptKey)
        return encryptKey
    }
}

/**
 * Encrypt credential data
 * @param {ICredentialDataDecrypted} data
 * @param {string} encryptionKey
 * @returns {string}
 */
export const encryptCredentialData = (data: ICredentialDataDecrypted, encryptionKey: string): string => {
    return AES.encrypt(JSON.stringify(data), encryptionKey).toString()
}

/**
 * Decrypt credential data
 * @param {string} data
 * @param {string} encryptionKey
 * @returns {ICredentialDataDecrypted}
 */
export const decryptCredentialData = (data: string, encryptionKey: string): ICredentialDataDecrypted => {
    const decryptedData = AES.decrypt(data, encryptionKey)
    try {
        return JSON.parse(decryptedData.toString(enc.Utf8))
    } catch (e) {
        console.error(e)
        throw new Error('Credentials could not be decrypted.')
    }
}

/**
 * Transform ICredentialBody from req to Credential entity
 * @param {ICredentialBody} data
 * @returns {Credential}
 */
export const transformToCredentialEntity = async (body: ICredentialBody): Promise<Credential> => {
    const encryptKey = await getEncryptionKey()

    const credentialBody = {
        name: body.name,
        nodeCredentialName: body.nodeCredentialName,
        credentialData: encryptCredentialData(body.credentialData, encryptKey)
    }

    const newCredential = new Credential()
    Object.assign(newCredential, credentialBody)

    return newCredential
}

/**
 * Returns the path of oauth2 html
 * @returns {string}
 */
export const getOAuth2HTMLPath = (): string => {
    return path.join(__dirname, '..', '..', 'oauth2.html')
}

/**
 * Construct directed graph and node dependencies score
 * @param {IReactFlowNode[]} reactFlowNodes
 * @param {IReactFlowEdge[]} reactFlowEdges
 */
export const constructGraphs = (reactFlowNodes: IReactFlowNode[], reactFlowEdges: IReactFlowEdge[]) => {
    const nodeDependencies = {} as INodeDependencies
    const graph = {} as INodeDirectedGraph

    for (let i = 0; i < reactFlowNodes.length; i += 1) {
        const nodeId = reactFlowNodes[i].id
        nodeDependencies[nodeId] = 0
        graph[nodeId] = []
    }

    for (let i = 0; i < reactFlowEdges.length; i += 1) {
        const source = reactFlowEdges[i].source
        const target = reactFlowEdges[i].target

        if (Object.prototype.hasOwnProperty.call(graph, source)) {
            graph[source].push(target)
        } else {
            graph[source] = [target]
        }
        nodeDependencies[target] += 1
    }

    return { graph, nodeDependencies }
}

/**
 * Get starting node and check if flow is valid
 * @param {INodeDependencies} nodeDependencies
 * @param {IReactFlowNode[]} reactFlowNodes
 */
export const getStartingNode = (nodeDependencies: INodeDependencies, reactFlowNodes: IReactFlowNode[]) => {
    // Find starting node
    const startingNodeIds = [] as string[]
    Object.keys(nodeDependencies).forEach((nodeId) => {
        if (nodeDependencies[nodeId] === 0) {
            startingNodeIds.push(nodeId)
        }
    })

    // Action nodes with 0 dependencies are not valid, must connected to source
    const faultyNodeLabels = []
    for (let i = 0; i < startingNodeIds.length; i += 1) {
        const node = reactFlowNodes.find((nd) => nd.id === startingNodeIds[i])

        if (node && node.data && node.data.type && node.data.type !== 'trigger' && node.data.type !== 'webhook') {
            faultyNodeLabels.push(node.data.label)
        }
    }

    return { faultyNodeLabels, startingNodeIds }
}

/**
 * Function to get both graphs and starting nodes
 * @param {Response} res
 * @param {IReactFlowNode[]} reactFlowNodes
 * @param {IReactFlowEdge[]} reactFlowEdges
 */
export const constructGraphsAndGetStartingNodes = (res: Response, reactFlowNodes: IReactFlowNode[], reactFlowEdges: IReactFlowEdge[]) => {
    const { graph, nodeDependencies } = constructGraphs(reactFlowNodes, reactFlowEdges)
    const { faultyNodeLabels, startingNodeIds } = getStartingNode(nodeDependencies, reactFlowNodes)
    if (faultyNodeLabels.length) {
        let message = `Action nodes must connected to source. Faulty nodes: `
        for (let i = 0; i < faultyNodeLabels.length; i += 1) {
            message += `${faultyNodeLabels[i]}`
            if (i !== faultyNodeLabels.length - 1) {
                message += ', '
            }
        }
        res.status(500).send(message)
        return
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
    let returnVal = paramValue
    const variableStack = []
    const variableDict = {} as IVariableDict
    let startIdx = 0
    const endIdx = returnVal.length - 1

    while (startIdx < endIdx) {
        const substr = returnVal.substring(startIdx, startIdx + 2)

        // Store the opening double curly bracket
        if (substr === '{{') {
            variableStack.push({ substr, startIdx: startIdx + 2 })
        }

        // Found the complete variable
        if (substr === '}}' && variableStack.length > 0 && variableStack[variableStack.length - 1].substr === '{{') {
            const variableStartIdx = variableStack[variableStack.length - 1].startIdx
            const variableEndIdx = startIdx
            const variableFullPath = returnVal.substring(variableStartIdx, variableEndIdx)

            // Split by first occurence of '[' to get just nodeId
            const [variableNodeId, ...rest] = variableFullPath.split('[')
            const variablePath = 'outputResponses.output' + '[' + rest.join('[')

            const executedNode = reactFlowNodes.find((nd) => nd.id === variableNodeId)
            if (executedNode) {
                const resolvedVariablePath = getVariableValue(variablePath, reactFlowNodes)
                const variableValue = lodash.get(executedNode.data, resolvedVariablePath, '')
                variableDict[`{{${variableFullPath}}}`] = variableValue || ''
            }
            variableStack.pop()
        }
        startIdx += 1
    }

    const variablePaths = Object.keys(variableDict)
    variablePaths.sort() // Sort by length of variable path because longer path could possibly contains nested variable
    variablePaths.forEach((path) => {
        const variableValue = variableDict[path]
        // Replace all occurence
        returnVal = returnVal.split(path).join(variableValue)
    })

    return returnVal
}

/**
 * Loop through each inputs and resolve variable if neccessary
 * @param {INodeData} reactFlowNodeData
 * @param {IReactFlowNode[]} reactFlowNodes
 * @returns {INodeData}
 */
export const resolveVariables = (reactFlowNodeData: INodeData, reactFlowNodes: IReactFlowNode[]): INodeData => {
    const flowNodeData = lodash.cloneDeep(reactFlowNodeData)
    const types = ['actions', 'networks', 'inputParameters']

    const getParamValues = (paramsObj: ICommonObject) => {
        for (const key in paramsObj) {
            const paramValue = paramsObj[key]

            if (typeof paramValue === 'string') {
                const resolvedValue = getVariableValue(paramValue, reactFlowNodes)
                paramsObj[key] = resolvedValue
            }

            if (typeof paramValue === 'number') {
                const paramValueStr = paramValue.toString()
                const resolvedValue = getVariableValue(paramValueStr, reactFlowNodes)
                paramsObj[key] = resolvedValue
            }

            if (Array.isArray(paramValue)) {
                for (let j = 0; j < paramValue.length; j += 1) {
                    getParamValues(paramValue[j] as ICommonObject)
                }
            }
        }
    }

    for (let i = 0; i < types.length; i += 1) {
        const paramsObj = (flowNodeData as any)[types[i]]
        getParamValues(paramsObj)
    }
    return flowNodeData
}

/**
 * Decrypt encrypted credentials with encryption key
 * @param {INodeData} nodeData
 */
export const decryptCredentials = async (nodeData: INodeData, appDataSource?: DataSource) => {
    if (!appDataSource) appDataSource = getDataSource()

    if (nodeData.credentials && nodeData.credentials.registeredCredential) {
        // @ts-expect-error investigate this later
        const credentialId: string = nodeData.credentials.registeredCredential?._id

        const credential = await appDataSource.getMongoRepository(Credential).findOneBy({
            _id: new ObjectId(credentialId)
        })
        if (!credential) return

        const encryptKey = await getEncryptionKey()
        const decryptedCredentialData = decryptCredentialData(credential.credentialData, encryptKey)

        nodeData.credentials = { ...nodeData.credentials, ...decryptedCredentialData }
    }
    await decryptWalletCredentials(nodeData)
}

/**
 * Decrypt encrypted wallet credentials with encryption key
 * @param {INodeData} nodeData
 */
export const decryptWalletCredentials = async (nodeData: INodeData) => {
    try {
        const filters = ['actions', 'credentials', 'networks', 'inputParameters']
        for (const key in nodeData) {
            if (filters.includes(key)) {
                // Iterate object to find wallet
                for (const paramName in (nodeData as any)[key]) {
                    if (paramName === 'wallet') {
                        const walletString = (nodeData as any)[key][paramName]
                        const walletDetails: IWallet = JSON.parse(walletString)
                        const walletEncryptedString = walletDetails.walletCredential
                        const encryptKey = await getEncryptionKey()

                        // Decrpyt credentialData
                        const decryptedCredentialData = decryptCredentialData(walletEncryptedString, encryptKey)
                        walletDetails.walletCredential = JSON.stringify(decryptedCredentialData)
                        ;(nodeData as any)[key][paramName] = JSON.stringify(walletDetails)
                    }
                }
            }
        }
    } catch (e) {
        return
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
export const processWebhook = async (
    res: Response,
    req: Request,
    AppDataSource: DataSource,
    webhookEndpoint: string,
    httpMethod: WebhookMethod,
    componentNodes: IComponentNodesPool,
    io: any,
    deployedWorkflowsPool: DeployedWorkflowPool,
    activeTestWebhooksPool: ActiveTestWebhookPool
) => {
    try {
        // Find if webhook is in activeTestWebhookPool
        const testWebhookKey = `${webhookEndpoint}_${httpMethod}`
        if (Object.prototype.hasOwnProperty.call(activeTestWebhooksPool.activeTestWebhooks, testWebhookKey)) {
            const { nodes, edges, nodeData, clientId, isTestWorkflow, webhookNodeId } =
                activeTestWebhooksPool.activeTestWebhooks[testWebhookKey]
            const webhookNodeInstance = componentNodes[nodeData.name] as IWebhookNode

            await decryptCredentials(nodeData)

            if (!isTestWorkflow) {
                nodeData.req = req
                const result = await webhookNodeInstance.runWebhook!.call(webhookNodeInstance, nodeData)

                if (result === null) return res.status(200).send('OK!')

                // Emit webhook result
                io.to(clientId).emit('testWebhookNodeResponse', result)

                // Delete webhook from 3rd party apps and from pool
                activeTestWebhooksPool.remove(testWebhookKey, componentNodes)

                const webhookResponseCode = (nodeData.inputParameters?.responseCode as number) || 200
                if ((nodeData.inputParameters?.returnType as string) === 'lastNodeResponse') {
                    const webhookResponseData = result || []
                    return res.status(webhookResponseCode).json(webhookResponseData)
                } else {
                    const webhookResponseData = (nodeData.inputParameters?.responseData as string) || `Webhook ${req.originalUrl} received!`
                    return res.status(webhookResponseCode).send(webhookResponseData)
                }
            } else {
                nodeData.req = req
                const result = await webhookNodeInstance.runWebhook!.call(webhookNodeInstance, nodeData)

                if (result === null) return res.status(200).send('OK!')

                const newWorkflowExecutedData = {
                    nodeId: webhookNodeId,
                    nodeLabel: nodeData.label,
                    data: result,
                    status: 'FINISHED'
                } as IWorkflowExecutedData

                io.to(clientId).emit('testWorkflowNodeResponse', newWorkflowExecutedData)

                // Delete webhook from 3rd party apps and from pool
                activeTestWebhooksPool.remove(testWebhookKey, componentNodes)

                const { graph } = constructGraphs(nodes, edges)

                const webhookResponseCode = (nodeData.inputParameters?.responseCode as number) || 200
                if ((nodeData.inputParameters?.returnType as string) === 'lastNodeResponse') {
                    const lastExecutedResult = await testWorkflow(webhookNodeId, nodes, edges, graph, componentNodes, clientId, io, true)
                    const webhookResponseData = lastExecutedResult || []
                    return res.status(webhookResponseCode).json(webhookResponseData)
                } else {
                    await testWorkflow(webhookNodeId, nodes, edges, graph, componentNodes, clientId, io)
                    const webhookResponseData = (nodeData.inputParameters?.responseData as string) || `Webhook ${req.originalUrl} received!`
                    return res.status(webhookResponseCode).send(webhookResponseData)
                }
            }
        } else {
            const webhook = await AppDataSource.getMongoRepository(Webhook).findOneBy({
                webhookEndpoint,
                httpMethod
            })

            if (!webhook) {
                res.status(404).send(`Webhook ${req.originalUrl} not found`)
                return
            }

            const nodeId = webhook.nodeId
            const workflowShortId = webhook.workflowShortId

            const workflow = await AppDataSource.getMongoRepository(Workflow).findOneBy({
                shortId: workflowShortId
            })

            if (!workflow) {
                res.status(404).send(`Workflow ${workflowShortId} not found`)
                return
            }

            const flowDataString = workflow.flowData
            const flowData: IReactFlowObject = JSON.parse(flowDataString)
            const reactFlowNodes = flowData.nodes as IReactFlowNode[]
            const reactFlowEdges = flowData.edges as IReactFlowEdge[]

            const reactFlowNode = reactFlowNodes.find((nd) => nd.id === nodeId)

            if (!reactFlowNode) {
                res.status(404).send(`Node ${nodeId} not found`)
                return
            }

            const nodeData = reactFlowNode.data
            const nodeName = nodeData.name

            // Start workflow
            const { graph, nodeDependencies } = constructGraphs(reactFlowNodes, reactFlowEdges)
            const { faultyNodeLabels, startingNodeIds } = getStartingNode(nodeDependencies, reactFlowNodes)
            if (faultyNodeLabels.length) {
                let message = `Action nodes must connected to source. Faulty nodes: `
                for (let i = 0; i < faultyNodeLabels.length; i += 1) {
                    message += `${faultyNodeLabels[i]}`
                    if (i !== faultyNodeLabels.length - 1) {
                        message += ', '
                    }
                }
                res.status(500).send(message)
                return
            }

            const nodeInstance = componentNodes[nodeName]
            const webhookNode = nodeInstance as IWebhookNode
            nodeData.req = req
            const result = (await webhookNode.runWebhook!.call(webhookNode, nodeData)) || []

            if (result === null) return res.status(200).send('OK!')

            const webhookResponseCode = (nodeData.inputParameters?.responseCode as number) || 200
            const workflowExecutedData = (await deployedWorkflowsPool.startWorkflow(
                workflowShortId,
                reactFlowNode,
                reactFlowNode.id,
                result,
                componentNodes,
                startingNodeIds,
                graph
            )) as unknown as IWorkflowExecutedData[]
            if ((nodeData.inputParameters?.returnType as string) === 'lastNodeResponse') {
                const lastExecutedResult = workflowExecutedData[workflowExecutedData.length - 1]
                const webhookResponseData = lastExecutedResult.data || []
                return res.status(webhookResponseCode).json(webhookResponseData)
            } else {
                const webhookResponseData = (nodeData.inputParameters?.responseData as string) || `Webhook ${req.originalUrl} received!`
                return res.status(webhookResponseCode).send(webhookResponseData)
            }
        }
    } catch (error) {
        res.status(500).send(`Webhook error: ${error}`)
        return
    }
}

/**
 * Update credential in DB after oAuth2 tokens have been refreshed
 * @param {INodeExecutionData[] | null} result
 * @param {INodeData} nodeData
 * @param {DataSource} appDataSource
 */
const updateCredentialAfterOAuth2TokenRefreshed = async (
    result: INodeExecutionData[] | null,
    nodeData: INodeData,
    appDataSource?: DataSource
) => {
    if (!result || !result.length) return

    if (!appDataSource) appDataSource = getDataSource()

    let access_token = ''
    let expires_in = ''

    for (let i = 0; i < result.length; i += 1) {
        if (Object.prototype.hasOwnProperty.call(result[i], OAUTH2_REFRESHED)) {
            const refreshData = result[i][OAUTH2_REFRESHED] as unknown as IOAuth2RefreshResponse
            access_token = refreshData.access_token
            expires_in = refreshData.expires_in
            break
        }
    }

    result.forEach((el) => {
        if (el[OAUTH2_REFRESHED]) delete el[OAUTH2_REFRESHED]
        return el
    })

    // Update credential
    if (access_token && expires_in && nodeData.credentials && nodeData.credentials.registeredCredential) {
        // @ts-ignore
        const credentialId = nodeData.credentials.registeredCredential._id as string
        const credential = await appDataSource.getMongoRepository(Credential).findOneBy({
            _id: new ObjectId(credentialId)
        })

        if (!credential) return

        const encryptKey = await getEncryptionKey()
        const decryptedCredentialData = decryptCredentialData(credential.credentialData, encryptKey)

        const body: ICredentialBody = {
            name: credential.name,
            nodeCredentialName: credential.nodeCredentialName,
            credentialData: {
                ...decryptedCredentialData,
                access_token,
                expires_in
            }
        }
        const updateCredential = await transformToCredentialEntity(body)

        appDataSource.getMongoRepository(Credential).merge(credential, updateCredential)
        await appDataSource.getMongoRepository(Credential).save(credential)
    }
}

/**
 * Check if oAuth2 token refreshed
 * @param {INodeExecutionData[] | null} result
 * @param {INodeData} nodeData
 * @param {DataSource} appDataSource
 */
export const checkOAuth2TokenRefreshed = (result: INodeExecutionData[] | null, nodeData: INodeData, appDataSource?: DataSource) => {
    const credentialMethod = nodeData.credentials?.credentialMethod as string
    if (credentialMethod && credentialMethod.toLowerCase().includes('oauth2')) {
        updateCredentialAfterOAuth2TokenRefreshed(result, nodeData, appDataSource)
    }
}

/**
 * Test Workflow from starting node to end
 * @param {string} startingNodeId
 * @param {IReactFlowNode[]} reactFlowNodes
 * @param {IReactFlowEdge[]} reactFlowEdges
 * @param {INodeDirectedGraph} graph
 * @param {IComponentNodesPool} componentNodes
 * @param {string} clientId
 * @param {any} io
 */
export const testWorkflow = async (
    startingNodeId: string,
    reactFlowNodes: IReactFlowNode[],
    reactFlowEdges: IReactFlowEdge[],
    graph: INodeDirectedGraph,
    componentNodes: IComponentNodesPool,
    clientId: string,
    io: any,
    returnLastExecutedResult?: boolean
) => {
    // Create a Queue and add our initial node in it
    const startingNodeIds = [startingNodeId]

    const nodeQueue = [] as INodeQueue[]
    const exploredNode = {} as IExploredNode
    // In the case of infinite loop, only max 3 loops will be executed
    const maxLoop = 3

    // Keep track of last executed result
    let lastExecutedResult: any

    for (let i = 0; i < startingNodeIds.length; i += 1) {
        nodeQueue.push({ nodeId: startingNodeIds[i], depth: 0 })
        exploredNode[startingNodeIds[i]] = { remainingLoop: maxLoop, lastSeenDepth: 0 }
    }

    while (nodeQueue.length) {
        const { nodeId, depth } = nodeQueue.shift() as INodeQueue
        const ignoreNodeIds: string[] = []

        if (!startingNodeIds.includes(nodeId)) {
            const reactFlowNode = reactFlowNodes.find((nd) => nd.id === nodeId)
            const nodeIndex = reactFlowNodes.findIndex((nd) => nd.id === nodeId)
            if (!reactFlowNode || reactFlowNode === undefined || nodeIndex < 0) continue

            try {
                const nodeInstanceFilePath = componentNodes[reactFlowNode.data.name].filePath
                const nodeModule = await import(nodeInstanceFilePath)
                const newNodeInstance = new nodeModule.nodeClass()

                await decryptCredentials(reactFlowNode.data)

                const reactFlowNodeData: INodeData = resolveVariables(reactFlowNode.data, reactFlowNodes)

                const result = await newNodeInstance.run!.call(newNodeInstance, reactFlowNodeData)

                checkOAuth2TokenRefreshed(result, reactFlowNodeData)

                // Update reactFlowNodes for resolveVariables
                if (reactFlowNodes[nodeIndex].data.outputResponses) {
                    reactFlowNodes[nodeIndex].data.outputResponses = {
                        ...reactFlowNodes[nodeIndex].data.outputResponses,
                        output: result
                    }
                } else {
                    reactFlowNodes[nodeIndex].data.outputResponses = {
                        submit: true,
                        needRetest: null,
                        output: result
                    }
                }

                // Determine which nodes to route next when it comes to ifElse
                if (result && nodeId.includes('ifElse')) {
                    let anchorIndex = -1
                    if (Array.isArray(result) && Object.keys(result[0].data).length === 0) {
                        anchorIndex = 0
                    } else if (Array.isArray(result) && Object.keys(result[1].data).length === 0) {
                        anchorIndex = 1
                    }
                    const ifElseEdge = reactFlowEdges.find(
                        (edg) => edg.source === nodeId && edg.sourceHandle === `${nodeId}-output-${anchorIndex}`
                    )
                    if (ifElseEdge) {
                        ignoreNodeIds.push(ifElseEdge.target)
                    }
                }

                const newWorkflowExecutedData = {
                    nodeId,
                    nodeLabel: reactFlowNode.data.label,
                    data: result,
                    status: 'FINISHED'
                } as IWorkflowExecutedData

                lastExecutedResult = result

                io.to(clientId).emit('testWorkflowNodeResponse', newWorkflowExecutedData)
            } catch (e: any) {
                console.error(e)
                const newWorkflowExecutedData = {
                    nodeId,
                    nodeLabel: reactFlowNode.data.label,
                    data: [{ error: e.message }],
                    status: 'ERROR'
                } as IWorkflowExecutedData

                lastExecutedResult = [{ error: e.message }]

                io.to(clientId).emit('testWorkflowNodeResponse', newWorkflowExecutedData)
                return
            }
        }

        const neighbourNodeIds = graph[nodeId]
        const nextDepth = depth + 1

        for (let i = 0; i < neighbourNodeIds.length; i += 1) {
            const neighNodeId = neighbourNodeIds[i]

            if (!ignoreNodeIds.includes(neighNodeId)) {
                // If nodeId has been seen, cycle detected
                if (Object.prototype.hasOwnProperty.call(exploredNode, neighNodeId)) {
                    const { remainingLoop, lastSeenDepth } = exploredNode[neighNodeId]

                    if (lastSeenDepth === nextDepth) continue

                    if (remainingLoop === 0) {
                        break
                    }
                    const remainingLoopMinusOne = remainingLoop - 1
                    exploredNode[neighNodeId] = { remainingLoop: remainingLoopMinusOne, lastSeenDepth: nextDepth }
                    nodeQueue.push({ nodeId: neighNodeId, depth: nextDepth })
                } else {
                    exploredNode[neighNodeId] = { remainingLoop: maxLoop, lastSeenDepth: nextDepth }
                    nodeQueue.push({ nodeId: neighNodeId, depth: nextDepth })
                }
            }
        }
    }
    io.to(clientId).emit('testWorkflowNodeFinish')

    if (returnLastExecutedResult) return lastExecutedResult
}
