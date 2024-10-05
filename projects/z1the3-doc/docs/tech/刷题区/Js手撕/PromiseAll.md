## 实现 Promise.all

```js
Promise.all = (promises) => {
  return new Promise((resolve, reject) => {
    let count = 0;
    let result = [];
    const len = promises.length;
    if (len === 0) {
      resolve([]);
      return;
    }

    promises.forEach((promise, i) => {
      // Promise.resolve用来包装一下，防止数组中不是promise而是基础类型
      // 而且就算是promise，Promise.resolve会直接返回这个参数
      Promise.resolve(promise)
        .then((res) => {
          count += 1;
          // 保证按顺序返回
          result[i] = res;
          if (count === len) {
            resolve(result);
          }
          // 一旦失败立即失败
        })
        .catch(reject);
    });
  });
};

// 写个使用例
const promise1 = new Promise((resolve, reject) =>
  setTimeout(() => resolve(1), 10)
);
const promise2 = new Promise((resolve, reject) =>
  setTimeout(() => resolve(2), 10)
);
const promise3 = new Promise((resolve, reject) =>
  setTimeout(() => resolve(3), 10)
);
const promise4 = promise.reject(1);

const promises = [promise1, promise2, promise3, promise4];
Promise.all(promises).then((res) => {
  console.log(res);
});
```
