import { NETWORK, NETWORK_PROVIDER } from '../../src/ChainNetwork'
import { alchemySupportedNetworks, IETHOperation } from '../../src/ETHOperations'

export const subsOperationsNetworks = [...alchemySupportedNetworks]

export const solanaOperationsNetworks = [NETWORK.SOLANA, NETWORK.SOLANA_DEVNET, NETWORK.SOLANA_TESTNET]

export const subscribeOperations = [
    {
        name: 'Eth Subscribe (eth_subscribe)',
        value: 'eth_subscribe',
        parentGroup: 'Subscribe',
        description: 'Starts a subscription to a specific event.',
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: subsOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_subscribe',
            params: []
        },
        inputParameters: `
        <ul>
			<li><code class="inline">subscription name</code>: <code class="inline">string</code> - The type of event you want to subscribe to (i.e., newHeads, logs, pendingTransactions, newPendingTransactions). This method supports the following subscription types:</li>
            <ul>
			    <li><code class="inline">alchemy_pendingTransactions</code> - Returns full transactions that are sent to the network, marked as pending, and are sent from or to a certain address. (NOT supported on Arbitrum and Optimism)</li>
			    <li><code class="inline">newPendingTransactions</code> - Returns the hash for all transactions that are added to the pending state and are signed with a key that is available in the node. (NOT supported on Arbitrum and Optimism)</li>
			    <li><code class="inline">newHeads</code> - Fires a notification each time a new header is appended to the chain, including chain reorganizations.</li>
			    <li><code class="inline">logs</code> - Returns logs that are included in new imported blocks and match the given filter criteria.</li>
            </ul>
            <li><code class="inline">data</code>: <code class="inline">object</code> - (Optional) - Arguments such as an address, multiple addresses, and topics. Note, only logs that are created from these addresses or match the specified topics will return logs.</li>
        </ul>`,
        exampleParameters: `["newHeads"]`
    },
    {
        name: 'Log Subscribe (logSubscribe)',
        value: 'logSubscribe',
        parentGroup: 'Subscribe',
        description: '(Subscription Websocket) Subscribe to transaction logging.',
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            id: 1,
            method: 'logSubscribe',
            params: []
        },
        inputParameters: `
        <ul>
			<li><code class="inline">filters</code>: <code class="inline">Object</code> - filter criteria for the logs to receive results by account type; currently supported mentions:</li>
            <ul>
                <li><code class="inline">mentions</code> - subscribe to all transactions that mention the provided Pubkey (as base-58 encoded string), only accepts one account address</li>
            </ul>
            <li><code class="inline">Object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
                <ul>
                    <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">Processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
            </ul>
        </ul>`,
        exampleParameters: `[
  {
    "mentions": [ "11111111111111111111111111111111" ]
  },
  {
    "commitment": "finalized"
  }
]`
    },
    {
        name: 'Signature Subscribe (signatureSubscribe)',
        value: 'signatureSubscribe',
        parentGroup: 'Subscribe',
        description:
            '(Subscription Websocket) Subscribe to a transaction signature to receive notification when the transaction is confirmed On signatureNotification, the subscription is automatically cancelled.',
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            id: 1,
            method: 'signatureSubscribe',
            params: []
        },
        inputParameters: `
        <ul>
			<li><code class="inline">String</code> - Transaction Signature, as base-58 encoded string</li>
            <li><code class="inline">Object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
                <ul>
                    <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">Processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
            </ul>
        </ul>`,
        exampleParameters: `[
  "51y9Hf2cFzrUPDH24qvL6b6PtPMDGQSX3WwiHsSvkdfGiFTKdoJwGkvqS3gny6XNPLtUtRwGERAs45639EfR5XfT",
  {
    "commitment": "finalized"
  }
]`
    },
    {
        name: 'Slot Subscribe (slotSubscribe)',
        value: 'slotSubscribe',
        parentGroup: 'Subscribe',
        description: '(Subscription Websocket) Subscribe to receive notification anytime a slot is processed by the validator.',
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            id: 1,
            method: 'slotSubscribe',
            params: []
        }
    }
] as IETHOperation[]

export const unsubscribeOperations = [
    {
        name: 'Eth Unsubscribe (eth_unsubscribe)',
        value: 'eth_unsubscribe',
        parentGroup: 'Unsubscribe',
        description: 'Cancels an existing subscription so that no further events are sent.',
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: subsOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_unsubscribe',
            params: []
        }
    },

    {
        name: 'Log Unsubscribe (logUnsubscribe)',
        value: 'logUnsubscribe',
        parentGroup: 'Unsubscribe',
        description: '(Subscription Websocket) Unsubscribe from transaction logging.',
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            id: 1,
            method: 'logUnsubscribe',
            params: []
        }
    },
    {
        name: 'Signature Unsubscribe (signatureUnsubscribe)',
        value: 'signatureUnsubscribe',
        parentGroup: 'Unsubscribe',
        description: '(Subscription Websocket) Unsubscribe from signature confirmation notification.',
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            id: 1,
            method: 'signatureUnsubscribe',
            params: []
        }
    },
    {
        name: 'Slot Unsubscribe (slotUnsubscribe)',
        value: 'slotUnsubscribe',
        parentGroup: 'Unsubscribe',
        description: '(Subscription Websocket) Unsubscribe from slot notifications.',
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            id: 1,
            method: 'slotUnsubscribe',
            params: []
        }
    }
] as IETHOperation[]
