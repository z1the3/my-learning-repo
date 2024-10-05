# sleep

```js
function sleep(time) {
  // setTimeout中第一个参数是函数名，如果传入resolve()则为返回值
  return new Promise((resolve) => setTimeout(resolve, time));
}
const t1 = +new Date();
sleep(3000).then(() => {
  const t2 = +new Date();
  console.log("现在过去了", t2 - t1);
}); //输出3007是因为resolve找到成功回调+执行const t2 =+ new Date()这句花了0007，
// setTimeout是刚好3000时触发resolve,
```
