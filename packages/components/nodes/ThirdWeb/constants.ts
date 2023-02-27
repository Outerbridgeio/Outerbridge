import { notEmptyRegex } from '../../src'
import { INodeParams } from '../../src/Interface'

export const nftDropParameters = [
    {
        label: 'Name',
        name: 'name',
        description: 'Name of the contract',
        type: 'string',
        placeholder: 'MyNFT',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['nft-drop', 'nft-collection', 'edition', 'edition-drop', 'pack', 'signature-drop']
        }
    },
    {
        label: 'Image Type',
        name: 'imageType',
        type: 'options',
        options: [
            {
                label: 'Base64',
                name: 'base64',
                description: 'Base64 (raw) image'
            },
            {
                label: 'URL',
                name: 'url',
                description: 'URL path of the image'
            }
        ],
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['nft-drop', 'nft-collection', 'edition', 'edition-drop', 'pack', 'signature-drop']
        }
    },
    {
        label: 'Image URL',
        name: 'imageURL',
        description: 'URL path of the image',
        type: 'string',
        placeholder: 'ipfs://QmSYJ5PJ6SriDWyXtzA62NDfCCMpZt5FWqh9Y5xmhXsWhS/SquirrelV1.png',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['nft-drop', 'nft-collection', 'edition', 'edition-drop', 'pack', 'signature-drop'],
            'inputParameters.imageType': ['url']
        }
    },
    {
        label: 'Image Base64',
        name: 'imageBase64',
        description: 'Base64 (raw) image',
        type: 'string',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['nft-drop', 'nft-collection', 'edition', 'edition-drop', 'pack', 'signature-drop'],
            'inputParameters.imageType': ['base64']
        }
    },
    {
        label: 'Description',
        name: 'description',
        description: 'Description of the contract',
        type: 'string',
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['nft-drop', 'nft-collection', 'edition', 'edition-drop', 'pack', 'signature-drop']
        }
    },
    {
        label: 'Symbol',
        name: 'symbol',
        description: 'Symbol for the contract',
        type: 'string',
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['nft-drop', 'nft-collection', 'edition', 'edition-drop', 'pack', 'signature-drop']
        }
    },
    {
        label: 'Primary Sale Recipient Address',
        name: 'primary_sale_recipient',
        description: 'The address that will receive the proceeds from primary sales',
        type: 'string',
        placeholder: '0xE597E474889537A3A9120d1B5793cdFAEf6B6c10',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['nft-drop', 'nft-collection', 'edition', 'edition-drop', 'pack', 'signature-drop']
        }
    },
    {
        label: 'Royalties Recipient Address',
        name: 'fee_recipient',
        description: 'The address that will receive the proceeds from secondary sales',
        type: 'string',
        placeholder: '0xE597E474889537A3A9120d1B5793cdFAEf6B6c10',
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['nft-drop', 'nft-collection', 'edition', 'edition-drop', 'pack', 'signature-drop']
        }
    },
    {
        label: 'Royalties Percentage',
        name: 'seller_fee_basis_points',
        description: 'The percentage (in basis points) of royalties for secondary sales. Eg: 50 = 0.5%',
        type: 'number',
        placeholder: '100',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.fee_recipient': notEmptyRegex,
            'inputParameters.contractType': ['nft-drop', 'nft-collection', 'edition', 'edition-drop', 'pack', 'signature-drop']
        }
    },
    {
        label: 'Platform Fee Recipient Address',
        name: 'platform_fee_recipient',
        description: 'The address that will receive the proceeds from platform fees',
        type: 'string',
        placeholder: '0xE597E474889537A3A9120d1B5793cdFAEf6B6c10',
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['nft-drop', 'nft-collection', 'edition', 'edition-drop', 'pack', 'signature-drop']
        }
    },
    {
        label: 'Platform Fee Percentage',
        name: 'platform_fee_basis_points',
        description: 'The percentage (in basis points) of platform fees. Eg: 50 = 0.5%',
        type: 'number',
        placeholder: '100',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.platform_fee_recipient': notEmptyRegex,
            'inputParameters.contractType': ['nft-drop', 'nft-collection', 'edition', 'edition-drop', 'pack', 'signature-drop']
        }
    },
    {
        label: 'External Link',
        name: 'external_link',
        description: 'Url for the contract',
        type: 'string',
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['nft-drop', 'nft-collection', 'edition', 'edition-drop', 'pack', 'signature-drop']
        }
    },
    {
        label: 'Trusted Forwarders',
        name: 'trusted_forwarders',
        description: 'Custom gasless trusted forwarder addresses',
        type: 'json',
        optional: true,
        placeholder: '["0x359B1408130241E115EE2285bA2635ebFC2109C6", "0xE597E474889537A3A9120d1B5793cdFAEf6B6c10"]',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['nft-drop', 'nft-collection', 'edition', 'edition-drop', 'pack', 'signature-drop']
        }
    }
] as INodeParams[]

export const marketplaceParameters = [
    {
        label: 'Name',
        name: 'name',
        description: 'Name of the contract',
        type: 'string',
        placeholder: 'MyMarketplace',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['marketplace']
        }
    },
    {
        label: 'Image Type',
        name: 'imageType',
        type: 'options',
        options: [
            {
                label: 'Base64',
                name: 'base64',
                description: 'Base64 (raw) image'
            },
            {
                label: 'URL',
                name: 'url',
                description: 'URL path of the image'
            }
        ],
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['marketplace']
        }
    },
    {
        label: 'Image URL',
        name: 'imageURL',
        description: 'URL path of the image',
        type: 'string',
        placeholder: 'ipfs://QmSYJ5PJ6SriDWyXtzA62NDfCCMpZt5FWqh9Y5xmhXsWhS/SquirrelV1.png',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['marketplace'],
            'inputParameters.imageType': ['url']
        }
    },
    {
        label: 'Image Base64',
        name: 'imageBase64',
        description: 'Base64 (raw) image',
        type: 'string',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['marketplace'],
            'inputParameters.imageType': ['base64']
        }
    },
    {
        label: 'Description',
        name: 'description',
        description: 'Description of the contract',
        type: 'string',
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['marketplace']
        }
    },
    {
        label: 'Platform Fee Recipient Address',
        name: 'platform_fee_recipient',
        description: 'The address that will receive the proceeds from platform fees',
        type: 'string',
        placeholder: '0xE597E474889537A3A9120d1B5793cdFAEf6B6c10',
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['marketplace']
        }
    },
    {
        label: 'Platform Fee Percentage',
        name: 'platform_fee_basis_points',
        description: 'The percentage (in basis points) of platform fees. Eg: 50 = 0.5%',
        type: 'number',
        placeholder: '100',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.platform_fee_recipient': notEmptyRegex,
            'inputParameters.contractType': ['marketplace']
        }
    },
    {
        label: 'External Link',
        name: 'external_link',
        description: 'Url for the contract',
        type: 'string',
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['marketplace']
        }
    },
    {
        label: 'Trusted Forwarders',
        name: 'trusted_forwarders',
        description: 'Custom gasless trusted forwarder addresses',
        type: 'json',
        optional: true,
        placeholder: '["0x359B1408130241E115EE2285bA2635ebFC2109C6", "0xE597E474889537A3A9120d1B5793cdFAEf6B6c10"]',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['marketplace']
        }
    }
] as INodeParams[]

export const multiWrapParameters = [
    {
        label: 'Name',
        name: 'name',
        description: 'Name of the contract',
        type: 'string',
        placeholder: 'MyMultiWrap',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['multiwrap']
        }
    },
    {
        label: 'Image Type',
        name: 'imageType',
        type: 'options',
        options: [
            {
                label: 'Base64',
                name: 'base64',
                description: 'Base64 (raw) image'
            },
            {
                label: 'URL',
                name: 'url',
                description: 'URL path of the image'
            }
        ],
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['multiwrap']
        }
    },
    {
        label: 'Image URL',
        name: 'imageURL',
        description: 'URL path of the image',
        type: 'string',
        placeholder: 'ipfs://QmSYJ5PJ6SriDWyXtzA62NDfCCMpZt5FWqh9Y5xmhXsWhS/SquirrelV1.png',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['multiwrap'],
            'inputParameters.imageType': ['url']
        }
    },
    {
        label: 'Image Base64',
        name: 'imageBase64',
        description: 'Base64 (raw) image',
        type: 'string',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['multiwrap'],
            'inputParameters.imageType': ['base64']
        }
    },
    {
        label: 'Description',
        name: 'description',
        description: 'Description of the contract',
        type: 'string',
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['multiwrap']
        }
    },
    {
        label: 'Symbol',
        name: 'symbol',
        description: 'Symbol for the contract',
        type: 'string',
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['multiwrap']
        }
    },
    {
        label: 'Royalties Recipient Address',
        name: 'fee_recipient',
        description: 'The address that will receive the proceeds from secondary sales',
        type: 'string',
        placeholder: '0xE597E474889537A3A9120d1B5793cdFAEf6B6c10',
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['multiwrap']
        }
    },
    {
        label: 'Royalties Percentage',
        name: 'seller_fee_basis_points',
        description: 'The percentage (in basis points) of royalties for secondary sales. Eg: 50 = 0.5%',
        type: 'number',
        placeholder: '100',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.fee_recipient': notEmptyRegex,
            'inputParameters.contractType': ['multiwrap']
        }
    },
    {
        label: 'External Link',
        name: 'external_link',
        description: 'Url for the contract',
        type: 'string',
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['multiwrap']
        }
    },
    {
        label: 'Trusted Forwarders',
        name: 'trusted_forwarders',
        description: 'Custom gasless trusted forwarder addresses',
        type: 'json',
        optional: true,
        placeholder: '["0x359B1408130241E115EE2285bA2635ebFC2109C6", "0xE597E474889537A3A9120d1B5793cdFAEf6B6c10"]',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['multiwrap']
        }
    }
] as INodeParams[]

export const splitContractParameters = [
    {
        label: 'Name',
        name: 'name',
        description: 'Name of the contract',
        type: 'string',
        placeholder: 'MySplit',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['split']
        }
    },
    {
        label: 'Image Type',
        name: 'imageType',
        type: 'options',
        options: [
            {
                label: 'Base64',
                name: 'base64',
                description: 'Base64 (raw) image'
            },
            {
                label: 'URL',
                name: 'url',
                description: 'URL path of the image'
            }
        ],
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['split']
        }
    },
    {
        label: 'Image URL',
        name: 'imageURL',
        description: 'URL path of the image',
        type: 'string',
        placeholder: 'ipfs://QmSYJ5PJ6SriDWyXtzA62NDfCCMpZt5FWqh9Y5xmhXsWhS/SquirrelV1.png',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['split'],
            'inputParameters.imageType': ['url']
        }
    },
    {
        label: 'Image Base64',
        name: 'imageBase64',
        description: 'Base64 (raw) image',
        type: 'string',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['split'],
            'inputParameters.imageType': ['base64']
        }
    },
    {
        label: 'Description',
        name: 'description',
        description: 'Description of the contract',
        type: 'string',
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['split']
        }
    },
    {
        label: 'Recipients',
        name: 'recipients',
        description: 'The list of recipients and their share of the split',
        type: 'json',
        placeholder: `[
    {
        "address": '0x359B1408130241E115EE2285bA2635ebFC2109C6', // The recipient address
        "sharesBps": 500, // The shares in basis point (5% = 500)
    },
    {
        "address": '0xE597E474889537A3A9120d1B5793cdFAEf6B6c10',
        "sharesBps": 400,
    }
]
        `,
        default: `[
    {
        "address": "your-address",
        "sharesBps": 8000
    },
    {
        "address": "another-address",
        "sharesBps": 2000
    }
]`,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['split']
        }
    },
    {
        label: 'External Link',
        name: 'external_link',
        description: 'Url for the contract',
        type: 'string',
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['split']
        }
    },
    {
        label: 'Trusted Forwarders',
        name: 'trusted_forwarders',
        description: 'Custom gasless trusted forwarder addresses',
        type: 'json',
        optional: true,
        placeholder: '["0x359B1408130241E115EE2285bA2635ebFC2109C6", "0xE597E474889537A3A9120d1B5793cdFAEf6B6c10"]',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['split']
        }
    }
] as INodeParams[]

export const tokenDropParameters = [
    {
        label: 'Name',
        name: 'name',
        description: 'Name of the contract',
        type: 'string',
        placeholder: 'MyToken',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['token-drop', 'token']
        }
    },
    {
        label: 'Image Type',
        name: 'imageType',
        type: 'options',
        options: [
            {
                label: 'Base64',
                name: 'base64',
                description: 'Base64 (raw) image'
            },
            {
                label: 'URL',
                name: 'url',
                description: 'URL path of the image'
            }
        ],
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['token-drop', 'token']
        }
    },
    {
        label: 'Image URL',
        name: 'imageURL',
        description: 'URL path of the image',
        type: 'string',
        placeholder: 'ipfs://QmSYJ5PJ6SriDWyXtzA62NDfCCMpZt5FWqh9Y5xmhXsWhS/SquirrelV1.png',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['token-drop', 'token'],
            'inputParameters.imageType': ['url']
        }
    },
    {
        label: 'Image Base64',
        name: 'imageBase64',
        description: 'Base64 (raw) image',
        type: 'string',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['token-drop', 'token'],
            'inputParameters.imageType': ['base64']
        }
    },
    {
        label: 'Description',
        name: 'description',
        description: 'Description of the contract',
        type: 'string',
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['token-drop', 'token']
        }
    },
    {
        label: 'Symbol',
        name: 'symbol',
        description: 'Symbol for the contract',
        type: 'string',
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['token-drop', 'token']
        }
    },
    {
        label: 'Primary Sale Recipient Address',
        name: 'primary_sale_recipient',
        description: 'The address that will receive the proceeds from primary sales',
        type: 'string',
        placeholder: '0xE597E474889537A3A9120d1B5793cdFAEf6B6c10',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['token-drop', 'token']
        }
    },
    {
        label: 'Platform Fee Recipient Address',
        name: 'platform_fee_recipient',
        description: 'The address that will receive the proceeds from platform fees',
        type: 'string',
        placeholder: '0xE597E474889537A3A9120d1B5793cdFAEf6B6c10',
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['token-drop', 'token']
        }
    },
    {
        label: 'Platform Fee Percentage',
        name: 'platform_fee_basis_points',
        description: 'The percentage (in basis points) of platform fees. Eg: 50 = 0.5%',
        type: 'number',
        placeholder: '100',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.platform_fee_recipient': notEmptyRegex,
            'inputParameters.contractType': ['token-drop', 'token']
        }
    },
    {
        label: 'External Link',
        name: 'external_link',
        description: 'Url for the contract',
        type: 'string',
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['token-drop', 'token']
        }
    },
    {
        label: 'Trusted Forwarders',
        name: 'trusted_forwarders',
        description: 'Custom gasless trusted forwarder addresses',
        type: 'json',
        optional: true,
        placeholder: '["0x359B1408130241E115EE2285bA2635ebFC2109C6", "0xE597E474889537A3A9120d1B5793cdFAEf6B6c10"]',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['token-drop', 'token']
        }
    }
] as INodeParams[]

export const voteParameters = [
    {
        label: 'Name',
        name: 'name',
        description: 'Name of the contract',
        type: 'string',
        placeholder: 'MyVoteDAO',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['vote']
        }
    },
    {
        label: 'Image Type',
        name: 'imageType',
        type: 'options',
        options: [
            {
                label: 'Base64',
                name: 'base64',
                description: 'Base64 (raw) image'
            },
            {
                label: 'URL',
                name: 'url',
                description: 'URL path of the image'
            }
        ],
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['vote']
        }
    },
    {
        label: 'Image URL',
        name: 'imageURL',
        description: 'URL path of the image',
        type: 'string',
        placeholder: 'ipfs://QmSYJ5PJ6SriDWyXtzA62NDfCCMpZt5FWqh9Y5xmhXsWhS/SquirrelV1.png',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['vote'],
            'inputParameters.imageType': ['url']
        }
    },
    {
        label: 'Image Base64',
        name: 'imageBase64',
        description: 'Base64 (raw) image',
        type: 'string',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['vote'],
            'inputParameters.imageType': ['base64']
        }
    },
    {
        label: 'Description',
        name: 'description',
        description: 'Description of the contract',
        type: 'string',
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['vote']
        }
    },
    {
        label: 'Voting Token Address',
        name: 'voting_token_address',
        description: 'The address of the governance token contract representing votes',
        type: 'string',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['vote']
        }
    },
    {
        label: 'Proposal Token Threshold',
        name: 'proposal_token_threshold',
        description: 'The minimum amount in governance token owned to be able to create a proposal',
        type: 'number',
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['vote']
        }
    },
    {
        label: 'Voting Delay in Blocks',
        name: 'voting_delay_in_blocks',
        description:
            'The delay in blocks before voting can begin on proposals Specified in number of blocks. Assuming block time of around 13.14 seconds, 1 day = 6570 blocks, 1 week = 45992 blocks.',
        type: 'number',
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['vote']
        }
    },
    {
        label: 'Voting Period in Blocks',
        name: 'voting_period_in_blocks',
        description:
            'The duration in blocks of the open voting window Specified in number of blocks. Assuming block time of around 13.14 seconds, 1 day = 6570 blocks, 1 week = 45992 blocks.',
        type: 'number',
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['vote']
        }
    },
    {
        label: 'Voting Quorum Fraction',
        name: 'voting_quorum_fraction',
        description: 'The minimum fraction to be met to pass a proposal',
        type: 'number',
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['vote']
        }
    },
    {
        label: 'External Link',
        name: 'external_link',
        description: 'Url for the contract',
        type: 'string',
        optional: true,
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['vote']
        }
    },
    {
        label: 'Trusted Forwarders',
        name: 'trusted_forwarders',
        description: 'Custom gasless trusted forwarder addresses',
        type: 'json',
        optional: true,
        placeholder: '["0x359B1408130241E115EE2285bA2635ebFC2109C6", "0xE597E474889537A3A9120d1B5793cdFAEf6B6c10"]',
        show: {
            'actions.operation': ['deploy'],
            'inputParameters.contractType': ['vote']
        }
    }
] as INodeParams[]
