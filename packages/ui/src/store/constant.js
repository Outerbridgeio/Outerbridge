// constant
export const gridSpacing = 3
export const drawerWidth = 260
export const appDrawerWidth = 320
export const baseURL = process.NODE_ENV === 'production' ? window.location.origin : window.location.origin.replace(':8080', ':3000')
export const networkExplorers = {
    homestead: 'https://etherscan.io',
    rinkeby: 'https://rinkeby.etherscan.io',
    ropsten: 'https://ropsten.etherscan.io',
    kovan: 'https://kovan.etherscan.io',
    goerli: 'https://goerli.etherscan.io',
    matic: 'https://polygonscan.com',
    maticmum: 'https://mumbai.polygonscan.com',
    optimism: 'https://optimistic.etherscan.io',
    'optimism-kovan': 'https://kovan-optimistic.etherscan.io',
    arbitrum: 'https://arbiscan.io',
    'arbitrum-rinkeby': 'https://rinkeby-explorer.arbitrum.io',
    bsc: 'https://bscscan.com',
    'bsc-testnet': 'https://testnet.bscscan.com',
    localhost: ''
}
export const networks = [
    {
        label: 'Ethereum Mainnet',
        name: 'homestead',
        uri: 'https://api.etherscan.io/api',
        color: '#3c3c3d'
    },
    {
        label: 'Ethereum Rinkeby',
        name: 'rinkeby',
        uri: 'https://api-rinkeby.etherscan.io/api',
        color: '#ffbe0b'
    },
    {
        label: 'Ethereum Kovan',
        name: 'kovan',
        uri: 'https://api-kovan.etherscan.io/api',
        color: '#8338ec'
    },
    {
        label: 'Ethereum Ropsten',
        name: 'ropsten',
        uri: 'https://api-kovan.etherscan.io/api',
        color: '#ff006e'
    },
    {
        label: 'Ethereum Goerli',
        name: 'goerli',
        uri: 'https://api-goerli.etherscan.io/api',
        color: '#3a86ff'
    },
    {
        label: 'Polygon Mainnet',
        name: 'matic',
        uri: 'https://api.polygonscan.com/api',
        color: '#8247e5'
    },
    {
        label: 'Polygon Mumbai',
        name: 'maticmum',
        uri: 'https://api-testnet.polygonscan.com/api',
        color: '#8247e5'
    },
    {
        label: 'Binance Smart Chain Mainnet',
        name: 'bsc',
        uri: 'https://api.bscscan.com/api',
        color: '#ffbe0b'
    },
    {
        label: 'Binance Smart Chain Testnet',
        name: 'bsc-testnet',
        uri: 'https://api-testnet.bscscan.com/api',
        color: '#ffbe0b'
    },
    {
        label: 'Optimism Mainnet',
        name: 'optimism',
        uri: 'https://api-optimistic.etherscan.io/api',
        color: '#ef233c'
    },
    {
        label: 'Optimism Kovan',
        name: 'optimism-kovan',
        uri: 'https://api-kovan-optimistic.etherscan.io/api',
        color: '#ef233c'
    },
    {
        label: 'Arbitrum Mainnet',
        name: 'arbitrum',
        uri: 'https://api.arbiscan.io/api',
        color: '#023e8a'
    },
    {
        label: 'Arbitrum Rinkeby',
        name: 'arbitrum-rinkeby',
        uri: 'https://api-testnet.arbiscan.io/api',
        color: '#023e8a'
    }
]

export const network_details = {
    networks: [
        {
            label: 'Select Network',
            name: 'network',
            type: 'options',
            options: networks,
            default: 'homestead'
        }
    ],
    credentials: [
        {
            label: 'API Key (Optional)',
            name: 'credentialMethod',
            type: 'options',
            description: 'Provide an API key to avoid rate limit',
            options: [
                {
                    label: 'No Auth',
                    name: 'noAuth',
                    description: 'Use public endpoint without API key',
                    hideRegisteredCredential: true
                },
                {
                    label: 'Etherscan API',
                    name: 'etherscanApi',
                    show: {
                        'networks.network': ['homestead', 'rinkeby', 'kovan', 'ropsten', 'goerli']
                    },
                    description: 'Register for a Free API Key from: https://etherscan.io/apis'
                },
                {
                    label: 'Polygonscan API',
                    name: 'polygonscanApi',
                    show: {
                        'networks.network': ['matic', 'maticmum']
                    },
                    description: 'Register for a Free API Key from: https://polygonscan.com/apis'
                },
                {
                    label: 'Bscscan API',
                    name: 'bscscanApi',
                    show: {
                        'networks.network': ['bsc', 'bsc-testnet']
                    },
                    description: 'Register for a Free API Key from: https://bscscan.com/apis'
                },
                {
                    label: 'Optimism Etherscan API',
                    name: 'optimisticEtherscanApi',
                    show: {
                        'networks.network': ['optimism', 'optimism-kovan']
                    },
                    description: 'Register for a Free API Key from: https://optimistic.etherscan.io/apis'
                },
                {
                    label: 'Arbiscan API',
                    name: 'arbiscanApi',
                    show: {
                        'networks.network': ['arbitrum', 'arbitrum-rinkeby']
                    },
                    description: 'Register for a Free API Key from: https://arbiscan.io/apis'
                }
            ],
            default: 'noAuth'
        }
    ]
}

export const contract_details = {
    ...network_details,
    contractInfo: [
        {
            label: 'Contract Name',
            name: 'name',
            type: 'string',
            description: 'Name the contract to make it easier to identify it in Outerbridge',
            default: ''
        },
        {
            label: 'Contract Address',
            name: 'address',
            type: 'string',
            default: ''
        },
        {
            label: 'ABI',
            name: 'abi',
            type: 'json',
            default: '',
            description: 'ABI will be fetched automatically if address is valid'
        }
    ]
}

export const wallet_details = {
    ...network_details,
    walletInfo: [
        {
            label: 'Wallet Name',
            name: 'name',
            type: 'string',
            description: 'Name the wallet to make it easier to identify it in Outerbridge',
            default: ''
        }
    ]
}

export const privateKeyField = [
    {
        label: 'Private Key',
        name: 'privateKey',
        type: 'string',
        description: 'Private key of wallet to be imported',
        default: ''
    }
]
