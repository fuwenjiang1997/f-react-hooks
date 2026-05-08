import { useState } from 'react'

export function useToggle<T, R>(defaultValue: T, reverseValue: R): [T | R, () => void] {
    const [value, setValue] = useState<T | R>(defaultValue)

    const toggle = () => {
        setValue(prevValue => (prevValue === defaultValue ? reverseValue : defaultValue))
    }
    return [value, toggle]
}
