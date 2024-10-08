# MVVM

分为 model 模型层 view 视图层 viewModel 视图模型层
模型层：负责处理业务逻辑，和服务端交互
视图层：负责将数据模型转化为 UI 展示，可以理解为 html 页面
视图模型层：视图和模型连接的桥梁，通过双向数据绑定连接

View 是视图层，也就是用户界面。前端主要由 HTML 和 CSS 来构成，为了更方便地展现 ViewModel 或者 Model 层的数据。
Model 是指数据模型，泛指后端进行的各种业务逻辑处理和数据操控，主要围绕数据库系统展开。这里的难点主要在于需要和前端约定统一的接口规则。
ViewModel 由前端开发人员组织生成和维护的视图数据层。在这一层，前端开发者从后端获取得到 Model 数据进行转换出来，做二次封装，以生成符合 View 层使用预期的视图数据模型。视图状态和行为都封装在 ViewModel 里。这样的封装使得 ViewModel 可以完整地去描述 View 层。

在 MVVM 架构中，是不允许数据和视图直接通信的，只能通过 ViewModel 来通信，而 ViewModel 就是定义了一个 Observer 观察者。ViewModel 是连接 View 和 Model 的中间件。

ViewModel 能够观察到数据的变化，并对视图对应的内容进行更新。
ViewModel 能够监听到视图的变化，并能够通知数据发生变化。
