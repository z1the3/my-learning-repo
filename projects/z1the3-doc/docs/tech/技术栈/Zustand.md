# Zustand

https://docs.pmnd.rs/zustand/getting-started/introduction

v5
一个小，快，可扩展的状态管理解决方案

它基于 hooks 的舒适 API,而不是样板代码和选项式

通过约定式来保证 精简，灵活

### 创建 store

```js
import { create } from "zustand";

// set
const useStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),
}));
```

### 与组件绑定

调用 hooks 可以拿到在 state 上拿到 get 和 set

```js
function BearCounter() {
  const bears = useStore((state) => state.bears);
  return <h1>{bears} around here...</h1>;
}

function Controls() {
  const increasePopulation = useStore((state) => state.increasePopulation);
  return <button onClick={increasePopulation}>one up</button>;
}
```

### 与 redux 对比

zustand 和 redux 都基于不可变的状态模型

但是 redux 需要把 app 包在 context provider 中

zustand 不需要

redux tookit 使用 immerjs 控制 draft state,

#### 渲染优化

都推荐使用 selectors 进行渲染优化

```js
// zustand 的 selector

const count = useCountStore((state) => state.count);
const increment = useCountStore((state) => state.increment);
const decrement = useCountStore((state) => state.decrement);

// redux 的 selector
const count = useSelector((state) => state.count);
```

### 更新 state

`（新值）=》set(()=>({原 key: 新对象}))`

```ts
const usePersonStore = create<State & Action>((set) => ({
  firstName: "",
  lastName: "",
  updateFirstName: (firstName) => set(() => ({ firstName: firstName })),
  updateLastName: (lastName) => set(() => ({ lastName: lastName })),
}));
```

### 深层对象修改

```js
type State = {
  deep: {
    nested: {
      obj: { count: number },
    },
  },
};
```

```js
// 一般做法
//不可变数据！！
 normalInc: () =>
    set((state) => ({
      deep: {
        ...state.deep,
        nested: {
          ...state.deep.nested,
          obj: {
            ...state.deep.nested.obj,
            count: state.deep.nested.obj.count + 1
          }
        }
      }
    })),


// 使用immer
  immerInc: () =>
    set(produce((state: State) => { ++state.deep.nested.obj.count })),

// 还有使用optics-ts和ramda的方案
```

### 不可变 state 和 merging

set 能自动进行单层的合并

所以不需要...state

```js
set((state) => ({ count: state.count + 1 }));
```

但是多层(除了第一层)都需要

```js
import { create } from "zustand";

const useCountStore = create((set) => ({
  nested: { count: 0 },
  inc: () =>
    set((state) => ({
      nested: { ...state.nested, count: state.nested.count + 1 },
    })),
}));
```

为了禁止首层自动合并
可以把 set 的第二个参数改为 true

```js
set((state) => newState, true);
```

### 自动生成 selectors

创建下面的函数 createSelectors

```js
import { StoreApi, UseBoundStore } from 'zustand'

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  let store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (let k of Object.keys(store.getState())) {
    ;(store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
  }

  return store
}

```

```js
//假设store是

interface BearState {
  bears: number
  increase: (by: number) => void
  increment: () => void
}

const useBearStoreBase = create<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
  increment: () => set((state) => ({ bears: state.bears + 1 })),
}))



使用store时，自动创建selectors

const useBearStore = createSelectors(useBearStoreBase)


// get the property
const bears = useBearStore.use.bears()

// get the action
const increment = useBearStore.use.increment()
```

### actions 与 store 分离的实践

```js
export const useBoundStore = create(() => ({
  count: 0,
  text: "hello",
}));

export const inc = () =>
  useBoundStore.setState((state) => ({ count: state.count + 1 }));

export const setText = (text) => useBoundStore.setState({ text });
```

在 module 层面定义 action(inc)

与 store 分离

#### 优点

- 不需要通过 hook 调用 action
  (但是其实也直接调用 updateXXX 方法即可)
- 便于代码切割
