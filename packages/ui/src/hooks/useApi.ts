import { useState } from 'react'
import { AxiosResponse } from 'axios'

export const useApi = (apiFunc: (...args: any[]) => AxiosResponse<any, any>) => {
    const [data, setData] = useState(null)
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
