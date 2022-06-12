import client from "./client";

const getAllContracts = () => client.get("/contracts");

const getSpecificContract = (address) => client.get(`/contracts/${address}`);

const createNewContract = (body) => client.post(`/contracts`, body);

const updateContract = (address, body) => client.put(`/contracts/${address}`, body);

export default {
    getAllContracts,
    getSpecificContract,
    createNewContract,
    updateContract,
};
