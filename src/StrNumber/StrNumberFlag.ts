/**
 * StrNumber标记类
 * 由于Symbol不能被直接转换成字符串，所以需要使用标记类
 */
class StrNumberFlag {
  value: symbol = Symbol('none')
  constructor(describe: string) {
    Object.defineProperties(this, {
      value: {
        enumerable: true,
        writable: false,
        configurable: false,
        value: Symbol(describe)
      }
    })
  }

  public toString() {
    return this.value.description
  }
}

export default StrNumberFlag
