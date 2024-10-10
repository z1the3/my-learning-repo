# async

## async 的传染性

比如一个函数用了 async，调用它的函数就要加上 async，有语法开销

## 解决 aysnc/await 同一函数内无法执行并行的缺点（提前创建 promise）

```js
// 异步操作1
async function selectPizza() {
  const pizzaData = await getPizzaData(); // async call
  const chosenPizza = choosePizza(); // sync call
  await addPizzaToCart(chosenPizza); // async call
}
// 异步操作2
async function selectDrink() {
  const drinkData = await getDrinkData(); // async call
  const chosenDrink = chooseDrink(); // sync call
  await addDrinkToCart(chosenDrink); // async call
}

(async () => {
  // 两种异步操作都已经创建了promise（请求中）
  const pizzaPromise = selectPizza();
  const drinkPromise = selectDrink();
  // 但是还是会等都完成
  await pizzaPromise;
  await drinkPromise;
  orderItems(); // async call
})()(
  // Although I prefer it this way
  // 结合Promise可以直接Promise.all
  async () => {
    Promise.all([selectPizza(), selectDrink()]).then(orderItems); // async call
  }
)();
```

## async 实现原理

> async 被编译成 generator 函数，然后 generator 函数被 asyncFunction 处理，保证每一次生成的执行结果是 promise 并执行 next

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
