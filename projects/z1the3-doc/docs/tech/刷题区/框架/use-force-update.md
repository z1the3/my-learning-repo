# useForceUpdate

用于强制更新组件，通常在使用 useRef 管理可变状态，但又需要重渲染时使用。

```js
function useForceUpdate() {
  // 这个写法比useState更简单
  const [, forceUpdate] = useReducer((v) => v + 1, 0);
  return forceUpdate;
}

function Demo() {
  const counter = useRef(0);
  const forceUpdate = useForceUpdate();
  const handleClick = () => {
    counter.current++;
    forceUpdate();
  };
  return <div onClick={handleClick}>{counter.current}</div>;
}
```
