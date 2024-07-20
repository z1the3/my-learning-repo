# headlessUI

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/1721364026450.jpg" width="500"/>

我们所构建的 UI 分为 3 个部分：

- 行为库 Behavior Libraries
- 样式系统 Style System
- 扩展 Extension

其中 Behavior Libraries（行为库）和 Style System（设计语言） 共同组成了我们所熟悉的 UI 组件库，

Extension 则是对这些组件库的自定义扩充。

例如，我们熟悉的 antd 组件库就是由其行为库 rc-component 和设计语言 Ant Design 组合而成的 React 组件库。在使用 antd 构建 UI 时，通常会加入我们自己的样式扩展，这三者结合，共同打造出一套完整的 UI 界面。

## Behavior Libraries

先聊聊 Behavior Libraries ，不同于 antd 或 MUI 这类组件库，它不提供一套完整的组件，而是提供一套可以在任何组件上应用的行为逻辑，即所谓的 Headless UI。这种库的优点是极佳的可访问性和更小的体积，非常轻量化。

## Style System

每个 UI 都有一套自己的设计风格，如果把这些风格抽象出来，就有了样式系统，其中最主要的代表例子就是 bootstrap。 基于样式系统，我们就不用直接写最原始的 CSS， 而是直接使用定义好的 CSS class。

`<button type="button" class="btn btn-primary">Primary</button>`

## 组件的困扰

主流的 UI 组件库在应对中后台管理系统和一部分简单业务场景，是没有什么问题的，可以说算是比较不错的选择。但是很多时候我们不仅仅需要满足功能上的需求，更重要的是我们需要足够的个性化以及差异化，也就是上图中的 Extension：

1.CSS 样式自定义 2.修改 DOM 结构

虽然很多组件库提供了 CSS variables、Less/Sass 包等方式让人们来自定义样式，但做的再好也只是在他们这个样式系统内的个性化。而且固化的组件 DOM 结构让开发者难以完成产品的需求变更和 UI 设计师要求的定制化开发。

那么有没有方案可以解决这个困扰，实现三者的合集，也就是上图中的三个椭圆重叠的地方：we want to be？我认为 shadcn/ui 是一个可行的方案，他基于 Tailwind CSS 和 Headless UI 组件库 Radix UI 构建。

## Headless UI

Headless UI 是一种新型的 UI 组件开发模式，它只关心行为逻辑，不涉及 UI 的具体实现，从而允许开发者自由定制 UI，这种设计思想符合开闭原则。

目前比较出众的是 Radix、headlessui，主要都是解决 Behavior Libraries 层面的问题。旨在提供一套开放、无控制、无样式的基础组件，方便开发者进行进一步的个性化封装。我的探索之旅中，我读过、试过这两者，最终决定更深入地使用 Radix，主要是因为 shadcn/ui 这个优秀项目也是建立在 Radix 的基础上！以下是 Radix 的几大核心理念：

- 可访问性（Accessible）：如果你需要考虑应用的可访问性（残疾人士友好），Radix 的设计遵循 WAI-ARIA 规范，这是 W3C 编写的规范，定义了一组可用于其他元素的 HTML 特性，用于提供额外的语义化以及改善无障碍体验。
- 无样式（Unstyled）：正如其名，Radix 提供的组件不包含任何预设风格，完全自由地配合任何样式方案，这也直击了自定义样式的痛点。
- 开放性（Opened）：Radix 的开放性极佳，每一个组件都是独立的单元，可自由组合、灵活配置，满足你的各种需求。

在 React 生态中，Headless 组件常通过 Render Props 方法增强 UI 的可定制性，这种方法不仅允许自定义 UI 组件的外观，还能实时访问到上下文的状态—这是 UI 定制的绝佳方式（类似插槽）

## shadcn/ui

shadcn/ui 是 Vercel 的工程师推出的一款组件合集，建立在 Tailwind CSS 和 Radix UI 之上，目前包括了 48 个独立组件。根据官方说明，这款产品被定义为「组件合集」而非传统的「组件库」，其独到之处在于：不通过 npm 安装，而是直接将组件源代码复制粘贴到项目中，这样极大地方便了用户根据自己的需求去修改和扩展代码。

与传统组件库相比，shadcn/ui 遵循以下设计原则：

- 避免不必要的依赖：不把整个库作为依赖项添加，有助于减少项目体积，从而提升应用的加载速度。
- 组件代码的直接编辑：由于使用复制和粘贴的方式加入项目，提供了直接访问每个组件源代码的能力，开发者可以直接访问和控制每个组件的行为、样式和 DOM 结构，这种灵活性让 shadcn/ui 在众多 UI 解决方案中脱颖而出。
- 细粒度的控制：每一个组件都是独立的单元，可以单独使用和定制，这种模块化的设计不仅简化了个别组件的定制过程，也便于整体 UI 系统的扩展和维护。
- 多层次的样式自定义：首先，shadcn/ui 提供了图形界面的主题编辑器（playground），允许开发者在不直接修改 CSS 的情况下，通过编辑器定制一系列样式（如颜色、字体、边距等）；其次，开发者还可以在组件源代码层面进行个性化调整，或在使用组件时直接在标签上添加 className；最后，通过 RenderProps 方式进一步扩展 UI，开发者可以拿到当前上下文的状态，天然适合对 UI 的自定义扩展。这种多维度的自定义能力极大增强了 UI 的灵活性和适应性。

例如，使用 shadcn/ui 中的 Tabs 组件时，可以通过以下命令简单地添加到项目中：

```js
<Tabs defaultValue="account" className="w-full">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">在这里修改你的账号设置</TabsContent>
  <TabsContent value="password">在这里修改你的密码</TabsContent>
</Tabs>
```

执行 npx shadcn-ui@latest add tabs 后，Tabs 组件会被安装到 ./components/ui/tabs.tsx，此时开发者可以直接编辑源代码以定制 Tabs 组件

shadcn/ui 的设计理念是将交互逻辑的复杂性留给组件维护者，而将 UI 的定制性最大化地交给使用者，实现了业务需求的高度定制化。这种做法符合软件设计原则「关注点分离」（Separation of concerns，SoC），不过也带来了一些挑战：

- 对开发者的要求较高：需要良好的抽象设计能力来处理无 UI 层的组件。
- 较高的使用成本&升级成本：完全自定义的 UI 层可能带来更大的开发成本，未来的更新升级也比较麻烦，需要仔细评估成本和收益。

## 如何构建自己的组件库方案

- 常规 2B 业务：可以考虑使用 Ant Design 这样自带 UI 规范的组件库来搭建你的应用。如果你的要求更为严苛一些，shadcn/ui 可能会是个更合适的选择。
  简单 2C 场景：考虑开源组件库，例如：MUI

- 2C 个性化付费方案：Headless UI + Tailwind UI 可能是个不错的选择：毕竟，对于很多人来说，构建 Style System 是一个非常难的事情，而 Tailwind UI 的付费方案正好可以省去这些烦恼，直接提供完整的源码，这也是 Tailwind UI 商业化成功的一个原因吧。

- 2C 个性化免费方案：如果想要免费方案，或者需要覆盖更多的业务场景，那么使用一套设计优良的 Headless UI 组件 shadcn/ui + Tailwind CSS 构建的 Style System，形成自己的组件库方案，将是非常不错的选择。

实际上，在面对 2C 的个性化需求时，许多公司选择自研组件库或者基于现有的开源库来进行定制。我个人更偏向于第三和第四种方案，因为它们不仅提供了上述的便利，还能与现有技术栈无缝集成，这种非独占、非排他性的渐进式设计理念，使得它们可以非常友好地融入现有项目。

然而，也需要明白 Tailwind 并不是万能的。尤其是在以下情况中可能不太适合：

- 需求过于复杂，且设计时对于复杂需求毫无克制；
- 只看细节不顾整体，忽视整体协调一致。(tailwind 显著问题)

## 参考

https://zhuanlan.zhihu.com/p/694048244
