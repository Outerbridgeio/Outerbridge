import client from "./client";

const getAllWorkflows = () => client.get("/workflows");

const getSpecificWorkflow = (shortId) => client.get(`/workflows/${shortId}`);

const createNewWorkflow = (body) => client.post(`/workflows`, body);

const updateWorkflow = (shortId, body) => client.put(`/workflows/${shortId}`, body);

const deployWorkflow = (shortId, body) => client.post(`/workflows/deploy/${shortId}`, body || {});

const deleteWorkflow = (shortId) => client.delete(`/workflows/${shortId}`);

export default {
    getAllWorkflows,
    getSpecificWorkflow,
    createNewWorkflow,
    updateWorkflow,
    deployWorkflow,
    deleteWorkflow
};
