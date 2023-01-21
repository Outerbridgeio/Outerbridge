import { ICommonObject, INodeData, INodeExecutionData } from 'outerbridge-components'
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

                    const reactFlowNodeData: INodeData[] = resolveVariables(reactFlowNode.data, workflowExecutedData)

                    let results: INodeExecutionData[] = []

                    for (let i = 0; i < reactFlowNodeData.length; i += 1) {
                        const result = await newNodeInstance.run!.call(newNodeInstance, reactFlowNodeData[i])
                        checkOAuth2TokenRefreshed(result, reactFlowNodeData[i], childAppDataSource)
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
 * @param {string} key
 * @param {number} loopIndex
 * @returns {string}
 */
function getVariableValue(paramValue: string, workflowExecutedData: IWorkflowExecutedData[], key: string, loopIndex: number): string {
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
            let variablePath = 'data' + '[' + rest.join('[')
            if (variablePath.includes('$index')) {
                variablePath = variablePath.split('$index').join(loopIndex.toString())
            }

            const executedNodeData = workflowExecutedData.find((exec) => exec.nodeId === variableNodeId)
            if (executedNodeData) {
                const resolvedVariablePath = getVariableValue(variablePath, workflowExecutedData, key, loopIndex)
                const variableValue = lodash.get(executedNodeData, resolvedVariablePath)
                variableDict[`{{${variableFullPath}}}`] = variableValue
                // For instance: const var1 = "some var"
                if (key === 'code' && typeof variableValue === 'string') variableDict[`{{${variableFullPath}}}`] = `"${variableValue}"`
                if (key === 'code' && typeof variableValue === 'object')
                    variableDict[`{{${variableFullPath}}}`] = `${JSON.stringify(variableValue)}`
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
 * Get minimum variable array length from outputResponses.output
 * @param {string} paramValue
 * @param {IReactFlowNode[]} reactFlowNodes
 * @returns {number}
 */
export const getVariableLength = (paramValue: string, workflowExecutedData: IWorkflowExecutedData[]): number => {
    let minLoop = Infinity
    const variableStack = []
    let startIdx = 0
    const endIdx = paramValue.length - 1

    while (startIdx < endIdx) {
        const substr = paramValue.substring(startIdx, startIdx + 2)

        // Store the opening double curly bracket
        if (substr === '{{') {
            variableStack.push({ substr, startIdx: startIdx + 2 })
        }

        // Found the complete variable
        if (substr === '}}' && variableStack.length > 0 && variableStack[variableStack.length - 1].substr === '{{') {
            const variableStartIdx = variableStack[variableStack.length - 1].startIdx
            const variableEndIdx = startIdx
            const variableFullPath = paramValue.substring(variableStartIdx, variableEndIdx)

            if (variableFullPath.includes('$index')) {
                // Split by first occurence of '[' to get just nodeId
                const [variableNodeId, ...rest] = variableFullPath.split('[')
                const variablePath = 'data' + '[' + rest.join('[')
                const [variableArrayPath, ..._] = variablePath.split('[$index]')

                const executedNodeData = workflowExecutedData.find((exec) => exec.nodeId === variableNodeId)
                if (executedNodeData) {
                    const variableValue = lodash.get(executedNodeData, variableArrayPath)
                    if (Array.isArray(variableValue)) minLoop = Math.min(minLoop, variableValue.length)
                }
            }
            variableStack.pop()
        }
        startIdx += 1
    }
    return minLoop
}

/**
 * Loop through each inputs and resolve variable if neccessary
 * @param {INodeData} reactFlowNodeData
 * @param {IWorkflowExecutedData[]} workflowExecutedData
 * @returns {INodeData}
 */
function resolveVariables(reactFlowNodeData: INodeData, workflowExecutedData: IWorkflowExecutedData[]): INodeData[] {
    const flowNodeDataArray: INodeData[] = []
    const flowNodeData = lodash.cloneDeep(reactFlowNodeData)
    const types = ['actions', 'networks', 'inputParameters']

    const getMinForLoop = (paramsObj: ICommonObject) => {
        let minLoop = Infinity
        for (const key in paramsObj) {
            const paramValue = paramsObj[key]
            if (typeof paramValue === 'string' && paramValue.includes('$index')) {
                // node.data[$index].smtg
                minLoop = Math.min(minLoop, getVariableLength(paramValue, workflowExecutedData))
            }
            if (Array.isArray(paramValue)) {
                for (let j = 0; j < paramValue.length; j += 1) {
                    minLoop = Math.min(minLoop, getMinForLoop(paramValue[j] as ICommonObject))
                }
            }
        }
        return minLoop
    }

    const getParamValues = (paramsObj: ICommonObject, loopIndex: number) => {
        for (const key in paramsObj) {
            const paramValue = paramsObj[key]

            if (typeof paramValue === 'string') {
                const resolvedValue = getVariableValue(paramValue, workflowExecutedData, key, loopIndex)
                paramsObj[key] = resolvedValue
            }

            if (typeof paramValue === 'number') {
                const paramValueStr = paramValue.toString()
                const resolvedValue = getVariableValue(paramValueStr, workflowExecutedData, key, loopIndex)
                paramsObj[key] = resolvedValue
            }

            if (Array.isArray(paramValue)) {
                for (let j = 0; j < paramValue.length; j += 1) {
                    getParamValues(paramValue[j] as ICommonObject, loopIndex)
                }
            }
        }
    }

    let minLoop = Infinity
    for (let i = 0; i < types.length; i += 1) {
        const paramsObj = (flowNodeData as any)[types[i]]
        minLoop = Math.min(minLoop, getMinForLoop(paramsObj))
    }

    if (minLoop === Infinity) {
        for (let i = 0; i < types.length; i += 1) {
            const paramsObj = (flowNodeData as any)[types[i]]
            getParamValues(paramsObj, -1)
        }
        return [flowNodeData]
    } else {
        for (let j = 0; j < minLoop; j += 1) {
            const clonedFlowNodeData = lodash.cloneDeep(flowNodeData)
            for (let i = 0; i < types.length; i += 1) {
                const paramsObj = (clonedFlowNodeData as any)[types[i]]
                getParamValues(paramsObj, j)
            }
            flowNodeDataArray.push(clonedFlowNodeData)
        }
        return flowNodeDataArray
    }
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
