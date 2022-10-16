export const OPERATION = {
    // Account
    GET_TOKEN_BALANCES: 'getTokenBalances',
    GET_TRANSACTIONS: 'getTransactions',
    GET_STAKING_ACCOUNTS: 'getStakingAccounts',
    GET_TOKEN_TRANSFERS: 'getTokenTransfers',
    GET_SOL_TRANSFERS: 'getSolTransfers',
    GET_ACCOUNT_INFO: 'getAccountInfo',

    // Transaction
    GET_LAST_TRANSACTIONS: 'getLastTransactions',
    GET_TRANSACTION_INFO: 'getTransactionInfo',

    // Token
    GET_TOKEN_HOLDER: 'getTokenHolder',
    GET_TOKEN_INFO: 'getTokenInfo',
    GET_TOKENS: 'getTokens',

    // Market
    GET_TOKEN_MARKET_INFO: 'getMarketTokenInfo',

    // Chain Info
    GET_CHAIN_INFO: 'getChainInfo'
} as const

export const SORT_BY = [
    { label: 'Market cap', name: 'market_cap' },
    { label: 'Volume', name: 'volume' },
    { label: 'Holder', name: 'holder' },
    { label: 'Price', name: 'price' },
    { label: 'Price change 24 h', name: 'price_change_24h' },
    { label: 'Price change 7 d', name: 'price_change_7d' },
    { label: 'Price change 14 d', name: 'price_change_14d' },
    { label: 'Price change 30 d', name: 'price_change_30d' },
    { label: 'Price change 60 d', name: 'price_change_60d' },
    { label: 'Price change 200 d', name: 'price_change_200d' },
    { label: 'Price change 1 y', name: 'price_change_1y' }
] as const

export const SORT_DIRECTION = [
    { label: 'Desc', name: 'desc' },
    { label: 'Asc', name: 'asc' }
] as const
