import { NETWORK_PROVIDER } from "../../src/ChainNetwork";
import { IETHOperation, infuraSupportedNetworks } from "../../src/ETHOperations";

export const subsOperationsNetworks = [
    ...infuraSupportedNetworks,
];

export const subscribeOperations = [
    {
        name: 'Eth Subscribe (eth_subscribe)',
        value: 'eth_subscribe',
        parentGroup: 'Subscribe',
        description: 'Starts a subscription to a specific event.',
        providerNetworks: {
            [NETWORK_PROVIDER.INFURA]: subsOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "id": 1, 
            "method": "eth_subscribe",
            "params":[],
        },
        inputParameters: `
        <ul>
			<li><code class="inline">subscription name</code>: <code class="inline">string</code> - The type of event you want to subscribe to (i.e., newHeads, logs, pendingTransactions, newPendingTransactions). This method supports the following subscription types:</li>
            <ul>
			    <li><code class="inline">syncing</code> - Indicates when the node starts or stops synchronizing. The result can either be a boolean indicating that the synchronization has started (true), finished (false) or an object with various progress indicators. NOT SUPPORTED ON KOVAN!</li>
			    <li><code class="inline">newPendingTransactions</code> - Returns the hash for all transactions that are added to the pending state and are signed with a key that is available in the node. When a transaction that was previously part of the canonical chain isn't part of the new canonical chain after a reogranization its again emitted.</li>
			    <li><code class="inline">newHeads</code> - Subscribing to this, fires a notification each time a new header is appended to the chain, including chain reorganizations. In case of a chain reorganization the subscription will emit all new headers for the new chain. Therefore the subscription can emit multiple headers on the same height.</li>
			    <li><code class="inline">logs</code> - Returns logs that are included in new imported blocks and match the given filter criteria. In case of a chain reorganization previous sent logs that are on the old chain will be resend with the removed property set to true. Logs from transactions that ended up in the new chain are emitted. Therefore a subscription can emit logs for the same transaction multiple times.</li>
                <ul>
                    <li><code class="inline">address</code> - (optional) - either an address or an array of addresses. Only logs that are created from these addresses are returned</li>
                    <li><code class="inline">topics</code> - (optional) - only logs which match the specified topics</li>
                </ul>
            </ul>
            <li><code class="inline">data</code>: <code class="inline">object</code> - (Optional) - Arguments such as an address, multiple addresses, and topics. Note, only logs that are created from these addresses or match the specified topics will return logs.</li>
        </ul>`,
        exampleParameters: `["newHeads"]`,
    },
] as IETHOperation[];


export const unsubscribeOperations = [
    {
        name: 'Eth Unsubscribe (eth_unsubscribe)',
        value: 'eth_unsubscribe',
        parentGroup: 'Unsubscribe',
        description: 'Cancels an existing subscription so that no further events are sent.',
        providerNetworks: {
            [NETWORK_PROVIDER.INFURA]: subsOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "id": 1, 
            "method": "eth_unsubscribe",
            "params":[],
        },
    },
] as IETHOperation[];