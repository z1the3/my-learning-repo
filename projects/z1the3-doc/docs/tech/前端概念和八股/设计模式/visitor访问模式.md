# visitor 访问模式

> 有助于拓展而不改变稳定的元素；给对象定义新的操作时，不用修改对象本身，而通过改另外一个对象就可以；这就是 Visitor 设计的奇妙之处，它将对象的操作权移交给了 Visitor。

> 假设你制作一款城市建造游戏，游戏的基础资源只有毛皮、木材、铜矿、铁矿。你需要用这些资源建造各种，比如造楼房、做衣服、制作家具、门、空调、甚至锅、健身房、游泳馆等。记住一个前提，就是你想把游戏设计的非常逼真，所以每种资源的不同使用方法都非常定制，不是简单的消耗 N 个数量就能完成，比如制作家具时，需要用到毛皮和木材，此时毛皮和木材对环境、制作人、资金都有不同的要求。 常见的想法是，我们将资源的所有使用方法都枚举在资源类中，这样资源就在用到不同场景时，调用不同方法即可。但问题是资源本身其实较为固定，我们每增加一种用途就修改一次木材、铁矿的类会显得非常麻烦。

能不能在增加新用途时，不修改原始资源类呢？答案是可以用访问者模式。

要实现操作权转让到 Visitor，核心是元素必须实现一个 Accept 函数，将这个对象抛给 Visitor：

## 模式使用 1

### element

```js
class ConcreteElement implements Element {
  public accept(visitor: Visitor) {
    visitor.visit(this)
  }
}
```

### visitor

```js
class ConcreteVisitorX implements Visitor{
  public visit(element: ELement) {
    element.accept(this);
  }

  public visit(concreteElementA: ConcreteElementA) {
    console.log('X 操作 A')
  }

  public visit(concreteElementB: ConcreteElementB) {
    console.log('X 操作 B')
  }
}

```

## 模式使用 2

```js
class Data {
}


// 访问者
class Visitor {
  private data;
  // 构造函数
  Visitor(data) {
    this.data = data;
  }
  report() {// ... 处理数据
  }
}
```

比如对于同一份字节数据，可以解析成不同的结果：

```js
//
class ByteBuffer {
  private bytedata;
}

// 将 bytes 解析成 uint8 类型
class Uint8View {
  private ByteBuffer buffer;
}

// 将 bytes 解析成 int16 类型
class Int16View {
  private ByteBuffer buffer;
}

```

## 实际案例

我们可以看到这样的程序拓展性有这么些：

Element 元素的所有子类都不用频繁修改，只要修改 Visitor 即可。

一个 Visitor 可以选择性的操作任何类型的 Element 子类，只要申明了处理函数即可处理，不申明就不会命中，比较方便。在城市建造的例子中，可以提现为锅需要用铁制作，但不需要消耗木材，所以不需要定义木材的 visit 方法。

可以定义多种 Visitor，对同一种 Element 子类也可以有不同的操作，这在我们城市建造的例子中，可以体现为门和窗户，对铁矿的使用是不同的。

假设你用了访问者模式，会发现，每天因为迭代而新增的那几个方法，都会放到一个新 Visitor 文件下，比如一种纳米材料的门板在游戏 V1.5 版本被引进，它对材料的使用会体现在新增一个 Visitor 文件，资源（纳米）本身的类不会被修改，由 visitor 进行扩展，这既不会引发协同问题，也使功能代码按照场景聚合，不论维护还是删除的心智负担都非常小。

访问者表示对数据的访问和处理。
访问者模式和策略模式有些像，都是强调数据本身与数据的处理逻辑相分离。
但是访问者模式通常适用于对数据做出比较复杂的处理。

访问者比策略更复杂

可以把访问者看作对数据的视图，或者 PhotoShop 的蒙板。 圆形的蒙板展示的数据是圆形，方形的蒙板展示的数据则是方形。

## 弊端

访问者模式使用场景非常有限，请确定你的场景满足以上情况再使用。如果资源并不需要频繁修改和拓展，那么就没必要使用访问者模式。

> 来自 https://github.com/ascoders/weekly/blob/master/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/189.%E7%B2%BE%E8%AF%BB%E3%80%8A%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%20-%20Visitor%20%E8%AE%BF%E9%97%AE%E8%80%85%E6%A8%A1%E5%BC%8F%E3%80%8B.md 前端精度周刊
> 有更改
