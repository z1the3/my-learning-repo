# pnpm patch

## 问题

https://github.com/Mathpix/mathpix-markdown-it/issues/278#issuecomment-1822482690

vite使用esm，默认严格模式，而mathpix中的依赖mathjax包不支持严格模式，且不维护更新

需要使用pnpm patch去拦截该包的安装并修改其语法

使用npm 和 yarn 则需要使用patch-package库

https://github.com/ds300/patch-package

This works inside mathpix-markdown-it, but it won't work when installing the mathpix-markdown-it dependency
这在内部有效，但在安装依赖项时不起作用

因此需要手动在项目里增加这个依赖，保证这个依赖和pnpm依赖的依赖版本号相同
这样会复用这个依赖，并且patch依然生效

关于依赖是否被patch成功？可以手动去node_modules看
能找到对应依赖的.patch版本
