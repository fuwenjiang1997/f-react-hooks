import { useEffect, useRef } from 'react'

export interface UseClickOutsideOptions {
    eventName?: 'click' | 'mousedown' | 'mouseup'
    target?: (() => HTMLElement | null) | HTMLElement | null | React.RefObject<HTMLElement> | React.RefObject<null>
    capture?: boolean
}

export function useClickOutside(callback: (event: MouseEvent) => void, options: UseClickOutsideOptions = {}) {
    const { eventName = 'click', target, capture = false } = options
    const callbackRef = useRef(callback)

    // 更新 callback 引用，确保始终使用最新的 callback
    callbackRef.current = callback

    useEffect(() => {
        if (!target) {
            return () => {}
        }

        const handler = (event: MouseEvent) => {
            const targetElement = (() => {
                if (typeof target === 'function') {
                    return target()
                }
                if (target && 'current' in target) {
                    return target.current
                }
                return target
            })()

            // 如果有 target，检查是否点击在 target 内部
            if (targetElement && targetElement.contains(event.target as Node)) {
                return
            }

            callbackRef.current(event)
        }

        document.addEventListener(eventName, handler, capture)

        return () => {
            document.removeEventListener(eventName, handler, capture)
        }
    }, [eventName, target, capture])
}
