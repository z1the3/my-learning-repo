# UML 学习

## 概述

- Unified Modeling Language
- 统一建模语言

是一门 general-purpose visual modeling language
不像编程语言，它使用的是 standardized graphical symbols and text

是用于描述软件，视觉化过程和创建软件系统的**文档**

是 a set of standardized modeling methods that encapsulste past modeling techniques'
experiences and incorporate the best practices of today's achievements

一套标准化的建模方法，既总结了过去建模技术的经验，又结合了当今成就的最佳实践。

## 学习目的

- 帮助正确 高效率 有效的 面向对象编程
- 项目相关者能通过 UML 更清晰地交流
- 提供项目的“big picture“

## 类图

在面向对象（OO）编程中，类是一个基本概念，它封装了数据和行为。以下是关键点的详细说明：

类的定义：类是用于创建对象的蓝图，这些对象共享相同的属性、操作和关系。类定义了对象将拥有的属性和方法。

职责：系统中的每个类都被设计为处理特定的职责。这意味着一个类负责执行某些功能或操作。设计良好的类通常遵循单一职责原则，即它应该只有一个改变的理由，专注于单一任务或功能。

这种方法有助于保持代码的清晰、模块化和可管理性，使其更易于理解、扩展和维护

类的属性代表其与数据相关的职责，而类的操作对应其行为职责。

类图：类图展示了系统的静态结构，显示了类的存在及其关系。

### 类图三部分

Class diagram consists of 3 components:

#### 1. Name

- 任何类都有名字
- 遵守 JAVA 命名规则，首字母必须大写，subsequent 单词用大写字母开头

#### 2. Attribute

属性是类的成员变量，类可以有多个属性也可以没有属性

需要使用驼峰命名法（camel case naming ）

- 开头小写字母
- 不能以&（ampersand）$(dollar) \_（underscore）开头
- 如果包含多个单词，需要驼峰命名 firstName
- 避免使用单字母作为变量，x,y,z

`可见性 名称： 类型 [=默认值]`
`[Access] Name: Type [=Default]`

```
Public +
Private -
Protected #


+ name: String
# age: int = 25
```

#### 3.class operation

类的操作

操作上代表类的成员方法的行为

名称中第一个单词需要全部小写， subsequent 单词用大写字母开头

`可见性 名称(参数列表)：返回类型`

## 类之间的关系

### Assocation 关联

或者叫单向关联 Singleton relationship

实线，表示两者之间有某种关系

A 指向 B 并标有 contains，即 B 包含在 A 里

如 JButton 为 LoginForm 的成员变量

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/E47B51917929D2CB066E2E8E9EA1525A.png" width="500"/>

### bilateral association 双向关联

没有箭头，但是要写出两个关系

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/3949709542.png" width="500"/>

### Self association 自关联

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/1509063721.png" width="500"/>

### Multiplicity Association

代表两个关联的对象间的数量关系

直接用关联线上加上数字或数字范围，双端各要写

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/2847463789.png" width="500"/>

一个表单可能有 0 个或多个按钮，但是一个按钮只会对应一个表单，且必然有对应
<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/3170244660.png" width="500"/>

### Aggregation Association 聚合关联

聚合，指整体和局部的关系，而不仅仅是拥有或者关联

在聚合中，成员对象被视作整体的一部分，但是在整体不存在时，
该对象依然可以存在；比如引擎可以独立于车存在，也可以在车的内部存在

symbol 代表: solid line with the hollow diamond

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/1088394420.png" width="500"/>

### Composition Association 组合关联

组合，类似聚合，也代表整体和局部的关系

但是局部和整体有相同的生命周期

一旦类的实例被销毁，内部的对象也会消失

存在关系是共享的

symbol: a line with solid diamond

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/1125983292.png" width="500"/>

## Dependency 依赖关系

改变具体的实体可能会影响其他使用它的实体的一类使用关系

依赖或者使用其他实体都属于依赖关系

最常见的情况是 A 对象在函数参数使用 B 对象

则 A 依赖 B

symbol: a dotted line with arrow，箭头指向提供者

（下图线画错了，画成实线了，应该是点线）

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/1663192496.png" width="500"/>

典型的三种依赖情况

- 把 B 对象作为一个方法中的参数传递给 A 对象，A 将依赖 B
- 在方法中使用另一个对象作为局部变量，（如立即声明一个对象并使用）
- 在方法中调用另一个类的静态方法

## Generalization 泛化关系

或者叫继承关系，描述父类/子类 基类/子类 超类/派生类等

继承只是实现泛化的一种方式

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/137681798.png" width="500"/>

在继承关系中经常会出现 Protected 访问修饰符

对于标有 Protected 的属性或方法，

- 类自身可以可以访问
- 相同包内的其他类可以访问
- 类自身的子类可以访问

extends 关键字在 Java 中用于继承

## Interface realization（接口与实现关系）

接口同样也可以用于类似类的继承和依赖关系

接口和类之间存在实现关系；

类实现接口，类中需要完成接口中声明的方法

Symbol: 接口实现和继承一样用 dotted line with the hollow triangle

接口用 hollow circle 表示

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/1566484711.png" width="500"/>
