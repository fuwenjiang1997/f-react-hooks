import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseRequestOptions<T> {
    manual?: boolean
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
    onFinally?: () => void
    defaultData?: T
}

export interface UseRequestReturn<T> {
    data: T | undefined
    error: Error | undefined
    loading: boolean
    run: () => Promise<T | undefined>
    cancel: () => void
    refresh: () => Promise<T | undefined>
}

export function useRequest<T>(fetcher: () => Promise<T>, options: UseRequestOptions<T> = {}): UseRequestReturn<T> {
    const { manual = false, onSuccess, onError, onFinally, defaultData } = options

    const [data, setData] = useState<T | undefined>(defaultData)
    const [error, setError] = useState<Error | undefined>(undefined)
    const [loading, setLoading] = useState(false)
    const abortControllerRef = useRef<AbortController | null>(null)
    const fetcherRef = useRef(fetcher)

    fetcherRef.current = fetcher

    const cancel = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
            abortControllerRef.current = null
        }
    }, [])

    const run = useCallback(async (): Promise<T | undefined> => {
        cancel()

        const abortController = new AbortController()
        abortControllerRef.current = abortController

        setLoading(true)
        setError(undefined)

        try {
            const result = await fetcherRef.current()
            setData(result)
            onSuccess?.(result)
            return result
        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                return undefined
            }
            const error = err instanceof Error ? err : new Error(String(err))
            setError(error)
            onError?.(error)
            return undefined
        } finally {
            setLoading(false)
            abortControllerRef.current = null
            onFinally?.()
        }
    }, [cancel, onSuccess, onError, onFinally])

    const refresh = useCallback(() => run(), [run])

    useEffect(() => {
        if (!manual) {
            run()
        }

        return () => {
            cancel()
        }
    }, [manual, run, cancel])

    return {
        data,
        error,
        loading,
        run,
        cancel,
        refresh
    }
}
