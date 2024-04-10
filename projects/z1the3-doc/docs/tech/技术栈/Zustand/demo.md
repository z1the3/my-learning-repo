# demo

```js
// 初始化 store
import create from "zustand";
const useStore = create((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: Math.max(state.count - 1, 0) })),
}));

const Count = () => {
  // 仅当 count 改变时重新渲染
  const count = useStore((state) => state.count);
  return <div>{count}</div>;
};

const Controls = () => {
  // 只会渲染一次，因为 increase 和 decrease 不会改变
  const increase = useStore((state) => state.increase);
  const decrease = useStore((state) => state.decrease);

  return (
    <div>
      <button onClick={increase}>+</button>
      <button onClick={decrease}>-</button>
    </div>
  );
};

const App = () => {
  return (
    <div>
      <Count />
      <Controls />
    </div>
  );
};
```

注意到 useStore 是需要传入一个 selector 的，否则 store 中任意一个状态的变更都将导致该组件重新渲染，API 十分精简

快速上手 Demo：https://codesandbox.io/s/getting-started-l7m7u
完整的 TodoApp Demo: https://codesandbox.io/s/todo-app-9lvkm
