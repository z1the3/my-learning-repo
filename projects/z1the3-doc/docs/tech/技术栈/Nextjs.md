# Nextjs

## 主要功能

|特性|描述|
|:---|:---:|
|Routing|在服务端组件顶层拥有基于路由的文件系统，<br/>支持布局，嵌套路由，加载态，错误捕获等|
|Rendering|分别对CSR和SSR组件进行CSR和SSR渲染。<br/>对动态（流式）和静态渲染对优化|
|Data Fetching|简化服务端组件对数据获取，扩展fetch用于请求记忆化，数据缓存与更新|
|Styling|支持css modules,tailwind, css-in-js|
|Optimizations|图片字体和脚本优化提升体验|
|Typescript|支持typescript，并且有更好的类型检测和高效编译，支持ts插件|

## 服务端组件

## App Router vs Page Router

App Router支持React最新功能，如服务端组件和流

Page Router是Nextjs原先的路由，支持构建SSR应用并支持旧Nextjs app

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

#### 创建UI

##### Pages

利用pages创建对路由来说独一无二的UI, 例如

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

使用export default 创建 react组件

Pages默认是服务端组件，也可以改为客户端组件

Pages能负责获取数据

##### Layouts

利用layouts来分享不同路由下的UI

例如导航，`layout.js`能保留状态，甚至在没渲染的情况下

使用export default 创建 react组件

该组件能接受一个参数，是子layout或者正在渲染的page

```js
export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <nav></nav>
 
      {children}
    </section>
  )
}
```

##### Root Layout

是必须的，被定义在顶层app目录

必须要包括 html 和 body 标签 (而且只有root layout能拥有)

允许用来修改从服务端返回的初始html

```js
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* Layout UI */}
        <main>{children}</main>
      </body>
    </html>
  )
}
```

通过父级layout向子级layout传递数据不可行

但是可以利用data fetching

父子级都请求同一个数据源，然后React会自动合并请求，而不影响性能

layout无法访问其自身下方的segment。要访问所有segment，您可以在客户端组件中使用

useSelectedLayoutSegment或

useSelectedLayoutSegments

##### Templates

可以用来包裹每一个子layout和page

能为每个children创建一个新实例

新实例：state和effect和elements都会更新

用于帮助实现依赖useEffect（登陆页）和useState（单页面feedback）的特性

更改默认框架行为。例如，布局内的 Suspense Boundaries 仅在第一次加载布局时显示回退，而不是在切换页面时显示回退。对于模板，后备显示在每个导航上。

```js
export default function Template({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

<Layout>
  {/* Note that the template is given a unique key. */}
  <Template key={routeParam}>{children}</Template>
</Layout>
```

##### Metadata

在app目录中，您可以修改HTML 元素，如`head>`例如，使用元数据 API, title

元数据可以通过导出或文件中的metadata对象或generateMetadata函数来定义。layout.jspage.js

```js
import { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Next.js',
}
 
export default function Page() {
  return '...'
}

```

### linking 和导航

有四种导航方式

#### `<Link>`组件

路由导航的基本且nextjs推荐

扩展了a标签

提供 prefetching 和路由间的客户端导航

```js
import Link from 'next/link'
 
export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>
}

```

**实现标签active状态检验**

使用`usePathname()`钩子

```js
import { usePathname } from 'next/navigation'

  const pathname = usePathname()

  <Link className={`link ${pathname === '/' ? 'active' : ''}`} href="/">
    Home
  </Link>
```

**实现滚动到特定id**

和原生a标签同理，利用锚点

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
</Link>

router.push('/dashboard', { scroll: false })
```

**客户端组件`useRouter`hook**

```js
'use client'

  const router = useRouter()
 
  return 
    <button type="button" onClick={() => router.push('/dashboard')}>
      Dashboard
    </button>

```

**服务端组件`redirect`函数**

```js
import { redirect } from 'next/navigation'

    redirect('/login')
```

> redirect默认返回307（临时重定向）

> 但是在服务端action返回303（see other）

> 常常用于post请求成功页

---

> redirect 内部封装了抛出错误，所以放在try/catch块外

> redirect也可以用于服务端组件，但是只在渲染阶段有效，事件捕获阶段无效

> 如果想在渲染进程前进行redirect，需要配置next.config.js或中间件

#### 原生`History API`

 `window.history.pushState` 和 `window.history.replaceState`

`pushState`和`replaceState`调用能灌溉进next.js

所以可以和`usePathname`与`useSearchParams`同步调用

`pushState`加入历史栈，用户可回退

`replaceState`不可回退

```js
  const searchParams = useSearchParams()
 
  function updateSorting(sortOrder: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortOrder)
    window.history.pushState(null, '', `?${params.toString()}`)
  }



  const pathname = usePathname()
 
  function switchLocale(locale: string) {
    // e.g. '/en/about' or '/fr/contact'
    const newPath = `/${locale}${pathname}`
    window.history.replaceState(null, '', newPath)
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

动态路由：预取默认为自动。 只有共享布局，沿着渲染的组件“树”向下直到第一个loading.js 文件，会被预取并缓存 30 秒。 这降低了获取整个动态路线的成本，这意味着您可以显示即时加载状态，以便为用户提供更好的视觉反馈。

通过将 prefetch 设为false可以禁用prefetching

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
