// constant
export const gridSpacing = 3;
export const drawerWidth = 260;
export const appDrawerWidth = 320;
export const baseURL = process.NODE_ENV === 'production' ? window.location.origin : window.location.origin.replace(":8080", ":3000");
export const networks = [
    {
        name: 'Ethereum Mainnet',
        value: 'homestead',
        uri: 'https://api.etherscan.io/api',
    },
    {
        name: 'Ethereum Rinkeby',
        value: 'rinkeby',
        uri: 'https://api-rinkeby.etherscan.io/api',
    },
    {
        name: 'Ethereum Kovan',
        value: 'kovan',
        uri: 'https://api-kovan.etherscan.io/api',
    },
    {
        name: 'Ethereum Ropsten',
        value: 'ropsten',
        uri: 'https://api-kovan.etherscan.io/api',
    },
    {
        name: 'Ethereum Goerli',
        value: 'goerli',
        uri: 'https://api-goerli.etherscan.io/api',
    },
    {
        name: 'Polygon Mainnet',
        value: 'matic',
        uri: 'https://api.polygonscan.com/api',
    },
    {
        name: 'Polygon Mumbai',
        value: 'maticmum',
        uri: 'https://api-testnet.polygonscan.com/api',
    },
    {
        name: 'Binance Smart Chain Mainnet',
        value: 'bsc',
        uri: 'https://api.bscscan.com/api',
    },
    {
        name: 'Binance Smart Chain Testnet',
        value: 'bsc-testnet',
        uri: 'https://api-testnet.bscscan.com/api',
    },
    {
        name: 'Optimism Mainnet',
        value: 'optimism',
        uri: 'https://api-optimistic.etherscan.io/api',
    },
    {
        name: 'Optimism Kovan',
        value: 'optimism-kovan',
        uri: 'https://api-kovan-optimistic.etherscan.io/api',
    },
    {
        name: 'Arbitrum Mainnet',
        value: 'arbitrum',
        uri: 'https://api.arbiscan.io/api',
    },
    {
        name: 'Arbitrum Rinkeby',
        value: 'arbitrum-rinkeby',
        uri: 'https://api-testnet.arbiscan.io/api',
    },
];