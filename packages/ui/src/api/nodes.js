import client from "./client";

const getAllNodes = () => client.get("/nodes");

const getSpecificNode = (name) => client.get(`/nodes/${name}`);

const testNode = (name, body) => client.post(`/node-test/${name}`, body);

const loadMethodNode = (name, nodeData) => client.post(`/node-load-method/${name}`, nodeData);

const removeTestTriggers = () => client.post(`/remove-test-triggers`);

export default {
    getAllNodes,
    getSpecificNode,
    testNode,
    loadMethodNode,
    removeTestTriggers,
};
