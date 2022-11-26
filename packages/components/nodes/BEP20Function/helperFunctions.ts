import { INodeOptionsValue, INodeParams } from '../../src'

export const BEP20Functions = [
    {
        name: 'deposit',
        label: 'Deposit',
        description: 'Deposit BNB into BEP20 token'
    },
    {
        name: 'withdraw',
        label: 'Withdraw',
        description: 'Withdraw BNB from BEP20 token'
    },
    {
        name: 'allowance',
        label: 'Get Allowance',
        description:
            'Returns the remaining number of tokens that spender will be allowed to spend on behalf of owner through transferFrom. This is zero by default.'
    },
    {
        name: 'approve',
        label: 'Approve',
        description: 'Sets amount as the allowance of spender over the caller’s tokens.'
    },
    {
        name: 'balanceOf',
        label: 'Get Balance',
        description: 'Returns the amount of tokens owned by account'
    },
    {
        name: 'decimals',
        label: 'Get BEP20 Decimals',
        description: 'Returns the decimals of BEP20'
    },
    {
        name: 'name',
        label: 'Get BEP20 Name',
        description: 'Returns the name of BEP20'
    },
    {
        name: 'symbol',
        label: 'Get BEP20 Symbol',
        description: 'Returns the symbol of BEP20'
    },
    {
        name: 'totalSupply',
        label: 'Get BEP20 Total Supply',
        description: 'Returns the total supply of BEP20'
    },
    {
        name: 'transferFrom',
        label: 'Transfer From',
        description:
            'Moves amount tokens from sender to recipient using the allowance mechanism. Amount is then deducted from the caller’s allowance.'
    }
] as INodeOptionsValue[]

export const allowanceParameters = [
    {
        label: 'Owner Address',
        name: 'owner',
        type: 'string',
        show: {
            'actions.function': ['allowance']
        }
    },
    {
        label: 'Spender Address',
        name: 'spender',
        type: 'string',
        show: {
            'actions.function': ['allowance']
        }
    }
] as INodeParams[]

export const approveParameters = [
    {
        label: 'Spender Address',
        name: 'spender',
        type: 'string',
        show: {
            'actions.function': ['approve']
        }
    },
    {
        label: 'Amount',
        name: 'amount',
        type: 'number',
        show: {
            'actions.function': ['approve']
        }
    },
    {
        label: 'Select Wallet',
        name: 'wallet',
        type: 'asyncOptions',
        description: 'Wallet to execute approve function',
        loadFromDbCollections: ['Wallet'],
        loadMethod: 'getWallets',
        show: {
            'actions.function': ['approve']
        }
    }
] as INodeParams[]

export const balanceOfParameters = [
    {
        label: 'Account Address',
        name: 'account',
        type: 'string',
        description: 'Account address to check for remaining amount',
        show: {
            'actions.function': ['balanceOf']
        }
    }
] as INodeParams[]

export const transferFromParameters = [
    {
        label: 'From Address',
        name: 'from',
        type: 'string',
        description: 'Account address to transfer the token',
        show: {
            'actions.function': ['transferFrom']
        }
    },
    {
        label: 'To Address',
        name: 'to',
        type: 'string',
        description: 'Account address to receive the token',
        show: {
            'actions.function': ['transferFrom']
        }
    },
    {
        label: 'Amount',
        name: 'amount',
        type: 'number',
        description: 'Amount of token transfer',
        show: {
            'actions.function': ['transferFrom']
        }
    },
    {
        label: 'Select Wallet',
        name: 'wallet',
        type: 'asyncOptions',
        description: 'Wallet to move amount tokens from sender to recipient using the allowance mechanism',
        loadFromDbCollections: ['Wallet'],
        loadMethod: 'getWallets',
        show: {
            'actions.function': ['transferFrom']
        }
    }
] as INodeParams[]

export const depositParameters = [
    {
        label: 'Amount',
        name: 'amount',
        type: 'number',
        description: 'Amount of token to deposit',
        show: {
            'actions.function': ['deposit']
        }
    },
    {
        label: 'Select Wallet',
        name: 'wallet',
        type: 'asyncOptions',
        description: 'Wallet to deposit ETH into ERC20 Token',
        loadFromDbCollections: ['Wallet'],
        loadMethod: 'getWallets',
        show: {
            'actions.function': ['deposit']
        }
    }
] as INodeParams[]

export const withdrawParameters = [
    {
        label: 'Amount',
        name: 'amount',
        type: 'number',
        description: 'Amount of token to withdraw',
        show: {
            'actions.function': ['withdraw']
        }
    },
    {
        label: 'Select Wallet',
        name: 'wallet',
        type: 'asyncOptions',
        description: 'Withdraw ERC20 Token to this wallet',
        loadFromDbCollections: ['Wallet'],
        loadMethod: 'getWallets',
        show: {
            'actions.function': ['withdraw']
        }
    }
] as INodeParams[]
