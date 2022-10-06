import client from './client';

const getCredentials = (nodeCredentialName) => client.get('/credentials', { params: { nodeCredentialName } });

const getCredentialParams = (name) => client.get(`/node-credentials/${name}`);

const getSpecificCredential = (id, isEncrypted) => client.get(`/credentials/${id}`, { params: { isEncrypted } });

const createNewCredential = (credentialBody) => client.post(`/credentials`, credentialBody); //credentialBody: ICredential

const updateCredential = (id, credentialBody) => client.put(`/credentials/${id}`, credentialBody); //credentialBody: ICredential

const deleteCredential = (id) => client.delete(`/credentials/${id}`);

export default {
    getCredentials,
    getCredentialParams,
    getSpecificCredential,
    createNewCredential,
    updateCredential,
    deleteCredential
};
