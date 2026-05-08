import { act, renderHook } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { useToggle } from '../index'

describe('useToggle', () => {
    test('default state', () => {
        const { result } = renderHook(() => useToggle(false, true))
        expect(result.current[0]).toBe(false)

        const { result: result2 } = renderHook(() => useToggle('高', '低'))
        expect(result2.current[0]).toBe('高')
    })

    test('toggle state', () => {
        const { result } = renderHook(() => useToggle('a', 'b'))
        expect(result.current[0]).toBe('a')
        act(() => {
            result.current[1]()
        })
        expect(result.current[0]).toBe('b')
        act(() => {
            result.current[1]()
        })
        expect(result.current[0]).toBe('a')
    })
})
