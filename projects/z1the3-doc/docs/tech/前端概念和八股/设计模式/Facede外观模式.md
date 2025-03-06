# Facede 外观模式

> 对象式+结构型 Object+Structural
> 定义个便于子系统使用的高阶接口

## 目的

隐藏系统的复杂度，并且向用户提供一个访问系统的接口

hides the complexities of the system and provides an interface to the client to access the system

客户类只需要通过外观类，就可以去访问各个子系统，简化类之间的互动，降低了系统的耦合度 high coupling within the system

这里的子系统是一个广泛的概念，可以是类，功能模块，系统组件，甚至一个单独的系统

另外，这还是一个 the law of Demeter 的实践

在层级结构中，外观模式同样可以被应用，各层之间利用外观类连接，降低层之间的耦合度

## 模式结构

包括

- Facade class 外观类
- SubSystem class 子系统类

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/E26778452B41DDF37999AE54948E64BD.png" width="500"/>

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/2346637028.png" width="500"/>

## 优点

- 减少了用户需要面对的对象属性
- 收拢耦合关系 loose coupling relationship bewteen the subsystem and the client; 确保子系统的改变不会影响调用它的客户，只需要在外观类中做调整
- 对一个子系统的更改不会影响其他子系统和外观类

## 弊端

- 如果没有正确设计，增加新的子系统可能要求修改外观类的代码，破坏了开闭原则
