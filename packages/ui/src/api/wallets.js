import client from "./client";

const getAllWallets = () => client.get("/wallets");

const getSpecificWallet = (id) => client.get(`/wallets/${id}`);

const createNewWallet = (body) => client.post(`/wallets`, body);

const updateWallet = (id, body) => client.put(`/wallets/${id}`, body);

const deleteWallet = (id) => client.delete(`/wallets/${id}`);

const getWalletCredential = (id) => client.get(`/wallets/credential/${id}`);

export default {
    getAllWallets,
    getSpecificWallet,
    createNewWallet,
    updateWallet,
    deleteWallet,
    getWalletCredential
};
