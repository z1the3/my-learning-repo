# unknown,any,never,void

## unknown 与 any 的比较

https://stackoverflow.com/questions/51439843/unknown-vs-any

unknown which is the type-safe counterpart of any. Anything is assignable to unknown, but unknown isn't assignable to anything but itself and any without a type assertion or a control flow based narrowing. Likewise, no operations are permitted on an unknown without first asserting or narrowing to a more specific type.

unknown 是 any 的 type-safe 的副本。任何值可以赋值给 unknown 类型的变量，但 unknown 类型的变量除了自己本身, 和没有进行类型断言或者类型收窄的 any 之外，不能赋值给任何变量。同样地，在没有预先进行类型断言或者收窄到更加明确类型前，unknown 类型的变量是不能做任何操作的。

```js
let vAny: any = 10; // We can assign anthing to anylet vUnknown: unknown =  10; // We can assign anthing to unknown just like any let s1: string = vAny;     // Any is assigable to anything let s2: string = vUnknown; // Invalid we can't assign vUnknown to any other type (without an explicit assertion)
vAny.method(); // ok anything goes with any
vUnknown.method(); // not ok, we don't know anything about this variable
```

## never

never 的应用场景
https://www.zhihu.com/question/354601204/answer/888551021

## void

Void 一般在函数没有任何返回值时，作为其返回值的类型声明（TS 会 infer 为 void，并不需要显式声明，除非你希望限制这个函数不能有任何返回值）。

## null 和 undefined

null 和 undefined 用来声明 null 和 undefined 本身（前面的是 Type，后面的是 Value）。
