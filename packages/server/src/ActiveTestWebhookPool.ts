import { INodeData } from 'outerbridge-components';
import {
    IActiveTestWebhookPool, IComponentNodesPool, IReactFlowEdge, IReactFlowNode, WebhookMethod
} from './Interface';

/**
 * This pool is to keep track of active test webhooks,
 * so we can clear the webhooks whenever user refresh or exit page
 */
export class ActiveTestWebhookPool {

    activeTestWebhooks: IActiveTestWebhookPool = {};

    /**
	 * Add to the pool
     * @param {string} webhookEndpoint
     * @param {WebhookMethod} httpMethod
     * @param {IReactFlowNode[]} nodes
     * @param {IReactFlowEdge[]} edges
     * @param {INodeData} nodeData
     * @param {string} clientId
     * @param {boolean} isTestWorkflow
     * @param {string} webhookId
	 */
    add(  
        webhookEndpoint: string, 
        httpMethod: WebhookMethod,
        nodes: IReactFlowNode[],
        edges: IReactFlowEdge[],
        nodeData: INodeData,
        webhookNodeId: string,
        clientId: string,
        isTestWorkflow: boolean,
        webhookId?: string,
    ) {
        const key = `${webhookEndpoint}_${httpMethod}`;
        this.activeTestWebhooks[key] = {
            nodes,
            edges,
            nodeData,
            clientId,
            webhookNodeId,
            isTestWorkflow,
            webhookId
        };
	}

    
    /**
     * Remove all webhooks from the pool
     * @param {IComponentNodesPool} componentNodes
     */
    async removeAll(componentNodes: IComponentNodesPool) {
        const toBeDeleted: string[] = [];
        for (const key in this.activeTestWebhooks) {
            const { nodeData, webhookId } = this.activeTestWebhooks[key];
            const nodeName = nodeData.name;
            const webhookNodeInstance = componentNodes[nodeName];
           
            // Delete webhook from 3rd party apps
            if (webhookId) {
                await webhookNodeInstance.webhookMethods?.deleteWebhook(nodeData, webhookId);
            }

            toBeDeleted.push(key);
        }
        
        for (const key in toBeDeleted) {
            delete this.activeTestWebhooks[key];
        }
    }


    /**
     * Remove single webhook from the pool
     * @param {string} testWebhookKey
     * @param {IComponentNodesPool} componentNodes
     */
     async remove(testWebhookKey: string, componentNodes: IComponentNodesPool) {
        if (Object.prototype.hasOwnProperty.call(this.activeTestWebhooks, testWebhookKey)) {
            const { nodeData, webhookId } = this.activeTestWebhooks[testWebhookKey];
            const nodeName = nodeData.name;
            const webhookNodeInstance = componentNodes[nodeName];
           
            // Delete webhook from 3rd party apps
            if (webhookId) {
                await webhookNodeInstance.webhookMethods?.deleteWebhook(nodeData, webhookId);
            }

            delete this.activeTestWebhooks[testWebhookKey];
        }
    }
}