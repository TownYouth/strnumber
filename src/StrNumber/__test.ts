import StrNumber from './index'

function getARandomNumber(maxIntLength = 10) {
  const flag = Math.random() > 0.5 ? '' : '-' // 正负符号
  const intlength = Math.floor(Math.random() * (maxIntLength + 16)) // 整数位数
  return flag + Math.random() * Math.pow(10, intlength)
}

function test(count: number, type: 'times' | 'into' | 'add' | 'minus' | 'toFixed') {
  let w = 0
  let e = 0
  for (let i = 0; i < count; i++) {
    if (type === 'toFixed') {
      const a = getARandomNumber(100)
      const fixed = Math.floor(Math.random() * 10)
      const JS = Number(a).toFixed(fixed)
      const My = new StrNumber(a).toFixed(fixed)
      // JS !== My && console[JS !== My ? 'error' : 'log']('toFixed', a, fixed, JS, My, My.length-1)

      Number(JS) - Number(My) &&
        console.warn(
          `toFixed[${++w}]`,
          a,
          fixed,
          JS,
          My,
          (/(?<=-?)(\d+)(?=\.?)/.exec(String(My))?.[1]?.length || 0) - 1
        )
      Number(JS) - Number(My) > 0.0001 &&
        console.error(
          `toFixed[${++e}]`,
          a,
          fixed,
          JS,
          My,
          (/(?<=-?)(\d+)(?=\.?)/.exec(String(My))?.[1]?.length || 0) - 1
        )
    } else if (type === 'add') {
      const a = getARandomNumber(100)
      const b = getARandomNumber(100)
      const JS = String(Number(a) + Number(b))
      const My = new StrNumber(a).add(b).value
      // JS !== My &&
      //   console[JS !== My ? (JS.includes(My) ? 'warn' : 'error') : 'log']('add', a, b, JS, My, My.length-1)

      Number(JS) - Number(My) &&
        console.warn(
          `add[${++w}]`,
          a,
          b,
          '\n',
          '它的结果：',
          JS,
          '\n',
          '我的结果：',
          My,
          (/(?<=-?)(\d+)(?=\.?)/.exec(String(My))?.[1]?.length || 0) - 1
        )
      Number(JS) - Number(My) > 0.0001 &&
        console.error(
          `add[${++e}]`,
          a,
          b,
          '\n',
          '它的结果：',
          JS,
          '\n',
          '我的结果：',
          My,
          (/(?<=-?)(\d+)(?=\.?)/.exec(String(My))?.[1]?.length || 0) - 1
        )
    } else if (type === 'minus') {
      const a = getARandomNumber(100)
      const b = getARandomNumber(100)
      const JS = String(Number(a) - Number(b))
      const My = new StrNumber(a).minus(b).value
      // JS !== My &&
      //   console[JS !== My ? (JS.includes(My) ? 'warn' : 'error') : 'log']('minus', a, b, JS, My, My.length-1)
      Number(JS) - Number(My) &&
        console.warn(
          `minus[${++w}]`,
          a,
          b,
          '\n',
          '它的结果：',
          JS,
          '\n',
          '我的结果：',
          My,
          (/(?<=-?)(\d+)(?=\.?)/.exec(String(My))?.[1]?.length || 0) - 1
        )
      Number(JS) - Number(My) > 0.0001 &&
        console.error(
          `minus[${++e}]`,
          a,
          b,
          '\n',
          '它的结果：',
          JS,
          '\n',
          '我的结果：',
          My,
          (/(?<=-?)(\d+)(?=\.?)/.exec(String(My))?.[1]?.length || 0) - 1
        )
    } else if (type === 'times') {
      const a = getARandomNumber(100)
      const b = getARandomNumber(100)
      const JS = String(Number(a) * Number(b))
      const My = new StrNumber(a).times(b).value
      // JS !== My &&
      //   console[JS !== My ? (JS.includes(My) ? 'warn' : 'error') : 'log']('times', a, b, JS, My, My.length-1)
      Number(JS) - Number(My) &&
        console.warn(
          `times[${++w}]`,
          a,
          b,
          '\n',
          '它的结果：',
          JS,
          '\n',
          '我的结果：',
          My,
          (/(?<=-?)(\d+)(?=\.?)/.exec(String(My))?.[1]?.length || 0) - 1
        )
      Number(JS) - Number(My) > 0.01 &&
        console.error(
          `times[${++e}]`,
          a,
          b,
          '\n',
          '它的结果：',
          JS,
          '\n',
          '我的结果：',
          My,
          (/(?<=-?)(\d+)(?=\.?)/.exec(String(My))?.[1]?.length || 0) - 1
        )
    } else if (type === 'into') {
      const a = getARandomNumber(100)
      const b = getARandomNumber(100)
      const JS = String(Number(a) / Number(b))
      const My = new StrNumber(a).into(b).value
      // JS !== My &&
      //   console[JS !== My ? (JS.includes(My) ? 'warn' : 'error') : 'log']('into', a, b, JS, My, My.length-1)
      Number(JS) - Number(My) &&
        console.warn(
          `into[${++w}]`,
          a,
          b,
          '\n',
          '它的结果：',
          JS,
          '\n',
          '我的结果：',
          My,
          (/(?<=-?)(\d+)(?=\.?)/.exec(String(My))?.[1]?.length || 0) - 1
        )
      Number(JS) - Number(My) > 0.01 &&
        console.error(
          `into[${++e}]`,
          a,
          b,
          '\n',
          '它的结果：',
          JS,
          '\n',
          '我的结果：',
          My,
          (/(?<=-?)(\d+)(?=\.?)/.exec(String(My))?.[1]?.length || 0) - 1
        )
    }
  }

  // 验证无穷等特殊值计算
  function arrange<T>(arr: T[], k: number): T[][] {
    if (k === 0) return [[]] // 当 k 为 0 时，返回包含一个空数组的数组，表示没有元素的组合
    if (arr.length < k) return [] // 如果数组长度小于 k，则无法选出 k 个元素，返回空数组

    const result = []
    for (let i = 0; i < arr.length; i++) {
      // 取出当前元素
      const current = arr[i]
      // 生成剩余数组
      const remaining = arr.slice(i + 1)
      // 递归生成从剩余数组中选出 k-1 个元素的组合
      const combs = arrange(remaining, k - 1)
      // 将当前元素添加到每个组合中
      for (const comb of combs) {
        result.push([current].concat(comb))
      }
    }
    return result
  }
  function combine<T>(arr: T[], k: number): T[][] {
    let result: T[][] = arrange(arr, k)
    result = result.concat(result.map(([a, b]) => [b, a])).concat(arr.map((item) => [item, item]))
    return result
  }

  const number = {
    PI: Number.POSITIVE_INFINITY,
    NI: Number.NEGATIVE_INFINITY,
    P0: 0,
    N0: -0,
    NaN
  }
  const strnumber = {
    PI: StrNumber.POSITIVE_INFINITY,
    NI: StrNumber.NEGATIVE_INFINITY,
    P0: '0',
    N0: '-0',
    NaN: StrNumber.NaN
  }

  function isSame(num: any, strnum: any) {
    const numKey = Object.keys(number).find((key) =>
      Object.is(number[key as keyof typeof number], num)
    )
    const strnumKey = Object.keys(strnumber).find(
      (key) => strnumber[key as keyof typeof strnumber] === strnum
    )
    if (!numKey || !strnumKey) return false
    return numKey === strnumKey
  }

  combine(Object.keys(number), 2).forEach(([a, b]) => {
    const numA = number[a as keyof typeof number]
    const numB = number[b as keyof typeof number]
    const strnumA = strnumber[a as keyof typeof strnumber]
    const strnumB = strnumber[b as keyof typeof strnumber]

    const numHe = numA + numB
    const strnumHe = StrNumber.add(strnumA, strnumB)

    const numCha = numA - numB
    const strnumCha = StrNumber.minus(strnumA, strnumB)

    const numCheng = numA * numB
    const strnumCheng = StrNumber.times(strnumA, strnumB)

    const numChu = numA / numB
    const strnumChu = StrNumber.into(strnumA, strnumB)

    console[isSame(numHe, strnumHe) ? 'log' : 'error'](
      '【加】a:',
      numA,
      'b:',
      numB,
      '原生结果：',
      numHe,
      'StrNumber结果：',
      strnumHe
    )
    console[isSame(numCha, strnumCha) ? 'log' : 'error'](
      '【减】a:',
      numA,
      'b:',
      numB,
      '原生结果：',
      numCha,
      'StrNumber结果：',
      strnumCha
    )
    console[isSame(numCheng, strnumCheng) ? 'log' : 'error'](
      '【乘】a:',
      numA,
      'b:',
      numB,
      '原生结果：',
      numCheng,
      'StrNumber结果：',
      strnumCheng
    )
    console[isSame(numChu, strnumChu) ? 'log' : 'error'](
      '【除】a:',
      numA,
      'b:',
      numB,
      '原生结果：',
      numChu,
      'StrNumber结果：',
      strnumChu
    )
  })
}

// @ts-ignore
window.test = test

// @ts-ignore
window.testCalc = () => {
  const now = Date.now()
  const str =
    '123456789123456798.123456789*465564415644135465465/13246541234654564641654564576864654*(1465456465416546546+51465456415648465416541456798464654.112315464132154)*54564564564657446546546546546'
  // eslint-disable-next-line no-eval
  console.log(eval(str), StrNumber.calc(str), Date.now() - now)
}

// @ts-ignore TODO: TEST_CODE
window.StrNumber = StrNumber
