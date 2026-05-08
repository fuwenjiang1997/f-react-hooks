import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseCopyOptions {
    onSuccess?: () => void
    onError?: (error: Error) => void
    resetDuration?: number
}

export interface UseCopyReturn {
    copy: (text: string) => Promise<boolean>
    copied: boolean
    isSupported: boolean
}

export function useCopy(options: UseCopyOptions = {}): UseCopyReturn {
    const { onSuccess, onError, resetDuration = 2000 } = options
    const [copied, setCopied] = useState(false)
    const [isSupported, setIsSupported] = useState(true)

    // 使用 ref 保存回调，避免依赖变化导致函数重新创建
    const onSuccessRef = useRef(onSuccess)
    const onErrorRef = useRef(onError)

    // 保持回调引用最新
    onSuccessRef.current = onSuccess
    onErrorRef.current = onError

    // 组件挂载时检测剪贴板 API 支持
    useEffect(() => {
        const supported = typeof navigator !== 'undefined' && typeof navigator.clipboard !== 'undefined'
        setIsSupported(supported)
    }, [])

    const copy = useCallback(
        async (text: string): Promise<boolean> => {
            if (copied || !isSupported) return false

            try {
                await navigator.clipboard.writeText(text)
                setCopied(true)
                onSuccessRef.current?.()

                // 设置重置定时器
                setTimeout(() => {
                    setCopied(false)
                }, resetDuration)

                return true
            } catch (err) {
                const error = err instanceof Error ? err : new Error(String(err))
                onErrorRef.current?.(error)
                return false
            }
        },
        [isSupported, resetDuration]
    )

    return { copy, copied, isSupported }
}
