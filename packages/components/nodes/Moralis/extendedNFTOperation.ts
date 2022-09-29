import { INodeOptionsValue, INodeParams } from "../../src";

export const nftOperation = [
    {
        label:'Get Wallet NFTs',
        name: 'getWalletNFTs',
        description: 'Get NFTs owned by a given address.'
    },
    {
        label:'Get Wallet NFT Transfers',
        name: 'getWalletNFTTransfers',
        description: 'Get the transfers of the tokens matching the given parameters.'
    },
    {
        label:'Get Wallet NFT Collections',
        name: 'getWalletNFTCollections',
        description: 'Get the nft collections owned by an user'
    },
    {
        label:'Get NFTs For Contract',
        name: 'getNFTsForContract',
        description: 'Get NFTs owned by the given address for a specific NFT contract address.'
    },
    {
        label:'Get NFT Trades',
        name: 'getNFTTrades',
        description: 'Get the nft trades for a given contract and marketplace.'
    },
    {
        label:'Get NFT Lowest Price',
        name: 'getNFTLowestPrice',
        description: 'Get the lowest executed price for an NFT token contract for the last x days (only trades paid in ETH).'
    },
    {
        label:'Get NFT Transfers By Block',
        name: 'getNFTTransfersByBlock',
        description: 'Get NFT transfers by block number or block hash.'
    },
    {
        label:'Get NFT Transfers From To Block',
        name: 'getNFTTransfersFromToBlock',
        description: 'Gets the transfers of the tokens from a block number to a block number.'
    },
    {
        label:'Get Contract NFTs',
        name: 'getContractNFTs',
        description: 'Get all NFTs, including metadata (where available), for all NFTs for the given contract address.'
    },
    {
        label:'Get NFT Contract Transfers',
        name: 'getNFTContractTransfers',
        description: 'Get the transfers of the tokens matching the given parameters.'
    },
    {
        label:'Get NFT Owners',
        name: 'getNFTOwners',
        description: 'Get all owners of NFTs within a given contract.'
    },
    {
        label:'Get NFT Metadata',
        name: 'getNFTMetadata',
        description: 'Get the contract level metadata (name, symbol, base token uri) for the given contract.'
    },
    {
        label:'ReSync Metadata',
        name: 'reSyncMetadata',
        description: 'ReSync the metadata for an NFT.'
    },
    {
        label:'Sync NFT Contract',
        name: 'syncNFTContract',
        description: 'Initiates a metadata refresh for an entire NFT collection.'
    },
    {
        label:'Get NFT Token Id Metadata',
        name: 'getNFTTokenIdMetadata',
        description: 'Get NFT data, including metadata (where available), for the given NFT token id of the given contract address.'
    },
    {
        label:'Get NFT Token Id Owners',
        name: 'getNFTTokenIdOwners',
        description: 'Get all owners of a specific NFT given the contract address and token ID.'
    },
    {
        label:'Get NFT Token Id Transfers',
        name: 'getNFTTokenIdTransfers',
        description: 'Get the transfers of an NFT given a contract address and token ID.'
    },
    
] as INodeOptionsValue[];

export const getWalletNFTs = [
    {
        label: 'Address',
        name: 'address',
        type: 'string',
        description: 'The owner of a given token',
        show: {
            'inputParameters.operation': [
                'getWalletNFTs'
            ]
        }
    },
    {
        label: 'Format',
        name: 'format',
        type: 'options',
        optional: true,
        description: 'The format of the token id',
        options: [
            {
                label: 'Decimal',
                name: 'decimal'
            },
            {
                label: 'Hex',
                name: 'hex'
            }
        ],
        default: 'decimal',
        show: {
            'inputParameters.operation': [
                'getWalletNFTs'
            ]
        }
    },
    {
        label: 'Token Addresses',
        name: 'token_addresses',
        type: 'json',
        placeholder: '["0xa, "0xb"]',
        optional: true,
        description: 'The addresses to get balances for',
        show: {
            'inputParameters.operation': [
                'getWalletNFTs'
            ]
        }
    },
] as INodeParams[];

export const getNFTTransfersByBlock = [
    {
        label: 'Block Number or Hash',
        name: 'block_number_or_hash',
        type: 'string',
        description: 'The block hash or block number',
        show: {
            'inputParameters.operation': [
                'getNFTTransfersByBlock'
            ]
        }
    },
    {
        label: 'Subdomain',
        name: 'subdomain',
        type: 'string',
        optional: true,
        description: 'The subdomain of the moralis server to use (Only use when selecting local devchain as chain)',
        show: {
            'inputParameters.operation': [
                'getNFTTransfersByBlock'
            ]
        }
    },
] as INodeParams[];

export const getWalletNFTTransfers = [
    {
        label: 'Address',
        name: 'address',
        type: 'string',
        description: 'The sender or recepient of the transfer',
        show: {
            'inputParameters.operation': [
                'getWalletNFTTransfers'
            ]
        }
    },
    {
        label: 'Format',
        name: 'format',
        type: 'options',
        optional: true,
        description: 'The format of the token id',
        options: [
            {
                label: 'Decimal',
                name: 'decimal'
            },
            {
                label: 'Hex',
                name: 'hex'
            }
        ],
        default: 'decimal',
        show: {
            'inputParameters.operation': [
                'getWalletNFTTransfers'
            ]
        }
    },
    {
        label: 'Direction',
        name: 'direction',
        type: 'options',
        optional: true,
        description: 'The transfer direction',
        options: [
            {
                label: 'Both',
                name: 'both'
            },
            {
                label: 'From',
                name: 'from'
            },
            {
                label: 'To',
                name: 'to'
            }
        ],
        default: 'both',
        show: {
            'inputParameters.operation': [
                'getWalletNFTTransfers'
            ]
        }
    },
    {
        label: 'From Block',
        name: 'from_block',
        type: 'number',
        description: 'The minimum block number from where to get the transfers',
        optional: true,
        show: {
            'inputParameters.operation': [
                'getWalletNFTTransfers'
            ]
        }
    },
    {
        label: 'To Block',
        name: 'to_block',
        type: 'number',
        description: 'To get the reserves at this block number',
        optional: true,
        show: {
            'inputParameters.operation': [
                'getWalletNFTTransfers'
            ]
        }
    },
] as INodeParams[];

export const getWalletNFTCollections = [
    {
        label: 'Address',
        name: 'address',
        type: 'string',
        description: 'The owner wallet address of the NFT collections',
        show: {
            'inputParameters.operation': [
                'getWalletNFTCollections'
            ]
        }
    },
] as INodeParams[];

export const getNFTsForContract = [
    {
        label: 'Address',
        name: 'address',
        type: 'string',
        description: 'The owner of a given token',
        show: {
            'inputParameters.operation': [
                'getNFTsForContract'
            ]
        }
    },
    {
        label: 'Token Address',
        name: 'token_address',
        type: 'string',
        description: 'Address of the contract',
        show: {
            'inputParameters.operation': [
                'getNFTsForContract'
            ]
        }
    },
    {
        label: 'Format',
        name: 'format',
        type: 'options',
        optional: true,
        description: 'The format of the token id',
        options: [
            {
                label: 'Decimal',
                name: 'decimal'
            },
            {
                label: 'Hex',
                name: 'hex'
            }
        ],
        default: 'decimal',
        show: {
            'inputParameters.operation': [
                'getNFTsForContract', 'getNFTTransfersFromToBlock'
            ]
        }
    },
] as INodeParams[];

export const getNFTTrades = [
    {
        label: 'Address',
        name: 'address',
        type: 'string',
        description: 'Address of the contract',
        show: {
            'inputParameters.operation': [
                'getNFTTrades', 'getNFTLowestPrice'
            ]
        }
    },
    {
        label: 'Marketplace',
        name: 'marketplace',
        type: 'options',
        optional: true,
        description: 'Marketplace from where to get the trades',
        options: [
            {
                label: 'Opensea',
                name: 'opensea'
            },
        ],
        default: 'opensea',
        show: {
            'inputParameters.operation': [
                'getNFTTrades', 'getNFTLowestPrice'
            ]
        }
    },
    {
        label: 'Provider Url',
        name: 'providerUrl',
        type: 'string',
        optional: true,
        description: 'Web3 provider url to user when using local dev chain',
        show: {
            'inputParameters.operation': [
                'getNFTTrades', 'getNFTLowestPrice'
            ]
        }
    },
    {
        label: 'From Date',
        name: 'from_date',
        type: 'date',
        description: 'The date from where to get the transfers ',
        optional: true,
        show: {
            'inputParameters.operation': [
                'getNFTTrades', 'getNFTTransfersFromToBlock'
            ]
        }
    },
    {
        label: 'To Date',
        name: 'to_date',
        type: 'date',
        description: 'Get the transfers to this date',
        optional: true,
        show: {
            'inputParameters.operation': [
                'getNFTTrades', 'getNFTTransfersFromToBlock'
            ]
        }
    },
    {
        label: 'From Block',
        name: 'from_block',
        type: 'number',
        description: 'The minimum block number from where to get the transfers.',
        optional: true,
        show: {
            'inputParameters.operation': [
                'getNFTTrades', 'getNFTTransfersFromToBlock'
            ]
        }
    },
    {
        label: 'To Block',
        name: 'to_block',
        type: 'number',
        description: 'The maximum block number from where to get the transfers.',
        optional: true,
        show: {
            'inputParameters.operation': [
                'getNFTTrades', 'getNFTTransfersFromToBlock'
            ]
        }
    },
] as INodeParams[];

export const getNFTLowestPrice = [
    {
        label: 'Days',
        name: 'days',
        type: 'number',
        description: 'The number of days to look back to find the lowest price. If not provided 7 days will be the default',
        optional: true,
        show: {
            'inputParameters.operation': [
                'getNFTLowestPrice'
            ]
        }
    },
] as INodeParams[];

export const getContractNFTs = [
    {
        label: 'Address',
        name: 'address',
        type: 'string',
        description: 'Address of the contract',
        show: {
            'inputParameters.operation': [
                'getContractNFTs', 'getNFTContractTransfers', 'getNFTOwners', 'getNFTMetadata'
            ]
        }
    },
    {
        label: 'Total Ranges',
        name: 'totalRanges',
        type: 'number',
        optional: true,
        description: 'The number of subranges to split the results into',
        show: {
            'inputParameters.operation': [
                'getContractNFTs',
            ]
        }
    },
    {
        label: 'Range',
        name: 'range',
        type: 'number',
        optional: true,
        description: 'The desired subrange to query',
        show: {
            'inputParameters.operation': [
                'getContractNFTs',
            ]
        }
    },
    {
        label: 'Format',
        name: 'format',
        type: 'options',
        optional: true,
        description: 'The format of the token id',
        options: [
            {
                label: 'Decimal',
                name: 'decimal'
            },
            {
                label: 'Hex',
                name: 'hex'
            }
        ],
        default: 'decimal',
        show: {
            'inputParameters.operation': [
                'getContractNFTs', 'getNFTContractTransfers', 'getNFTOwners'
            ]
        }
    },
] as INodeParams[];

export const reSyncMetadata = [
    {
        label: 'Address',
        name: 'address',
        type: 'string',
        description: 'Address of the contract',
        show: {
            'inputParameters.operation': [
                'reSyncMetadata', 'getNFTTokenIdMetadata', 'getNFTTokenIdOwners', 'getNFTTokenIdTransfers'
            ]
        }
    },
    {
        label: 'Token Id',
        name: 'token_id',
        type: 'string',
        description: 'The id of the token',
        show: {
            'inputParameters.operation': [
                'reSyncMetadata', 'getNFTTokenIdMetadata', 'getNFTTokenIdOwners', 'getNFTTokenIdTransfers'
            ]
        }
    },
    {
        label: 'Flag',
        name: 'flag',
        type: 'options',
        optional: true,
        description: 'The type of resync to operate',
        options: [
            {
                label: 'URI',
                name: 'uri'
            },
            {
                label: 'Metadata',
                name: 'metadata'
            }
        ],
        default: 'uri',
        show: {
            'inputParameters.operation': [
                'reSyncMetadata'
            ]
        }
    },
    {
        label: 'Mode',
        name: 'mode',
        type: 'options',
        optional: true,
        description: 'To define the behaviour of the endpoint',
        options: [
            {
                label: 'Async',
                name: 'async'
            },
            {
                label: 'Sync',
                name: 'sync'
            }
        ],
        default: 'async',
        show: {
            'inputParameters.operation': [
                'reSyncMetadata'
            ]
        }
    },
] as INodeParams[];

export const getNFTTokenIdMetadata = [
    {
        label: 'Format',
        name: 'format',
        type: 'options',
        optional: true,
        description: 'The format of the token id',
        options: [
            {
                label: 'Decimal',
                name: 'decimal'
            },
            {
                label: 'Hex',
                name: 'hex'
            }
        ],
        default: 'decimal',
        show: {
            'inputParameters.operation': [
                'getNFTTokenIdMetadata', 'getNFTTokenIdOwners', 'getNFTTokenIdTransfers'
            ]
        }
    },
] as INodeParams[];

export const getNFTTokenIdTransfers = [
    {
        label: 'Order',
        name: 'order',
        type: 'string',
        optional: true,
        description: 'The field(s) to order on and if it should be ordered in ascending or descending order. Specified by: fieldName1.order,fieldName2.order. Example 1: "block_number", "block_number.ASC", "block_number.DESC", Example 2: "block_number and contract_type", "block_number.ASC,contract_type.DESC"',
        show: {
            'inputParameters.operation': [
                'getNFTTokenIdTransfers'
            ]
        }
    },
] as INodeParams[];