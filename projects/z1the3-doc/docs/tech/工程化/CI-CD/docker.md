# docker

内部附安装

> https://docker.easydoc.net/doc/81170005/cCewZWoN/lTKfePfP

## 打包、分发、部署

打包：就是把你软件运行所需的依赖、第三方库、软件打包到一起，变成一个安装包

分发：你可以把你打包好的“安装包”上传到一个镜像仓库，其他人可以非常方便的获取和安装

部署：拿着“安装包”就可以一个命令运行起来你的应用，自动模拟出一摸一样的运行环境，不管是在 Windows/Mac/Linux。

很多私有化部署就是用 Docker，轻松应对客户的各种服务器。

常规应用开发部署方式：自己在 Windows 上开发、测试 --> 到 Linux 服务器配置运行环境部署。

> 问题：我机器上跑都没问题，怎么到服务器就各种问题了

用 Docker 开发部署流程：自己在 Windows 上开发、测试 --> 打包为 Docker 镜像（可以理解为软件安装包） --> 各种服务器上只需要一个命令部署好

> 优点：确保了不同机器上跑都是一致的运行环境，不会出现我机器上跑正常，你机器跑就有问题的情况。

## 镜像

可以理解为软件安装包，可以方便的进行传播和安装。

## 容器

软件**安装后的状态**，每个软件运行环境都是独立的、隔离的，称之为容器。

## 为自己的 Web 项目构建镜像

示例项目代码：https://github.com/gzyunke/test-docker
这是一个 Nodejs + Koa2 写的 Web 项目，提供了简单的两个演示页面。
软件依赖：nodejs
项目依赖库：koa、log4js、koa-router

### 编写 Dockerfile

```dockerfile
FROM node:11
MAINTAINER easydoc.net

# 复制代码
ADD . /app

# 设置容器启动后的默认运行目录
WORKDIR /app

# 运行命令，安装依赖
# RUN 命令可以有多个，但是可以用 && 连接多个命令来减少层级。
# 例如 RUN npm install && cd /app && mkdir logs
RUN npm install --registry=https://registry.npm.taobao.org

# CMD 指令只能一个，是容器启动后执行的命令，算是程序的入口。
# 如果还需要运行其他命令可以用 && 连接，也可以写成一个shell脚本去执行。
# 例如 CMD cd /app && ./start.sh
CMD node app.js


```

### Build 为镜像

`docker build -t test:v1`

-t 设置镜像名字和版本号
命令参考：https://docs.docker.com/engine/reference/commandline/build/

### 运行镜像创建容器

`docker run -p 8080:8080 --name test-hello test:v1`

-p 映射容器内端口到宿主机
--name 容器名字
-d 后台运行
命令参考文档：https://docs.docker.com/engine/reference/run/

### 更多相关命令

docker ps 查看当前运行中的容器
docker images 查看镜像列表
docker rm container-id 删除指定 id 的容器
docker stop/start container-id 停止/启动指定 id 的容器
docker rmi image-id 删除指定 id 的镜像
docker volume ls 查看 volume 列

## 目录挂载

### 痛点

- 使用 Docker 运行后，我们改了项目代码不会立刻生效，需要重新 build 和 run，很是麻烦。

  build dockfile->镜像->运行容器->文件是写死的,不支持编辑源码（app 下）

- 容器里面产生的数据，例如 log 文件，数据库备份文件，容器删除后就丢失了。

### 挂载方式

https://docker.easydoc.net/doc/81170005/cCewZWoN/kze7f0ZR

## 多容器通信

项目往往都不是独立运行的，需要数据库、缓存这些东西配合运作。
这节我们把前面的 Web 项目增加一个 Redis 依赖，多跑一个 Redis 容器，演示如何多容器之间的**通信**。

### 创建虚拟网络

要想多容器之间互通，从 Web 容器访问 Redis 容器，我们只需要把他们放到同个网络中就可以了。

https://docker.easydoc.net/doc/81170005/cCewZWoN/U7u8rjzF

假设 B 内部需要与 A 通信

- 创建网络
- 在网络中运行容器 A
  **需要修改容器 B 源码中访问 redis 的地址为网络别名**
  容器 A 不需要暴露网络端口
- 在同一网络中运行容器 B
  容器 B 使用-p 暴露端口

## Docker-Compose

在上节，我们运行了两个容器：Web 项目 + Redis

如果项目依赖更多的第三方软件，我们需要管理的容器就更加多，每个都要单独配置运行，指定网络。

这节，我们使用 docker-compose 把项目的多个服务集合到一起，一键运行。

### docker-compose 安装

> https://docker.easydoc.net/doc/81170005/cCewZWoN/IJJcUk5J

要把项目依赖的多个服务集合到一起，我们需要编写一个 docker-compose.yml 文件，描述依赖哪些服务

```yaml
version: "3.7"

services:
  app:
    build: ./
    ports:
      - 80:8080
    volumes:
      - ./:/app
    environment:
      - TZ=Asia/Shanghai
  redis:
    image: redis:5.0.13
    volumes:
      - redis:/data
    environment:
      - TZ=Asia/Shanghai

volumes:
  redis:
```

## 发布和部署

### 发布镜像

镜像仓库用来存储我们 build 出来的“安装包”，Docker 官方提供了一个 镜像库，里面包含了大量镜像，基本各种软件所需依赖都有，要什么直接上去搜索。

我们也可以把自己 build 出来的镜像上传到 docker 提供的镜像库中，方便传播。
当然你也可以搭建自己的私有镜像库，或者使用国内各种大厂提供的镜像托管服务，例如：阿里云、腾讯云

docker 官方的镜像托管有时候上传和下载都太慢了，如果你想要更快的速度，可以使用阿里云的免费镜像托管

上传镜像后
docker-compose 中也可以直接用这个镜像了

## 备份和迁移数据

> https://docker.easydoc.net/doc/81170005/cCewZWoN/XQEqNjiu
