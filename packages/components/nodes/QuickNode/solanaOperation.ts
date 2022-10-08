import { NETWORK, NETWORK_PROVIDER } from "../../src/ChainNetwork";
import { IETHOperation } from "../../src/ETHOperations";

export const solanaOperationsNetworks = [
    NETWORK.SOLANA,
    NETWORK.SOLANA_DEVNET,
    NETWORK.SOLANA_TESTNET,
];

export const solanaOperations = [
    {
        name: 'Get Account Info (getAccountInfo)',
        value: 'getAccountInfo',
        parentGroup: 'Account Information',
        description: 'Returns all information associated with the account of provided Pubkey.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getAccountInfo",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">String</code> - Pubkey of account to query, as base-58 encoded string.</li>
            <li><code class="inline">Object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
                <ul>
                    <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">Processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
                <li><code class="inline">encoding</code> - encoding for Account data, either "base58" (slow), "base64", "base64+zstd", or "jsonParsed".</li>
                <li><code class="inline">dataSlice</code> - (optional) limit the returned account data using the provided <code class="inline">offset: 'usize'</code> and <code class="inline">length: 'usize'</code> fields; only available for "base58", "base64" or "base64+zstd" encodings.</li>
            </ul>
        </ul>`,
        exampleParameters: `[
  "vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg",
  {"encoding": "base58"}
]`,
    },
    {
        name: 'Get Balance (getBalance)',
        value: 'getBalance',
        parentGroup: 'Account Information',
        description: 'Returns the balance of the account of provided Pubkey.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getBalance",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">String</code> - Pubkey of account to query, as base-58 encoded string.</li>
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
  "vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg"
]`,
    },
    {
        name: 'Get Block (getBlock)',
        value: 'getBlock',
        parentGroup: 'Getting Blocks',
        description: 'Returns identity and transaction information about a confirmed block in the ledger.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getBlock",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">slot_number</code> - slot, as u64 (64-bit unsigned integer) integer.</li>
            <li><code class="inline">Object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">encoding</code> - (optional) encoding for each returned Transaction, either "json", "jsonParsed", "base58" (slow), "base64". If parameter not provided, the default encoding is "json".</li>
                <li><code class="inline">transactionDetails</code> - (optional) level of transaction detail to return, either "full", "signatures", or "none". If parameter not provided, the default detail level is "full".</li>
                <li><code class="inline">rewards</code> - (optional) Boolean value, whether to populate the rewards array. If parameter not provided, the default includes rewards.</li>
                <li><code class="inline">maxSupportedTransactionVersion</code> - (optional) set the max transaction version to return in responses. If the requested block contains a transaction with a higher version, an error will be returned.</li>
                <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
                <ul>
                    <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">Processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
            </ul>
        </ul>`,
        exampleParameters: `[
  94101948, 
  {
    "encoding": "json",
    "transactionDetails":"full",
    "rewards":false
  }
]`,
    },
    {
        name: 'Get Block Commitment (getBlockCommitment)',
        value: 'getBlockCommitment',
        parentGroup: 'Getting Blocks',
        description: 'Returns commitment for particular block.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getBlockCommitment",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">slot_number</code> - slot, as u64 (64-bit unsigned integer) integer.</li>
        </ul>`,
        exampleParameters: `[
  94101948
]`,
    },
    {
        name: 'Get Block Height (getBlockHeight)',
        value: 'getBlockHeight',
        parentGroup: 'Getting Blocks',
        description: 'Returns the latest block number of the blockchain.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getBlockHeight",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
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
    },
    {
        name: 'Get Block Production (getBlockProduction)',
        value: 'getBlockProduction',
        parentGroup: 'Getting Blocks',
        description: 'Returns recent block production information from the current or previous epoch.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getBlockProduction",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">Object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
                <ul>
                    <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">Processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
                <li><code class="inline">range</code>: <code class="inline">ENUM</code> - (optional) Slot range to return block production for. If parameter not provided, defaults to current epoch.</li>
                <ul>
                    <li><code class="inline">firstSlot</code> -  first slot to return block production information for (inclusive).</li>
                    <li><code class="inline">lastSlot</code> - (optional) last slot to return block production information for (inclusive). If parameter not provided, defaults to the highest slot.</li>
                </ul>
                <li><code class="inline">identity</code> - (optional) Only return results for this validator identity (base-58 encoded).</li>
            </ul>
        </ul>`,
    },
    {
        name: 'Get Block Time (getBlockTime)',
        value: 'getBlockTime',
        parentGroup: 'Getting Blocks',
        description: 'Returns the estimated production time of a block.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getBlockTime",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">slot_number</code> - slot, as u64 (64-bit unsigned integer) integer.</li>
        </ul>`,
        exampleParameters: `[
  94101948
]`,
    },
    {
        name: 'Get Blocks (getBlocks)',
        value: 'getBlocks',
        parentGroup: 'Getting Blocks',
        description: 'Returns a list of confirmed blocks between two slots.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getBlocks",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">start_slot</code> - Start slot, as an u64 integer.</li>
            <li><code class="inline">end_slot</code> - (optional) end slot as an u64 integer.</li>
            <li><code class="inline">Object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
                <ul>
                    <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                </ul>
            </ul>
        </ul>`,
        exampleParameters: `[
  5, 10
]`,
    },
    {
        name: 'Get Blocks With Limit (getBlocksWithLimit)',
        value: 'getBlocksWithLimit',
        parentGroup: 'Getting Blocks',
        description: 'Returns a list of confirmed blocks starting at the given slot',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getBlocksWithLimit",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">start_slot</code> - Start slot, as an u64 integer.</li>
            <li><code class="inline">limit</code> - limit, as u64 integer.</li>
            <li><code class="inline">Object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
                <ul>
                    <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                </ul>
            </ul>
        </ul>`,
        exampleParameters: `[
  5, 3
]`,
    },
    {
        name: 'Get Cluster Nodes (getClusterNodes)',
        value: 'getClusterNodes',
        parentGroup: 'Node Information',
        description: 'Returns information about all the nodes participating in the cluster.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getClusterNodes",
            "params":[],
            "id":1
        },
    },
    {
        name: 'Get Confirmed Block (getConfirmedBlock)',
        value: 'getConfirmedBlock',
        parentGroup: 'Getting Blocks',
        description: 'Returns identity and transaction information about a confirmed block in the ledger.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getConfirmedBlock",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">slot_number</code> - slot, as u64 (64-bit unsigned integer) integer.</li>
            <li><code class="inline">limit</code> - limit, as u64 integer.</li>
            <li><code class="inline">Object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
                <ul>
                    <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">Processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
                <li><code class="inline">encoding</code> - (optional) encoding for each returned Transaction, either "json", "jsonParsed", "base58" (slow), "base64". If parameter not provided, the default encoding is "json".</li>
                <li><code class="inline">transactionDetails</code> - (optional) level of transaction detail to return, either "full", "signatures", or "none". If parameter not provided, the default detail level is "full".</li>
                <li><code class="inline">rewards</code> - (optional) Boolean value, whether to populate the rewards array. If parameter not provided, the default includes rewards.</li>
            </ul>
        </ul>`,
        exampleParameters: `[
  94101948, 
  {
    "encoding": "json",
    "transactionDetails":"full",
    "rewards":false
  }
]`,
    },
    {
        name: 'Get Confirmed Blocks (getConfirmedBlocks)',
        value: 'getConfirmedBlocks',
        parentGroup: 'Getting Blocks',
        description: 'Returns a list of confirmed blocks between two slots.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getConfirmedBlocks",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">start_slot</code> - start_slot, as u64 (64-bit unsigned integer).</li>
            <li><code class="inline">end_slot</code> - (optional) end_slot, as u64 (64-bit unsigned integer).</li>
            <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
            <ul>
                <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                <li><code class="inline">Processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
            </ul>
        </ul>`,
        exampleParameters: `[
  94101945,
  94101948
]`,
    },
    {
        name: 'Get Confirmed Blocks With Limit (getConfirmedBlocksWithLimit)',
        value: 'getConfirmedBlocksWithLimit',
        parentGroup: 'Getting Blocks',
        description: 'Returns a list of confirmed blocks starting at the given slot.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getConfirmedBlocksWithLimit",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">start_slot</code> - start_slot, as u64 (64-bit unsigned integer).</li>
            <li><code class="inline">limit</code> - (optional) limit, as u64 (64-bit unsigned integer).</li>
            <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
            <ul>
                <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                <li><code class="inline">Processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
            </ul>
        </ul>`,
        exampleParameters: `[
  94101945, 
  3
]`,
    },
    {
        name: 'Get Confirmed Signatures For Address2 (getConfirmedSignaturesForAddress2)',
        value: 'getConfirmedSignaturesForAddress2',
        parentGroup: 'Reading & Writing Transactions',
        description: 'Returns confirmed signatures for transactions involving an address backwards in time from the provided signature or most recent confirmed block.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getConfirmedSignaturesForAddress2",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">acc_add</code> - account address as base-58 encoded string.</li>
            <li><code class="inline">Object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">limit</code> - (optional) maximum transaction signatures to return (between 1 and 1,000, default: 1,000).</li>
                <li><code class="inline">before</code> - (optional) start searching backwards from this transaction signature. If not provided the search starts from the top of the highest max confirmed block.</li>
                <li><code class="inline">until</code> - (optional) search until this transaction signature, if found before limit reached.</li>
                <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
                <ul>
                    <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                </ul>
            </ul>
        </ul>`,
        exampleParameters: `[
  "Vote111111111111111111111111111111111111111",
  {"limit": 1}
]`,
    },
    {
        name: 'Get Confirmed Transaction (getConfirmedTransaction)',
        value: 'getConfirmedTransaction',
        parentGroup: 'Reading & Writing Transactions',
        description: 'Returns transaction details for a confirmed transaction.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getConfirmedTransaction",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">tx_sig</code> - transaction signature as base-58 encoded string.</li>
            <li><code class="inline">Object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">encoding</code> - Tencoding for each returned Transaction, either "json", "jsonParsed", "base58" (slow), "base64".</li>
                <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
                <ul>
                    <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                </ul>
            </ul>
        </ul>`,
        exampleParameters: `[
  "3Pdh1xgS7HYXcPquN1JQQXs8C6Tn2ZTkHg86wXMwDEEnJxVVZsE3WgxHSx258boUtHcMVkKCGbT9dYWWfk7CWV2m",
  {
    "encoding": "json",
  }
]`,
    },
    {
        name: 'Get Epoch Info (getEpochInfo)',
        value: 'getEpochInfo',
        parentGroup: 'Network Information',
        description: 'Returns information about the current epoch.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getEpochInfo",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
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
    },
    {
        name: 'Get Epoch Schedule (getEpochSchedule)',
        value: 'getEpochSchedule',
        parentGroup: 'Network Information',
        description: `Returns epoch schedule information from this cluster's genesis config.`,
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getEpochSchedule",
            "params":[],
            "id":1
        },
    },
    {
        name: 'Get Fee Calculator For Blockhash (getFeeCalculatorForBlockhash)',
        value: 'getFeeCalculatorForBlockhash',
        parentGroup: 'Network Information',
        description: 'Returns the fee calculator associated with the query blockhash, or null if the blockhash has expired.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getFeeCalculatorForBlockhash",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">string</code> - (optional) query blockhash as a Base58 encoded string.</li>
            <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
            <ul>
                <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                <li><code class="inline">Processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
            </ul>
        </ul>`,
        exampleParameters: `["6EUDAG2UBZ1J7CbpixutsELc5c6s4k8YzaWawyKH2Pit"]`,
    },
    {
        name: 'Get Fee For Message (getFeeForMessage)',
        value: 'getFeeForMessage',
        parentGroup: 'Network Information',
        description: 'Get the fee the network will charge for a particular message.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getFeeForMessage",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">Message</code> - Base-64 encoded Message</li>
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
  "AQABAgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQAA",
  {
    "commitment": "processed"
  }
]`,
    },
    {
        name: 'Get Fee Rate Governor (getFeeRateGovernor)',
        value: 'getFeeRateGovernor',
        parentGroup: 'Network Information',
        description: 'Returns the fee rate governor information from the root bank.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getFeeRateGovernor",
            "params":[],
            "id":1
        },
    },
    {
        name: 'Get Fees (getFees)',
        value: 'getFees',
        parentGroup: 'Network Information',
        description: 'Returns a recent block hash from the ledger, a fee schedule that can be used to compute the cost of submitting a transaction using it, and the last slot in which the blockhash will be valid.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getFees",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
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
    "commitment": "processed"
  }
]`,
    },
    {
        name: 'Get First Available Block (getFirstAvailableBlock)',
        value: 'getFirstAvailableBlock',
        parentGroup: 'Getting Blocks',
        description: 'Returns the slot of the lowest confirmed block that has not been purged from the ledger',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getFirstAvailableBlock",
            "params":[],
            "id":1
        },
    },
    {
        name: 'Get Genesis Hash (getGenesisHash)',
        value: 'getGenesisHash',
        parentGroup: 'Network Information',
        description: 'Returns the genesis hash.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getGenesisHash",
            "params":[],
            "id":1
        },
    },
    {
        name: 'Get Health (getHealth)',
        value: 'getHealth',
        parentGroup: 'Node Information',
        description: 'Returns the current health of the node.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getHealth",
            "params":[],
            "id":1
        },
    },
    {
        name: 'Get Highest Snapshot Slot (getHighestSnapshotSlot)',
        value: 'getHighestSnapshotSlot',
        parentGroup: 'Node Information',
        description: 'Returns the highest slot that the node has a snapshot for. This will find the highest full snapshot slot, and the highest incremental snapshot slot based on the full snapshot slot, if there is one.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getHighestSnapshotSlot",
            "params":[],
            "id":1
        },
    },
    {
        name: 'Get Identity (getIdentity)',
        value: 'getIdentity',
        parentGroup: 'Node Information',
        description: 'Returns the identity pubkey for the current node.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getIdentity",
            "params":[],
            "id":1
        },
    },
    {
        name: 'Get Inflation Governor (getInflationGovernor)',
        value: 'getInflationGovernor',
        parentGroup: 'Network Inflation',
        description: 'Returns the current inflation governor.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getInflationGovernor",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
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
    "commitment": "processed"
  }
]`,
    },
    {
        name: 'Get Inflation Rate (getInflationRate)',
        value: 'getInflationRate',
        parentGroup: 'Network Inflation',
        description: 'Returns the specific inflation values for the current epoch.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getInflationRate",
            "params":[],
            "id":1
        },
    },
    {
        name: 'Get Inflation Reward (getInflationReward)',
        value: 'getInflationReward',
        parentGroup: 'Network Inflation',
        description: 'Returns the inflation / staking reward for a list of addresses for an epoch.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getInflationReward",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">Array</code> - An array of addresses to query, as base-58 encoded strings</li>
            <li><code class="inline">Object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
                <ul>
                    <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">Processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
            </ul>
            <li><code class="inline">epoch</code> - (optional) An epoch for which the reward occurs, as u64 (64-bit unsigned integer) integer. If omitted, the previous epoch will be used.</li>
            <li><code class="inline">minContextSlot</code> - (optional) set the minimum slot that the request can be evaluated at.</li>
            <li><code class="inline">maxSupportedTransactionVersion</code> - (optional) set the max transaction version to return in responses. If the requested block contains a transaction with a higher version, an error will be returned.</li>
        </ul>`,
        exampleParameters: `[
  [
    "ADDRESS_TO_SEARCH_1", 
    "ADDRESS_TO_SEARCH_2"
  ], 
  {"epoch": 2}
]`,
    },
    {
        name: 'Get Largest Accounts (getLargestAccounts)',
        value: 'getLargestAccounts',
        parentGroup: 'Account Information',
        description: 'Returns the 20 largest accounts, by lamport balance (results may be cached up to two hours).',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getLargestAccounts",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">Object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
                <ul>
                    <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">Processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
            </ul>
            <li><code class="inline">filter</code> - (optional) filter results by account type; currently supported: <code class="inline">circulating</code> | <code class="inline">nonCirculating</code></li>
        </ul>`,
    },
    {
        name: 'Get Latest Blockhash (getLatestBlockhash)',
        value: 'getLatestBlockhash',
        parentGroup: 'Getting Blocks',
        description: 'Returns the latest blockhash.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getLatestBlockhash",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">Object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
                <ul>
                    <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">Processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
            </ul>
            <li><code class="inline">minContextSlot</code> - - set the minimum slot that the request can be evaluated at.</li>
        </ul>`,
        exampleParameters: `[
  {
    "commitment": "processed"
  }
]`,
    },
    {
        name: 'Get Leader Schedule (getLeaderSchedule)',
        value: 'getLeaderSchedule',
        parentGroup: 'Slot Information',
        description: 'Returns the leader schedule for an epoch.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getLeaderSchedule",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">64-bit unsigned integer</code> - (optional) Fetch the leader schedule for the epoch that corresponds to the provided slot. If unspecified, the leader schedule for the current epoch is fetched.</li>
            <li><code class="inline">Object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
                <ul>
                    <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">Processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
                <li><code class="inline">identity</code> - (optional) Only return results for this validator identity (base-58 encoded).</li>
            </ul>
        </ul>`,
    },
    {
        name: 'Get Max Retransmit Slot (getMaxRetransmitSlot)',
        value: 'getMaxRetransmitSlot',
        parentGroup: 'Slot Information',
        description: 'Get the max slot seen from retransmit stage.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getMaxRetransmitSlot",
            "params":[],
            "id":1
        },
    },
    {
        name: 'Get Max Shred Insert Slot (getMaxShredInsertSlot)',
        value: 'getMaxShredInsertSlot',
        parentGroup: 'Slot Information',
        description: 'Get the max slot seen from after shred insert.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getMaxShredInsertSlot",
            "params":[],
            "id":1
        },
    },
    {
        name: 'Get Minimum Balance For Rent Exemption (getMinimumBalanceForRentExemption)',
        value: 'getMinimumBalanceForRentExemption',
        parentGroup: 'Slot Information',
        description: 'Returns minimum balance required to make account rent exempt.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getMinimumBalanceForRentExemption",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">usize</code> - account data length</li>
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
        exampleParameters: `[50]`,
    },
    {
        name: 'Get Multiple Accounts (getMultipleAccounts)',
        value: 'getMultipleAccounts',
        parentGroup: 'Account Information',
        description: 'Returns the account information for a list of Pubkeys.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getMultipleAccounts",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">array</code> - An array of Pubkeys to query, as base-58 encoded strings.</li>
            <li><code class="inline">Object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
                <ul>
                    <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">Processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
                <li><code class="inline">encoding</code> - encoding for Account data, either "base58" (slow), "base64", "base64+zstd", or "jsonParsed".</li>
                <li><code class="inline">dataSlice</code> - (optional) limit the returned account data using the provided <code class="inline">offset: 'usize'</code> and <code class="inline">length: 'usize'</code> fields; only available for "base58", "base64" or "base64+zstd" encodings.</li>
            </ul>
        </ul>`,
        exampleParameters: `[
  [
    "vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg",
    "4fYNw3dojWmQ4dXtSGE9epjRGy9pFSx62YypT7avPYvA"
  ],
  {
    "dataSlice": {
      "offset": 0,
      "length": 0
    }
  }
]`,
    },
    {
        name: 'Get Program Accounts (getProgramAccounts)',
        value: 'getProgramAccounts',
        parentGroup: 'Account Information',
        description: 'Returns all accounts owned by the provided program Pubkey.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getProgramAccounts",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">String</code> - Pubkey of program, as base-58 encoded string</li>
            <li><code class="inline">Object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
                <ul>
                    <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">Processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
                <li><code class="inline">encoding</code> - (optional) encoding for Account data, either "base58" (slow), "base64", "base64+zstd", or "jsonParsed". "base58" is limited to Account data of less than 129 bytes. "base64" will return base64 encoded data for Account data of any size. "base64+zstd" compresses the Account data using Zstandard and base64-encodes the result. "jsonParsed" encoding attempts to use program-specific state parsers to return more human-readable and explicit account state data.</li>
                <li><code class="inline">dataSlice</code> - (optional) limit the returned account data using the provided offset: usize and length: usize fields; only available for "base58", "base64" or "base64+zstd" encodings.</li>
                <li><code class="inline">filters</code> - (optional) filter results using up to 4 filter objects; account must meet all filter criteria to be included in results.</li>
                <li><code class="inline">withContext</code> - (optional) wrap the result in an RpcResponse JSON object.</li>
                <li><code class="inline">minContextSlot</code> - (optional) set the minimum slot that the request can be evaluated at.</li>
            </ul>
        </ul>`,
        exampleParameters: `["PROGRAM_TO_SEARCH"]`,
    },
    {
        name: 'Get Recent Blockhash (getRecentBlockhash)',
        value: 'getRecentBlockhash',
        parentGroup: 'Getting Blocks',
        description: 'Returns a recent block hash from the ledger, and a fee schedule that can be used to compute the cost of submitting a transaction using it.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getRecentBlockhash",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
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
    "commitment": "processed"
  }
]`,
    },
    {
        name: 'Get Recent Performance Samples (getRecentPerformanceSamples)',
        value: 'getRecentPerformanceSamples',
        parentGroup: 'Slot Information',
        description: 'Returns a list of recent performance samples, in reverse slot order. Performance samples are taken every 60 seconds and include the number of transactions and slots that occur in a given time window.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getRecentPerformanceSamples",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">limit</code> - (optional) number of samples to return (maximum 720).</li>
        </ul>`,
       exampleParameters: `[4]`,
    },
    {
        name: 'Get Signature Statuses (getSignatureStatuses)',
        value: 'getSignatureStatuses',
        parentGroup: 'Reading & Writing Transactions',
        description: 'Returns the statuses of a list of signatures. Unless the searchTransactionHistory configuration parameter is included, this method only searches the recent status cache of signatures, which retains statuses for all active slots plus MAX_RECENT_BLOCKHASHES rooted slots.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getSignatureStatuses",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">array</code> - An array of transaction signatures to confirm, as base-58 encoded strings.</li>
            <li><code class="inline">Object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">searchTransactionHistory</code> -  Boolean value, if true, a Solana node will search its ledger cache for any signatures not found in the recent status cache.</li>
            </ul>
        </ul>`,
       exampleParameters: `[
  [
    "5tGfZLNDxtCtWsW1BJoeTyHvnfGqpADDfBkUgkKENQJ8iz5yTN3ae51j8m8GRFevJx82gyuKnEX7iexFsqf7X2vS",
    "D13jTJYXoQBcRY9AfT5xRtsew7ENgCkNs6mwwwAcUCp4ZZCEM7YwZ7en4tVsoDa7Gu75Jjj2FgLXNUz8Zmgedff"
  ],
  {"searchTransactionHistory": true}
]`,
    },
    {
        name: 'Get Signatures For Address (getSignaturesForAddress)',
        value: 'getSignaturesForAddress',
        parentGroup: 'Reading & Writing Transactions',
        description: 'Returns confirmed signatures for transactions involving an address backwards in time from the provided signature or most recent confirmed block.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getSignaturesForAddress",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">account_address</code> -The account address as base-58 encoded string.</li>
            <li><code class="inline">Object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">Limit</code> - (optional) Maximum number of transaction signatures to return (between 1 and 1,000, default: 1,000).</li>
                <li><code class="inline">Before</code> - (optional) Start searching backwards from this transaction signature. If not provided the search starts from the top of the highest max confirmed block.</li>
                <li><code class="inline">Until</code> - (optional) search until this transaction signature, if found before limit reached.</li>
                <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
                <ul>
                    <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">Processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
            </ul>
        </ul>`,
       exampleParameters: `[
  "Vote111111111111111111111111111111111111111",
  {"limit": 1}
]`,
    },
    {
        name: 'Get Slot (getSlot)',
        value: 'getSlot',
        parentGroup: 'Slot Information',
        description: 'Returns the slot that has reached the given or default commitment level.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getSlot",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
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
    "commitment": "processed"
  }
]`,
    },
    {
        name: 'Get Slot Leader (getSlotLeader)',
        value: 'getSlotLeader',
        parentGroup: 'Slot Information',
        description: 'Returns the current slot leader.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getSlotLeader",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
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
  {"commitment": "processed"}
]`,
    },
    {
        name: 'Get Slot Leaders (getSlotLeaders)',
        value: 'getSlotLeaders',
        parentGroup: 'Slot Information',
        description: 'Returns the slot leaders for a given slot range.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getSlotLeaders",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">Start slot</code> - Start slot, as 64-bit unsigned integer.</li>
            <li><code class="inline">Limit</code> - Limit, as 64-bit unsigned integer.</li>
        </ul>`,
       exampleParameters: `[140630426, 10]`,
    },
    {
        name: 'Get Snapshot Slot (getSnapshotSlot)',
        value: 'getSnapshotSlot',
        parentGroup: 'Slot Information',
        description: 'Returns the highest slot that the node has a snapshot for.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getSnapshotSlot",
            "params":[],
            "id":1
        },
    },
    {
        name: 'Get Stake Activation (getStakeActivation)',
        value: 'getStakeActivation',
        parentGroup: 'Account Information',
        description: 'Returns epoch activation information for a stake account.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getStakeActivation",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">String</code> - Pubkey of stake account to query, as base-58 encoded string.</li>
            <li><code class="inline">Object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
                <ul>
                    <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">Processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
                <li><code class="inline">epoch</code> - (optional) epoch for which to calculate activation details. If parameter not provided, defaults to current epoch.</li>
            </ul>
        </ul>`,
       exampleParameters: `["Buc3N8TitzhVtvy7sm85YWpY2F5PAAKV2iLP1cZAbwrJ"]`,
    },
    {
        name: 'Get Supply (getSupply)',
        value: 'getSupply',
        parentGroup: 'Network Information',
        description: 'Returns information about the current supply.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getSupply",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
            <ul>
                <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                <li><code class="inline">Processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
            </ul>
        </ul>`,
    },
    {
        name: 'Get Token Account Balance (getTokenAccountBalance)',
        value: 'getTokenAccountBalance',
        parentGroup: 'Token Information',
        description: 'Returns the token balance of an SPL Token account.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getTokenAccountBalance",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">String</code> - Pubkey of account delegate to query, as base-58 encoded string.</li>
            <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
            <ul>
                <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                <li><code class="inline">Processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
            </ul>
        </ul>`,
       exampleParameters: `["DhzDoryP2a4rMK2bcWwJxrE2uW6ir81ES8ZwJJPPpxDN"]`,
    },
    {
        name: 'Get Token Accounts By Delegate (getTokenAccountsByDelegate)',
        value: 'getTokenAccountsByDelegate',
        parentGroup: 'Token Information',
        description: 'Returns all SPL Token accounts by approved Delegate.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getTokenAccountsByDelegate",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">String</code> - Pubkey of account delegate to query, as base-58 encoded string.</li>
            <li><code class="inline">Object</code> - Either:</li>
            <ul>
                <li><code class="inline">mint</code> - Pubkey of the specific token Mint to limit accounts to, as base-58 encoded string.</li>
                <li><code class="inline">programId</code> - Pubkey of the Token program ID that owns the accounts, as base-58 encoded string.</li>
            </ul>
            <li><code class="inline">Object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
                <ul>
                    <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">Processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
                <li><code class="inline">encoding</code> - (encoding for Account data, either "base58" (slow), "base64", "base64+zstd" or "jsonParsed". "jsonParsed" encoding attempts to use program-specific state parsers to return more human-readable and explicit account state data. If "jsonParsed" is requested but a valid mint cannot be found for a particular account, that account will be filtered out from results.</li>
                <li><code class="inline">dataSlice</code> - limit the returned account data using the provided offset: (unsigned integer) and length: (unsigned integer) fields; only available for "base58", "base64" or "base64+zstd" encodings.</li>
            </ul>
        </ul>`,
       exampleParameters: `[
  "4Nd1mBQtrMJVYVfKf2PJy9NZUZdTAsp7D4xWLs4gDB4T",
  {
    "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
  },
  {
    "encoding": "jsonParsed"
  }
]`,
    },
    {
        name: 'Get Token Accounts By Owner (getTokenAccountsByOwner)',
        value: 'getTokenAccountsByOwner',
        parentGroup: 'Token Information',
        description: 'Returns all SPL Token accounts by token owner.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getTokenAccountsByOwner",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">String</code> - Pubkey of account delegate to query, as base-58 encoded string.</li>
            <li><code class="inline">Object</code> - Either:</li>
            <ul>
                <li><code class="inline">mint</code> - Pubkey of the specific token Mint to limit accounts to, as base-58 encoded string.</li>
                <li><code class="inline">programId</code> - Pubkey of the Token program ID that owns the accounts, as base-58 encoded string.</li>
            </ul>
            <li><code class="inline">Object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
                <ul>
                    <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">Processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
                <li><code class="inline">encoding</code> - (encoding for Account data, either "base58" (slow), "base64", "base64+zstd" or "jsonParsed". "jsonParsed" encoding attempts to use program-specific state parsers to return more human-readable and explicit account state data. If "jsonParsed" is requested but a valid mint cannot be found for a particular account, that account will be filtered out from results.</li>
                <li><code class="inline">dataSlice</code> - limit the returned account data using the provided offset: (unsigned integer) and length: (unsigned integer) fields; only available for "base58", "base64" or "base64+zstd" encodings.</li>
            </ul>
        </ul>`,
       exampleParameters: `[
  "GgPpTKg78vmzgDtP1DNn72CHAYjRdKY7AV6zgszoHCSa",
  {
    "mint": "1YDQ35V8g68FGvcT85haHwAXv1U7XMzuc4mZeEXfrjE"
  },
  {
    "encoding": "jsonParsed"
  }
]`,
    },
    {
        name: 'Get Token Largest Accounts (getTokenLargestAccounts)',
        value: 'getTokenLargestAccounts',
        parentGroup: 'Token Information',
        description: 'Returns the 20 largest accounts of a particular SPL Token type.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getTokenLargestAccounts",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">String</code> - Pubkey of account delegate to query, as base-58 encoded string.</li>
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
  "1YDQ35V8g68FGvcT85haHwAXv1U7XMzuc4mZeEXfrjE",
  {
    "commitment": "processed"
  }
]`,
    },
    {
        name: 'Get Token Supply (getTokenSupply)',
        value: 'getTokenSupply',
        parentGroup: 'Token Information',
        description: 'Returns the total supply of an SPL Token type.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getTokenSupply",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">String</code> - Pubkey of token Mint to query, as base-58 encoded string</li>
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
  "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  {
    "commitment": "processed"
  }
]`,
    },
    {
        name: 'Get Transaction (getTransaction)',
        value: 'getTransaction',
        parentGroup: 'Reading & Writing Transactions',
        description: 'Returns transaction details for a confirmed transaction.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getTransaction",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">tx_sig</code> - transaction signature as base-58 encoded string.</li>
            <li><code class="inline">Object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
                <ul>
                    <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">Processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
                <li><code class="inline">encoding</code> - Tencoding for each returned Transaction, either "json", "jsonParsed", "base58" (slow), "base64". If parameter not provided, the default encoding is "json".</li>
                <li><code class="inline">maxSupportedTransactionVersion</code> - (optional) set the max transaction version to return in responses. If the requested transaction is a higher version, an error will be returned.</li>
            </ul>
        </ul>`,
       exampleParameters: `[
  "D13jTJYXoQBcRY9AfT5xRtsew7ENgCkNs6mwwwAcUCp4ZZCEM7YwZ7en4tVsoDa7Gu75Jjj2FgLXNUz8Zmgedff",
  {"encoding": "json"}
]`,
    },
    {
        name: 'Get Transaction Count (getTransactionCount)',
        value: 'getTransactionCount',
        parentGroup: 'Reading & Writing Transactions',
        description: 'Returns the current transaction count from the ledger.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getTransactionCount",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
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
  {"commitment": "processed"}
]`,
    },
    {
        name: 'Get Version (getVersion)',
        value: 'getVersion',
        parentGroup: 'Network Information',
        description: 'Returns the current solana version running on the node.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getVersion",
            "params":[],
            "id":1
        },
    },
    {
        name: 'Get Vote Accounts (getVoteAccounts)',
        value: 'getVoteAccounts',
        parentGroup: 'Account Information',
        description: 'Returns the account info and associated stake for all the voting accounts in the current bank.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getVoteAccounts",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">Object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
                <ul>
                    <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">Processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
                <li><code class="inline">votePubkey</code> - (optional) Only return results for this validator vote address. Passed as a string, base-58 encoded.</li>
                <li><code class="inline">keepUnstakedDelinquents</code> - (optional) Boolean that determines whether or not to filter out delinquent validators with no stake.</li>
                <li><code class="inline">delinquentSlotDistance</code> - (optional) Specify the number of slots behind the tip that a validator must fall to be considered delinquent. Passed as an integer. It is not recomended to specify this argument.</li>
            </ul>
        </ul>`,
       exampleParameters: `[
  {"commitment": "processed"}
]`,
    },
    {
        name: 'Is Blockhash Valid (isBlockhashValid)',
        value: 'isBlockhashValid',
        parentGroup: 'Getting Blocks',
        description: 'Returns whether a blockhash is still valid or not',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"isBlockhashValid",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">blockhash</code> - the blockhash of this block, as base-58 encoded string.</li>
            <li><code class="inline">Object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
                <ul>
                    <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">Processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
            </ul>
            <li><code class="inline">minContextSlot</code> - (optional) set the minimum slot that the request can be evaluated at</li>
        </ul>`,
       exampleParameters: `[
  "ENTER_BLOCKHASH_ID_HERE",
  {"commitment": "processed"}
]`,
    },
    {
        name: 'Minimum Ledger Slot (minimumLedgerSlot)',
        value: 'minimumLedgerSlot',
        parentGroup: 'Slot Information',
        description: 'Returns the lowest slot that the node has information of in its ledger.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"minimumLedgerSlot",
            "params":[],
            "id":1
        },
    },
    {
        name: 'Send Transaction (sendTransaction)',
        value: 'sendTransaction',
        parentGroup: 'Reading & Writing Transactions',
        description: 'Submits a signed transaction to the cluster for processing.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"sendTransaction",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">String</code> - fully-signed Transaction, as encoded string.</li>
            <li><code class="inline">Object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">skipPreflight</code> - if true, skip the preflight transaction checks (default: false).</li>
                <li><code class="inline">preflightCommitment</code> - (optional) Commitment level to use for preflight (default: "finalized").</li>
                <li><code class="inline">encoding</code> - (optional) Encoding used for the transaction data. Either "base58" (slow, DEPRECATED), or "base64". (default: "base58").</li>
                <li><code class="inline">maxRetries</code> - (optional).</li>
            </ul>
        </ul>`,
       exampleParameters: `[
  "ENTER_ENCODED_TRANSACTION_ID",
]`,
    },
    {
        name: 'Simulate Transaction (simulateTransaction)',
        value: 'simulateTransaction',
        parentGroup: 'Reading & Writing Transactions',
        description: 'Simulate sending a transaction.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"simulateTransaction",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">String</code> - Transaction, as an encoded string. The transaction must have a valid blockhash, but is not required to be signed.</li>
            <li><code class="inline">Object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">sigVerify</code> -  if true the transaction signatures will be verified (default: false, conflicts with replaceRecentBlockhash).</li>
                <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
                <ul>
                    <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">Processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
                <li><code class="inline">encoding</code> - (optional) Encoding used for the transaction data. Either "base58" (slow, DEPRECATED), or "base64". (default: "base58").</li>
                <li><code class="inline">replaceRecentBlockhash</code> - (optional) if true the transaction recent blockhash will be replaced with the most recent blockhash. (default: false, conflicts with sigVerify).</li>
                <li><code class="inline">accounts </code>: <code class="inline">Object</code> - (optional) Accounts configuration object containing the following fields:</li>
                <ul>
                    <li><code class="inline">encoding</code> - (optional) encoding for returned Account data, either "base64" (default), "base64+zstd" or "jsonParsed". "jsonParsed" encoding attempts to use program-specific state parsers to return more human-readable and explicit account state data. If "jsonParsed" is requested but a parser cannot be found, the field falls back to binary encoding, detectable when the data field is type string.</li>
                    <li><code class="inline">addresses</code> - An array of accounts to return, as base-58 encoded strings.</li>
                </ul>
            </ul>
        </ul>`,
       exampleParameters: `[
  "ENTER_ENCODED_TRANSACTION_ID",
]`,
    },
] as IETHOperation[];