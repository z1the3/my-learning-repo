# 发布一个外网 package

## 内网 package

一般名称都是@组织名/xxx

前面的@组织名即为 scope，详见 package 笔记
但是要注意也不能和公网包名重复

## 注册

首先，你需要在 npmjs.com 上注册一个用户。进入 npm 的官方网站，点击 Sign In 根据引导注册

## 开启 2FA

注册成功之后，我们进入 npm 的首页会发现 npm 会一直提示我们开启两步认证（two-factor authentication）。强烈建议开启 2FA，尤其是申请了开源 package 权限的内网同学，可以有效保证 package 的安全。
我们按照 npm 官方的指引，开启两步认证。点击头像，进入的 Profile 页面，点击 “Enable 2FA”。
npm 会让我们选择两种 2FA 的方式，当然后续我们也可以通过此途径关闭 2FA。选择在登录账户和发布包（Authorization and Publishing）的时候进行二次验证。
点击后会到一个扫描二维码的阶段，这个时候我们需要一个支持 otp 管理的 app 来协助。我建议下载 Google 的 Authenticator 软件或 1password（付费），扫描当前的二维码，将会生成一个 30s 内有效的一次性密码。输入密码完成 2FA 的设置。
开启后，当登录、发布和管理当前账户的时候，npm 会要求输入一个一次性密码（otp 码）来进行认证。我们就可以通过 npm login 在当前的命令行中进行登录。根据提示输入用户名和密码进行登录。

```
$ npm login --registry=https://registry.npmjs.org/
npm notice Log in on https://registry.npmjs.org/Username: your_user_name
Password: xxx
Email: (this IS public) beaceshimin@gmail.com
npm notice Please use the one-time password (OTP) from your authenticator application Enter one-time password: 025088Logged in as beace on https://registry.npmjs.org/.
```

登录后可以通过 whoami 指令来查看当前 npm 登录的用户名信息。

```
npm whoami
```

检查文件
在发布之前，我们需要检查一下哪些文件需要被发布到 npm 上去。例如运行测试用例时产生 log 文件夹，并不需要发布到 npm 上。npm 提供了多种配置来控制发布的内容（文件）。

- npm 首先会检查 package.json 中是否有 files 字段，如果有，会将 files 字段中的文件都将会被发布。如果 files 中包含文件夹，npm 将递归该文件夹中的所有文件并发布。
- 如果有 .gitignore or .npmignore 文件，npm 将忽略其中的配置文件。当有 .npmignore 文件存在时，将忽略 .gitignore 文件。
- 不会包含 node_modules 文件，默认忽略以下文件 .\* 、 .DS_Store 、 .git 、 .gitignore 、 .hg 、 .npmignore 、 .npmrc 、 .lock-wscript 、 .svn 、 .wafpickle-、config.gypi、CVS、npm-debug.log。

- 符号链接不包含在 npm 包中。
  如果你的本地代码中共包含不需要发布到 npm 上的文件，比如 log，可以新建 .npmignore 文件，将 log 文件夹忽略。语法与 .gitignore 相同。

## 检查版本和 tag

### tag

首先，你要确认当前的版本 tag 是什么，比如 alpha、beta、latest 等等。其次，你的 tag 需要和 version 的关系一一对应，比如你发布 alpha 版本的 package 时，需要在版本号中明确 alpha。以下几个比较好的例子

| tag    | version       |
| ------ | ------------- |
| alpha  | 1.0.1-alpha.0 |
| beta   | 1.0.1-beta.0  |
| latest | 1.0.1         |

默认的 tag 为 latest，你可以通过 --tag 来指定当前发布版本对应的 tag，需要注意的是同一个 tag 只能对应一个版本，比如发布 alpha 版本。

### version

除此之外，version 版本号信息应该严格遵守 semver 规范。大体分为 Major（主版本号）、Minor（次版本号）、Patch（修订版本号）、pre-release version （先行版本号）。往往通过下图所示来拼接。

这里不仅仅代表版本号的命名，而是代表其实际含义。语义化版本中明确约定了在相应的场景下应该如何更改版本号，在实际开发中应该遵守这些规则，在不确定如何更新时，可以通过下表来选择。

|代码状态|阶段|规则|示例版本|
首次发布 新产品 从 1.0.0 开始 1.0.0
向后兼容的错误修复 补丁（Patch） 增加第三个数字 1.0.1
向后兼容的新功能 次要版本（Minor） 修改中间数字，重置最后一位数字 1.1.0
破坏向后兼容性的更改 主要版本（Major） 增加第一位数字，重置中间和最后一位数字 2.0.0
实验/测试性功能 测试/实验版本（pre-release） 在版本最后通过横线来追加 2.0.0-alpha, 2.0.0-beta
