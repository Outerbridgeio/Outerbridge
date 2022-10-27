// Account
export const GET_ETH_BALANCE = {
    name: 'getEthBalance',
    module: 'account',
    action: 'balance'
}

export const GET_ETH_BALANCE_MULTI = {
    name: 'getEthBalanceMulti',
    module: 'account',
    action: 'balancemulti'
}

export const GET_NORMAL_TRANSACTIONS = {
    name: 'getNormalTransactions',
    module: 'account',
    action: 'txlist'
}

export const GET_ERC20_TOKEN_TRANSFER = {
    name: 'getErc20TokenTransfer',
    module: 'account',
    action: 'tokentx'
}

export const GET_DEPOSIT = {
    name: 'getDeposit',
    module: 'account',
    action: 'getdeposittxs'
}

export const GET_WITHDRAWAL = {
    name: 'getWithdrawal',
    module: 'account',
    action: 'getwithdrawaltxs'
}

// Contracts
export const GET_CONTRACT_ABI = {
    name: 'getContractAbi',
    module: 'contract',
    action: 'getabi'
}

export const GET_CONTRACT_SOURCE_CODE = {
    name: 'getContractSourceCode',
    module: 'contract',
    action: 'getsourcecode'
}

// Tokens
export const GET_ERC20_TOKEN_SUPPLY = {
    name: 'getErc20TokenSupply',
    module: 'stats',
    action: 'tokensupply'
}

export const GET_ERC20_TOKEN_ACCOUNT_BALANCE = {
    name: 'getErc20TokenAccountBalance',
    module: 'account',
    action: 'tokenbalance'
}

export const OPERATIONS = [
    GET_ETH_BALANCE,
    GET_ETH_BALANCE_MULTI,
    GET_NORMAL_TRANSACTIONS,
    GET_ERC20_TOKEN_TRANSFER,
    GET_DEPOSIT,
    GET_WITHDRAWAL,
    GET_CONTRACT_ABI,
    GET_CONTRACT_SOURCE_CODE,
    GET_ERC20_TOKEN_SUPPLY,
    GET_ERC20_TOKEN_ACCOUNT_BALANCE
] as const

export const SORT_BY = [
    { label: 'Desc', name: 'desc' },
    { label: 'Asc', name: 'asc' }
]
