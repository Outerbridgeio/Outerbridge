import client from './client'

const deleteAllTestWebhooks = () => client.post(`/remove-test-webhooks`)
const getTunnelURL = () => client.get(`/get-tunnel-url`)

export default {
    getTunnelURL,
    deleteAllTestWebhooks
}
