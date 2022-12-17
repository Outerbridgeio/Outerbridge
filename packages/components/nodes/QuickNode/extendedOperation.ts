import { NETWORK, NETWORK_PROVIDER } from '../../src/ChainNetwork'
import { IETHOperation, infuraSupportedNetworks } from '../../src/ETHOperations'

export const debugOperationsNetworks = [...infuraSupportedNetworks, NETWORK.ARBITRUM_NOVA, NETWORK.BSC, NETWORK.BSC_TESTNET, NETWORK.CELO]

export const debugOperations = [
    {
        name: 'Debug Trace Block By Hash (debug_traceBlockByHash)',
        value: 'debug_traceBlockByHash',
        parentGroup: 'Debug Traces',
        description: 'Replay the block that is already present in the database (Trace Mode required)',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: debugOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'debug_traceBlockByHash',
            params: [{ tracer: 'callTracer' }],
            id: 1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">HASH</code> - Hash of the block to be traced.</li>
		</ul>`,
        exampleParameters: `[
  "0x97b49e43632ac70c46b4003434058b18db0ad809617bd29f3448d46ca9085576"
]`
    },
    {
        name: 'Debug Trace Block By Number (debug_traceBlockByNumber)',
        value: 'debug_traceBlockByNumber',
        parentGroup: 'Debug Traces',
        description: 'Replay the block that is already present in the database (Trace Mode required)',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: debugOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'debug_traceBlockByNumber',
            params: [{ tracer: 'callTracer' }],
            id: 1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">QUANTITY|TAG</code> - integer block number, or the string "latest", "earliest" or "pending", OR the blockHash (in accordance with EIP-1898)</li>
		</ul>`,
        exampleParameters: `[
  "0xccde12"
]`
    },
    {
        name: 'Debug Trace Call (debug_traceCall)',
        value: 'debug_traceCall',
        parentGroup: 'Debug Traces',
        description: `Let's you run eth_call on top of a block (Trace Mode required)`,
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: debugOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'debug_traceCall',
            params: [{ tracer: 'callTracer' }],
            id: 1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">Object</code> - The transaction call object</li>
            <ul>
                <li><code class="inline">from</code>: <code class="inline">DATA</code>, 20 Bytes - (optional) The address the transaction is sent from.</li>
                <li><code class="inline">to</code>: <code class="inline">DATA</code>, 20 Bytes - The address the transaction is directed to.</li>
                <li><code class="inline">gas</code>: <code class="inline">QUANTITY</code> - (optional) Integer of the gas provided for the transaction execution. eth_call consumes zero gas, but this parameter may be needed by some executions.</li>
                <li><code class="inline">gasPrice</code>: <code class="inline">QUANTITY</code> - (optional) Integer of the gasPrice used for each paid gas.</li>
                <li><code class="inline">value</code>: <code class="inline">QUANTITY</code> - (optional) Integer of the value sent with this transaction.</li>
                <li><code class="inline">data</code>: <code class="inline">DATA</code> - (optional) Hash of the method signature and encoded parameters.</li>
            </ul>
            <li><code class="inline">QUANTITY|TAG</code> - integer block number, or the string "latest", "earliest" or "pending", OR the blockHash (in accordance with EIP-1898)</li>
		</ul>`,
        exampleParameters: `[
  {
    "from": "0xb60e8dd61c5d32be8058bb8eb970870f07233155",
    "to": "0xd46e8dd67c5d32be8058bb8eb970870f07244567",
    "gas": "0x76c0",
    "gasPrice": "0x9184e72a000",
    "value": "0x9184e72a",
    "data": "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675"
  }, 
  "latest"
]`
    },
    {
        name: 'Debug Trace Transaction (debug_traceTransaction)',
        value: 'debug_traceTransaction',
        parentGroup: 'Debug Traces',
        description: 'Returns all traces of given transaction (Trace Mode required)',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: debugOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'debug_traceBlockByHash',
            params: [{ tracer: 'callTracer' }],
            id: 1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">HASH</code> - The hash of a transaction.</li>
		</ul>`,
        exampleParameters: `[
  "0x97b49e43632ac70c46b4003434058b18db0ad809617bd29f3448d46ca9085576"
]`
    }
] as IETHOperation[]

export const arbTraceOperationsNetworks = [NETWORK.ARBITRUM, NETWORK.ARBITRUM_GOERLI]
export const arbTraceOperations = [
    {
        name: 'Arbtrace Block (arbtrace_block )',
        value: 'arbtrace_block',
        parentGroup: 'Traces',
        description: 'Returns traces created at given block (Trace Mode required, and supported only on OpenEthereum & Erigon).',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: arbTraceOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'arbtrace_block ',
            params: [],
            id: 1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">QUANTITY|TAG</code> - integer block number, or the string "latest", "earliest" or "pending", OR the blockHash (in accordance with EIP-1898)</li>
		</ul>`,
        exampleParameters: `[
  "0xccb93d"
]`
    },
    {
        name: 'Arbtrace Call (arbtrace_call)',
        value: 'arbtrace_call',
        parentGroup: 'Traces',
        description:
            'Executes a new message call and returns a number of possible traces (Trace Mode required, and supported only on OpenEthereum & Erigon).',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: arbTraceOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'arbtrace_call',
            params: [],
            id: 1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">Object</code> - The transaction call object</li>
            <ul>
                <li><code class="inline">from</code>: <code class="inline">DATA</code>, 20 Bytes - (optional) The address the transaction is sent from.</li>
                <li><code class="inline">to</code>: <code class="inline">DATA</code>, 20 Bytes - The address the transaction is directed to.</li>
                <li><code class="inline">gas</code>: <code class="inline">QUANTITY</code> - (optional) Integer of the gas provided for the transaction execution. eth_call consumes zero gas, but this parameter may be needed by some executions.</li>
                <li><code class="inline">gasPrice</code>: <code class="inline">QUANTITY</code> - (optional) Integer of the gasPrice used for each paid gas.</li>
                <li><code class="inline">value</code>: <code class="inline">QUANTITY</code> - (optional) Integer of the value sent with this transaction.</li>
                <li><code class="inline">data</code>: <code class="inline">DATA</code> - (optional) Hash of the method signature and encoded parameters.</li>
            </ul>
            <li><code class="inline">Array</code> - Type of trace, one or more of:</li>
            <ul>
                <li><code class="inline">vmTrace</code>: To get a full trace of virtual machine's state during the execution of the given of given transaction, including for any subcalls.</li>
                <li><code class="inline">trace</code>: To get the basic trace of the given transaction.</li>
                <li><code class="inline">statediff</code>: To get information on altered Ethereum state due to execution of the given transaction.</li>
            </ul>
            <li><code class="inline">QUANTITY|TAG</code> - integer block number, or the string "latest", "earliest" or "pending", OR the blockHash (in accordance with EIP-1898)</li>
		</ul>`,
        exampleParameters: `[
  {
    "from":null,
    "to":"0x6b175474e89094c44da98b954eedeac495271d0f",
    "data":"0x70a082310000000000000000000000006E0d01A76C3Cf4288372a29124A26D4353EE51BE"
  },
  ["trace"],
  "latest"
]`
    },
    {
        name: 'Arbtrace Call Many (arbtrace_callMany)',
        value: 'arbtrace_callMany',
        parentGroup: 'Traces',
        description:
            'Performs multiple call traces on top of the same block. i.e. transaction n will be executed on top of a pending block with all n-1 transactions applied (traced) first. Allows to trace dependent transactions. (Trace Mode required, and supported only on OpenEthereum & Erigon).',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: arbTraceOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'arbtrace_callMany',
            params: [],
            id: 1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">Array</code> - Call array, one or more of:</li>
            <ul>
                <li><code class="inline">Object</code> - The transaction call object</li>
                <ul>
                    <li><code class="inline">from</code>: <code class="inline">DATA</code>, 20 Bytes - (optional) The address the transaction is sent from.</li>
                    <li><code class="inline">to</code>: <code class="inline">DATA</code>, 20 Bytes - The address the transaction is directed to.</li>
                    <li><code class="inline">gas</code>: <code class="inline">QUANTITY</code> - (optional) Integer of the gas provided for the transaction execution. eth_call consumes zero gas, but this parameter may be needed by some executions.</li>
                    <li><code class="inline">gasPrice</code>: <code class="inline">QUANTITY</code> - (optional) Integer of the gasPrice used for each paid gas.</li>
                    <li><code class="inline">value</code>: <code class="inline">QUANTITY</code> - (optional) Integer of the value sent with this transaction.</li>
                    <li><code class="inline">data</code>: <code class="inline">DATA</code> - (optional) Hash of the method signature and encoded parameters.</li>
                </ul>
                <li><code class="inline">Array</code> - Type of trace, one or more of:</li>
                <ul>
                    <li><code class="inline">vmTrace</code>: To get a full trace of virtual machine's state during the execution of the given of given transaction, including for any subcalls.</li>
                    <li><code class="inline">trace</code>: To get the basic trace of the given transaction.</li>
                    <li><code class="inline">statediff</code>: To get information on altered Ethereum state due to execution of the given transaction.</li>
                </ul>
            </ul>
            <li><code class="inline">QUANTITY|TAG</code> - integer block number, or the string "latest", "earliest" or "pending", OR the blockHash (in accordance with EIP-1898)</li>
		</ul>`,
        exampleParameters: `[
  [
    [
      {
        "from":"0x407d73d8a49eeb85d32cf465507dd71d507100c1",
        "to":"0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
        "value":"0x186a0"
      },
      ["trace"]
    ],
    [
      {
        "from":"0x407d73d8a49eeb85d32cf465507dd71d507100c1",
        "to":"0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
        "value":"0x186a0"
      },
      ["trace"]
    ]
  ],
  "latest"
]`
    },
    {
        name: 'Arbtrace Filter (arbtrace_filter)',
        value: 'arbtrace_filter',
        parentGroup: 'Traces',
        description: 'Returns traces matching given filter (Trace Mode required, and supported only on OpenEthereum & Erigon).',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: arbTraceOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'arbtrace_filter',
            params: [],
            id: 1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">Object</code> - The filter object</li>
            <ul>
                <li><code class="inline">fromBlock</code>: <code class="inline">QUANTITY|TAG</code> - (optional) integer block number, or the string "latest", "earliest" or "pending", OR the blockHash (in accordance with EIP-1898)</li>
                <li><code class="inline">toBlock</code>: <code class="inline">QUANTITY|TAG</code> - (optional) integer block number, or the string "latest", "earliest" or "pending", OR the blockHash (in accordance with EIP-1898)</li>
                <li><code class="inline">fromaddress</code>: <code class="inline">Array</code> - (optional) Addresses of the Senders.</li>
                <li><code class="inline">toaddress</code>: <code class="inline">Array</code> - (optional) Addresses of the Receivers.</li>
                <li><code class="inline">after</code>: <code class="inline">QUANTITY</code> - (optional) The offset trace number.</li>
                <li><code class="inline">count</code>: <code class="inline">QUANTITY</code> - (optional) Integer number of traces to display in a batch.</li>
            </ul>
		</ul>`,
        exampleParameters: `[
  {
    "fromBlock":"0xccb943",
    "toBlock":"latest",
    "fromAddress":["0xEdC763b3e418cD14767b3Be02b667619a6374076"]
  }
]`
    },
    {
        name: 'Arbtrace Raw Transaction (arbtrace_rawTransaction)',
        value: 'arbtrace_rawTransaction',
        parentGroup: 'Traces',
        description:
            'Traces a call to eth_sendRawTransaction without making the call, returning the traces(Trace Mode required, and supported only on OpenEthereum & Erigon).',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: arbTraceOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'arbtrace_rawTransaction',
            params: [],
            id: 1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">Data</code> - Raw transaction data/string.</li>
            <li><code class="inline">Array</code> - Type of trace, one or more of:</li>
            <ul>
                <li><code class="inline">vmTrace</code>: To get a full trace of virtual machine's state during the execution of the given of given transaction, including for any subcalls.</li>
                <li><code class="inline">trace</code>: To get the basic trace of the given transaction.</li>
                <li><code class="inline">statediff</code>: To get information on altered Ethereum state due to execution of the given transaction.</li>
            </ul>
		</ul>`,
        exampleParameters: `[
  "0x02f8740181948459682f0085275c2c9f8b82520894885885521990b53fd00556c143ea056dd2f62a128808cc0c47d9477f9080c080a037437ba52140dbac1d7dc65cdb58531e038930c82314817f91cb8d8ea36a2bd0a001e134479d567b8595d77f61106cad34e62ed356d6971bc08fe0363a0696dd94",
  ["trace"]
]`
    },
    {
        name: 'Arbtrace Replay Block Transactions (arbtrace_replayBlockTransactions)',
        value: 'arbtrace_replayBlockTransactions',
        parentGroup: 'Traces',
        description:
            'Replays all transactions in a block returning the requested traces for each transaction (Trace Mode required, and supported only on OpenEthereum & Erigon).',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: arbTraceOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'arbtrace_replayBlockTransactions',
            params: [],
            id: 1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">QUANTITY|TAG</code> - integer block number, or the string "latest", "earliest" or "pending", OR the blockHash (in accordance with EIP-1898)</li>
            <li><code class="inline">Array</code> - Type of trace, one or more of:</li>
            <ul>
                <li><code class="inline">vmTrace</code>: To get a full trace of virtual machine's state during the execution of the given of given transaction, including for any subcalls.</li>
                <li><code class="inline">trace</code>: To get the basic trace of the given transaction.</li>
                <li><code class="inline">statediff</code>: To get information on altered Ethereum state due to execution of the given transaction.</li>
            </ul>
		</ul>`,
        exampleParameters: `[
  "0xccb93d",
  ["trace"]
]`
    },
    {
        name: 'Arbtrace Replay Transaction (arbtrace_replayTransaction)',
        value: 'arbtrace_replayTransaction',
        parentGroup: 'Traces',
        description: 'Replays a transaction, returning the traces (Trace Mode required, and supported only on OpenEthereum & Erigon).',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: arbTraceOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'arbtrace_replayTransaction',
            params: [],
            id: 1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">HASH</code> - The hash of a transaction.</li>
            <li><code class="inline">Array</code> - Type of trace, one or more of:</li>
            <ul>
                <li><code class="inline">vmTrace</code>: To get a full trace of virtual machine's state during the execution of the given of given transaction, including for any subcalls.</li>
                <li><code class="inline">trace</code>: To get the basic trace of the given transaction.</li>
                <li><code class="inline">statediff</code>: To get information on altered Ethereum state due to execution of the given transaction.</li>
            </ul>
		</ul>`,
        exampleParameters: `[
  "0x3277c743c14e482243862c03a70e83ccb52e25cb9e54378b20a8303f15cb985d",
  ["trace"]
]`
    },
    {
        name: 'Arbtrace Transaction (arbtrace_transaction)',
        value: 'arbtrace_transaction',
        parentGroup: 'Traces',
        description: 'Returns all traces of given transaction(Trace Mode required, and supported only on OpenEthereum & Erigon).',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: arbTraceOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'arbtrace_transaction',
            params: [],
            id: 1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">HASH</code> - The hash of a transaction.</li>
		</ul>`,
        exampleParameters: `[
  "0x3277c743c14e482243862c03a70e83ccb52e25cb9e54378b20a8303f15cb985d"
]`
    }
] as IETHOperation[]

export const traceOperationsNetworks = [NETWORK.MAINNET, NETWORK.GÖRLI, NETWORK.GNOSIS, NETWORK.BSC, NETWORK.BSC_TESTNET, NETWORK.FANTOM]
export const traceOperations = [
    {
        name: 'Trace Block (trace_block)',
        value: 'trace_block',
        parentGroup: 'Traces',
        description: 'Returns traces created at given block (Trace Mode required, and supported only on OpenEthereum & Erigon).',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: traceOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'trace_block',
            params: [],
            id: 1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">QUANTITY|TAG</code> - integer block number, or the string "latest", "earliest" or "pending", OR the blockHash (in accordance with EIP-1898)</li>
		</ul>`,
        exampleParameters: `[
  "0xccb93d"
]`
    },
    {
        name: 'Trace Call (trace_call)',
        value: 'trace_call',
        parentGroup: 'Traces',
        description:
            'Executes a new message call and returns a number of possible traces (Trace Mode required, and supported only on OpenEthereum & Erigon).',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: traceOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'trace_call',
            params: [],
            id: 1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">Object</code> - The transaction call object</li>
            <ul>
                <li><code class="inline">from</code>: <code class="inline">DATA</code>, 20 Bytes - (optional) The address the transaction is sent from.</li>
                <li><code class="inline">to</code>: <code class="inline">DATA</code>, 20 Bytes - The address the transaction is directed to.</li>
                <li><code class="inline">gas</code>: <code class="inline">QUANTITY</code> - (optional) Integer of the gas provided for the transaction execution. eth_call consumes zero gas, but this parameter may be needed by some executions.</li>
                <li><code class="inline">gasPrice</code>: <code class="inline">QUANTITY</code> - (optional) Integer of the gasPrice used for each paid gas.</li>
                <li><code class="inline">value</code>: <code class="inline">QUANTITY</code> - (optional) Integer of the value sent with this transaction.</li>
                <li><code class="inline">data</code>: <code class="inline">DATA</code> - (optional) Hash of the method signature and encoded parameters.</li>
            </ul>
            <li><code class="inline">Array</code> - Type of trace, one or more of:</li>
            <ul>
                <li><code class="inline">vmTrace</code>: To get a full trace of virtual machine's state during the execution of the given of given transaction, including for any subcalls.</li>
                <li><code class="inline">trace</code>: To get the basic trace of the given transaction.</li>
                <li><code class="inline">statediff</code>: To get information on altered Ethereum state due to execution of the given transaction.</li>
            </ul>
            <li><code class="inline">QUANTITY|TAG</code> - integer block number, or the string "latest", "earliest" or "pending", OR the blockHash (in accordance with EIP-1898)</li>
		</ul>`,
        exampleParameters: `[
  {
    "from":null,
    "to":"0x6b175474e89094c44da98b954eedeac495271d0f",
    "data":"0x70a082310000000000000000000000006E0d01A76C3Cf4288372a29124A26D4353EE51BE"
  },
  ["trace"],
  "latest"
]`
    },
    {
        name: 'Trace Call Many (trace_callMany)',
        value: 'trace_callMany',
        parentGroup: 'Traces',
        description:
            'Performs multiple call traces on top of the same block. i.e. transaction n will be executed on top of a pending block with all n-1 transactions applied (traced) first. Allows to trace dependent transactions. (Trace Mode required, and supported only on OpenEthereum & Erigon).',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: traceOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'trace_callMany',
            params: [],
            id: 1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">Array</code> - Call array, one or more of:</li>
            <ul>
                <li><code class="inline">Object</code> - The transaction call object</li>
                <ul>
                    <li><code class="inline">from</code>: <code class="inline">DATA</code>, 20 Bytes - (optional) The address the transaction is sent from.</li>
                    <li><code class="inline">to</code>: <code class="inline">DATA</code>, 20 Bytes - The address the transaction is directed to.</li>
                    <li><code class="inline">gas</code>: <code class="inline">QUANTITY</code> - (optional) Integer of the gas provided for the transaction execution. eth_call consumes zero gas, but this parameter may be needed by some executions.</li>
                    <li><code class="inline">gasPrice</code>: <code class="inline">QUANTITY</code> - (optional) Integer of the gasPrice used for each paid gas.</li>
                    <li><code class="inline">value</code>: <code class="inline">QUANTITY</code> - (optional) Integer of the value sent with this transaction.</li>
                    <li><code class="inline">data</code>: <code class="inline">DATA</code> - (optional) Hash of the method signature and encoded parameters.</li>
                </ul>
                <li><code class="inline">Array</code> - Type of trace, one or more of:</li>
                <ul>
                    <li><code class="inline">vmTrace</code>: To get a full trace of virtual machine's state during the execution of the given of given transaction, including for any subcalls.</li>
                    <li><code class="inline">trace</code>: To get the basic trace of the given transaction.</li>
                    <li><code class="inline">statediff</code>: To get information on altered Ethereum state due to execution of the given transaction.</li>
                </ul>
            </ul>
            <li><code class="inline">QUANTITY|TAG</code> - integer block number, or the string "latest", "earliest" or "pending", OR the blockHash (in accordance with EIP-1898)</li>
		</ul>`,
        exampleParameters: `[
  [
    [
      {
        "from":"0x407d73d8a49eeb85d32cf465507dd71d507100c1",
        "to":"0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
        "value":"0x186a0"
      },
      ["trace"]
    ],
    [
      {
        "from":"0x407d73d8a49eeb85d32cf465507dd71d507100c1",
        "to":"0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
        "value":"0x186a0"
      },
      ["trace"]
    ]
  ],
  "latest"
]`
    },
    {
        name: 'Trace Filter (trace_filter)',
        value: 'trace_filter',
        parentGroup: 'Traces',
        description: 'Returns traces matching given filter (Trace Mode required, and supported only on OpenEthereum & Erigon).',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: traceOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'trace_filter',
            params: [],
            id: 1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">Object</code> - The filter object</li>
            <ul>
                <li><code class="inline">fromBlock</code>: <code class="inline">QUANTITY|TAG</code> - (optional) integer block number, or the string "latest", "earliest" or "pending", OR the blockHash (in accordance with EIP-1898)</li>
                <li><code class="inline">toBlock</code>: <code class="inline">QUANTITY|TAG</code> - (optional) integer block number, or the string "latest", "earliest" or "pending", OR the blockHash (in accordance with EIP-1898)</li>
                <li><code class="inline">fromaddress</code>: <code class="inline">Array</code> - (optional) Addresses of the Senders.</li>
                <li><code class="inline">toaddress</code>: <code class="inline">Array</code> - (optional) Addresses of the Receivers.</li>
                <li><code class="inline">after</code>: <code class="inline">QUANTITY</code> - (optional) The offset trace number.</li>
                <li><code class="inline">count</code>: <code class="inline">QUANTITY</code> - (optional) Integer number of traces to display in a batch.</li>
            </ul>
		</ul>`,
        exampleParameters: `[
  {
    "fromBlock":"0xccb943",
    "toBlock":"latest",
    "fromAddress":["0xEdC763b3e418cD14767b3Be02b667619a6374076"]
  }
]`
    },
    {
        name: 'Trace Raw Transaction (trace_rawTransaction)',
        value: 'trace_rawTransaction',
        parentGroup: 'Traces',
        description:
            'Traces a call to eth_sendRawTransaction without making the call, returning the traces(Trace Mode required, and supported only on OpenEthereum & Erigon).',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: traceOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'trace_rawTransaction',
            params: [],
            id: 1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">Data</code> - Raw transaction data/string.</li>
            <li><code class="inline">Array</code> - Type of trace, one or more of:</li>
            <ul>
                <li><code class="inline">vmTrace</code>: To get a full trace of virtual machine's state during the execution of the given of given transaction, including for any subcalls.</li>
                <li><code class="inline">trace</code>: To get the basic trace of the given transaction.</li>
                <li><code class="inline">statediff</code>: To get information on altered Ethereum state due to execution of the given transaction.</li>
            </ul>
		</ul>`,
        exampleParameters: `[
  "0x02f8740181948459682f0085275c2c9f8b82520894885885521990b53fd00556c143ea056dd2f62a128808cc0c47d9477f9080c080a037437ba52140dbac1d7dc65cdb58531e038930c82314817f91cb8d8ea36a2bd0a001e134479d567b8595d77f61106cad34e62ed356d6971bc08fe0363a0696dd94",
  ["trace"]
]`
    },
    {
        name: 'Trace Replay Block Transactions (trace_replayBlockTransactions)',
        value: 'trace_replayBlockTransactions',
        parentGroup: 'Traces',
        description:
            'Replays all transactions in a block returning the requested traces for each transaction (Trace Mode required, and supported only on OpenEthereum & Erigon).',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: traceOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'trace_replayBlockTransactions',
            params: [],
            id: 1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">QUANTITY|TAG</code> - integer block number, or the string "latest", "earliest" or "pending", OR the blockHash (in accordance with EIP-1898)</li>
            <li><code class="inline">Array</code> - Type of trace, one or more of:</li>
            <ul>
                <li><code class="inline">vmTrace</code>: To get a full trace of virtual machine's state during the execution of the given of given transaction, including for any subcalls.</li>
                <li><code class="inline">trace</code>: To get the basic trace of the given transaction.</li>
                <li><code class="inline">statediff</code>: To get information on altered Ethereum state due to execution of the given transaction.</li>
            </ul>
		</ul>`,
        exampleParameters: `[
  "0xccb93d",
  ["trace"]
]`
    },
    {
        name: 'Trace Replay Transaction (trace_replayTransaction)',
        value: 'trace_replayTransaction',
        parentGroup: 'Traces',
        description: 'Replays a transaction, returning the traces (Trace Mode required, and supported only on OpenEthereum & Erigon).',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: traceOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'trace_replayTransaction',
            params: [],
            id: 1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">HASH</code> - The hash of a transaction.</li>
            <li><code class="inline">Array</code> - Type of trace, one or more of:</li>
            <ul>
                <li><code class="inline">vmTrace</code>: To get a full trace of virtual machine's state during the execution of the given of given transaction, including for any subcalls.</li>
                <li><code class="inline">trace</code>: To get the basic trace of the given transaction.</li>
                <li><code class="inline">statediff</code>: To get information on altered Ethereum state due to execution of the given transaction.</li>
            </ul>
		</ul>`,
        exampleParameters: `[
  "0x3277c743c14e482243862c03a70e83ccb52e25cb9e54378b20a8303f15cb985d",
  ["trace"]
]`
    },
    {
        name: 'Trace Transaction (trace_transaction)',
        value: 'trace_transaction',
        parentGroup: 'Traces',
        description: 'Returns all traces of given transaction(Trace Mode required, and supported only on OpenEthereum & Erigon).',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: traceOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'trace_transaction',
            params: [],
            id: 1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">HASH</code> - The hash of a transaction.</li>
		</ul>`,
        exampleParameters: `[
  "0x3277c743c14e482243862c03a70e83ccb52e25cb9e54378b20a8303f15cb985d"
]`
    },
    ...arbTraceOperations
] as IETHOperation[]

export const nftOperationsNetworks = [NETWORK.MAINNET, NETWORK.GÖRLI, NETWORK.BSC, NETWORK.BSC_TESTNET]
export const solanaNetworks = [NETWORK.SOLANA, NETWORK.SOLANA_DEVNET, NETWORK.SOLANA_TESTNET]
export const nftOperations = [
    {
        name: 'Fetch NFT Collection Details (qn_fetchNFTCollectionDetails)',
        value: 'qn_fetchNFTCollectionDetails',
        parentGroup: 'NFT',
        description: 'Returns collection details for specified contracts.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: nftOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'qn_fetchNFTCollectionDetails',
            params: {},
            id: 1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">Object</code> - The filter object</li>
            <ul>
                <li><code class="inline">contracts</code>: <code class="inline">(Array of Strings)</code> - List of NFT contract addresses you'd like to get collection details data from. You may include up to 10 contract addresses per request.</li>
            </ul>
		</ul>`,
        exampleParameters: `{
  "contracts": [
    "0x60E4d786628Fea6478F785A6d7e704777c86a7c6",
    "0x7Bd29408f11D2bFC23c34f18275bBf23bB716Bc7"
  ]
}`
    },
    {
        name: 'Fetch NFTs (qn_fetchNFTs)',
        value: 'qn_fetchNFTs',
        parentGroup: 'NFT',
        description: 'Returns aggregated data on NFTs for a given wallet.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: [...nftOperationsNetworks, ...solanaNetworks]
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'qn_fetchNFTs',
            params: {},
            id: 67
        },
        inputParameters: `
        <ul>
            <li><code class="inline">Object</code> - The filter object</li>
            <ul>
                <li><code class="inline">wallet</code>: <code class="inline">String</code> - The wallet address to check for NFTs.</li>
                <li><code class="inline">contracts</code>: <code class="inline">Array of Strings</code> - (optional) List of NFT contract addresses you'd like to get ownership data from. Contract addresses may be optionally suffixed with <code class="inline">:tokenId</code> to specify a specific NFT id to filter on. For example, <code class="inline">0x2106c...7aeaa:1234</code> will filter Loopy Donuts on the NFT token with id <code class="inline">1234</code> only. You may include up to 20 contract addresses per request.</li>
                <li><code class="inline">omitFields</code>: <code class="inline">Array of Strings</code> - (optional) Optionally omit specific properties of objects from the "assets" array of the response. Any property of the asset object can be omitted. If omitFields is not included in the request, response will return all available fields by default.</li>
                <li><code class="inline">page</code>: <code class="inline">Integer</code> - (optional) The page number you would like returned. Page numbers start at 1 and end at "totalPages". If omitted, defaults to the first page (page 1). If the page number requested is less than 1 or higher than "totalPages", an empty assets array will be returned.</li>
                <li><code class="inline">perPage</code>: <code class="inline">Integer</code> - (optional) The maximum amount of NFT assets to return on each page. You can request up to 40 items per page. If omitted, defaults to 20 items per page.</li>
            </ul>
		</ul>`,
        exampleParameters: `{
  "wallet": "0x91b51c173a4bdaa1a60e234fc3f705a16d228740",
  "omitFields": [
    "provenance",
    "traits"
  ],
  "page": 1,
  "perPage": 10,
  "contracts": [
    "0x2106c00ac7da0a3430ae667879139e832307aeaa",
    "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"
  ]
}`
    },
    {
        name: 'Fetch NFTs By Creator (qn_fetchNFTsByCreator)',
        value: 'qn_fetchNFTsByCreator',
        parentGroup: 'NFT',
        description: 'Returns aggregated data on NFTs that have been created by an address.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'qn_fetchNFTsByCreator',
            params: {},
            id: 12
        },
        inputParameters: `
        <ul>
            <li><code class="inline">Object</code> - The filter object</li>
            <ul>
                <li><code class="inline">creator</code>: <code class="inline">String</code> - The NFT creator's wallet address to check for.</li>
                <li><code class="inline">page</code>: <code class="inline">Integer</code> - (optional) The page number you would like returned. Page numbers start at 1 and end at "totalPages". If omitted, defaults to the first page (page 1). If the page number requested is less than 1 or higher than "totalPages", an empty assets array will be returned.</li>
                <li><code class="inline">perPage</code>: <code class="inline">Integer</code> - (optional) The maximum amount of NFT assets to return on each page. You can request up to 40 items per page. If omitted, defaults to 20 items per page.</li>
            </ul>
		</ul>`,
        exampleParameters: `[
  {
    "creator": "DznU28LgherhU2JwC2db3KmAeWPqoF9Yx2aVtNUudW6R",
    "page": 1,
    "perPage": 3
  }
]`
    },
    {
        name: 'Request Airdrop (requestAirdrop)',
        value: 'requestAirdrop',
        parentGroup: 'NFT',
        description: 'Requests an airdrop of lamports to a Pubkey (does not work on mainnet-beta).',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: solanaNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'requestAirdrop',
            params: {},
            id: 1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">String</code> - Pubkey of program, as base-58 encoded string</li>
            <li><code class="inline">Integer</code> - lamports, as a u64</li>
            <li><code class="inline">Commitment</code>: <code class="inline">ENUM</code> - (optional) All fields are strings.</li>
            <ul>
                <li><code class="inline">Finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                <li><code class="inline">Confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                <li><code class="inline">Processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
            </ul>
		</ul>`,
        exampleParameters: `[
  "YOUR_WALLET_ADDRESS",
  1000000000
]`
    },
    {
        name: 'Fetch NFT Tokens by Collection (qn_fetchNFTsByCollection)',
        value: 'qn_fetchNFTsByCollection',
        parentGroup: 'NFT',
        description: 'Returns aggregated data on NFTs within a given collection.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: nftOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'qn_fetchNFTsByCollection',
            params: {},
            id: 67
        },
        inputParameters: `
        <ul>
            <li><code class="inline">Object</code> - The filter object</li>
            <ul>
                <li><code class="inline">collection</code>: <code class="inline">String</code> - The contract address of the NFT Collection.</li>
                <li><code class="inline">tokens</code>: <code class="inline">Array of Strings</code> - (optional) Optionally limit the results to specific tokens within a collection. You may submit up to 20 token IDs in this parameter. If you do not want to limit results to specific tokens, please omit this parameter from your request.</li>
                <li><code class="inline">omitFields</code>: <code class="inline">Array of Strings</code> - (optional) Optionally omit specific properties of objects from the "tokens" array of the response. Any property of the tokens object can be omitted. If omitFields is not included in the request, response will return all available fields by default.</li>
                <li><code class="inline">page</code>: <code class="inline">Integer</code> - (optional) The page number you would like returned. Page numbers start at 1 and end at "totalPages". If omitted, defaults to the first page (page 1). If the page number requested is higher than "totalPages", an empty assets array will be returned. If the page number requested is less than 1, an invalid params response will be returned.</li>
                <li><code class="inline">perPage</code>: <code class="inline">Integer</code> - (optional) The maximum amount of NFT tokens to return on each page. You can request up to 100 items per page. If omitted, defaults to 40 items per page.</li>
            </ul>
		</ul>`,
        exampleParameters: `{
  "collection": "0x60E4d786628Fea6478F785A6d7e704777c86a7c6",
  "omitFields": [
    "imageUrl",
    "traits"
  ],
  "page": 1,
  "perPage": 10
}`
    },
    {
        name: 'Fetch transfers by NFT (qn_getTransfersByNFT)',
        value: 'qn_getTransfersByNFT',
        parentGroup: 'NFT',
        description: 'Returns transfers by given NFT.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: nftOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'qn_getTransfersByNFT',
            params: {},
            id: 67
        },
        inputParameters: `
        <ul>
            <li><code class="inline">Object</code> - The filter object</li>
            <ul>
                <li><code class="inline">collection</code>: <code class="inline">String</code> - The contract address of the NFT Collection.</li>
                <li><code class="inline">collectionTokenId</code>: <code class="inline">String</code> - The Token ID of this NFT under this collection.</li>
                <li><code class="inline">page</code>: <code class="inline">Integer</code> - (optional) The page number you would like returned. Page numbers start at 1 and end at "totalPages". If omitted, defaults to the first page (page 1). If the page number requested is higher than "totalPages", an empty assets array will be returned. If the page number requested is less than 1, an invalid params response will be returned.</li>
                <li><code class="inline">perPage</code>: <code class="inline">Integer</code> - (optional) The maximum amount of NFT tokens to return on each page. You can request up to 100 items per page. If omitted, defaults to 40 items per page.</li>
            </ul>
		</ul>`,
        exampleParameters: `{
  "collection": "0x60E4d786628Fea6478F785A6d7e704777c86a7c6",
  "collectionTokenId": "1",
  "page": 1,
  "perPage": 10
}`
    },
    {
        name: 'Verify NFTs Owner (qn_verifyNFTsOwner)',
        value: 'qn_verifyNFTsOwner',
        parentGroup: 'NFT',
        description: 'Confirms ownership of specified NFTs for a given wallet.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: nftOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'qn_verifyNFTsOwner',
            params: {},
            id: 67
        },
        inputParameters: `
        <ul>
            <li><code class="inline">wallet</code>: <code class="inline">String</code> -  The wallet address to check for NFTs.</li>
            <li><code class="inline">contracts</code>: <code class="inline">Array of Strings</code> - List of ERC-721 and/or ERC-1155 NFT contract addresses. Contract addresses may be optionally suffixed with <code class="inline">:tokenId</code> to specify a specific NFT id to filter on. For example, <code class="inline">0x2106c...7aeaa:1234</code> will will verify ownership of Loopy Donuts' NFT token with ID <code class="inline">1234</code> only. You may include up to 20 contract addresses per request.</li>
		</ul>`,
        exampleParameters: `[
  "0x91b51c173a4bdaa1a60e234fc3f705a16d228740",
  [
    "0x2106c00ac7da0a3430ae667879139e832307aeaa:3643",
    "0xd07dc4262bcdbf85190c01c996b4c06a461d2430:133803"
  ]
]`
    }
] as IETHOperation[]

export const tokenOperationsNetworks = [NETWORK.MAINNET, NETWORK.GÖRLI, NETWORK.BSC, NETWORK.BSC_TESTNET]
export const tokenOperations = [
    {
        name: 'Fetch Fungible Token Metadata by Contract Address (qn_getTokenMetadataByContractAddress)',
        value: 'qn_getTokenMetadataByContractAddress',
        parentGroup: 'Token',
        description: 'Returns token details for specified contract.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: tokenOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'qn_getTokenMetadataByContractAddress',
            params: {},
            id: 67
        },
        inputParameters: `
        <ul>
            <li><code class="inline">Object</code> - The filter object</li>
            <ul>
                <li><code class="inline">contract</code>: <code class="inline">String</code> - The ERC-20 contract address you'd like to get token details for.</li>
            </ul>
		</ul>`,
        exampleParameters: `{
  "contract": "0x4d224452801ACEd8B2F0aebE155379bb5D594381"
}`
    },
    {
        name: 'Fetch Fungible Token Metadata by Symbol (qn_getTokenMetadataBySymbol)',
        value: 'qn_getTokenMetadataBySymbol',
        parentGroup: 'Token',
        description: 'Returns token details for specified token symbol.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: tokenOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'qn_getTokenMetadataBySymbol',
            params: {},
            id: 67
        },
        inputParameters: `
        <ul>
            <li><code class="inline">Object</code> - The filter object</li>
            <ul>
                <li><code class="inline">symbol</code>: <code class="inline">String</code> - The ERC-20 token symbol you'd like to get details for.</li>
                <li><code class="inline">page</code>: <code class="inline">Integer</code> - (optional) The page number you would like returned. Page numbers start at 1 and end at "totalPages". If omitted, defaults to the first page (page 1). If the page number requested is higher than "totalPages", an empty tokens array will be returned. If the page number requested is less than 1, an invalid params response will be returned.</li>
                <li><code class="inline">perPage</code>: <code class="inline">Integer</code> - (optional) The maximum amount of NFT tokens to return on each page. You can request up to 100 items per page. If omitted, defaults to 40 items per page.</li>
            </ul>
		</ul>`,
        exampleParameters: `{
  "symbol": "USDC"
}`
    },
    {
        name: 'Fetch Fungible Tokens and Balances by Wallet (qn_getWalletTokenBalance)',
        value: 'qn_getWalletTokenBalance',
        parentGroup: 'Token',
        description: 'Returns ERC-20 tokens and token balances within a wallet.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: tokenOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'qn_getWalletTokenBalance',
            params: {},
            id: 67
        },
        inputParameters: `
        <ul>
            <li><code class="inline">Object</code> - The filter object</li>
            <ul>
                <li><code class="inline">wallet</code>: <code class="inline">String</code> - The wallet address to check for ERC-20 tokens.</li>
                <li><code class="inline">contracts</code>: <code class="inline">(Array of Strings)</code> - (optional) List of ERC-20 contract addresses to filter wallet balance results on. You may include up to 100 contract addresses per request.</li>
            </ul>
		</ul>`,
        exampleParameters: `{
  "wallet": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
}`
    },
    {
        name: 'Fetch Wallet Transactions by Fungible Token (qn_getWalletTokenTransactions)',
        value: 'qn_getWalletTokenTransactions',
        parentGroup: 'Token',
        description: 'Returns transfers of a specified token within a specified wallet address.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: tokenOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'qn_getWalletTokenTransactions',
            params: {},
            id: 67
        },
        inputParameters: `
        <ul>
            <li><code class="inline">Object</code> - The filter object</li>
            <ul>
                <li><code class="inline">address</code>: <code class="inline">String</code> - The wallet address we want to check for transfers.</li>
                <li><code class="inline">contract</code>: <code class="inline">String</code> - The ERC-20 contract we want to check for transfers.</li>
                <li><code class="inline">fromBlock</code>: <code class="inline">String</code> - (optional) First block number to check for transfers (inclusive). If omitted, will default to the genesis block for the provided token contract address.</li>
                <li><code class="inline">toBlock</code>: <code class="inline">String</code> - (optional) Last block number to check for transfers (inclusive). If omitted, will default to the latest block.</li>
                <li><code class="inline">page</code>: <code class="inline">Integer</code> - (optional) The page number you would like returned. Page numbers start at 1 and end at "totalPages". If omitted, defaults to the first page (page 1). If the page number requested is higher than "totalPages", an empty tokens array will be returned. If the page number requested is less than 1, an invalid params response will be returned.</li>
                <li><code class="inline">perPage</code>: <code class="inline">Integer</code> - (optional) The maximum amount of NFT tokens to return on each page. You can request up to 100 items per page. If omitted, defaults to 40 items per page.</li>
            </ul>
		</ul>`,
        exampleParameters: `{
  "address": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
  "contract": "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
  "page": 1,
  "perPage": 10
}`
    }
] as IETHOperation[]

export const avaxOperationsNetworks = [NETWORK.AVALANCHE, NETWORK.AVALANCHE_TESTNET]

export const avaxOperations = [
    {
        name: 'Avax Get Atomic Tx (avax.getAtomicTx)',
        value: 'avax.getAtomicTx',
        parentGroup: 'Avax',
        description: 'Returns the specified transaction.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'avax.getAtomicTx',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/C/avax',
        inputParameters: `
        <ul>
			<li><code class="inline">txID</code>: <code class="inline">String</code> - The transaction ID. It should be in cb58 format.</li>
            <li><code class="inline">encoding</code>: <code class="inline">String</code> - (optional) The encoding format to use. Can be either cb58 or hex. Defaults to cb58.</li>
        </ul>`,
        exampleParameters: `{
  "txID":"217PBxjVznQaoPuQT8zEB86FnwoDsq6jeb2yfBgtjwYHD1RPC3",
  "encoding": "cb58"
}`
    },
    {
        name: 'Avax Get Atomic Tx Status (avax.getAtomicTxStatus)',
        value: 'avax.getAtomicTxStatus',
        parentGroup: 'Avax',
        description: 'Get the status of a transaction sent to the network.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'avax.getAtomicTxStatus',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/C/avax',
        inputParameters: `
        <ul>
			<li><code class="inline">txID</code>: <code class="inline">String</code> - The transaction ID. It should be in cb58 format.</li>
        </ul>`,
        exampleParameters: `{
  "txID":"217PBxjVznQaoPuQT8zEB86FnwoDsq6jeb2yfBgtjwYHD1RPC3"
}`
    },
    {
        name: 'Avax Get Utx Os (avax.getUTXOs)',
        value: 'avax.getUTXOs',
        parentGroup: 'Avax',
        description: 'Get the UTXOs that reference a given address.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'avax.getUTXOs',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/C/avax',
        inputParameters: `
        <ul>
			<li><code class="inline">addresses</code>: <code class="inline">Array of Strings</code> - A list of addresses</li>
            <li><code class="inline">limit</code>: <code class="inline">Integer</code> - (optional) The limit of UTXOs to return. If limit is omitted or greater than 1024, it is set to 1024.</li>
            <li><code class="inline">startIndex</code>: <code class="inline">Object</code> - (optional) If startIndex is omitted, will fetch all UTXOs up to limit. When using pagination (i.e when startIndex is provided), UTXOs are not guaranteed to be unique across multiple calls. That is, a UTXO may appear in the result of the first call, and then again in the second call.</li>
            <ul>
                <li><code class="inline">address</code>: <code class="inline">String</code></li>
                <li><code class="inline">utxo</code>: <code class="inline">String</code></li>
            </ul>
            <li><code class="inline">sourceChain</code>: <code class="inline">String</code> - The ID or alias of the chain the asset is being imported from.</li>
            <li><code class="inline">encoding</code>: <code class="inline">String</code> - (optional) Encoding sets the format for the returned UTXOs. Can be either "cb58" or "hex". Defaults to "cb58".</li>
        </ul>`,
        exampleParameters: `{
  "addresses": [
    "C-avax1uqsts4n6j0fwmdhu4p8acmjksemtqu7vedhdks"
  ],
  "sourceChain": "X",
  "limit": 5,
  "encoding": "cb58"
}`
    },
    {
        name: 'Avax Issue Tx (avax.issueTx)',
        value: 'avax.issueTx',
        parentGroup: 'Avax',
        description: 'Send a signed transaction to the network.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'avax.issueTx',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/C/avax',
        inputParameters: `
        <ul>
            <li><code class="inline">tx</code>: <code class="inline">String</code> - The signed transaction (typically signed with a library, using your private key).</li>
            <li><code class="inline">encoding</code>: <code class="inline">String</code> - (optional) Encoding sets the format for the returned UTXOs. Can be either "cb58" or "hex". Defaults to "cb58".</li>
        </ul>`,
        exampleParameters: `{
  "tx":"0x00",
  "encoding": "hex"
}`
    },
    {
        name: 'Avm Build Genesis (avm.buildGenesis)',
        value: 'avm.buildGenesis',
        parentGroup: 'AVM',
        description: 'Given a JSON representation of this Virtual Machine’s genesis state, create the byte representation of that state.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'avm.buildGenesis',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/vm/avm',
        inputParameters: `
        <ul>
            <li><code class="inline">genesisData</code>: <code class="inline">JSON</code> - A JSON representing the genesis data.</li>
            <li><code class="inline">networkID</code>: <code class="inline">Integer</code> - the ID of the network</li>
            <li><code class="inline">encoding</code>: <code class="inline">String</code> - (optional) Encoding sets the format for the returned UTXOs. Can be either "cb58" or "hex". Defaults to "cb58".</li>
        </ul>`,
        exampleParameters: `{
  "genesisData": {
    "asset1": {
      "name": "asset1",
      "symbol":"MFCA",
      "memo": "2Zc54v4ek37TEwu4LiV3j41PUMRd6acDDU3ZCVSxE7X",
      "denomination": 1, 
      "initialState": {
          "fixedCap" : [
              {
                "amount":100000,
                "address": "local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u"
              }
          ]
      }
    },
    "asset2": {
      "name": "asset2",
      "symbol":"MVCA",
      "memo": "2Zc54v4ek37TEwu4LiV3j41PUMRd6acDDU3ZCVSxE7X",
      "denomination": 2, 
      "initialState": {
        "variableCap" : [
          {
            "amount":100000,
            "address": "local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u"
          }
        ]
      }
    }
  },
  "networkId": 12345,
  "encoding":"cb58"
}`
    },
    {
        name: 'Avm Get Address Txs (avm.getAddressTxs)',
        value: 'avm.getAddressTxs',
        parentGroup: 'AVM',
        description: 'Returns all transactions that change the balance of the given address.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'avm.getAddressTxs',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/X',
        inputParameters: `
        <ul>
            <li><code class="inline">address</code>: <code class="inline">String</code> - The address for which we're fetching related transactions</li>
            <li><code class="inline">cursor</code>: <code class="inline">Uint64</code> - (optional) The page number or offset. Leave empty to get the first page.</li>
            <li><code class="inline">assetID</code>: <code class="inline">String</code> - Only return transactions that changed the balance of this asset. Must be an ID or an alias for an asset.</li>
            <li><code class="inline">pageSize</code>: <code class="inline">Uint64</code> - (optional) The number of items to return per page. Optional. Defaults to 1024.</li>
        </ul>`,
        exampleParameters: `{
  "address":"X-avax19pm62y5n0yt76wgp8pd7jdhepmppc67y7yg0cq",
  "assetID":"AVAX",
  "pageSize":20
}`
    },
    {
        name: 'Avm Get All Balances (avm.getAllBalances)',
        value: 'avm.getAllBalances',
        parentGroup: 'AVM',
        description: 'Get the balances of all assets controlled by a given address.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'avm.getAllBalances',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/X',
        inputParameters: `
        <ul>
            <li><code class="inline">address</code>: <code class="inline">String</code> - Address you want to fetch balances for.</li>
        </ul>`,
        exampleParameters: `{
  "address":"X-avax16902ur8dhlyxpaa0rva5fx48fhptx6ryh3dv7q"
}`
    },
    {
        name: 'Avm Get Asset Description (avm.getAssetDescription)',
        value: 'avm.getAssetDescription',
        parentGroup: 'AVM',
        description: 'Get information about an asset.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'avm.getAssetDescription',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/X',
        inputParameters: `
        <ul>
            <li><code class="inline">assetid</code>: <code class="inline">String</code> - The id of the asset for which the information is requested.</li>
        </ul>`,
        exampleParameters: `{
  "assetID" :"AVAX"
}`
    },
    {
        name: 'Avm Get Balance (avm.getBalance)',
        value: 'avm.getBalance',
        parentGroup: 'AVM',
        description: 'Get the balance of an asset controlled by a given address.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'avm.getBalance',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/X',
        inputParameters: `
        <ul>
            <li><code class="inline">address</code>: <code class="inline">String</code> - The owner of the asset.</li>
            <li><code class="inline">assetid</code>: <code class="inline">String</code> - The id of the asset for which the balance is requested.</li>
        </ul>`,
        exampleParameters: `{
  "address":"X-avax16902ur8dhlyxpaa0rva5fx48fhptx6ryh3dv7q",
  "assetID": "AVAX"
}`
    },
    {
        name: 'Avm Get Tx (avm.getTx)',
        value: 'avm.getTx',
        parentGroup: 'AVM',
        description: 'Returns the specified transaction.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'avm.getTx',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/X',
        inputParameters: `
        <ul>
            <li><code class="inline">txID</code>: <code class="inline">String</code> - A specific transaction ID.</li>
            <li><code class="inline">encoding</code>: <code class="inline">String</code> - The encoding parameter sets the format of the returned transaction. Can be, "cb58", "hex" or "json". Defaults to "cb58".</li>
        </ul>`,
        exampleParameters: `{
  "txID":"9VBHzPDFeDBJGyhBbzakzXMHJnsYhyLEiSS6ee5AczR2oJcns",
  "encoding": "hex"
}`
    },
    {
        name: 'Avm Get Tx (avm.getTxStatus)',
        value: 'avm.getTxStatus',
        parentGroup: 'AVM',
        description: 'Get the status of a transaction sent to the network.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'avm.getTxStatus',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/X',
        inputParameters: `
        <ul>
            <li><code class="inline">txID</code>: <code class="inline">String</code> - A specific transaction ID.</li>
        </ul>`,
        exampleParameters: `{
  "txID": "2HHr7xUJgWiLESV7g8T3oWfWvdpWJXd4Hctj6U3KhzUN6EsgBG"
}`
    },
    {
        name: 'Avm Get Utx Os (avm.getUtxOs)',
        value: 'avm.getUtxOs',
        parentGroup: 'AVM',
        description: 'Get the UTXOs that reference a given address.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'avm.getUtxOs',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/X',
        inputParameters: `
        <ul>
			<li><code class="inline">addresses</code>: <code class="inline">Array of Strings</code> - A list of UTXOs such that each UTXO references at least one address in addresses.</li>
            <li><code class="inline">limit</code>: <code class="inline">Integer</code> - (optional) The limit of UTXOs to return. If limit is omitted or greater than 1024, it is set to 1024.</li>
            <li><code class="inline">startIndex</code>: <code class="inline">Object</code> - (optional) If startIndex is omitted, will fetch all UTXOs up to limit. When using pagination (i.e when startIndex is provided), UTXOs are not guaranteed to be unique across multiple calls. That is, a UTXO may appear in the result of the first call, and then again in the second call.</li>
            <ul>
                <li><code class="inline">address</code>: <code class="inline">String</code></li>
                <li><code class="inline">utxo</code>: <code class="inline">String</code></li>
            </ul>
            <li><code class="inline">sourceChain</code>: <code class="inline">String</code> - The ID or alias of the chain the asset is being imported from.</li>
            <li><code class="inline">encoding</code>: <code class="inline">String</code> - (optional) Encoding sets the format for the returned UTXOs. Can be either "cb58" or "hex". Defaults to "cb58".</li>
        </ul>`,
        exampleParameters: `{
  "addresses": [
    "X-avax16902ur8dhlyxpaa0rva5fx48fhptx6ryh3dv7q"
  ],
  "limit": 5,
  "sourceChain": "X",
  "encoding": "hex"
}`
    },
    {
        name: 'Avm Issue Tx (avm.issueTx)',
        value: 'avm.issueTx',
        parentGroup: 'AVM',
        description: 'Send a signed transaction to the network.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'avm.issueTx',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/X',
        inputParameters: `
        <ul>
			<li><code class="inline">tx</code>: <code class="inline">String</code> - The signed transaction (typically signed with a library, using your private key).</li>
            <li><code class="inline">encoding</code>: <code class="inline">String</code> - (optional) Encoding sets the format for the returned UTXOs. Can be either "cb58" or "hex". Defaults to "cb58".</li>
        </ul>`,
        exampleParameters: `{
  "tx":"6sTENqXfk3gahxkJbEPsmX9eJTEFZRSRw83cRJqoHWBiaeAhVbz9QV4i6SLd6Dek4eLsojeR8FbT3arFtsGz9ycpHFaWHLX69edJPEmj2tPApsEqsFd7wDVp7fFxkG6HmySR",
  "encoding": "cb58"
}`
    }
] as IETHOperation[]

export const fantomOperationsNetworks = [NETWORK.FANTOM]

export const fantomOperations = [
    {
        name: 'Dag Get Event (dag_getEvent)',
        value: 'dag_getEvent',
        parentGroup: 'DAG',
        description: 'Returns Lachesis event by hash or short ID.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: fantomOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'dag_getEvent',
            params: [],
            id: 1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">eventid</code>: <code class="inline">String</code> - The full event ID (hex-encoded 32 bytes) or short event ID.</li>
        </ul>`,
        exampleParameters: `[
  "0x00000001000000039bcda184cc9e2b20386dcee5f39fe3c4f36f7b47c297ff2b"
]`
    },
    {
        name: 'Dag Get Event Payload (dag_getEventPayload)',
        value: 'dag_getEventPayload',
        parentGroup: 'DAG',
        description: 'Returns event (including transactions) by hash or short ID.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: fantomOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'dag_getEventPayload',
            params: [],
            id: 1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">eventid</code>: <code class="inline">String</code> - The full event ID (hex-encoded 32 bytes) or short event ID.</li>
            <li><code class="inline">fulltx</code>: <code class="inline">Boolean</code> - If true it returns the full transaction objects, if false only the hashes of the transactions.</li>
        </ul>`,
        exampleParameters: `[
  "1:3:a2395846", 
  true
]`
    },
    {
        name: 'Dag Get Heads (dag_getHeads)',
        value: 'dag_getHeads',
        parentGroup: 'DAG',
        description: 'Returns IDs of all the epoch events with no descendants in a given epoch.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: fantomOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'dag_getHeads',
            params: [],
            id: 1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">epoch</code>: <code class="inline">String</code> - epoch number encoded as a hexadecimal for a specific epoch (pass “latest” to use latest epoch; pass “pending” to use latest sealed epoch).</li>
        </ul>`,
        exampleParameters: `[
  "pending"
]`
    }
] as IETHOperation[]

export const platformOperations = [
    {
        name: 'Platform Get Balance (platform.getBalance)',
        value: 'platform.getBalance',
        parentGroup: 'Platform',
        description: 'Get the balance of an asset controlled by a given address.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'platform.getBalance',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/P',
        inputParameters: `
        <ul>
			<li><code class="inline">address</code>: <code class="inline">String</code> - The address to get the balance of.</li>
        </ul>`,
        exampleParameters: `{
  "address":"P-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy"    
}`
    },
    {
        name: 'Platform Get Blockchain Status (platform.getBlockchainStatus)',
        value: 'platform.getBlockchainStatus',
        parentGroup: 'Platform',
        description: 'Get the status of a blockchain.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'platform.getBlockchainStatus',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/P',
        inputParameters: `
        <ul>
			<li><code class="inline">blockchainID</code>: <code class="inline">String</code> - The id of the blockchain.</li>
        </ul>`,
        exampleParameters: `{
  "blockchainID":"2NbS4dwGaf2p1MaXb65PrkZdXRwmSX4ZzGnUu7jm3aykgThuZE"
}`
    },
    {
        name: 'Platform Get Blockchains (platform.getBlockchains)',
        value: 'platform.getBlockchains',
        parentGroup: 'Platform',
        description: 'Get all the blockchains that exist (excluding the P-Chain).',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'platform.getBlockchains',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/P'
    },
    {
        name: 'Platform Get Current Supply (platform.getCurrentSupply)',
        value: 'platform.getCurrentSupply',
        parentGroup: 'Platform',
        description:
            'Returns an upper bound on the number of AVAX that exist. This is an upper bound because it does not account for burnt tokens, including transaction fees.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'platform.getCurrentSupply',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/P'
    },
    {
        name: 'Platform Get Current Validators (platform.getCurrentValidators)',
        value: 'platform.getCurrentValidators',
        parentGroup: 'Platform',
        description: 'List the current validators of the given Subnet.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'platform.getCurrentValidators',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/P',
        inputParameters: `
        <ul>
			<li><code class="inline">subnetID</code>: <code class="inline">String</code> - (optional) The subnet whose current validators are returned. If omitted, returns the current validators of the Primary Network.</li>
            <li><code class="inline">nodeIDs</code>: <code class="inline">Array of Strings</code> - (optional) a list of the nodeIDs of pending validators to request. If omitted, all pending validators are returned. If a specified nodeID is not in the set of pending validators, it will not be included in the response.</li>
        </ul>`
    },
    {
        name: 'Platform Get Pending Validators (platform.getPendingValidators)',
        value: 'platform.getPendingValidators',
        parentGroup: 'Platform',
        description:
            'List the validators in the pending validator set of the specified Subnet. Each validator is not currently validating the Subnet but will in the future.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'platform.getPendingValidators',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/P',
        inputParameters: `
        <ul>
			<li><code class="inline">subnetID</code>: <code class="inline">String</code> - (optional) The subnet whose current validators are returned. If omitted, returns the current validators of the Primary Network.</li>
            <li><code class="inline">nodeIDs</code>: <code class="inline">Array of Strings</code> - (optional) a list of the nodeIDs of pending validators to request. If omitted, all pending validators are returned. If a specified nodeID is not in the set of pending validators, it will not be included in the response.</li>
        </ul>`,
        exampleParameters: `{
  "subnetID": null,
  "nodeIDs": []
}`
    },
    {
        name: 'Platform Get Height (platform.getHeight)',
        value: 'platform.getHeight',
        parentGroup: 'Platform',
        description: 'Returns the height of the last accepted block.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'platform.getHeight',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/P'
    },
    {
        name: 'Platform Get Max Stake Amount (platform.getMaxStakeAmount)',
        value: 'platform.getMaxStakeAmount',
        parentGroup: 'Platform',
        description:
            'Get the maximum amount of AVAX required to validate the Primary Network and the maximum amount of AVAX that can be delegated.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'platform.getMaxStakeAmount',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/P',
        inputParameters: `
        <ul>
			<li><code class="inline">subnetID</code>: <code class="inline">String</code> - A Buffer or cb58 string representing a subnet.</li>
            <li><code class="inline">nodeID</code>: <code class="inline">String</code> - A string representing ID of the node whose stake amount is required during the given duration.</li>
            <li><code class="inline">startTime</code>: <code class="inline">Integer</code> - A big number denoting start time of the duration during which stake amount of the node is required.</li>
            <li><code class="inline">endTime</code>: <code class="inline">Integer</code> - A big number denoting end time of the duration during which stake amount of the node is required.</li>
        </ul>`,
        exampleParameters: `{
  "subnetID":"11111111111111111111111111111111LpoYY",
  "nodeID":"NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg",
  "startTime": 1644240334,
  "endTime": 1644240634
}`
    },
    {
        name: 'Platform Get Min Stake (platform.getMinStake)',
        value: 'platform.getMinStake',
        parentGroup: 'Platform',
        description:
            'Get the minimum amount of AVAX required to validate the Primary Network and the minimum amount of AVAX that can be delegated.',
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'platform.getMinStake',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/P'
    },
    {
        name: 'Platform Get Reward Utx Os (platform.getRewardUtxOs)',
        value: 'platform.getRewardUtxOs',
        parentGroup: 'Platform',
        description: `Returns the UTXOs that were rewarded after the provided transaction's staking or delegation period ended.`,
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'platform.getRewardUtxOs',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/P',
        inputParameters: `
        <ul>
			<li><code class="inline">txID</code>: <code class="inline">String</code> - The ID of the staking or delegating transaction.</li>
            <li><code class="inline">encoding</code>: <code class="inline">String</code> - Specifies the format for the returned UTXOs. Can be either "cb58" or "hex" and defaults to "cb58".</li>
        </ul>`,
        exampleParameters: `{
  "txID": "2nmH8LithVbdjaXsxVQCQfXtzN9hBbmebrsaEYnLM9T32Uy2Y4",
  "encoding": "hex",
}`
    },
    {
        name: 'Platform Get Stake (platform.getStake)',
        value: 'platform.getStake',
        parentGroup: 'Platform',
        description: `Returns the staked amount for an array of addresses.`,
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'platform.getStake',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/P',
        inputParameters: `
        <ul>
			<li><code class="inline">addresses</code>: <code class="inline">Array of Strings</code> - An array of address strings.</li>
        </ul>`,
        exampleParameters: `{
  "addresses": ["P-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy"]
}`
    },
    {
        name: 'Platform Get Staking Asset (platform.getStakingAssetId)',
        value: 'platform.getStakingAssetId',
        parentGroup: 'Platform',
        description: `Retrieve an assetID for a subnet’s staking asset. Currently this always returns the Primary Network’s staking assetID.`,
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'platform.getStakingAssetId',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/P',
        inputParameters: `
        <ul>
			<li><code class="inline">subnetID</code>: <code class="inline">String</code> - (optional) the subnet whose assetID is requested.</li>
        </ul>`
    },
    {
        name: 'Platform Get Subnets (platform.getSubnets)',
        value: 'platform.getSubnets',
        parentGroup: 'Platform',
        description: `Get all the Subnets that exist.`,
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'platform.getSubnets',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/P',
        inputParameters: `
        <ul>
			<li><code class="inline">ids</code>: <code class="inline">Array of Strings</code> - The ids of the subnets to get information about.</li>
        </ul>`,
        exampleParameters: `{
  "ids":["BE5Nv8objSftNwxzcxkZGwCfVs3FPdJBio4DBwCF2A5i7RasU"]
}`
    },
    {
        name: 'Platform Get Timestamp (platform.getTimestamp)',
        value: 'platform.getTimestamp',
        parentGroup: 'Platform',
        description: `Returns the specified transaction.`,
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'platform.getTimestamp',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/P'
    },
    {
        name: 'Platform Get Total Stake (platform.getTotalStake)',
        value: 'platform.getTotalStake',
        parentGroup: 'Platform',
        description: `Get the total amount of nAVAX staked on the Primary Network.`,
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'platform.getTotalStake',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/P'
    },
    {
        name: 'Platform Get Tx (platform.getTx)',
        value: 'platform.getTx',
        parentGroup: 'Platform',
        description: `Returns the specified transaction.`,
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'platform.getTx',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/P',
        inputParameters: `
        <ul>
			<li><code class="inline">txID</code>: <code class="inline">String</code> - The transaction ID. It should be in cb58 format.</li>
            <li><code class="inline">encoding</code>: <code class="inline">String</code> - (optional) The encoding format to use. Can be either cb58 or hex. Defaults to cb58.</li>
        </ul>`,
        exampleParameters: `{
  "txID":"2dum8LzyddFVZhiYBCUBZw3Xqsb2GdZAP6FsmCPB1gHGJhw1oJ",
  "encoding": "cb58"
}`
    },
    {
        name: 'Platform Get Tx Status (platform.getTxStatus)',
        value: 'platform.getTxStatus',
        parentGroup: 'Platform',
        description: `Returns the specified transaction.`,
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'platform.getTxStatus',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/P',
        inputParameters: `
        <ul>
			<li><code class="inline">txID</code>: <code class="inline">String</code> - The transaction ID. It should be in cb58 format.</li>
        </ul>`,
        exampleParameters: `{
  "txID":"2dum8LzyddFVZhiYBCUBZw3Xqsb2GdZAP6FsmCPB1gHGJhw1oJ",
}`
    },
    {
        name: 'Platform Get Utx Os (platform.getUtxOs)',
        value: 'platform.getUtxOs',
        parentGroup: 'Platform',
        description: `Get the UTXOs that reference a given address.`,
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'platform.getUtxOs',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/P',
        inputParameters: `
        <ul>
			<li><code class="inline">addresses</code>: <code class="inline">Array of Strings</code> - the addresses from which we want to retrieve the UTXOs.</li>
            <li><code class="inline">limit</code>: <code class="inline">Integer</code> - (optional) At most limit UTXOs are returned. If limit is omitted or greater than 1024, it is set to 1024.</li>
			<li><code class="inline">startIndex</code>: <code class="inline">Object</code> - (optional) an object of an address and a utxo.</li>
			<ul>
                <li><code class="inline">address</code>: <code class="inline">String</code></li>
			    <li><code class="inline">utxo</code>: <code class="inline">String</code></li>
            </ul>
            <li><code class="inline">sourceChain</code>: <code class="inline">String</code> - (optional) the chain from which we want to fetch the UTXOs, (X or C).</li>
            <li><code class="inline">encoding</code>: <code class="inline">String</code> - (optional) The encoding format to use. Can be either cb58 or hex. Defaults to cb58.</li>
        </ul>`,
        exampleParameters: `{
  "addresses":["P-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy"],
  "sourceChain": "X",
  "limit": 5,
  "encoding": "hex"
}`
    },
    {
        name: 'Platform Get Validators At (platform.getValidatorsAt)',
        value: 'platform.getValidatorsAt',
        parentGroup: 'Platform',
        description: `Get the validators and their weights of a subnet or the Primary Network at a given P-Chain height.`,
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'platform.getValidatorsAt',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/P',
        inputParameters: `
        <ul>
			<li><code class="inline">height</code>: <code class="inline">Integer</code> - the numerical value representing the P-Chain height to get the validator set at.</li>
            <li><code class="inline">subnetID</code>: <code class="inline">String</code> - (optional) the subnet ID to get the validator set of. If not given, gets validator set of the Primary Network.</li>
        </ul>`,
        exampleParameters: `{
  "height": 1,
  "subnetID":"11111111111111111111111111111111LpoYY"
}`
    },
    {
        name: 'Platform Issue Tx (platform.issueTx)',
        value: 'platform.issueTx',
        parentGroup: 'Platform',
        description: `Issue a transaction to the Platform Chain.`,
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'platform.issueTx',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/P',
        inputParameters: `
        <ul>
			<li><code class="inline">tx</code>: <code class="inline">String</code> - the byte representation of a transaction.</li>
            <li><code class="inline">encoding</code>: <code class="inline">String</code> - (optional) The encoding format to use. Can be either cb58 or hex. Defaults to cb58.</li>
        </ul>`,
        exampleParameters: `{
  "tx":"0x00",
  "encoding": "hex"
}`
    },
    {
        name: 'Platform Sample Validators (platform.sampleValidators)',
        value: 'platform.sampleValidators',
        parentGroup: 'Platform',
        description: `Sample validators from the specified Subnet.`,
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'platform.sampleValidators',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/P',
        inputParameters: `
        <ul>
			<li><code class="inline">size</code>: <code class="inline">Integer</code> - the number of validators to sample.</li>
            <li><code class="inline">subnetID</code>: <code class="inline">String</code> - (optional) the Subnet to sample from. If omitted, defaults to the Primary Network.</li>
        </ul>`,
        exampleParameters: `{
  "size": 2
}`
    },
    {
        name: 'Platform Validated By (platform.validatedBy)',
        value: 'platform.validatedBy',
        parentGroup: 'Platform',
        description: `Get the Subnet that validates a given blockchain.`,
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'platform.validatedBy',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/P',
        inputParameters: `
        <ul>
			<li><code class="inline">blockchainID</code>: <code class="inline">String</code> - the blockchain’s ID.</li>
        </ul>`,
        exampleParameters: `{
  "blockchainID": "2H1pfQqnJq1NEw1YK6CWdoH2ucrvaET8renpkxChLtnNWGYrYa"
}`
    },
    {
        name: 'Platform Validates (platform.validates)',
        value: 'platform.validates',
        parentGroup: 'Platform',
        description: `Get the IDs of the blockchains a Subnet validates.`,
        providerNetworks: {
            [NETWORK_PROVIDER.QUICKNODE]: avaxOperationsNetworks
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'platform.validates',
            params: {},
            id: 1
        },
        overrideUrl: 'http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ext/bc/P',
        inputParameters: `
        <ul>
			<li><code class="inline">subnetID</code>: <code class="inline">String</code> - the subnet ID.</li>
        </ul>`,
        exampleParameters: `{
  "subnetID":"BE5Nv8objSftNwxzcxkZGwCfVs3FPdJBio4DBwCF2A5i7RasU"
}`
    }
] as IETHOperation[]
