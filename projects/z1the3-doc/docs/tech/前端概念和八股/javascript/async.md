# async

## 使用 generator 实现

```js
function asyncFunction(generatorFunc) {
  return function (...args) {
    const generator = generatorFunc(...args);

    function handle(result) {
      if (result.done) return Promise.resolve(result.value);

      return Promise.resolve(result.value).then(
        // 递归执行handle
        (res) => handle(generator.next(res)),
        (err) => handle(generator.throw(err))
      );
    }

    // 首次执行handle
    try {
      return handle(generator.next());
    } catch (ex) {
      return Promise.reject(ex);
    }
  };
}

// Example usage  async函数被编译成 生成器函数，然后被asyncFuntion包裹
function* fetchData() {
  const data1 = yield fetch("https://api.example.com/data1");
  console.log(data1);
  const data2 = yield fetch("https://api.example.com/data2");
  console.log(data2);
  return "done";
}

const asyncFetchData = asyncFunction(fetchData);

asyncFetchData()
  .then((result) => console.log(result))
  .catch((err) => console.error(err));
```
