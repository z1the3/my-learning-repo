# 路由和 UI

## 定义路由

### 如何创建路由

基于文件路由系统创建路由

```
a.com/segment1/segment2

创建app/segment1/segment2

一般来说每一个segment下都有对应的page.[js,jsx,tsx]

否则该segment不可访问，只能用来存储组件，样式表等相关文件
```

### Pages（独一无二 UI）

利用 pages 创建对该路由来说独一无二的 UI, 例如

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

### Layouts（共享 UI，保留状态）

```
- segment
  - layout.js // 用于共享
  - page.js
  - segment2
    - page.js

```

利用 layouts 来分享不同路由下的 UI，在导航时，布局保留状态、保持交互性并且不重新渲染。布局也可以嵌套。

例如导航，`layout.js`能保留状态，甚至在没渲染的情况下

使用 export default 创建 react 组件

该组件能接受一个参数，是子 layout 或者正在渲染的 page

```js
// 路由名+ Layout
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

### Root Layout

是必须的，被定义在顶层 app 目录

必须要包括 html 和 body 标签 (而且只有 root layout 能拥有)

允许用来修改从服务端返回的初始 html(通过修改 html 和 body)

一切 layout 都会作为 children 在 rootLayout 中出现

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

layout 无法访问其自身下方的 segment，只能把它插入。要访问所有 segment，您可以在客户端组件中使用

useSelectedLayoutSegment 或

useSelectedLayoutSegments

#### 嵌套

layout 可以嵌套，在不同层级的 segment 下准备一套 layout 就可以自动嵌套

### Templates

可以用来包裹每一个子 layout 和 page

能为每个 children 创建一个新实例

新实例：state 和 effect 和 elements 都会更新

这意味着当用户在拥有共享模板的路由之间导航时，将挂载组件的新实例，重新创建 DOM 元素，不保留状态，并且重新同步效果。

用于帮助实现依赖 useEffect（登陆页）和 useState（单页面 feedback）的特性

更改默认框架行为。例如，布局内的 Suspense Boundaries 仅在第一次加载布局时显示回退，而不是在切换页面时显示回退。对于模板，后备显示在每个导航上

。

```js
export default function Template({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

通过在共享的layout中嵌套template，静中寻动
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

## 路由组

文件夹的名称会被映射到路由里
将文件夹标记为路由组，可以防止名称被映射

用处在于

- 方便路由管理，而不影响真正路由
- 在某一 segment 下创建多个嵌套 layout

路由组的命名除了用于组织之外没有特殊意义。它们不影响 URL 路径

包含路由组的路由不应解析为与其他路由相同的 URL 路径。例如，由于路由组不会影响 URL 结构，(marketing)/about/page.js 因此(shop)/about/page.js 会解析/about 并导致错误

如果您使用多个根布局而没有顶级 layout.js 文件，则您的主 page.js 文件应在其中一个路由组中定义，例如：app/(marketing)/page.js

在多个根布局之间跳转将导致完整页面加载
从/app/(shop)/layout.js 到 /app/(marketing)/layout.js 将导致整个页面加载

### 使用

将文件夹名称括在括号中来创建路由组：`(folderName)`

```js
- (marketing)
  - about  -> /about
  - blog -> /blog
- main -> /main
```

平行路由也可以创建公用 layout 了,而且是独属于这个路由组的

```js
- (marketing)
  - layout.js
  - about  -> /about
  - blog -> /blog
```

### 创建多个 root layout

删除顶级 layout.js 文件，然后 在每个路由组内添加一个 layout.js

对于将应用程序划分为具有完全不同的 UI 或体验的部分非常有用

注意需要将`<html>`和标签`<body>`添加到每个根布局中。

## 动态路由

当事先不知道确切的路由名称并希望从动态数据创建路由时，

可以使用动态路由，动态路由会在访问该路由时填充，或在构建时预渲染

### 使用

可以通过将文件夹名称括在方括号中来创建路由： `[folderName]`。例如，`[id]`或`[slug]`。

该 segment 作为 prop 通过 params 传递给 layout、page、route 和 generateMetadata 函数。

```js
export default function Page({ params }: { params: { slug: string } }) {
  return <div>My Post: {params.slug}</div>;
}
```

```
app/blog/[slug]/page.js   /blog/a   { slug: 'a' }
app/blog/[slug]/page.js  /blog/b   { slug: 'b' }
app/blog/[slug]/page.js   /blog/c   { slug: 'c' }
```

通过在括号内添加省略号，可以扩展动态段以捕获所有`[...folderName]`后续段。

例如，`app/shop/[...slug]/page.js`将匹配`/shop/clothes`，但也匹配`/shop/clothes/tops`, /`shop/clothes/tops/t-shirts`，等等, 可以无限延长

`app/shop/[...slug]/page.js /shop/a/b/c { slug: ['a', 'b', 'c'] }`

通过将参数包含在双方括号中，可以使扩展段成为可选[[...folderName]]

`app/shop/[[...slug]]/page.js /shop {}`

## 平行路由

平行路由允许您同时渲染同一布局中的一个或多个页面。
它们对于应用程序的高度动态部分非常有用，例如图表和社交网站上的提要

您可以使用并行路由来同时渲染 team 和 analytics 页面

### 使用

通过`@folderName`来定义

```
- app
  - @analytics
    - page.js
  - @team
    - page.js
  - layout.js
  - page.js
```

现在父 layout 可以拿到 analytics 和 team 了

```js
export default function Layout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  team: React.ReactNode
}) {
  return (
    <>
      {children}
      {team}
      {analytics}
    </>
  )
}
```

不会影响 URL 结构

### 条件路由

您可以使用并行路由根据某些条件（例如用户角色）有条件地渲染路由。
例如，要为/admin 或/user 角色呈现不同的图表页面：

```
- app
  - @user
    - page.js
  - @admin
    - page.js
  - layout.js
  - page.js
```

```js
import { checkUserRole } from '@/lib/auth'

export default function Layout({
  user,
  admin,
}: {
  user: React.ReactNode
  admin: React.ReactNode
}) {
  const role = checkUserRole()
  return <>{role === 'admin' ? admin : user}</>
}
```

在平行路由中也能设置 用户能自己跳过去的页面

在创建选项卡时很有用

例如，@analytics 插槽有两个子页面：/page-views 和/visitors

```
- analytics
  - page-views
    - page.js
  - visitors
    - page.js
  - layout.js
```

在@analytics 中，创建一个 layout 文件以在两个页面之间共享选项卡：

```js
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Link href="/page-views">Page Views</Link>
        <Link href="/visitors">Visitors</Link>
      </nav>
      <div>{children}</div>
    </>
  );
}
```

### 模态框

平行路由可以与**拦截路由**一起配合使用来创建模态框

场景：用户可以使用 link 打开登录模态框，或访问单独的/login 页面

```
- app
  - login
    - page.tsx
  - @auth
    - default.tsx
    - (.)login
      - page.tsx
```

```js
import { Login } from "@/app/ui/login";

export default function Page() {
  return <Login />;
}
```

在@auth 槽内添加 default.tsx 返回 null.这可确保模态框在不活动时不会呈现。

```js
export default function Default() {
  return null;
}
```

在@auth 内 ，/login 下增加/(.)login 文件夹来拦截路由。将`<Modal>`组件及其子组件导入到/(.)login/page.tsx 文件中

```js
import { Modal } from "@/app/ui/modal";
import { Login } from "@/app/ui/login";

export default function Page() {
  return (
    <Modal>
      <Login />
    </Modal>
  );
}
```

#### 打开模态框

利用 link 和拦截路由，实现激活模态

```js
import Link from 'next/link'

export default function Layout({
  auth,
  children,
}: {
  auth: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <>
      <nav>
        <Link href="/login">Open modal</Link>
      </nav>
      <div>{auth}</div>
      <div>{children}</div>
    </>
  )
}
```

#### 关闭

可以通过调用 `router.back()`或使用组件来关闭模式 Link

```js
"use client";

import { useRouter } from "next/navigation";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => {
          router.back();
        }}
      >
        Close modal
      </button>
      <div>{children}</div>
    </>
  );
}
```

## 拦截路由

拦截路由能支持把应用另一部分的 layout 加载到当前路由上
可以在用户未切换上下文（路由）时，展现其他路由的内容

比如，点击列表详情，弹出模态框

模态框被实现在另一个路由

nextjs 会拦截路由的跳转，虽然 URL 变成模态框对应的路由

但是页面内容是原路由内容上弹出模态框

另外直接跳转列表详情路由，不会触发拦截，且直接跳转到

### 使用

通过`(..)`, 类似于`../`

`(.)` 匹配当前层路由
`(..)` 匹配上一层路由
`(..)(..)` 匹配上两层路由
`(...)` 从最顶层路由匹配

```
- feed
  - layout.js
  - (..)photo
    - [id]
      - page.js
- photo //本体
  - [id]
  - page.js
```

注意`(..)`基于实际路由段而不是文件结构

### 使用场景

模态框
