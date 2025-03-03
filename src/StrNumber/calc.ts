import { onCalc, onPrioritizeRequirements, parseNesting } from './parseFormulas'
import StrNumberFlag from './StrNumberFlag'
import { sliceListPadStart, slicingNumber } from './utils'

/**
 * 数字验证正则
 * exec[1] 为数字本身
 * exec[2] 为科学计数法指数(如有)
 */
const NumberRegex = /^((?:\+|-)?(?:0|[1-9]\d*)(?:\.\d+)?)(?:e\+([1-9]\w*))?/

/** 正无穷 */
export const POSITIVE_INFINITY = new StrNumberFlag('Infinity')

/** 负无穷 */
export const NEGATIVE_INFINITY = new StrNumberFlag('-Infinity')

/** 不存在的数字 */
export const _NaN = new StrNumberFlag('NaN')

/**
 * 计算两数之和
 */
export const add = function (a: StrNumberType, b: StrNumberType): StrNumberValue {
  const SLICE_LENGTH = 15 // 计算数字切割长度
  const RADIX = Number(scientificNotation2Number('1', SLICE_LENGTH))

  // 参数归一化
  a = formatNumber(a)
  b = formatNumber(b)

  // 处理NaN计算
  if (_isNaN(a) || _isNaN(b)) {
    return _NaN
  }

  // 处理无穷计算
  if (_isInfinite(a) || _isInfinite(b)) {
    if (_isInfinite(a) && _isInfinite(b)) {
      return a === b ? a : _NaN
    }
    return _isInfinite(a) ? a : b
  }

  // 根据符号选择计算方式
  const isLessThan0A = isNegativeNumber(a)
  const isLessThan0B = isNegativeNumber(b)

  if (isLessThan0A && isLessThan0B) {
    return '-' + (add(abs(a), abs(b)) as string) // 断言这一步不会出现无穷
  }
  if (isLessThan0A || isLessThan0B) {
    return minus(abs(isLessThan0A ? b : a), abs(isLessThan0A ? a : b))
  }

  // 浮点数处理为整数计算，计算完成再还原
  const floatA = a.split('.')[1] || ''
  const floatB = b.split('.')[1] || ''
  const e = Math.max(floatA.length, floatB.length)

  a = scientificNotation2Number(a, e)
  b = scientificNotation2Number(b, e)

  let aSlice = slicingNumber(a, SLICE_LENGTH)
  let bSlice = slicingNumber(b, SLICE_LENGTH)

  // 补齐位数
  const maxLength = Math.max(aSlice.length, bSlice.length)

  aSlice = sliceListPadStart(aSlice, maxLength, 0)
  bSlice = sliceListPadStart(bSlice, maxLength, 0)

  // 开始计算
  let jin = 0
  const resArr = []
  for (let index = maxLength - 1; index >= 0; index--) {
    const _a = aSlice[index]
    const _b = bSlice[index]
    const _sum = _a + _b + jin
    jin = Math.floor(_sum / RADIX)
    resArr.unshift(String(_sum % RADIX).padStart(SLICE_LENGTH, '0'))
  }
  jin && resArr.unshift(jin)

  const res = scientificNotation2Number(resArr.join(''), e * -1)

  return checkNumber(res)
}

/**
 * 计算两数之差
 */
export const minus = function (a: StrNumberType, b: StrNumberType): StrNumberValue {
  const SLICE_LENGTH = 15 // 计算数字切割长度
  const RADIX = Number(scientificNotation2Number('1', SLICE_LENGTH))

  // 参数归一化
  a = formatNumber(a)
  b = formatNumber(b)

  // 处理NaN计算
  if (_isNaN(a) || _isNaN(b)) {
    return _NaN
  }

  const isLessThan0A = isNegativeNumber(a)
  const isLessThan0B = isNegativeNumber(b)

  // 处理无穷计算
  if (_isInfinite(a) || _isInfinite(b)) {
    if (_isInfinite(a) && _isInfinite(b)) {
      return a === b ? _NaN : a
    }
    if (_isInfinite(a)) return a
    if (_isInfinite(b)) {
      return isLessThan0B ? POSITIVE_INFINITY : NEGATIVE_INFINITY
    }
  }

  // 处理0计算
  if (aIsEqualToB(a, 0) && aIsEqualToB(b, 0)) {
    if (isLessThan0A && !isLessThan0B) {
      return '-0'
    }
    return '0'
  }

  // 根据符号选择计算方式
  if (isLessThan0A) {
    return ('-' + (add(abs(a), b) as string)) // 断言这一步不会出现无穷
      .replace(/^--/, '')
      .replace(/^-0$/, '0')
  }
  if (isLessThan0B) {
    return add(a, abs(b))
  }

  if (aIsLessThanB(a, b)) {
    return '-' + (minus(b, a) as string) // 断言这一步不会出现无穷
  }

  // 浮点数处理为整数计算，计算完成再还原
  const floatA = a.split('.')[1] || ''
  const floatB = b.split('.')[1] || ''
  const e = Math.max(floatA.length, floatB.length)

  a = scientificNotation2Number(a, e)
  b = scientificNotation2Number(b, e)

  let aSlice = slicingNumber(a, SLICE_LENGTH)
  let bSlice = slicingNumber(b, SLICE_LENGTH)

  // 补齐位数
  const maxLength = Math.max(aSlice.length, bSlice.length)

  aSlice = sliceListPadStart(aSlice, maxLength, 0)
  bSlice = sliceListPadStart(bSlice, maxLength, 0)

  // 开始计算
  let jie = 0
  const resArr = []
  for (let index = maxLength - 1; index >= 0; index--) {
    const _a = aSlice[index] - jie
    const _b = bSlice[index]
    jie = _a < _b ? 1 : 0
    const _sum = _a + jie * RADIX - _b
    resArr.unshift(String(_sum % RADIX).padStart(SLICE_LENGTH, '0'))
  }

  const res = scientificNotation2Number(resArr.join(''), e * -1)
  return checkNumber(res)
}

/**
 * 计算两数之积
 */
export const times = function (a: StrNumberType, b: StrNumberType): StrNumberValue {
  const SLICE_LENGTH = 7 // 计算数字切割长度

  // 参数归一化
  a = formatNumber(a)
  b = formatNumber(b)

  // 处理NaN计算
  if (_isNaN(a) || _isNaN(b)) {
    return _NaN
  }

  // 处理无穷计算
  if (_isInfinite(a) || _isInfinite(b)) {
    if (_isInfinite(a) && _isInfinite(b)) {
      return a === b ? POSITIVE_INFINITY : NEGATIVE_INFINITY
    }
    if (aIsEqualToB(a, 0) || aIsEqualToB(b, 0)) return _NaN
    return _isInfinite(a) ? a : b
  }

  // 确定计算结果正负号
  const isLessThan0A = isNegativeNumber(a)
  const isLessThan0B = isNegativeNumber(b)

  let flag = '' // 正负号
  if (isLessThan0A === !isLessThan0B) flag = '-'

  // 确定符号后绝对值参加计算，断言此时不会出现无穷
  a = abs(a) as string
  b = abs(b) as string

  // 浮点数处理为整数计算，计算完成再还原
  const floatA = a.split('.')[1] || ''
  const floatB = b.split('.')[1] || ''
  const eA = floatA.length
  const eB = floatB.length

  a = scientificNotation2Number(a, eA)
  b = scientificNotation2Number(b, eB)

  // 切割数字
  const aSlice = slicingNumber(a, SLICE_LENGTH)
  const bSlice = slicingNumber(b, SLICE_LENGTH)

  // 开始计算
  let res = '0'
  for (let indexA = 0; indexA < aSlice.length; indexA++) {
    const _eA = (aSlice.length - 1 - indexA) * SLICE_LENGTH
    const _a: number = Number(aSlice[indexA])
    for (let indexB = 0; indexB < bSlice.length; indexB++) {
      const _eB = (bSlice.length - 1 - indexB) * SLICE_LENGTH
      const _b: number = Number(bSlice[indexB])
      res = add(res, scientificNotation2Number(String(_a * _b), _eA + _eB)) as string
    }
  }

  return checkNumber(flag + scientificNotation2Number(res, (eA + eB) * -1))
}

/**
 * 计算两数之商
 */
export const into = function (a: StrNumberType, b: StrNumberType): StrNumberValue {
  const MAX_FLOAD_LENGTH = 100 // 商的最大小数位数

  // 参数归一化
  a = formatNumber(a)
  b = formatNumber(b)

  // 处理NaN计算
  if (_isNaN(a) || _isNaN(b)) {
    return _NaN
  }

  // 确定计算结果正负号
  const isLessThan0A = isNegativeNumber(a)
  const isLessThan0B = isNegativeNumber(b)

  let flag = '' // 正负号
  if (isLessThan0A === !isLessThan0B) flag = '-'

  // 处理无穷计算
  if (_isInfinite(a) || _isInfinite(b)) {
    if (_isInfinite(a) && _isInfinite(b)) {
      return _NaN
    }
    if (_isInfinite(a)) {
      return flag ? NEGATIVE_INFINITY : POSITIVE_INFINITY
    }
    return flag + '0' // b为无穷
  }

  // 处理0计算
  if (aIsEqualToB(b, 0)) {
    if (aIsEqualToB(a, 0)) {
      return _NaN
    }
    return flag ? NEGATIVE_INFINITY : POSITIVE_INFINITY
  }

  // 确定符号后绝对值参加计算，断言此时不会出现无穷
  a = abs(a) as string
  b = abs(b) as string

  // 浮点数处理为整数计算，计算完成再还原
  const floatA = a.split('.')[1] || ''
  const floatB = b.split('.')[1] || ''
  const maxE = Math.max(floatA.length, floatB.length)

  a = scientificNotation2Number(a, maxE)
  const aList = a.split('')
  b = scientificNotation2Number(b, maxE)

  // 开始计算
  let res = ''
  let parent = aList.shift() as string
  let jie = 0
  while (aList.length || (jie < MAX_FLOAD_LENGTH + 1 && checkNumber(parent) !== '0')) {
    if (aIsLessThanB(parent, b)) {
      res += '0'
    } else {
      let shang = 0
      while (!aIsLessThanB(parent, times(b, shang + 1))) {
        shang++
      }
      res += String(shang)
      parent = minus(parent, times(b, shang)) as string
    }
    if (aList.length) {
      parent += aList.shift()
    } else {
      parent += 0
      jie++
    }
  }

  res = flag + scientificNotation2Number(checkNumber(res) as string, (jie - 1) * -1) // jie - 1是因为最后多借了一次

  // 超出最大长度的小数需要四舍五入
  const floatLength = (res.split('.')[1] || '').length
  if (floatLength > MAX_FLOAD_LENGTH) {
    res = toFixed(res, MAX_FLOAD_LENGTH)
  }

  return res
}

export const calc = function (str: string) {
  const nestingNode = parseNesting(str)
  const calcStructure = onPrioritizeRequirements(nestingNode)
  return onCalc(calcStructure, calcMethodMap)
}

const calcMethodMap = {
  '+': add,
  '-': minus,
  '*': times,
  '/': into
}

/**
 * 指定小数位数，超出四舍五入，不足补0
 */
export const toFixed = function (value: StrNumberType, digits: number): string {
  if (digits < 0) throw new Error('digits must be greater than or equal to 0')
  value = formatNumber(value)

  // 处理NaN计算
  if (_isNaN(value)) return 'NaN'

  // 处理无穷计算
  if (_isInfinite(value)) return 'Infinity'

  const isLessThan0 = isNegativeNumber(value)
  const flag = isLessThan0 ? '-' : '' // 符号位

  value = abs(value) as string // 断言此时不会出现无穷

  const [int, float = ''] = value.split('.')
  const floatLong = float.padEnd(digits + 1, '0').slice(0, digits + 1)
  const floatShort = float.padEnd(digits + 1, '0').slice(0, digits)
  const ru = Array.from({ length: floatLong.length }).fill('0')
  ru[ru.length - 1] = minus(10, floatLong[floatLong.length - 1])

  if (aIsMoreThanB(ru[ru.length - 1] as string, 5)) {
    return `${flag}${int}.${floatShort}`.replace(/\.$/, '')
  }
  const ruStr = `0.${ru.join('')}`
  const valueLong = `${int}.${floatLong}`
  let fixedRes = add(valueLong, ruStr) as string // 断言此时不会出现无穷
  const [resInt, resFloat = ''] = fixedRes.split('.')
  fixedRes = resInt + '.' + resFloat.padEnd(digits + 1, '0').slice(0, digits)
  return flag + fixedRes.replace(/\.$/, '')
}

/**
 * 判断数值是否是无限的
 */
export const _isInfinite = function (
  value: StrNumberType
): value is typeof NEGATIVE_INFINITY | typeof POSITIVE_INFINITY {
  value === Number.POSITIVE_INFINITY && (value = POSITIVE_INFINITY)
  value === Number.NEGATIVE_INFINITY && (value = NEGATIVE_INFINITY)
  return [POSITIVE_INFINITY, NEGATIVE_INFINITY].includes(value as StrNumberFlag)
}

/**
 * 判断数值是否是有限的
 */
export const _isFinite = function (value: StrNumberType): value is string {
  if (_isNaN(value)) {
    return false
  }
  return !_isInfinite(value)
}

/**
 * 判断数值是否是NaN
 */
export const _isNaN = function (value: StrNumberType): value is typeof _NaN {
  return Object.is(_NaN, value)
}

/**
 * 数字字符串格式化
 * 用于外传参数归一化
 */
export const formatNumber = function (value: StrNumberType): StrNumberValue {
  if (Object.prototype.toString.call(value) === '[object StrNumber]') {
    return (<any>value).value
  }

  if (typeof value === 'number') {
    if (Number.isNaN(value)) return _NaN
    if (value === Number.POSITIVE_INFINITY) return POSITIVE_INFINITY
    if (value === Number.NEGATIVE_INFINITY) return NEGATIVE_INFINITY

    // 处理正负0
    if (value === 0) {
      return Number.POSITIVE_INFINITY / value === Number.POSITIVE_INFINITY ? '0' : '-0'
    }

    value = String(value)
  }

  if (typeof value === 'string') {
    value = value.replace(/^0+(?=\d)/, '')
  }

  if (_isInfinite(value)) return value

  if (_isNaN(value)) return _NaN

  const _val = NumberRegex.exec(value as string)
  if (!_val) return typeof _NaN

  const e = Number(_val[2] || 0)
  value = _val[1]

  value = scientificNotation2Number(value, e)
  return value
}

/**
 * 数字字符串格式化
 * 用于内部数字合规化
 */
export const checkNumber = function (value: StrNumberValue): StrNumberValue {
  if (_isNaN(value)) return value
  if (_isInfinite(value)) return value
  return value.replace(/((^0+(?!(\.|$)))|(\.0+$)|((?<=\.[1-9]+)0+$))/g, '')
}

/**
 * 将科学计数法还原为数字
 */
const scientificNotation2Number = function (value: string, e: number): string {
  if (e === 0) return value

  let [int, float = ''] = value.split('.')
  if (e < 0) {
    e = Math.abs(e)
    int = int.padStart(e + 1, '0')
    int = int.slice(0, int.length - e) + '.' + int.slice(int.length - e)
  } else {
    float = float.padEnd(e, '0')
    float = float.slice(0, e) + '.' + float.slice(e)
  }

  let _val = int + float
  _val = _val.replace(/^0(?!\.)/, '').replace(/\.$/, '')
  return checkNumber(_val) as string
}

const abs = function (value: StrNumberValue): StrNumberValue {
  if (value instanceof StrNumberFlag) return value
  return value.replace(/^-|\+/, '')
}

/**
 * 判断是否为负数
 */
const isNegativeNumber = function (value: StrNumberValue) {
  if (value === NEGATIVE_INFINITY) return true
  if (value === POSITIVE_INFINITY) return false

  return /^-/.test(value as string)
}

/**
 * 判断A是否小于B
 */
export const aIsLessThanB = function (a: StrNumberType, b: StrNumberType): boolean {
  a = formatNumber(a)
  b = formatNumber(b)

  // 处理NaN计算
  if (_isNaN(a) || _isNaN(b)) {
    return false
  }
  // 处理无穷计算
  if (_isInfinite(a) || _isInfinite(b)) {
    if (_isInfinite(a) && _isInfinite(b)) {
      return a === NEGATIVE_INFINITY && a !== b
    }
    if (_isInfinite(a)) {
      return a === NEGATIVE_INFINITY
    }
    if (_isInfinite(b)) {
      return b === POSITIVE_INFINITY
    }
  }

  const isLessThan0A = isNegativeNumber(a)
  const isLessThan0B = isNegativeNumber(b)

  if (isLessThan0A && isLessThan0B) {
    return aIsLessThanB(abs(b), abs(a))
  }
  if (isLessThan0A || isLessThan0B) {
    return isLessThan0A
  }

  let [intA, floatA = ''] = a.split('.')
  let [intB, floatB = ''] = b.split('.')
  const maxIntLength = Math.max(intA.length, intB.length)
  const maxFloatLength = Math.max(floatA.length, floatB.length)

  intA = intA.padStart(maxIntLength, '0')
  intB = intB.padStart(maxIntLength, '0')
  floatA = floatA.padEnd(maxFloatLength, '0')
  floatB = floatB.padEnd(maxFloatLength, '0')

  const AList = Array.from(intA).concat(Array.from(floatA))
  const BList = Array.from(intB).concat(Array.from(floatB))

  for (let i = 0; i < AList.length; i++) {
    const a = Number(AList[i])
    const b = Number(BList[i])

    if (a !== b) {
      return a < b
    }
  }
  return false
}

/**
 * 判断A是否等于B
 */
export const aIsEqualToB = function (a: StrNumberType, b: StrNumberType) {
  a = formatNumber(a)
  b = formatNumber(b)

  // 处理NaN计算
  if (_isNaN(a) || _isNaN(b)) {
    return false
  }

  typeof a === 'string' && (a = a.replace(/^-0$/, '0'))
  typeof b === 'string' && (b = b.replace(/^-0$/, '0'))

  return checkNumber(a) === checkNumber(b)
}

/**
 * 判断A是否大于B
 */
export const aIsMoreThanB = function (a: StrNumberType, b: StrNumberType) {
  return !aIsEqualToB(a, b) && !aIsLessThanB(a, b)
}

// window.runTest = function () {
//   const numberArr = Array.from({ length: 200 }, (_, i) => i - 100)

//   for (const num1 of numberArr) {
//     for (const num2 of numberArr) {
//       // {
//       //   // +
//       //   const res = add(num1, num2)
//       //   const valid = String(num1 + num2)
//       //   if (res !== valid) {
//       //     console.error(`add(${num1} + ${num2}, ${valid})`, res)
//       //   }
//       // }
//       // {
//       //   // -
//       //   const res = minus(num1, num2)
//       //   const valid = String(num1 - num2)
//       //   if (res !== valid) {
//       //     console.error(`minus(${num1} - ${num2}, ${valid})`, res)
//       //   }
//       // }
//       // {
//       //   // *
//       //   const res = times(num1, num2)
//       //   const valid = String(num1 * num2)
//       //   if (res !== valid) {
//       //     console.error(`times(${num1} * ${num2}, ${valid})`, res)
//       //   }
//       // }
//       // {
//       //   // /
//       //   const res = into(num1 * num2, num2)
//       //   const valid = String(num1)
//       //   if (res !== valid) {
//       //     console.error(`into(${num1} * ${num2} / ${num2}, ${valid})`, res)
//       //   }
//       // }
//     }
//   }
//   console.log('done')
// }
