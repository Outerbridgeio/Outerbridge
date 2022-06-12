import client from "./client";

const getCredentials = (nodeCredentialName) => client.get("/credentials", { params: { nodeCredentialName } });

const getCredentialParams = (name) => client.get(`/node-credentials/${name}`);

const getSpecificCredential = (id) => client.get(`/credentials/${id}`);

const createNewCredential = (credentialBody) => client.post(`/credentials`, credentialBody);

const updateCredential = (id, credentialBody) => client.put(`/credentials/${id}`, credentialBody);

const deleteCredential = (id) => client.delete(`/credentials/${id}`);

export default {
    getCredentials,
    getCredentialParams,
    getSpecificCredential,
    createNewCredential,
    updateCredential,
    deleteCredential,
};
