# Interface

不推荐用 object 类型来声明一个对象变量，针对于对象变量，更好的方案是通过 interface 来进行声明

字段很少，并且没有复用价值时，可以直接用明确字段的对象类型来进行声明

```js
let data: { key: string }; // 对象字段较少并且没有复用价值的情况,直接在声明句中用字面量
```

对象字段较多，或者有复用价值的情况：

```js
interface IData {
  // 建议在声明interface时，在前面加一个字母 I 来明确它的身份
  foo: number;
  bar: boolean;
}

let data: IData;
```

对象有动态的字段，并且不确定的情况，可以声明签名索引：

```js
interface IData {
  foo: number;
  bar: boolean;
  [key: string]: string | number; // 除了明确定义的foo和bar字段之外，其他的字段为string或者n
}
```

如果对象中所有的字段都不确定，可以用 Record 高级类型声明：

```js
let data: Record<string, string | number;
// ortype Data = Record<string, string | number;
let data: Data;

```

使用 readonly 关键字来对只读属性进行声明，这是一种推荐做法，但不是强制做法：

```js
interface Point {
  readonly x: number;
  readonly y: number;
}

// 如果是只读数组，使用ReadonlyArray来声明

const readonlyArray = ReadonlyArray < number >= [1, 2, 3];
```
