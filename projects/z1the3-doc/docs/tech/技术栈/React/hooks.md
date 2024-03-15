# hooks

当我们点击更改按钮，去进行页面更新时，react 还是会遍历初始化阶段构建的 hook 链表，然后按照顺序去取出对应的值，然而这时候 useState(name)的这个由于我们设置了一个 if 判断所以没有调用，这时取值顺序已经发生了变化。
总结
React 初始化阶段会构建一个 hook 链表，更新阶段会**根据 useState 的执行顺序去遍历链表取值**，如果前后执行顺序不一致，就会导致取出的值不对应，所以我们再写 hooks 的时候要确保 Hooks 在每次渲染的时候都保持同样的执行顺序

## useState

其实是 useReducer 的简化版，包装了了一层

```js
function useState(initState) {
  return useReducer(
    basicStateReducer,
    initState,
    (initialState) => initialState
  );
}
```

使用 useState 后第一次渲染——执行 mountState
// mountState 会创建一个新的 hook 并给 hook 的 baseState 和 queue 进行初始化，
// 返回初始的值 value 和 dispatch 函数 setValue, [value, setValue] 为一个 reducer

```js
function mountState<S>(
  initialState: (()=>S) | S)
): [S, Dispatch<BasicStateAction<S>>] {
  // 获取当前新创建fiber的memorizedState上的最新hook
  const hook = mountWorkInProgressHook()
  if(typeof initialState === 'function'){
    initialState = inititalState()
  }
  // 给state-hook绑定初始值
  hook.memorizedState = hook.baseState = initialState
  // stateHook上的后续维护在queue中,初始化queue
  const queue = (hook.queue={
    pending: null,
    dispatch: null,
    // 此处在useReducer中不同
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: (initialState: any)
  )

  // 基于dispatchAction
  const dispatch: Dispatch<BasicStateAction<S>> =
    (queue.dispatch
     = (dispatchAction.bind(null,currentlyRenderingFiber,queue):any)
     )



  return [hook.memorizedState,dispatch]

}

```

### 使用 useState 后续渲染——调用 updateState

直接返回 reducer, 相当于直接继承第一次渲染已经创建过的 reducer

```js
function updateState<S>(
  initialState: () => S | S
): [S, Dispatch<BasicStateAction<S>>] {
  return updateReducer(basicStateReducer, (initialState: any));
}

function basicStateReducer<S>(state: S, action: BasicStateAction<S>): S {
  return typeof action === "function" ? action(state) : action;
}
```

```js
// 因此以下两种写法是等价的
const [num1, setNum1] = useState({ count: 0 });
const [num2, setNum2] = useReducer(
  (state, action) => {
    return typeof action === "function" ? action(state) : action;
  },
  { count: 0 }
);
```

FiberNode 中创建 HookNode

```js
HookNode:{
  ...
  index: ; //链表中的索引
  memoizedSate: ; // 当前状态
}

FiberNode:{
  ...
}

function getCurrentHookValue() {
  const hook = resolveCurrentlyRenderingFiberWithHooks().memoizedState as Hook
  return hook.memoizedState
}

function resolveCurrentlyRenderingFiberWithHooks() {
  const currentlyRenderingFiber = resolveCurrentlyRenderingFiber()
  invariant(
  currentlyRenderingFiber !== null && currentlyRenderingFiber.memoizedState !== null,
   'Hooks can only be called inside the body of a function component.'
  )
  return currentlyRenderingFiber
}

function resolveCurrentlyRenderingFiber() {
 const fiber = workInProgress ?? currentlyRenderingFiber
 return fiber
}
```

## UseLayoutEffect

其函数签名与 useEffect 相同，但它会在 所有的 DOM 变更之后，同步(即阻塞式)地 调用 effect。

可以使用它来读取 DOM 布局并同步触发重渲染。

在浏览器执行绘制之前，useLayoutEffect 内部的更新计划将被同步刷新。

useLayoutEffect 与 componentDidMount、componentDidUpdate 的调用阶段是一样的。

useLayoutEffect 会阻塞浏览器主线程，里面的所有修改都会在下次渲染时体现。而 useEffect 会先让出主线程，将任务添加到事件队列中等候执行。（具体看 DevTools / Performance / Main 的 Task 就好，放大看一眼就明白了）

---

useEffect 会在浏览器渲染新内容后异步执行，也就是说当组件更新后，它并不会立即执行。 而 useLayoutEffect 会在 DOM 更新之后，浏览器绘制之前同步执行。

所以说，区别是一个为同步，一个为异步，你可以理解为 useLayoutEffect 与 useEffect 的执行时机都是在“DOM 更新之后和浏览器绘制之前”（它们会在 React 更新 DOM 完成之后立即执行，但在浏览器进行 DOM 重排和绘制之前）。这样可以确保在 React 更新 DOM 之后立即执行副作用代码，而不需要等到下一个渲染周期

不过，虽然 useLayoutEffect 是同步执行的，但它也是在 React 更新 DOM 完成之后才执行的。因此，在 useLayoutEffect 中访问 DOM 元素时，可以确保它们已经被更新。而在 useEffect 中访问 DOM 元素时，则需要注意它们可能还没有被更新，因为 useEffect 是异步执行的。如果需要在更新 DOM 后立即执行一些操作，应该使用 useLayoutEffect。否则，应该使用 useEffect。

---

在 mount 阶段 useEffect 对应 mountEffect, useLayoutEffet 对应 mountLayouEffect
两个函数都会直接返回 mountEffectImpl 函数，区别是参数有所不同

```js
mountEffectImpl(UpdateEffect | PassiveEffect, HookPassive, create, deps);

mountLayoutEffectImpl(UpdateEffect, HookLayout, create, deps);
```

mountEffectImpl 函数会把第一参数 fiberFlag 合并到 fiber.flag 来标志 fiber 节点的副作用类型，随后调用 pushEffect 函数生成一个 effect 并加到 hook.memoziedState 属性和 fiber.updateQueue.lastEffect 环型链表上

```js
function mountEffectImpl(fiberFlags, hookFlags, create, deps):void {
  const hook = mountWorkInProgressHook()
  const nextDeps = deps ===undefined? null: deps
  currentlyRenderingFiber.flags |= fiberFlag
  hook.memoizedState = pushEffect(
    HookHasEffect | hookFlags,
    create,
    undefined,
    nextDeps
  )
}

// lastEffect是环形链表
function pushEffect(tag, create, destory, deps){
  const effect: Effect = {
    tag,
    create,
    destory,
    deps,
    next:(null:any)
  }
  let componentUpdateQueue = null | FunctionComponentUpdateQueue =
    (currentlyRenderingFiber.updateQueue)
  if(componentUpdateQueue === null){
    componentUpdateQueue = createFunctionComponentUpdteQueue()
    currentlyRenderingFiber.updateQueue = (componentUpdateQueue:any)
    componentUpdateQueue.lastEffect = effect.next = effect
  } else {
    const firstEffect = lastEffect.next
    lastEffect.next = effect
    effect.next = firstEffect
    componentUpdateQueue.lastEffect = effect
  }
  return effect

}
```

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/1709693030086.jpg" width="1000"/>

## useContext

useContext 是最特殊的一种 hook，在 mount 和 update 阶段，dispatcher.useContext 都指向同一个函数 readContext，并没有阶段的区分, readContext 函数会和 useContext 并列出现在 dispatcher 上，用于读取 context 中最新的数据

```js
const HooksDispatcherOnMount/Update = {
  readContext,
  useCallback: mountCallback/UpdateCallback
 useContext: readContext,
  useEffect: mountEffect/updateEffect
}
```

useContext 是一个有副作用的函数，调用一次 useContext 会在 fiber 的 dependencies 属性上增加一个链表，在 Provider 组件的 value 更新时，会将当前渲染的 lanes 合并到使用了 context 的 fiber lanes 字段中
○ 1. 判断 Provider 组件需要更新（这里使用 Object.is 判断）
○ 2.若无需更新，直接进行子组件的调度
○ 3.若需要更新，则遍历子 fiber 树将使用了 context 的组件 fiber 的 lanes 属性与当前 Provider 组件的渲染 lanes 进行合并

### 实践

登录与注册(使用 useContext 管理用户登录状态)

1. 生成 AuthContext,使用 React.createContext 泛型传入接口，参数 undefined 即可创建
   并把 AuthContext 的 displayName 改为'AuthContext'

2. 准备一个高阶组件 AuthProvider，用来给 AuthContext 的低阶 provider 注入真正用到的 value

3. 在 Provider 内部
   每次使用前先 React.useContext(AuthContext)
   即可拿到 provider 提供的用来消费的数据
   Context.user 等等

```js


// 生成AuthContext
const AuthContext = React.createContext<{
          user: User | null
          register: (form: AuthForm) => Promise<void>
          login: (form: AuthForm) => Promise<void>
          logout: () => Promise<void>
      }| undefined>(undefined)
AuthContext.displayName = 'AuthContext'

// 高阶组件
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = (useState < User) | (null > null);

  // 等同于.then((data)=>setUser(data))
  const login = (form: AuthForm) => auth.login(form).then(setUser);
  const register = (form: AuthForm) => auth.register(form).then(setUser);
  const logout = () => auth.logout().then(() => setUser(null));

  // 页面加载时调用初始化
  useMount(() => {
    bootstrapUser().then(setUser);
  });
  // 利用该高阶provider给authContext注入value
  // 相当于外层多封装一次
  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

```tsx
// 封装useAuth hooks
function App() {
  const { user } = useAuth();
  return (
    <div className="APP">
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </div>
  );
}

// useAuth hooks
export const useAuth = () => {
  // 可以拿到该组件外面的context,由于里面用了hooks，所以该函数也要是hooks
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth必须在AuthProvider中");
  }
  return context;
};
```
