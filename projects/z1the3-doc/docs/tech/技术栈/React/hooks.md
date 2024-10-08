# hooks

当我们点击更改按钮，去进行页面更新时，react 还是会遍历初始化阶段构建的 hook 链表，然后按照顺序去取出对应的值，然而这时候 useState(name)的这个由于我们设置了一个 if 判断所以没有调用，这时取值顺序已经发生了变化。
总结
React 初始化阶段会构建一个 hook 链表，更新阶段会**根据 useState 的执行顺序去遍历链表取值**，如果前后执行顺序不一致，就会导致取出的值不对应，所以我们再写 hooks 的时候要确保 Hooks 在每次渲染的时候都保持同样的执行顺序

一个 useState 是一个 hooks node

## 为什么需要 hooks

函数组件比起类组件少了很多东西，比如生命周期、对 state 的管理等。这就给函数组件的使用带来了非常多的局限性，导致我们并不能使用函数这种形式，写出一个真正的全功能的组件。而 React-Hooks 的出现，就是为了帮助函数组件补齐这些（相对于类组件来说）缺失的能力。

同时它还不强制你全都要，而是允许你自由地选择和使用你需要的那些能力，然后将这些能力以 Hook（钩子）的形式“钩”进你的组件里

**有状态但不需要编写 class**

## 不要在循环，条件或嵌套函数中调用 hooks

由于函数组件内的 hook 是基于链表进行注册的，并在组件初始化的时候，此链表顺序已经固定，如下所示：

```js
Hook1 ⟶️ Hook2 ⟶️ Hook3 ...⟶️... HookN ⟶️ null
```

假设 Hook2 处于判断条件之中，一旦 condition 条件修改，执行的顺序就会发生改变

```js
if (condition) {
  useHook2();
}

当condition不满足时，再次渲染，执行各个useState时，对应的执行顺序应该为：Hook1 ⟶️ Hook3 ...⟶️... HookN ⟶️ null

但是我们已有的顺序不满足

```

react 依然会使用之前的链表进行数据更新，Hook 的调用会更改 Hook2 指向的数据信息，因此产生 BUG。

https://zh-hans.legacy.reactjs.org/docs/hooks-rules.html#explanation

见 react 文档

## React Hooks 如何保存状态

React 官方文档中有提到，React Hooks 保存状态的位置其实与类组件的一致；

- 两者的状态值都被挂载在组件实例对象 FiberNode 的 memoizedState 属性中。

- 两者保存状态值的数据结构完全不同；

- 类组件是直接把 state 属性中挂载的这个开发者自定义的对象给保存到 memoizedState 属性中；

- 而 React Hooks 是用链表来保存状态的，memoizedState 属性保存的实际上是这个链表的头指针。

memoizedState，这个字段是不是很眼熟，上面关于 hook 的定义里面，也有这个字段，是的，fiber 数据结构中，也

有这个字段，在 fiber 中，memoizedState 的意义就是指向属于这个 fiber 的 hooks 队列的首个 hook，而

hook 中的 memoizedState 则指的是当前 hook 缓存的 state 值

官方文档一直强调 React Hooks 的调用只能放在函数组件/自定义 Hooks 函数体的顶层，所以我们能通过 Hooks 调用的顺序来与实际保存的数据结构来关联：

```js
// hooks基本结构---react-reconciler的 ReactFiberHooks.old.js下

export type Hook = {
  memorizedState: any,
  baseState: any,
  baseQueue: Update<any,any> | null
  queue: any,
  next: Hook | null
}

其中state字段与状态与关
queue与状态更新有关
next是指向当前fiber的下一个hook的指针


```

- hook 在创建时会将第一个 hook 挂载到函数组件 fiber 的 memorizedState 字段上，

- 完成 fiber 节点的创建后，memorizedState 字段是一个链表结构，每一个节点都是 hook 的实例

- 在不同阶段 useHook 实际调用的函数不同，第一次构建 fiber 时会调用 mountState 函数，以后每次更新都会调用 updateState 函数，通过这不同阶段改变 ReactCurrentDispatcher.current 的引用来使 useHook 函数这不同阶段调用不同函数

- 把 ReactCurrentDispatcher.current 看做一个全局唯一的变量（存有 App 组件的 fiber），其上面有名为 useState 的键名（其他 hook 也有），其具体指向 mountState 和 updateState

### 特例

- 除了 useContext 和 useDebugValue 不会创建 hook 结构之外其他 hook 都会创造 hook 结构，并按顺序组成链表

- useContext 有其他方式实现，但是官方认为是 hook

- useDebugValue 实现在 react-devtools 中

## React hooks 更新状态

### state

当我们在每次调用 dispatcher 时，并不会立刻对状态值进行修改（对的，状态值的更新是异步的），而是创建一条修改操作——在对应 Hook 对象的 queue 属性挂载的链表上加一个新节点

在下次执行函数组件，再次调用 useState 时， React 才会根据每个 Hook 上挂载的更新操作链表来计算最新的状态值

为什么要把更新操作都保存起来呢，只保存最新的一次更新操作不就行了吗？

```js
const [name, setName] = useState("");
setName((name) => name + "a");
setName((name) => name + "b");
setName((name) => name + "c");

// 下次执行时就可以得到 name 的最新状态值为'abc'啦
```

### useState

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
: [S, Dispatch<BasicStateAction<S>>] {
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
  }

  // 基于dispatchAction
  const dispatch: Dispatch<BasicStateAction<S>> =
    (queue.dispatch
     = (dispatchAction.bind(null,currentlyRenderingFiber,queue):any)
     )



  return [hook.memorizedState,dispatch]

  )
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

### effect

useEffect 是以链表的形式挂载在 FiberNode.updateQueue 中。

链表节点的数据结构为：

```js
const effect: Effect = {
  tag, // 用来标识依赖项有没有变动
  create, // 用户使用useEffect传入的函数体
  destroy, // 上述函数体执行后生成的用来清除副作用的函数
  deps, // 依赖项列表
  next: (null: any),
};
```

**组件完成渲染后，遍历链表执行。**

#### update 阶段

update 阶段：updateEffect

同样在依次调用 useEffect 语句时，判断此时传入的依赖列表，与链表节点 Effect.deps 中保存的是否一致（基本数据类型的值是否相同；对象的引用是否相同），如果一致，则在 Effect.tag 标记上 NoHookEffect

#### 执行阶段

在每次组件渲染完成后，就会进入 useEffect 的执行阶段：function commitHookEffectList()：

遍历链表
如果遇到 Effect.tag 被标记上 NoHookEffect 的节点则跳过。

如果 Effect.destroy 为函数类型，则需要执行该清除副作用的函数（至于这 Effect.destroy 是从哪里来的，下面马上说到）

执行 Effect.create，并将执行结果保存到 Effect.destroy（如果开发者没有配置 return，那得到的自然是 undefined 了，也就是说，开发者认为对于当前 useEffect 代码段，不存在需要清除的副作用）；

注意由于闭包的缘故，Effect.destroy 实际上可以访问到本次 Effect.create 函数作用域内的变量。

我们重点请注意到：是先清除上一轮的副作用，然后再执行本轮的 effect 的。

> https://juejin.cn/post/6891577820821061646#heading-6

> https://juejin.cn/post/6844904205371588615

## useImperativeHandle

useImperativeHandle 可以让你在使用 ref 时自定义暴露给父组件的实例值（典型的应用是向上传递 func）。应当尽量避免使用这样的命令式代码。useImperativeHandle 需要与 forwardRef 配合使用：

forwardRef 负责提供组件参数的 ref 以及 useImperativeHandle 对 ref 引用的回调！

```js
// *
function FancyInput(props, ref) {
  const inputRef = useRef();
  // *
  useImperativeHandle(ref, () => ({
    //最终还是暴露原生标签上的api
    focus: () => inputRef.current.focus(),
  }));
  return <input ref={inputRef} />;
}
// * 传递
FancyInput = forwardRef(FancyInput);

function Foo() {
  const fancyInputRef = useRef(null);
  return (
    <>
      <span onClick={() => fancyInputRef.current.focus()}></span>
      // fancyInputRef 拿到了被传递出来的原生标签上的api
      <FancyInput ref={fancyInputRef} />
    </>
  );
}
```

## useMemo & useCallback

useMemo & useCallback
在 update 阶段 useCallback 会去比较 deps 依赖数组
比较的规则也是使用 areHookInputsEqual 函数
如果前后两个依赖数组一致就返回缓存的值
没有则返回新的值，也就是参数的值

useMemo 在 update 阶段也是一样的逻辑，只不过返回值为函数的返回值，而不是函数

## UseLayoutEffect

其函数签名与 useEffect 相同，但它会在 所有的 DOM 变更之后，同步(即阻塞式)地 调用 effect。

可以使用它来读取 DOM 布局并同步触发重渲染。

在浏览器执行绘制之前，useLayoutEffect 内部的更新计划将被同步刷新。

useLayoutEffect 与 componentDidMount、componentDidUpdate 的调用阶段是一样的。

useLayoutEffect 会阻塞浏览器主线程，里面的所有修改都会在下次渲染时体现。而 useEffect 会先让出主线程，将任务添加到事件队列中等候执行。（具体看 DevTools / Performance / Main 的 Task 就好，放大看一眼就明白了）

---

useEffect 会在浏览器渲染新内容后异步执行，也就是说当组件更新后，它并不会立即执行。 而 useLayoutEffect 会在**DOM 更新之后，浏览器绘制之前**同步执行。

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

## useRef

```js
const dom = useRef(0);
console.log(`r.current:${dom.current}`);
```

useRef 返回一个可变的 ref 对象，其 .current 属性被初始化为传入的参数。
返回的 ref 对象在组件的整个生命周期内保持不变。
这个 ref 对象只有一个 current 属性，将一个值保存在内，它的地址一直不会变。

1. 在 React 中，可以通过 ref 属性引用 DOM 元素或组件实例，以便在组件内部直接访问这些元素或实例，而无需使用选择器或其他方式来查找它们。
   ● 对于 input 标签，通过在组件中使用 ref 属性引用该元素，可以获取该元素的值或操作该元素的属性和方法。
   ● 例如，可以使用 ref.current.value 获取 input 元素中当前的文本值，并使用 ref.current.focus() 方法将焦点设置到该元素上。

2. useRef 可以存储和更新组件内部的变量，因为 current 属性的值发生变化时，不会跟触发组件重新渲染，可以起到缓存数据的作用。
   ● useState 或者 useReducer 虽然也可以保存当前数据源，但是会触发组件重新渲染，如果在函数组件内部声明变量则下一次更新也会重置。
   ● 因此可以用它来存储那些不需要触发重新渲染的状态，例如计时器的 ID：
   ● intervalIdRef.current 可以持久存储计时器的 ID，并在组件卸载时清除该计时器。

### 实现原理

```js
function useRef(initialValue) {
  return createRef().current;
}
```

该函数接收一个初始值 initialValue，然后调用 createRef()函数返回一个对象，最后返回该对象的 current 属性。
之所以经过两次函数调用，而不是直接返回一个对象的 current 属性，是由于 createRef()返回的对象只有在组件渲染时才会被创建，在每次重新渲染时都会创建一个新的对象。
因此，需要在函数内部使用 useRef 时，每次都要调用 createRef()函数来创建一个新的 ref 对象，从而实现正确的数据引用。

在 React 源码中，useRef 函数的内部实现基于 useMemo 函数和函数组件的执行顺序。
useMemo 函数的作用是在渲染中缓存值，避免每次渲染都重新计算，从而提高性能。
useRef 函数的内部实现就是创建一个 useMemo 函数，该函数利用了函数组件的执行顺序，在每次组件重新渲染时，始终返回同一个 ref 对象，从而实现了对相同的引用的保留。(尽管使用了 createRef 创建新的 ref，但是通过 useMemo 缓存住了？)
总的来说，useRef 的实现原理是基于函数式编程思想和 React 的内部机制，通过 createRef()函数创建一个
ref 对象，利用 useMemo 函数缓存引用，从而实现对 DOM 元素引用、临时状态、数据缓存等的管理。

## useRef 和 useState 区别

- 变量是决定视图层渲染的，使用 state
- 否则用 ref

组件重新渲染后，状态才会完成更新，和组件本体绑定
ref 与状态不同，存储在引用或引用中的数据或值保持不变，即使在组件重新渲染之后也是如此。因此，ref 引用不会受到组件渲染影响，但状态会。

- useState 返回 2 个属性或一个数组。一个是值或状态，另一个是更新状态的函数。
- 相比之下， useRef 只返回一个值，即实际存储的数据。

- useRef 中当参考值发生变化时，无需刷新或重新渲染即可更新。
- 但是在 useState 中，组件必须再次渲染以更新状态或其值。

refs 在获取用户输入、DOM 元素属性和存储不断更新的值时很有用。 但是，如果您要存储组件相关信息或在组件中使用方法，states 则是最佳选择。

##

> 引用
> https://www.yuque.com/magicalboy/tgwnrk/foczzri8g68hzevz#QYHw2 > https://blog.csdn.net/qq_44864082/article/details/126335832
