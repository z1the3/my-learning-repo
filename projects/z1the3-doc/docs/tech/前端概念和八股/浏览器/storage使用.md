# storage 使用

SessionStorage&LocalStorage
由于这两个对象的属性都是一样的，以下用 localstorage 为代表

## setItem

storage 可以通过 `JavaScript 的 storage.setItem(key, value)`来写入
`storage.setItem("name", "John Doe");`

## getItem

storage 可以通过 `JavaScript 的 storage.getItem(key)`来读取
`var name = storage.getItem("name");`

## removeItem clear

storage 可以通过`JavaScript 的 storage.removeItem(key)` 来删除特定 key，也可以通过
`storage.clear()`删除所有数据

`storage.removeItem('key');`

## 写入非字符串数据

由于 storage 只能保存字符串类型的数据，所以，在写入数据前，如果是非字符串类型的数据，就可能会导致原始数据丢失或原始类型丢失

传入 symbol 会直接报错

从上面的结果可以得出以下结论：所有写入 storage 的非字符串类型数据，都会先将其转换成字符串类型，引用类型会调用 toString 方法，获取原始数据是非字符串类型，需要进行转换。

## 写入过多数据

如上所述，storage 的容量也是有限的，一般是 5MB，一旦写入过多的数据，就会导致浏览器异常报错。可以对 storage 包装一层，进行异常处理。

```js
const setItem = localStorage.setItem;
localStorage.setItem = function setItem(data): boolean {
  try {
    setItem(data);
    return true;
  } catch (error) {
    return false;
  }
};
```
