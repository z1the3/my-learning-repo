# swr 的问题

在 swr 中，使用非常简单，一个简单的 demo 如下：

```js
import { useState } from "react";
import useSWR from "swr";

function App() {
  const [status, setStatus] = useState(false);

  const request = (status, stringKey, numberKey) => {
    // 为了模拟实际中 api 的时长随机性，随机 1.5s 或 3s 后得到响应
    const time = Math.random() > 0.5 ? 3000 : 1500;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(time);
      }, time);
    });
  };

  const { data, error } = useSWR([status, "ss", 2], request);

  return (
    <>
      {!data && <div>loading...</div>}
      {error && <div>error...</div>}
      {data && <div>{data}</div>}
      <button
        onClick={() => {
          // 通过改变 swr 的唯一 key，也就是 [status, 'ss', 2] 中的 status
          // 实现重新触发 api 请求的效果
          setStatus((pre) => !pre);
        }}
      >
        click
      </button>
    </>
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
