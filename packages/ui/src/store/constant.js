// constant
export const gridSpacing = 3
export const drawerWidth = 260
export const appDrawerWidth = 320
export const baseURL = process.env.NODE_ENV === 'production' ? window.location.origin : window.location.origin.replace(':8080', ':3000')
export const NETWORK = {
    MAINNET: 'homestead',
    GÖRLI: 'goerli',
    MATIC_MUMBAI: 'maticmum',
    MATIC: 'matic',
    OPTIMISM: 'optimism',
    OPTIMISM_GOERLI: 'optimism-goerli',
    ARBITRUM: 'arbitrum',
    ARBITRUM_GOERLI: 'arbitrum-goerli',
    ARBITRUM_NOVA: 'arbitrum-nova',
    BSC: 'bsc',
    BSC_TESTNET: 'bsc-testnet',
    AVALANCHE: 'avalanche',
    AVALANCHE_TESTNET: 'avalanche-testnet',
    FANTOM: 'fantom',
    FANTOM_TESTNET: 'fantom-testnet',
    CRONOS: 'cronos',
    CRONOS_TESTNET: 'cronos-testnet',
    GNOSIS: 'gnosis',
    CELO: 'celo',
    MOONRIVER: 'moonriver',
    MOONBEAM: 'moonbeam'
}
export const NETWORK_LABEL = {
    MAINNET: 'Mainnet',
    GÖRLI: 'Goerli',
    MATIC_MUMBAI: 'Polygon Mumbai',
    MATIC: 'Polygon Mainnet',
    OPTIMISM: 'Optimism Mainnet',
    OPTIMISM_GOERLI: 'Optimism Goerli',
    ARBITRUM: 'Arbitrum Mainnet',
    ARBITRUM_GOERLI: 'Arbitrum Goerli',
    ARBITRUM_NOVA: 'Arbitrum Nova',
    BSC: 'Binance Smart Chain Mainnet',
    BSC_TESTNET: 'Binance Smart Chain Testnet',
    AVALANCHE: 'Avalanche Mainnet',
    AVALANCHE_TESTNET: 'Avalanche Testnet',
    FANTOM: 'Fantom Mainnet',
    FANTOM_TESTNET: 'Fantom Testnet',
    CRONOS: 'Cronos Mainnet',
    CRONOS_TESTNET: 'Cronos Testnet',
    GNOSIS: 'Gnosis Mainnet',
    CELO: 'Celo Mainnet',
    MOONRIVER: 'Moonriver Mainnet',
    MOONBEAM: 'Moonbeam Mainnet'
}
export const scanAPIs = {
    [NETWORK.MAINNET]: 'https://api.etherscan.io/api',
    [NETWORK.GÖRLI]: 'https://api-goerli.etherscan.io/api',
    [NETWORK.MATIC]: 'https://api.polygonscan.com/api',
    [NETWORK.MATIC_MUMBAI]: 'https://api-testnet.polygonscan.com/api',
    [NETWORK.OPTIMISM]: 'https://api-optimistic.etherscan.io/api',
    [NETWORK.OPTIMISM_GOERLI]: 'https://api-goerli-optimistic.etherscan.io/api',
    [NETWORK.ARBITRUM]: 'https://api.arbiscan.io/api',
    [NETWORK.ARBITRUM_GOERLI]: 'https://api-goerli.arbiscan.io/api',
    [NETWORK.BSC]: 'https://api.bscscan.com/api',
    [NETWORK.BSC_TESTNET]: 'https://api-testnet.bscscan.com/api',
    [NETWORK.AVALANCHE]: 'https://api.snowtrace.io/api',
    [NETWORK.AVALANCHE_TESTNET]: 'https://api-testnet.snowtrace.io/api',
    [NETWORK.FANTOM]: 'https://api.ftmscan.com/api',
    [NETWORK.FANTOM_TESTNET]: 'https://api-testnet.ftmscan.com/api',
    [NETWORK.CRONOS]: 'https://api.cronoscan.com/api',
    [NETWORK.CRONOS_TESTNET]: 'https://api-testnet.cronoscan.com/api',
    [NETWORK.GNOSIS]: 'https://api.gnosisscan.io/api',
    [NETWORK.CELO]: 'https://api.celoscan.io/api',
    [NETWORK.MOONRIVER]: 'https://api-moonriver.moonscan.io/api',
    [NETWORK.MOONBEAM]: 'https://api-moonbeam.moonscan.io/api'
}
export const networkExplorers = {
    [NETWORK.MAINNET]: 'https://etherscan.io',
    [NETWORK.GÖRLI]: 'https://goerli.etherscan.io',
    [NETWORK.MATIC]: 'https://polygonscan.com',
    [NETWORK.MATIC_MUMBAI]: 'https://mumbai.polygonscan.com',
    [NETWORK.OPTIMISM]: 'https://optimistic.etherscan.io',
    [NETWORK.OPTIMISM_GOERLI]: 'https://goerli-optimistic.etherscan.io',
    [NETWORK.ARBITRUM]: 'https://arbiscan.io',
    [NETWORK.ARBITRUM_GOERLI]: 'https://goerli-explorer.arbitrum.io',
    [NETWORK.BSC]: 'https://bscscan.com',
    [NETWORK.BSC_TESTNET]: 'https://testnet.bscscan.com',
    [NETWORK.FANTOM]: 'https://ftmscan.com',
    [NETWORK.FANTOM_TESTNET]: 'https://testnet.ftmscan.com',
    [NETWORK.CRONOS]: 'https://cronoscan.com',
    [NETWORK.CRONOS_TESTNET]: 'https://testnet.cronoscan.com',
    [NETWORK.GNOSIS]: 'https://gnosisscan.io',
    [NETWORK.CELO]: 'https://celoscan.io',
    [NETWORK.MOONRIVER]: 'https://moonriver.moonscan.io',
    [NETWORK.MOONBEAM]: 'https://moonscan.io'
}
export const networks = [
    {
        label: NETWORK_LABEL.MAINNET,
        name: NETWORK.MAINNET,
        uri: scanAPIs[NETWORK.MAINNET],
        color: '#3c3c3d'
    },
    {
        label: NETWORK_LABEL.GÖRLI,
        name: NETWORK.GÖRLI,
        uri: scanAPIs[NETWORK.GÖRLI],
        color: '#3a86ff'
    },
    {
        label: NETWORK_LABEL.MATIC,
        name: NETWORK.MATIC,
        uri: scanAPIs[NETWORK.MATIC],
        color: '#8247e5'
    },
    {
        label: NETWORK_LABEL.MATIC_MUMBAI,
        name: NETWORK.MATIC_MUMBAI,
        uri: scanAPIs[NETWORK.MATIC_MUMBAI],
        color: '#8247e5'
    },
    {
        label: NETWORK_LABEL.BSC,
        name: NETWORK.BSC,
        uri: scanAPIs[NETWORK.BSC],
        color: '#ffbe0b'
    },
    {
        label: NETWORK_LABEL.BSC_TESTNET,
        name: NETWORK.BSC_TESTNET,
        uri: scanAPIs[NETWORK.BSC_TESTNET],
        color: '#ffbe0b'
    },
    {
        label: NETWORK_LABEL.OPTIMISM,
        name: NETWORK.OPTIMISM,
        uri: scanAPIs[NETWORK.OPTIMISM],
        color: '#ef233c'
    },
    {
        label: NETWORK_LABEL.OPTIMISM_GOERLI,
        name: NETWORK.OPTIMISM_GOERLI,
        uri: scanAPIs[NETWORK.OPTIMISM_GOERLI],
        color: '#ef233c'
    },
    {
        label: NETWORK_LABEL.ARBITRUM,
        name: NETWORK.ARBITRUM,
        uri: scanAPIs[NETWORK.ARBITRUM],
        color: '#023e8a'
    },
    {
        label: NETWORK_LABEL.ARBITRUM_GOERLI,
        name: NETWORK.ARBITRUM_GOERLI,
        uri: scanAPIs[NETWORK.ARBITRUM_GOERLI],
        color: '#023e8a'
    },
    {
        label: NETWORK_LABEL.AVALANCHE,
        name: NETWORK.AVALANCHE,
        uri: scanAPIs[NETWORK.AVALANCHE],
        color: '#e84142'
    },
    {
        label: NETWORK_LABEL.AVALANCHE_TESTNET,
        name: NETWORK.AVALANCHE_TESTNET,
        uri: scanAPIs[NETWORK.AVALANCHE_TESTNET],
        color: '#e84142'
    },
    {
        label: NETWORK_LABEL.FANTOM,
        name: NETWORK.FANTOM,
        uri: scanAPIs[NETWORK.FANTOM],
        color: '#001f68'
    },
    {
        label: NETWORK_LABEL.FANTOM_TESTNET,
        name: NETWORK.FANTOM_TESTNET,
        uri: scanAPIs[NETWORK.FANTOM_TESTNET],
        color: '#001f68'
    },
    {
        label: NETWORK_LABEL.CRONOS,
        name: NETWORK.CRONOS,
        uri: scanAPIs[NETWORK.CRONOS],
        color: '#0c1526'
    },
    {
        label: NETWORK_LABEL.CRONOS_TESTNET,
        name: NETWORK.CRONOS_TESTNET,
        uri: scanAPIs[NETWORK.CRONOS_TESTNET],
        color: '#0c1526'
    },
    {
        label: NETWORK_LABEL.GNOSIS,
        name: NETWORK.GNOSIS,
        uri: scanAPIs[NETWORK.GNOSIS],
        color: '#0d8e74'
    },
    {
        label: NETWORK_LABEL.CELO,
        name: NETWORK.CELO,
        uri: scanAPIs[NETWORK.CELO],
        color: '#35d07f'
    },
    {
        label: NETWORK_LABEL.MOONRIVER,
        name: NETWORK.MOONRIVER,
        uri: scanAPIs[NETWORK.MOONRIVER],
        color: '#fcbf49'
    },
    {
        label: NETWORK_LABEL.MOONBEAM,
        name: NETWORK.MOONBEAM,
        uri: scanAPIs[NETWORK.MOONBEAM],
        color: '#f15bb5'
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
                        'networks.network': [NETWORK.MAINNET, NETWORK.GÖRLI]
                    },
                    description: `Register for a Free API Key from: ${networkExplorers[NETWORK.MAINNET]}/apis`
                },
                {
                    label: 'Polygonscan API',
                    name: 'polygonscanApi',
                    show: {
                        'networks.network': [NETWORK.MATIC, NETWORK.MATIC_MUMBAI]
                    },
                    description: `Register for a Free API Key from: ${networkExplorers[NETWORK.MATIC]}/apis`
                },
                {
                    label: 'Bscscan API',
                    name: 'bscscanApi',
                    show: {
                        'networks.network': [NETWORK.BSC, NETWORK.BSC_TESTNET]
                    },
                    description: `Register for a Free API Key from: ${networkExplorers[NETWORK.BSC]}/apis`
                },
                {
                    label: 'Optimism Etherscan API',
                    name: 'optimisticEtherscanApi',
                    show: {
                        'networks.network': [NETWORK.OPTIMISM, NETWORK.OPTIMISM_GOERLI]
                    },
                    description: `Register for a Free API Key from: ${networkExplorers[NETWORK.OPTIMISM]}/apis`
                },
                {
                    label: 'Arbiscan API',
                    name: 'arbiscanApi',
                    show: {
                        'networks.network': [NETWORK.ARBITRUM, NETWORK.ARBITRUM_GOERLI]
                    },
                    description: `Register for a Free API Key from: ${networkExplorers[NETWORK.ARBITRUM]}/apis`
                },
                {
                    label: 'FantomScan API',
                    name: 'fantomscanApi',
                    show: {
                        'networks.network': [NETWORK.FANTOM, NETWORK.FANTOM_TESTNET]
                    },
                    description: `Register for a Free API Key from: ${networkExplorers[NETWORK.FANTOM]}/apis`
                },
                {
                    label: 'SnowTrace API',
                    name: 'snowtraceApi',
                    show: {
                        'networks.network': [NETWORK.AVALANCHE, NETWORK.AVALANCHE_TESTNET]
                    },
                    description: `Register for a Free API Key from: ${networkExplorers[NETWORK.AVALANCHE]}/apis`
                },
                {
                    label: 'CronosScan API',
                    name: 'cronosscanApi',
                    show: {
                        'networks.network': [NETWORK.CRONOS, NETWORK.CRONOS_TESTNET]
                    },
                    description: `Register for a Free API Key from: ${networkExplorers[NETWORK.CRONOS]}/apis`
                },
                {
                    label: 'GnosisScan API',
                    name: 'gnosisscanApi',
                    show: {
                        'networks.network': [NETWORK.GNOSIS]
                    },
                    description: `Register for a Free API Key from: ${networkExplorers[NETWORK.GNOSIS]}/apis`
                },
                {
                    label: 'CeloScan API',
                    name: 'celoscanApi',
                    show: {
                        'networks.network': [NETWORK.CELO]
                    },
                    description: `Register for a Free API Key from: ${networkExplorers[NETWORK.CELO]}/apis`
                },
                {
                    label: 'MoonRiverScan API',
                    name: 'moonRiverScanApi',
                    show: {
                        'networks.network': [NETWORK.MOONRIVER]
                    },
                    description: `Register for a Free API Key from: ${networkExplorers[NETWORK.MOONRIVER]}/apis`
                },
                {
                    label: 'MoonbeamScan API',
                    name: 'moonBeamScanApi',
                    show: {
                        'networks.network': [NETWORK.MOONBEAM]
                    },
                    description: `Register for a Free API Key from: ${networkExplorers[NETWORK.MOONBEAM]}/apis`
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
