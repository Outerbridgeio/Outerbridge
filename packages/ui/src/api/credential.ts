import { client } from './client'
import { ICredential } from 'outerbridge-components'

export const getCredentials = (nodeCredentialName: string) => client.get('/credentials', { params: { nodeCredentialName } })

export const getCredentialParams = (name: string) => client.get(`/node-credentials/${name}`)

export const getSpecificCredential = (id: string, isEncrypted: boolean) => client.get(`/credentials/${id}`, { params: { isEncrypted } })

export const createNewCredential = (credentialBody: ICredential) => client.post(`/credentials`, credentialBody)

export const updateCredential = (id: string, credentialBody: ICredential) => client.put(`/credentials/${id}`, credentialBody)

export const deleteCredential = (id: string) => client.delete(`/credentials/${id}`)
