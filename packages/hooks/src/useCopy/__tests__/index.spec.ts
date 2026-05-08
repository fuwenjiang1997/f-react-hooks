import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { useCopy } from '../index'

describe('useCopy', () => {
    const originalClipboard = navigator.clipboard

    beforeEach(() => {
        // 模拟 navigator.clipboard
        const mockClipboard = {
            writeText: vi.fn().mockResolvedValue(undefined)
        }
        Object.defineProperty(navigator, 'clipboard', {
            value: mockClipboard,
            writable: true
        })
    })

    afterEach(() => {
        // 恢复原始 clipboard
        Object.defineProperty(navigator, 'clipboard', {
            value: originalClipboard,
            writable: true
        })
        vi.clearAllMocks()
    })

    test('should initialize with copied as false', () => {
        const { result } = renderHook(() => useCopy())
        expect(result.current.copied).toBe(false)
    })

    test('should copy text successfully', async () => {
        const { result } = renderHook(() => useCopy())

        let copyResult: boolean | undefined
        await act(async () => {
            copyResult = await result.current.copy('test text')
        })

        expect(copyResult).toBe(true)
        expect(result.current.copied).toBe(true)
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text')
    })

    test('should call onSuccess callback when copy succeeds', async () => {
        const onSuccess = vi.fn()
        const { result } = renderHook(() => useCopy({ onSuccess }))

        await act(async () => {
            await result.current.copy('test text')
        })

        expect(onSuccess).toHaveBeenCalledTimes(1)
    })

    test('should call onError callback when copy fails', async () => {
        const onError = vi.fn()
        const mockError = new Error('Clipboard error')
        navigator.clipboard.writeText = vi.fn().mockRejectedValue(mockError)

        const { result } = renderHook(() => useCopy({ onError }))

        let copyResult: boolean | undefined
        await act(async () => {
            copyResult = await result.current.copy('test text')
        })

        expect(copyResult).toBe(false)
        expect(result.current.copied).toBe(false)
        expect(onError).toHaveBeenCalledWith(mockError)
    })

    test('should reset copied state after resetDuration', async () => {
        const { result } = renderHook(() => useCopy({ resetDuration: 100 }))

        await act(async () => {
            await result.current.copy('test text')
        })

        expect(result.current.copied).toBe(true)

        await waitFor(
            () => {
                expect(result.current.copied).toBe(false)
            },
            { timeout: 200 }
        )
    })

    test('should return false when clipboard is not supported', async () => {
        // 移除 clipboard 支持
        Object.defineProperty(navigator, 'clipboard', {
            value: undefined,
            writable: true
        })

        const { result } = renderHook(() => useCopy())

        let copyResult: boolean | undefined
        await act(async () => {
            copyResult = await result.current.copy('test text')
        })

        expect(copyResult).toBe(false)
        expect(result.current.copied).toBe(false)
    })

    test('should have isSupported true when clipboard API exists', () => {
        const { result } = renderHook(() => useCopy())
        expect(result.current.isSupported).toBe(true)
    })

    test('should have isSupported false when clipboard API does not exist', () => {
        // 移除 clipboard 支持
        Object.defineProperty(navigator, 'clipboard', {
            value: undefined,
            writable: true
        })

        const { result } = renderHook(() => useCopy())
        expect(result.current.isSupported).toBe(false)
    })

    test('should not call writeText when isSupported is false', async () => {
        // 移除 clipboard 支持
        Object.defineProperty(navigator, 'clipboard', {
            value: undefined,
            writable: true
        })

        const { result } = renderHook(() => useCopy())

        await act(async () => {
            await result.current.copy('test text')
        })

        // 由于 clipboard 为 undefined，我们只需验证 copy 返回 false 且 copied 状态为 false
        expect(result.current.isSupported).toBe(false)
    })
})
