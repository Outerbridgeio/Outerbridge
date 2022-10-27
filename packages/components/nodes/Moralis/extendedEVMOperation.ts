import { INodeOptionsValue, INodeParams } from '../../src'

export const nativeEvmOperation = [
    {
        label: 'Get Native Balance',
        name: 'getNativeBalance',
        description: 'Get native balance for a specific address.'
    },
    {
        label: 'Get Token Balances',
        name: 'getTokenBalances',
        description: 'Get token balances for a specific address.'
    },
    {
        label: 'Get Token Transfers',
        name: 'getTokenTransfers',
        description: 'Get ERC20 token transactions ordered by block number in descending order.'
    },
    {
        label: 'Get Date To Block',
        name: 'getDateToBlock',
        description: 'Get the closest block of the provided date.'
    },
    {
        label: 'Get Block',
        name: 'getBlock',
        description: 'Get the contents of a block by block hash.'
    },
    {
        label: 'Get Transaction',
        name: 'getTransaction',
        description: 'Get the contents of a transaction by transaction hash.'
    },
    {
        label: 'Get Transactions',
        name: 'getTransactions',
        description: 'Get native transactions ordered by block number in descending order.'
    },
    {
        label: 'Get Contract Events',
        name: 'getContractEvents',
        description: 'Get events for a specific contract ordered by block number in descending order.'
    },
    {
        label: 'Run Contract Function',
        name: 'runContractFunction',
        description: 'Run a given function of a contract abi and retrieve readonly data.'
    }
] as INodeOptionsValue[]

export const getDateToBlock = [
    {
        label: 'Provider Url',
        name: 'providerUrl',
        type: 'string',
        optional: true,
        description: 'Web3 provider url to user when using local dev chain',
        show: {
            'inputParameters.operation': ['getDateToBlock']
        }
    },
    {
        label: 'Date',
        name: 'date',
        type: 'date',
        optional: true,
        show: {
            'inputParameters.operation': ['getDateToBlock']
        }
    }
] as INodeParams[]

export const getBlock = [
    {
        label: 'Block Number or Hash',
        name: 'block_number_or_hash',
        type: 'string',
        description: 'The block hash or block number',
        show: {
            'inputParameters.operation': ['getBlock', 'getNFTTransfersByBlock']
        }
    },
    {
        label: 'Subdomain',
        name: 'subdomain',
        type: 'string',
        optional: true,
        description: 'The subdomain of the moralis server to use (Only use when selecting local devchain as chain)',
        show: {
            'inputParameters.operation': ['getBlock', 'getNFTTransfersByBlock', 'getTransaction']
        }
    }
] as INodeParams[]

export const getTransaction = [
    {
        label: 'Transaction Hash',
        name: 'transaction_hash',
        type: 'string',
        description: 'The transaction hash',
        show: {
            'inputParameters.operation': ['getTransaction']
        }
    }
] as INodeParams[]

export const getContractEvents = [
    {
        label: 'Address',
        name: 'address',
        type: 'string',
        description: 'Address of the contract',
        show: {
            'inputParameters.operation': ['getContractEvents', 'getTransactions', 'getTokenTransfers']
        }
    },
    {
        label: 'Topic',
        name: 'topic',
        type: 'string',
        description: 'The topic of the event',
        show: {
            'inputParameters.operation': ['getContractEvents']
        }
    },
    {
        label: 'Subdomain',
        name: 'subdomain',
        type: 'string',
        optional: true,
        description: 'The subdomain of the moralis server to use (Only use when selecting local devchain as chain)',
        show: {
            'inputParameters.operation': ['getContractEvents', 'getTransactions', 'getTokenTransfers']
        }
    },
    {
        label: 'Provider Url',
        name: 'providerUrl',
        type: 'string',
        optional: true,
        description: 'Web3 provider url to user when using local dev chain',
        show: {
            'inputParameters.operation': ['getContractEvents']
        }
    },
    {
        label: 'From Date',
        name: 'from_date',
        type: 'date',
        description: 'The date from where to get the logs',
        optional: true,
        show: {
            'inputParameters.operation': ['getContractEvents', 'getTransactions', 'getTokenTransfers']
        }
    },
    {
        label: 'To Date',
        name: 'to_date',
        type: 'date',
        description: 'Get the logs to this date',
        optional: true,
        show: {
            'inputParameters.operation': ['getContractEvents', 'getTransactions', 'getTokenTransfers']
        }
    },
    {
        label: 'From Block',
        name: 'from_block',
        type: 'number',
        description: 'The minimum block number from where to get the logs',
        optional: true,
        show: {
            'inputParameters.operation': ['getContractEvents', 'getTransactions', 'getTokenTransfers']
        }
    },
    {
        label: 'To Block',
        name: 'to_block',
        type: 'number',
        description: 'The maximum block number from where to get the logs.',
        optional: true,
        show: {
            'inputParameters.operation': ['getContractEvents', 'getTransactions', 'getTokenTransfers']
        }
    }
] as INodeParams[]

export const runContractFunction = [
    {
        label: 'Address',
        name: 'address',
        type: 'string',
        description: 'Address of the contract',
        show: {
            'inputParameters.operation': ['runContractFunction']
        }
    },
    {
        label: 'Function Name',
        name: 'function_name',
        type: 'string',
        description: 'Function Name of the contract to run',
        show: {
            'inputParameters.operation': ['runContractFunction']
        }
    },
    {
        label: 'ABI',
        name: 'abi',
        type: 'json',
        placeholder: '[ "event Transfer(address indexed from, address indexed to, uint value)" ]',
        description: 'ABI of the contract in array',
        show: {
            'inputParameters.operation': ['runContractFunction']
        }
    },
    {
        label: 'Function Parameters',
        name: 'params',
        type: 'json',
        placeholder: '{"var1": "value1"}',
        description: 'Function parameters in json. Ex: {"var1": "value1"}',
        optional: true,
        show: {
            'inputParameters.operation': ['runContractFunction']
        }
    },
    {
        label: 'Subdomain',
        name: 'subdomain',
        type: 'string',
        optional: true,
        description: 'The subdomain of the moralis server to use (Only use when selecting local devchain as chain)',
        show: {
            'inputParameters.operation': ['runContractFunction']
        }
    },
    {
        label: 'Provider Url',
        name: 'providerUrl',
        type: 'string',
        optional: true,
        description: 'Web3 provider url to user when using local dev chain',
        show: {
            'inputParameters.operation': ['runContractFunction']
        }
    }
] as INodeParams[]

export const getNativeBalance = [
    {
        label: 'Address',
        name: 'address',
        type: 'string',
        description: 'The address for which the native balance will be checked',
        show: {
            'inputParameters.operation': ['getNativeBalance']
        }
    },
    {
        label: 'Provider Url',
        name: 'providerUrl',
        type: 'string',
        optional: true,
        description: 'Web3 provider url to user when using local dev chain',
        show: {
            'inputParameters.operation': ['getNativeBalance']
        }
    },
    {
        label: 'To Block',
        name: 'to_block',
        type: 'number',
        description: 'The block number on which the balances should be checked.',
        optional: true,
        show: {
            'inputParameters.operation': ['getNativeBalance']
        }
    }
] as INodeParams[]

export const getTokenBalances = [
    {
        label: 'Address',
        name: 'address',
        type: 'string',
        description: 'The address for which token balances will be checked',
        show: {
            'inputParameters.operation': ['getTokenBalances']
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
            'inputParameters.operation': ['getTokenBalances']
        }
    },
    {
        label: 'Subdomain',
        name: 'subdomain',
        type: 'string',
        optional: true,
        description: 'The subdomain of the moralis server to use (Only use when selecting local devchain as chain)',
        show: {
            'inputParameters.operation': ['getTokenBalances']
        }
    },
    {
        label: 'To Block',
        name: 'to_block',
        type: 'number',
        description: 'The block number on which the balances should be checked.',
        optional: true,
        show: {
            'inputParameters.operation': ['getTokenBalances']
        }
    }
] as INodeParams[]
