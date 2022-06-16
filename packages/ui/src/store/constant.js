// constant
export const gridSpacing = 3;
export const drawerWidth = 260;
export const appDrawerWidth = 320;
export const baseURL = process.NODE_ENV === 'production' ? window.location.origin : window.location.origin.replace(":8080", ":3000");
export const networks = [
    {
        label: 'Ethereum Mainnet',
        name: 'homestead',
        uri: 'https://api.etherscan.io/api',
    },
    {
        label: 'Ethereum Rinkeby',
        name: 'rinkeby',
        uri: 'https://api-rinkeby.etherscan.io/api',
    },
    {
        label: 'Ethereum Kovan',
        name: 'kovan',
        uri: 'https://api-kovan.etherscan.io/api',
    },
    {
        label: 'Ethereum Ropsten',
        name: 'ropsten',
        uri: 'https://api-kovan.etherscan.io/api',
    },
    {
        label: 'Ethereum Goerli',
        name: 'goerli',
        uri: 'https://api-goerli.etherscan.io/api',
    },
    {
        label: 'Polygon Mainnet',
        name: 'matic',
        uri: 'https://api.polygonscan.com/api',
    },
    {
        label: 'Polygon Mumbai',
        name: 'maticmum',
        uri: 'https://api-testnet.polygonscan.com/api',
    },
    {
        label: 'Binance Smart Chain Mainnet',
        name: 'bsc',
        uri: 'https://api.bscscan.com/api',
    },
    {
        label: 'Binance Smart Chain Testnet',
        name: 'bsc-testnet',
        uri: 'https://api-testnet.bscscan.com/api',
    },
    {
        label: 'Optimism Mainnet',
        name: 'optimism',
        uri: 'https://api-optimistic.etherscan.io/api',
    },
    {
        label: 'Optimism Kovan',
        name: 'optimism-kovan',
        uri: 'https://api-kovan-optimistic.etherscan.io/api',
    },
    {
        label: 'Arbitrum Mainnet',
        name: 'arbitrum',
        uri: 'https://api.arbiscan.io/api',
    },
    {
        label: 'Arbitrum Rinkeby',
        name: 'arbitrum-rinkeby',
        uri: 'https://api-testnet.arbiscan.io/api',
    },
];

export const contract_details = {
    networks: [
        {
            label: 'Select Network',
            name: 'network',
            type: 'options',
            options: networks,
            default: 'homestead'
        },
    ],
    credentials: [
        {
            label: 'Credential Method',
            name: 'credentialMethod',
            type: 'options',
            options: [
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
                },
            ],
            default: 'etherscanApi',
        }
    ],
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
    ],
}