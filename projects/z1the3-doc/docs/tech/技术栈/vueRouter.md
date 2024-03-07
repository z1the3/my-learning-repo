# Vue Router

## 进阶

### RouterView 插槽

RotuerView 组件暴露了一个插槽，可以用来渲染路由组件：

```html
<router-view v-slot="{ Component }">
  <component :is="Component" />
</router-view>
```

上面的代码等价于不带插槽的`<router-view />`，但是当我们想要获得其他功能时，插槽提供了额外的扩展性。

当在处理 KeepAlive 组件时，我们通常想要保持路由组件活跃，而不是 RouterView 本身。为了实现这个目的，我们可以将 KeepAlive 组件放置在插槽内：

```html
<router-view v-slot="{ Component }">
  <transition>
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </transition>
</router-view>
```

因为 router-view 的渲染内容在路由配置时定义的

这里是从更高层 override, 给渲染内容加上 keep-alive

使用插槽可以让我们直接将模板引用放置在路由组件上

而如果我们将引用放在 `<router-view>` 上，那引用将会被 RouterView 的实例填充，而不是路由组件本身。

```html
<router-view v-slot="{ Component }">
  <component :is="Component" ref="mainContent" />
</router-view>
```
