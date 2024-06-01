# SSG

SSG，即 Static Site Generation，它和 SSR 的本质区别在于 SSR 渲染 HTML 的过程在服务器运行时，而 SSG 将这个渲染的过程放到了**项目构建阶段**。因此，在构建阶段生成完整的 HTML，然后上传 CDN，这样用户访问时不用经过服务端，直接访问到内容完整的页面。

其实大家耳熟能详的 Vuepress、Gatsby 这种文档搭站工具都是 SSG 的经典代表方案。

只需要页面托管，不需要真正编写并部署服务端，页面资源在编译完成部署之前就已经确定；但它又与 SSR 一样，属于一种 Prerender 预渲染操作，即在用户浏览器得到页面响应之前，页面内容和结构就已经渲染好了。当然形式和特征来看，它更接近 SSR。

- 如果说 CSR 与 Prerender 差异在于渲染工作重心的抉择，同是 Prerender 的 SSR 和 SSG 则是渲染——或者是这其中非常重要的“注水”——填充内容操作在时机上的抉择。

- 又或者从另一个角度来说，不同于把大部分渲染工作留到请求时做的 CSR 和 SSR，SSG 在站点项目构建部署的时候，就把页面内容大致填充好了（构建时已经请求了需要的，适用于可变程度低）

  最终 SSG 模式的有点真正“返璞归真”的意思，原本日益动态化、交互性增强的页面，变成了大部分已经填充好，托管在页面服务 / CDN 上的静态页面。

## 应用

在 Next.js 中，如何来使用 SSG 的能力呢？

```js
import { Todo } from "../models/Todo";
import styles from "../styles/Home.module.css";
function SSG(props: { data: Todo[] }) {
  return (
    <div>
      <h2 className={styles.title}>Static Site Generation:</h2>
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

export const getStaticProps = async () => {
  const response = await fetch("http://localhost:4000/data");
  const data = await response.json();
  return {
    props: {
      data,
    },
  };
};

export default SSG;
```

如组件代码所示，Next.js 提供了 getStaticProps API 来对 SSG 的页面进行数据预取，随后在构建阶段会执行这个函数，将返回值作为 props 传递给组件，然后渲染组件为字符串返回给客户端，和 SSR 的渲染逻辑类似。

## SSG 兼收了传统 CSR 和 SSR 的优点

对这两者的短板也做到较好的互补。服务负担低、加载性能与体验佳、SEO 友好，这些 SSG 的取各家之长的优势此处不必单独分析，但还有一些好处源自这个模式本身：

- 页面内容都是静态生成过的，页面部署只需要简单的页面托管服务器，甚至只需要放在 CDN 之上，大量减少了动态性，还有服务器对页面加载、渲染工作的干预，也就让恶意攻击少了很多可乘之机；

SSG 其实是在页面的动态性 和服务器的负载 之间做了一些取舍，牺牲了一些动态性，来降低服务器的负载和维护成本。
它的优点很明显，页面内容只需存放到 CDN，不需要走服务器，大大降低服务器负载；而也同时带来了一些弊端:

- 首先，页面失去了时效性，数据源变化之后模板的内容还是填充的旧数据；
- 其次，对于成千上万个页面需要构建时渲染的大型站点，构建性能会成为项目部署的瓶颈。

## SSG 的不足之处也值得提出来讨论

- 随着应用的拓展和复杂化，预渲染页面的数量增长速度很快。SSG 项目有较高的构建和部署开销，应用越复杂，需要构建出来的静态页面就会越多，对于功能丰富的大型站点，每次构建需要渲染成千上万个页面都是有可能的，这必然带来较高的部署、更新成本；
- 高度静态化带来非即时性，用户访问到的页面内 SSG 生成的部分，确保有效性的时间节点是上一次构建，使该模式下的应用失去了部分时效性，这部分缺陷需要通过定时构建、或者部分非 SSG 来弥补，这也是 SSG 的主要问题。
