import { client } from './client';
import { IWallet } from 'outerbridge-components';

export const getAllWallets = () => client.get('/wallets');

export const getSpecificWallet = (id: string) => client.get(`/wallets/${id}`);

export const createNewWallet = (body: IWallet) => client.post(`/wallets`, body);

export const updateWallet = (id: string, body: IWallet) => client.put(`/wallets/${id}`, body);

export const deleteWallet = (id: string) => client.delete(`/wallets/${id}`);

export const getWalletCredential = (id: string) => client.get(`/wallets/credential/${id}`);
