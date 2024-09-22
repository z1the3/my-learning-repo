# async pool

```js
function limitConcurrency(tasks, limit) {
  return new Promise((resolve, reject) => {
    let results = [];
    let runningCount = 0;
    let currentIndex = 0;

    function runTask(index) {
      if (index >= tasks.length) {
        resolve(results);
        return;
      }

      runningCount++;
      // 走到这里说明之前有一个任务走到finally，或者runningCount< limit
      tasks[index]()
        .then((result) => {
          results[index] = result;
          console.log(result);
        })
        .catch((error) => {
          results[index] = error;
        })
        .finally(() => {
          // 1 1 1->1 1 0
          runningCount--;
          runTask(++currentIndex);
        });
      // 1 0 0
      // 1 1 0

      if (runningCount < limit) {
        runTask(++currentIndex);
      }
    }

    runTask(currentIndex);
  });
}

// 测试案例
const tasks = [
  () => new Promise((resolve) => setTimeout(() => resolve(1), 1000)),
  () => new Promise((resolve) => setTimeout(() => resolve(2), 1000)),
  () => new Promise((resolve) => setTimeout(() => resolve(3), 1000)),
  // ...
];

limitConcurrency(tasks, 2); // 同时输出1,2，过1s后再输出3
```

## 利用 for + await

```js
// asyncPool(3,[1,2,3,4],(i,arr)=>new Promise(resolve,reject)
// {setTimeout(()=>{console.log(i).resolve(i)},100}}

async function asyncPool(poolLimit, iterable, iteratorFn) {
  const ret = [];
  const executing = new Set();
  for (const item of iterable) {
    const p = Promise.resolve().then(() => iteratorFn(item, iterable));
    ret.push(p);
    executing.add(p);
    const clean = () => executing.delete(p);
    // 无论成功还是失败，都在executing中去掉这个
    p.finally(clean);
    if (executing.size >= poolLimit) {
      // 卡住，但是一旦excuting中完成了一个，就会进入下一次循环
      await Promise.race(executing);
    }
  }
  // 确保返回的p全都执行完了,而且返回的是一个promise可用
  // 其实pool就应该是一个升级版的all
  return Promise.all(ret);
}
```
