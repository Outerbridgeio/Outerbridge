import { client } from './client'

export type CredentialParams = {
    credentials: {
        label: string
        name: string
        type: 'string'
        default: string
    }[]
}

export type Credential = { _id: string; name: string }

export type CredentialBody = {
    name: string
    nodeCredentialName: string
    credentialData: Record<string, unknown>
}

export type CredentialData = { name: string; credentialData: Record<string, unknown> }

export const getCredentials = (nodeCredentialName: string) => client.get<Credential[]>('/credentials', { params: { nodeCredentialName } })

export const getCredentialParams = (name: string) => client.get<CredentialParams>(`/node-credentials/${name}`)

export const getSpecificCredential = (id: string, isEncrypted: boolean) =>
    client.get<CredentialData>(`/credentials/${id}`, { params: { isEncrypted } })

export const createNewCredential = (credentialBody: CredentialBody) => client.post<Credential>(`/credentials`, credentialBody)

export const updateCredential = (id: string, credentialBody: CredentialBody) => client.put<Credential>(`/credentials/${id}`, credentialBody)

export const deleteCredential = (id: string) => client.delete(`/credentials/${id}`)
