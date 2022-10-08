import client from './client';

const getAllContracts = () => client.get('/contracts');

const getSpecificContract = (id) => client.get(`/contracts/${id}`);

const createNewContract = (body) => client.post(`/contracts`, body); // body: IContract

const updateContract = (id, body) => client.put(`/contracts/${id}`, body); // body: IContract

const getContractABI = (body) => client.post(`/contracts/getabi`, body); //body: IContractRequestBody

const deleteContract = (id) => client.delete(`/contracts/${id}`);

export default {
    getAllContracts,
    getSpecificContract,
    createNewContract,
    updateContract,
    getContractABI,
    deleteContract
};
