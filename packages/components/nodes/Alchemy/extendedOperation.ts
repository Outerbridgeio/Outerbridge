import { INodeOptionsValue, INodeParams, NETWORK } from '../../src'
import { IETHOperation } from '../../src/ETHOperations'

export const NFTOperationsOptions = [
    {
        label: 'Get NFTs',
        name: 'getNFTs',
        description: 'Gets all NFTs currently owned by a given address'
    },
    {
        label: 'Get NFT Sales',
        name: 'getNFTSales',
        description: 'Gets NFT sales that have happened through on-chain marketplaces',
        show: {
            'networks.network': [NETWORK.MAINNET]
        }
    },
    {
        label: 'Get NFT Metadata',
        name: 'getNFTMetadata',
        description: 'Gets the metadata associated with a given NFT'
    },
    {
        label: 'Get NFTs For Collection',
        name: 'getNFTsForCollection',
        description: 'Gets all NFTs for a given NFT contract'
    },
    {
        label: 'Get Owners For Collection',
        name: 'getOwnersForCollection',
        description: 'Gets all owners for a given NFT contract.'
    },
    {
        label: 'Get Owners For Token',
        name: 'getOwnersForToken',
        description: 'Get the owner(s) for a token.'
    },
    {
        label: 'Get Contracts For Owner',
        name: 'getContractsForOwner',
        description: 'Gets all NFT contracts held by an owner address.'
    },
    {
        label: 'Get Spam Contracts',
        name: 'getSpamContracts',
        description: 'Returns a list of all spam contracts marked by Alchemy.',
        show: {
            'networks.network': [NETWORK.MAINNET]
        }
    },
    {
        label: 'Is Spam Contracts',
        name: 'isSpamContract',
        description: 'Returns whether a contract is marked as spam or not by Alchemy.',
        show: {
            'networks.network': [NETWORK.MAINNET]
        }
    },
    {
        label: 'Reingest Contract',
        name: 'reingestContract',
        description:
            'Triggers metadata refresh for an entire NFT collection and refreshes stale metadata after a collection reveal/collection changes.',
        show: {
            'networks.network': [NETWORK.MAINNET]
        }
    },
    {
        label: 'Get Floor Price',
        name: 'getFloorPrice',
        description: 'Returns the floor prices of a NFT collection by marketplace.',
        show: {
            'networks.network': [NETWORK.MAINNET]
        }
    },
    {
        label: 'Compute Rarity',
        name: 'computeRarity',
        description: 'Computes the rarity of each attribute of an NFT.',
        show: {
            'networks.network': [NETWORK.MAINNET]
        }
    },
    {
        label: 'Search Contract Metadata',
        name: 'searchContractMetadata',
        description: 'Search for a keyword across metadata of all ERC-721 and ERC-1155 smart contracts',
        show: {
            'networks.network': [NETWORK.MAINNET]
        }
    },
    {
        label: 'Summarize NFT Attributes',
        name: 'summarizeNFTAttributes',
        description: 'Generate a summary of attribute prevalence for an NFT collection.',
        show: {
            'networks.network': [NETWORK.MAINNET]
        }
    },
    {
        label: 'Is Holder Of Collection',
        name: 'isHolderOfCollection',
        description: 'Checks whether a wallet holds a NFT in a given collection'
    },
    {
        label: 'Report Spam Contract',
        name: 'reportSpamContract',
        description: 'Report a particular contract address to our APIs if you think it is spam',
        show: {
            'networks.network': [NETWORK.MAINNET]
        }
    }
] as INodeOptionsValue[]

export const getNFTsProperties = [
    {
        label: 'Owner Address',
        name: 'owner',
        type: 'string',
        description: 'Address for NFT owner (can be in ENS format!)',
        default: '',
        show: {
            'inputParameters.api': ['nftAPI'],
            'inputParameters.operation': ['getNFTs']
        }
    },
    {
        label: 'PageKey',
        name: 'pageKey',
        type: 'string',
        description:
            'UUID for pagination. If more results are available, a UUID pageKey will be returned in the response. Pass that UUID into pageKey to fetch the next 100 NFTs.',
        default: '',
        show: {
            'inputParameters.api': ['nftAPI'],
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
            'inputParameters.api': ['nftAPI'],
            'inputParameters.operation': ['getNFTs']
        }
    }
] as INodeParams[]

export const getNFTMetadataProperties = [
    {
        label: 'Contract Address',
        name: 'contractAddress',
        type: 'string',
        description: 'Address of NFT contract',
        default: '',
        show: {
            'inputParameters.api': ['nftAPI'],
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
            'inputParameters.api': ['nftAPI'],
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
                name: 'ERC721'
            },
            {
                label: 'ERC1155',
                name: 'ERC1155'
            },
            {
                label: '',
                name: ''
            }
        ],
        default: '',
        show: {
            'inputParameters.api': ['nftAPI'],
            'inputParameters.operation': ['getNFTMetadata']
        }
    }
] as INodeParams[]

export const getNFTsForCollectionProperties = [
    {
        label: 'Contract Address',
        name: 'contractAddress',
        type: 'string',
        description: 'Contract address for the NFT collection',
        default: '',
        show: {
            'inputParameters.api': ['nftAPI'],
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
            'inputParameters.api': ['nftAPI'],
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
            'inputParameters.api': ['nftAPI'],
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
            'inputParameters.api': ['nftAPI'],
            'inputParameters.operation': ['getNFTsForCollection']
        }
    },
    {
        label: 'Token Uri Timeout In Ms',
        name: 'tokenUriTimeoutInMs',
        type: 'number',
        description:
            'No set timeout by default - When metadata is requested, this parameter is the timeout (in milliseconds) for the website hosting the metadata to respond. If you want to only access the cache and not live fetch any metadata for cache misses then set this value to 0.',
        optional: true,
        show: {
            'inputParameters.api': ['nftAPI'],
            'inputParameters.operation': ['getNFTsForCollection']
        }
    }
] as INodeParams[]

export const getOwnersForCollectionProperties = [
    {
        label: 'Contract Address',
        name: 'contractAddress',
        type: 'string',
        description: 'Contract address for the NFT collection (ERC721 and ERC1155 supported).',
        default: '',
        show: {
            'inputParameters.api': ['nftAPI'],
            'inputParameters.operation': ['getOwnersForCollection']
        }
    },
    {
        label: 'With Token Balances',
        name: 'withTokenBalances',
        type: 'boolean',
        description: 'If set to true the query will include the token balances per token id for each owner. false by default.',
        default: false,
        optional: true,
        show: {
            'inputParameters.api': ['nftAPI'],
            'inputParameters.operation': ['getOwnersForCollection']
        }
    },
    {
        label: 'Block',
        name: 'block',
        type: 'string',
        description: 'The point in time or block number (in hex or decimal) to fetch collection ownership information for.',
        default: '',
        optional: true,
        show: {
            'inputParameters.api': ['nftAPI'],
            'inputParameters.operation': ['getOwnersForCollection']
        }
    },
    {
        label: 'PageKey',
        name: 'pageKey',
        type: 'string',
        description:
            'used for collections with >50,000 owners. pageKey field can be passed back as request parameter to get the next page of results.',
        default: '',
        show: {
            'inputParameters.api': ['nftAPI'],
            'inputParameters.operation': ['getOwnersForCollection']
        },
        optional: true
    }
] as INodeParams[]

export const getOwnersForTokenProperties = [
    {
        label: 'Contract Address',
        name: 'contractAddress',
        type: 'string',
        description: 'Contract address for the NFT collection (ERC721 and ERC1155 supported).',
        default: '',
        show: {
            'inputParameters.api': ['nftAPI'],
            'inputParameters.operation': [
                'getOwnersForToken',
                'isSpamContract',
                'reingestContract',
                'getFloorPrice',
                'computeRarity',
                'summarizeNFTAttributes',
                'reportSpamContract'
            ]
        }
    },
    {
        label: 'Token Id',
        name: 'tokenId',
        type: 'string',
        description: 'The ID of the token. Can be in hex or decimal format.',
        show: {
            'inputParameters.api': ['nftAPI'],
            'inputParameters.operation': ['getOwnersForToken', 'computeRarity']
        }
    }
] as INodeParams[]

export const searchContractMetadataProperties = [
    {
        label: 'Query',
        name: 'query',
        type: 'string',
        description: 'The search string that you want to search for in contract metadata',
        default: '',
        show: {
            'inputParameters.api': ['nftAPI'],
            'inputParameters.operation': ['searchContractMetadata']
        }
    }
] as INodeParams[]

export const isHolderOfCollectionProperties = [
    {
        label: 'Contract Address',
        name: 'contractAddress',
        type: 'string',
        description: 'Contract address for the NFT collection (ERC721 and ERC1155 supported).',
        default: '',
        show: {
            'inputParameters.api': ['nftAPI'],
            'inputParameters.operation': ['isHolderOfCollection']
        }
    },
    {
        label: 'Wallet',
        name: 'wallet',
        type: 'string',
        description: 'Wallet address to check for collection ownership.',
        show: {
            'inputParameters.api': ['nftAPI'],
            'inputParameters.operation': ['isHolderOfCollection']
        }
    }
] as INodeParams[]

export const getNFTSalesProperties = [
    {
        label: 'Contract Address',
        name: 'contractAddress',
        type: 'string',
        description: 'The contract address of a NFT collection to filter sales by. Defaults to returning all NFT contracts.',
        default: '',
        show: {
            'inputParameters.api': ['nftAPI'],
            'inputParameters.operation': ['getNFTSales']
        }
    },
    {
        label: 'Token Id',
        name: 'tokenId',
        type: 'string',
        description:
            'The token ID of an NFT within the collection specified by contractAddress to filter sales by. Defaults to returning all token IDs.',
        show: {
            'inputParameters.api': ['nftAPI'],
            'inputParameters.operation': ['getNFTSales']
        }
    },
    {
        label: 'Start Block',
        name: 'startBlock',
        type: 'string',
        description:
            'The block number to start fetching NFT sales data from. Allowed values are decimal integers and "latest". Defaults to "latest".',
        optional: true,
        default: 'latest',
        show: {
            'inputParameters.api': ['nftAPI'],
            'inputParameters.operation': ['getNFTSales']
        }
    },
    {
        label: 'Start Log Index',
        name: 'startLogIndex',
        type: 'number',
        description: 'The log index within the startBlock to start fetching NFT sales data from. Defaults to 0.',
        optional: true,
        default: 0,
        show: {
            'inputParameters.api': ['nftAPI'],
            'inputParameters.operation': ['getNFTSales']
        }
    },
    {
        label: 'Start Bundle Index',
        name: 'startBundleIndex',
        type: 'number',
        description: 'The index of an NFT within a sale bundle to start fetching NFT sales data from. Defaults to 0.',
        optional: true,
        default: 0,
        show: {
            'inputParameters.api': ['nftAPI'],
            'inputParameters.operation': ['getNFTSales']
        }
    },
    {
        label: 'Ascending Order',
        name: 'ascendingOrder',
        type: 'boolean',
        description: 'Whether to return the results ascending from startBlock or descending from startBlock. Defaults to ascending (true).',
        optional: true,
        default: true,
        show: {
            'inputParameters.api': ['nftAPI'],
            'inputParameters.operation': ['getNFTSales']
        }
    },
    {
        label: 'Marketplace',
        name: 'marketplace',
        type: 'options',
        description: 'The name of the NFT marketplace to filter sales by. Currently only "seaport" is supported.',
        options: [
            {
                label: 'Seaport',
                name: 'seaport'
            }
        ],
        optional: true,
        default: 'seaport',
        show: {
            'inputParameters.api': ['nftAPI'],
            'inputParameters.operation': ['getNFTSales']
        }
    },
    {
        label: 'Buyer Address',
        name: 'buyerAddress',
        type: 'string',
        description: 'The address of the NFT buyer to filter sales by. Defaults to returning sales involving any buyer.',
        optional: true,
        show: {
            'inputParameters.api': ['nftAPI'],
            'inputParameters.operation': ['getNFTSales']
        }
    },
    {
        label: 'Seller Address',
        name: 'sellerAddress',
        type: 'string',
        description: 'The address of the NFT seller to filter sales by. Defaults to returning sales involving any seller.',
        optional: true,
        show: {
            'inputParameters.api': ['nftAPI'],
            'inputParameters.operation': ['getNFTSales']
        }
    },
    {
        label: 'Buyer Is Maker',
        name: 'buyerIsMaker',
        type: 'boolean',
        description:
            'Filter by whether if the buyer was the maker in the trade, i.e. if the sale involved a buyer offering a bid and the seller then accepting the bid. Defaults to returning both maker and taker orders.',
        optional: true,
        show: {
            'inputParameters.api': ['nftAPI'],
            'inputParameters.operation': ['getNFTSales']
        }
    },
    {
        label: 'Limit',
        name: 'limit',
        type: 'number',
        description: 'The maximum number of NFT sales to return. Defaults to 100.',
        optional: true,
        show: {
            'inputParameters.api': ['nftAPI'],
            'inputParameters.operation': ['getNFTSales']
        }
    }
] as INodeParams[]

export const getContractsForOwnerProperties = [
    {
        label: 'Owner',
        name: 'owner',
        type: 'string',
        description: 'Address for NFT owner (can be in ENS format!).',
        placeholder: 'vitalk.eth',
        show: {
            'inputParameters.api': ['nftAPI'],
            'inputParameters.operation': ['getContractsForOwner']
        }
    },
    {
        label: 'PageKey',
        name: 'pageKey',
        type: 'string',
        description:
            'key for pagination. If more results are available, a pageKey will be returned in the response. Pass back the pageKey as a param to fetch the next page of results.',
        optional: true,
        show: {
            'inputParameters.api': ['nftAPI'],
            'inputParameters.operation': ['getContractsForOwner']
        }
    }
] as INodeParams[]

export const transactionReceiptsOperations = [
    {
        name: 'alchemy_getTransactionReceipts',
        value: 'alchemy_getTransactionReceipts',
        parentGroup: 'Transaction Receipt Information',
        description: 'Fetch all transaction receipts for a block number or a block hash in one API call ',
        providerNetworks: {
            alchemy: [
                NETWORK.MAINNET,
                NETWORK.RINKEBY,
                NETWORK.GÖRLI,
                NETWORK.ROPSTEN,
                NETWORK.KOVAN,
                NETWORK.MATIC,
                NETWORK.MATIC_MUMBAI,
                NETWORK.ARBITRUM,
                NETWORK.ARBITRUM_RINKEBY,
                NETWORK.ARBITRUM_GOERLI
            ]
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'alchemy_getTransactionReceipts',
            params: [],
            id: 1
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
            jsonrpc: '2.0',
            id: 1,
            result: {
                receipts: [
                    {
                        transactionHash: '0x103c47bd1917f5b57c89d55bc9a664eca732fadcc7596670030ad27ac26259ae',
                        blockHash: '0xbd6523808cf0a98c528b7e169b357c46a7cd0f602cec98f05bb5962553522647',
                        blockNumber: '0xd63adc',
                        contractAddress: null,
                        cumulativeGasUsed: '0x26d93',
                        effectiveGasPrice: '0x1e836343a7',
                        from: '0xcc72f778eedd8e337e6cb58ca9ec8ba2912e71dc',
                        gasUsed: '0x26d93',
                        logs: [
                            {
                                address: '0xa5def515cfd373d17830e7c1de1639cb3530a112',
                                topics: [
                                    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                                    '0x000000000000000000000000cc72f778eedd8e337e6cb58ca9ec8ba2912e71dc',
                                    '0x0000000000000000000000001ca1a5937d73f74f89764c3835d6796e4e1c8314'
                                ],
                                data: '0x000000000000000000000000000000000000000000000df7b2d4343e99d38475',
                                blockNumber: '0xd63adc',
                                transactionHash: '0x103c47bd1917f5b57c89d55bc9a664eca732fadcc7596670030ad27ac26259ae',
                                transactionIndex: '0x0',
                                blockHash: '0xbd6523808cf0a98c528b7e169b357c46a7cd0f602cec98f05bb5962553522647',
                                logIndex: '0x0',
                                removed: false
                            }
                        ],
                        logsBloom:
                            '0x00000000000000000000000000000000000000001400000020000000000000000000000000000000000000000000000008000000000000000000000008240000000000000000000000000408000000000000000000040000000000002000000000000000000000000000010000000004000000000000000000000810000000000000000000000000000000000000000000000000000020000000000000000000020000000000800000000004000000020000000000000000000000000000000000008002000000000000000000000000020000000000000000000000000040000010000000000000000000020000000000000000400000000000000000000000',
                        status: '0x1',
                        to: '0x1ca1a5937d73f74f89764c3835d6796e4e1c8314',
                        transactionIndex: '0x0',
                        type: '0x2'
                    }
                ]
            }
        }
    }
] as IETHOperation[]

export const tokenAPIOperations = [
    {
        name: 'alchemy_getTokenAllowance',
        value: 'alchemy_getTokenAllowance',
        parentGroup: 'Token Information',
        description: 'Returns the amount which the spender is allowed to withdraw from the owner.',
        providerNetworks: {
            alchemy: [
                NETWORK.MAINNET,
                NETWORK.RINKEBY,
                NETWORK.GÖRLI,
                NETWORK.ROPSTEN,
                NETWORK.KOVAN,
                NETWORK.MATIC,
                NETWORK.MATIC_MUMBAI,
                NETWORK.ARBITRUM,
                NETWORK.ARBITRUM_RINKEBY,
                NETWORK.ARBITRUM_GOERLI,
                NETWORK.OPTIMISM,
                NETWORK.OPTIMISM_GOERLI,
                NETWORK.OPTIMISM_KOVAN
            ]
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'alchemy_getTokenAllowance',
            params: [],
            id: 83
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
            jsonrpc: '2.0',
            id: 83,
            result: '10963536149943846000'
        }
    },
    {
        name: 'alchemy_getTokenBalances',
        value: 'alchemy_getTokenBalances',
        parentGroup: 'Token Information',
        description: 'Returns token balances for a specific address given a list of contracts.',
        providerNetworks: {
            alchemy: [
                NETWORK.MAINNET,
                NETWORK.RINKEBY,
                NETWORK.GÖRLI,
                NETWORK.ROPSTEN,
                NETWORK.KOVAN,
                NETWORK.MATIC,
                NETWORK.MATIC_MUMBAI,
                NETWORK.ARBITRUM,
                NETWORK.ARBITRUM_RINKEBY,
                NETWORK.ARBITRUM_GOERLI,
                NETWORK.OPTIMISM,
                NETWORK.OPTIMISM_GOERLI,
                NETWORK.OPTIMISM_KOVAN
            ]
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'alchemy_getTokenBalances',
            params: [],
            id: 42
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
            jsonrpc: '2.0',
            id: 42,
            result: {
                address: '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be',
                tokenBalances: [
                    {
                        contractAddress: '0x607f4c5bb672230e8672085532f7e901544a7375',
                        tokenBalance: '0x00000000000000000000000000000000000000000000000000003c005f81ab00',
                        error: null
                    }
                ]
            }
        }
    },
    {
        name: 'alchemy_getTokenMetadata',
        value: 'alchemy_getTokenMetadata',
        parentGroup: 'Token Information',
        description: 'Returns metadata (name, symbol, decimals, logo) for a given token contract address.',
        providerNetworks: {
            alchemy: [
                NETWORK.MAINNET,
                NETWORK.RINKEBY,
                NETWORK.GÖRLI,
                NETWORK.ROPSTEN,
                NETWORK.KOVAN,
                NETWORK.MATIC,
                NETWORK.MATIC_MUMBAI,
                NETWORK.ARBITRUM,
                NETWORK.ARBITRUM_RINKEBY,
                NETWORK.ARBITRUM_GOERLI,
                NETWORK.OPTIMISM,
                NETWORK.OPTIMISM_GOERLI,
                NETWORK.OPTIMISM_KOVAN
            ]
        },
        method: 'POST',
        body: {
            jsonrpc: '2.0',
            method: 'alchemy_getTokenMetadata',
            params: [],
            id: 1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">DATA</code>, 20 Bytes - The address of the token contract.</li>
		</ul>`,
        exampleParameters: `[
  "0x1985365e9f78359a9B6AD760e32412f4a445E862"
]`,
        exampleResponse: {
            jsonrpc: '2.0',
            id: 1,
            result: {
                logo: 'https://static.alchemyapi.io/images/assets/1104.png',
                symbol: 'REP',
                decimals: 18,
                name: 'Augur'
            }
        }
    }
] as IETHOperation[]
