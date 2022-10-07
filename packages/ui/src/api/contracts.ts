import { client } from './client';
import { IContract } from 'outerbridge-components';
import { IContractRequestBody } from 'outerbridge';

export const getAllContracts = () => client.get('/contracts');

export const getSpecificContract = (id: string) => client.get(`/contracts/${id}`);

export const createNewContract = (body: IContract) => client.post(`/contracts`, body);

export const updateContract = (id: string, body: IContract) => client.put(`/contracts/${id}`, body);

export const getContractABI = (body: IContractRequestBody) => client.post(`/contracts/getabi`, body);

export const deleteContract = (id: string) => client.delete(`/contracts/${id}`);
