import { ICommonObject } from ".";

export interface IETHOperation {
	name: string;
    value: string;
    parentGroup?: string;
	description?: string;
    body: ICommonObject;
    method: string;
    providers: string[];
    networks: string[];
    inputParameters?: string;
	exampleParameters?: string;
	outputResponse?: string;
	exampleResponse?: ICommonObject;
}

export const ethOperations = [
    {
        name: 'eth_blockNumber',
        value: 'eth_blockNumber',
        parentGroup: 'Retrieving Blocks',
        description: 'Returns the number of the most recent block.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_blockNumber",
            "params":[],
            "id":0
        },
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 0,
            "result": "0xa1c054"
        },
    },
    {
        name: 'eth_getBlockByHash',
        value: 'eth_getBlockByHash',
        parentGroup: 'Retrieving Blocks',
        description: 'Returns information about a block by hash.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_getBlockByHash",
            "params":[],
            "id":0
        },
        inputParameters: `
        <ul>
            <li><code class="inline">DATA</code>, 32 Bytes - Hash of a block.</li>
            <li><code class="inline">Boolean</code> - If true it returns the full transaction objects, if false it returns only the hashes of the transactions.</li>
        </ul>`,
        exampleParameters: `[
  "0xc0f4906fea23cf6f3cce98cb44e8e1449e455b28d684dfa9ff65426495584de6",
  true
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 0,
            "result": {
                "difficulty": "0x2d50ba175407",
                "extraData": "0xe4b883e5bda9e7a59ee4bb99e9b1bc",
                "gasLimit": "0x47e7c4",
                "gasUsed": "0x5208",
                "hash": "0xc0f4906fea23cf6f3cce98cb44e8e1449e455b28d684dfa9ff65426495584de6",
                "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                "miner": "0x61c808d82a3ac53231750dadc13c777b59310bd9",
                "mixHash": "0xc38853328f753c455edaa4dfc6f62a435e05061beac136c13dbdcd0ff38e5f40",
                "nonce": "0x3b05c6d5524209f1",
                "number": "0x1e8480",
                "parentHash": "0x57ebf07eb9ed1137d41447020a25e51d30a0c272b5896571499c82c33ecb7288",
                "receiptsRoot": "0x84aea4a7aad5c5899bd5cfc7f309cc379009d30179316a2a7baa4a2ea4a438ac",
                "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
                "size": "0x28a",
                "stateRoot": "0x96dbad955b166f5119793815c36f11ffa909859bbfeb64b735cca37cbf10bef1",
                "timestamp": "0x57a1118a",
                "totalDifficulty": "0x262c34a6fd1268f6c",
                "transactions": [
                "0xc55e2b90168af6972193c1f86fa4d7d7b31a29c156665d15b9cd48618b5177ef"
                ],
                "transactionsRoot": "0xb31f174d27b99cdae8e746bd138a01ce60d8dd7b224f7c60845914def05ecc58",
                "uncles": []
            }
        },
    },
    {
        name: 'eth_call',
        value: 'eth_call',
        parentGroup: 'EVM/Smart Contract Execution',
        description: "Executes a new message call immediately without creating a transaction on the block chain.",
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_call",
            "params":[],
            "id":1
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
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 1,
            "result": "0x"
        },
    },
    {
        name: 'eth_sendRawTransaction',
        value: 'eth_sendRawTransaction',
        parentGroup: 'EVM/Smart Contract Execution',
        description: 'Submits a pre-signed transaction for broadcast to the Ethereum network.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_sendRawTransaction",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">TRANSACTION DATA</code> - The signed transaction data.</li>
		</ul>`,
        exampleParameters: `[
  "0xf869018203e882520894f17f52151ebef6c7334fad080c5704d77216b732881bc16d674ec80000801ba02da1c48b670996dcb1f447ef9ef00b33033c48a4fe938f420bec3e56bfd24071a062e0aa78a81bf0290afbc3a9d8e9a068e6d74caa66c5e0fa8a46deaae96b0833"
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 1,
            "result": "0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331"
        },
    },
    {
        name: 'eth_submitWork',
        value: 'eth_submitWork',
        parentGroup: 'EVM/Smart Contract Execution',
        description: 'Used for submitting a proof-of-work solution.',
        providers: ['infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_submitWork",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">WORK ARRAY 8 Bytes</code> - The nonce found (64 bits)</li>
            <li><code class="inline">WORK ARRAY 32 Bytes</code> - The header's pow-hash (256 bits)</li>
			<li><code class="inline">WORK ARRAY 32 Bytes</code> - The mix digest (256 bits)</li>
        </ul>`,
        exampleParameters: `[
  "0x0000000000000001",
  "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  "0xD1FE5700000000000000000000000000D1FE5700000000000000000000000000"
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 1,
            "result": false
        },
    },
    {
        name: 'eth_getBlockByNumber',
        value: 'eth_getBlockByNumber',
        parentGroup: 'Retrieving Blocks',
        description: 'Returns information about a block by block number.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_getBlockByNumber",
            "params":[],
            "id":0
        },
        inputParameters: `
        <ul>
			<li><code class="inline">QUANTITY|TAG</code> - integer of a block number, or the string "earliest", "latest" or "pending"</li>
			<li><code class="inline">Boolean</code> - If true it returns the full transaction objects, if false only the hashes of the transactions</li>
		</ul>`,
        exampleParameters: `[
  "0x1b4",
  true
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 0,
            "result": {
              "number": "0x1b4",
              "difficulty": "0x4ea3f27bc",
              "extraData": "0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32",
              "gasLimit": "0x1388",
              "gasUsed": "0x0",
              "hash": "0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae",
              "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
              "miner": "0xbb7b8287f3f0a933474a79eae42cbca977791171",
              "mixHash": "0x4fffe9ae21f1c9e15207b1f472d5bbdd68c9595d461666602f2be20daf5e7843",
              "nonce": "0x689056015818adbe",
              "parentHash": "0xe99e022112df268087ea7eafaf4790497fd21dbeeb6bd7a1721df161a6657a54",
              "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
              "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
              "size": "0x220",
              "stateRoot": "0xddc8b0234c2e0cad087c8b389aa7ef01f7d79b2570bccb77ce48648aa61c904d",
              "timestamp": "0x55ba467c",
              "totalDifficulty": "0x78ed983323d",
              "transactions": [],
              "transactionsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
              "uncles": []
            }
        },
    },
    {
        name: 'eth_getTransactionByHash',
        value: 'eth_getTransactionByHash',
        parentGroup: 'Reading Transactions',
        description: 'Returns the information about a transaction requested by transaction hash. In the response object, `blockHash`, `blockNumber`, and `transactionIndex` are `null` when the transaction is pending.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_getTransactionByHash",
            "params":[],
            "id":0
        },
        inputParameters: `
        <ul>
			<li><code class="inline">DATA</code>, 32 Bytes - hash of a transaction</li>
		</ul>`,
        exampleParameters: `[
  "0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b"
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 0,
            "result": {
              "hash": "0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b",
              "blockHash": "0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2",
              "blockNumber": "0x5daf3b",
              "from": "0xa7d9ddbe1f17865597fbd27ec712455208b6b76d",
              "gas": "0xc350",
              "gasPrice": "0x4a817c800",
              "input": "0x68656c6c6f21",
              "nonce": "0x15",
              "r": "0x1b5e176d927f8e9ab405058b2d2457392da3e20f328b16ddabcebc33eaac5fea",
              "s": "0x4ba69724e8f69de52f0125ad8b3c5c2cef33019bac3249e2c0a2192766d1721c",
              "to": "0xf02c1c8e6114b1dbe8937a39260b5b0a374432bb",
              "transactionIndex": "0x41",
              "v": "0x25",
              "value": "0xf3dbb76162000"
            }
        }
    },
    {
        name: 'eth_getTransactionCount',
        value: 'eth_getTransactionCount',
        parentGroup: 'Reading Transactions',
        description: 'Returns the number of transactions sent from an address.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_getTransactionCount",
            "params":[],
            "id":0
        },
        inputParameters: `
        <ul>
			<li><code class="inline">DATA</code>, 20 Bytes - address.</li>
			<li><code class="inline">QUANTITY|TAG</code> - integer of a block number, or the string "earliest", "latest" or "pending"</li>
        </ul>`,
        exampleParameters: `[
  "0xc94770007dda54cF92009BFF0dE90c06F603a09f",
  "latest"
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 0,
            "result": "0x219"
        }
    },
    {
        name: 'eth_getTransactionReceipt',
        value: 'eth_getTransactionReceipt',
        parentGroup: 'Reading Transactions',
        description: 'Returns the receipt of a transaction by transaction hash.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_getTransactionReceipt",
            "params":[],
            "id":0
        },
        inputParameters: `
        <ul>
			<li><code class="inline">DATA</code>, 32 Bytes - hash of a transaction.</li>
        </ul>`,
        exampleParameters: `[
  "0xab059a62e22e230fe0f56d8555340a29b2e9532360368f810595453f6fdd213b"
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 0,
            "result": {
              "transactionHash": "0xab059a62e22e230fe0f56d8555340a29b2e9532360368f810595453f6fdd213b",
              "blockHash": "0x8243343df08b9751f5ca0c5f8c9c0460d8a9b6351066fae0acbd4d3e776de8bb",
              "blockNumber": "0x429d3b",
              "contractAddress": null,
              "cumulativeGasUsed": "0x64b559",
              "from": "0x00b46c2526e227482e2ebb8f4c69e4674d262e75",
              "gasUsed": "0xcaac",
              "logs": [
                {
                  "blockHash": "0x8243343df08b9751f5ca0c5f8c9c0460d8a9b6351066fae0acbd4d3e776de8bb",
                  "address": "0xb59f67a8bff5d8cd03f6ac17265c550ed8f33907",
                  "logIndex": "0x56",
                  "data": "0x000000000000000000000000000000000000000000000000000000012a05f200",
                  "removed": false,
                  "topics": [
                    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                    "0x00000000000000000000000000b46c2526e227482e2ebb8f4c69e4674d262e75",
                    "0x00000000000000000000000054a2d42a40f51259dedd1978f6c118a0f0eff078"
                  ],
                  "blockNumber": "0x429d3b",
                  "transactionIndex": "0xac",
                  "transactionHash": "0xab059a62e22e230fe0f56d8555340a29b2e9532360368f810595453f6fdd213b"
                }
              ],
              "logsBloom": "0x00000000040000000000000000000000000000000000000000000000000000080000000010000000000000000000000000000000000040000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000010100000000000000000000000000004000000000000200000000000000000000000000000000000000000000",
              "root": "0x3ccba97c7fcc7e1636ce2d44be1a806a8999df26eab80a928205714a878d5114",
              "status": null,
              "to": "0xb59f67a8bff5d8cd03f6ac17265c550ed8f33907",
              "transactionIndex": "0xac"
            }
        }
    },
    {
        name: 'eth_getBlockTransactionCountByHash',
        value: 'eth_getBlockTransactionCountByHash',
        parentGroup: 'Reading Transactions',
        description: 'Returns the number of transactions in a block matching the given block hash.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_getBlockTransactionCountByHash",
            "params":[],
            "id":0
        },
        inputParameters: `
        <ul>
			<li><code class="inline">DATA</code>, 32 Bytes - hash of a block.</li>
        </ul>`,
        exampleParameters: `[
  "0x8243343df08b9751f5ca0c5f8c9c0460d8a9b6351066fae0acbd4d3e776de8bb"
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 0,
            "result": "0xb0"
        }
    },
    {
        name: 'eth_getBlockTransactionCountByNumber',
        value: 'eth_getBlockTransactionCountByNumber',
        parentGroup: 'Reading Transactions',
        description: 'Returns the number of transactions in a block matching the given block number.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_getBlockTransactionCountByNumber",
            "params":[],
            "id":0
        },
        inputParameters: `
        <ul>
			<li><code class="inline">QUANTITY|TAG</code> - integer of a block number, or the string "earliest", "latest" or "pending"</li>
        </ul>`,
        exampleParameters: `[
  "latest"
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 0,
            "result": "0xee"
        }
    },
    {
        name: 'eth_getTransactionByBlockHashAndIndex',
        value: 'eth_getTransactionByBlockHashAndIndex',
        parentGroup: 'Reading Transactions',
        description: 'Returns information about a transaction by block hash and transaction index position.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_getTransactionByBlockHashAndIndex",
            "params":[],
            "id":0
        },
        inputParameters: `
        <ul>
			<li><code class="inline">DATA</code>, 32 Bytes - hash of a block.</li>
            <li><code class="inline">QUANTITY</code> - integer of the transaction index position.</li>
        </ul>`,
        exampleParameters: `[
  "0xc0f4906fea23cf6f3cce98cb44e8e1449e455b28d684dfa9ff65426495584de6",
  "0x0"
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 0,
            "result": {
              "blockHash": "0xc0f4906fea23cf6f3cce98cb44e8e1449e455b28d684dfa9ff65426495584de6",
              "blockNumber": "0x1e8480",
              "from": "0x32be343b94f860124dc4fee278fdcbd38c102d88",
              "gas": "0x51615",
              "gasPrice": "0x6fc23ac00",
              "hash": "0xc55e2b90168af6972193c1f86fa4d7d7b31a29c156665d15b9cd48618b5177ef",
              "input": "0x",
              "nonce": "0x1efc5",
              "to": "0x104994f45d9d697ca104e5704a7b77d7fec3537c",
              "transactionIndex": "0x0",
              "value": "0x821878651a4d70000",
              "v": "0x1b",
              "r": "0x51222d91a379452395d0abaff981af4cfcc242f25cfaf947dea8245a477731f9",
              "s": "0x3a997c910b4701cca5d933fb26064ee5af7fe3236ff0ef2b58aa50b25aff8ca5"
            }
        }
    },
    {
        name: 'eth_getTransactionByBlockNumberAndIndex',
        value: 'eth_getTransactionByBlockNumberAndIndex',
        parentGroup: 'Reading Transactions',
        description: 'Returns information about a transaction by block number and transaction index position.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_getTransactionByBlockNumberAndIndex",
            "params":[],
            "id":0
        },
        inputParameters: `
        <ul>
			<li><code class="inline">QUANTITY|TAG</code> - a block number, or the string "earliest", "latest" or "pending"</li>
            <li><code class="inline">QUANTITY</code> - the transaction index position.</li>
        </ul>`,
        exampleParameters: `[
  "latest",
  "0x0"
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 0,
            "result": {
              "blockHash": "0xf345d6ac2cb6290489915178fef0b2fc7f5a7312dd06773c77532de6740b2b4d",
              "blockNumber": "0xa1c0ff",
              "from": "0x79c384ac9c32e90f00a214c77caac1392ec8cdea",
              "gas": "0xafbe",
              "gasPrice": "0x1270b01800",
              "hash": "0x61b27f711f58ee3090c0976c7e90d2b7eafeb7b889f0db593234f04f8ce07f22",
              "input": "0xa9059cbb0000000000000000000000004b1a99467a284cc690e3237bc69105956816f7620000000000000000000000000000000000000000000000000000001919617600",
              "nonce": "0xa",
              "to": "0xf9e5af7b42d31d51677c75bbbd37c1986ec79aee",
              "transactionIndex": "0x0",
              "value": "0x0",
              "v": "0x1b",
              "r": "0x2123cdbd1130f726ebed55fd2295239778dd4161495d2733f374d7863fc42ab1",
              "s": "0x1f08fd53ff2c3969b88d5e622561d62a799ae68e36f5142689dbfde44bbe1bed"
            }
        }
    },

    {
        name: 'eth_getBalance',
        value: 'eth_getBalance',
        parentGroup: 'Account Information',
        description: 'Returns the balance of the account of a given address.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_getBalance",
            "params":[],
            "id":0
        },
        inputParameters: `
        <ul>
			<li><code class="inline">DATA</code>, 20 Bytes - address to check for balance.</li>
			<li><code class="inline">QUANTITY|TAG</code> - a block number, or the string "earliest", "latest" or "pending"</li>
        </ul>`,
        exampleParameters: `[
  "0xc94770007dda54cF92009BFF0dE90c06F603a09f",
  "latest"
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 0,
            "result": "0x7c2562030800"
        }
    },
    {
        name: 'eth_getCode',
        value: 'eth_getCode',
        parentGroup: 'Account Information',
        description: 'Returns code at a given address.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_getCode",
            "params":[],
            "id":0
        },
        inputParameters: `
        <ul>
			<li><code class="inline">DATA</code>, 20 Bytes - address</li>
			<li><code class="inline">QUANTITY|TAG</code> - a block number, or the string "earliest", "latest" or "pending"</li>
        </ul>`,
        exampleParameters: `[
  "0xb59f67a8bff5d8cd03f6ac17265c550ed8f33907",
  "latest"
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 0,
            "result": "0x606060405236156100965763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166306fdde0381146100a557806313af40351461012f57806318160ddd1461014e578063313ce5671461017357806370a082311461019c57806375ad319a146101bb5780638da5cb5b146101ee57806395d89b411461021d578063a9059cbb14610230575b34156100a157600080fd5bfe5b005b34156100b057600080fd5b6100b8610252565b60405160208082528190810183818151815260200191508051906020019080838360005b838110156100f45780820151838201526020016100dc565b50505050905090810190601f1680156101215780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561013a57600080fd5b6100a3600160a060020a0360043516610289565b341561015957600080fd5b61016161030f565b60405190815260200160405180910390f35b341561017e57600080fd5b610186610315565b60405160ff909116815260200160405180910390f35b34156101a757600080fd5b610161600160a060020a036004351661031a565b34156101c657600080fd5b6101da600160a060020a0360043516610335565b604051901515815260200160405180910390f35b34156101f957600080fd5b61020161038e565b604051600160a060020a03909116815260200160405180910390f35b341561022857600080fd5b6100b861039d565b341561023b57600080fd5b6101da600160a060020a03600435166024356103d4565b60408051908101604052601881527f444f5420416c6c6f636174696f6e20496e64696361746f720000000000000000602082015281565b60005433600160a060020a039081169116146102a457600080fd5b600054600160a060020a0380831691167f70aea8d848e8a90fb7661b227dc522eb6395c3dac71b63cb59edd5c9899b236460405160405180910390a36000805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0392909216919091179055565b60015481565b600381565b600160a060020a031660009081526002602052604090205490565b33600160a060020a03811660009081526002602052604081206001015490919060ff16151561036357600080fd5b5050600160a060020a031660009081526002602052604090206001908101805460ff19168217905590565b600054600160a060020a031681565b60408051908101604052600381527f444f540000000000000000000000000000000000000000000000000000000000602082015281565b33600160a060020a03811660009081526002602052604081205490919083908190101561040057600080fd5b33600160a060020a03811660009081526002602052604090206001015460ff16151561042b57600080fd5b85600160a060020a031633600160a060020a03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8760405190815260200160405180910390a3600160a060020a033381166000908152600260205260408082208054899003905591881681522080548601905560019350505050929150505600a165627a7a72305820228dfae3e67abcdc7f73fb3f83a7d23f45acd853774acad9d2e1ac83b940fbe90029"
        }
    },
    {
        name: 'eth_getStorageAt',
        value: 'eth_getStorageAt',
        parentGroup: 'Account Information',
        description: "Returns the value from a storage position at a given address, or in other words, returns the state of the contract's storage, which may not be exposed via the contract's methods.",
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_getStorageAt",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">DATA</code>, 20 Bytes - address of the storage.</li>
			<li><code class="inline">QUANTITY</code> - integer of the position in the storage.</li>
            <li><code class="inline">QUANTITY|TAG</code> - a block number, or the string "earliest", "latest" or "pending"</li>
        </ul>`,
        exampleParameters: `[
  "0x295a70b2de5e3953354a6a8344e616ed314d7251",
  "0x0",
  "latest"
]`,
        exampleResponse: {
            "jsonrpc":"2.0",
            "id":1,
            "result":"0x00000000000000000000000000000000000000000000000000000000000004d2"
        }
    },
    {
        name: 'eth_accounts',
        value: 'eth_accounts',
        parentGroup: 'Account Information',
        description: 'Returns a list of addresses owned by client.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_accounts",
            "params":[],
            "id":1
        },
        exampleResponse: {
            "id":1,
            "jsonrpc": "2.0",
            "result": []
        }
    },
    {
        name: 'parity_nextNonce',
        value: 'parity_nextNonce',
        parentGroup: 'Account Information',
        description: 'Returns next available nonce for transaction from given account. Includes pending block and transaction queue.',
        providers: ['infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_getProof",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">ADDRESS</code> - a string representing the address (20 bytes) to check for transaction count for</li>
        </ul>`,
        exampleParameters: `[
  "0xc94770007dda54cF92009BFF0dE90c06F603a09f"
]`,
        exampleResponse: {
            "id": 1,
            "jsonrpc": "2.0",
            "result": "0x1a"
        }
    },
    {
        name: 'eth_getProof',
        value: 'eth_getProof',
        parentGroup: 'Account Information',
        description: 'Returns the account and storage values of the specified account including the Merkle-proof. This call can be used to verify that the data you are pulling from is not tampered with.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_getProof",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">DATA</code>, 20 Bytes - address of the account.</li>
			<li><code class="inline">ARRAY</code>, 32 Bytes - array of storage-keys which should be proofed and included.</li>
            <li><code class="inline">QUANTITY|TAG</code> - a block number, or the string "earliest", "latest" or "pending"</li>
        </ul>`,
        exampleParameters: `[
  "0x7F0d15C7FAae65896648C8273B6d7E43f58Fa842",
  ["0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421"],
  "latest"
]`,
        exampleResponse: {
            "id": 1,
            "jsonrpc": "2.0",
            "result": {
              "accountProof": [
                "0xf90211a...0701bc80",
                "0xf90211a...0d832380",
                "0xf90211a...5fb20c80",
                "0xf90211a...0675b80",
                "0xf90151a0...ca08080"
              ],
              "balance": "0x0",
              "codeHash": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
              "nonce": "0x0",
              "storageHash": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
              "storageProof": [
                {
                  "key": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
                  "proof": [
                    "0xf90211a...0701bc80",
                    "0xf90211a...0d832380"
                  ],
                  "value": "0x1"
                }
              ]
            }
        }
    },
    {
        name: 'eth_getLogs',
        value: 'eth_getLogs',
        parentGroup: 'Event Logs',
        description: "Returns an array of all logs matching a given filter object.",
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_getLogs",
            "params":[],
            "id":0
        },
        inputParameters: `
        <ul>
			<li><code class="inline">Object</code> - The filter object</li>
		    <ul>
			    <li><code class="inline">fromBlock</code>: <code class="inline">QUANTITY|TAG</code> - (optional, default: "latest") Value:</li>
				<ul>
                    <li>Integer block number</li>
                    <li>"latest" for the last mined block</li>
                    <li>"pending", "earliest" for not yet mined transactions.</li>
                </ul>
                <li><code class="inline">toBlock</code>: <code class="inline">QUANTITY|TAG</code> - (optional, default: "latest") Value:</li>
				<ul>
                    <li>Integer block number</li>
                    <li>"latest" for the last mined block</li>
                    <li>"pending", "earliest" for not yet mined transactions.</li>
                </ul>
                <li><code class="inline">address</code>: <code class="inline">DATA|Array</code> 20 Bytes - (optional) Contract address or a list of addresses from which logs should originate.</li>
				<li><code class="inline">topics</code>: <code class="inline">Array of DATA</code>  - (optional) Array of 32 Bytes DATA topics.</li>
				<ul>
                    <li>Topics are order-dependent. Each topic can also be an array of DATA with "or" options.</li>
                </ul>
                <li><code class="inline">blockHash</code>: <code class="inline">DATA</code>, 32 Bytes - (optional) With the addition of EIP-234 (Geth >= v1.8.13 or Parity >= v2.1.0), blockHash is a new filter option which restricts the logs returned to the single block with the 32-byte hash blockHash. Using blockHash is equivalent to fromBlock = toBlock = the block number with hash <code class="inline">blockHash</code>. If blockHash is present in the filter criteria, then neither <code class="inline">fromBlock</code> nor <code class="inline">toBlock</code> are allowed.</li>
			</ul>
		</ul>`,
        exampleParameters: `[
  {
    "address": "0xb59f67a8bff5d8cd03f6ac17265c550ed8f33907",
    "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
    ],
    "blockHash": "0x8243343df08b9751f5ca0c5f8c9c0460d8a9b6351066fae0acbd4d3e776de8bb"
  }
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 0,
            "result": [
              {
                "address": "0xb59f67a8bff5d8cd03f6ac17265c550ed8f33907",
                "topics": [
                  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                  "0x00000000000000000000000000b46c2526e227482e2ebb8f4c69e4674d262e75",
                  "0x00000000000000000000000054a2d42a40f51259dedd1978f6c118a0f0eff078"
                ],
                "data": "0x000000000000000000000000000000000000000000000000000000012a05f200",
                "blockNumber": "0x429d3b",
                "transactionHash": "0xab059a62e22e230fe0f56d8555340a29b2e9532360368f810595453f6fdd213b",
                "transactionIndex": "0xac",
                "blockHash": "0x8243343df08b9751f5ca0c5f8c9c0460d8a9b6351066fae0acbd4d3e776de8bb",
                "logIndex": "0x56",
                "removed": false
              }
            ]
        }
    },
    {
        name: 'eth_protocolVersion',
        value: 'eth_protocolVersion',
        parentGroup: 'Chain Information',
        description: 'Returns the current ethereum protocol version.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'optimism', 'optimism-kovan'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_protocolVersion",
            "params":[],
            "id":0
        },
        exampleResponse:{
            "jsonrpc": "2.0",
            "id": 0,
            "result": "0x40"
        }
    },
    {
        name: 'eth_gasPrice',
        value: 'eth_gasPrice',
        parentGroup: 'Chain Information',
        description: 'Returns the current price per gas in wei.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_gasPrice",
            "params":[],
            "id":0
        },
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 0,
            "result": "0x98bca5a00"
        }
    },
    {
        name: 'eth_syncing',
        value: 'eth_syncing',
        parentGroup: 'Chain Information',
        description: 'Returns an object with data about the sync status or false.',
        providers: ['infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_syncing",
            "params":[],
            "id":1
        },
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 0,
            "result": false
        }
    },
    {
        name: 'eth_estimateGas',
        value: 'eth_estimateGas',
        parentGroup: 'Chain Information',
        description: 'Generates and returns an estimate of how much gas is necessary to allow the transaction to complete. The transaction will not be added to the blockchain.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_estimateGas",
            "params":[],
            "id":0
        },
        inputParameters: `
        <ul>
			<li><code class="inline">Object</code> - The transaction call object</li>
		    <ul>
			    <li><code class="inline">from</code>: <code class="inline">DATA</code>, 20 Bytes - (optional) The address the transaction is sent from.</li>
				<li><code class="inline">to</code>: <code class="inline">DATA</code>, 20 Bytes - The address the transaction is directed to.</li>
				<li><code class="inline">gas</code>: <code class="inline">QUANTITY</code> - (optional) Integer of the gas provided for the transaction execution. <code class="inline">eth_estimateGas</code> consumes zero gas, but this parameter may be needed by some executions. NOTE: this parameter has a cap of 550 Million gas per request.</li>
				<li><code class="inline">gasPrice</code>: <code class="inline">QUANTITY</code> - (optional) Integer of the gasPrice used for each paid gas.</li>
				<li><code class="inline">value</code>: <code class="inline">QUANTITY</code> - (optional) Integer of the value sent with this transaction.</li>
				<li><code class="inline">data</code>: <code class="inline">DATA</code> - (optional) Hash of the method signature and encoded parameters.</li>
			</ul>
			<li><code class="inline">QUANTITY|TAG</code> - integer block number, or the string "latest", "earliest" or "pending"</li>
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
]`,
        exampleResponse: {
            "id":1,
            "jsonrpc": "2.0",
            "result": "0x5208"
        }
    },
    {
        name: 'eth_feeHistory',
        value: 'eth_feeHistory',
        parentGroup: 'Chain Information',
        description: 'Returns a collection of historical gas information',
        providers: ['alchemy', 'infura'],
        networks: ['ethereum', 'optimism', 'optimism-kovan'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_feeHistory",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">Object</code></li>
		    <ul>
			    <li><code class="inline">OLDESTBLOCK</code> - Lowest number block of the returned range.</li>
				<li><code class="inline">BASEFEEPERGAS</code> - An array of block base fees per gas. This includes the next block after the newest of the returned range, because this value can be derived from the newest block. Zeroes are returned for pre-EIP-1559 blocks.</li>
				<li><code class="inline">GASUSEDRATIO</code> - An array of block gas used ratios. These are calculated as the ratio of gasUsed and gasLimit.</li>
				<li><code class="inline">REWARD</code> - (Optional) An array of effective priority fee per gas data points from a single block. All zeroes are returned if the block is empty.</li>
			</ul>
		</ul>`,
        exampleParameters: `[
  4,
  "latest",
  [25, 75]
]`,
        exampleResponse: {
            "id": "1",
            "jsonrpc": "2.0",
            "result": {
              "oldestBlock": 10762137,
              "reward": [
                [
                  "0x4a817c7ee",
                  "0x4a817c7ee"
                ], [
                  "0x773593f0",
                  "0x773593f5"
                ], [
                  "0x0",
                  "0x0"
                ], [
                  "0x773593f5",
                  "0x773bae75"
                ]
              ],
              "baseFeePerGas": [
                "0x12",
                "0x10",
                "0x10",
                "0xe",
                "0xd"
              ],
              "gasUsedRatio": [
                0.026089875,
                0.406803,
                0,
                0.0866665
              ]
            }
        }
    },
    {
        name: 'eth_maxPriorityFeePerGas',
        value: 'eth_maxPriorityFeePerGas',
        parentGroup: 'Chain Information',
        description: 'Returns a fee per gas that is an estimate of how much you can pay as a priority fee, or "tip", to get a transaction included in the current block.',
        providers: ['alchemy'],
        networks: ['ethereum'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_maxPriorityFeePerGas",
            "params":[],
            "id":1
        },
        exampleResponse: {
            "id":1,
            "jsonrpc": "2.0",
            "result": "0x12a05f1f9"
        }
    },
    {
        name: 'eth_chainId',
        value: 'eth_chainId',
        parentGroup: 'Chain Information',
        description: 'Returns the currently configured chain ID, a value used in replay-protected transaction signing as introduced by EIP-155.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_chainId",
            "params":[],
            "id":83
        },
        exampleResponse: {
            "id": 83,
            "jsonrpc": "2.0",
            "result": "0x3d" // 61
        }
    },
    {
        name: 'net_version',
        value: 'net_version',
        parentGroup: 'Chain Information',
        description: 'Returns the current network id.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"net_version",
            "params":[],
            "id":67
        },
        exampleResponse: {
            "id":67,
            "jsonrpc": "2.0",
            "result": "3"
        }
    },
    {
        name: 'net_listening',
        value: 'net_listening',
        parentGroup: 'Chain Information',
        description: 'Returns true if client is actively listening for network connections.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"net_listening",
            "params":[],
            "id":1
        },
        exampleResponse: {
            "id":1,
            "jsonrpc": "2.0",
            "result": true
        }
    },
    {
        name: 'net_peerCount',
        value: 'net_peerCount',
        parentGroup: 'Chain Information',
        description: 'Returns the number of peers currently connected to the client.',
        providers: ['infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"net_peerCount",
            "params":[],
            "id":1
        },
        exampleResponse: {
            "id":1,
            "jsonrpc": "2.0",
            "result": "0x64"
        }
    },
    {
        name: 'eth_getUncleByBlockNumberAndIndex',
        value: 'eth_getUncleByBlockNumberAndIndex',
        parentGroup: 'Retrieving Uncles',
        description: 'Returns information about an uncle of a block by number and uncle index position.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_getUncleByBlockNumberAndIndex",
            "params":[],
            "id":0
        },
        inputParameters: `
        <ul>
			<li><code class="inline">QUANTITY|TAG</code> - integer of a block number, or the string "earliest", "latest" or "pending"</li>
			<li><code class="inline">QUANTITY</code> - the uncle's index position.</li>
		</ul>`,
        exampleParameters: `[
  "0x29c",
  "0x0"
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 0,
            "result": {
              "difficulty": "0x57f117f5c",
              "extraData": "0x476574682f76312e302e302f77696e646f77732f676f312e342e32",
              "gasLimit": "0x1388",
              "gasUsed": "0x0",
              "hash": "0x932bdf904546a2287a2c9b2ede37925f698a7657484b172d4e5184f80bdd464d",
              "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
              "miner": "0x5bf5e9cf9b456d6591073513de7fd69a9bef04bc",
              "mixHash": "0x4500aa4ee2b3044a155252e35273770edeb2ab6f8cb19ca8e732771484462169",
              "nonce": "0x24732773618192ac",
              "number": "0x299",
              "parentHash": "0xa779859b1ee558258b7008bbabff272280136c5dd3eb3ea3bfa8f6ae03bf91e5",
              "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
              "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
              "size": "0x21d",
              "stateRoot": "0x2604fbf5183f5360da249b51f1b9f1e0f315d2ff3ffa1a4143ff221ad9ca1fec",
              "timestamp": "0x55ba4827",
              "transactionsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
              "uncles": []
            }
        }
    },
    {
        name: 'eth_getUncleByBlockHashAndIndex',
        value: 'eth_getUncleByBlockHashAndIndex',
        parentGroup: 'Retrieving Uncles',
        description: 'Returns information about an uncle of a block by hash and uncle index position.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_getUncleByBlockHashAndIndex",
            "params":[],
            "id":0
        },
        inputParameters: `
        <ul>
			<li><code class="inline">QUANTITY|TAG</code> - integer of a block number, or the string "earliest", "latest" or "pending"</li>
			<li><code class="inline">QUANTITY</code> - the uncle's index position.</li>
		</ul>`,
        exampleParameters: `[
  "0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35",
  "0x0"
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 0,
            "result": {
              "difficulty": "0xbf93da424b943",
              "extraData": "0x65746865726d696e652d657539",
              "gasLimit": "0x7a121d",
              "gasUsed": "0x79ea62",
              "hash": "0x824cce7c7c2ec6874b9fa9a9a898eb5f27cbaf3991dfa81084c3af60d1db618c",
              "logsBloom": "0x0948432021200401804810002000000000381001001202440000010020000080a016262050e44850268052000400100505022305a64000054004200b0c04110000080c1055c42001054b804940a0401401008a00112d80082113400c10006580140005011a40220020000010001c0a00082300434002000050840010102082801c2000148540201004491814020480080111a0300600000003800640024200109c00202010044000880000106810a1a010000028a0100000422000140011000050a2a44b3080001060800000540c108102102600d000004730404a880100600021080100403000180000062642408b440060590400080101e046f08000000430",
              "miner": "0xea674fdde714fd979de3edf0f56aa9716b898ec8",
              "mixHash": "0x0b15fe0a9aa789c167b0f5ade7b72969d9f2193014cb4e98382254f60ffb2f4a",
              "nonce": "0xa212d6400b89b3f6",
              "number": "0x5bad54",
              "parentHash": "0x05e19fb68d9ec798073808e8b3170875cb327d4b6cde7d6f60fe194677bb26fd",
              "receiptsRoot": "0x90807b32c4aa4610c57289de57fa68ba50ed53f14dd2c25f1862aa049029dcd6",
              "sha3Uncles": "0xf763576c1ea6a8c61a206e16b1a2451bec5cba1c7545d7ff733a1e8c78715569",
              "size": "0x216",
              "stateRoot": "0xebc7a1603bfffe0a14bdb89f898e2f2824abb40f04579beb7b920c56d6e273c9",
              "timestamp": "0x5b54143f",
              "transactionsRoot": "0x7562cba41e067b364b933e7b566fb2444f6954fef3964a5a487d4cd79d97a56c",
              "uncles": []
            }
        }
    },
    {
        name: 'eth_getUncleCountByBlockHash',
        value: 'eth_getUncleCountByBlockHash',
        parentGroup: 'Retrieving Uncles',
        description: 'Returns the number of uncles in a block matching the given block hash.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_getUncleCountByBlockHash",
            "params":[],
            "id":0
        },
        inputParameters: `
        <ul>
			<li><code class="inline">DATA</code>, 32 Bytes - hash of a block.</li>
		</ul>`,
        exampleParameters: `[
  "0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35"
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 0,
            "result": "0x1"
        }
    },
    {
        name: 'eth_getUncleCountByBlockNumber',
        value: 'eth_getUncleCountByBlockNumber',
        parentGroup: 'Retrieving Uncles',
        description: 'Returns the number of uncles in a block matching the give block number.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_getUncleCountByBlockNumber",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">QUANTITY|TAG</code> - integer of a block number, or the string "latest", "earliest" or "pending"</li>
		</ul>`,
        exampleParameters: `[
  "0xe8"
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 0,
            "result": "0x0"
        }
    },
    {
        name: 'eth_getFilterChanges',
        value: 'eth_getFilterChanges',
        parentGroup: 'Filters',
        description: 'Polling method for a filter, which returns an array of logs which occurred since last poll.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_getFilterChanges",
            "params":[],
            "id":73
        },
        inputParameters: `
        <ul>
			<li><code class="inline">QUANTITY</code> - the filter id.</li>
		</ul>`,
        exampleParameters: `[
  "0xfe704947a3cd3ca12541458a4321c869"
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 73,
            "result": [{
                "address": "0xb5a5f22694352c15b00323844ad545abb2b11028",
                "blockHash": "0x99e8663c7b6d8bba3c7627a17d774238eae3e793dee30008debb2699666657de",
                "blockNumber": "0x5d12ab",
                "data": "0x0000000000000000000000000000000000000000000000a247d7a2955b61d000",
                "logIndex": "0x0",
                "removed": false,
                "topics": ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "0x000000000000000000000000bdc0afe57b8e9468aa95396da2ab2063e595f37e", "0x0000000000000000000000007503e090dc2b64a88f034fb45e247cbd82b8741e"],
                "transactionHash": "0xa74c2432c9cf7dbb875a385a2411fd8f13ca9ec12216864b1a1ead3c99de99cd",
                "transactionIndex": "0x3"
            }, {
                "address": "0xe38165c9f6deb144afc9c32c206b024817e1496d",
                "blockHash": "0x99e8663c7b6d8bba3c7627a17d774238eae3e793dee30008debb2699666657de",
                "blockNumber": "0x5d12ab",
                "data": "0x0000000000000000000000000000000000000000000000000000000025c6b720",
                "logIndex": "0x3",
                "removed": false,
                "topics": ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "0x00000000000000000000000080e73e47173b2d00b531bf83bc39e710157125c3", "0x0000000000000000000000008f6cc93795969e5bbbf07c66dfee7d41ad24f1ef"],
                "transactionHash": "0x9e8f1cb1facb9a11a1cf947634053a0b2d557399f926b12127aa10497a2f0153",
                "transactionIndex": "0x5"
            }]
        }
    },
    {
        name: 'eth_getFilterLogs',
        value: 'eth_getFilterLogs',
        parentGroup: 'Filters',
        description: 'Returns an array of all logs matching filter with given id.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_getFilterLogs",
            "params":[],
            "id":74
        },
        inputParameters: `
        <ul>
			<li><code class="inline">QUANTITY</code> - the filter id.</li>
		</ul>`,
        exampleParameters: `[
  "0xfe704947a3cd3ca12541458a4321c869"
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 73,
            "result": [{
                "address": "0xb5a5f22694352c15b00323844ad545abb2b11028",
                "blockHash": "0x99e8663c7b6d8bba3c7627a17d774238eae3e793dee30008debb2699666657de",
                "blockNumber": "0x5d12ab",
                "data": "0x0000000000000000000000000000000000000000000000a247d7a2955b61d000",
                "logIndex": "0x0",
                "removed": false,
                "topics": ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "0x000000000000000000000000bdc0afe57b8e9468aa95396da2ab2063e595f37e", "0x0000000000000000000000007503e090dc2b64a88f034fb45e247cbd82b8741e"],
                "transactionHash": "0xa74c2432c9cf7dbb875a385a2411fd8f13ca9ec12216864b1a1ead3c99de99cd",
                "transactionIndex": "0x3"
            }, {
                "address": "0xe38165c9f6deb144afc9c32c206b024817e1496d",
                "blockHash": "0x99e8663c7b6d8bba3c7627a17d774238eae3e793dee30008debb2699666657de",
                "blockNumber": "0x5d12ab",
                "data": "0x0000000000000000000000000000000000000000000000000000000025c6b720",
                "logIndex": "0x3",
                "removed": false,
                "topics": ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "0x00000000000000000000000080e73e47173b2d00b531bf83bc39e710157125c3", "0x0000000000000000000000008f6cc93795969e5bbbf07c66dfee7d41ad24f1ef"],
                "transactionHash": "0x9e8f1cb1facb9a11a1cf947634053a0b2d557399f926b12127aa10497a2f0153",
                "transactionIndex": "0x5"
            }]
        }
    },
    {
        name: 'eth_newBlockFilter',
        value: 'eth_newBlockFilter',
        parentGroup: 'Filters',
        description: 'Creates a filter in the node, to notify when a new block arrives.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_newBlockFilter",
            "params":[],
            "id":73
        },
        inputParameters: `
        <ul>
			<li><code class="inline">QUANTITY</code> - the filter id.</li>
		</ul>`,
        exampleParameters: `[
  "0xfe704947a3cd3ca12541458a4321c869"
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 0,
            "result": "0x9fb7f13924bb605fd29f3ddd6d193ece"
        }
    },
    {
        name: 'eth_newFilter',
        value: 'eth_newFilter',
        parentGroup: 'Filters',
        description: 'Creates a filter object, based on filter options, to notify when the state changes (logs).',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_newFilter",
            "params":[],
            "id":0
        },
        inputParameters: `
        <ul>
			<li><code class="inline">Object</code> - The filter object</li>
		    <ul>
			    <li><code class="inline">fromBlock</code>: <code class="inline">QUANTITY|TAG</code> - (optional, default: "latest") Value:</li>
				<ul>
                    <li>Integer block number</li>
                    <li>"latest" for the last mined block</li>
                    <li>"pending", "earliest" for not yet mined transactions.</li>
                </ul>
                <li><code class="inline">toBlock</code>: <code class="inline">QUANTITY|TAG</code> - (optional, default: "latest") Value:</li>
				<ul>
                    <li>Integer block number</li>
                    <li>"latest" for the last mined block</li>
                    <li>"pending", "earliest" for not yet mined transactions.</li>
                </ul>
                <li><code class="inline">address</code>: <code class="inline">DATA|Array</code> 20 Bytes - (optional) Contract address or a list of addresses from which logs should originate.</li>
				<li><code class="inline">topics</code>: <code class="inline">Array of DATA</code>  - (optional) Array of 32 Bytes DATA topics.</li>
				<ul>
                    <li>Topics are order-dependent. Each topic can also be an array of DATA with "or" options.</li>
                </ul>
			</ul>
		</ul>`,
        exampleParameters: `[
  {
    "fromBlock": "0x1",
    "toBlock": "0x2",
    "address": "0xb59f67a8bff5d8cd03f6ac17265c550ed8f33907",
    "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
    ]
  }
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 0,
            "result": "0xdcc9a819f80efa9e1d215a9d41b2d22e"
        }
    },
    {
        name: 'eth_newPendingTransactionFilter',
        value: 'eth_newPendingTransactionFilter',
        parentGroup: 'Filters',
        description: 'Creates a filter in the node, to notify when new pending transactions arrive. To check if the state has changed, call eth_getFilterChanges.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_newPendingTransactionFilter",
            "params":[],
            "id":73
        },
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 0,
            "result": "0xa08914f1caedfcbe814d9fb33e69678d"
        }
    },
    {
        name: 'eth_uninstallFilter',
        value: 'eth_uninstallFilter',
        parentGroup: 'Filters',
        description: 'Uninstalls a filter with given id.',
        providers: ['alchemy', 'infura'],
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'optimism', 'optimism-kovan', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_uninstallFilter",
            "params":[],
            "id":0
        },
        inputParameters: `
        <ul>
            <li><code class="inline">QUANTITY</code> - The filter id.</li>
        </ul>`,
        exampleParameters: `["0xfe704947a3cd3ca12541458a4321c869"]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 0,
            "result": false
        }
    },
] as IETHOperation[];


export const polygonOperations = [
    {
        name: 'bor_getAuthor',
        value: 'bor_getAuthor',
        parentGroup: 'Account Information',
        description: 'Returns address of Author',
        providers: ['alchemy', 'infura'],
        networks: ['matic', 'maticmum'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"bor_getAuthor",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li>block number (in hexadecimal format)</li>
        </ul>`,
        exampleParameters: '["0x1234"]',
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 1,
            "result": "0x5973918275c01f50555d44e92c9d9b353cadad54"
        }
    },
    {
        name: 'bor_getCurrentValidators',
        value: 'bor_getCurrentValidators',
        parentGroup: 'Account Information',
        description: 'Returns current validators',
        providers: ['alchemy', 'infura'],
        networks: ['matic', 'maticmum'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"bor_getCurrentValidators",
            "params":[],
            "id":1
        },
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 1,
            "result": [
                {
                    "ID": 0,
                    "signer": "0x46a3a41bd932244dd08186e4c19f1a7e48cbcdf4",
                    "power": 1,
                    "accum": -15
                },
                {
                    "ID": 0,
                    "signer": "0x6a654ca3bfb5cfb23bf30bafbf96b3b6ec26bb0e",
                    "power": 1,
                    "accum": -21
                },
                {
                    "ID": 0,
                    "signer": "0x7c7379531b2aee82e4ca06d4175d13b9cbeafd49",
                    "power": 5,
                    "accum": -8
                },
                {
                    "ID": 0,
                    "signer": "0xe77bbfd8ed65720f187efdd109e38d75eaca7385",
                    "power": 2,
                    "accum": 5
                },
                {
                    "ID": 0,
                    "signer": "0xf0245f6251bef9447a08766b9da2b07b28ad80b0",
                    "power": 7,
                    "accum": -4
                }
            ]
        }
    },
    {
        name: 'bor_getCurrentProposer',
        value: 'bor_getCurrentProposer',
        parentGroup: 'Account Information',
        description: "Returns current proposer's address",
        providers: ['alchemy', 'infura'],
        networks: ['matic', 'maticmum'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"bor_getCurrentProposer",
            "params":[],
            "id":1
        },
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 1,
            "result": "0xb79fad4ca981472442f53d16365fdf0305ffd8e9"
        }
    },
    {
        name: 'bor_getRootHash',
        value: 'bor_getRootHash',
        parentGroup: 'Account Information',
        description: "Returns the root hash given a block range",
        providers: ['alchemy', 'infura'],
        networks: ['matic', 'maticmum'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"bor_getRootHash",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">from</code> block number (in int format)</li>
            <li><code class="inline">to</code> block number (in int format)</li>
        </ul>`,
        exampleParameters: '[1000000, 1032767]',
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 1,
            "result": "04b073e17b7186ab4daae17c5e2cc2d5a729cffd102cede41ee458a2d5573994"
        }
    },
    {
        name: 'eth_getSignersAtHash',
        value: 'eth_getSignersAtHash',
        parentGroup: 'Account Information',
        description: "Returns all signs given a blockhash",
        providers: ['alchemy'],
        networks: ['matic', 'maticmum'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_getSignersAtHash",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">blockhash</code></li>
        </ul>`,
        exampleParameters: '["0x29fa73e3da83ddac98f527254fe37002e052725a88904bac14f03e919e1e2876"]',
        exampleResponse:{
            "jsonrpc": "2.0",
            "id": 1,
            "result": [
                "0x0375b2fc7140977c9c76d45421564e354ed42277",
                "0x42eefcda06ead475cde3731b8eb138e88cd0bac3",
                "0x5973918275c01f50555d44e92c9d9b353cadad54",
                "0x7fcd58c2d53d980b247f1612fdba93e9a76193e6",
                "0xb702f1c9154ac9c08da247a8e30ee6f2f3373f41",
                "0xb8bb158b93c94ed35c1970d610d1e2b34e26652c",
                "0xf84c74dea96df0ec22e11e7c33996c73fcc2d822"
            ]
        }
    },
    {
        name: 'eth_getTransactionReceiptsByBlock',
        value: 'eth_getTransactionReceiptsByBlock',
        parentGroup: 'Reading Transactions',
        description: "Returns all transaction receipts for the given block number or hash",
        providers: ['alchemy'],
        networks: ['matic', 'maticmum'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"eth_getTransactionReceiptsByBlock",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">block_number</code>in hex OR <code class="inline">block_hash</code></li>
        </ul>`,
        exampleParameters: '["0x989689"]',
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 1,
            "result": [
              {
                "blockHash": "0x224c0c3153d6bf1f45f461053aee6cbf71e5b5209685c91d81c288b59c82fb47",
                "blockNumber": "0x989689",
                "contractAddress": null,
                "cumulativeGasUsed": "0x63ee1",
                "from": "0x7b5fc677cf27a807adf2ebcef72db3b935df6c0a",
                "gasUsed": "0x63ee1",
                "logs": [
                  {
                    "address": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
                    "topics": [
                      "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
                      "0x0000000000000000000000003d8a89a20aa73fba0f30d080e8120de9f9555724",
                      "0x000000000000000000000000170f88be2538b8aca98a87c1b186ce5f773cc028"
                    ],
                    "data": "0x000000000000000000000000000000000000000000000000000000007dd34dc0",
                    "blockNumber": "0x989689",
                    "transactionHash": "0x19a2ba50b19ee8ed28fb902fe8cd0a64b0f7a4fe01281e70e2387fdd00ffd5f0",
                    "transactionIndex": "0x0",
                    "blockHash": "0x224c0c3153d6bf1f45f461053aee6cbf71e5b5209685c91d81c288b59c82fb47",
                    "logIndex": "0x0",
                    "removed": false
                  },
                  {
                    "address": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
                    "topics": [
                      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                      "0x0000000000000000000000003d8a89a20aa73fba0f30d080e8120de9f9555724",
                      "0x000000000000000000000000170f88be2538b8aca98a87c1b186ce5f773cc028"
                    ],
                    "data": "0x000000000000000000000000000000000000000000000000000000007dd34dc0",
                    "blockNumber": "0x989689",
                    "transactionHash": "0x19a2ba50b19ee8ed28fb902fe8cd0a64b0f7a4fe01281e70e2387fdd00ffd5f0",
                    "transactionIndex": "0x0",
                    "blockHash": "0x224c0c3153d6bf1f45f461053aee6cbf71e5b5209685c91d81c288b59c82fb47",
                    "logIndex": "0x1",
                    "removed": false
                  },
                ],
                "logsBloom": "0x0400000002000000000100000000000000000000000000001000000000104000000000000000000001000020200000001000800000000000001008014020004000000000001000000000000c000200840000000000000000202100000000000000000000020000000001000000000800000000000800000980100010000000002001000000000000000000000000000000100000020000000000000000000000220000000400000000000000008001000008000000000020000000000000004000000002000000000001000000000000000404000600000000100000100020000010008000002000040000000000000010000000000000008000100002100000",
                "status": "0x1",
                "to": "0xd216153c06e857cd7f72665e0af1d7d82172f494",
                "transactionHash": "0x19a2ba50b19ee8ed28fb902fe8cd0a64b0f7a4fe01281e70e2387fdd00ffd5f0",
                "transactionIndex": "0x0"
              }
            ]
        }
    },
] as IETHOperation[];