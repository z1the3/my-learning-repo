# 手写 reduce

prev 作为吃豆人的人，可能需要预设

```js
// prev为初始值，可能为undefined
Array.prototype._reduce = function (fn, prev) {
  for (let i = 0; i < this.length; i++) {
    if (prev === undefined) {
      // this 是数组
      // 此时第一位和第二位为参数返回结果为初始值，当前应该在第二位所以i++
      // 修改参数prev
      prev = fn(this[i], this[i + 1], i + 1, this);
      // 只有第一次要i++，第二次不用，任何时候第二次prev就不为undefined的
      i++;
    } else {
      // prev不为undefined了，所以将上一次的prev传进去，此时i是2
      prev = fn(prev, this[i], i, this);
    }
  }
  return prev;
};
```
