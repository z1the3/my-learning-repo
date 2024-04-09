# immerjs 使用

## 文档

https://immerjs.github.io/immer/

## 仓库

https://github.com/immerjs/immer?tab=readme-ov-file

## 介绍

## Immutable 问题

Immer 想解决的问题，是利用元编程简化 Immutable 使用的复杂度。举个例子，我们写一个纯函数

```js
const addProducts = (products) => {
  const cloneProducts = products.slice();
  cloneProducts.push({ text: "shoes" });
  return cloneProducts;
};
```

如果 js 原生支持 Immutable，就可以直接使用 push 了！对，Immer 让 js 现在就支持

```js
const addProducts = produce((products) => {
  products.push({ text: "shoes" });
});
```

这两个 addProducts 函数功能一模一样，而且都是纯函数。

react 框架中，setState 支持函数式写法：

```js
this.setState((state) => {
  const cloneProducts = state.products.slice();
  cloneProducts.push({ text: "shoes" });
  return {
    ...state,
    cloneProducts,
  };
});
```

然而有了 Immer，一切都不一样了：

```js
this.setState(produce((state) => (state.isShow = true)));

this.setState(produce((state) => state.products.push({ text: "shoes" })));
```

方便的柯里化
上面讲述了 Immer 支持柯里化带来的好处。所以我们也可以直接把两个参数一次性消费：

```js
const nextState = baseState.slice(); // shallow clone the array
nextState[1] = {
  // replace element 1...
  ...nextState[1], // with a shallow clone of element 1
  done: true, // ...combined with the desired update
};
// 因为nextState是一个新复制的数组，此时可以使用Push，但是在其他情况
//可能会破坏单向数据流
// since nextState was freshly cloned, using push is safe here,
// but doing the same thing at any arbitrary time in the future would
// violate the immutability principles and introduce a bug!
nextState.push({ title: "Tweet about it" });
```

```js
import { produce } from "immer";

const nextState = produce(baseState, (draft) => {
  draft[1].done = true;
  draft.push({ title: "Tweet about it" });
});
```

这就是 Immer：Create the next immutable state by mutating the current one.

```js
produce: IProduce = (base: any, recipe?: any, patchListener?: any) => {

```

`produce` function takes a value and a "recipe function" (whose
return value often depends on the base state). The recipe function is
free to mutate its first argument however it wants. All mutations are
only ever applied to a **copy** of the base state.

**Pass only a function** to create a "curried producer" which relieves you from passing the recipe function every time.

```js
// curried invocation
if (typeof base === "function" && typeof recipe !== "function") {
  const defaultBase = recipe;
  recipe = base;

  // 保留了最初的this
  const self = this;
  return function curriedProduce(
    this: any,
    base = defaultBase,
    ...args: any[]
  ) {
    return self.produce(base, (draft: Drafted) => recipe.call(this, draft, ...args)) // prettier-ignore
  };
}

// 柯里化，返回一个函数
const cp = produce(
  (draft) => {
    draft.x = 1;
  },
  { x: 2 }
);

cp();
```

Only plain objects and arrays are made mutable. All other objects are
considered uncopyable.
