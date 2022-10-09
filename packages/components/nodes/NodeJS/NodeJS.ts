import { ICommonObject, INode, INodeData, INodeExecutionData, INodeParams, NodeType } from '../../src/Interface'
import { returnNodeExecutionData } from '../../src/utils'
import { NodeVM } from 'vm2'

class NodeJS implements INode {
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
        this.label = 'NodeJS'
        this.name = 'nodeJS'
        this.icon = 'nodejs.png'
        this.type = 'action'
        this.version = 1.0
        this.description = 'Execute code within NodeVM sandbox'
        this.incoming = 1
        this.outgoing = 1
        this.inputParameters = [
            {
                label: 'Code',
                name: 'code',
                type: 'code',
                default: `console.info($nodeData);\nconst example = 'Hello World!';\nreturn example;`,
                description: 'Custom code to run'
            },
            {
                label: 'External Modules',
                name: 'external',
                type: 'json',
                placeholder: '["axios"]',
                description: 'Import installed dependencies within Outerbridge',
                optional: true
            }
        ] as INodeParams[]
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        const inputParametersData = nodeData.inputParameters

        if (inputParametersData === undefined) {
            throw new Error('Required data missing')
        }

        const returnData: ICommonObject[] = []

        // Global object
        const sandbox = {
            $nodeData: nodeData
        }

        const options = {
            console: 'inherit',
            sandbox,
            require: {
                external: false as boolean | { modules: string[] },
                builtin: ['*']
            }
        } as any

        const code = (inputParametersData.code as string) || ''
        const external = inputParametersData.external as string
        if (external) {
            const deps = JSON.parse(external)
            if (deps && deps.length) {
                options.require.external = {
                    modules: deps
                }
            }
        }

        const vm = new NodeVM(options)

        let responseData: any // tslint:disable-line: no-any

        try {
            if (!code) responseData = []
            else {
                responseData = await vm.run(`module.exports = async function() {${code}}()`, __dirname)
            }
        } catch (e) {
            return Promise.reject(e)
        }

        if (Array.isArray(responseData)) {
            returnData.push(...responseData)
        } else {
            returnData.push(responseData)
        }

        return returnNodeExecutionData(returnData)
    }
}

module.exports = { nodeClass: NodeJS }
