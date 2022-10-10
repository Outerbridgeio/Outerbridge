import { client } from './client'

export const deleteAllTestWebhooks = () => client.post(`/remove-test-webhooks`)
