import client from "./client";

const deleteAllTestWebhooks = (workflowShortId) => client.delete(`/remove-webhook/${workflowShortId}`);

export default {
    deleteAllTestWebhooks,
};
