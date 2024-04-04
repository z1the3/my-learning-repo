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

只能输出 5。因为 var 声明的变量，在 for 循环的括号中会泄露到全局，而你又不是在循环当中去调用它的，而是在循环之后去调用，此时全局变量 i 已经是 5 了
