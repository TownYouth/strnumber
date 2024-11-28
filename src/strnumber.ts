import _StrNumber from './StrNumber/index'

type strNumberFunc = typeof _StrNumber & {
  (value: StrNumberType): _StrNumber
}
export const strNumber: strNumberFunc = function (value: StrNumberType) {
  return new _StrNumber(value)
} as any

for (const key in _StrNumber) {
  if (Object.prototype.hasOwnProperty.call(_StrNumber, key)) {
    // @ts-ignore
    strNumber[key] = _StrNumber[key]
  }
}

export const StrNumber = _StrNumber

export default strNumber
