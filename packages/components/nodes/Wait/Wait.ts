import {
    ICommonObject,
	INode, 
    INodeData, 
    INodeExecutionData, 
    INodeOptionsValue, 
    INodeParams, 
    NodeType,
} from '../../src/Interface';
import {
    returnNodeExecutionData
} from '../../src/utils';

class Wait implements INode {

    label: string;
    name: string;
    type: NodeType;
    description?: string;
    version: number;
	icon?: string;
    incoming: number;
	outgoing: number;
    inputParameters?: INodeParams[];

	constructor() {
	
		this.label = 'Wait';
		this.name = 'wait';
		this.icon = 'wait.svg';
        this.type = 'action';
		this.version =  1.0;
		this.description = 'Wait before continuing with the execution',
		this.incoming = 1;
        this.outgoing = 1;
		this.inputParameters = [
            {
				label: 'Unit',
				name: 'unit',
				type: 'options',
				options: [
					{
						label: 'Seconds',
						name: 'seconds',
					},
					{
						label: 'Minutes',
						name: 'minutes',
					},
					{
						label: 'Hours',
						name: 'hours',
					},
					{
						label: 'Days',
						name: 'days',
					},
				],
				default: 'seconds',
				description: 'The time unit of the duration to wait',
			},
			{
				label: 'Duration',
				name: 'duration',
				type: 'number',
				default: 10,
				description: 'Duration to wait before continuing with the execution',
			},
		];
	}

	
	async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {

        const inputParametersData = nodeData.inputParameters;

        if (inputParametersData === undefined) {
            throw new Error('Required data missing');
        }

        const startWaitDate = new Date().toUTCString();

		const unit = inputParametersData.unit as string;

        let duration = inputParametersData.duration as number || 1;

        if (unit === 'minutes') {
            duration *= 60;
        }
        if (unit === 'hours') {
            duration *= 60 * 60;
        }
        if (unit === 'days') {
            duration *= 60 * 60 * 24;
        }

		duration *= 1000;

        const endWaitDate = new Date(new Date().getTime() + duration).toUTCString();

        const returnData: ICommonObject[] = [{
            start: startWaitDate,
            end: endWaitDate,
            duration,
            unit
        }];

		return new Promise((resolve, _) => {
            setTimeout(() => {
                resolve(returnNodeExecutionData(returnData));
            }, duration);
        });
	}
}

module.exports = { nodeClass: Wait }