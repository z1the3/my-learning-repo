# 实现 Promise.race

```js
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i]).then(
        (data) => {
          resolve(data);
          return;
        },
        (err) => reject(err)
      );
    }
  });
};
```
