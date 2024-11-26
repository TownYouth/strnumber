/**
 * 切割字符串数字(整数)为数字元素数组
 * @description
 * 计算过程中，将大数切割成js能计算的数字长度
 * 充分利用js的计算能力，减少循环次数
 * js的安全计算数字最大支持16位，所以为全面覆盖计算面，乘法切割为7位，加减切割为15位
 * @param value 整数
 * @param length 切割长度
 */
export function slicingNumber(value: string, length = 7) {
  return value
    .replace(new RegExp(`(?=(\\d{${length}})+\\b)`, 'g'), ',')
    .split(',')
    .map((item) => Number(item))
}

/**
 * 数组不足位前置补充元素
 * 相当于字符串的padStart方法
 */
export function sliceListPadStart<T>(list: Array<T>, length: number, item: T) {
  return [...Array(Math.max(0, length - list.length)).fill(item), ...list]
}

interface CacheResultInterface {
  <P extends Array<unknown>, R>(callback: (...args: P) => R): (...args: P) => R
  pool: Map<Function, Record<string, any>>
  /** 上一次缓存的时间戳 */
  lastStamp: number
  /** 缓存过期时间 */
  expirationDate: number
}
/**
 * 用于缓存函数执行结果
 */
export const cacheResult: CacheResultInterface = function <P extends Array<unknown>, R>(
  callback: (...args: P) => R
): (...args: P) => R {
  if (!cacheResult.pool.has(callback)) {
    cacheResult.pool.set(callback, {})
  }
  const cache = cacheResult.pool.get(callback) as Record<string, any>
  return function (this: any, ...args: P) {
    // 超过期限清除缓存
    if (Date.now() - cacheResult.lastStamp > cacheResult.expirationDate) {
      cacheResult.pool.forEach((item) => {
        for (const key in item) {
          delete item[key]
        }
      })
      cacheResult.lastStamp = Date.now()
    }

    const key = args.join('_')
    if (!cache[key]) {
      cache[key] = callback.apply(this, args)
    }
    return cache[key]
  }
} as any
cacheResult.pool = new Map()
cacheResult.expirationDate = 60 * 1000
cacheResult.lastStamp = 0
// @ts-ignore
window.cacheResult = cacheResult
