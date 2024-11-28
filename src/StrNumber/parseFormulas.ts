/* eslint-disable no-use-before-define */
class NestingNode {
  parent: NestingNode | null
  children: (NestingNode | string)[] = ['']
  constructor(parent: NestingNode | null) {
    this.parent = parent
  }

  toString() {
    if (!this.parent) return '[0]'
    return `[${this.parent.children.findIndex((item) => item === this)}]`
  }
}

/**
 * 分解公式括号嵌套关系
 */
export function parseNesting(str: string) {
  str.replace(/\s/g, '')
  if (typeof str !== 'string') throw new Error('参数类型错误')

  str = str.replace(/\s/g, '')
  if (!validateNestingStr(str)) throw new Error('参数格式错误')

  const rootNode = new NestingNode(null)
  let currentNode = rootNode
  for (let index = 0; index < str.length; index++) {
    const char = str[index]

    if (char === '(') {
      const _currentNode = new NestingNode(currentNode)
      currentNode.children.push(_currentNode)
      currentNode = _currentNode
      continue
    }
    if (char === ')') {
      currentNode.children = currentNode.children.filter(Boolean)
      if (currentNode.parent) {
        currentNode = currentNode.parent
        currentNode.children.push('')
      }
      continue
    }
    currentNode.children[currentNode.children.length - 1] += char
  }

  rootNode.children = rootNode.children.filter(Boolean)

  return rootNode
}

/**
 * 验证公式的格式
 */
function validateNestingStr(str: string) {
  if (/[^.+\-*/0-9e()]+/.test(str)) return false // 只允许出现 数字、运算符、小数点、括号
  if (/\d\(|\)\d/.test(str)) return false // 不能出现数字和括号相邻
  if (/[+\-*/](?=[+\-*/])/.test(str)) return false // 不能出现运算符号相邻
  if (/(?<=\()[+\-*/]|[+\-*/](?=\))/.test(str)) return false // 不能出现 +)或(+
  if (str.includes('e') && !/(?<=\d)e(?=[+-]\d+)/g.test(str)) return false // 验证科学计数法格式
  return true
}

interface Calc {
  left: string | Calc
  right: string | Calc
  method: '+' | '-' | '*' | '/'
}

/**
 * 分解计算优先级层级
 */
export function onPrioritizeRequirements(
  node: string | NestingNode,
  children: NestingNode['children'] = []
): Calc | string {
  if (node instanceof NestingNode) {
    return onPrioritizeRequirements(node.children.join(''), node.children)
  }

  const low = /(.*)((?<!e)(?:\+|-))(.*)/.exec(node) // 加减 低优先级
  const high = /(.*)(\*|\/)(.+)/.exec(node) // 乘除 高优先级
  if (low) {
    return {
      left: onPrioritizeRequirements(low[1], children),
      right: onPrioritizeRequirements(low[3], children),
      method: low[2] as Calc['method']
    }
  }
  if (high) {
    return {
      left: onPrioritizeRequirements(high[1], children),
      right: onPrioritizeRequirements(high[3], children),
      method: high[2] as Calc['method']
    }
  }

  const index = /\[(\d+)\]/.exec(node)
  if (index) {
    return onPrioritizeRequirements(children[Number(index[1])])
  }

  return node
}

export function onCalc(
  calc: Calc | string,
  calcMethodMap: Record<Calc['method'], Function>
): StrNumberValue {
  if (typeof calc === 'string') return calc
  return calcMethodMap[calc.method](
    onCalc(calc.left, calcMethodMap),
    onCalc(calc.right, calcMethodMap)
  )
}
