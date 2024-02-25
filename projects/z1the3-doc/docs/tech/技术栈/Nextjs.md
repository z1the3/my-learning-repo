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
