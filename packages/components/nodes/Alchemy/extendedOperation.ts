import { INodeOptionsValue, INodeParams } from '../../src';
import { IETHOperation } from '../../src/ETHOperations';

export const NFTOperationsOptions = [
    {
        label: 'Get NFTs',
        name: 'getNFTs',
        description: 'Gets all NFTs currently owned by a given address',
    },
    {
        label: 'Get NFT Metadata',
        name: 'getNFTMetadata',
        description: 'Gets the metadata associated with a given NFT',
    },
    {
        label: 'Get NFTs For Collection',
        name: 'getNFTsForCollection',
        description: 'Gets all NFTs for a given NFT contract',
        show: {
            'networks.network': ['homestead', 'goerli', 'matic', 'maticmum']
        }
    },
] as INodeOptionsValue[];

export const getNFTsProperties = [
    {
        label: 'Owner Address',
        name: 'owner',
        type: 'string',
        description: 'Address for NFT owner (can be in ENS format!)',
        default: '',
        show: {
            'inputParameters.operation': ['getNFTs']
        }
    },
    {
        label: 'PageKey',
        name: 'pageKey',
        type: 'string',
        description: 'UUID for pagination. If more results are available, a UUID pageKey will be returned in the response. Pass that UUID into pageKey to fetch the next 100 NFTs.',
        default: '',
        show: {
            'inputParameters.operation': ['getNFTs']
        },
        optional: true
    },
    {
        label: 'Metadata',
        name: 'withMetadata',
        type: 'boolean',
        description: 'If boolean is set to true the query will include metadata for each returned token.',
        default: true,
        show: {
            'inputParameters.operation': ['getNFTs']
        }
    },
] as INodeParams[];

export const getNFTMetadataProperties = [
    {
        label: 'Contract Address',
        name: 'contractAddress',
        type: 'string',
        description: 'Address of NFT contract',
        default: '',
        show: {
            'inputParameters.operation': ['getNFTMetadata']
        }
    },
    {
        label: 'Token Id',
        name: 'tokenId',
        type: 'string',
        description: 'Id for NFT',
        default: '',
        show: {
            'inputParameters.operation': ['getNFTMetadata']
        }
    },
    {
        label: 'Token Type',
        name: 'tokenType ',
        type: 'options',
        description: '"ERC721" or "ERC1155"; specifies type of token to query for',
        options: [
            {
                label: 'ERC721',
                name: 'ERC721',
            },
            {
                label: 'ERC1155',
                name: 'ERC1155',
            },
            {
                label: '',
                name: '',
            },
        ],
        default: '',
        show: {
            'inputParameters.operation': ['getNFTMetadata']
        }
    },
] as INodeParams[];

export const getNFTsForCollectionProperties = [
    {
        label: 'Contract Address',
        name: 'contractAddress',
        type: 'string',
        description: 'Contract address for the NFT collection',
        default: '',
        show: {
            'inputParameters.operation': ['getNFTsForCollection']
        }
    },
    {
        label: 'Start Token',
        name: 'startToken',
        type: 'string',
        description: 'An offset used for pagination. Can be a hex string, or a decimal.',
        default: '',
        optional: true,
        show: {
            'inputParameters.operation': ['getNFTsForCollection']
        }
    },
    {
        label: 'Metadata',
        name: 'withMetadata',
        type: 'boolean',
        description: 'If set to true, returns NFT metadata; otherwise will only return tokenIds',
        default: true,
        optional: true,
        show: {
            'inputParameters.operation': ['getNFTsForCollection']
        }
    },
    {
        label: 'Limit',
        name: 'limit',
        type: 'number',
        description: 'Sets the total number of NFTs returned in the response. Defaults to 100.',
        default: 100,
        optional: true,
        show: {
            'inputParameters.operation': ['getNFTsForCollection']
        }
    },
] as INodeParams[];

export const transactionReceiptsOperations = [
    {
        name: 'alchemy_getTransactionReceipts',
        value: 'alchemy_getTransactionReceipts',
        description: 'Fetch all transaction receipts for a block number or a block hash in one API call ',
        networks: ['homestead', 'rinkeby', 'goerli', 'ropsten', 'kovan', 'matic', 'maticmum', 'arbitrum', 'arbitrum-rinkeby'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"alchemy_getTransactionReceipts",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">blockNumber</code> - (hex) The block number you want to get transaction receipts for</li>
            <li><code class="inline">blockHash</code> - The block hash you want to get transaction receipts for</li>
        </ul>`,
        exampleParameters: `[
  {
    "blockHash": "0xeb7214680220e50f1e9662d2f15569395f8e67455cc2f5cbf7db8b3b1567558c"
  }
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 1,
            "result": {
              "receipts": [
                {
                  "transactionHash": "0x103c47bd1917f5b57c89d55bc9a664eca732fadcc7596670030ad27ac26259ae",
                  "blockHash": "0xbd6523808cf0a98c528b7e169b357c46a7cd0f602cec98f05bb5962553522647",
                  "blockNumber": "0xd63adc",
                  "contractAddress": null,
                  "cumulativeGasUsed": "0x26d93",
                  "effectiveGasPrice": "0x1e836343a7",
                  "from": "0xcc72f778eedd8e337e6cb58ca9ec8ba2912e71dc",
                  "gasUsed": "0x26d93",
                  "logs": [
                    {
                      "address": "0xa5def515cfd373d17830e7c1de1639cb3530a112",
                      "topics": [
                        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                        "0x000000000000000000000000cc72f778eedd8e337e6cb58ca9ec8ba2912e71dc",
                        "0x0000000000000000000000001ca1a5937d73f74f89764c3835d6796e4e1c8314"
                      ],
                      "data": "0x000000000000000000000000000000000000000000000df7b2d4343e99d38475",
                      "blockNumber": "0xd63adc",
                      "transactionHash": "0x103c47bd1917f5b57c89d55bc9a664eca732fadcc7596670030ad27ac26259ae",
                      "transactionIndex": "0x0",
                      "blockHash": "0xbd6523808cf0a98c528b7e169b357c46a7cd0f602cec98f05bb5962553522647",
                      "logIndex": "0x0",
                      "removed": false
                    },
                  ],
                  "logsBloom": "0x00000000000000000000000000000000000000001400000020000000000000000000000000000000000000000000000008000000000000000000000008240000000000000000000000000408000000000000000000040000000000002000000000000000000000000000010000000004000000000000000000000810000000000000000000000000000000000000000000000000000020000000000000000000020000000000800000000004000000020000000000000000000000000000000000008002000000000000000000000000020000000000000000000000000040000010000000000000000000020000000000000000400000000000000000000000",
                  "status": "0x1",
                  "to": "0x1ca1a5937d73f74f89764c3835d6796e4e1c8314",
                  "transactionIndex": "0x0",
                  "type": "0x2"
                },
              ]
            }
        }
    },
] as IETHOperation[];


export const tokenAPIOperations = [
    {
        name: 'alchemy_getTokenAllowance',
        value: 'alchemy_getTokenAllowance',
        description: 'Returns the amount which the spender is allowed to withdraw from the owner.',
        networks: ['homestead', 'matic', 'maticmum', 'arbitrum', 'arbitrum-rinkeby', 'optimism', 'optimism-kovan'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"alchemy_getTokenAllowance",
            "params":[],
            "id":83
        },
        inputParameters: `
        <ul>
			<li><code class="inline">Object</code> - An object with the following fields:</li>
		    <ul>
			    <li><code class="inline">contract</code>: <code class="inline">DATA</code>, 20 Bytes - The address of the token contract.</li>
				<li><code class="inline">owner</code>: <code class="inline">DATA</code>, 20 Bytes - The address of the token owner.</li>
                <li><code class="inline">spender</code>: <code class="inline">DATA</code>, 20 Bytes - The address of the token spender.</li>
            </ul>
		</ul>`,
        exampleParameters: `[
  {
    "contract": "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
    "owner": "0xe8095A54C83b069316521835408736269bfb389C",
    "spender": "0x3Bcc5bD4abBc853395eBE5103b7DbA20411E38db"
  }
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 83,
            "result": "10963536149943846000",
        }
    },
    {
        name: 'alchemy_getTokenBalances',
        value: 'alchemy_getTokenBalances',
        description: 'Returns token balances for a specific address given a list of contracts.',
        networks: ['homestead', 'matic', 'maticmum', 'arbitrum', 'arbitrum-rinkeby', 'optimism', 'optimism-kovan'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"alchemy_getTokenBalances",
            "params":[],
            "id":42
        },
        inputParameters: `
        <ul>
			<li><code class="inline">DATA</code>, 20 Bytes - The address for which token balances will be checked</li>
            <li>One of:</li>
            <ul>
			    <li><code class="inline">Array</code> - A list of contract addresses</li>
				<li><code class="inline">String</code> "DEFAULT_TOKENS" - denotes a query for the top 100 tokens by 24 hour volume</li>
            </ul>
		</ul>`,
        exampleParameters: `[
  "0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be",
  [
    "0x607f4c5bb672230e8672085532f7e901544a7375",
    "0x618e75ac90b12c6049ba3b27f5d5f8651b0037f6",
    "0x63b992e6246d88f07fc35a056d2c365e6d441a3d",
    "0x6467882316dc6e206feef05fba6deaa69277f155",
    "0x647f274b3a7248d6cf51b35f08e7e7fd6edfb271"
  ]
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 42,
            "result": {
              "address": "0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be",
              "tokenBalances": [
                {
                  "contractAddress": "0x607f4c5bb672230e8672085532f7e901544a7375",
                  "tokenBalance": "0x00000000000000000000000000000000000000000000000000003c005f81ab00",
                  "error": null
                }
              ]
            }
        }
    },
    {
        name: 'alchemy_getTokenMetadata',
        value: 'alchemy_getTokenMetadata',
        description: 'Returns metadata (name, symbol, decimals, logo) for a given token contract address.',
        networks: ['homestead', 'matic', 'maticmum', 'arbitrum', 'arbitrum-rinkeby', 'optimism', 'optimism-kovan'],
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"alchemy_getTokenMetadata",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">DATA</code>, 20 Bytes - The address of the token contract.</li>
		</ul>`,
        exampleParameters: `[
  "0x1985365e9f78359a9B6AD760e32412f4a445E862"
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "id": 1,
            "result": {
              "logo": "https://static.alchemyapi.io/images/assets/1104.png",
              "symbol": "REP",
              "decimals": 18,
              "name": "Augur"
            }
        }
    },
] as IETHOperation[];
