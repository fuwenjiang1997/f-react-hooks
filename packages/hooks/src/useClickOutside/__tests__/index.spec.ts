import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { useClickOutside } from '../index'

describe('useClickOutside', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="outside">Outside</div><div id="container"><div id="target"></div></div>'
    })

    afterEach(() => {
        document.body.innerHTML = ''
    })

    test('should call callback when clicking outside the target', () => {
        const callback = vi.fn()
        const target = document.getElementById('target')!

        renderHook(() => useClickOutside(callback, { target }))

        // 点击外部元素
        act(() => {
            document.getElementById('outside')!.click()
        })

        expect(callback).toHaveBeenCalledTimes(1)
    })

    test('should not call callback when clicking inside the target', () => {
        const callback = vi.fn()
        const target = document.getElementById('target')!

        renderHook(() => useClickOutside(callback, { target }))

        // 点击内部元素
        act(() => {
            target.click()
        })

        expect(callback).not.toHaveBeenCalled()
    })

    test('should work with RefObject as target', () => {
        const callback = vi.fn()
        const target = document.getElementById('target')!
        const refObject = { current: target }

        renderHook(() => useClickOutside(callback, { target: refObject }))

        // 点击外部元素
        act(() => {
            document.getElementById('outside')!.click()
        })

        expect(callback).toHaveBeenCalledTimes(1)
    })

    test('should work with function as target', () => {
        const callback = vi.fn()
        const target = document.getElementById('target')!

        renderHook(() => useClickOutside(callback, { target: () => target }))

        // 点击外部元素
        act(() => {
            document.getElementById('outside')!.click()
        })

        expect(callback).toHaveBeenCalledTimes(1)
    })

    test('should support mousedown event', () => {
        const callback = vi.fn()
        const target = document.getElementById('target')!

        renderHook(() => useClickOutside(callback, { target, eventName: 'mousedown' }))

        // 触发 mousedown 事件
        act(() => {
            const event = new MouseEvent('mousedown', { bubbles: true })
            document.getElementById('outside')!.dispatchEvent(event)
        })

        expect(callback).toHaveBeenCalledTimes(1)
    })

    test('should support mouseup event', () => {
        const callback = vi.fn()
        const target = document.getElementById('target')!

        renderHook(() => useClickOutside(callback, { target, eventName: 'mouseup' }))

        // 触发 mouseup 事件
        act(() => {
            const event = new MouseEvent('mouseup', { bubbles: true })
            document.getElementById('outside')!.dispatchEvent(event)
        })

        expect(callback).toHaveBeenCalledTimes(1)
    })

    test('should cleanup event listener on unmount', () => {
        const callback = vi.fn()
        const target = document.getElementById('target')!

        const { unmount } = renderHook(() => useClickOutside(callback, { target }))

        // 卸载组件
        unmount()

        // 点击外部元素（应该不会触发回调）
        act(() => {
            document.getElementById('outside')!.click()
        })

        expect(callback).not.toHaveBeenCalled()
    })

    test('no options', () => {
        const callback = vi.fn()

        renderHook(() => useClickOutside(callback))

        // 点击外部元素（应该不会触发回调）
        act(() => {
            document.getElementById('outside')!.click()
        })

        expect(callback).not.toHaveBeenCalled()
    })

    test('no target', () => {
        const callback = vi.fn()

        renderHook(() => useClickOutside(callback, { target: null }))

        // 点击外部元素（应该不会触发回调）
        act(() => {
            document.getElementById('outside')!.click()
        })

        expect(callback).not.toHaveBeenCalled()
    })
})
