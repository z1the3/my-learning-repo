# setup

:::warning
在 setup 中你应该避免使用 this，因为它不会找到组件实例。setup 的调用发生在 data property、computed property 或 methods 被解析之前，所以它们无法>在 setup 中被获取。
:::

它是 Vue3 的一个新语法糖，在 setup 函数中。所有 ES 模块导出都被认为是暴露给上下文的值，并包含在 setup() 返回对象中。相对于之前的写法，使用后，语法也变得更简单

在添加了 setup 的 script 标签中，我们不必声明和方法，这种写法会自动将所有顶级变量、函数，均会自动暴露给模板（template）使用
这里强调一句 “暴露给模板，跟暴露给外部不是一回事”

## 引入组件

在 script setup 中，引入的组件可以直接使用，无需再通过 components 进行注册，并且无法指定当前组件的名字，它会自动以文件名为主，也就是不用再写 name 属性了。示例

```html
<template>
  <HelloWorld />
</template>

<script setup>
  import HelloWorld from "./components/HelloWorld.vue"; //此处使用 Vetur 插件会报红
</script>
```

如果需要定义类似 name 的属性，可以再加个平级的 script 标签，在里面实现即可。
