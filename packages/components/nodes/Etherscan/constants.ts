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

export const GET_HISTORICAL_ETHER_BALANCE = {
    name: 'getHistoricalEtherBalance',
    module: 'account',
    action: 'balancehistory'
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

export const GET_BLOCKS_VALIDATED = {
    name: 'getBlocksValidated',
    module: 'account',
    action: 'getminedblocks'
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

export const GET_HISTORICAL_ERC20_TOKEN_SUPPLY = {
    name: 'getHistoricalErc20TokenSupply',
    module: 'stats',
    action: 'tokensupplyhistory'
}

export const GET_HISTORICAL_ERC20_TOKEN_BALANCE = {
    name: 'getHistoricalErc20TokenBalance',
    module: 'account',
    action: 'tokenbalancehistory'
}

export const GET_TOKEN_INFO = {
    name: 'getTokenInfo',
    module: 'token',
    action: 'tokeninfo'
}

// Stats
export const GET_ETHER_PRICE = {
    name: 'getEtherPrice',
    module: 'stats',
    action: 'maticprice'
}

export const GET_HISTORICAL_ETHER_PRICE = {
    name: 'getHistoricalEtherPrice',
    module: 'stats',
    action: 'ethdailyprice'
}

export const OPERATIONS = [
    GET_ETHER_BALANCE,
    GET_MULTI_ETHER_BALANCE,
    GET_HISTORICAL_ETHER_BALANCE,
    GET_NORMAL_TRANSACTIONS,
    GET_INTERNAL_TRANSACTIONS,
    GET_INTERNAL_TRANSACTIONS_BY_HASH,
    GET_INTERNAL_TRANSACTIONS_BY_BLOCK,
    GET_BLOCKS_VALIDATED,
    GET_ABI,
    GET_CONTRACT_SOURCE_CODE,
    CHECK_TRANSACTION_RECEIPT_STATUS,
    GET_ERC20_TOKEN_SUPPLY,
    GET_ERC20_TOKEN_BALANCE,
    GET_HISTORICAL_ERC20_TOKEN_SUPPLY,
    GET_HISTORICAL_ERC20_TOKEN_BALANCE,
    GET_TOKEN_INFO,
    GET_ETHER_PRICE,
    GET_HISTORICAL_ETHER_PRICE
] as const

export const SORT_BY = [
    { label: 'Desc', name: 'desc' },
    { label: 'Asc', name: 'asc' }
]
