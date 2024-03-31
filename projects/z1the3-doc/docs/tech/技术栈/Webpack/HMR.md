# 热更新

## HMR

关于 webpack 热模块更新的总结如下：

- 通过 webpack-dev-server 创建**两个服务器**：提供静态资源的服务（express）和 Socket 服务
- express server 负责直接提供静态资源的服务（打包后的资源直接被浏览器请求和解析）
- socket server 是一个 websocket 的连接，双方可以通信
- 当 socket server 监听到对应的模块发生变化时，会生成两个文件.json（manifest 文件 mainfest 文件包含重新 build 生成的 hash 值，以及变化的模块，）和.js 文件（update chunk）
- 服务端向客户端发一条消息,包含 文件改动后生成的 hash 值
- 浏览器接受消息后跟上次 hash 值相比,通过 ajax 去请求变化了的 manifest 文件 , ws 是用来检测，ajax 是用来更新
- 浏览器拿到两个新的文件后，通过 HMR runtime 机制，加载这两个文件，并且针对修改的模块进行更新
