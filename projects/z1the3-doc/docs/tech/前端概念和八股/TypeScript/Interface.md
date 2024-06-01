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

## 使用 Type 还是 Interface？

有几种常用规则：

- 在定义公共 API 时（比如编辑一个库）使用 interface，这样可以方便使用者继承接口

- 在定义组件属性（Props）和状态（State）时，建议使用 type，因为 type 的约束性更强
  interface 和 type 在 ts 中是两个不同的概念，但在 React 大部分使用的 case 中，interface 和 type 可以达到相同的功能效果

type 和 interface 最大的区别是：

- type 类型不能二次编辑，而 interface 可以随时扩展

```js
interface Animal {
  name: string;
}

// 可以继续在原有属性基础上，添加新属性：color,而不用写原属性
interface Animal {
  color: string;
}

/********************************/
type Animal = {
  name: string,
};

// type类型不支持属性扩展
// Error: Duplicate identifier 'Animal'
type Animal = {
  color: string,
};
```
