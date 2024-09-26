# flat

## 递归法

数组扁平化

```js
//拍到底
let arr = [1, [2, [3, 4, 5]]];
function flatten(arr) {
  let res = [];
  for (let item of arr) {
    // 当前元素是一个数组，对其进行递归展平
    if (Array.isArray(item)) {
      // 递归展平结果拼接到结果数组
      res = res.concat(flatten(item));
    }
    // 否则直接加入结果数组
    else {
      res.push(item);
    }
  }
  return res;
}
console.log(flatten(a));
```

```js
// 拍n层，外面需要包一个
function flatten(arr, level) {
  function walk(arr, currLevel) {
    // 每次都准备好一个空数组
    let res = [];
    for (let item of arr) {
      // 判断有没有超过层数,放在for循环里面而不是外面,放在外面超过层数后
      //后面的数就不会加到arr里了
      if (Array.isArray(item) && currLevel < level) {
        // 记得walk的是新的item**和现有的curlevel+1**
        res = res.concat(walk(item, currLevel + 1));

        // res.push(...walk(item,currLevel + 1))也行
      } else {
        res.push(item);
      }
    }
    return res;
  }

  return walk(arr, 0);
}

var res = flatten(arr, 3);
console.log(res);
```

## 迭代法

```js
function flattenArray(arr) {
  const flattened = [];
  const stack = [...arr];
  while (stack.length) {
    const next = stack.pop();
    if (Array.isArray(next)) {
      stack.push(...next);
    } else {
      flattened.unshift(next);
    }
  }
  return flattened;
}

const nestedArray = [1, 2, [3, 4], [5, [6, 7]]];
const flattenedArray = flattenArray(nestedArray);
console.log(flattenedArray);

```
