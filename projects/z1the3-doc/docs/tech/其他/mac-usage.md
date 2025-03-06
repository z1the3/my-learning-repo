---
sidebar_position: 1
tags: [mac, 技巧]
---

# Mac 使用

## HomeBrew 安装

https://blog.csdn.net/Darling_qi/article/details/122239824

## mac 配置 github ssh-key

https://blog.csdn.net/weixin_45717809/article/details/128360185

## 在 Mac 终端中使用 vim 编辑文件

1. cd 文件所在的文件夹路径
2. 输入 vim 文件名
3. 按下 i 键来编辑文本文字
4. 退出 vim 编辑器：
   不保存并退出 `<ESC>   :q!   <回车>`
   保存并退出 `<ESC>   :wq   <回车>`

按 ESC 键跳到命令模式，然后输入：
:w - 保存文件，不退出 vim
:w file -将修改另外保存到 file 中，不退出 vim
:w! -强制保存，不退出 vim
**:wq -保存文件，退出 vim**
:wq! -强制保存文件，退出 vim
:q -不保存文件，退出 vim
:q! -不保存文件，强制退出 vim
:e! -放弃所有修改，从上次保存文件开始再编辑

## 文件管理快捷键

【shift+cmmand+c】，进入到磁盘界面，点击看到的磁盘。

【ls /_】可以列出电脑所有的文件，你要操作它们，需要会命令行。如果是列出个人目录下的所有文件，那么命令则是：【ls ~/_】

## admin 权限

给 node_modules admin 权限

```
sudo chown -R 用户名:admin node_modules
```

给整个项目赋予 admin 权限

```
sudo chown -R guojufeng:admin xingorg1Note
```

## Mac 安装 node.js 及环境配置

https://cloud.tencent.com/developer/article/2084919

## mac 推荐工具

### 超级右键

Appstore 中安装

## 解压.tar.gz

```
命令 tar -zxvf 文件名.tar.gz 用于在 Linux 或类 Unix 系统上解压缩 .tar.gz 文件。以下是参数的作用：

-z：表示使用 gzip 解压。
-x：表示解压文件。
-v：表示在解压的过程中显示详细信息。
-f：指定要解压的文件名。
总体而言，这个命令会解压指定的 .tar.gz 文件，并在终端中显示解压过程的详细信息。
```
