import { INodeData } from 'outerbridge-components';
import {
    IActiveTestTriggerPool, IComponentNodesPool
} from './Interface';

/**
 * This pool is to keep track of active test triggers (event listeners),
 * so we can clear the event listeners whenever user refresh or exit page
 */
export class ActiveTestTriggerPool {

    activeTestTriggers: IActiveTestTriggerPool = {};

    /**
	 * Add to the pool
     * @param {string} nodeName
     * @param {INodeData} nodeData
	 */
    add(nodeName: string, nodeData: INodeData) {
        this.activeTestTriggers[nodeName] = nodeData;
	}

    
    /**
     * Remove all triggers from the pool
     * @param {IComponentNodesPool} componentNodes
     */
    async removeAll(componentNodes: IComponentNodesPool) {
        const toBeDeleted: string[] = [];
        for (const nodeName in this.activeTestTriggers) {
            const triggerNodeInstance = componentNodes[nodeName];
            await triggerNodeInstance.removeTrigger!.call(triggerNodeInstance, this.activeTestTriggers[nodeName]);
            toBeDeleted.push(nodeName);
        }
        
        for (const nodeName in toBeDeleted) {
            delete this.activeTestTriggers[nodeName];
        }
    }


    /**
     * Remove single trigger from the pool
     * @param {string} nodeName
     * @param {IComponentNodesPool} componentNodes
     */
     async remove(nodeName: string, componentNodes: IComponentNodesPool) {
        if (Object.prototype.hasOwnProperty.call(this.activeTestTriggers, nodeName)) {
            const triggerNodeInstance = componentNodes[nodeName];
            await triggerNodeInstance.removeTrigger!.call(triggerNodeInstance, this.activeTestTriggers[nodeName]);
            delete this.activeTestTriggers[nodeName];
        }
    }
}