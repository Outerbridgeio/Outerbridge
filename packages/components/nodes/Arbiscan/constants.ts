// Account
export const GET_ETHER_BALANCE = {
    name: 'getEtherBalance',
    module: 'account',
    action: 'balance'
}

export const GET_MULTI_ETHER_BALANCE = {
    name: 'getEtherBalanceMulti',
    module: 'account',
    action: 'balancemulti'
}

export const GET_NORMAL_TRANSACTIONS = {
    name: 'getTransactions',
    module: 'account',
    action: 'txlist'
}

export const GET_INTERNAL_TRANSACTIONS = {
    name: 'getInternalTransactions',
    module: 'account',
    action: 'txlistinternal'
}

export const GET_INTERNAL_TRANSACTIONS_BY_HASH = {
    name: 'getInternalTransactionsByHash',
    module: 'account',
    action: 'txlistinternal'
}

export const GET_INTERNAL_TRANSACTIONS_BY_BLOCK = {
    name: 'getInternalTransactionsByBlock',
    module: 'account',
    action: 'txlistinternal'
}

// Contracts
export const GET_ABI = {
    name: 'getAbi',
    module: 'contract',
    action: 'getabi'
}

export const GET_CONTRACT_SOURCE_CODE = {
    name: 'getContractSourceCode',
    module: 'contract',
    action: 'getsourcecode'
}

// Transactions
export const CHECK_CONTRACT_EXECUTION_STATUS = {
    name: 'getContractExecutionStatus',
    module: 'transaction',
    action: 'getstatus'
}

export const CHECK_TRANSACTION_RECEIPT_STATUS = {
    name: 'getTransactionReceiptStatus',
    module: 'transaction',
    action: 'gettxreceiptstatus'
}

// Tokens
export const GET_ERC20_TOKEN_SUPPLY = {
    name: 'getErc20TokenSupply',
    module: 'stats',
    action: 'tokensupply'
}

export const GET_ERC20_TOKEN_BALANCE = {
    name: 'getErc20TokenBalance',
    module: 'account',
    action: 'tokenbalance'
}

// Stats
export const GET_ETHER_PRICE = {
    name: 'getEtherPrice',
    module: 'stats',
    action: 'ethprice'
}
export const GET_ETHER_SUPPLY = {
    name: 'getEtherSupply',
    module: 'stats',
    action: 'ethsupply'
}

export const OPERATIONS = [
    GET_ETHER_BALANCE,
    GET_MULTI_ETHER_BALANCE,
    GET_NORMAL_TRANSACTIONS,
    GET_INTERNAL_TRANSACTIONS,
    GET_INTERNAL_TRANSACTIONS_BY_HASH,
    GET_INTERNAL_TRANSACTIONS_BY_BLOCK,

    GET_ABI,
    GET_CONTRACT_SOURCE_CODE,

    CHECK_TRANSACTION_RECEIPT_STATUS,
    CHECK_CONTRACT_EXECUTION_STATUS,

    GET_ERC20_TOKEN_SUPPLY,
    GET_ERC20_TOKEN_BALANCE,

    GET_ETHER_PRICE,
    GET_ETHER_SUPPLY
] as const

export const SORT_BY = [
    { label: 'Desc', name: 'desc' },
    { label: 'Asc', name: 'asc' }
]
