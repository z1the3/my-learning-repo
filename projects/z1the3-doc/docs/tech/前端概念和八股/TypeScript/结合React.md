# 结合 React

- 熟悉 React
- 熟悉 TypeScript （参考书籍：2ality's guide, 初学者建议阅读：chibicode's tutorial）

http://2ality.com/2018/04/type-notation-typescript.html

https://ts.chibicode.com/todo/

- 熟读 React 官方文档 TS 部分

https://legacy.reactjs.org/docs/static-type-checking.html#typescript

- 熟读 TypeScript playground React 部分

http://www.typescriptlang.org/play/index.html?jsx=2&esModuleInterop=true&e=181#example/typescript-with-react

## 如何引入 React

```js
import * as React from "react";

import * as ReactDOM from "react-dom";
```

- 这种引用方式被证明是最可靠的一种方式， 推荐使用。
  而另外一种引用方式:

```js
import React from "react";

import ReactDOM from "react-dom";
```

需要添加额外的配置："allowSyntheticDefaultImports": true

## 函数式组件的声明方式

声明的几种方式
第一种：也是比较推荐的一种，使用 React.FunctionComponent，简写形式：React.FC:

```jsx
// Great
type AppProps = {
  message: string,
};

const App: React.FC<AppProps> = ({ message, children }) => (
  <div>
    {message}
    {children}
  </div>
);
```

使用 React.FC 声明函数组件和普通声明以及 PropsWithChildren 的区别是：

- React.FC 显式地定义了返回类型，其他方式是隐式推导的
- React.FC 对静态属性：displayName、propTypes、defaultProps 提供了类型检查和自动补全
- React.FC 为 children 提供了隐式的类型（ReactElement | null），但是目前，提供的类型存在一些 issue（问题）

比如以下用法 React.FC 会报类型错误:

```js
const App: React.FC = (props) => props.children;

const App: React.FC = () => [1, 2, 3];

const App: React.FC = () => "hello";
```

解决方法

```js
const App: React.FC<{}> = props => props.children as any

const App: React.FC<{}> = () => [1, 2, 3] as any

const App: React.FC<{}> = () => 'hello' as any

// 或者
const App: React.FC<{}> = props => (props.children as unknown) as JSX.Element
const App: React.FC<{}> = () => ([1, 2, 3] as unknown) as JSX.Element
const App: React.FC<{}> = () => ('hello' as unknown) as JSX.Element
```

在通常情况下，使用 React.FC 的方式声明最简单有效，推荐使用；如果出现类型不兼容问题，建议使用以下两种方式：

1.使用 PropsWithChildren，这种方式可以为你省去频繁定义 children 的类型，自动设置 children 类型为 ReactNode:

适用于使用到 children 的高级组件

```js
type AppProps = React.PropsWithChildren<{ message: string }>;

const App = ({ message, children }: AppProps) => (
  <div>
    {message}
    {children}
  </div>
);
```

2.直接声明

```js

type AppProps = {
  message: string
  children?: React.ReactNode
}

const App = ({ message, children }: AppProps) => (
<div>
    {message}
    {children}
</div>
)
```

## Hooks

### `useState<T>`

大部分情况下，TS 会自动为你推导 state 的类型:

```js
// val会推导为boolean类型， toggle接收boolean类型参数
const [val, toggle] = React.useState(false);

// obj会自动推导为类型: {name: string}
const [obj] = React.useState({ name: "sj" });

// arr会自动推导为类型: string[]
const [arr] = React.useState(["One", "Two"]);
```

使用推导类型作为接口/类型:

**可以利用 typeof state 免去推导步骤，直接利用默认值创建类型，很好用**

```js
export default function App() {
  // user会自动推导为类型: {name: string}
  const [user] = React.useState({ name: "sj", age: 32 });

  const showUser = React.useCallback((obj: typeof user) => {
    return `My name is ${obj.name}, My age is ${obj.age}`;
  }, []);
  return <div className="App">用户: {showUser(user)}</div>;
}
```

但是不适用于初始类型必须为空（null）的情况

需要显示地声明类型：

```js
type User = {
  name: string
  age: number
}

const [user, setUser] = React.useState<User | null>(null)

```

### `useRef<T>`

当初始值为 null 时，有两种创建方式:

```ts
const ref1 = React.useRef<HTMLInputElement>(null);
```

```ts
const ref2 = React.useRef<HTMLInputElement | null>(null);
```

这两种的区别在于：

- 第一种方式的 ref1.current 是只读的（read-only），并且可以传递给元素内置的 ref 属性，绑定 DOM 元素，隐式不再是 null 了
- 第二种方式的 ref2.current 是可变的（类似于声明类的成员变量）

这两种方式在使用时，都需要对类型进行检查,因为不确定是 null 还是新值:

```js
const onButtonClick = () => {
  ref1.current?.focus();
  ref2.current?.focus();
};
```

在某种情况下，可以省去类型检查，通过添加 ! 断言，不推荐：

```js
// Bad
function MyComponent() {
  const ref1 = React.useRef<HTMLDivElement>(null!)
  React.useEffect(() => {
  //  不需要做类型检查，需要人为保证ref1.current.focus一定存在
  doSomethingWith(ref1.current.focus())
  })
  return <div ref={ref1}> </div>
}

```

```js
// 若初始值不为null，则不与dom配合使用，那可以利用ts的自动类型推导
const ref = React.useRef(0);

React.useEffect(() => {
  ref.current += 1;
}, []);
```

## useEffect

useEffect 需要注意回调函数的返回值只能是函数或者 undefined

```js
function App() {
  // undefined作为回调函数的返回值
  React.useEffect(() => {
    // do something...
    // return undefined
  }, []);

  // 返回值是一个函数
  React.useEffect(() => {
    // do something...
    return () => {};
  }, []);
}
```

## `useMemo<T> / useCallback<T>`

useMemo 和 useCallback 都可以直接从它们返回的值中推断出它们的类型

useCallback 的参数必须制定类型，否则 ts 不会报错，默认指定为 any

```js
const value = 10; // 自动推断返回值为 number
const result = React.useMemo(() => value * 2, [value]);

// 自动推断 (value: number) => number
const multiply = React.useCallback(
  (value: number) => value * multiplier,
  [multiplier]
);
```

同时也支持传入泛型， useMemo 的泛型指定了返回值类型，useCallback 的泛型指定了参数类型

```ts
// 也可以显式的指定返回值类型，返回值不一致会报错
// error
// 类型“() => number”的参数不能赋给类型“() => string”的参数。
const result = React.useMemo<string>(() => 2, []);

const handleChange = React.useCallback<
  React.ChangeEventHandler<HTMLInputElement>
>((evt) => {
  console.log(evt.target.value);
}, []);
```

## 自定义 Hooks

需要注意，自定义 Hook 的返回值如果是数组类型，TS 会自动推导为 Union 类型，而我们实际需要的是数组里里每一项的具体类型，需要手动添加 const 断言 进行处理：

```js
function useLoading() {
  const [isLoading, setState] = React.useState(false);
  const load = (aPromise: Promise<any>) => {
    setState(true);
    return aPromise.then(() => setState(false));
  };
  // 实际需要: [boolean, typeof load] 类型
  // 而不是自动推导的：(boolean | typeof load)[]
  return [isLoading, load] as const
}
```

如果使用 const 断言遇到问题，也可以直接定义返回类型:
https://github.com/babel/babel/issues/9800

```js
export function useLoading(): [
  boolean,
  (aPromise: Promise<any>) => Promise<any>
] {
  const [isLoading, setState] = React.useState(false);
  const load = (aPromise: Promise<any>) => {
    setState(true);
    return aPromise.then(() => setState(false));
  };
  return [isLoading, load];
}
```

如果有大量的自定义 Hook 需要处理，一个方便的工具方法可以处理 tuple 返回值:

```js
function tuplify<T extends any[]>(...elements: T) {
  return elements
}

function useLoading() {
  const [isLoading, setState] = React.useState(false)
  const load = (aPromise: Promise<any>) => {
  setState(true)
  return aPromise.then(() => setState(false))
    }
  // (boolean | typeof load)[]
  return [isLoading, load]
}

function useTupleLoading() {
const [isLoading, setState] = React.useState(false)
const load = (aPromise: Promise<any>) => {
setState(true)
return aPromise.then(() => setState(false))
  }
// [boolean, typeof load] 类似强制as const输出
return tuplify(isLoading, load)
}

```

## 获取未导出的 Type

某些场景下我们在引入第三方的库时会发现想要使用的组件并没有导出我们需要的组件参数类型或者返回值类型，这时候我们可以通过 ComponentProps/ ReturnType 来获取到想要的类型。

```js
// 获取参数类型
import { Button } from "library";
// 但是未导出props type， import type
type ButtonProps = React.ComponentProps<typeof Button>; // 先获取props

type AlertButtonProps = Omit<ButtonProps, "onClick">; // 再去除onClick

const AlertButton: React.FC<AlertButtonProps> = (props) => (
  <Button onClick={() => alert("hello")} {...props} />
);
```

```js
// 获取返回值类型
function foo() {
  return { baz: 1 };
}
type FooReturn = ReturnType<typeof foo>;
// { baz: number }
```

## Props

通常我们使用 type 来定义 Props，为了提高可维护性和代码可读性，在日常的开发过程中我们希望可以添加清晰的注释。
现在有这样一个 type

```js
type OtherProps = {
  name: string
  color: string
}
```

在使用的过程中，hover 对应类型会有如下展示

```js
const OtherHeading: React.FC<OtherProps> = ({ name, color }) => (
  <Button>My Website Heading</Button>
);
```

增加相对详细的注释，使用时会更清晰，需要注意，注释需要使用 /\*\*/ ， // 无法被 vscode 识别

```js
// Great

/**
 * @param color color
 * @param children children
 * @param onClick onClick
 */
type Props = {
/** color */
  color?: string
/** children */
  children: React.ReactNode
/** onClick */
  onClick: () => void
}

// type Props
// @param color — color
// @param children — children
// @param onClick — onClick
const Button: React.FC<Props>= ({ children, color = 'tomato', onClick }) => {
return (
<button style={{ backgroundColor: color }} onClick={onClick}>
      {children}
</button>
  )
}

```

## 常用 props 类型

在自定义组件中，给 props 标注类型时常用

```js
type AppProps = {
  message: string
  count: number
  disabled: boolean
/** array of a type! */
  names: string[]
/** string literals to specify exact string values, with a union type to join them together */
  status: 'waiting' | 'success'/** 任意需要使用其属性的对象（不推荐使用，但是作为占位很有用） */
  obj: object
/** 作用和object几乎一样，和 Object完全一样 */
  obj2: {}
/** 列出对象全部数量的属性 （推荐使用） */
  obj3: {
    id: string
    title: string
  }
/** array of objects! (common) */
  objArr: {
    id: string
    title: string
  }[]
/** 任意数量属性的字典，具有相同类型*/
  dict1: {
    [key: string]: MyTypeHere
  }
/** 作用和dict1完全相同 */
  dict2: Record<string, MyTypeHere>
/** 任意完全不会调用的函数 */
  onSomething: Function
/** 没有参数&返回值的函数 */
  onClick: () => void
/** 携带参数的函数 */
  onChange: (id: number) => void
/** 携带点击事件的函数 */
  onClick(event: React.MouseEvent<HTMLButtonElement>): void
/** 可选的属性 */
  optional?: OptionalType
}
```

## 常用事件类型

```js
export declare interface AppBetterProps {
  children: React.ReactNode // 一般情况下推荐使用，支持所有类型 GreatfunctionChildren: (name: string) => React.ReactNode
  style?: React.CSSProperties // 传递style对象
  onChange?: React.FormEventHandler<HTMLInputElement>
}

export declare interface AppProps {
  children1: JSX.Element // 差, 不支持数组
  children2: JSX.Element | JSX.Element// 一般, 不支持字符串
  children3: React.ReactChildren // 忽略命名，不是一个合适的类型，工具类类型
  children4: React.ReactChild // 很好
  children: React.ReactNode // 最佳，支持所有类型 推荐使用
  functionChildren: (name: string) => React.ReactNode
   // recommended function as a child render prop type
  style?: React.CSSProperties // 传递style对象
  onChange?: React.FormEventHandler<HTMLInputElement>// 表单事件, 泛型参数是event.target的类型
}
```

## Forms and Events

onChange

change 事件，有两个定义参数类型的方法。

第一种方法使用推断的方法签名（例如：`React.FormEvent <HTMLInputElement> ：void`）

```js
import * as React from "react";
type changeFn = (e: React.FormEvent<HTMLInputElement>) => void;

const App: React.FC = () => {
  const [state, setState] = React.useState("");
  const onChange: changeFn = (e) => {
    setState(e.currentTarget.value);
  };
  return (
    <div>
      <input type="text" value={state} onChange={onChange} />
    </div>
  );
};
```

第二种方法强制使用 @types / react 提供的委托类型，这两种方法均可

```js
import * as React from "react";

const App: React.FC = () => {
  const [state, setState] = React.useState("");
  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setState(e.currentTarget.value);
  };
  return (
    <div>
      <input type="text" value={state} onChange={onChange} />
    </div>
  );
};
```

## onSubmit(原生表单)

如果不太关心事件的类型，可以直接使用 React.SyntheticEvent，

如果目标表单有想要访问的自定义命名输入，可以使用类型扩展(&)

```js
import * as React from 'react'
const App: React.FC = () => {
  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    const target = e.target as (typeof e.target &
    // 类型扩展
    {
      password: { value: string }
    })

    const password = target.password.value
    // do something...
  }
  return (
  <form onSubmit={onSubmit}>
    <div>
    <label>
              Password:
    <input type="password" name="password" />
    </label>
    </div>
    <div><input type="submit" value="Log in" />
    </div>
  </form>
    )
  }

```

## 使用查找类型访问组件属性类型

通过查找类型（typeof）减少 type 的非必要导出，

如果需要提供复杂的 type，**应当提取到作为公共 API 导出的文件中。**

现在我们有一个 Counter 组件

```js
// counter.tsx
import * as React from "react";
export type Props = {
  name: string,
};

const Counter: React.FC<Props> = (props) => {
  return <></>;
};

export default Counter;
```

在其他引用它的组件中我们有两种方式获取到 Counter 的参数类型
第一种是通过 typeof 操作符（推荐

```js
// Great
import Counter from "./d-tips1";
import * as React from "react";
type PropsNew = React.ComponentProps<typeof Counter> & {
  age: number,
};

const App: React.FC<PropsNew> = (props) => {
  return <Counter {...props} />;
};

export default App;
```

第二种是通过在原组件进行导出,antd 会暴露类型

```js
import Counter, { Props } from "./d-tips1";
type PropsNew = Props & {
  age: number,
};

const App: React.FC<PropsNew> = (props) => {
  return (
    <>
      <Counter {...props} />
    </>
  );
};

export default App;
```

## 事件处理

我们在进行事件注册时经常会在事件处理函数中使用 event 事件对象，例如当使用鼠标事件时我们通过 clientX、clientY 去获取指针的坐标。

大家可能会想到直接把 event 设置为 any 类型，但是这样就失去了我们对代码进行静态检查的意义。

```js
function handleEvent(event: any) {
  console.log(event.clientY);
}
```

通过 interface 对 event 对象进行类型声明编写的话又十分浪费时间，幸运的是 React 的声明文件提供了 Event 对象的类型声明

Event 事件对象类型

```
- ClipboardEvent<T = Element> 剪切板事件对象
- DragEvent<T =Element> 拖拽事件对象
- ChangeEvent<T = Element> Change事件对象
- KeyboardEvent<T = Element> 键盘事件对象
- MouseEvent<T = Element> 鼠标事件对象
- TouchEvent<T = Element> 触摸事件对象
- WheelEvent<T = Element> 滚轮时间对象
- AnimationEvent<T = Element> 动画事件对象
- TransitionEvent<T = Element> 过渡事件对象
```

## 事件处理函数类型

当我们定义事件处理函数时有没有更方便定义其函数类型的方式呢？答案是使用 React 声明文件所提供的 EventHandler 类型别名，通过不同事件的 EventHandler 的类型别名来定义事件处理函数的类型

react 提供的

```js
type EventHandler<E extends React.SyntheticEvent<any>> = {
  bivarianceHack(event: E): void
}['bivarianceHack']

type ReactEventHandler<T = Element> = EventHandler<React.SyntheticEvent<T>>

type ClipboardEventHandler<T = Element> = EventHandler<React.ClipboardEvent<T>>

type DragEventHandler<T = Element> = EventHandler<React.DragEvent<T>>

type FocusEventHandler<T = Element> = EventHandler<React.FocusEvent<T>>

type FormEventHandler<T = Element> = EventHandler<React.FormEvent<T>>
......
```

bivarianceHack 为事件处理函数的类型定义，函数接收一个 event 对象，并且其类型为接收到的泛型变量 E 的类型, 返回值为 void

> 关于为何是用 bivarianceHack 而不是(event: E): void，这与 strictfunctionTypes 选
> 项下的功能兼容性有关。(event: E): void，如果该参数是派生类型，则不能将其传递给参数是>基类的函数。

在不开 strictfunctionTypes 情况下，入参只支持逆变不支持协变

可以用这种 hack 法解决

```js
class Animal {
  private x: undefined
}

class Dog extends Animal {
  private d: undefined
}
type EventHandler<E extends Animal>= (event: E) => void
let z: EventHandler<Animal>= (o: Dog) => {} // fails under strictfunctionTypes
type BivariantEventHandler<E extends Animal>= {
bivarianceHack(event: E): void
}['bivarianceHack']

let y: BivariantEventHandler<Animal>= (o: Dog) => {}

```

## Promise 类型

在做异步操作时我们经常使用 async 函数，函数调用时会 return 一个 Promise 对象，可以使用 then 方法添加回调函数。`Promise<T>` 是一个泛型类型，T 泛型变量用于确定 then 方法时接收的第一个回调函数的参数类型。

```js

type IResponse<T> = {
  message: string
  result: T
  success: boolean
}

async function getResponse(): Promise<IResponse<number[]>> {
  return {
    message: '获取成功',
    result: [1, 2, 3],
    success: true,
    }
}

getResponse().then(response => {
  console.log(response.result)
})
```

## 泛型参数的组件

下面这个组件的 name 属性都是指定了传参格式，如果想不指定，而是想通过传入参数的类型去推导实际类型，这就要用到泛型。

```js
const TestB = ({ name, name2 }: { name: string; name2?: string }) => {
return (
<div className="test-b"
      TestB--{name}
      {name2}
</div
  )
}
```

如果需要外部传入参数类型，只需

```js

type Props<T> = {
  name: T
  name2?: T
}

const TestC: <T>(props: Props<T>) => React.ReactElement = ({ name, name2 }) => {
return (
<div> className="test-b"
      TestB--{name}
      {name2}
</div>
  )
}


const TestD = () => {
return (
<div>
      <TestC<string> name="123" />
</div>
  )
}
```

**组件也可以传递泛型**

### 什么时候使用泛型

当你的函数，接口或者类：

- 需要作用到很多类型的时候，举个例子
  当我们需要一个 id 函数，函数的参数可以是任何值，返回值就是将参数原样返回，并且其只能接受一个参数，在 js 时代我们会很轻易地甩出一行
  `const id = arg => arg`
  由于其可以接受任意值，也就是说我们的函数的入参和返回值都应该可以是任意类型，如果不使用泛型，我们只能重复的进行定义

```js
type idBoolean = (arg: boolean) => boolean;
type idNumber = (arg: number) => number;
type idString = (arg: string) => string;
```

如果使用泛型，我们只需要

```js
function id<T>(arg: T): T {
  return arg;
}

// 或
const id1: <T>(arg: T) => T = (arg) => {
  return arg;
};
```
