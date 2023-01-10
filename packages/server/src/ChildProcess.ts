import { ICommonObject, INodeData } from 'outerbridge-components'
import {
    IChildProcessMessage,
    IExploredNode,
    INodeQueue,
    IRunWorkflowMessageValue,
    IVariableDict,
    IWorkflowExecutedData
} from './Interface'
import { checkOAuth2TokenRefreshed, decryptCredentials } from './utils'
import { DataSource } from 'typeorm'
import { Workflow } from './entity/Workflow'
import { Execution } from './entity/Execution'
import { Credential } from './entity/Credential'
import { Webhook } from './entity/Webhook'
import { Contract } from './entity/Contract'
import { Wallet } from './entity/Wallet'
import lodash from 'lodash'

export class ChildProcess {
    /**
     * Stop child process after 5 secs timeout
     */
    static async stopChildProcess() {
        setTimeout(() => {
            process.exit(0)
        }, 50000)
    }

    /**
     * Run the workflow using Breadth First Search Topological Sort
     * @param {IRunWorkflowMessageValue} messageValue
     * @return {Promise<void>}
     */
    async runWorkflow(messageValue: IRunWorkflowMessageValue): Promise<void> {
        process.on('SIGTERM', ChildProcess.stopChildProcess)
        process.on('SIGINT', ChildProcess.stopChildProcess)

        await sendToParentProcess('start', '_')

        const childAppDataSource = await initDB()

        // Create a Queue and add our initial node in it
        const { startingNodeIds, componentNodes, reactFlowNodes, reactFlowEdges, graph, workflowExecutedData } = messageValue

        const nodeQueue = [] as INodeQueue[]
        const exploredNode = {} as IExploredNode
        // In the case of infinite loop, only max 3 loops will be executed
        const maxLoop = 3

        for (let i = 0; i < startingNodeIds.length; i += 1) {
            nodeQueue.push({ nodeId: startingNodeIds[i], depth: 0 })
            exploredNode[startingNodeIds[i]] = { remainingLoop: maxLoop, lastSeenDepth: 0 }
        }

        while (nodeQueue.length) {
            const { nodeId, depth } = nodeQueue.shift() as INodeQueue
            const ignoreNodeIds: string[] = []

            if (!startingNodeIds.includes(nodeId)) {
                const reactFlowNode = reactFlowNodes.find((nd) => nd.id === nodeId)
                if (!reactFlowNode || reactFlowNode === undefined) continue

                try {
                    const nodeInstanceFilePath = componentNodes[reactFlowNode.data.name].filePath
                    const nodeModule = await import(nodeInstanceFilePath)
                    const newNodeInstance = new nodeModule.nodeClass()

                    await decryptCredentials(reactFlowNode.data, childAppDataSource)

                    const reactFlowNodeData: INodeData = resolveVariables(reactFlowNode.data, workflowExecutedData)

                    const result = await newNodeInstance.run!.call(newNodeInstance, reactFlowNodeData)

                    checkOAuth2TokenRefreshed(result, reactFlowNodeData, childAppDataSource)

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
                        data: result
                    } as IWorkflowExecutedData

                    workflowExecutedData.push(newWorkflowExecutedData)
                } catch (e: any) {
                    // console.error(e);
                    console.error(e.message)
                    const newWorkflowExecutedData = {
                        nodeId,
                        nodeLabel: reactFlowNode.data.label,
                        data: [{ error: e.message }]
                    } as IWorkflowExecutedData
                    workflowExecutedData.push(newWorkflowExecutedData)
                    await sendToParentProcess('error', workflowExecutedData)
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
        await sendToParentProcess('finish', workflowExecutedData)
    }
}

/**
 * Initalize DB in child process
 * @returns {DataSource}
 */
async function initDB() {
    const childAppDataSource = new DataSource({
        type: 'mongodb',
        url: process.env.MONGO_URL || `mongodb://${process.env.MONGO_HOST || 'localhost'}:27017/outerbridge`,
        useNewUrlParser: true,
        synchronize: true,
        logging: false,
        entities: [Workflow, Execution, Credential, Webhook, Contract, Wallet],
        migrations: [],
        subscribers: []
    })
    return await childAppDataSource.initialize()
}

/**
 * Get variable value from outputResponses.output
 * @param {string} paramValue
 * @param {IWorkflowExecutedData[]} workflowExecutedData
 * @returns {string}
 */
function getVariableValue(paramValue: string, workflowExecutedData: IWorkflowExecutedData[], key: string): string {
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
            const variablePath = 'data' + '[' + rest.join('[')

            const executedNodeData = workflowExecutedData.find((exec) => exec.nodeId === variableNodeId)
            if (executedNodeData) {
                const resolvedVariablePath = getVariableValue(variablePath, workflowExecutedData, key)
                const variableValue = lodash.get(executedNodeData, resolvedVariablePath)
                variableDict[`{{${variableFullPath}}}`] = variableValue
                // For instance: const var1 = "some var"
                if (key === 'code' && typeof variableValue === 'string') variableDict[`{{${variableFullPath}}}`] = `"${variableValue}"`
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
 * @param {IWorkflowExecutedData[]} workflowExecutedData
 * @returns {INodeData}
 */
function resolveVariables(reactFlowNodeData: INodeData, workflowExecutedData: IWorkflowExecutedData[]): INodeData {
    const flowNodeData = lodash.cloneDeep(reactFlowNodeData)
    const types = ['actions', 'networks', 'inputParameters']

    function getParamValues(paramsObj: ICommonObject) {
        for (const key in paramsObj) {
            const paramValue = paramsObj[key]

            if (typeof paramValue === 'string') {
                const resolvedValue = getVariableValue(paramValue, workflowExecutedData, key)
                paramsObj[key] = resolvedValue
            }

            if (typeof paramValue === 'number') {
                const paramValueStr = paramValue.toString()
                const resolvedValue = getVariableValue(paramValueStr, workflowExecutedData, key)
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
 * Send data back to parent process
 * @param {string} key Key of message
 * @param {*} value Value of message
 * @returns {Promise<void>}
 */
async function sendToParentProcess(key: string, value: any): Promise<void> {
    // tslint:disable-line:no-any
    return new Promise((resolve, reject) => {
        process.send!(
            {
                key,
                value
            },
            (error: Error) => {
                if (error) {
                    return reject(error)
                }
                resolve()
            }
        )
    })
}

const childProcess = new ChildProcess()

process.on('message', async (message: IChildProcessMessage) => {
    if (message.key === 'start') {
        await childProcess.runWorkflow(message.value)
        process.exit()
    }
})
