# Vue Router

## 原理

### history 模式

提供不刷新跳转、前进后退

利用浏览器原生的**window.history**提供的 pushState 、 replaceState 实现，但浏览器提供的事件 popstate， 只能在用户点击浏览器前进后退或者 window.history.go() 、 .back() 时被触发，不能完全实现路由库监听 location 变化触发重渲染。因此，可以先对 window.history 做一层增强封装

## 钩子函数

除了 after 钩子，参数都是 to from next

全局路由钩子：
beforeEach(to,from, next)、beforeResolve(to,from, next)、afterEach(to,from)；

这个钩子和 beforeEach 类似，也是路由跳转前触发，参数也是 to,from,next 三个，和 beforeEach 区别官方解释为：
区别是在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被调用。
即在 beforeEach 和 组件内 beforeRouteEnter 之后，afterEach 之前调用。

独享路由钩子：
beforeEnter(to,from, next)；

组件内路由钩子：
beforeRouteEnter(to,from, next)、beforeRouteUpdate(to,from, next)、beforeRouteLeave(to,from, next)

to：目标路由对象 router；
from：即将要离开的路由对象；

```
next：他是最重要的一个参数，他相当于佛珠的线，把一个一个珠子逐个串起来。以下注意点务必牢记： 1.但凡涉及到有 next 参数的钩子，必须调用 next() 才能继续往下执行下一个钩子，否则路由跳转等会停止。 2.如果要中断当前的导航要调用 next(false)。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。（主要用于登录验证不通过的处理） 3.当然 next 可以这样使用，next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。意思是当前的导航被中断，然后进行一个新的导航。可传递的参数与 router.push 中选项一致。
```

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

## $route和$router

1.$router为VueRouter实例，想要导航到不同URL，则使用$router.push 方法,上面还有各种路由守卫
2.$route 为当前 router 跳转对象，里面可以获取 name、path、query、params 等

## query 参数和 params 参数

### query 参数

push 方法传对象就行

```js
传参: this.$router.push({
  path: "/xxx",
  query: {
    id: id,
  },
});

接收参数: this.$route.query.id;
```

### params 参数

```js
传参: this.$router.push({
  name: "xxx",
  params: {
    id: id,
  },
});

接收参数: this.$route.params.id;
```

注意:params 传参，push 里面只能是 name:'xxxx',不能是 path:'/xxx',因为 params 只能用 name 来引入路由，如果这里写成了 path，接收参数页面会是 undefined！！！

## router-link

active 状态会增加类名

router-link-active

配合 less 使用

```js
        .tab_item{
            flex: 1;
            text-align: center;
            .tab_item_link{
                padding-bottom: 5px;
/*               灰字 */
                color: $color-text-l;
            }
/*  ******         router-link-激活时的类名，和.tab_item并列一下 */
            &.router-link-active{
                .tab_item_link{
                    color: $color-theme;
                    border-bottom: 2px solid $color-theme;
                }
            }
        }
```
