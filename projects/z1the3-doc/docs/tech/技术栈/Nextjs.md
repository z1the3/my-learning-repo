# Nextjs

## 主要功能

| 特性          |                                        描述                                         |
| :------------ | :---------------------------------------------------------------------------------: |
| Routing       | 在服务端组件顶层拥有基于路由的文件系统，<br/>支持布局，嵌套路由，加载态，错误捕获等 |
| Rendering     |   分别对 CSR 和 SSR 组件进行 CSR 和 SSR 渲染。<br/>对动态（流式）和静态渲染对优化   |
| Data Fetching |         简化服务端组件对数据获取，扩展 fetch 用于请求记忆化，数据缓存与更新         |
| Styling       |                        支持 css modules,tailwind, css-in-js                         |
| Optimizations |                             图片字体和脚本优化提升体验                              |
| Typescript    |            支持 typescript，并且有更好的类型检测和高效编译，支持 ts 插件            |

## 服务端组件

## App Router vs Page Router

App Router 支持 React 最新功能，如服务端组件和流

Page Router 是 Nextjs 原先的路由，支持构建 SSR 应用并支持旧 Nextjs app

## 项目结构

## 路由

### 定义路由

#### 创建路由

基于文件路由系统

```
a.com/segment1/segment2

创建app/segment1/segment2

一般来说每一个segment下都有对应的page.[js,jsx,tsx]

否则该segment不可访问，只能用来存储组件，样式表等相关文件
```

#### 创建 UI

##### Pages

利用 pages 创建对路由来说独一无二的 UI, 例如

```js
// `app/page.tsx` is the UI for the `/` URL
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}

// `app/dashboard/page.tsx` is the UI for the `/dashboard` URL
export default function Page() {
  return <h1>Hello, Dashboard Page!</h1>
}
```

使用 export default 创建 react 组件

Pages 默认是服务端组件，也可以改为客户端组件

Pages 能负责获取数据

##### Layouts

利用 layouts 来分享不同路由下的 UI

例如导航，`layout.js`能保留状态，甚至在没渲染的情况下

使用 export default 创建 react 组件

该组件能接受一个参数，是子 layout 或者正在渲染的 page

```js
export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode,
}) {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <nav></nav>

      {children}
    </section>
  );
}
```

##### Root Layout

是必须的，被定义在顶层 app 目录

必须要包括 html 和 body 标签 (而且只有 root layout 能拥有)

允许用来修改从服务端返回的初始 html

```js
export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang="en">
      <body>
        {/* Layout UI */}
        <main>{children}</main>
      </body>
    </html>
  );
}
```

通过父级 layout 向子级 layout 传递数据不可行

但是可以利用 data fetching

父子级都请求同一个数据源，然后 React 会自动合并请求，而不影响性能

layout 无法访问其自身下方的 segment。要访问所有 segment，您可以在客户端组件中使用

useSelectedLayoutSegment 或

useSelectedLayoutSegments

##### Templates

可以用来包裹每一个子 layout 和 page

能为每个 children 创建一个新实例

新实例：state 和 effect 和 elements 都会更新

用于帮助实现依赖 useEffect（登陆页）和 useState（单页面 feedback）的特性

更改默认框架行为。例如，布局内的 Suspense Boundaries 仅在第一次加载布局时显示回退，而不是在切换页面时显示回退。对于模板，后备显示在每个导航上。

```js
export default function Template({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

<Layout>
  {/* Note that the template is given a unique key. */}
  <Template key={routeParam}>{children}</Template>
</Layout>;
```

##### Metadata

在 app 目录中，您可以修改 HTML 元素，如`head>`例如，使用元数据 API, title

元数据可以通过导出或文件中的 metadata 对象或 generateMetadata 函数来定义。layout.jspage.js

```js
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js",
};

export default function Page() {
  return "...";
}
```

### linking 和导航

有四种导航方式

#### `<Link>`组件

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

#### 原生`History API`

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

##### 工作原理

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

## 渲染

### 客户端组件

客户端组件允许您编写可在请求时在客户端上呈现的交互式 UI。

在 Next.js 中，客户端渲染是可选的，这意味着您必须明确决定 React 应在客户端上渲染哪些组件。

#### 客户端渲染的好处

交互性：客户端组件可以使用 state、effect 和事件侦听器，这意味着它们可以向用户提供即时反馈并更新 UI。
浏览器 API：客户端组件可以访问浏览器 API，例如地理位置或本地存储，允许您为特定用例构建 UI。

"use client"用于声明服务器和客户端组件模块之间的边界。

这意味着通过"use client"，导入到其中的所有其他模块（包括子组件）都被视为客户端捆绑包的一部分。

layout 层以及 layout 引用的外层组件（服务端组件），不用标注 use client

服务端组件中再引用了使用 state/effect 等的客户端组件，则具体到该客户端组件， 才标注 use client

:::note

定义多个 use client 入口点：

您可以在 React 组件树中定义多个“使用客户端”入口点。这允许您将应用程序拆分为多个客户端包（或分支）。

但是，"use client"不需要在需要在客户端呈现的每个组件中进行定义。定义边界后，导入其中的所有子组件和模块都被视为客户端捆绑包的一部分。

:::

---

客户端组件的渲染过程：

1.服务端返回初始 HTML 用于立即显示快速非交互式的路由
2.RSC 同时调和客户端和服务端组件树，并更新 DOM。
3.JavaScript 水合客户端组件并使其 UI 具有交互性。

客户端组件后续不需要服务器返回 html
