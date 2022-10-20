import { useState } from 'react'
import { AxiosResponse } from 'axios'

export type WorkFlowData = {
    shortId: string
    address?: string
    network?:
        | 'homestead'
        | 'rinkeby'
        | 'kovan'
        | 'ropsten'
        | 'goerli'
        | 'matic'
        | 'maticmum'
        | 'bsc'
        | 'bsc-testnet'
        | 'optimism'
        | 'optimism-kovan'
        | 'arbitrum'
        | 'arbitrum-rinkeby'
        | undefined
    deployed?: boolean
    executionCount?: number
    flowData: string
    name: string
    _id: string
}

export const useApi = (apiFunc: (...args: any) => Promise<AxiosResponse<any, any>>) => {
    const [data, setData] = useState<WorkFlowData[] | null>(null)
    const [error, setError] = useState<unknown>(null)
    const [loading, setLoading] = useState(false)

    const request = async (...args: unknown[]) => {
        setLoading(true)
        try {
            const result = await apiFunc(...args)
            setData(result.data)
        } catch (err) {
            setError(err || 'Unexpected Error!')
        } finally {
            setLoading(false)
        }
    }

    return {
        data,
        error,
        loading,
        request
    }
}
