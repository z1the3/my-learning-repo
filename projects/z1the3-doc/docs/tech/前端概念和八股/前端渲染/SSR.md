# SSR（实现同构直出）

Server Side Rendering

SSR 的概念，即与 CSR 相对地，在服务端完成大部分渲染工作

一开始还没有如今的前端的时候，页面的呈现方式——服务器在响应站点访问请求的时候，就已经渲染好可供呈现的页面

SSR 即服务端渲染（ Server Side Rendering ）， 与客户端渲染相对，在服务端生成完整的 HTML 返回给客户端，也就是说，在服务端响应页面请求的时候就已经返回了所有的 HTML 内容，客户端只需要完成事件的绑定即可。

## 选型建议

- 前端要处理 node server 的机器环境 代码部署 日志 容灾 监控等以往后端人员需要的运维知识
- 前端开发周期增加

## 应用

在 Next.js 中，提供了诸如 getInitialProp 和 getServerSideProps 这样的钩子函数来进行服务端的数据预取，使用姿势如下:

```js
function SSR(props: { data: Todo[] }) {
  return (
    <div>
      <h2 className={styles.title}>Server Side Render:</h2>
      {props.data.map((item: Todo) => {
        return (
          <div className={styles.container} key={item.id}>
            <span className={styles.id}>ID：{item.id}</span>
            <span className={styles.content}>Content: {item.content}</span>
          </div>
        );
      })}
    </div>
  );
}

// 进行数据预取
SSR.getInitialProps = async () => {
  const response = await fetch("http://localhost:4000/data");
  const data = await response.json();
  return { data };
};

export default SSR;
```

这样，Next.js 会在服务端调用这些数据预取的函数，将结果作为 props 传给组件，最后通过调用 React 提供的 renderToString 将组件渲染成字符串，并且完成一些模板内容的拼接，最后返回 HTML 字符串到客户端。

## 简述原理

nextjs 使用 ReactDOM/Server 的 renderToString()方法

nuxtjs 使用 vue-server-render 调用 renderToString()方法

像 React、Vue 这样的 UI 生态巨头，其实都有一个关键的 Virtual DOM (or VDOM) 概念——浏览器 DOM API 太慢，先自己建模处理视图表现与更新、再批量调 DOM API 完成视图渲染更新。这就带来了一种 SSR 方案：

VDOM 是自建模型，是一种抽象的嵌套数据结构，也就可以在 Node 环境（或者说一切服务端环境）下跑起来，把原来的视图代码拿来在服务端跑，通过 VDOM 维护，再在最后拼接好字符串作为页面响应，生成文档作为响应页面，此时的页面内容已经基本生成完毕，

把逻辑代码、样式代码附上，则可以实现完整的、可呈现页面的响应。

在此基础上，另外对于一些**需要在客户端激活的内容或触发的操作**，如 Vue 实例接管组件行为、React Effect 在客户端的触发执行，则由编译时生成 Bundle，并在响应页面内的超链接脚本额外附着。

SSR 方案发展在 CSR 之后再次得到推进，很大程度上就是为了解决 CSR 的一些问题，这也是

## SSR 相较之下突出的优势

- 呈现速度和用户体验佳：SSR 对比 CSR，少了很多页面到达浏览器之后的解析、资源加载、逻辑代码执行的过程，用户拿到响应内容后，这份内容基本已经是可以呈现的页面，首屏时间大大缩短；（主要是生成 html 结构的过程）首屏加载时间（FCP）更快
- SEO 友好：SSR 服务对于站点访问请求响应的是填充过的页面，其中已经有许多站点信息和数据可供爬虫直接识别，搜索引擎优化自不必说；- 完整的 HTML 内容直出，SEO 友好

## 优势之上，SSR 也带来了一些局限

- 引入成本高：SSR 方案重新将视图渲染的工作交给了服务器做，这就引入了新的概念和技术栈（如 Node），并且带来了更高的服务器硬件成本和运维成本；

- 响应时间长：对比 CSR 只需要响应早已准备好的空页面，SSR 在完成访问响应的时候需要做更多的计算和生成工作，因此其请求响应时间更长，同时还受限于前置数据接口的响应速度，一项关键指标 TTFB (Time To First Byte) 将变得更大；

- 首屏交互不佳：又是那句话，“SSR 的用户启动体验好，但不完全好”。虽然 SSR 可以让页面请求响应后更快在浏览器上渲染出来，但在首帧出现，需要客户端加载激活的逻辑代码（如事件绑定）还没有初始化完毕的时候，其实是不可交互的状态，同样影响用户体验；

- 传统开发思路受限：斟酌之下还是将其列出作为 SSR 的局限性，既然主要页面内容是在服务端完成渲染的，那么对于浏览器（或者 Hybrid、Webview 之下的宿主）环境的获知和相关操作就会受到局限，一些操作不得不延迟到客户端激活之后才得以进行，这也是导致上一个局限点的原因。

另外，如果对于内容比较确定、变化不太频繁的页面，比如 H5 活动页、排行榜、文档站点等，如果每次都进行完整的服务端渲染过程，会有产生很多重复的请求，从而造成不必要的性能浪费。同时，也带来了更高的服务端硬件成本和运维的人力成本。

### SSR 服务器挂了怎么办

在有限的容灾范围内至少提供一个友好的 404 页面（通过重定向），告知用户正在升级/故障原因/恢复时间之类的

让服务端渲染在渲染服务挂掉的情况下退化成客户端渲染？
