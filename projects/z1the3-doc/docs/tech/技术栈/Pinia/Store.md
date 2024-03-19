# Store

Store 是用 defineStore() 定义的，它的第一个参数要求是一个独一无二的名字：

```js
import { defineStore } from "pinia";

// 你可以任意命名 `defineStore()` 的返回值，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。
// (比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useAlertsStore = defineStore("alerts", {
  // 其他配置...
});
```

```html
// 使用

<script setup>
  import {useCounterStore} from '@/stores/counter' // 可以在组件中的任意位置访问
  `store` 变量 ✨ const store = useCounterStore()
</script>
;
```

这个名字 ，也被用作 id ，是必须传入的， Pinia 将用它来连接 store 和 devtools。为了养成习惯性的用法，将返回的函数命名为 use... 是一个符合组合式函数风格的约定

### 从 Store 解构

为了从 store 中提取属性时保持其响应性，你需要使用 storeToRefs()。它将为每一个响应式属性创建引用。当你只使用 store 的状态而不调用任何 action 时，它会非常有用。请注意，你可以直接从 store 中解构 action，因为它们也被绑定到 store 上：

```html
<script setup>
  import { storeToRefs } from "pinia";
  const store = useCounterStore();
  // `name` 和 `doubleCount` 是响应式的 ref
  // 同时通过插件添加的属性也会被提取为 ref
  // 并且会跳过所有的 action 或非响应式 (不是 ref 或 reactive) 的属性
  const { name, doubleCount } = storeToRefs(store);
  // 作为 action 的 increment 可以直接解构
  const { increment } = store;
</script>
```
