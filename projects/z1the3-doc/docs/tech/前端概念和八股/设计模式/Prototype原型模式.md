# Prototype 原型模式

> 对象式 + 创建类 Object + Creationsl

## 目的

通过复制从 prototype 中创建多个 identical

providing a prototype object to indicate the desired type of object to be created

创建过程中不用知道创建过程中的任何细节

当创建对象的成本很高，且新对象可以来自于现存的老对象
或者系统需要保存对象的状态，但是对象中状态的改变非常 minimal，可以考虑使用

## 模式结构

包括

- 原型：抽象原型类
- ConcretePrototype: concrete prototype class
- Client: client class

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/1728609746.png" width="500"/>

## 常见案例

### Java

所有的 Java 类都继承自 java.lang.Object
该类提供了一个 clone() 方法用于创建一个 Java 对象的浅拷贝

所有能被克隆的类都必须有 Cloneable 的标记接口 marker interface

如果没有该接口，但是被调用克隆方法
Java 编译器 compiler 将抛出 CloneNotSupportedException

## 优点

- 简化了创建对象的过程，通过复制已存在的对象更有效；不需要使用工厂类
- 好的扩展性 extensibility
- 如果使用深拷贝，则允许保存对象的状态 preservation of an object' s state; 保存未执行的操作

## 缺陷

- 自实现时需要为每个类提供复制方法，在修改过程中可能会破坏开闭原则
- 实现深拷贝需要写更多复杂代码
