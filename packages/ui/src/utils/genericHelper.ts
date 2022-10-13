import lodash from 'lodash'
import moment from 'moment'
import { INode, INodeParams, INodeData, ICommonObject } from 'outerbridge-components'
import { MarkOptional, StrictOmit, StrictExclude, StrictExtract } from 'ts-essentials'

type NodeData = MarkOptional<INodeData, 'version' | 'outgoing' | 'incoming'> & {
    inputAnchors: { id: string }[]
    outputAnchors: { id: string }[]
    selected: boolean
    submit?: null
}
type Nodes = (INode & {
    id: string
    data: NodeData
    selected: boolean
})[]
type NodeDependencies = Record<string, number>
type Graph = Record<string, string[]>
type Edges = { source: string; target: string; targetHandle: '-input-'[] }[]
type NodeParams = StrictOmit<MarkOptional<INodeParams, 'label'>, 'type' | 'array'> &
    (
        | {
              type: StrictExtract<INodeParams['type'], 'array'>
              array: NonNullable<INodeParams['array']>
          }
        | { type?: StrictExclude<INodeParams['type'], 'array' | 'options'> }
        | {
              type: StrictExtract<INodeParams['type'], 'options'>
              options: NonNullable<INodeParams['options']>
          }
    )

export const numberOrExpressionRegex = /^(\d+\.?\d*|{{.*}})$/ //return true if string consists only numbers OR expression {{}}
export const constructNodeDirectedGraph = (nodes: Nodes, edges: Edges, reverse = false) => {
    const graph: Graph = {}
    const nodeDependencies: NodeDependencies = {}

    // Initialize node dependencies and graph
    for (let i = 0; i < nodes.length; i++) {
        const nodeId = nodes[i]!.id
        nodeDependencies[nodeId] = 0
        graph[nodeId] = []
    }

    for (let i = 0; i < edges.length; i++) {
        const source = edges[i]!.source
        const target = edges[i]!.target

        if (Object.prototype.hasOwnProperty.call(graph, source)) {
            graph[source]?.push(target)
        } else {
            graph[source] = [target]
        }

        if (reverse) {
            if (Object.prototype.hasOwnProperty.call(graph, target)) {
                graph[target]?.push(source)
            } else {
                graph[target] = [source]
            }
        }

        nodeDependencies[target]++
    }

    return { graph, nodeDependencies }
}

// Find starting node with 0 dependencies
export const findStartingNodeIds = (nodes: Nodes, nodeDependencies: NodeDependencies) => {
    const startingNodeIds: string[] = []
    Object.keys(nodeDependencies).forEach((nodeId) => {
        if (nodeDependencies[nodeId] === 0) {
            const node = nodes.find((nd) => nd.id === nodeId)
            if (node?.data.type === 'trigger' || node?.data.type === 'webhook') {
                startingNodeIds.push(nodeId)
            }
        }
    })

    return startingNodeIds
}

// Breadth First Search to get all connected parent nodes from target
export const getAllConnectedNodesFromTarget = (targetNodeId: string, edges: Edges, graph: Graph) => {
    const nodeQueue: string[] = []
    const exploredNodes = []

    nodeQueue.push(targetNodeId)
    exploredNodes.push(targetNodeId)

    while (nodeQueue.length) {
        const nodeId = nodeQueue.shift() || ''
        const parentNodeIds = []

        const inputEdges = edges.filter((edg) => edg.target === nodeId && edg.targetHandle.includes('-input-'))
        if (inputEdges && inputEdges.length) {
            for (let j = 0; j < inputEdges.length; j++) {
                parentNodeIds.push(inputEdges[j]!.source)
            }
        }

        const neighbourNodeIds = graph[nodeId]
        if (neighbourNodeIds) {
            for (let i = 0; i < neighbourNodeIds.length; i++) {
                const neighNodeId = neighbourNodeIds[i]!
                if (parentNodeIds.includes(neighNodeId)) {
                    if (!exploredNodes.includes(neighNodeId)) {
                        exploredNodes.push(neighNodeId)
                        nodeQueue.push(neighNodeId)
                    }
                }
            }
        } else {
            alert('something is wrong, contact admin. code:1000')
        }
    }
    return exploredNodes
}

export const getAvailableNodeIdsForVariable = (nodes: Nodes, edges: Edges, targetNodeId: string) => {
    const { graph } = constructNodeDirectedGraph(nodes, edges, true)
    const exploreNodes = getAllConnectedNodesFromTarget(targetNodeId, edges, graph)
    const setPath = new Set(exploreNodes)
    setPath.delete(targetNodeId)
    return [...setPath]
}

export const generateWebhookEndpoint = () => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
    const webhookEndpoint = Array.from({ length: 15 })
        .map(() => {
            return characters.charAt(Math.floor(Math.random() * characters.length))
        })
        .join('')
    return webhookEndpoint
}

export const getUniqueNodeId = (nodeData: NodeData, nodes: Nodes) => {
    // Get amount of same nodes
    let totalSameNodes = 0
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]!
        if (node.data.name === nodeData.name) {
            totalSameNodes++
        }
    }

    // Get unique id
    let nodeId = `${nodeData.name}_${totalSameNodes}`
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]!
        if (node.id === nodeId) {
            totalSameNodes++
            nodeId = `${nodeData.name}_${totalSameNodes}`
        }
    }
    return nodeId
}

const getUniqueNodeLabel = (nodeData: NodeData, nodes: Nodes) => {
    // Get amount of same nodes
    let totalSameNodes = 0
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]!
        if (node.data.name === nodeData.name) {
            totalSameNodes++
        }
    }

    // Get unique label
    let nodeLabel = `${nodeData.label}_${totalSameNodes}`
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]!
        if (node.data.label === nodeLabel) {
            totalSameNodes++
            nodeLabel = `${nodeData.label}_${totalSameNodes}`
        }
    }
    return totalSameNodes === 0 ? nodeData.label : nodeLabel
}

export const checkIfNodeLabelUnique = (nodeLabel: string, nodes: Nodes) => {
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]!
        if (node.data.label === nodeLabel) {
            return false
        }
    }
    return true
}

export const initializeNodeData = (nodeParams: NodeParams[]) => {
    const initialValues: ICommonObject = {}

    for (let i = 0; i < nodeParams.length; i++) {
        const input = nodeParams[i]!

        // Load from nodeParams default values
        initialValues[input.name] = input.default || ''

        // Special case for array, always initialize the item if default is not set
        if (input?.type === 'array' && !input.default) {
            const newObj: ICommonObject = {}
            for (let j = 0; j < input.array!.length; j++) {
                newObj[input.array[j]!.name] = input.array[j]!.default || ''
            }
            initialValues[input.name] = [newObj]
        }
    }

    initialValues.submit = null

    return initialValues
}

export const addAnchors = (nodeData: NodeData, nodes: Nodes, newNodeId: string) => {
    const incoming = nodeData.incoming || 0
    const outgoing = nodeData.outgoing || 0

    const inputAnchors = []
    for (let i = 0; i < incoming; i++) {
        const newInput = {
            id: `${newNodeId}-input-${i}`
        }
        inputAnchors.push(newInput)
    }

    const outputAnchors = []
    for (let i = 0; i < outgoing; i++) {
        const newOutput = {
            id: `${newNodeId}-output-${i}`
        }
        outputAnchors.push(newOutput)
    }

    nodeData.inputAnchors = inputAnchors
    nodeData.outputAnchors = outputAnchors
    nodeData.label = getUniqueNodeLabel(nodeData, nodes)

    if (nodeData.actions && Array.isArray(nodeData.actions)) {
        nodeData.actions = initializeNodeData(nodeData.actions)
    }
    if (nodeData.credentials && Array.isArray(nodeData.credentials)) {
        nodeData.credentials = initializeNodeData(nodeData.credentials)
    }
    if (nodeData.networks && Array.isArray(nodeData.networks)) {
        nodeData.networks = initializeNodeData(nodeData.networks)
    }
    if (nodeData.inputParameters && Array.isArray(nodeData.inputParameters)) {
        nodeData.inputParameters = initializeNodeData(nodeData.inputParameters)
    }

    return nodeData
}

export const getEdgeLabelName = (source: string) => {
    const sourceSplit = source.split('-')
    if (sourceSplit.length && sourceSplit[0]?.includes('ifElse')) {
        const outputAnchorsIndex = sourceSplit[sourceSplit.length - 1]
        return outputAnchorsIndex === '0' ? 'true' : 'false'
    }
    return ''
}

export const checkMultipleTriggers = (nodes: Nodes) => {
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]!
        if (node.data.type === 'webhook' || node.data.type === 'trigger') {
            return true
        }
    }
    return false
}

export const convertDateStringToDateObject = (dateString: string) => {
    if (dateString === undefined || !dateString) return undefined

    const date = moment(dateString)
    if (!date.isValid) return undefined

    // Sat Sep 24 2022 07:30:14
    return new Date(date.year(), date.month(), date.date(), date.hours(), date.minutes())
}

export const getFileName = (fileBase64: string) => {
    const splitDataURI = fileBase64.split(',')
    const filename = splitDataURI[splitDataURI.length - 1]?.split(':')[1]
    return filename
}

export const getFolderName = (base64ArrayStr: string) => {
    try {
        const base64Array = JSON.parse(base64ArrayStr)
        const filenames = []
        for (let i = 0; i < base64Array.length; i++) {
            const fileBase64 = base64Array[i]
            const splitDataURI = fileBase64.split(',')
            const filename = splitDataURI[splitDataURI.length - 1].split(':')[1]
            filenames.push(filename)
        }
        return filenames.length ? filenames.join(',') : ''
    } catch (e) {
        return ''
    }
}

export const generateExportFlowData = (flowData: { nodes: Nodes; edges: Edges }) => {
    const nodes = flowData.nodes
    const edges = flowData.edges

    for (let i = 0; i < nodes.length; i++) {
        nodes[i]!.selected = false
        const node = nodes[i]!
        const newNodeData: NodeData = {
            label: node.data.label,
            name: node.data.name,
            type: node.data.type,
            inputAnchors: node.data.inputAnchors,
            outputAnchors: node.data.outputAnchors,
            selected: false
        }
        if (node.data.inputParameters) {
            newNodeData.inputParameters = { ...node.data.inputParameters, submit: null }
            if (node.data.inputParameters.wallet) delete newNodeData.inputParameters.wallet
        }
        if (node.data.actions) {
            newNodeData.actions = { ...node.data.actions, submit: null }
            if (node.data.actions.wallet) delete newNodeData.actions.wallet
        }
        if (node.data.networks) {
            newNodeData.networks = { ...node.data.networks, submit: null }
            if (node.data.networks.wallet) delete newNodeData.networks.wallet
        }
        if (node.data.credentials && node.data.credentials.credentialMethod) {
            newNodeData.credentials = { credentialMethod: node.data.credentials.credentialMethod, submit: null }
            if (node.data.credentials.wallet) delete newNodeData.credentials?.wallet
        }

        nodes[i]!.data = newNodeData
    }
    const exportJson = {
        nodes,
        edges
    }
    return exportJson
}

const isHideRegisteredCredential = (params: NodeParams[], paramsType: 'actions' | 'credentials' | 'networks', nodeFlowData: NodeData) => {
    if (!nodeFlowData[paramsType] || !nodeFlowData[paramsType]?.['credentialMethod']) {
        return undefined
    }
    let clonedParams = params

    for (let i = 0; i < clonedParams.length; i++) {
        const input = clonedParams[i]!
        if (input.type === 'options') {
            const selectedCredentialMethodOption = input.options.find((opt) => opt.name === nodeFlowData[paramsType]?.['credentialMethod'])
            if (
                selectedCredentialMethodOption &&
                selectedCredentialMethodOption !== undefined &&
                selectedCredentialMethodOption.hideRegisteredCredential
            )
                return true
        }
    }
    return false
}

export const handleCredentialParams = (
    nodeParams: NodeParams[],
    paramsType: 'actions' | 'credentials' | 'networks',
    reorganizedParams: NodeParams[],
    nodeFlowData: NodeData
) => {
    if (
        paramsType === 'credentials' &&
        nodeParams.find((nPrm) => nPrm.name === 'registeredCredential') === undefined &&
        nodeParams.find((nPrm) => nPrm.name === 'credentialMethod') !== undefined &&
        !isHideRegisteredCredential(lodash.cloneDeep(reorganizedParams), paramsType, nodeFlowData)
    ) {
        // Add hard-coded registeredCredential params
        nodeParams.push({
            name: 'registeredCredential'
        })
    } else if (
        paramsType === 'credentials' &&
        nodeParams.find((nPrm) => nPrm.name === 'registeredCredential') !== undefined &&
        nodeParams.find((nPrm) => nPrm.name === 'credentialMethod') !== undefined &&
        isHideRegisteredCredential(lodash.cloneDeep(reorganizedParams), paramsType, nodeFlowData)
    ) {
        // Delete registeredCredential params
        nodeParams = nodeParams.filter((prm) => prm.name !== 'registeredCredential')
    } else if (paramsType === 'credentials' && nodeParams.find((nPrm) => nPrm.name === 'credentialMethod') === undefined) {
        // Delete registeredCredential params
        nodeParams = nodeParams.filter((prm) => prm.name !== 'registeredCredential')
    }
    return nodeParams
}

export const copyToClipboard = (e: { src: string | [] | object }) => {
    const src = e.src
    if (Array.isArray(src) || typeof src === 'object') {
        navigator.clipboard.writeText(JSON.stringify(src, null, '  '))
    } else {
        navigator.clipboard.writeText(src)
    }
}
