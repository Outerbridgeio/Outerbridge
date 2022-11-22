import { useState } from 'react'
import { AxiosResponse, AxiosError } from 'axios'

type Error = { response?: { data?: any }; message?: string }

export const useApi = <T extends (...args: any) => Promise<AxiosResponse<any, any>>>(apiFunc: T) => {
    const [data, setData] = useState<(ReturnType<T> extends Promise<AxiosResponse<infer S, any>> ? S : never) | null>(null)
    const [error, setError] = useState<AxiosError<Error> | null>(null)
    const [loading, setLoading] = useState(false)

    const request = async (...args: [...Parameters<T>]) => {
        setLoading(true)
        try {
            const result = await apiFunc(...args)
            setData(result.data)
        } catch (error) {
            const err = error as AxiosError<Error>
            setError({ ...err, message: err?.message || 'Unexpected Error!' })
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
