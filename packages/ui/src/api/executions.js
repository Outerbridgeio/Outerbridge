import client from './client'

const getAllExecutions = () => client.get('/executions')

const getSpecificExecution = (shortId) => client.get(`/executions/${shortId}`)

const createNewExecution = (body) => client.post(`/executions`, body) //body: IExecution

const updateExecution = (shortId, body) => client.put(`/executions/${shortId}`, body) //body: IExecution

const deleteExecution = (shortId) => client.delete(`/executions/${shortId}`)

export default {
    getAllExecutions,
    getSpecificExecution,
    createNewExecution,
    updateExecution,
    deleteExecution
}
