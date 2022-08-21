import lodash from 'lodash';
import moment from 'moment';

export const numberOrExpressionRegex = /^(\d+\.?\d*|{{.*}})$/; //return true if string consists only numbers OR expression {{}}

export const constructNodeDirectedGraph = (nodes, edges, reverse=false) => {

    const graph = {};
    const nodeDependencies = {};

    // Initialize node dependencies and graph
    for (let i = 0; i < nodes.length; i+=1 ) {
        const nodeId = nodes[i].id;
        nodeDependencies[nodeId] = 0;
        graph[nodeId] = [];
    }

    for (let i = 0; i < edges.length; i+=1 ) {
        const source = edges[i].source;
        const target = edges[i].target;

        if (Object.prototype.hasOwnProperty.call(graph, source)) {
            graph[source].push(target);
        } else {
            graph[source] = [target];
        }

        if (reverse) {
            if (Object.prototype.hasOwnProperty.call(graph, target)) {
                graph[target].push(source);
            } else {
                graph[target] = [source];
            }
        }

        nodeDependencies[target] += 1;
    }

    return { graph, nodeDependencies };
}

// Find starting node with 0 dependencies
export const findStartingNodeIds = (nodes, nodeDependencies) => {
    const startingNodeIds = [];
    Object.keys(nodeDependencies).forEach((nodeId) => {
        if (nodeDependencies[nodeId] === 0) {
            const node = nodes.find((nd) => nd.id === nodeId);
            if (node && node.data && node.data.type && (node.data.type === 'trigger' || node.data.type === 'webhook')) {
                startingNodeIds.push(nodeId);
            }
        }
    });

    return startingNodeIds;
}

// Backtrack function to find all paths from start to target node
export const getAllPathsFromStartToTarget = (startNodeId, targetNodeId, graph) => {
    const paths = [];
    const visitedNodeIds = new Set();

    const DFS = (currentNodeId, endNodeId, tempPath) => {
        if (currentNodeId === endNodeId) {
            paths.push(lodash.cloneDeep(tempPath));
            return;
        }

        const neighbourNodeIds = graph[currentNodeId];
        visitedNodeIds.add(currentNodeId);

        for (let i = 0; i < neighbourNodeIds.length; i+=1 ) {
            const neighNodeId = neighbourNodeIds[i];
            if (!visitedNodeIds.has(neighNodeId)) {
                tempPath.push(neighNodeId);
                DFS(neighNodeId, endNodeId, tempPath);
                tempPath.pop();
            }
        }
        visitedNodeIds.delete(currentNodeId);
    }

    DFS(startNodeId, targetNodeId, [startNodeId]);
    return paths;
}

// Breadth First Search to get all connected parent nodes from target
export const getAllConnectedNodesFromTarget = (targetNodeId, edges, graph) => {

    const nodeQueue = [];
    const exploredNodes = [];

    nodeQueue.push(targetNodeId);
    exploredNodes.push(targetNodeId);

    while (nodeQueue.length) {

        const nodeId = nodeQueue.shift() || '';
        const parentNodeIds = [];

        const inputEdges = edges.filter((edg) => (edg.target === nodeId && edg.targetHandle.includes('-input-')));
        if (inputEdges && inputEdges.length) {
            for (let j = 0; j < inputEdges.length; j+=1 ) {
                parentNodeIds.push(inputEdges[j].source);
            }
        }

        const neighbourNodeIds = graph[nodeId];

        for (let i = 0; i < neighbourNodeIds.length; i+=1 ) {
            const neighNodeId = neighbourNodeIds[i];
            if (parentNodeIds.includes(neighNodeId)) {
                if (!exploredNodes.includes(neighNodeId)) {
                    exploredNodes.push(neighNodeId);
                    nodeQueue.push(neighNodeId);
                }
            }
        }
    };
    return exploredNodes;
}

export const getAvailableNodeIdsForVariable = (nodes, edges, targetNodeId) => {
    const { graph } = constructNodeDirectedGraph(nodes, edges, true);
    const exploreNodes = getAllConnectedNodesFromTarget(targetNodeId, edges, graph);
    const setPath = new Set(exploreNodes);
    setPath.delete(targetNodeId);
    return [...setPath];
}

export const generateWebhookEndpoint = () => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const webhookEndpoint = Array.from({ length: 15 }).map(() => {
        return characters.charAt(
            Math.floor(Math.random() * characters.length),
        );
    }).join('');
    return webhookEndpoint;
}

export const getUniqueNodeId = (nodeData, nodes) => {

    // Get amount of same nodes
    let totalSameNodes = 0;
    for (let i = 0; i < nodes.length; i+=1 ) {
        const node = nodes[i];
        if (node.data.name === nodeData.name) {
            totalSameNodes += 1;
        }
    }

    // Get unique id
    let nodeId = `${nodeData.name}_${totalSameNodes}`;
    for (let i = 0; i < nodes.length; i+=1 ) {
        const node = nodes[i];
        if (node.id === nodeId) {
            totalSameNodes += 1;
            nodeId = `${nodeData.name}_${totalSameNodes}`;
        }
    }
    return nodeId;
};

const getUniqueNodeLabel = (nodeData, nodes) => {

    // Get amount of same nodes
    let totalSameNodes = 0;
    for (let i = 0; i < nodes.length; i+=1 ) {
        const node = nodes[i];
        if (node.data.name === nodeData.name) {
            totalSameNodes += 1;
        }
    }

    // Get unique label
    let nodeLabel = `${nodeData.label}_${totalSameNodes}`;
    for (let i = 0; i < nodes.length; i+=1 ) {
        const node = nodes[i];
        if (node.data.label === nodeLabel) {
            totalSameNodes += 1;
            nodeLabel = `${nodeData.label}_${totalSameNodes}`;
        }
    }
    return totalSameNodes === 0 ? nodeData.label : nodeLabel;
};

export const checkIfNodeLabelUnique = (nodeLabel, nodes) => {
    for (let i = 0; i < nodes.length; i+=1 ) {
        const node = nodes[i];
        if (node.data.label === nodeLabel) {
            return false;
        }
    }
    return true;
};

export const initializeNodeData = (nodeParams) => {

    const initialValues = {};

    for (let i = 0; i < nodeParams.length; i+= 1) {
        const input = nodeParams[i];

        // Load from nodeParams default values
        initialValues[input.name] = input.default || ''; 

        // Special case for array, always initialize the item if default is not set
        if (input.type === 'array' && !input.default) {
            const newObj = {};
            for (let j = 0; j < input.array.length; j+= 1) {
                newObj[input.array[j].name] = input.array[j].default || '';
            }
            initialValues[input.name] = [newObj];
        }
    }
    
    initialValues.submit = null;
    
    return initialValues;
};

export const addAnchors = (nodeData, nodes, newNodeId) => {
    const incoming = nodeData.incoming || 0;
    const outgoing = nodeData.outgoing || 0;

    const inputAnchors = [];
    for (let i = 0; i < incoming; i+=1 ) {
        const newInput = {
            id: `${newNodeId}-input-${i}`
        };
        inputAnchors.push(newInput);
    }

    const outputAnchors = [];
    for (let i = 0; i < outgoing; i+=1 ) {
        const newOutput = {
            id: `${newNodeId}-output-${i}`
        };
        outputAnchors.push(newOutput);
    }
    
    nodeData.inputAnchors = inputAnchors;
    nodeData.outputAnchors = outputAnchors;
    nodeData.label = getUniqueNodeLabel(nodeData, nodes);
    
    if (nodeData.actions) nodeData.actions = initializeNodeData(nodeData.actions);
    if (nodeData.credentials) nodeData.credentials = initializeNodeData(nodeData.credentials);
    if (nodeData.networks) nodeData.networks = initializeNodeData(nodeData.networks);
    if (nodeData.inputParameters) nodeData.inputParameters = initializeNodeData(nodeData.inputParameters);

    return nodeData;
};

export const getEdgeLabelName = (source) => {
    const sourceSplit = source.split("-");
    if (sourceSplit.length && sourceSplit[0].includes('ifElse')) {
        const outputAnchorsIndex = sourceSplit[sourceSplit.length-1];
        return outputAnchorsIndex === '0' ? 'true' : 'false';
    }
    return '';
};

export const checkMultipleTriggers = (nodes) => {
    for (let i = 0; i < nodes.length; i+=1 ) {
        const node = nodes[i];
        if (node.data.type === 'webhook' || node.data.type === 'trigger') {
            return true;
        }
    }
    return false;
};

export const convertDateStringToDateObject = (dateString) => {
    if (dateString === undefined || !dateString) return undefined;

    const date = moment(dateString);
    if (!date.isValid) return undefined;

    // Sat Sep 24 2022 07:30:14
    return new Date(date.year(), date.month(), date.date(), date.hours(), date.minutes());
}

export const getFileName = (fileBase64) => {
    const splitDataURI = fileBase64.split(',');
    const filename = splitDataURI[splitDataURI.length-1].split(':')[1];
    return filename;
}

export const getFolderName = (base64ArrayStr) => {
    try {
        const base64Array = JSON.parse(base64ArrayStr);
        const filenames = [];
        for (let i = 0; i < base64Array.length; i+=1 ) {
            const fileBase64 = base64Array[i];
            const splitDataURI = fileBase64.split(',');
            const filename = splitDataURI[splitDataURI.length-1].split(':')[1];
            filenames.push(filename);
        }
        return filenames.length ? filenames.join(',') : '';
    } catch(e) {
        return '';
    }
}

export const generateExportFlowData = (flowData) => {
    const nodes = flowData.nodes;
    const edges = flowData.edges;
    
    for (let i = 0; i < nodes.length; i+=1 ) {
        nodes[i].selected = false;
        const node = nodes[i];
        const newNodeData = {
            label: node.data.label,
            name: node.data.name,
            type: node.data.type,
            inputAnchors: node.data.inputAnchors,
            outputAnchors: node.data.outputAnchors,
            selected: false,
        }
        nodes[i].data = newNodeData;
    }
    const exportJson = {
        nodes,
        edges
    };
    return exportJson;
}

const isHideRegisteredCredential = (params, paramsType, nodeFlowData) => {

    if (!nodeFlowData[paramsType] || !nodeFlowData[paramsType]['credentialMethod']) return undefined;
    let clonedParams = params;

    for (let i = 0; i < clonedParams.length; i+= 1) {
        const input = clonedParams[i];
        if (input.type === 'options') {
            const selectedCredentialMethodOption = input.options.find((opt) => opt.name === nodeFlowData[paramsType]['credentialMethod']);
            if (
                selectedCredentialMethodOption && 
                selectedCredentialMethodOption !== undefined && 
                selectedCredentialMethodOption.hideRegisteredCredential
            ) return true;
        }
    }
    return false;
};

export const handleCredentialParams = (nodeParams, paramsType, reorganizedParams, nodeFlowData) => {
    if (
        paramsType === 'credentials' && 
        nodeParams.find((nPrm) => nPrm.name === 'registeredCredential') === undefined &&
        nodeParams.find((nPrm) => nPrm.name === 'credentialMethod') !== undefined &&
        !isHideRegisteredCredential(lodash.cloneDeep(reorganizedParams), paramsType, nodeFlowData)
    ) {
        // Add hard-coded registeredCredential params
        nodeParams.push({
            name: 'registeredCredential',
        });

    } else if (
        paramsType === 'credentials' && 
        nodeParams.find((nPrm) => nPrm.name === 'registeredCredential') !== undefined &&
        nodeParams.find((nPrm) => nPrm.name === 'credentialMethod') !== undefined &&
        isHideRegisteredCredential(lodash.cloneDeep(reorganizedParams), paramsType, nodeFlowData)
    ) {
        // Delete registeredCredential params
        nodeParams = nodeParams.filter((prm) => prm.name !== 'registeredCredential');

    } else if (
        paramsType === 'credentials' && 
        nodeParams.find((nPrm) => nPrm.name === 'credentialMethod') === undefined
    ) {
        // Delete registeredCredential params
        nodeParams = nodeParams.filter((prm) => prm.name !== 'registeredCredential');
    }
    return nodeParams;
}