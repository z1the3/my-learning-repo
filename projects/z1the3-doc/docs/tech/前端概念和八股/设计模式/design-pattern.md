# 设计模式概念

> Design pattern is a proved methodology & solution to a problem in a context of some software system/application. （已证实的方法或解法）

> More specifically, play a role of a standard solution to a recurring problem (重现问题的标准解法)

> Pattern is the knowledge of reuse of generated knowledge

创建型 Creational，结构型 Structuaral ，行为型 Behavioral

- 创建型： 用于创建一个对象
- 结构型： 用于将多个对象组
- 织到高效的一个当中
- 行为型： 用于描述不同类和对象之间互相互动和分配职责

类式 对象式

- 类式用于管理类和子类的关系
- 对象式用于管理对象的关系

## 设计模式原则

### 单一职责原则（Single Responsibility Principle）

SRP

每个函数（类）只做一件事情, 同时职责完全被该函数（类）管理

- 如果功能比较复杂，可以拆成多个函数，同时让每个部分保持独立
- 好处：修改一个功能时，不会影响到其他功能

### 开闭原则（OpenClosed Principle）

OCP
对扩展开放，对修改关闭

- 在实现新功能时，扩展新代码，而不是修改已有代码
- 好处：不会影响已有功能

### 里式代换原则（Liskov Substitution Principle）

> Function that use pointers or references to base classes must be able to
> use objects of derived classes without knowing it

LSP
所有引用基类的地方必须能透明地使用其子类的对象

### 依赖倒转原则（Dependence Inversion Principle）

> Program to an interface, not an implementation

DIP

高层模块不应该依赖低层模块，他们都应该依赖抽象。抽象不应该依赖细节，细节应该依赖于抽象

### 接口隔离原则 （Interface Segregation Principle）

ISP

用户不应该被强制依赖他们不使用的接口，即只给用户必须使用的（less is more）

### 合成复用原则（Composite Reuse Principle）

CRP

Favor composition of object over inheritance as a reuse mechanism

### 迪米特法则 （Law of Demeter）

Lod

任何软件单元应该只对其他单元保持限制的知识

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
