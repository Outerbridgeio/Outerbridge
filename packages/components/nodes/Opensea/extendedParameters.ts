import { INodeParams } from "../../src";

export const retrieveAssets = [
    {
        label: 'Owner',
        name: 'owner',
        type: 'string',
        default: '',
        optional: true,
        description: 'The address of the owner of the assets',
        show: {
            'actions.operation': ['retrieveAssets']
        }
    },
    {
        label: 'Token Ids',
        name: 'token_ids',
        type: 'json',
        default: '[]',
        optional: true,
        description: 'An array of token IDs to search for',
        show: {
            'actions.operation': ['retrieveAssets']
        }
    },
    {
        label: 'Asset Contract Address',
        name: 'asset_contract_address',
        type: 'string',
        default: '',
        optional: true,
        description: 'The NFT contract address for the assets',
        show: {
            'actions.operation': ['retrieveAssets']
        }
    },
    {
        label: 'Asset Contract Addresses',
        name: 'asset_contract_addresses',
        type: 'json',
        default: '[]',
        optional: true,
        description: 'An array of contract addresses to search for',
        show: {
            'actions.operation': ['retrieveAssets']
        }
    },
    {
        label: 'Order By',
        name: 'order_by',
        type: 'options',
        options: [
            {
                label: 'Sale Date',
                name: 'sale_date',
                description: `Last sale's transaction's timestamp`
            },
            {
                label: 'Sale Count ',
                name: 'sale_count',
                description: `Number of sales`
            },
            {
                label: 'Sale Price ',
                name: 'sale_price',
                description: `Last sale's total_price`
            }
        ],
        default: '',
        optional: true,
        description: 'How to order the assets returned. By default, the API returns the fastest ordering. ',
        show: {
            'actions.operation': ['retrieveAssets']
        }
    },
    {
        label: 'Order Direction',
        name: 'order_direction',
        type: 'options',
        options: [
            {
                label: 'Descending',
                name: 'desc',
            },
            {
                label: 'Ascending',
                name: 'asc',
            },
        ],
        default: '',
        optional: true,
        show: {
            'actions.operation': ['retrieveAssets']
        }
    },
    {
        label: 'Offset',
        name: 'offset',
        type: 'number',
        default: '',
        optional: true,
        description: 'Offset for pagination',
        show: {
            'actions.operation': ['retrieveAssets']
        }
    },
    {
        label: 'Limit',
        name: 'limit',
        type: 'number',
        default: 20,
        optional: true,
        description: 'Limit for pagination. Defaults to 20, capped at 50.',
        show: {
            'actions.operation': ['retrieveAssets']
        }
    },
    {
        label: 'Collection',
        name: 'collection',
        type: 'string',
        default: '',
        optional: true,
        description: 'Limit responses to members of a collection. Case sensitive and must match the collection slug exactly. Will return all assets from all contracts in a collection.',
        show: {
            'actions.operation': ['retrieveAssets']
        }
    },
    {
        label: 'Include Orders',
        name: 'include_orders',
        type: 'boolean',
        default: false,
        optional: true,
        description: 'A flag determining if order information should be included in the response.',
        show: {
            'actions.operation': ['retrieveAssets']
        }
    },
] as INodeParams[];


export const retrieveEvents = [
    {
        label: 'Asset Contract Address',
        name: 'asset_contract_address',
        type: 'string',
        default: '',
        optional: true,
        description: 'The NFT contract address for the assets for which to show events',
        show: {
            'actions.operation': ['retrieveEvents']
        }
    },
    {
        label: 'Collection Slug',
        name: 'collection_slug',
        type: 'string',
        default: '',
        optional: true,
        description: 'Limit responses to events from a collection. Case sensitive and must match the collection slug exactly. Will return all assets from all contracts in a collection.',
        show: {
            'actions.operation': ['retrieveEvents']
        }
    },
    {
        label: 'Token Id',
        name: 'token_id',
        type: 'number',
        default: '',
        optional: true,
        description: `The token's id to optionally filter by`,
        show: {
            'actions.operation': ['retrieveEvents']
        }
    },
    {
        label: 'Account Address',
        name: 'account_address',
        type: 'string',
        default: '',
        optional: true,
        description: `A user account's wallet address to filter for events on an account`,
        show: {
            'actions.operation': ['retrieveEvents']
        }
    },
    {
        label: 'Only Opensea',
        name: 'only_opensea',
        type: 'boolean',
        default: false,
        optional: true,
        description: 'Restrict to events on OpenSea auctions',
        show: {
            'actions.operation': ['retrieveEvents']
        }
    },
    {
        label: 'Offset',
        name: 'offset',
        type: 'number',
        default: '',
        description: 'Offset for pagination',
        optional: true,
        show: {
            'actions.operation': ['retrieveEvents']
        }
    },
    {
        label: 'Limit',
        name: 'limit',
        type: 'number',
        default: 20,
        optional: true,
        description: 'Limit for pagination',
        show: {
            'actions.operation': ['retrieveEvents']
        }
    },
    {
        label: 'Occurred Before',
        name: 'occurred_before',
        type: 'date',
        optional: true,
        description: 'Only show events listed before this date.',
        show: {
            'actions.operation': ['retrieveEvents']
        }
    },
    {
        label: 'Occurred After',
        name: 'occurred_after',
        type: 'date',
        optional: true,
        description: 'Only show events listed after this date.',
        show: {
            'actions.operation': ['retrieveEvents']
        }
    },
    
] as INodeParams[];

export const retrieveCollections = [
    {
        label: 'Asset Owner',
        name: 'asset_owner',
        type: 'string',
        default: '',
        optional: true,
        description: `A wallet address. If specified, will return collections where the owner owns at least one asset belonging to smart contracts in the collection.`,
        show: {
            'actions.operation': ['retrieveCollections']
        }
    },
    {
        label: 'Offset',
        name: 'offset',
        type: 'number',
        default: '',
        description: 'Offset for pagination',
        optional: true,
        show: {
            'actions.operation': ['retrieveCollections']
        }
    },
    {
        label: 'Limit',
        name: 'limit',
        type: 'number',
        default: 20,
        optional: true,
        description: 'Limit for pagination',
        show: {
            'actions.operation': ['retrieveCollections']
        }
    },
] as INodeParams[];
