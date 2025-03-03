# StrNumber
StrNumber 是一个数字计算类，用于解决原生浮点数运算精度丢失和大数运算的问题。
其封装了常用的加减乘除的计算方法、toFixed 方法，还包括 calc 方法，用于支持字符串公式的运算。StrNumber实例支持链式调用计算方法，计算方法也可以在静态方法中调用。

## Installation

Using npm:

```
$ npm install strnumber
```

## Example

```typescript
import { StrNumber, strNumber } from 'strnumber' // strNumber 为不用 new 调用的 StrNumber

const a = new StrNumber(1) // 或 strNumber(1)

// 支持实例的链式调用，支持多种参数类型
const b = a.add(1, '1e+17').times(new StrNumber(2)) // 结果为：new StrNumber('200000000000000004')

// 支持静态方法的调用，静态方法仅支持两数运算，且输出为字符串或特殊值的 StrNumber 原始值(如'NaN')
const c = StrNumber.add(1, 2) // '3'

// calc 方法支持字符串公式运算
const c = StrNumber.calc(`(1+${b})*4`) // '800000000000000020'
// 支持隐式转换，但不推荐
const d = a + 2 // 3
```

