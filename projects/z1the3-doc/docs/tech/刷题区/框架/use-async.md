# useAsync

在组件的开发过程中，有一些常用的通用逻辑，最常见的需求：发起异步请求获取数据并显示在界面上
在这个过程中，我们不仅要关心请求正确返回时，UI 会如何展现数据
还需要处理请求出错，以及关注 Loading 状态在 UI 上如何显示
通常都会遵循下面步骤：

1. 创建 data，loading，error 这 3 个 state；
2. 请求发出后，设置 loading state 为 true；
3. 请求成功后，将返回的数据放到某个 state 中，并将 loading state 设为 false；
4. 请求失败后，设置 error state 为 true，并将 loading state 设为 false。

```js
import { useState } from "react";

const useAsync = (asyncFunction) => {
  // 设置三个异步逻辑相关的 state
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // 定义一个 callback 用于执行异步逻辑
  const execute = useCallback(() => {
    // 请求开始时，设置 loading 为 true，清除已有数据和 error 状态
    setLoading(true);
    setData(null);
    setError(null);
    return asyncFunction()
      .then((response) => {
        // 请求成功时，将数据写进 state，设置 loading 为 false
        setData(response);
        setLoading(false);
      })
      .catch((error) => {
        // 请求失败时，设置 loading 为 false，并设置错误状态
        setError(error);
        setLoading(false);
      });
  }, [asyncFunction]);

  return { execute, loading, data, error };
};
```

在其他组件中使用 useAsync 时就只需关心与业务逻辑

```js
import React from "react";
import useAsync from './useAsync';

export default function UserList() {
  // 通过 useAsync 这个函数，只需要提供异步逻辑的实现
  const {
    execute: fetchUsers,
    data: users,
    loading,
    error,
  } = useAsync(async () => {
    const res = await fetch("https://reqres.in/api/users/");
    const json = await res.json();
    return json.data;
  });

  return (
    // 根据状态渲染 UI...
  );
}

```
