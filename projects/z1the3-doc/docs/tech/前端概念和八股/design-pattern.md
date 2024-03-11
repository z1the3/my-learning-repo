# 设计模式

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

> 每个类只有一个实例
> 创建前判断实例是否存在，存在就直接返回，不存在再创建

其他例子：点击按钮显示弹窗；redux 的 store

```js
class CreateUser {
  constructor(name) {
    this.name = name;
    this.getName();
  }
  getName() {
    return this.name;
  }
}

// 实现单例模式
const ProxyMode = (function () {
  let instance = null;
  return function (name) {
    if (!instance) {
      instance = new CreateUser(name);
    }
    return instance;
  };
})();

// 测试
const a = new ProxyMode("aaa");
const b = new ProxyMode("bbb");
console.log(a === b); // true
```

### 工厂模式

> 根据不同的输入返回不同类的实例  
> 将对象的创建和实现分离

工厂负责创建对象，产品封装对象的具体实现

其他例子：document.createElement 创建 DOM 元素

```js
/* 产品类1 */
class Product1 {
  constructor() {
    this.type = "Product1";
  }
  operate() {
    console.log(this.type);
  }
}

/* 产品类2 */
class Product2 {
  constructor() {
    this.type = "Product2";
  }
  operate() {
    console.log(this.type);
  }
}

/* 工厂类 */
class Factory {
  static getInstance(type) {
    switch (type) {
      case "Product1":
        return new Product1();
      case "Product2":
        return new Product2();
      default:
        throw new Error("当前没有这个产品");
    }
  }
}

const prod1 = Factory.getInstance("Product1");
prod1.operate(); // 输出: Product1
const prod2 = Factory.getInstance("Product3"); // 输出: Error 当前没有这个产品
```

为什么使用工厂方法呢？
**因为 new SomeClass 来构建对象本质上属于硬编码，**写死了类型。
为了将 object 的构建和使用分开，才引入了工厂函数作为中间抽象。
上面的例子中，使用工厂方法之后，还可以将 CarFactory.create 的参数写在配置文件，或者通过命令行传递。这样如果需要改变车辆品牌，只需要修改配置或者参数即可，不用修改编译代码。
仔细想一下，工厂方法其实和下面的代码没有本质区别。

之前 MAX 是硬编码的某个值，比如 100； 之后引入了函数 getMax，至于 getMax 返回的值是怎么来的我们不关心，只要是 int 类型即可。 getMax 的角色和工厂方法是一样的。

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
