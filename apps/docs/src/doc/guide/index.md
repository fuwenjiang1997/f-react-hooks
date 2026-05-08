# 快速开始

## 导入依赖

```tsx
import { useRequest } from '@f-react-hooks/hooks'
```

## 开发计划

- [x] userToggle
- [x] useFetch
- [x] useCopy
- [x] useClickOutside
- [ ] useDebounce
- [ ] useThrottle
- [ ] useWindowSize
- [ ] useScroll
- [ ] useResizeObserver
- [ ] useLocalStorage
- [ ] useSessionStorage
- [ ] useCookie
- [ ] useWebSocket

## 开始使用

```tsx
import { useRequest } from '@f-react-hooks/hooks'

function App() {
    const { data, run } = useRequest(() => fetch('/api/data'))

    return (
        <div>
            <button onClick={() => run()}>获取数据</button>
            {data && <div>{data}</div>}
        </div>
    )
}
```
