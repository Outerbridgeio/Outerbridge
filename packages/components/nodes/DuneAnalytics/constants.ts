import { INodeParams } from '../../src'

export const chainInputParameters = [
    {
        label: 'Chain',
        name: 'chain',
        type: 'options',
        options: [
            {
                label: 'All',
                name: 'all',
                show: {
                    'actions.operation': ['protocolTransactions', 'protocolAddresses', 'protocolUserStatistics', 'protocolsByChain']
                }
            },
            {
                label: 'Arbitrum',
                name: 'Arbitrum',
                show: {
                    'actions.operation': [
                        'tokenTransfers',
                        'tokenBalance',
                        'nftCollectionsByChain',
                        'nftBalance',
                        'protocolTransactions',
                        'protocolAddresses',
                        'protocolUserStatistics',
                        'protocolsByChain',
                        'chainTransactions'
                    ]
                }
            },
            {
                label: 'Avalanche',
                name: 'Avalanche',
                show: {
                    'actions.operation': [
                        'tokenTransfers',
                        'tokenBalance',
                        'nftCollectionsByChain',
                        'nftBalance',
                        'protocolTransactions',
                        'protocolAddresses',
                        'protocolUserStatistics',
                        'protocolsByChain',
                        'chainTransactions'
                    ]
                }
            },
            {
                label: 'BNB Chain',
                name: 'BNB%20Chain',
                show: {
                    'actions.operation': [
                        'tokenTransfers',
                        'tokenBalance',
                        'nftTransactions',
                        'nftTransfers',
                        'nftCollectionsByChain',
                        'nftBalance',
                        'protocolTransactions',
                        'protocolAddresses',
                        'protocolUserStatistics',
                        'protocolsByChain',
                        'chainTransactions'
                    ]
                }
            },
            {
                label: 'Boba',
                name: 'Boba',
                show: {
                    'actions.operation': [
                        'tokenTransfers',
                        'tokenBalance',
                        'nftBalance',
                        'protocolTransactions',
                        'protocolAddresses',
                        'protocolUserStatistics',
                        'protocolsByChain',
                        'chainTransactions'
                    ]
                }
            },
            {
                label: 'Bitcoin',
                name: 'Bitcoin',
                show: {
                    'actions.operation': ['chainTransactions']
                }
            },
            {
                label: 'Cardano',
                name: 'Cardano',
                show: {
                    'actions.operation': ['nftCollectionsByChain']
                }
            },
            {
                label: 'Celo',
                name: 'Celo',
                show: {
                    'actions.operation': [
                        'tokenTransfers',
                        'tokenBalance',
                        'nftBalance',
                        'protocolTransactions',
                        'protocolAddresses',
                        'protocolUserStatistics',
                        'protocolsByChain',
                        'chainTransactions'
                    ]
                }
            },
            {
                label: 'DFK',
                name: 'DFK',
                show: {
                    'actions.operation': [
                        'tokenTransfers',
                        'tokenBalance',
                        'nftBalance',
                        'protocolTransactions',
                        'protocolAddresses',
                        'protocolUserStatistics',
                        'protocolsByChain',
                        'chainTransactions'
                    ]
                }
            },
            {
                label: 'Doge',
                name: 'Doge',
                show: {
                    'actions.operation': ['chainTransactions']
                }
            },
            {
                label: 'EOS',
                name: 'EOS',
                show: {
                    'actions.operation': ['tokenTransfers', 'chainTransactions']
                }
            },
            {
                label: 'Ethereum',
                name: 'Ethereum',
                show: {
                    'actions.operation': [
                        'tokenTransfers',
                        'tokenBalance',
                        'allTokenBalance',
                        'nftTransactions',
                        'nftTransfers',
                        'nftOrders',
                        'nftWashTradeChecker',
                        'nftCollectionStatistics',
                        'nftStatistics',
                        'nftInfo',
                        'nftAttributes',
                        'nftCollectionsByChain',
                        'nftBalance',
                        'nftBalanceByWallet',
                        'protocolTransactions',
                        'protocolAddresses',
                        'protocolUserStatistics',
                        'protocolsByChain',
                        'chainTransactions'
                    ]
                }
            },
            {
                label: 'Fantom',
                name: 'Fantom',
                show: {
                    'actions.operation': [
                        'tokenTransfers',
                        'tokenBalance',
                        'nftCollectionsByChain',
                        'nftBalance',
                        'protocolTransactions',
                        'protocolAddresses',
                        'protocolUserStatistics',
                        'protocolsByChain',
                        'chainTransactions'
                    ]
                }
            },
            {
                label: 'Harmony',
                name: 'Harmony',
                show: {
                    'actions.operation': [
                        'tokenTransfers',
                        'tokenBalance',
                        'nftCollectionsByChain',
                        'nftBalance',
                        'protocolTransactions',
                        'protocolAddresses',
                        'protocolUserStatistics',
                        'protocolsByChain',
                        'chainTransactions'
                    ]
                }
            },
            {
                label: 'Hive',
                name: 'Hive',
                show: {
                    'actions.operation': [
                        'protocolTransactions',
                        'protocolAddresses',
                        'protocolUserStatistics',
                        'protocolsByChain',
                        'chainTransactions'
                    ]
                }
            },
            {
                label: 'Heco',
                name: 'Heco',
                show: {
                    'actions.operation': ['tokenTransfers', 'tokenBalance', 'nftBalance', 'chainTransactions']
                }
            },
            {
                label: 'ImmutableX',
                name: 'ImmutableX',
                show: {
                    'actions.operation': ['nftCollectionsByChain']
                }
            },
            {
                label: 'IoTeX',
                name: 'IoTeX',
                show: {
                    'actions.operation': [
                        'protocolTransactions',
                        'protocolAddresses',
                        'protocolUserStatistics',
                        'protocolsByChain',
                        'chainTransactions'
                    ]
                }
            },
            {
                label: 'Moonbeam',
                name: 'Moonbeam',
                show: {
                    'actions.operation': [
                        'tokenTransfers',
                        'tokenBalance',
                        'nftBalance',
                        'protocolTransactions',
                        'protocolAddresses',
                        'protocolUserStatistics',
                        'protocolsByChain',
                        'chainTransactions'
                    ]
                }
            },
            {
                label: 'Moonriver',
                name: 'Moonriver',
                show: {
                    'actions.operation': [
                        'tokenTransfers',
                        'tokenBalance',
                        'nftBalance',
                        'protocolTransactions',
                        'protocolAddresses',
                        'protocolUserStatistics',
                        'protocolsByChain',
                        'chainTransactions'
                    ]
                }
            },
            {
                label: 'Oasys',
                name: 'Oasys',
                show: {
                    'actions.operation': ['tokenTransfers', 'tokenBalance', 'nftBalance', 'chainTransactions']
                }
            },
            {
                label: 'Optimism',
                name: 'Optimism',
                show: {
                    'actions.operation': ['tokenTransfers', 'tokenBalance', 'nftBalance', 'chainTransactions']
                }
            },
            {
                label: 'Polygon',
                name: 'Polygon',
                show: {
                    'actions.operation': [
                        'tokenTransfers',
                        'tokenBalance',
                        'nftTransactions',
                        'nftTransfers',
                        'nftCollectionStatistics',
                        'nftBalance',
                        'protocolTransactions',
                        'protocolAddresses',
                        'protocolUserStatistics',
                        'protocolsByChain',
                        'chainTransactions'
                    ]
                }
            },
            {
                label: 'Solana',
                name: 'Solana',
                show: {
                    'actions.operation': [
                        'tokenTransfers',
                        'nftTransactions',
                        'nftTransfers',
                        'nftCollectionStatistics',
                        'nftStatistics',
                        'nftInfo',
                        'nftAttributes',
                        'nftCollectionsByChain',
                        'chainTransactions'
                    ]
                }
            },
            {
                label: 'ThunderCore',
                name: 'ThunderCore',
                show: {
                    'actions.operation': [
                        'tokenTransfers',
                        'tokenBalance',
                        'nftBalance',
                        'protocolTransactions',
                        'protocolAddresses',
                        'protocolUserStatistics',
                        'protocolsByChain',
                        'chainTransactions'
                    ]
                }
            },
            {
                label: 'Terra',
                name: 'Terra',
                show: {
                    'actions.operation': ['nftCollectionsByChain']
                }
            },
            {
                label: 'Wax',
                name: 'Wax',
                show: {
                    'actions.operation': ['tokenTransfers', 'chainTransactions']
                }
            }
        ],
        show: {
            'actions.api': ['restAPI']
        },
        hide: {
            'actions.operation': ['chainInfo']
        }
    }
] as INodeParams[]

// NFT
export const NFT_OPERATIONS = [
    {
        label: 'NFT Transactions',
        name: 'nftTransactions',
        description: 'Returns the sales record of the NFT collection in the marketplace.',
        endpoint: 'https://api.footprint.network/api/v2/nft/collection/transactions'
    },
    {
        label: 'NFT Transfers',
        name: 'nftTransfers',
        description: 'Returns the transfers record of the NFT collection.',
        endpoint: 'https://api.footprint.network/api/v2/nft/collection/transfers'
    },
    {
        label: 'NFT Orders',
        name: 'nftOrders',
        description: 'Returns the sales listing of the NFT in the marketplace.',
        endpoint: 'https://api.footprint.network/api/v2/nft/collection/orderbook'
    },
    {
        label: 'NFT Wash Trade Checker',
        name: 'nftWashTradeChecker',
        description: 'Returns whether the transaction hash is wash trading.',
        endpoint: 'https://api.footprint.network/api/v2/nft/collection/transactions/is-washtrade'
    },
    {
        label: 'NFT Collection Statistics',
        name: 'nftCollectionStatistics',
        description:
            'Returns the statistics metrics (eg:market_cap,volume,floor_price) timeseries data or all metrics data of the NFT collection.',
        endpoint: 'https://api.footprint.network/api/v2/nft/collection/statistics'
    },
    {
        label: 'NFT Statistics',
        name: 'nftStatistics',
        description:
            'Returns all metrics of NFT different time models statistics by collection and nft_token_id.Currently only the latest state of NFT statistics.',
        endpoint: 'https://api.footprint.network/api/v2/nft/statistics'
    },
    {
        label: 'NFT Info',
        name: 'nftInfo',
        description: 'Returns the basic information of the NFT.',
        endpoint: 'https://api.footprint.network/api/v2/nft/info'
    },
    {
        label: 'NFT Attributes',
        name: 'nftAttributes',
        description: 'Returns the attributes of the NFT.',
        endpoint: 'https://api.footprint.network/api/v2/nft/attributes'
    },
    {
        label: 'NFT Collections by Chain',
        name: 'nftCollectionsByChain',
        description: 'Returns all NFT collections by chain.',
        endpoint: 'https://api.footprint.network/api/v2/nft/collection/info'
    },
    {
        label: 'NFT Balance',
        name: 'nftBalance',
        description: 'Returns the NFT balance of the wallet address.',
        endpoint: 'https://api.footprint.network/api/v2/nft/balance'
    },
    {
        label: 'NFT Balance by Wallet',
        name: 'nftBalanceByWallet',
        description: 'Get the list of NFTs balance by the specified wallet',
        endpoint: 'https://api.footprint.network/api/v2/wallet/nfts'
    }
]

export const TOKEN_OPERATIONS = [
    {
        label: 'Token Transfers',
        name: 'tokenTransfers',
        description: 'Returns token transfers over a period of time.',
        endpoint: 'https://api.footprint.network/api/v2/token/transfers'
    },
    {
        label: 'Token Balance',
        name: 'tokenBalance',
        description: 'Returns a token balance for the specified wallet (ERC20)',
        endpoint: 'https://api.footprint.network/api/v2/token/balance'
    },
    {
        label: 'All Token Balance',
        name: 'allTokenBalance',
        description: 'Retrieve all token balances for the specified wallet (ERC20)',
        endpoint: 'https://api.footprint.network/api/v2/wallet/tokens'
    }
]

export const GAMEFI_OPERATIONS = [
    {
        label: 'Protocol Transactions',
        name: 'protocolTransactions',
        description: 'Returns protocol transactions over a period of time.',
        endpoint: 'https://api.footprint.network/api/v2/protocol/transactions'
    },
    {
        label: 'Protocol Addresses',
        name: 'protocolAddresses',
        description: 'Returns protocol addresses over a period of time.',
        endpoint: 'https://api.footprint.network/api/v2/protocol/address'
    },
    {
        label: 'Protocol User Statistics',
        name: 'protocolUserStatistics',
        description: 'Returns protocol user statistics over a period of time.',
        endpoint: 'https://api.footprint.network/api/v2/protocol/statistics'
    },
    {
        label: 'Protocols by Chain',
        name: 'protocolsByChain',
        description: 'Returns protocols by chain.',
        endpoint: 'https://api.footprint.network/api/v2/protocol/info'
    }
]

export const CHAIN_OPERATIONS = [
    {
        label: 'Chain Transactions',
        name: 'chainTransactions',
        description: 'Returns chain transactions over a period of time.',
        endpoint: 'https://api.footprint.network/api/v2/chain/transactions'
    },
    {
        label: 'Chain Info',
        name: 'chainInfo',
        description: 'Returns chains info',
        endpoint: 'https://api.footprint.network/api/v2/chain/info'
    }
]

export const ALL_OPERATIONS = [...NFT_OPERATIONS, ...TOKEN_OPERATIONS, ...GAMEFI_OPERATIONS, ...CHAIN_OPERATIONS]

export const nftWashTradeCheckerParams = [
    {
        label: 'Transaction Hash',
        name: 'transaction_hash',
        type: 'string',
        placeholder: '0x03a7615cd2bbe69a028debf6d76b7be99ba5c4d9246a639226889c5618a648fe',
        show: { 'actions.operation': ['nftWashTradeChecker'] }
    }
] as INodeParams[]

export const nftBalanceParams = [
    {
        label: 'Wallet Address',
        name: 'wallet_address',
        type: 'string',
        placeholder: '0x3cd3a9a9c66a6fbb7221a30e761bda3caaea197b',
        show: { 'actions.operation': ['nftBalance', 'nftBalanceByWallet'] }
    },
    {
        label: 'NFT Token Id',
        name: 'nft_token_id',
        type: 'string',
        placeholder: '7237005577332285910032237647762877720934446650543256038857901852224856784896',
        show: { 'actions.operation': ['nftBalance'] }
    },
    {
        label: 'NFT Type',
        name: 'nft_type',
        type: 'options',
        options: [
            {
                label: 'ERC1155',
                name: 'ERC1155'
            },
            {
                label: 'ERC721',
                name: 'ERC721'
            }
        ],
        default: 'ERC1155',
        show: { 'actions.operation': ['nftBalance'] }
    }
] as INodeParams[]

export const nftParams = [
    {
        label: 'Collection Contract Address',
        name: 'collection_contract_address',
        type: 'string',
        placeholder: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
        show: {
            'actions.operation': [
                'nftTransactions',
                'nftTransfers',
                'nftOrders',
                'nftCollectionStatistics',
                'nftStatistics',
                'nftInfo',
                'nftAttributes',
                'nftCollectionsByChain',
                'nftBalance'
            ]
        }
    },
    {
        label: 'Type',
        name: 'type',
        type: 'options',
        options: [
            {
                label: 'Listing',
                name: 'listing'
            },
            {
                label: 'Bidding',
                name: 'bidding'
            }
        ],
        show: { 'actions.operation': ['nftOrders'] }
    },
    {
        label: 'Status',
        name: 'status',
        type: 'options',
        options: [
            {
                label: 'Active',
                name: 'active'
            },
            {
                label: 'Expired',
                name: 'expired'
            },
            {
                label: 'Cancelled',
                name: 'cancelled'
            },
            {
                label: 'Filled',
                name: 'filled'
            },
            {
                label: 'Inactive',
                name: 'inactive'
            }
        ],
        show: { 'actions.operation': ['nftOrders'] }
    },
    {
        label: 'Statistics Metrics',
        name: 'statistics_metrics',
        type: 'options',
        options: [
            {
                label: 'Market Cap',
                name: 'market_cap'
            },
            {
                label: 'Volume',
                name: 'volume'
            },
            {
                label: 'Floor Price',
                name: 'floor_price'
            }
        ],
        show: { 'actions.operation': ['nftCollectionStatistics'] }
    },
    {
        label: 'Statistics Time Model',
        name: 'statistics_time_model',
        type: 'options',
        options: [
            {
                label: 'Latest',
                name: 'latest'
            }
        ],
        default: 'latest',
        show: { 'actions.operation': ['nftStatistics'] }
    },
    {
        label: 'NFT Token Id',
        name: 'nft_token_id',
        type: 'string',
        placeholder: '1',
        optional: true,
        show: { 'actions.operation': ['nftStatistics', 'nftInfo', 'nftAttributes'] }
    }
] as INodeParams[]

export const timeRangeParams = [
    {
        label: 'Start Time',
        name: 'start_time',
        type: 'date',
        description:
            'The query supports time period query, when start_time is specified, but end_time is not specified, the default query is the data of 24 hours after start_time (including start_time); if you do not specify start_time and end_time, the default query is yesterday,the maximum span of one inquiry is 30 days , eg: 2022-02-02 00:00:00',
        optional: true,
        show: {
            'actions.operation': [
                'nftTransactions',
                'nftTransfers',
                'nftOrders',
                'nftCollectionStatistics',
                'nftCollectionsByChain',
                'tokenTransfers',
                'protocolTransactions',
                'protocolAddresses',
                'protocolUserStatistics',
                'chainTransactions'
            ]
        }
    },
    {
        label: 'End Time',
        name: 'end_time',
        type: 'date',
        description:
            'When end_time is specified, but no start_time is specified, the default query is 24 hours before end_time (not including end_time) , eg: 2022-02-03 00:00:00',
        optional: true,
        show: {
            'actions.operation': [
                'nftTransactions',
                'nftTransfers',
                'nftOrders',
                'nftCollectionStatistics',
                'nftCollectionsByChain',
                'tokenTransfers',
                'protocolTransactions',
                'protocolAddresses',
                'protocolUserStatistics',
                'chainTransactions'
            ]
        }
    }
] as INodeParams[]

export const limitOffetParams = [
    {
        label: 'Limit',
        name: 'limit',
        type: 'number',
        description: 'Page size, Defaults to 100, capped at 100, eg: 100',
        optional: true,
        show: {
            'actions.operation': [
                'nftTransactions',
                'nftTransfers',
                'nftOrders',
                'nftCollectionStatistics',
                'nftStatistics',
                'nftInfo',
                'nftAttributes',
                'nftCollectionsByChain',
                'nftBalanceByWallet',
                'tokenTransfers',
                'allTokenBalance',
                'protocolTransactions',
                'protocolAddresses',
                'protocolUserStatistics',
                'protocolsByChain',
                'chainTransactions'
            ]
        }
    },
    {
        label: 'Offset',
        name: 'offset',
        type: 'number',
        description: 'The offset for pagination, capped at 80000 eg:120',
        optional: true,
        show: {
            'actions.operation': [
                'nftTransactions',
                'nftTransfers',
                'nftOrders',
                'nftCollectionStatistics',
                'nftStatistics',
                'nftInfo',
                'nftAttributes',
                'nftCollectionsByChain',
                'nftBalanceByWallet',
                'tokenTransfers',
                'allTokenBalance',
                'protocolTransactions',
                'protocolAddresses',
                'protocolUserStatistics',
                'protocolsByChain',
                'chainTransactions'
            ]
        }
    }
] as INodeParams[]

export const tokenParams = [
    {
        label: 'Token Address',
        name: 'token_address',
        type: 'string',
        description: 'Token contract address',
        placeholder: '0xcc079ca45b62c5bc0064e0b40a2dd3d409503119',
        optional: true,
        show: { 'actions.operation': ['tokenTransfers'] }
    },
    {
        label: 'From Address',
        name: 'from_address',
        type: 'string',
        description: 'Address of the sender',
        placeholder: '0x21787ae502b65d52071daa6519d7b6258758da5e',
        optional: true,
        show: { 'actions.operation': ['tokenTransfers', 'chainTransactions'] }
    },
    {
        label: 'To Address',
        name: 'to_address',
        type: 'string',
        description: 'Address of the receiver',
        placeholder: '0x4ba50c4469f4c1388745739d9d73010781617688',
        optional: true,
        show: { 'actions.operation': ['tokenTransfers', 'chainTransactions'] }
    }
] as INodeParams[]

export const tokenBalanceParams = [
    {
        label: 'Token Address',
        name: 'token_address',
        type: 'string',
        description: 'Token contract address',
        placeholder: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
        show: { 'actions.operation': ['tokenBalance'] }
    },
    {
        label: 'Wallet Address',
        name: 'wallet_address',
        type: 'string',
        description: 'Wallet address',
        placeholder: '0xb8001c3ec9aa1985f6c747e25c28324e4a361ec1',
        show: { 'actions.operation': ['tokenBalance', 'allTokenBalance'] }
    }
] as INodeParams[]

export const gamefiParams = [
    {
        label: 'Protocol Slug',
        name: 'protocol_slug',
        type: 'string',
        description: 'The protocol slug of the transactions, eg: aave',
        placeholder: 'aave',
        show: { 'actions.operation': ['protocolTransactions', 'protocolAddresses', 'protocolUserStatistics', 'protocolsByChain'] }
    },
    {
        label: 'Address Type',
        name: 'address_type',
        type: 'options',
        options: [
            {
                label: 'Active',
                name: 'active'
            }
        ],
        default: 'active',
        show: { 'actions.operation': ['protocolAddresses'] }
    },
    {
        label: 'Statistics Frequency Model',
        name: 'statistics_frequency_model',
        type: 'options',
        options: [
            {
                label: 'Daily',
                name: 'daily'
            }
        ],
        optional: true,
        show: { 'actions.operation': ['protocolUserStatistics'] }
    },
    {
        label: 'Contract Address',
        name: 'contract_address',
        type: 'string',
        description: 'The contract address of the transactions',
        placeholder: '0x794a61358d6845594f94dc1db02a252b5b4814ad',
        optional: true,
        show: { 'actions.operation': ['protocolTransactions'] }
    },
    {
        label: 'Wallet Address',
        name: 'wallet_address',
        type: 'string',
        description: 'The wallet address of the transactions',
        placeholder: '0xbd90be3937744e2cd0ee680807901b1ab9479ffc',
        optional: true,
        show: { 'actions.operation': ['protocolTransactions'] }
    }
] as INodeParams[]
