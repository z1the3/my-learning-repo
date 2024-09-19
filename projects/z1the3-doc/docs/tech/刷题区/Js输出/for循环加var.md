# for 循环加 var

```js
var a = [];
for (var i = 0; i < 2; i++) {
  a[i] = function () {
    console.log(i);
  };
}
a.forEach((_) => {
  _();
});
```

只能输出 2。因为 var 声明的变量，在 for 循环的括号中会泄露到全局，而你又不是在循环当中去调用它的，而是在循环之后去调用，此时全局变量 i 已经是 2 了

## var+宏任务

```js
var i = 0;
for (i = 1; i <= 3; i++)
  setTimeout(function () {
    console.log(i);
  }, 0);
// 4 4 4
// 解释: 先执行完 for 循环, i 的值变为 4, 然后再执行宏任务

// 注意循环结束一定是循环限制条件以外，即4
```
