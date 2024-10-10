# useEffect 顺序（useLayoutEffect）

当输入值被改成 2 时
打印的还是 1，因为下一次 set 后，useEffect 在 useConsole(即组件渲染后)执行，此时已经打印出 ref 中的 1

如果换成 **useLayoutEffect**，则可以在组件渲染前执行，先将 ref 中的值换成 2，再打印 ref 中的 2

```js

const fn = ()=>{
  const [v, setV] = useState(1)
  const ref = useRef(v)
  useEffect(()=>{
    ref.current = v
  },[v])
  const useConsole = ()=>{
    console.log(ref.current)
  }
  useConsole()


  return <Input value={v} onchange={setV}>
}

```
