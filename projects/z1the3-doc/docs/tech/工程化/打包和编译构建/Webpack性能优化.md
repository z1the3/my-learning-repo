# Webpack 性能优化

## 性能优化

性能优化从两个方面入手

优化一：打包后的结果（减小构建体积），上线时的性能优化。（比如分包处理、减小包体积、CDN 服务器等）
优化二：优化打包速度，开发或者构建时优化打包速度。（比如 exclude、cache-loader 等）

CDN 处理后相当于库不参与打包过程，只保留一个 script 脚本，减小包体积

> https://juejin.cn/post/7233298696292040741

## 分包

见 Webpack 分包

## 开发模式进行 DLL & DllReference 方式优化

被设置到 dll 的依赖，开发阶段不会重新参与打包

可以直接从内存中读取
