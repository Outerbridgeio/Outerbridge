import client from "./client";

const getAllExecutions = () => client.get("/executions");

const getSpecificExecution = (shortId) => client.get(`/executions/${shortId}`);

const createNewExecution = (body) => client.post(`/executions`, body);

const updateExecution = (shortId, body) => client.put(`/executions/${shortId}`, body);

export default {
    getAllExecutions,
    getSpecificExecution,
    createNewExecution,
    updateExecution,
};
