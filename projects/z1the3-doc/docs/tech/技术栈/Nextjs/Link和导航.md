# linking 和导航

有四种导航方式

## 导航方式

**`<Link>`组件**

路由导航的基本且 nextjs 推荐

扩展了 a 标签

提供 prefetching 和路由间的客户端导航

```js
import Link from "next/link";

export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>;
}
```

**实现标签 active 状态检验**

使用`usePathname()`钩子

```js
import { usePathname } from 'next/navigation'

  const pathname = usePathname()

  <Link className={`link ${pathname === '/' ? 'active' : ''}`} href="/">
    Home
  </Link>
```

**实现滚动到特定 id**

和原生 a 标签同理，利用锚点

```html
<Link href="/dashboard#settings">Settings</Link>
```

**禁用默认滚动恢复**

页面前进后退会默认恢复上一次的滚动条位置

可以禁止

```js
// next/link
<Link href="/dashboard" scroll={false}>
  Dashboard
</Link>;

router.push("/dashboard", { scroll: false });
```

**客户端组件`useRouter`hook**

```js
"use client";

const router = useRouter();

return;
<button type="button" onClick={() => router.push("/dashboard")}>
  Dashboard
</button>;
```

**服务端组件`redirect`函数**

```js
import { redirect } from "next/navigation";

redirect("/login");
```

> redirect 默认返回 307（临时重定向）

> 但是在服务端 action 返回 303（see other）

> 常常用于 post 请求成功页

---

> redirect 内部封装了抛出错误，所以放在 try/catch 块外

> redirect 也可以用于服务端组件，但是只在渲染阶段有效，事件捕获阶段无效

> 如果想在渲染进程前进行 redirect，需要配置 next.config.js 或中间件

## 原生`History API`

`window.history.pushState` 和 `window.history.replaceState`

`pushState`和`replaceState`调用能灌溉进 next.js

所以可以和`usePathname`与`useSearchParams`同步调用

`pushState`加入历史栈，用户可回退

`replaceState`不可回退

```js
const searchParams = useSearchParams();

function updateSorting(sortOrder: string) {
  const params = new URLSearchParams(searchParams.toString());
  params.set("sort", sortOrder);
  window.history.pushState(null, "", `?${params.toString()}`);
}

const pathname = usePathname();

function switchLocale(locale: string) {
  // e.g. '/en/about' or '/fr/contact'
  const newPath = `/${locale}${pathname}`;
  window.history.replaceState(null, "", newPath);
}
```

### 工作原理

App Router 使用混合方法进行路由和导航。
在服务器上，您的应用程序代码会自动按路由段进行代码分割。
在客户端，Next.js 预取并缓存路由段。
这意味着，当用户导航到新路由时，浏览器不会重新加载页面，
而只会重新渲染发生更改的路线段，从而改善导航体验和性能。

1. 代码分割
   代码分割允许您将应用程序代码分割成更小的包，以供浏览器下载和执行。
   这减少了每个请求的传输数据量和执行时间，从而提高了性能。（懒加载）

服务器组件允许您的应用程序代码自动按路由段进行代码分割。
这意味着导航时仅加载当前路线所需的代码。

2. 路由预加载

预加载是一种在用户访问路由之前在后台预加载路由的方法。

Next.js 中预取路由的方式有两种：

`<Link> 组件`：当路由在用户视口中可见时，会自动预取路由
router.prefetch()：useRouter 钩子可用于以编程方式预取路由。
对于静态和动态路由，`<Link>` 的预取行为是不同的：

静态路由：预取默认为 true。 整个路由被预取并缓存。

动态路由：预取默认为自动。 只有共享布局，沿着渲染的组件“树”向下直到第一个 loading.js 文件，会被预取并缓存 30 秒。 这降低了获取整个动态路线的成本，这意味着您可以显示即时加载状态，以便为用户提供更好的视觉反馈。

通过将 prefetch 设为 false 可以禁用 prefetching

**预加载**只需要在生产环境启用，开发环境不需要

3. 缓存

Next.js 有一个内存运行时客户端缓存，称为路由缓存。
当用户在应用程序中导航时，预加载的路由段和访问过的路由的 React Server 组件有效负载将存储在缓存中。

这意味着在导航时，缓存会被尽可能地重用，而不是向服务器发出新的请求 - 通过减少请求和传输的数据数量来提高性能。

4. 部分渲染
   部分渲染意味着仅在客户端上重新渲染导航时发生变化的路线段，并且保留所有共享段。

例如，当在两个同级路由 /dashboard/settings 和 /dashboard/analytics 之间导航时，将呈现设置和分析页面，并且将保留共享的仪表板布局。

5. 前进和后退

默认情况下，Next.js 将维护向后和向前导航的滚动位置，并重用路由缓存中的路由片段。
