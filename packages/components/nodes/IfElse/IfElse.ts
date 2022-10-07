import {
    CommonType,
    ICommonObject,
    INode,
    INodeData,
    INodeExecutionData,
    INodeOptionsValue,
    INodeParams,
    NodeType
} from '../../src/Interface'
import { returnNodeExecutionData } from '../../src/utils'

interface ICondition {
    type: string
    value1: CommonType
    operation: string
    value2: CommonType
}

class IfElse implements INode {
    label: string
    name: string
    type: NodeType
    description?: string
    version: number
    icon?: string
    incoming: number
    outgoing: number
    inputParameters?: INodeParams[]

    constructor() {
        this.label = 'If Else'
        this.name = 'ifElse'
        this.icon = 'ifelse.svg'
        this.version = 1.0
        this.type = 'action'
        this.description = 'Split flows according to conditions set'
        this.incoming = 1
        this.outgoing = 2
        this.inputParameters = [
            {
                label: 'Mode',
                name: 'mode',
                type: 'options',
                options: [
                    {
                        label: 'AND',
                        name: 'and',
                        description: 'When all conditions are met'
                    },
                    {
                        label: 'OR',
                        name: 'or',
                        description: 'When any of the conditions is met'
                    }
                ],
                default: 'or',
                description: 'Type of conditions'
            },
            {
                label: 'Conditions',
                name: 'conditions',
                type: 'array',
                description: 'Values to compare',
                array: [
                    {
                        label: 'Type',
                        name: 'type',
                        type: 'options',
                        options: [
                            {
                                label: 'String',
                                name: 'string'
                            },
                            {
                                label: 'Number',
                                name: 'number'
                            },
                            {
                                label: 'Boolean',
                                name: 'boolean'
                            }
                        ],
                        default: 'string'
                    },
                    /////////////////////////////////////// STRING ////////////////////////////////////////
                    {
                        label: 'Value 1',
                        name: 'value1',
                        type: 'string',
                        default: '',
                        description: 'First value to be compared with',
                        show: {
                            'inputParameters.conditions[$index].type': ['string']
                        }
                    },
                    {
                        label: 'Operation',
                        name: 'operation',
                        type: 'options',
                        options: [
                            {
                                label: 'Contains',
                                name: 'contains'
                            },
                            {
                                label: 'Ends With',
                                name: 'endsWith'
                            },
                            {
                                label: 'Equal',
                                name: 'equal'
                            },
                            {
                                label: 'Not Contains',
                                name: 'notContains'
                            },
                            {
                                label: 'Not Equal',
                                name: 'notEqual'
                            },
                            {
                                label: 'Regex',
                                name: 'regex'
                            },
                            {
                                label: 'Starts With',
                                name: 'startsWith'
                            },
                            {
                                label: 'Is Empty',
                                name: 'isEmpty'
                            }
                        ],
                        default: 'equal',
                        description: 'Type of operation',
                        show: {
                            'inputParameters.conditions[$index].type': ['string']
                        }
                    },
                    {
                        label: 'Value 2',
                        name: 'value2',
                        type: 'string',
                        default: '',
                        description: 'Second value to be compared with',
                        show: {
                            'inputParameters.conditions[$index].type': ['string']
                        }
                    },
                    /////////////////////////////////////// NUMBER ////////////////////////////////////////
                    {
                        label: 'Value 1',
                        name: 'value1',
                        type: 'number',
                        default: '',
                        description: 'First value to be compared with',
                        show: {
                            'inputParameters.conditions[$index].type': ['number']
                        }
                    },
                    {
                        label: 'Operation',
                        name: 'operation',
                        type: 'options',
                        options: [
                            {
                                label: 'Smaller',
                                name: 'smaller'
                            },
                            {
                                label: 'Smaller Equal',
                                name: 'smallerEqual'
                            },
                            {
                                label: 'Equal',
                                name: 'equal'
                            },
                            {
                                label: 'Not Equal',
                                name: 'notEqual'
                            },
                            {
                                label: 'Larger',
                                name: 'larger'
                            },
                            {
                                label: 'Larger Equal',
                                name: 'largerEqual'
                            },
                            {
                                label: 'Is Empty',
                                name: 'isEmpty'
                            }
                        ],
                        default: 'equal',
                        description: 'Type of operation',
                        show: {
                            'inputParameters.conditions[$index].type': ['number']
                        }
                    },
                    {
                        label: 'Value 2',
                        name: 'value2',
                        type: 'number',
                        default: 0,
                        description: 'Second value to be compared with',
                        show: {
                            'inputParameters.conditions[$index].type': ['number']
                        }
                    },
                    /////////////////////////////////////// BOOLEAN ////////////////////////////////////////
                    {
                        label: 'Value 1',
                        name: 'value1',
                        type: 'boolean',
                        default: false,
                        description: 'First value to be compared with',
                        show: {
                            'inputParameters.conditions[$index].type': ['boolean']
                        }
                    },
                    {
                        label: 'Operation',
                        name: 'operation',
                        type: 'options',
                        options: [
                            {
                                label: 'Equal',
                                name: 'equal'
                            },
                            {
                                label: 'Not Equal',
                                name: 'notEqual'
                            }
                        ],
                        default: 'equal',
                        description: 'Type of operation',
                        show: {
                            'inputParameters.conditions[$index].type': ['boolean']
                        }
                    },
                    {
                        label: 'Value 2',
                        name: 'value2',
                        type: 'boolean',
                        default: false,
                        description: 'Second value to be compared with',
                        show: {
                            'inputParameters.conditions[$index].type': ['boolean']
                        }
                    }
                ]
            }
        ]
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        const inputParametersData = nodeData.inputParameters

        if (inputParametersData === undefined) {
            throw new Error('Required data missing')
        }

        let returnDataTrue: ICommonObject = {}
        let returnDataFalse: ICommonObject = {}

        const mode = inputParametersData.mode as string

        const compareOperationFunctions: {
            [key: string]: (value1: CommonType, value2: CommonType) => boolean
        } = {
            contains: (value1: CommonType, value2: CommonType) => (value1 || '').toString().includes((value2 || '').toString()),
            notContains: (value1: CommonType, value2: CommonType) => !(value1 || '').toString().includes((value2 || '').toString()),
            endsWith: (value1: CommonType, value2: CommonType) => (value1 as string).endsWith(value2 as string),
            equal: (value1: CommonType, value2: CommonType) => value1 === value2,
            notEqual: (value1: CommonType, value2: CommonType) => value1 !== value2,
            larger: (value1: CommonType, value2: CommonType) => (value1 || 0) > (value2 || 0),
            largerEqual: (value1: CommonType, value2: CommonType) => (value1 || 0) >= (value2 || 0),
            smaller: (value1: CommonType, value2: CommonType) => (value1 || 0) < (value2 || 0),
            smallerEqual: (value1: CommonType, value2: CommonType) => (value1 || 0) <= (value2 || 0),
            startsWith: (value1: CommonType, value2: CommonType) => (value1 as string).startsWith(value2 as string),
            isEmpty: (value1: CommonType) => [undefined, null, ''].includes(value1 as string)
        }

        const conditions = inputParametersData.conditions as unknown as ICondition[]
        let score = 0
        const metConditions = []
        const unmetConditions = []

        for (const condition of conditions) {
            const value1 = condition.value1
            const value2 = condition.value2
            const operation = condition.operation

            const compareOperationResult = compareOperationFunctions[operation](value1, value2)
            if (compareOperationResult) {
                score += 1
                metConditions.push({ value1, operation, value2 })
            } else {
                unmetConditions.push({ value1, operation, value2 })
            }
        }

        const data = {
            mode,
            metConditions,
            unmetConditions
        }

        if (mode === 'or') {
            if (score > 0) returnDataTrue = data
            else returnDataFalse = data
        } else if (mode === 'and') {
            if (score === conditions.length) returnDataTrue = data
            else returnDataFalse = data
        }

        const returnData = [returnDataTrue, returnDataFalse]

        return returnNodeExecutionData(returnData)
    }
}

module.exports = { nodeClass: IfElse }
