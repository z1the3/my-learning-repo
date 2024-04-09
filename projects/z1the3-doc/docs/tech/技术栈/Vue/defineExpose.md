# defineExpose

> 在 Vue3 中，父组件可通过创建一个 ref(null)，然后将赋值的元素写在当前子组件上即可，在需要的时候，通过> 定义的响应式变量即可获取，获取后即可取得当前子组件内部 dom 以及当前子组件内部变量方法等，并且直接使用> 子组件内部方法。但是有时候获取的时候返回的没有什么信息只有一个`{\_v_skin:true}`这个信息，这条信息表示> 数据无法响应。

```
原因： 使用 <script setup> 语法糖的组件是默认关闭的，也即通过模板 ref 或者 $parent 链获取到的组件的公开实例，不会暴露任何在 <script setup>中声明的绑定。
方法： 为了在 <script setup> 语法糖组件中明确要暴露出去的属性，使用 defineExpose 编译器宏将需要暴露出去的变量与方法放入暴露出去就可以.
```

Vue3 中的 setup 默认是封闭的，如果要从子组件向父组件暴露属性和方法，需要用到 defineExpose。
和 defineProps、defineEmits 一样，这三个函数都是内置的，不需要 import,不过 defineProps,defineEmits 都会返回一个实例，而 defineExpose 是没有返回值的。

## 引用

https://juejin.cn/post/7202868242363711525
