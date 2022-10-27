import client from './client'

const deleteAllTestWebhooks = () => client.post(`/remove-test-webhooks`)

export default {
    deleteAllTestWebhooks
}
