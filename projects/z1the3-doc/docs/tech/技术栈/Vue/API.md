# API

## toRaw

toRaw() 可以返回由 reactive()、readonly()、shallowReactive() 或者 shallowReadonly() 创建的代理对应的原始对象。

这是一个可以用于临时读取而不引起代理访问/跟踪开销，或是写入而不触发更改的特殊方法。不建议保存对原始对象的持久引用，请谨慎使用。

```js
const foo = {};
const reactiveFoo = reactive(foo);

console.log(toRaw(reactiveFoo) === foo); // true
```

## markRaw()​

将一个对象标记为不可被转为代理。返回该对象本身。

```js
const foo = markRaw({});
console.log(isReactive(reactive(foo))); // false

// 也适用于嵌套在其他响应性对象
const bar = reactive({ foo });
console.log(isReactive(bar.foo)); // false
```

:::caution
markRaw() 和类似 shallowReactive() 这样的浅层式 API 使你可以有选择地避开默认的深度响应/只读转换，并在状态关系谱中嵌入原始的、非代理的对象。它们可能出于各种各样的原因被使用：

有些值不应该是响应式的，例如复杂的第三方类实例或 Vue 组件对象。

当呈现带有不可变数据源的大型列表时，跳过代理转换可以提高性能。

这应该是一种进阶需求，因为只在根层能访问到原始值，所以如果把一个嵌套的、没有标记的原始对象设置成一个响应式对象，然后再次访问它，你获取到的是代理的版本。这可能会导致对象身份风险，即执行一个依赖于对象身份的操作，但却同时使用了同一对象的原始版本和代理版本：

```js
const foo = markRaw({
  nested: {},
});

const bar = reactive({
  // 尽管 `foo` 被标记为了原始对象，但 foo.nested 却没有
  nested: foo.nested,
});

console.log(foo.nested === bar.nested); // false
```

识别风险一般是很罕见的。然而，要正确使用这些 API，同时安全地避免这样的风险，需要你对响应性系统的工作方式有充分的了解。

:::
