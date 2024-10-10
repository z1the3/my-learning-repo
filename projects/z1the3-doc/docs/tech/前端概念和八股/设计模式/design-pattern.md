# 设计模式概念

创建型，结构型，行为型

## 设计模式原则

### 单一职责原则（Single Responsibility Principle）

每个函数只做一件事情

- 如果功能比较复杂，可以拆成多个函数，同时让每个部分保持独立
- 好处：修改一个功能时，不会影响到其他功能

### 开闭原则（OpenClosed Principle）

对扩展开放，对修改关闭

- 在实现新功能时，扩展新代码，而不是修改已有代码
- 好处：不会影响已有功能

## 创建型

### 单例模式

### 工厂模式

## 结构型

### 代理模式

为对象提供代理，以控制对它的访问
真实工厂负责生产商品，代理工厂负责生产商品之外的事情，从而可以让真实工厂专注于生产

其他例子：Proxy

```js
// 真实工厂
class Factory {
  constructor(count) {
    // 工厂默认有1000件产品
    this.productions = count || 1000;
  }

  // 生产商品
  produce(count) {
    // 原则上低于5个工厂是不接单的
    this.productions += count;
  }

  // 向外批发
  wholesale(count) {
    // 原则上低于10个工厂是不批发的
    this.productions -= count;
  }
}

// 代理工厂
class ProxyFactory extends Factory {
  // 代理工厂默认第一次合作就从工厂拿100件库存
  constructor(count = 100) {
    super(count);
  }

  // 代理工厂向真实工厂下订单之前会做一些过滤
  produce(count) {
    if (count > 5) {
      super.produce(count);
    } else {
      console.log("低于5件不接单");
    }
  }

  wholesale(count) {
    if (count > 10) {
      super.wholesale(count);
    } else {
      console.log("低于10件不批发");
    }
  }

  taobao(count) {
    // ...
  }

  logistics() {
    // ...
  }
}

// 创建一个代理工厂
const proxyFactory = new ProxyFactory();

// 通过代理工厂生产4件商品，被拒绝
proxyFactory.produce(4);

// 通过代理工厂批发20件商品
proxyFactory.wholesale(20);

// 代理工厂的剩余商品 80
console.log(proxyFactory.productions);
```

### 组合模式

用树形结构来表示一组对象
对单个对象和组合对象的处理逻辑进行统一
扫描文件夹时，文件夹里可能是文件，也可能是文件夹，不对它们进行区别对待

```js
const Folder = function (folder) {
  this.folder = folder;
  this.lists = [];
};

Folder.prototype.add = function (resource) {
  this.lists.push(resource);
};

Folder.prototype.scan = function () {
  console.log("开始扫描文件夹: ", this.folder);
  for (let i = 0, folder; (folder = this.lists[i++]); ) {
    folder.scan();
  }
};

const File = function (file) {
  this.file = file;
};

File.prototype.add = function () {
  throw Error("文件下不能添加其它文件夹或文件");
};

File.prototype.scan = function () {
  console.log("开始扫描文件: ", this.file);
};

const folder = new Folder("根文件夹");
const folder1 = new Folder("JS");
const folder2 = new Folder("life");

const file1 = new File("深入React技术栈.pdf");
const file2 = new File("JavaScript权威指南.pdf");
const file3 = new File("小王子.pdf");

folder1.add(file1);
folder1.add(file2);

folder2.add(file3);

folder.add(folder1);
folder.add(folder2);

folder.scan();

// 开始扫描文件夹:  根文件夹
// 开始扫描文件夹:  JS
// 开始扫描文件:  深入React技术栈.pdf
// 开始扫描文件:  JavaScript权威指南.pdf
// 开始扫描文件夹:  life
// 开始扫描文件:  小王子.pdf
```
