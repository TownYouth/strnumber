import {
  _NaN,
  add,
  checkNumber,
  formatNumber,
  into,
  minus,
  NEGATIVE_INFINITY,
  POSITIVE_INFINITY,
  times,
  _isFinite,
  calc,
  toFixed,
  _isInfinite,
  _isNaN,
  aIsEqualToB,
  aIsMoreThanB,
  aIsLessThanB
} from './calc'

declare global {
  /* eslint-disable no-use-before-define */
  type StrNumberValue =
    | string
    | typeof StrNumber.NEGATIVE_INFINITY
    | typeof StrNumber.POSITIVE_INFINITY
    | typeof StrNumber.NaN

  type StrNumberType = number | StrNumberValue | StrNumber
}

/**
 * 私有value属性名
 */
const privateValueKey = Symbol('privateValue')

/**
 * 类名：StrNumber
 * @description
 * 这是一个数字计算类，用于解决js浮点数运算精度丢失和大数运算的问题
 * 封装了常用的加减乘除计算方法，还包括toFixed方法
 * 实例支持链式调用计算方法，计算方法也可以在静态方法中调用
 */
class StrNumber {
  public static POSITIVE_INFINITY = POSITIVE_INFINITY
  public static NEGATIVE_INFINITY = NEGATIVE_INFINITY
  public static NaN = _NaN
  public static add = add
  public static minus = minus
  public static times = times
  public static into = into
  public static calc = calc
  public static toFixed = toFixed
  public static isInfinite = _isInfinite
  public static isFinite = _isFinite
  public static isNaN = _isNaN
  public static aIsEqualToB = aIsEqualToB
  public static aIsMoreThanB = aIsMoreThanB
  public static aIsLessThanB = aIsLessThanB

  /**
   * 私有value属性
   * 给value属性做存值
   */
  private [privateValueKey]: StrNumberValue = ''
  public value: StrNumberValue = ''

  constructor(value: StrNumberType = 0) {
    Object.defineProperties(this, {
      [privateValueKey]: {
        enumerable: false,
        configurable: false
      },
      /**
       * 对value属性的存值做格式校验
       */
      value: {
        enumerable: true,
        configurable: false,
        set: (val: StrNumberType) => {
          val = formatNumber(val)
          this[privateValueKey] = val
        },
        get: (): StrNumberValue => {
          return checkNumber(this[privateValueKey])
        }
      }
    })
    Object.defineProperties(StrNumber, {
      POSITIVE_INFINITY: { writable: false, configurable: false },
      NEGATIVE_INFINITY: { writable: false, configurable: false },
      NaN: { writable: false, configurable: false }
    })

    this.value = value as any
  }

  private calc(
    calcMethod:
      | typeof StrNumber.add
      | typeof StrNumber.minus
      | typeof StrNumber.times
      | typeof StrNumber.into,
    ...value: StrNumberType[]
  ): StrNumber {
    let res: ReturnType<
      typeof StrNumber.add | typeof StrNumber.minus | typeof StrNumber.times | typeof StrNumber.into
    > = this.value

    if (!value.length) return new StrNumber(res)

    value.forEach((v) => {
      res = calcMethod(res, v)
    })
    return new StrNumber(res)
  }

  /**
   * 加
   */
  public add(...value: StrNumberType[]): StrNumber {
    return this.calc(StrNumber.add, ...value)
  }

  /**
   * 减
   */
  public minus(...value: StrNumberType[]): StrNumber {
    return this.calc(StrNumber.minus, ...value)
  }

  /**
   * 乘
   */
  public times(...value: StrNumberType[]): StrNumber {
    return this.calc(StrNumber.times, ...value)
  }

  /**
   * 除
   */
  public into(...value: StrNumberType[]): StrNumber {
    return this.calc(StrNumber.into, ...value)
  }

  /**
   * 小于
   */
  isLessThan(value: StrNumberType): boolean {
    return StrNumber.aIsLessThanB(this.value, formatNumber(value))
  }

  /**
   * 等于
   */
  isEqualTo(value: StrNumberType): boolean {
    return StrNumber.aIsEqualToB(this, value)
  }

  /**
   * 大于
   */
  isMoreThan(value: StrNumberType): boolean {
    return StrNumber.aIsMoreThanB(this, value)
  }

  /**
   * 保留固定小数位数
   * @param digits 小数位数
   */
  public toFixed(digits: number): string {
    return StrNumber.toFixed(this.value, digits)
  }
}

Object.defineProperties(StrNumber.prototype, {
  // 用于Object.toString()方法检测
  [Symbol.toStringTag]: {
    value: 'StrNumber',
    writable: false,
    configurable: false,
    enumerable: false
  },
  // 支持原生String方法转换字符串
  toString: {
    value: function (): string {
      if (this.value === StrNumber.POSITIVE_INFINITY) return 'Infinity'
      if (this.value === StrNumber.NEGATIVE_INFINITY) return '-Infinity'
      if (this.value === StrNumber.NaN) return 'NaN'
      return this.value as string
    },
    writable: false,
    configurable: false,
    enumerable: false
  },
  // 原始值转换为数字
  valueOf: {
    value: function (): number {
      if (this.value === StrNumber.POSITIVE_INFINITY) return Number.POSITIVE_INFINITY
      if (this.value === StrNumber.NEGATIVE_INFINITY) return Number.NEGATIVE_INFINITY
      if (this.value === StrNumber.NaN) return NaN
      return Number(this.value as string)
    },
    writable: false,
    configurable: false,
    enumerable: false
  }
})

export default StrNumber
