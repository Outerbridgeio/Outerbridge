import { client } from './client'
import { IWallet } from 'outerbridge-components'
import { AxiosResponse } from 'axios'

export const getAllWallets = (): Promise<AxiosResponse<IWallet[], any>> => client.get('/wallets')

export const getSpecificWallet = (id: string) => client.get(`/wallets/${id}`)

export const createNewWallet = (body: WalletBody): Promise<AxiosResponse<IWallet, any>> => client.post(`/wallets`, body)

export const updateWallet = (id: string, body: WalletBody): Promise<AxiosResponse<{ data: WalletBody }, any>> =>
    client.put(`/wallets/${id}`, body)

export const deleteWallet = (id: string): Promise<AxiosResponse<{ data: [] }, any>> => client.delete(`/wallets/${id}`)

export const getWalletCredential = (id: string) => client.get(`/wallets/credential/${id}`)

type WalletBody = {
    network?: string | undefined
    name?: string | undefined
    providerCredential: string
    privateKey?: string | undefined
}
