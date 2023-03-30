import { INodeData, INodeExecutionData, IWebhookNodeExecutionData } from 'outerbridge-components'
import {
    IDeployedWorkflowsPool,
    IComponentNodesPool,
    INodeDirectedGraph,
    ITriggerNode,
    IChildProcessMessage,
    IWorkflowExecutedData,
    ExecutionState,
    IReactFlowNode,
    IReactFlowObject,
    IReactFlowEdge,
    IRunWorkflowMessageValue,
    WebhookMethod,
    IWebhookNode,
    INodeQueue,
    IExploredNode
} from './Interface'
import { DataSource } from 'typeorm'
import { join as pathJoin } from 'path'
import { fork } from 'child_process'
import * as fs from 'fs'
import lodash from 'lodash'
import { ObjectId } from 'mongodb'

import { constructGraphs, getStartingNode, decryptCredentials, checkOAuth2TokenRefreshed } from './utils'
import { Webhook } from './entity/Webhook'
import { Execution } from './entity/Execution'
import { Workflow } from './entity/Workflow'
import { ActiveTestTriggerPool } from './ActiveTestTriggerPool'
import { ActiveTestWebhookPool } from './ActiveTestWebhookPool'
import { resolveVariables } from './ChildProcess'

export class DeployedWorkflowPool {
    deployedWorkflows: IDeployedWorkflowsPool = {}
    AppDataSource: DataSource

    /**
     * Initialize to get all deployed workflows
     * @param {DataSource} AppDataSource
     */
    async initialize(AppDataSource: DataSource, componentNodes: IComponentNodesPool) {
        this.deployedWorkflows = {}
        this.AppDataSource = AppDataSource

        const workflows = await this.AppDataSource.getMongoRepository(Workflow).find()
        for (let i = 0; i < workflows.length; i += 1) {
            const workflow = workflows[i]
            if (workflow.deployed) {
                try {
                    const flowDataString = workflow.flowData
                    const flowData: IReactFlowObject = JSON.parse(flowDataString)
                    const reactFlowNodes = flowData.nodes as IReactFlowNode[]
                    const reactFlowEdges = flowData.edges as IReactFlowEdge[]
                    const workflowShortId = workflow.shortId

                    const { graph, nodeDependencies } = constructGraphs(reactFlowNodes, reactFlowEdges)
                    const { faultyNodeLabels, startingNodeIds } = getStartingNode(nodeDependencies, reactFlowNodes)

                    // If there are faulty nodes and deployed is active, update deployed to false
                    if (faultyNodeLabels.length) {
                        const body = {
                            deployed: false
                        }
                        const updateWorkflow = new Workflow()
                        Object.assign(updateWorkflow, body)

                        AppDataSource.getMongoRepository(Workflow).merge(workflow, updateWorkflow)
                        await AppDataSource.getMongoRepository(Workflow).save(workflow)

                        continue
                    }

                    await this.add(startingNodeIds, graph, reactFlowNodes, componentNodes, workflowShortId)
                } catch (e) {
                    throw new Error(`Error initializing workflow ${workflow.shortId}: ${e}`)
                }
            }
        }
    }

    /**
     * Add workflow to deployed workflow pools
     * @param {string[]} startingNodeIds
     * @param {INodeDirectedGraph} graph
     * @param {IReactFlowNode[]} reactFlowNodes
     * @param {IComponentNodesPool} componentNodes
     * @param {string} workflowShortId
     */
    async add(
        startingNodeIds: string[],
        graph: INodeDirectedGraph,
        reactFlowNodes: IReactFlowNode[],
        componentNodes: IComponentNodesPool,
        workflowShortId: string,
        activeTestTriggerPool?: ActiveTestTriggerPool,
        activeTestWebhookPool?: ActiveTestWebhookPool
    ) {
        for (let i = 0; i < startingNodeIds.length; i += 1) {
            const startingNodeId = startingNodeIds[i]
            const startNode = reactFlowNodes.find((nd) => nd.id === startingNodeId)
            const emitEventKey = `${workflowShortId}_${startingNodeId}`

            if (startNode && startNode.data && startNode.data.type === 'trigger') {
                const nodeInstance = componentNodes[startNode.data.name]
                const triggerNodeInstance = nodeInstance as ITriggerNode

                // Remove test trigger
                if (activeTestTriggerPool) await activeTestTriggerPool.remove(startNode.data.name, componentNodes)

                triggerNodeInstance.on(emitEventKey, async (result: INodeExecutionData[]) => {
                    await this.startWorkflow(workflowShortId, startNode, startingNodeId, result, componentNodes, startingNodeIds, graph)
                })

                await decryptCredentials(startNode.data)

                const nodeData = {
                    ...startNode.data,
                    emitEventKey,
                    nodeId: startingNodeId,
                    workflowShortId
                } as INodeData
                await triggerNodeInstance.runTrigger!.call(triggerNodeInstance, nodeData)
            } else if (startNode && startNode.data && startNode.data.type === 'webhook') {
                const nodeInstance = componentNodes[startNode.data.name]
                const webhookNodeInstance = nodeInstance as IWebhookNode

                const newBody = {
                    nodeId: startingNodeId,
                    webhookEndpoint: startNode.data.webhookEndpoint,
                    httpMethod: (startNode.data.inputParameters?.httpMethod as WebhookMethod) || 'POST',
                    workflowShortId
                } as any

                // Remove test webhook
                if (activeTestWebhookPool)
                    await activeTestWebhookPool.remove(`${newBody.webhookEndpoint}_${newBody.httpMethod}`, componentNodes)

                const foundWebhook = await this.AppDataSource.getMongoRepository(Webhook).findOneBy(newBody)

                // If third party webhook exists, delete and re-create with new tunnel
                if (foundWebhook && foundWebhook.webhookId && process.env.ENABLE_TUNNEL === 'true') {
                    if (!process.env.TUNNEL_BASE_URL) {
                        return
                    }
                    await this.AppDataSource.getMongoRepository(Webhook).deleteOne({
                        _id: new ObjectId(foundWebhook._id)
                    })
                    await decryptCredentials(startNode.data)
                    await webhookNodeInstance.webhookMethods?.deleteWebhook(startNode.data, foundWebhook.webhookId)
                    const webhookFullUrl = `${process.env.TUNNEL_BASE_URL}api/v1/webhook/${startNode.data.webhookEndpoint}`
                    const webhookId = await webhookNodeInstance.webhookMethods?.createWebhook.call(
                        webhookNodeInstance,
                        startNode.data,
                        webhookFullUrl
                    )
                    if (webhookId !== undefined) {
                        newBody.webhookId = webhookId
                    }
                    const newWebhook = new Webhook()
                    Object.assign(newWebhook, newBody)

                    const webhook = await this.AppDataSource.getMongoRepository(Webhook).create(newWebhook)
                    await this.AppDataSource.getMongoRepository(Webhook).save(webhook)
                }

                if (!foundWebhook) {
                    if (webhookNodeInstance.webhookMethods?.createWebhook) {
                        if (!process.env.TUNNEL_BASE_URL) {
                            return
                        }
                        const webhookFullUrl = `${process.env.TUNNEL_BASE_URL}api/v1/webhook/${startNode.data.webhookEndpoint}`
                        await decryptCredentials(startNode.data)
                        const webhookId = await webhookNodeInstance.webhookMethods?.createWebhook.call(
                            webhookNodeInstance,
                            startNode.data,
                            webhookFullUrl
                        )
                        if (webhookId !== undefined) {
                            newBody.webhookId = webhookId
                        }
                    }

                    const newWebhook = new Webhook()
                    Object.assign(newWebhook, newBody)

                    const webhook = await this.AppDataSource.getMongoRepository(Webhook).create(newWebhook)
                    await this.AppDataSource.getMongoRepository(Webhook).save(webhook)
                }
            }

            if (Object.prototype.hasOwnProperty.call(this.deployedWorkflows, workflowShortId)) {
                this.deployedWorkflows[workflowShortId].emitEventKey = emitEventKey
            } else {
                this.deployedWorkflows[workflowShortId] = { emitEventKey }
            }
        }
    }

    /**
     * Start the rest of workflow via child process
     * @param {string} workflowShortId
     * @param {IReactFlowNode} startNode
     * @param {string} startingNodeId
     * @param {INodeExecutionData[] | IWebhookNodeExecutionData[]} startingNodeExecutedData
     * @param {IComponentNodesPool} componentNodes
     * @param {string[]} startingNodeIds
     * @param {INodeDirectedGraph} graph
     */
    async startWorkflow(
        workflowShortId: string,
        startNode: IReactFlowNode,
        startingNodeId: string,
        startingNodeExecutedData: INodeExecutionData[] | IWebhookNodeExecutionData[],
        componentNodes: IComponentNodesPool,
        startingNodeIds: string[],
        graph: INodeDirectedGraph
    ) {
        try {
            if (process.env.MODE && process.env.MODE === 'main') {
                return await this.startInMainProcess(
                    workflowShortId,
                    startNode,
                    startingNodeId,
                    startingNodeExecutedData,
                    componentNodes,
                    startingNodeIds,
                    graph
                )
            } else {
                return await this.startInChildProcess(
                    workflowShortId,
                    startNode,
                    startingNodeId,
                    startingNodeExecutedData,
                    componentNodes,
                    startingNodeIds,
                    graph
                )
            }
        } catch (err) {
            console.error(err)
        }
    }

    /**
     * Start the rest of workflow via child process
     * @param {string} workflowShortId
     * @param {IReactFlowNode} startNode
     * @param {string} startingNodeId
     * @param {INodeExecutionData[] | IWebhookNodeExecutionData[]} startingNodeExecutedData
     * @param {IComponentNodesPool} componentNodes
     * @param {string[]} startingNodeIds
     * @param {INodeDirectedGraph} graph
     */
    async startInChildProcess(
        workflowShortId: string,
        startNode: IReactFlowNode,
        startingNodeId: string,
        startingNodeExecutedData: INodeExecutionData[] | IWebhookNodeExecutionData[],
        componentNodes: IComponentNodesPool,
        startingNodeIds: string[],
        graph: INodeDirectedGraph
    ) {
        try {
            // Fetch latest nodes and edges from DB
            const { reactFlowNodes, reactFlowEdges } = await this.prepareDataForChildProcess(workflowShortId)

            const controller = new AbortController()
            const { signal } = controller

            let childpath = pathJoin(__dirname, '..', 'dist', 'ChildProcess.js')
            if (!fs.existsSync(childpath)) childpath = 'ChildProcess.ts'

            const childProcess = fork(childpath, [], { signal })

            const workflowExecutedData = [
                {
                    nodeId: startingNodeId,
                    nodeLabel: startNode.data.label,
                    data: startingNodeExecutedData
                }
            ] as IWorkflowExecutedData[]
            const newExecution = await this.addExecution(workflowShortId, workflowExecutedData, controller)
            const newExecutionShortId = newExecution === undefined ? '' : newExecution.shortId

            // Remove cronJobs and providers to avoid error of converting circular structure to JSON
            const clonedComponentNodes = lodash.cloneDeep(componentNodes)
            for (const nodeInstanceName in clonedComponentNodes) {
                if (Object.prototype.hasOwnProperty.call(clonedComponentNodes[nodeInstanceName], 'providers')) {
                    delete (clonedComponentNodes[nodeInstanceName] as any)['providers']
                }

                if (Object.prototype.hasOwnProperty.call(clonedComponentNodes[nodeInstanceName], 'cronJobs')) {
                    delete (clonedComponentNodes[nodeInstanceName] as any)['cronJobs']
                }
            }

            const value = {
                startingNodeIds,
                componentNodes: clonedComponentNodes,
                reactFlowNodes,
                reactFlowEdges,
                graph,
                workflowExecutedData
            } as IRunWorkflowMessageValue
            childProcess.send({ key: 'start', value } as IChildProcessMessage)

            let childProcessTimeout: NodeJS.Timeout

            return new Promise((resolve, _) => {
                childProcess.on('message', async (message: IChildProcessMessage) => {
                    if (message.key === 'finish') {
                        let updatedWorkflowExecutedData = message.value as IWorkflowExecutedData[]
                        updatedWorkflowExecutedData = updatedWorkflowExecutedData.filter((execData) => execData.nodeId !== startingNodeId)
                        await this.updateExecution(workflowShortId, updatedWorkflowExecutedData, newExecutionShortId, 'FINISHED')
                        if (childProcessTimeout) {
                            clearTimeout(childProcessTimeout)
                        }
                        resolve(updatedWorkflowExecutedData)
                    }
                    if (message.key === 'start') {
                        if (process.env.EXECUTION_TIMEOUT) {
                            childProcessTimeout = setTimeout(async () => {
                                childProcess.kill()
                                await this.terminateSpecificExecutionAfterTimeout(newExecutionShortId)
                                resolve(undefined)
                            }, parseInt(process.env.EXECUTION_TIMEOUT, 10))
                        }
                    }
                    if (message.key === 'error') {
                        let updatedWorkflowExecutedData = message.value as IWorkflowExecutedData[]
                        updatedWorkflowExecutedData = updatedWorkflowExecutedData.filter((execData) => execData.nodeId !== startingNodeId)
                        await this.updateExecution(workflowShortId, updatedWorkflowExecutedData, newExecutionShortId, 'ERROR')
                        if (childProcessTimeout) {
                            clearTimeout(childProcessTimeout)
                        }
                        resolve(updatedWorkflowExecutedData)
                    }
                })
            })
        } catch (err) {
            console.error(err)
        }
    }

    /**
     * Start the rest of workflow via main process
     * @param {string} workflowShortId
     * @param {IReactFlowNode} startNode
     * @param {string} startingNodeId
     * @param {INodeExecutionData[] | IWebhookNodeExecutionData[]} startingNodeExecutedData
     * @param {IComponentNodesPool} componentNodes
     * @param {string[]} startingNodeIds
     * @param {INodeDirectedGraph} graph
     */
    async startInMainProcess(
        workflowShortId: string,
        startNode: IReactFlowNode,
        startingNodeId: string,
        startingNodeExecutedData: INodeExecutionData[] | IWebhookNodeExecutionData[],
        componentNodes: IComponentNodesPool,
        startingNodeIds: string[],
        graph: INodeDirectedGraph
    ) {
        try {
            // Fetch latest nodes and edges from DB
            const { reactFlowNodes, reactFlowEdges } = await this.prepareDataForChildProcess(workflowShortId)

            const controller = new AbortController()

            const nodeQueue = [] as INodeQueue[]
            const exploredNode = {} as IExploredNode
            // In the case of infinite loop, only max 3 loops will be executed
            const maxLoop = 3

            // Save initial execution data
            const workflowExecutedData = [
                {
                    nodeId: startingNodeId,
                    nodeLabel: startNode.data.label,
                    data: startingNodeExecutedData
                }
            ] as IWorkflowExecutedData[]
            const newExecution = await this.addExecution(workflowShortId, workflowExecutedData, controller)
            const newExecutionShortId = newExecution === undefined ? '' : newExecution.shortId

            // Remove cronJobs and providers to avoid error of converting circular structure to JSON
            const clonedComponentNodes = lodash.cloneDeep(componentNodes)
            for (const nodeInstanceName in clonedComponentNodes) {
                if (Object.prototype.hasOwnProperty.call(clonedComponentNodes[nodeInstanceName], 'providers')) {
                    delete (clonedComponentNodes[nodeInstanceName] as any)['providers']
                }

                if (Object.prototype.hasOwnProperty.call(clonedComponentNodes[nodeInstanceName], 'cronJobs')) {
                    delete (clonedComponentNodes[nodeInstanceName] as any)['cronJobs']
                }
            }

            for (let i = 0; i < startingNodeIds.length; i += 1) {
                nodeQueue.push({ nodeId: startingNodeIds[i], depth: 0 })
                exploredNode[startingNodeIds[i]] = { remainingLoop: maxLoop, lastSeenDepth: 0 }
            }

            var startTime = Date.now()

            while (nodeQueue.length) {
                const { nodeId, depth } = nodeQueue.shift() as INodeQueue
                const ignoreNodeIds: string[] = []

                if (!startingNodeIds.includes(nodeId)) {
                    const reactFlowNode = reactFlowNodes.find((nd) => nd.id === nodeId)
                    if (!reactFlowNode || reactFlowNode === undefined) continue

                    try {
                        if (process.env.EXECUTION_TIMEOUT && Date.now() - startTime > parseInt(process.env.EXECUTION_TIMEOUT, 10)) {
                            await this.terminateSpecificExecutionAfterTimeout(newExecutionShortId)
                            return
                        }

                        const nodeInstanceFilePath = componentNodes[reactFlowNode.data.name].filePath
                        const nodeModule = await import(nodeInstanceFilePath)
                        const newNodeInstance = new nodeModule.nodeClass()

                        await decryptCredentials(reactFlowNode.data)

                        const reactFlowNodeData: INodeData[] = resolveVariables(reactFlowNode.data, workflowExecutedData)

                        let results: INodeExecutionData[] = []

                        for (let i = 0; i < reactFlowNodeData.length; i += 1) {
                            const result = await newNodeInstance.run!.call(newNodeInstance, reactFlowNodeData[i])
                            checkOAuth2TokenRefreshed(result, reactFlowNodeData[i])
                            if (result) results.push(...result)
                        }

                        // Determine which nodes to route next when it comes to ifElse
                        if (results.length && nodeId.includes('ifElse')) {
                            let anchorIndex = -1
                            if (Array.isArray(results) && Object.keys((results as any)[0].data).length === 0) {
                                anchorIndex = 0
                            } else if (Array.isArray(results) && Object.keys((results as any)[1].data).length === 0) {
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
                            data: results
                        } as IWorkflowExecutedData

                        workflowExecutedData.push(newWorkflowExecutedData)
                    } catch (e: any) {
                        console.error(e.message)
                        const newWorkflowExecutedData = {
                            nodeId,
                            nodeLabel: reactFlowNode.data.label,
                            data: [{ error: e.message }]
                        } as IWorkflowExecutedData
                        workflowExecutedData.push(newWorkflowExecutedData)
                        const updatedWorkflowExecutedData = workflowExecutedData.filter((execData) => execData.nodeId !== startingNodeId)
                        await this.updateExecution(workflowShortId, updatedWorkflowExecutedData, newExecutionShortId, 'ERROR')
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
            const updatedWorkflowExecutedData = workflowExecutedData.filter((execData) => execData.nodeId !== startingNodeId)
            await this.updateExecution(workflowShortId, updatedWorkflowExecutedData, newExecutionShortId, 'FINISHED')
            return updatedWorkflowExecutedData
        } catch (err) {
            console.error(err)
        }
    }

    /**
     * Remove workflow from deployed workflow pools by:
     * 1.) Remove trigger  2.) Trigger abort controller  3.) Delete the object from deployedWorkflowsPool
     * @param {string[]} startingNodeIds
     * @param {IReactFlowNode[]} reactFlowNodes
     * @param {IComponentNodesPool} componentNodes
     * @param {string} workflowShortId
     */
    async remove(
        startingNodeIds: string[],
        reactFlowNodes: IReactFlowNode[],
        componentNodes: IComponentNodesPool,
        workflowShortId: string
    ) {
        for (let i = 0; i < startingNodeIds.length; i += 1) {
            const startingNodeId = startingNodeIds[i]
            const startNode = reactFlowNodes.find((nd) => nd.id === startingNodeId)
            const emitEventKey = `${workflowShortId}_${startingNodeId}`

            if (startNode && startNode.data && startNode.data.type === 'trigger') {
                const nodeInstance = componentNodes[startNode.data.name]
                const triggerNodeInstance = nodeInstance as ITriggerNode

                const nodeData = {
                    ...startNode.data,
                    emitEventKey,
                    nodeId: startingNodeId,
                    workflowShortId
                } as INodeData
                await triggerNodeInstance.removeTrigger!.call(triggerNodeInstance, nodeData)
            } else if (startNode && startNode.data && startNode.data.type === 'webhook') {
                const nodeInstance = componentNodes[startNode.data.name]
                const webhookNodeInstance = nodeInstance as IWebhookNode

                const query = {
                    nodeId: startingNodeId,
                    webhookEndpoint: startNode.data.webhookEndpoint,
                    httpMethod: (startNode.data.inputParameters?.httpMethod as WebhookMethod) || 'POST',
                    workflowShortId
                } as any

                const webhook = await this.AppDataSource.getMongoRepository(Webhook).findOneBy(query)

                if (webhook && webhook.webhookId) {
                    await decryptCredentials(startNode.data)
                    const isWebhookDeleted = await webhookNodeInstance.webhookMethods?.deleteWebhook(startNode.data, webhook.webhookId)
                    if (isWebhookDeleted) {
                        query.webhookId = webhook.webhookId
                    }
                }
                await this.AppDataSource.getMongoRepository(Webhook).delete(query)
            }

            await this.terminateExecutions(workflowShortId)

            if (!this.deployedWorkflows[workflowShortId]) return

            const workflowAbortController = lodash.cloneDeep(this.deployedWorkflows[workflowShortId].abortController)

            if (
                workflowAbortController &&
                Object.prototype.hasOwnProperty.call(workflowAbortController, 'signal') &&
                !workflowAbortController.signal.aborted
            ) {
                try {
                    workflowAbortController?.abort()
                } catch (e) {
                    console.error(e)
                }
            }
            delete this.deployedWorkflows[workflowShortId]
        }
    }

    /**
     * Remove all deployed workflows from pools:
     * @param {IComponentNodesPool} componentNodes
     */
    async removeAll(componentNodes: IComponentNodesPool) {
        const deployedWorkflowShortIds = Object.keys(this.deployedWorkflows)
        if (!deployedWorkflowShortIds.length) return

        const workflows = await this.AppDataSource.getMongoRepository(Workflow).findBy({
            shortId: {
                $in: deployedWorkflowShortIds
            }
        })

        for (let i = 0; i < workflows.length; i += 1) {
            const workflow = workflows[i]
            const flowDataString = workflow.flowData
            const flowData: IReactFlowObject = JSON.parse(flowDataString)
            const reactFlowNodes = flowData.nodes
            const reactFlowEdges = flowData.edges

            const { nodeDependencies } = constructGraphs(reactFlowNodes, reactFlowEdges)
            const { startingNodeIds } = getStartingNode(nodeDependencies, reactFlowNodes)

            await this.remove(startingNodeIds, reactFlowNodes, componentNodes, workflow.shortId)
        }
    }

    /**
     * Get nodes and edges from database
     * @param {string} workflowShortId
     */
    async prepareDataForChildProcess(workflowShortId: string) {
        const workflow = await this.AppDataSource.getMongoRepository(Workflow).findOneBy({
            shortId: workflowShortId
        })

        if (!workflow) {
            throw new Error(`Workflow ${workflowShortId} not found`)
        }

        const flowDataString = workflow.flowData
        const flowData: IReactFlowObject = JSON.parse(flowDataString)
        const reactFlowNodes = flowData.nodes
        const reactFlowEdges = flowData.edges

        return { reactFlowNodes, reactFlowEdges }
    }

    /**
     * Add results to deployedWorkflows[workflowShortId].workflowExecutedData, and Execution DB
     * @param {string} workflowShortId
     * @param {IWorkflowExecutedData[]} workflowExecutedData
     * @param {AbortController} controller
     */
    async addExecution(workflowShortId: string, workflowExecutedData: IWorkflowExecutedData[], controller: AbortController) {
        if (!Object.prototype.hasOwnProperty.call(this.deployedWorkflows, workflowShortId)) {
            return
        }

        this.deployedWorkflows[workflowShortId].workflowExecutedData = lodash.cloneDeep(workflowExecutedData)
        this.deployedWorkflows[workflowShortId].abortController = controller

        const newExecution = new Execution()
        const bodyExecution = {
            workflowShortId,
            state: 'INPROGRESS' as ExecutionState,
            executionData: JSON.stringify(this.deployedWorkflows[workflowShortId].workflowExecutedData)
        }
        Object.assign(newExecution, bodyExecution)

        const execution = this.AppDataSource.getMongoRepository(Execution).create(newExecution)
        return await this.AppDataSource.getMongoRepository(Execution).save(execution)
    }

    /**
     * Update results to deployedWorkflows[workflowShortId].workflowExecutedData, and Execution DB
     * @param {string} workflowShortId
     * @param {IWorkflowExecutedData[]} workflowExecutedData
     * @param {string} executionShortId
     * @param {ExecutionState} state
     */
    async updateExecution(
        workflowShortId: string,
        workflowExecutedData: IWorkflowExecutedData[],
        executionShortId: string,
        state: ExecutionState
    ) {
        if (!Object.prototype.hasOwnProperty.call(this.deployedWorkflows, workflowShortId)) {
            return
        }

        const existingWorkflowExecutedData = lodash.cloneDeep(this.deployedWorkflows[workflowShortId].workflowExecutedData) || []
        const updateWorkflowExecutedData = existingWorkflowExecutedData.concat(workflowExecutedData)
        this.deployedWorkflows[workflowShortId].workflowExecutedData = updateWorkflowExecutedData

        const execution = await this.AppDataSource.getMongoRepository(Execution).findOneBy({
            shortId: executionShortId
        })

        if (!execution) {
            throw new Error(`Execution ${executionShortId} not found`)
        }

        const updateExecution = new Execution()
        const bodyExecution = {
            state,
            executionData: JSON.stringify(this.deployedWorkflows[workflowShortId].workflowExecutedData),
            stoppedDate: new Date()
        }
        Object.assign(updateExecution, bodyExecution)

        this.AppDataSource.getMongoRepository(Execution).merge(execution, updateExecution)
        await this.AppDataSource.getMongoRepository(Execution).save(execution)
    }

    /**
     * Update INPROGRESS execution to TERMINATED
     * @param {string} workflowShortId
     */
    async terminateExecutions(workflowShortId: string) {
        const executions: Execution[] = await this.AppDataSource.getMongoRepository(Execution)
            .aggregate([
                {
                    $match: { workflowShortId, state: 'INPROGRESS' as ExecutionState }
                }
            ])
            .toArray()

        for (let i = 0; i < executions.length; i += 1) {
            const execution = executions[i]
            const body = { state: 'TERMINATED' as ExecutionState, stoppedDate: new Date() }
            const updateExecution = new Execution()
            Object.assign(updateExecution, body)

            this.AppDataSource.getMongoRepository(Execution).merge(execution, updateExecution)
            await this.AppDataSource.getMongoRepository(Execution).save(execution)
        }
    }

    /**
     * Update specific execution to TIMEOUT
     * @param {string} newExecutionShortId
     */
    async terminateSpecificExecutionAfterTimeout(newExecutionShortId: string) {
        const execution = await this.AppDataSource.getMongoRepository(Execution).findOneBy({
            shortId: newExecutionShortId
        })

        if (execution && execution.state === 'INPROGRESS') {
            const body = { state: 'TIMEOUT' as ExecutionState, stoppedDate: new Date() }
            const updateExecution = new Execution()
            Object.assign(updateExecution, body)

            this.AppDataSource.getMongoRepository(Execution).merge(execution, updateExecution)
            await this.AppDataSource.getMongoRepository(Execution).save(execution)
        }
    }
}
