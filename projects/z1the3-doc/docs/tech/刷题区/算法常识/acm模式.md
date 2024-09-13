# acm 模式

```typescript
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.on("line", function (line) {
  const tokens = line.split(" ");
  console.log(parseInt(tokens[0]) + parseInt(tokens[1]));
});
```

```js
const rl = require("readline").createInterface({ input: process.stdin });
var iter = rl[Symbol.asyncIterator]();
const readline = async () => (await iter.next()).value;

void (async function () {
  // Write your code here
  while ((line = await readline())) {
    let tokens = line.split(" ");
    let a = parseInt(tokens[0]);
    let b = parseInt(tokens[1]);
    console.log(a + b);
  }
})();
```

## 单行输入

```js
// get input
let str = readline();
let k = parseInt(readline());

// output
print(str.substr(0, k));
```

## 多行输入且奇偶行不一样

```js
let i = 1;
let str = "";
let num = 0;
let line;

while ((line = readline())) {
  //偶数行为数字
  if (i % 2 === 0) {
    num = parseInt(line);
    print(str.substring(0, num));
    i++;
  } else {
    //奇数行为字符串
    str = line;
    i++;
  }
}
```
