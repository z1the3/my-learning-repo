# React Query

官方项目：https://github.com/TanStack/query

官方文档：https://tanstack.com/query/latest/docs/framework/react/overview

和主流上层封装库比较（包括 swr）：https://tanstack.com/query/latest/docs/framework/react/comparison?from=reactQueryV3

## swr 的问题

在 swr 中，使用非常简单，一个简单的 demo 如下：

```js
import { useState } from 'react';
import useSWR from 'swr'

function App() {

  const [status, setStatus] = useState(false)

  const request = (status, stringKey, numberKey) => {
    // 为了模拟实际中 api 的时长随机性，随机 1.5s 或 3s 后得到响应
    const time = Math.random() > .5 ? 3000 : 1500
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(time)
      }, time)
    })
  }

  const { data, error } = useSWR([status, 'ss', 2], request)

  return (
    <>
      {!data && <div>loading...</div>}
      {error && <div>error...</div>}
      {data && <div>{data}</div>}
      <button onClick={() => {
        // 通过改变 swr 的唯一 key，也就是 [status, 'ss', 2] 中的 status
        // 实现重新触发 api 请求的效果
        setStatus((pre) => !pre)
      }}>click</button></>
  );
}


```

下面来细数一下：

### loading 态不健壮

首先就是 loading 态，swr 我们只能用 data 的有无去判断是否在 loading，或者单独维护一个初始为 true 的

 state 去表示 loading，在 swr 的 onSuccess 处给他置为 false。

但我们要一个初始 data 的话，使用 !data 直接不攻自破，我们只能多次切换加载数据，在每次切换我都要手动将

state 置为 true，这也太麻烦了，不友好。

### 请求函数收参不健壮

我们在请求函数 request 中，如果 useSWR 的唯一标识是数组，那么传入请求函数参数的顺序是被解构后的！

```js
// 唯一标识 [status, 'ss', 2]
  const { data, error } = useSWR([status, 'ss', 2], request)
  // ↓ 这里传入是被解构后的唯一标识
  const request = (status, stringKey, numberKey) => {}
  
  request函数参数必须把标识中的每一个item都占位了，
  如果不占，则只能用arguments[x]
  
  还需要根据restful语法自己设计stringKey

```

### 数据一致性场景中主动性差

特别是在筛选查询时，我们的 api 请求时长往往是不同的，当用户在 A 筛选条件下查询了数据，api 还未返回时，又

进行了筛选条件 B 的查询，此时又执行筛选条件 C 的查询，那么如此往复，每次切换都面临着预期显示数据和真实显示

数据不一致的问题。

因为界面上实际显示的数据只是最晚那一次 api 到达的数据，所以使用 axios 产生了数据不一致问题。

axios 确实有 cancel 的 token 方法，可以取消请求，umi-request 也有高阶的封装，但是每个方法都给我一个

cancel 方法这成本也太高了，在非昂贵成本的查询下，有没有一种忽略之前查询的方法？

答案是有的， 对一个 useSWR 来说，总是会忽略之前的请求，采用最新一次请求的结果，这是 swr 做的好的地方，可

是对于昂贵请求，swr 不能真正的取消请求。

其次，什么时候取消，什么时候又再去获取，在 swr 中要主动获取，一律要通过唯一 key 去控制，唯一 key 意味着

state，增加一大堆 useState 是非常不友好的。

其实 swr 的功能实在是太弱小了，现在开始我们有更强大的选择。

## 使用 react-query

### 安装

```
yarn add react-query
```

### 配置全局实例

在 react 根节点渲染处如此配置 react-query 的全局实例：

```js
import { QueryClientProvider, QueryClient } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

// ↓ 初始化全局实例，通过该全局实例可以传入默认配置，这里本文不做详述
const queryClient = new QueryClient()

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* ↓ 主应用节点 */}
      <App />
      {/* ↓ 可视化开发工具 */}
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

```

## 可视化 Devtools

在上文我们配置了一个 react-query 可视化开发工具，他可以在我们屏幕指定的位置显示 react-query 的图标，打

开面板后可查看所有请求的状态和请求情况：

对于每个请求的 key、新鲜度、是否过期，以及每个请求的配置，都可以在此处查看，十分强大。该工具不会被打包到生

产环境，可以放心使用。

官方介绍：https://tanstack.com/query/latest/docs/framework/react/devtools?from=reactQueryV3

## 基础入门

看一个 react-query 的简单 demo：

```js
import { useState } from 'react';
import { useQuery } from 'react-query'

function App() {

  const [status, setStatus] = useState(false)

  const request = ({ queryKey }) => {
    // 为了模拟实际中 api 的时长随机性，随机 1.5s 或 3s 后得到响应
    const time = Math.random() > .5 ? 3000 : 1500
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(time)
      }, time)
    })
  }

   const {
     isLoading,
     isFetching,
     isError,
     data,
     refetch
   } = useQuery([status, 'ss', 2], request)
   
  return (
    <>
      {isLoading && <div>Loading...</div>}
      {isFetching && <div>Fetching...</div>}
      {isError && <div>Error</div>}
      {data && <div>{data}</div>}
      <button onClick={() =>{
        // 同 swr，可以通过改变 key 重新获取数据
        setStatus((pre) => !pre)
      }}>click</button></>
  );
}
```

### 健全的 loading 态

真正给出 loading 参数：isLoading 和 isFetching，两者的区别是，isLoading 是在 “硬” 加载时才会为

true，isFetching 是在每次请求时为 true，那么 isFetching 我们能通俗易懂的理解，就是每次请求时当做

loading 嘛。

那什么是 isLoading 的 “硬” 加载？其实 “硬” 加载就是**没有缓存时的加载**

了解了 react-query 缓存机制，我们就明白了，原来 isLoading 只会在第一次加载页面挂载组件，此时没有

 cache 时为 true，之后每次再去获取新数据，也不会变为 true。

#### loaidng 态怎么用

所以 isLoading 的使用场景比较适合第一次加载页面，在为 true 时显示加载页，当有了第一次数据，后续一致使用

isFetching 去给组件显示 loading 态。当然，在第一次没有缓存的 “硬” 加载时，isFetching 也是为 true

的，我们没有加载页的场景下，只使用 isFetching 作为 loading 态就足够了。

### 健壮的请求参数

和 swr 不同，

react-query 将传入的 key 一律放置到了请求函数的第一个参数对象的 queryKey 键上，也就是：

```js
  // 此时 key 标识为 [status, 'ss', 2]
  useQuery([status, 'ss', 2], request)
  // 传入到请求函数的第一个参数对象中的 queryKey 键上
  // 也就是 queryKey 就为 [status, 'ss', 2]
  const request = ({ queryKey }) => {}
```

这就比较友好了，一次性拿到所以 key 值，那问题就来了，为什么还要放到 queryKey 中，因为 react-query 给请

求函数第一个参数对象中还放置了一个键叫 pageParam ，用于无限分页查询

### 请求掌握能动性强（取消请求）

上文中提到了 swr 对每个请求的掌控性不强，在这方面，react-query 通过一个全局实例，来实现了主动对任意 key 的请求操作。

我们可以通过 useQueryClient 方法得到全局 QueryClient 实例，在该实例上有很多主动 api，可以充分管理整个 react-query 的请求。

提到 swr 想要主动重请求，要设立新的 state ，在 react-query 如何解决？

看如上代码我们发现通过引入全局实例 queryClient 并在点击按钮时调用了 refetchQueries 方法重新加载了指定 key 的请求数据，等等，为啥我的 key 是 [status, 'ss', 2] 你却使用了 status ？
默认情况下，refetchQueries 传参会模糊匹配，并重新获取所有符合匹配的 api，这在多个请求中非常有用

匹配规范可见文档

如果想精确匹配，可传入第二个参数 options 对象指定 exact 为 true

```js
 queryClient.refetchQueries([status, 'ss', 2], { exact: true })
```

再度简化：对于单个 react-query 查询，他自带一个叫 refetch 的返回函数，在任意地方你想重新获取数据就可以重新获取：

```js
  const {
     // ......
     refetch
   } = useQuery([status, 'ss', 2], request)

  return (
    <>
      // ......
      <button onClick={() =>{
        // ↓ 直接调用 refetch 来重新获取
        refetch()
      }}>click</button></>
  );

```

在数据一致性问题上，swr 和 react-query 都是默认忽略旧的请求，最终得到的 data 都是最新一次请求的结果，保

证数据的一致性，可 swr 有昂贵请求不能取消的问题，而 react-query 在全局实例上提供了自定义 cancel 方法

```js
  const queryClient = useQueryClient()

  return (
    <>
      // ......
      <button onClick={() =>{
        // 取消指定 key 的请求
        queryClient.cancelQueries(key)
      }}>click</button></>
  );
```

仅仅在上层生效

这个 cancelQueries 方法只能阻断 isFetching 等 loading 态

不能侵入 axios ，因为 axios 的取消请求只能用 cancel token ，所以你要主动给 axios 返回的 promise 上

挂载一个 cancel 方法，届时 react-query 才会去调用这个 promise 上的 cancel 真正取消请求

```js
 import { CancelToken } from 'axios'
 const query = useQuery('todos', () => {
   // Create a new CancelToken source for this request
   const source = CancelToken.source()
 
   const promise = axios.get('/todos', {
     // Pass the source token to your request
     cancelToken: source.token,
   })
 
   // Cancel the request if React Query calls the `promise.cancel` method
   promise.cancel = () => {
     source.cancel('Query was cancelled by React Query')
   }
 
 // 这里返回请求的promise
 // react query会自动使用上面的cancel属性
   return promise
 })


```

### 控制缓存

终于到了 react-query 最精髓的部分，在上文介绍 loading 态的 isLoading 和 isFetching 区别时，我们已经介绍了在 react-query 中缓存的概念，那如何应用缓存？

在 useQuery 单次查询中，可以配置第三个 options 选项，通过两个选项可以将缓存控制到出神入化

```js
    useQuery([status, 'ss', 2], request, {
       // 不新鲜的时间
       staleTime: 5000,
       // 缓存时间
       cacheTime: 10000
   })

```

React Query在进行“陈旧”数据的处理方式，如果一条请求被标记为“陈旧”而不是“过期”，那么在 hooks 中，React Query会第一时间将旧的数据返回给前端，与此同时再向服务器发送网络请求，当网络请求的结果回来后，通过hooks 再一次更新数据。
对于标记的“陈旧”与“过期”的概念，就是在请求的时候定义的“slateTime” 与 “cacheTime”，区别就在于如果之前请求过，是否要第一时间返回到前端，然后二次更新最新的数据，还是选择直接等着网络的返回。可以看得出非常精确了

- staleTime ：可以理解为数据保质期，在保质期内遇到同 key 的请求，不会去再次获取数据，也就是从缓存中取，瞬间切换展示，isFetching 也一直为 false。（不请求，直接用）

- cacheTime ：数据在内存中的缓存时间，当数据在缓存期时，会按照 key 进行存储，下次遇到同 key 获取数据，会直接从缓存中取，瞬间展示，但是否后台请求新数据，要看 staleTime 的配置，当不配置 staleTime 时，遇到同 key 获取数据，虽然瞬间切换至缓存数据展示，但此时后台获取新数据，待获取完毕后瞬间切换为新数据。（就算请求到了，也可能不会用，stale说能用了才会用）

如果配置了staleTime 则会等到staleTime过期,即isFetching为true，才更新cache

乍一看其实配置了 cacheTime 虽然会复用缓存但当新数据请求到了会瞬间变为新数据对用户不太友好，所以需要一定的

过渡动画或者 loading 态，因为此时在后台请求，**所以 isFetching 为 true，用该标识去展示 loading 态可**

所以最好的情况是 staleTime 和 cacheTime 一起使用，因为不过新鲜期，数据使用缓存，不会后台去请求导致显示突变，一旦过了新鲜期，下次请求直接就会展示 isFetching 的 loading 态。

比如设置为 10s 缓存，5s 的保质期，那么在 5s 内用户获取同 key 数据走缓存，过了 5s 重新请求展示 loading 态，但是由于存在缓存10s，**所以 loading 时用户还可以看到上次的缓存结果**，假如新数据到了没有变化，loading 关闭后，数据不会改变，体验是很好的，一旦请求失败，也能兜底上次的数据。

此外，还可以通过全局实例上的 getQueryCache 方法得到所有缓存。

对得到数据我可以直接在 useQuery 的 select 的选项中处理最终得到的 data ：

```js
 useQuery([status, 'ss', 2], request, {
    // ↓ 注意这里取消聚焦重刷新数据是常用手法，在 swr 里经常使用
    refetchOnWindowFocus: false,
    // ↓ 对响应数据自定义处理
    select: (res) => {
      // 处理 res ...
      return res
    }
  })

```

### 主动 api

react-query 的主动性是非常强大的，更多介绍详见：

#### useQuery

https://tanstack.com/query/latest/docs/framework/react/reference/useQuery

- 状态
  - isLoading 或者 status === 'loading'  查询没有数据，正在获取结果中
  - isError 或者 status === 'error'  查询遇到一个错误
  - isSuccess 或者 status === 'success' 查询成功，并且数据可用
  - isIdle  或者 status === 'idle' 查询处于禁用状态（稍后将进一步讲解有关内容）
- 除了这些主要状态之外，取决于具体查询的状态，还有更多信息可用：
  - error 如果查询处于isError状态，则可以通过error属性获取该错误
  - data 如果查询处于success状态，则可以通过data属性获得数据
  - isFetching 在其他任何状态下，如果查询在获取中（包括后台重新获取数据），则isFetching 为 true

- 一些配置参数
  - staleTime 重新获取数据的时间间隔 默认 0，可以理解为数据保质期，保质期内同 key 请求直接从缓存获取
  - cacheTime 数据缓存时间 默认 1000 *60* 5 ms （5分钟），非活动查询会在这个时间后被垃圾收集
  - retry 失败重试次数，默认 3次
  - refetchOnWindowFocus 窗口重新获得焦点时重新获取数据 默认 false
  - refetchOnReconnect 网络重新链接
  - refetchOnMount 实例重新挂载
  - enabled 如果为 false，useQuery 不会触发，需要使用其返回的“refetch”来触发操作

##### 页面可见变化重新请求
>
> refetchOnWindowFocus 页面切到后台或者离开页面再次进入时，重新发送请求，更新页面数据

##### 轮询查询
>
> 配置字段 refetchInterval，指定接口的刷新频率进行轮询
看一下 auto-refetching 例子 https://react-query.tanstack.com/examples/auto-refetching

```js
const { status, data, error, isFetching } = useQuery(
    'todos',
    async () => {
      const res = await axios.get('/api/data')
      return res.data
    },
    {
      // Refetch the data every second
      refetchInterval: intervalMs,
    }
  )
```

##### 依赖查询
>
> enabled 本次查询取决于先前的查询结果，使用 enabled 选项告诉查询何时可以运行

```js
function usePost(postId) {
  return useQuery(["post", postId], () => getPostById(postId), {
    // 直到`postId`存在，查询才会被执行
    enabled: !!postId,
  });
}
```

##### 初始化查询数据
>
> 使用 initialData 预先填充缓存，可支持固定初始化数据 or 函数获取

```js
const charactersQuery = useQuery(
    'characters',
    {
      initialData: {
        results: [
          { id: 1, name: 'Morty Smith' },
          { id: 2, name: 'Summer Smith' }
        ]
      }
    }
 )
```

- QueryClient
https://tanstack.com/query/latest/docs/reference/QueryClient

##### 预取数据
>
> 可以使用prefetchQuery方法预取要放入缓存的查询结果

```js
// 预加载数据
await queryClient.prefetchQuery(
    ['character', char.id],
    () => getCharacter(char.id),
    {
      staleTime: 10 * 1000, // only prefetch if older than 10 seconds
    }
)
// 获取数据
queryClient.getQueryData(['character', char.id])

```

### 更多场景支持

仅仅主动性强，这就结束了吗，react-query 的支持还更加强大：

#### useQueries ：同时进行并行可变数量的查询
>
> useQueries 接受一组作为查询配置的对象，并以数组形式返回查询的结果

```js
function App({ users }) {
   const userQueries = useQueries(
     users.map(user => {
       return {
         queryKey: ['user', user.id],
         queryFn: () => fetchUserById(user.id),
       }
     })
   )
 }
```

- Disabling/Pausing Queries ：懒查询
- Query Retries ：查询重试
- Paginated / Lagged Queries ：分页查询
- Placeholder Query Data ：空白展位
- Initial Query Data ：支持默认数据（会直接进入缓存）
- Query Invalidation：查询标记无效
- Optimistic Updates ：错误回滚

#### 查询失效

> 通过查询键值指定查询无效，支持通过predicate 函数传参动态判断

```js
// 1。使缓存中的每个查询都无效
queryClient.invalidateQueries();

// 2。使缓存中命中特定变量的查询无效
queryClient.invalidateQueries(["todos", { type: "done" }]);
// 该查询会被无效
const todoListQuery = useQuery(["todos", { type: "done" }], fetchTodoList);
// 该查询不会被无效
const todoListQuery = useQuery("todos", fetchTodoList);

// 3。使缓存命中特别变量细粒度匹配的查询无效
queryClient.invalidateQueries({  
    predicate: (query) =>    
        query.queryKey[0] === "todos" 
        && query.queryKey[1]?.version >= 10,
});
// 该查询会被无效
const todoListQuery = useQuery(["todos", { version: 20 }],
 fetchTodoList);
// 该查询会被无效
const todoListQuery = useQuery(["todos", { version: 10 }], 
fetchTodoList);
// 该查询不会被无效
const todoListQuery = useQuery(["todos", { version: 5 }], 
fetchTodoList);

```

#### 无限查询
>
> 使用 useInfiniteQuery 将附加数据"加载"更多数据到现有数据集，实现load more滚动加载

看一下 load-more-infinite-scroll 例子 https://react-query.tanstack.com/examples/load-more-infinite-scroll

```js
const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery(
    'projects',
    async ({ pageParam = 0 }) => {
      const res = await axios.get('/api/projects?cursor=' + pageParam)
      return res.data
    },
    {
      // 确定是否有更多数据要加载
      getPreviousPageParam: firstPage => firstPage.previousId ?? false,
      getNextPageParam: lastPage => lastPage.nextId ?? false,
    }
  )
```

在上文中，我们没有介绍 useMutation ，这是一个对非查询式的请求做封装的 hooks ，通过该 hooks 可以将请求纳入 react-query 管辖，从而在生命周期主动调用全局实例的 api，主动 set 数据或者操作缓存等，提前产生一些可预期的副作用，这块比较复杂，实际中一般我们不会给非查询请求加上 react-query 这么强的主张，所以可选择使用

如失败回滚

#### 修改 Mutations

```js
const addTodoMutation = useMutation(
    text => axios.post('/api/data', { text }),
    {
      // 修改即将发生
      onMutate: async text => {
        setText('')
        await queryClient.cancelQueries('todos')

        const previousValue = queryClient.getQueryData('todos')

        queryClient.setQueryData('todos', old => ({
          ...old,
          items: [...old.items, text],
        }))

        return previousValue
      },
      // 错误触发 roll back to the previous value
      onError: (err, variables, previousValue) =>
        queryClient.setQueryData('todos', previousValue),
      // After success or failure, refetch the todos query
      // 使这次查询无效就能手动retry
      onSettled: () => {
        queryClient.invalidateQueries('todos')
      },
    }
  )
  
  return {
   <form
        onSubmit={e => {
          e.preventDefault()
          addTodoMutation.mutate(text)
        }}
      >
    </Form>
  }

```

### 使用原则

UI状态使用react hook维护，服务端业务数据使用 react-query 维护

### 源码解析

无限查询
https://github.com/tannerlinsley/react-query/blob/master/src/core/infiniteQueryBehavior.ts

## 设计思想

React 缺少的数据获取(data-fetching)库，使 React 程序中的获取，缓存，同步和更新服务器状态变得轻而易举，简而言之：基于hooks的数据请求库。

- 多个组件请求同一个query时只发出一个请求
  - 避免了不必要的请求
- 请求全生命周期管理
  - 不需要独立维护每个请求的loading/error等状态（代替了一连串的useState）
  - 可以方便地在变量发生变化的时候发起请求（代替了useEffect）
- 对请求进行缓存和过期进行管理
  - 缓存数据失效/更新策略（判断缓存何时失效，失效后自动请求数据）
  - 对失效数据垃圾清理、也可以手动将请求设为过期
- 可以方便地处理一些特殊场景
  - 轮询 / 预加载 / focus时重新加载

简单总结一下 React Query 的流程：

1. 与请求相关的底层逻辑都封装在了 Query 中，直接与服务端交互
2. 同时 Query 又被保管在外部 store 的 queryClient 中
3. queryClient 会在 App 顶层使用 Provider 全局注入到 React
4. 组件使用 hook 与 Query 建立连接，订阅状态触发更新
可以发现，1，2 点是请求 Query 的核心逻辑，它是与框架无关的。3，4 点是与 React 框架结合，建立通信的部分。

- React Query 本质是一个外部的状态管理库，它的核心逻辑与 React 框架无关。
- 在处理与框架连接部分，使用了观察者设计模式来处理请求状态的订阅和更新。
- 由于核心逻辑与框架不耦合，使得它也能与 Vue，Solid 这些框架结合。

## 核心概念

- 查询 Queries
  - 从服务器获取数据的hook，通常用于GET请求
- 修改 Mutations
  - 修改服务器数据时使用，通常用于POST PATCH DELETE，通常用于修改useQuery定义的数据
- 查询错误处理 Query Invalidation
