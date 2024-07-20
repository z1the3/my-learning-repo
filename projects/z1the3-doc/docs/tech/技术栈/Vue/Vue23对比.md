# Vue23 对比

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/6f67a590-5088-11eb-85f6-6fac77c0c9b3.png" width="1200"/>

## 全局 API

- createApp()
- defineProperty()
- defineAsyncComponent()
- nextTick()

## 将 vue2 的全局 api 转移到应用对象实例上

- app.component
- app.config
- app.directive
- app.mount
- app.unmount
- app.use

## 三个新组件

fragment(就是 template)
teleport
suspense(渲染后备内容)

### fragment(template)

```html
<!-- Layout.vue -->
<template>
  <header>...</header>
  <main v-bind="$attrs">...</main>
  <footer>...</footer>
</template>
```

framents
在 Vue3.x 中，组件现在支持有多个根节点

### teleport

Teleport 是一种能够将我们的模板移动到 DOM 中 Vue app 之外的其他位置的技术，就有点像哆啦 A 梦的“任意门”

```html
<button @click="showToast" class="btn">打开 toast</button>
<!-- to 属性就是目标位置 -->
<teleport to="#teleport-target">
  <div v-if="visible" class="toast-wrap">
    <div class="toast-msg">我是一个 Toast 文案</div>
  </div>
</teleport>
```

在组件的逻辑位置写模板代码(v-if)，然后在 Vue 应用范围之外渲染它

- setup 生命周期 →setup 语法糖
- ref reactive computed watch 生命周期
- provide inject
- ref 内部: 通过给 value 属性添加 getter/setter 来实现对数据的劫持
- reactive 内部: 通过使用 Proxy 来实现对对象内部所有数据的劫持, 并通过 Reflect 操作对象内部数据 -如果用 ref 对象/数组, 内部会自动将对象/数组转换为 reactive 的代理对象!!

- watch 函数
  与 watch 配置功能一致
  监视指定的一个或多个响应式数据, 一旦数据变化, 就自动执行监视回调
  默认初始时不执行回调, 但可以通过配置 immediate 为 true, 来指定初始时立即执行第一次
  通过配置 deep 为 true, 来指定深度监视

- watchEffect 函数
  不用直接指定要监视的数据, 回调函数中使用的哪些响应式数据就监视哪些响应式数据
  默认初始时就会执行第一次, 从而可以收集需要监视的数据

- toRefs
  把一个响应式对象转换成普通对象，该普通对象的每个 property 都是一个 ref
  应用: 当从合成函数返回响应式对象时，toRefs 非常有用，这样消费组件就可以在不丢失响应式的情况下对返回的对象进行分解使用
  问题: reactive 对象取出的所有属性值都是非响应式的
  解决: 利用 toRefs 可以将一个响应式 reactive 对象的所有原始属性转换为响应式的 ref 属性

### suspense

待补充

## treeshaking

体积更小
通过 webpack 的 tree-shaking 功能，可以将无用模块“剪辑”，仅打包需要的

能够 tree-shaking，有两大好处：

对开发人员，能够对 vue 实现更多其他的功能，而不必担忧整体体积过大

对使用者，打包出来的包体积变小了

## compositon Api

可与现有的 Options API 一起使用
灵活的逻辑组合与复用
Vue3 模块可以和其他框架搭配使用

## 更好的 Typescript 支持

VUE3 是基于 typescipt 编写的，可以享受到自动的类型定义提示

## 编译阶段

### 静态提升

- 在 Vue2 中，每次渲染时都会重新创建 VNode 节点，即使是静态节点也会被重新创建。这会导致一些不必要的性能损耗。
- 而在 Vue3 中，引入了静态提升的概念，它会将静态节点在编译阶段提升为常量，避免了重复创建的开销。类似于 react 防止组件重新渲染时变量重新声明而做的优化。
  对于下面的这些情况静态节点会被提升
  - 元素节点
  - 没有绑定动态内容

```js
// Vue2的静态节点
render(){
  return createVNode("h1", null, "Hello World")
  // ...
}
// Vue3的静态节点
const hoisted = createVNode("h1", null, "Hello World")
function render(){
  // 直接使用 hoisted 即可
}
```

### 预字符串化

预字符串化（Pre-stringification）是一种优化技术，用于处理大量静态内容。它可以将静态内容在编译时转换为字符串，以减少运行时的计算和处理。

```html

<template>
  <div>
    <h1>{{ title }}</h1>
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: '静态标题',
      items: [
        { id: 1, name: '静态项1' },
        { id: 2, name: '静态项2' },
        { id: 3, name: '静态项3' }
      ]
    };
  }
const _hoisted_1 = { class: "title" };
const _hoisted_2 = { class: "item" };
return (_ctx) => {
  return (
    _openBlock(),
    _createBlock("div", null, [
      _createVNode(
        "h1",
        _hoisted_1,
        _toDisplayString(_ctx.title),
        1 /* TEXT */
      ),
      _createVNode("ul", null, [
        (_openBlock(true),
        _createBlock(
          _Fragment,
          null,
          _renderList(_ctx.items, (item) => {
            return (
              _openBlock(),
              _createBlock(
                "li",
                _hoisted_2,
                _toDisplayString(item.name),
                1 /* TEXT */
              )
            );
          }),
          256 /* UNKEYED_FRAGMENT */
        )),
      ]),
    ])
  );
};
```

### 缓存事件处理函数

在 Vue2 中，每次渲染时都会重新创建事件处理函数，即使是相同的事件处理逻辑。这会导致一些不必要的性能损耗。而在 Vue3 中，引入了缓存事件处理函数的概念，它会将事件处理函数在编译阶段缓存起来，避免了重复创建的开销。
下面是一个 Vue2 和 Vue3 的编译结果对比示例：

```js
// vue2
render(ctx){
  return createVNode("button", {
    onClick: function($event){
      ctx.count++;
    }
  })
}
// vue3
render(ctx, _cache){
  return createVNode("button", {
    onClick: cache[0] || (cache[0] = ($event) => (ctx.count++))
  })
}
```

通过缓存事件处理函数，Vue3 避免了在每次渲染时重新创建事件处理函数的开销，从而提高了渲染性能。

## Block Tree

在 Vue2 中，模板中的条件渲染和循环渲染会导致大量的 VNode 节点创建和销毁，这会影响渲染性能。而在 Vue3 中，引入了 Block Tree 的概念，它会将条件渲染和循环渲染的内容封装为一个单独的 Block，避免了大量的 VNode 节点创建和销毁。
通过使用 Block Tree，Vue3 将条件渲染和循环渲染的内容封装为一个单独的 Block，避免了大量的 VNode 节点创建和销毁，从而提高了渲染性能。
另外 在 Vue2 中，模板编译后会生成一个单一的渲染函数，该函数负责处理整个模板的渲染逻辑。这意味着每次更新时，整个模板都会重新渲染，即使其中只有一小部分内容发生了变化。
而在 Vue3 中，编译后的模板会被拆分成多个块（blocks），每个块对应一个节点或一组节点。这些块可以被独立地更新和渲染，从而避免了不必要的渲染操作。

### PatchFlag

在 Vue2 中，每次渲染时都会对整个 VNode 进行比较和更新，即使只有部分内容发生了变化。这会导致一些不必要的性能损耗。而在 Vue3 中，引入了 PatchFlag 的概念，它会标记 VNode 中哪些部分发生了变化，从而只对变化的部分进行比较和更新。
下面是一个 Vue2 和 Vue3 的编译结果对比示例：

> 引用 https://developer.aliyun.com/article/1410650#slide-1
