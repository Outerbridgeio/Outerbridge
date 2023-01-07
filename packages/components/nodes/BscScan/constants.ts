// Account
export const GET_BNB_BALANCE = {
    name: 'getBnbBalance',
    module: 'account',
    action: 'balance'
}

export const GET_MULTI_BNB_BALANCE = {
    name: 'getBnbBalanceMulti',
    module: 'account',
    action: 'balancemulti'
}

export const GET_HISTORICAL_BNB_BALANCE = {
    name: 'getHistoricalBnbBalance',
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
export const GET_CONTRACT_CREATION = {
    name: 'getContractCreation',
    module: 'contract',
    action: 'getcontractcreation'
}

// Transactions
export const CHECK_TRANSACTION_RECEIPT_STATUS = {
    name: 'getTransactionReceiptStatus',
    module: 'transaction',
    action: 'gettxreceiptstatus'
}

// Tokens
export const GET_BEP20_CIRCULATION_TOKEN_SUPPLY = {
    name: 'getBep20TokenCirculatingSupply',
    module: 'stats',
    action: 'tokenCsupply'
}
export const GET_BEP20_TOKEN_SUPPLY = {
    name: 'getBep20TokenSupply',
    module: 'stats',
    action: 'tokensupply'
}

export const GET_BEP20_TOKEN_BALANCE = {
    name: 'getBep20TokenBalance',
    module: 'account',
    action: 'tokenbalance'
}

export const GET_HISTORICAL_BEP20_TOKEN_SUPPLY = {
    name: 'getHistoricalBep20TokenSupply',
    module: 'stats',
    action: 'tokensupplyhistory'
}

export const GET_HISTORICAL_BEP20_TOKEN_BALANCE = {
    name: 'getHistoricalBep20TokenBalance',
    module: 'account',
    action: 'tokenbalancehistory'
}

export const GET_TOKEN_INFO = {
    name: 'getTokenInfo',
    module: 'token',
    action: 'tokeninfo'
}

// Stats
export const GET_BNB_SUPPLY = {
    name: 'getBep20TokenSupply',
    module: 'stats',
    action: 'tokensupply'
}

export const GET_BNB_PRICE = {
    name: 'getBnbPrice',
    module: 'stats',
    action: 'bnbprice'
}

export const GET_HISTORICAL_BNB_PRICE = {
    name: 'getHistoricalBnbPrice',
    module: 'stats',
    action: 'bnbdailyprice'
}

export const OPERATIONS = [
    GET_BNB_BALANCE,
    GET_MULTI_BNB_BALANCE,
    GET_HISTORICAL_BNB_BALANCE,
    GET_NORMAL_TRANSACTIONS,
    GET_INTERNAL_TRANSACTIONS,
    GET_INTERNAL_TRANSACTIONS_BY_HASH,
    GET_INTERNAL_TRANSACTIONS_BY_BLOCK,
    GET_BLOCKS_VALIDATED,
    GET_ABI,
    GET_CONTRACT_SOURCE_CODE,
    GET_CONTRACT_CREATION,
    CHECK_TRANSACTION_RECEIPT_STATUS,
    GET_BEP20_TOKEN_SUPPLY,
    GET_BEP20_TOKEN_BALANCE,
    GET_HISTORICAL_BEP20_TOKEN_SUPPLY,
    GET_HISTORICAL_BEP20_TOKEN_BALANCE,
    GET_TOKEN_INFO,
    GET_BNB_PRICE,
    GET_HISTORICAL_BNB_PRICE,
    GET_BNB_SUPPLY,
    GET_BEP20_CIRCULATION_TOKEN_SUPPLY
] as const

export const SORT_BY = [
    { label: 'Desc', name: 'desc' },
    { label: 'Asc', name: 'asc' }
]
