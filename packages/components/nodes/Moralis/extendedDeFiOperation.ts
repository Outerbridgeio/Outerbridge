import { INodeOptionsValue, INodeParams } from "../../src";

export const defiOperation = [
    {
        label:'Get Pair Reserves',
        name: 'getPairReserves',
        description: 'Get the liquidity reserves for a given pair address. Only Uniswap V2 based exchanges supported at the moment.'
    },
    {
        label:'Get Pair Address',
        name: 'getPairAddress',
        description: 'Fetch the pair data of the provided token0+token1 combination. The token0 and token1 options are interchangable (ie. there is no different outcome in "token0=WETH and token1=USDT" or "token0=USDT and token1=WETH")'
    },
] as INodeOptionsValue[];

export const getPairReserves = [
    {
        label: 'Pair Address',
        name: 'pairAddress',
        type: 'string',
        description: 'Liquidity pair address',
        show: {
            'inputParameters.operation': [
                'getPairReserves',
            ]
        }
    },
    {
        label: 'To Block',
        name: 'to_block',
        type: 'string',
        description: 'To get the reserves at this block number',
        show: {
            'inputParameters.operation': [
                'getPairReserves',
            ]
        }
    },
    {
        label: 'To Date',
        name: 'to_date',
        type: 'date',
        description: 'Get the reserves to this date',
        show: {
            'inputParameters.operation': [
                'getPairReserves',
            ]
        }
    },
] as INodeParams[];

export const getPairAddress = [
    {
        label: 'Token0 Address',
        name: 'token0_address',
        type: 'string',
        description: 'Token0 address',
        show: {
            'inputParameters.operation': [
                'getPairAddress',
            ]
        }
    },
    {
        label: 'Token1 Address',
        name: 'token1_address',
        type: 'string',
        description: 'Token1 address',
        show: {
            'inputParameters.operation': [
                'getPairAddress',
            ]
        }
    },
    {
        label: 'Exchange',
        name: 'exchange',
        type: 'options',
        description: 'The factory name or address of the token exchange',
        options: [
            {
                label: 'UniSwapV2',
                name: 'uniswapv2'
            },
            {
                label: 'UniSwapV3',
                name: 'uniswapv3'
            },
            {
                label: 'SushiSwapV2',
                name: 'sushiswapv2'
            },
            {
                label: 'PancakeSwapV2',
                name: 'pancakeswapv2'
            },
            {
                label: 'PancakeSwapV1',
                name: 'pancakeswapv1'
            },
            {
                label: 'QuickSwap',
                name: 'quickswap'
            },
        ],
        default: 'uniswapv2',
        show: {
            'inputParameters.operation': [
                'getPairAddress'
            ]
        }
    },
    {
        label: 'To Block',
        name: 'to_block',
        type: 'string',
        description: 'To get the reserves at this block number',
        show: {
            'inputParameters.operation': [
                'getPairAddress',
            ]
        }
    },
    {
        label: 'To Date',
        name: 'to_date',
        type: 'date',
        description: 'Get the reserves to this date',
        show: {
            'inputParameters.operation': [
                'getPairAddress',
            ]
        }
    },
] as INodeParams[];