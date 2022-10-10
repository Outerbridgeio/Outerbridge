import { client } from './client'
import { ITestNodeBody } from 'outerbridge'
import { INodeData } from 'outerbridge-components'

export const getAllNodes = () => client.get('/nodes')

export const getSpecificNode = (name: string) => client.get(`/nodes/${name}`)

export const testNode = (name: string, body: ITestNodeBody) => client.post(`/node-test/${name}`, body)

export const loadMethodNode = (name: string, nodeData: INodeData) => client.post(`/node-load-method/${name}`, nodeData)

export const removeTestTriggers = () => client.post(`/remove-test-triggers`)
